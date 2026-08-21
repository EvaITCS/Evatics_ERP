output "repository_urls" {
  description = "Map of repo suffix (e.g. \"backend\") to full ECR repository URL"
  value       = { for k, v in aws_ecr_repository.this : k => v.repository_url }
}

output "repository_arns" {
  value = { for k, v in aws_ecr_repository.this : k => v.arn }
}