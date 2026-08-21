output "db_password" {
  value     = random_password.db.result
  sensitive = true
}

output "db_password_secret_arn" {
  value = aws_secretsmanager_secret.db_password.arn
}

output "jwt_secret_arn" {
  value = aws_secretsmanager_secret.jwt_secret.arn
}

output "admin_temp_username_secret_arn" {
  value = aws_secretsmanager_secret.admin_temp_username.arn
}

output "admin_temp_password_secret_arn" {
  value = aws_secretsmanager_secret.admin_temp_password.arn
}

output "mail_username_secret_arn" {
  value = aws_secretsmanager_secret.mail_username.arn
}

output "mail_password_secret_arn" {
  value = aws_secretsmanager_secret.mail_password.arn
}

# All secret ARNs, handy for building the execution role's IAM policy
# without listing each one at the call site.
output "all_secret_arns" {
  value = [
    aws_secretsmanager_secret.db_password.arn,
    aws_secretsmanager_secret.jwt_secret.arn,
    aws_secretsmanager_secret.admin_temp_username.arn,
    aws_secretsmanager_secret.admin_temp_password.arn,
    aws_secretsmanager_secret.mail_username.arn,
    aws_secretsmanager_secret.mail_password.arn,
  ]
}