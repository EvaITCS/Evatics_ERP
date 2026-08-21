#!/usr/bin/env bash
# Installs Terraform for Linux (amd64/arm64) by downloading the official
# HashiCorp release zip and verifying its SHA256SUMS signature.
#
# Usage:
#   ./scripts/terraform/install/linux.sh [version] [install_dir]
#
# Defaults: version 1.7.5 (matches infrastructure/terraform/*/versions.tf
# and .github/workflows/terraform.yml), install_dir /usr/local/bin.
set -euo pipefail

VERSION="${1:-1.7.5}"
INSTALL_DIR="${2:-/usr/local/bin}"

case "$(uname -m)" in
  x86_64) ARCH="amd64" ;;
  aarch64|arm64) ARCH="arm64" ;;
  *) echo "Unsupported architecture: $(uname -m)" >&2; exit 1 ;;
esac

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

ZIP="terraform_${VERSION}_linux_${ARCH}.zip"
BASE_URL="https://releases.hashicorp.com/terraform/${VERSION}"

echo "Downloading Terraform ${VERSION} (linux/${ARCH})..."
curl -fsSL -o "${TMP_DIR}/${ZIP}" "${BASE_URL}/${ZIP}"
curl -fsSL -o "${TMP_DIR}/SHA256SUMS" "${BASE_URL}/terraform_${VERSION}_SHA256SUMS"

echo "Verifying checksum..."
(cd "$TMP_DIR" && grep "  ${ZIP}\$" SHA256SUMS | sha256sum -c -)

unzip -oq "${TMP_DIR}/${ZIP}" -d "$TMP_DIR"

if [ -w "$INSTALL_DIR" ]; then
  install -m 0755 "${TMP_DIR}/terraform" "${INSTALL_DIR}/terraform"
else
  echo "No write access to ${INSTALL_DIR}, using sudo..."
  sudo install -m 0755 "${TMP_DIR}/terraform" "${INSTALL_DIR}/terraform"
fi

echo "Installed: $("${INSTALL_DIR}/terraform" version | head -n1)"
