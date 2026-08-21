#!/usr/bin/env bash
# Installs the AWS CLI v2 for Linux (x86_64/aarch64) using the official
# AWS-provided installer bundle.
#
# Usage:
#   ./scripts/aws/install/linux.sh
#
# Re-running this script on a box that already has the CLI installed
# upgrades it in place (--update).
set -euo pipefail

case "$(uname -m)" in
  x86_64) ARCH="x86_64" ;;
  aarch64|arm64) ARCH="aarch64" ;;
  *) echo "Unsupported architecture: $(uname -m)" >&2; exit 1 ;;
esac

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

URL="https://awscli.amazonaws.com/awscli-exe-linux-${ARCH}.zip"

echo "Downloading AWS CLI v2 (linux/${ARCH})..."
curl -fsSL -o "${TMP_DIR}/awscliv2.zip" "$URL"
unzip -oq "${TMP_DIR}/awscliv2.zip" -d "$TMP_DIR"

INSTALL_ARGS=(--install-dir /usr/local/aws-cli --bin-dir /usr/local/bin)
if command -v aws >/dev/null 2>&1; then
  echo "Existing AWS CLI found - updating."
  INSTALL_ARGS+=(--update)
fi

if [ -w /usr/local/bin ]; then
  "${TMP_DIR}/aws/install" "${INSTALL_ARGS[@]}"
else
  echo "No write access to /usr/local, using sudo..."
  sudo "${TMP_DIR}/aws/install" "${INSTALL_ARGS[@]}"
fi

echo "Installed: $(aws --version)"
