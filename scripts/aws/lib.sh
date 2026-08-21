#!/usr/bin/env bash
# Shared helpers for the scripts in this directory. Not meant to be run
# directly - sourced by set-secrets.sh/build-images.sh/deploy-service.sh.
#
# These scripts are the manual/local equivalent of
# .github/workflows/{terraform,backend-deploy,frontend-deploy}.yml - same
# naming conventions and AWS API calls, run from your own machine with your
# own AWS credentials instead of via GitHub Actions OIDC. Useful for a
# one-off deploy, or when debugging what CI would do.

set -euo pipefail

# AWS CLI v2 pipes any command with table/json output through a pager
# (less) by default. That fails outright on a machine without `less`
# installed, and is pure noise for a script anyway - every `aws` call in
# these scripts should just print and return.
export AWS_PAGER=""

# ── Colors ───────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
print_info()    { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error()   { echo -e "${RED}[ERROR]${NC} $1" >&2; }

# ── Dependency / arg checks ─────────────────────────────────────────────────

# require_cmds docker jq aws ...
require_cmds() {
  local missing=()
  for cmd in "$@"; do
    command -v "$cmd" >/dev/null 2>&1 || missing+=("$cmd")
  done
  if [ "${#missing[@]}" -gt 0 ]; then
    print_error "missing required command(s): ${missing[*]}"
    for cmd in "${missing[@]}"; do
      case "$cmd" in
        aws)    print_error "  - aws: install with ./scripts/aws/install/<linux|mac|windows>.*" ;;
        jq)     print_error "  - jq: install with your package manager, e.g. apt install jq / brew install jq / choco install jq" ;;
        docker) print_error "  - docker: install Docker Desktop (mac/windows) or docker-ce (linux)" ;;
        *)      print_error "  - ${cmd}: no install hint available" ;;
      esac
    done
    exit 1
  fi
}

# require_env VAR_NAME "hint for how to set it"
require_env() {
  local var="$1" hint="${2:-}"
  if [ -z "${!var:-}" ]; then
    print_error "\$${var} is not set.${hint:+ ${hint}}"
    exit 1
  fi
}

is_valid_env() { [[ "$1" == "dev" || "$1" == "prod" ]]; }
is_known_service() { [[ "$1" == "backend" || "$1" == "frontend" ]]; }

# ── Env loading / AWS context ────────────────────────────────────────────────

# Sources the repo root .env (see .env.example) into the current shell,
# without clobbering anything already exported (e.g. if you already
# `source`d it yourself, or CI set these directly). Every var it sets is
# exported (`set -a`), matching the manual `set -a && source .env && set +a`
# convention documented in infrastructure/terraform/README.md.
load_root_env() {
  local root
  root="$(git rev-parse --show-toplevel)"
  if [ -f "${root}/.env" ]; then
    set -a
    # shellcheck disable=SC1091
    source "${root}/.env"
    set +a
  fi
}

# Resolves PROJECT_NAME/AWS_REGION/AWS_ACCOUNT_ID from the environment
# (root .env sets TF_VAR_project/TF_VAR_region; AWS_ACCOUNT_ID is looked up
# live via STS if not already set) and exports them for the calling script.
# Values already set (e.g. by --project/--region flags) are left alone.
resolve_aws_context() {
  PROJECT_NAME="${PROJECT_NAME:-${TF_VAR_project:-lms-erp}}"
  AWS_REGION="${AWS_REGION:-${TF_VAR_region:-us-east-1}}"
  if [ -z "${AWS_ACCOUNT_ID:-}" ]; then
    AWS_ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
  fi
  export PROJECT_NAME AWS_REGION AWS_ACCOUNT_ID
}

ecr_registry() {
  echo "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
}

ecr_login() {
  aws ecr get-login-password --region "$AWS_REGION" \
    | docker login --username AWS --password-stdin "$(ecr_registry)"
}

# ── Dry-run wrapper ───────────────────────────────────────────────────────
# Expects the calling script to set DRY_RUN=true/false.
run_cmd() {
  if [ "${DRY_RUN:-false}" = true ]; then
    echo "[DRY-RUN] $*"
  else
    "$@"
  fi
}

# ── ECS rolling deploy ─────────────────────────────────────────────────────
#
# deploy_task_definition <family> <cluster> <service> <container_name> <image_uri>
#
# Downloads the current task definition, swaps in the new image, registers
# a new revision, and updates the service to it. This is the same
# describe -> edit -> register -> update-service flow
# aws-actions/amazon-ecs-render-task-definition +
# aws-actions/amazon-ecs-deploy-task-definition do in CI - done by hand here
# with jq, since there's no GitHub Action to lean on locally.
#
# describe-task-definition returns several fields register-task-definition
# doesn't accept as input (taskDefinitionArn, revision, status,
# requiresAttributes, compatibilities, registeredAt, registeredBy) - those
# are stripped before registering, or the API rejects the whole call.
#
# Only the image is touched - env vars, secrets, cpu/memory, and IAM roles
# stay exactly as Terraform set them. Unlike a Cloud Run-style deploy script,
# there's no "--full-config" bootstrap mode here: modules/ecs_service always
# registers a complete task definition (even on the very first `terraform
# apply`, with a placeholder image tag - see envs/*/variables.tf), so this
# helper only ever needs to patch one field, never assemble the rest from
# scratch.
deploy_task_definition() {
  local family="$1" cluster="$2" service="$3" container_name="$4" image_uri="$5"

  print_info "Fetching current task definition for ${family}..."
  local current
  current="$(aws ecs describe-task-definition --task-definition "$family" --query taskDefinition)"

  local new_def
  new_def="$(echo "$current" | jq --arg image "$image_uri" --arg name "$container_name" '
    (.containerDefinitions[] | select(.name == $name) | .image) = $image
    | del(.taskDefinitionArn, .revision, .status, .requiresAttributes, .compatibilities, .registeredAt, .registeredBy)
  ')"

  if [ "${DRY_RUN:-false}" = true ]; then
    echo "[DRY-RUN] aws ecs register-task-definition --cli-input-json '<${family} with image=${image_uri}>'"
    echo "[DRY-RUN] aws ecs update-service --cluster ${cluster} --service ${service} --task-definition <new revision> --force-new-deployment"
    return 0
  fi

  print_info "Registering new task definition revision..."
  local new_arn
  new_arn="$(aws ecs register-task-definition --cli-input-json "$new_def" --query 'taskDefinition.taskDefinitionArn' --output text)"
  print_info "Registered: ${new_arn}"

  print_info "Updating service ${service} on cluster ${cluster}..."
  aws ecs update-service \
    --cluster "$cluster" \
    --service "$service" \
    --task-definition "$new_arn" \
    --force-new-deployment \
    --query 'service.{status:status,desired:desiredCount,running:runningCount}'

  print_info "Waiting for the service to reach a stable state (this can take a few minutes)..."
  aws ecs wait services-stable --cluster "$cluster" --services "$service"
  print_success "${service} is stable on ${new_arn}."
}
