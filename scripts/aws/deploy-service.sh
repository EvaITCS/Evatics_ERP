#!/usr/bin/env bash
# Deploy backend/frontend services to ECS (Fargate).
#
# Rolling update only: this registers a new task definition revision with
# the given image and updates the ECS service to it. Everything else (env
# vars, secrets, cpu/memory, IAM roles, autoscaling) is managed by
# Terraform and left untouched. Unlike a Cloud Run-style deploy script,
# there's no --full-config bootstrap mode - modules/ecs_service always
# registers a complete task definition, even on the very first `terraform
# apply` (with a placeholder image tag), so there's never a "missing
# config" state for this script to fill in.
#
# Images must already be pushed to ECR - see build-images.sh, or use
# --tag to point at a tag pushed some other way (e.g. by CI).
#
# Usage:
#   ./scripts/aws/deploy-service.sh [OPTIONS] [SERVICE...]
#
# Options:
#   --tag TAG       Image tag to deploy (default: git short SHA; frontend appends -<env>)
#   --env ENV       dev or prod (default: dev)
#   --project PROJ  Override TF_VAR_project
#   --region REG    Override AWS_REGION
#   --dry-run       Print aws commands without executing them
#   --help          Show this help message
#
# Services (default: all):
#   backend
#   frontend
#
# Examples:
#   ./scripts/aws/deploy-service.sh --env dev                     # deploy both to dev
#   ./scripts/aws/deploy-service.sh --env dev backend               # single service
#   ./scripts/aws/deploy-service.sh --env prod --tag v1.2.3 backend # deploy a specific tag

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./lib.sh
source "${SCRIPT_DIR}/lib.sh"

ALL_SERVICES=(backend frontend)
SERVICES_TO_DEPLOY=()

TAG=""
ENV_NAME="dev"
DRY_RUN=false
PROJECT_NAME="${PROJECT_NAME:-}"
AWS_REGION="${AWS_REGION:-}"

show_help() { sed -n '2,/^set -euo/p' "$0" | sed '$d' | sed 's/^# \?//'; exit 0; }

while [ $# -gt 0 ]; do
  case "$1" in
    --tag)      TAG="$2"; shift 2 ;;
    --env)      ENV_NAME="$2"; shift 2 ;;
    --project)  PROJECT_NAME="$2"; shift 2 ;;
    --region)   AWS_REGION="$2"; shift 2 ;;
    --dry-run)  DRY_RUN=true; shift ;;
    --help)     show_help ;;
    -*)
      print_error "Unknown option: $1"
      show_help
      ;;
    *)
      if is_known_service "$1"; then
        SERVICES_TO_DEPLOY+=("$1")
      else
        print_error "Unknown service: $1"
        print_info "Available services: ${ALL_SERVICES[*]}"
        exit 1
      fi
      shift
      ;;
  esac
done

[ "${#SERVICES_TO_DEPLOY[@]}" -eq 0 ] && SERVICES_TO_DEPLOY=("${ALL_SERVICES[@]}")

is_valid_env "$ENV_NAME" || { print_error "--env must be dev or prod, got: ${ENV_NAME}"; exit 1; }

require_cmds aws jq

load_root_env
resolve_aws_context

DEFAULT_TAG="$(git -C "$(git rev-parse --show-toplevel)" rev-parse --short=12 HEAD)"
CLUSTER="${PROJECT_NAME}-${ENV_NAME}"

deploy_backend() {
  local tag="${TAG:-$DEFAULT_TAG}"
  local image
  image="$(ecr_registry)/${PROJECT_NAME}-backend:${tag}"
  deploy_task_definition \
    "${PROJECT_NAME}-${ENV_NAME}-backend" \
    "$CLUSTER" \
    "${PROJECT_NAME}-${ENV_NAME}-backend" \
    "backend" \
    "$image"
}

deploy_frontend() {
  local tag="${TAG:-${DEFAULT_TAG}-${ENV_NAME}}"
  local image
  image="$(ecr_registry)/${PROJECT_NAME}-frontend:${tag}"
  deploy_task_definition \
    "${PROJECT_NAME}-${ENV_NAME}-frontend" \
    "$CLUSTER" \
    "${PROJECT_NAME}-${ENV_NAME}-frontend" \
    "frontend" \
    "$image"
}

print_info "LMS ERP - ECS Deploy"
print_info "Project:  ${PROJECT_NAME}"
print_info "Region:   ${AWS_REGION}"
print_info "Cluster:  ${CLUSTER}"
print_info "Env:      ${ENV_NAME}"
print_info "Services: ${SERVICES_TO_DEPLOY[*]}"
[ "$DRY_RUN" = true ] && print_warning "DRY RUN - no changes will be made"
echo ""

failed=()
for service in "${SERVICES_TO_DEPLOY[@]}"; do
  case "$service" in
    backend)  deploy_backend  || failed+=("$service") ;;
    frontend) deploy_frontend || failed+=("$service") ;;
  esac
  echo ""
done

print_info "Deploy Summary"
echo "=============="
if [ "${#failed[@]}" -eq 0 ]; then
  print_success "All services deployed successfully!"
  exit 0
else
  print_error "Failed: ${failed[*]}"
  exit 1
fi
