# One-time bootstrap: remote state storage for every env under ../envs/*.
#
# This is a separate root module (not part of envs/*) because the S3
# bucket/DynamoDB table it creates must exist *before* envs/dev and
# envs/prod can point their own `backend "s3"` block at them. Apply this
# once per AWS account with local state, note the outputs, then never
# touch it from CI.
#
#   cd infrastructure/terraform/bootstrap
#   terraform init
#   terraform apply -var="project=lms-erp"

terraform {
  required_version = ">= 1.7"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = var.region
}

variable "project" {
  description = "Short project name, used to namespace bucket/table names. Override via TF_VAR_project."
  type        = string
  default     = "lms-erp"
}

variable "region" {
  description = "AWS region the state backend lives in. Override via TF_VAR_region."
  type        = string
  default     = "us-east-1"
}

variable "github_org" {
  description = "GitHub org/user that owns the repo, for OIDC trust. Override via TF_VAR_github_org."
  type        = string
  default     = "EvaITCS"
}

variable "github_repo" {
  description = "GitHub repo name, for OIDC trust. Override via TF_VAR_github_repo."
  type        = string
  default     = "lms-erp"
}

module "github_oidc" {
  source = "../modules/github_oidc"

  project     = var.project
  github_org  = var.github_org
  github_repo = var.github_repo
}

# ECR repos are account-wide, not per-env: an image is built once (by
# backend-deploy.yml/frontend-deploy.yml) and the same tag is deployed to
# dev then promoted to prod, rather than maintaining separate registries
# per environment. envs/dev and envs/prod look these up by name via a
# data source instead of re-declaring them.
module "ecr" {
  source = "../modules/ecr"

  project = var.project
}

resource "aws_s3_bucket" "state" {
  bucket = "${var.project}-terraform-state"

  # Terraform state files contain secrets in plaintext (DB passwords,
  # JWT secret, etc. flow through resource attributes) - never allow
  # this bucket to be destroyed by accident.
  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_versioning" "state" {
  bucket = aws_s3_bucket.state.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "state" {
  bucket = aws_s3_bucket.state.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "state" {
  bucket = aws_s3_bucket.state.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_dynamodb_table" "lock" {
  name         = "${var.project}-terraform-locks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}

output "state_bucket" {
  value = aws_s3_bucket.state.id
}

output "lock_table" {
  value = aws_dynamodb_table.lock.name
}

output "github_terraform_role_arn" {
  value = module.github_oidc.terraform_role_arn
}

output "github_deploy_role_arn" {
  value = module.github_oidc.deploy_role_arn
}

output "ecr_repository_urls" {
  value = module.ecr.repository_urls
}