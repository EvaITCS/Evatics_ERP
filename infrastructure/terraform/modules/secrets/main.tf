# Secrets Manager entries consumed by the backend ECS task's `secrets`
# block (see modules/ecs_service). Two kinds:
#
#  1. Generated (db_password, jwt_secret): Terraform creates a random value
#     and stores it - it never appears typed anywhere, including tfvars.
#  2. External (mail creds, admin temp password): Terraform creates the
#     secret *shell* with a placeholder value and then ignores further
#     changes to secret_string, because the real value (a Gmail app
#     password, etc.) is supplied out-of-band via:
#       aws secretsmanager put-secret-value \
#         --secret-id <name> --secret-string '<value>'
#     This keeps real third-party credentials out of both git and TF state
#     diffs after the initial apply.

locals {
  name_prefix = "${var.project}/${var.env}"
  tags = {
    Project     = var.project
    Environment = var.env
    ManagedBy   = "terraform"
  }
}

resource "random_password" "db" {
  length  = 32
  special = false
}

resource "random_password" "jwt" {
  length  = 64
  special = false
}

resource "random_password" "admin_temp" {
  length  = 20
  special = false
}

resource "aws_secretsmanager_secret" "db_password" {
  name                    = "${local.name_prefix}/db-password"
  recovery_window_in_days = var.recovery_window_in_days
  tags                    = local.tags
}

resource "aws_secretsmanager_secret_version" "db_password" {
  secret_id     = aws_secretsmanager_secret.db_password.id
  secret_string = random_password.db.result
}

resource "aws_secretsmanager_secret" "jwt_secret" {
  name                    = "${local.name_prefix}/jwt-secret"
  recovery_window_in_days = var.recovery_window_in_days
  tags                    = local.tags
}

resource "aws_secretsmanager_secret_version" "jwt_secret" {
  secret_id     = aws_secretsmanager_secret.jwt_secret.id
  secret_string = random_password.jwt.result
}

resource "aws_secretsmanager_secret" "admin_temp_username" {
  name                    = "${local.name_prefix}/admin-temp-username"
  recovery_window_in_days = var.recovery_window_in_days
  tags                    = local.tags
}

resource "aws_secretsmanager_secret_version" "admin_temp_username" {
  secret_id     = aws_secretsmanager_secret.admin_temp_username.id
  secret_string = var.admin_temp_username
}

resource "aws_secretsmanager_secret" "admin_temp_password" {
  name                    = "${local.name_prefix}/admin-temp-password"
  recovery_window_in_days = var.recovery_window_in_days
  tags                    = local.tags
}

resource "aws_secretsmanager_secret_version" "admin_temp_password" {
  secret_id     = aws_secretsmanager_secret.admin_temp_password.id
  secret_string = random_password.admin_temp.result
}

resource "aws_secretsmanager_secret" "mail_username" {
  name                    = "${local.name_prefix}/mail-username"
  recovery_window_in_days = var.recovery_window_in_days
  tags                    = local.tags

  lifecycle {
    ignore_changes = [tags]
  }
}

resource "aws_secretsmanager_secret_version" "mail_username" {
  secret_id     = aws_secretsmanager_secret.mail_username.id
  secret_string = "CHANGE_ME"

  lifecycle {
    ignore_changes = [secret_string]
  }
}

resource "aws_secretsmanager_secret" "mail_password" {
  name                    = "${local.name_prefix}/mail-password"
  recovery_window_in_days = var.recovery_window_in_days
  tags                    = local.tags
}

resource "aws_secretsmanager_secret_version" "mail_password" {
  secret_id     = aws_secretsmanager_secret.mail_password.id
  secret_string = "CHANGE_ME"

  lifecycle {
    ignore_changes = [secret_string]
  }
}