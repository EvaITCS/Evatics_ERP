# Partial backend config on purpose: the S3 backend block can't reference
# variables, and bucket/table names are project-namespaced (see
# ../../bootstrap). Supply the concrete values at `terraform init` time
# with a backend config file or -backend-config flags, e.g.:
#
#   terraform init -backend-config=backend.hcl
#
# See backend.hcl.example. CI (terraform.yml) generates this from repo
# variables instead of committing a real backend.hcl.
terraform {
  backend "s3" {
    key     = "envs/dev/terraform.tfstate"
    encrypt = true
  }
}