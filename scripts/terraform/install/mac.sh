#!/usr/bin/env bash
# Installs Terraform on macOS. Prefers Homebrew (handles upgrades/uninstall
# cleanly); falls back to a direct download of the official HashiCorp
# release zip, verified against its SHA256SUMS, if Homebrew isn't present.
#
# Usage:
#   ./scripts/terraform/install/mac.sh [version] [install_dir]
#
# Defaults: version 1.7.5 (matches infrastructure/terraform/*/versions.tf
# and .github/workflows/terraform.yml), install_dir /usr/local/bin
# (direct-download fallback only - Homebrew manages its own path).
set -euo pipefail

VERSION="${1:-1.7.5}"
INSTALL_DIR="${2:-/usr/local/bin}"

if command -v brew >/dev/null 2>&1; then
  echo "Homebrew detected - installing Terraform via the official HashiCorp tap."
  brew tap hashicorp/tap
  brew install "hashicorp/tap/terraform"
  echo "Installed: $(terraform version | head -n1)"
  exit 0
fi

echo "Homebrew not found - downloading Terraform ${VERSION} directly."

case "$(uname -m)" in
  x86_64) ARCH="amd64" ;;
  arm64)  ARCH="arm64" ;;
  *) echo "Unsupported architecture: $(uname -m)" >&2; exit 1 ;;
esac

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

ZIP="terraform_${VERSION}_darwin_${ARCH}.zip"
BASE_URL="https://releases.hashicorp.com/terraform/${VERSION}"

curl -fsSL -o "${TMP_DIR}/${ZIP}" "${BASE_URL}/${ZIP}"
curl -fsSL -o "${TMP_DIR}/SHA256SUMS" "${BASE_URL}/terraform_${VERSION}_SHA256SUMS"

echo "Verifying checksum..."
(cd "$TMP_DIR" && grep "  ${ZIP}\$" SHA256SUMS | shasum -a 256 -c -)

unzip -oq "${TMP_DIR}/${ZIP}" -d "$TMP_DIR"

if [ -w "$INSTALL_DIR" ]; then
  install -m 0755 "${TMP_DIR}/terraform" "${INSTALL_DIR}/terraform"
else
  echo "No write access to ${INSTALL_DIR}, using sudo..."
  sudo install -m 0755 "${TMP_DIR}/terraform" "${INSTALL_DIR}/terraform"
fi

echo "Installed: $("${INSTALL_DIR}/terraform" version | head -n1)"
