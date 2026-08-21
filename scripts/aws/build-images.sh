#!/usr/bin/env bash
# Build (and optionally push) Docker images for LMS ERP services.
#
# The frontend needs REACT_APP_BACKEND_API_URL baked in at build time (CRA
# inlines REACT_APP_* vars - see lms-frontend/Dockerfile), which differs per
# environment since each env's backend lives behind its own ALB DNS name.
# --env controls which backend URL gets baked in for the frontend build;
# it's irrelevant for backend, which is built once and the same tag is
# promoted across envs (see deploy-service.sh).
#
# Usage:
#   ./scripts/aws/build-images.sh [OPTIONS] [SERVICE...]
#
# Options:
#   --tag TAG       Image tag (default: git short SHA; frontend appends -<env>)
#   --env ENV       dev or prod - only affects frontend's baked-in backend URL (default: dev)
#   --project PROJ  Override TF_VAR_project
#   --region REG    Override AWS_REGION
#   --push          Push to ECR after building (default: build only, local)
#   --dry-run       Print docker/aws commands without executing them
#   --help          Show this help message
#
# Services (default: all):
#   backend
#   frontend
#
# Examples:
#   ./scripts/aws/build-images.sh                       # build both, local only
#   ./scripts/aws/build-images.sh --push backend         # build + push backend
#   ./scripts/aws/build-images.sh --push --env prod frontend

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
# shellcheck source=./lib.sh
source "${SCRIPT_DIR}/lib.sh"

ALL_SERVICES=(backend frontend)
SERVICES_TO_BUILD=()

TAG=""
ENV_NAME="dev"
PUSH=false
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
    --push)     PUSH=true; shift ;;
    --dry-run)  DRY_RUN=true; shift ;;
    --help)     show_help ;;
    -*)
      print_error "Unknown option: $1"
      show_help
      ;;
    *)
      if is_known_service "$1"; then
        SERVICES_TO_BUILD+=("$1")
      else
        print_error "Unknown service: $1"
        print_info "Available services: ${ALL_SERVICES[*]}"
        exit 1
      fi
      shift
      ;;
  esac
done

[ "${#SERVICES_TO_BUILD[@]}" -eq 0 ] && SERVICES_TO_BUILD=("${ALL_SERVICES[@]}")

is_valid_env "$ENV_NAME" || { print_error "--env must be dev or prod, got: ${ENV_NAME}"; exit 1; }

require_cmds docker
[ "$PUSH" = true ] && require_cmds aws

load_root_env
resolve_aws_context

DEFAULT_TAG="$(git -C "$REPO_ROOT" rev-parse --short=12 HEAD)"

build_backend() {
  local tag="${TAG:-$DEFAULT_TAG}"
  local image
  image="$(ecr_registry)/${PROJECT_NAME}-backend:${tag}"

  print_info "Building ${image}..."
  run_cmd docker build -t "$image" "${REPO_ROOT}/backend"

  if [ "$PUSH" = true ]; then
    print_info "Pushing ${image}..."
    run_cmd docker push "$image"
  fi
  print_success "backend: ${image}"
}

build_frontend() {
  local tag="${TAG:-${DEFAULT_TAG}-${ENV_NAME}}"
  local image
  image="$(ecr_registry)/${PROJECT_NAME}-frontend:${tag}"

  print_info "Looking up the ${ENV_NAME} backend ALB DNS name..."
  local backend_dns backend_url
  backend_dns="$(aws elbv2 describe-load-balancers \
    --region "$AWS_REGION" \
    --names "${PROJECT_NAME}-${ENV_NAME}-backend" \
    --query 'LoadBalancers[0].DNSName' --output text 2>/dev/null || true)"

  if [ -z "$backend_dns" ] || [ "$backend_dns" = "None" ]; then
    print_warning "Could not resolve the ${ENV_NAME} backend ALB DNS (has 'terraform apply' run for envs/${ENV_NAME} yet?)."
    print_warning "Building with no REACT_APP_BACKEND_API_URL - the app will fall back to http://localhost:8080 (see src/shared/constants/env.js)."
    backend_url=""
  else
    backend_url="http://${backend_dns}"
    print_info "Backend URL: ${backend_url}"
  fi

  print_info "Building ${image}..."
  run_cmd docker build \
    --build-arg REACT_APP_BACKEND_API_URL="$backend_url" \
    -t "$image" \
    "${REPO_ROOT}/lms-frontend"

  if [ "$PUSH" = true ]; then
    print_info "Pushing ${image}..."
    run_cmd docker push "$image"
  fi
  print_success "frontend: ${image}"
}

if [ "$PUSH" = true ]; then
  print_info "Logging in to ECR..."
  run_cmd ecr_login
fi

failed=()
for service in "${SERVICES_TO_BUILD[@]}"; do
  case "$service" in
    backend)  build_backend  || failed+=("$service") ;;
    frontend) build_frontend || failed+=("$service") ;;
  esac
done

echo ""
if [ "${#failed[@]}" -eq 0 ]; then
  print_success "Done."
  exit 0
else
  print_error "Failed: ${failed[*]}"
  exit 1
fi
