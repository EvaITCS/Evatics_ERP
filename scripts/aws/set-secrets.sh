#!/usr/bin/env bash
# Pushes real third-party credentials into Secrets Manager, read from the
# repo root .env, for a given environment.
#
# Terraform (modules/secrets) creates the mail-username/mail-password
# secrets with a placeholder value and `lifecycle { ignore_changes =
# [secret_string] }` deliberately - it never writes real Gmail credentials
# into state or tfvars. This script is the "set the real value" step
# documented in documentation/DEPLOYMENT.md, without typing the
# `aws secretsmanager put-secret-value` commands by hand each time.
#
# Everything else in Secrets Manager (db-password, jwt-secret,
# admin-temp-password) is Terraform-generated (random_password) and
# intentionally NOT settable here - there's no "real" external value for
# those, and overwriting them out-of-band would just drift them from state.
#
# Usage:
#   ./scripts/aws/set-secrets.sh [OPTIONS] <dev|prod>
#
# Options:
#   --project PROJ  Override TF_VAR_project
#   --region REG    Override AWS_REGION
#   --dry-run       Print aws commands without executing them
#   --help          Show this help message
#
# Requires MAIL_USERNAME and MAIL_PASSWORD in the repo root .env (copy from
# .env.example if you haven't already).

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./lib.sh
source "${SCRIPT_DIR}/lib.sh"

ENV_NAME=""
DRY_RUN=false
PROJECT_NAME="${PROJECT_NAME:-}"
AWS_REGION="${AWS_REGION:-}"

show_help() { sed -n '2,/^set -euo/p' "$0" | sed '$d' | sed 's/^# \?//'; exit 0; }

while [ $# -gt 0 ]; do
  case "$1" in
    --project) PROJECT_NAME="$2"; shift 2 ;;
    --region)  AWS_REGION="$2"; shift 2 ;;
    --dry-run) DRY_RUN=true; shift ;;
    --help)    show_help ;;
    -*)
      print_error "Unknown option: $1"
      show_help
      ;;
    *)
      ENV_NAME="$1"
      shift
      ;;
  esac
done

is_valid_env "$ENV_NAME" || { print_error "Usage: $(basename "$0") [OPTIONS] <dev|prod>"; exit 1; }

require_cmds aws

load_root_env
resolve_aws_context

require_env MAIL_USERNAME "Set it in the repo root .env."
require_env MAIL_PASSWORD "Set it in the repo root .env."

put_secret() {
  local name="$1" value="$2"
  if [ "$DRY_RUN" = true ]; then
    echo "[DRY-RUN] aws secretsmanager put-secret-value --secret-id ${PROJECT_NAME}/${ENV_NAME}/${name} --secret-string '<redacted>'"
    return 0
  fi
  aws secretsmanager put-secret-value \
    --region "$AWS_REGION" \
    --secret-id "${PROJECT_NAME}/${ENV_NAME}/${name}" \
    --secret-string "$value" \
    --query 'VersionId' --output text >/dev/null
  print_success "Updated ${PROJECT_NAME}/${ENV_NAME}/${name}"
}

put_secret "mail-username" "$MAIL_USERNAME"
put_secret "mail-password" "$MAIL_PASSWORD"

echo ""
print_info "Done. The backend ECS service picks this up on its next task restart -"
print_info "run ./scripts/aws/deploy-service.sh --env ${ENV_NAME} backend to force one now."
