# See envs/dev/backend.tf for the rationale (partial config; values
# supplied via -backend-config at init time).
terraform {
  backend "s3" {
    key     = "envs/prod/terraform.tfstate"
    encrypt = true
  }
}