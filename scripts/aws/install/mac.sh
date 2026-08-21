#!/usr/bin/env bash
# Installs the AWS CLI v2 on macOS. Prefers Homebrew if present; falls back
# to the official AWS .pkg installer (works on both Intel and Apple Silicon
# - it's a universal package) otherwise.
#
# Usage:
#   ./scripts/aws/install/mac.sh
set -euo pipefail

if command -v brew >/dev/null 2>&1; then
  echo "Homebrew detected - installing AWS CLI via awscli cask."
  brew install --cask awscli
  echo "Installed: $(aws --version)"
  exit 0
fi

echo "Homebrew not found - using the official AWS .pkg installer."

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

curl -fsSL -o "${TMP_DIR}/AWSCLIV2.pkg" "https://awscli.amazonaws.com/AWSCLIV2.pkg"
sudo installer -pkg "${TMP_DIR}/AWSCLIV2.pkg" -target /

echo "Installed: $(aws --version)"
