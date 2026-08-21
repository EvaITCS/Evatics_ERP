output "endpoint" {
  description = "host:port"
  value       = aws_db_instance.this.endpoint
}

output "address" {
  description = "host only, no port"
  value       = aws_db_instance.this.address
}

output "port" {
  value = aws_db_instance.this.port
}

output "database_name" {
  value = aws_db_instance.this.db_name
}

output "security_group_id" {
  value = aws_security_group.db.id
}

output "developer_access_security_group_id" {
  description = "Null unless enable_developer_access_sg=true. Add your own IP to this group's ingress manually - Terraform never manages its rules."
  value       = var.enable_developer_access_sg ? aws_security_group.developer_access[0].id : null
}