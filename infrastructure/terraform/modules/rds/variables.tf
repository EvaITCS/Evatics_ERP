variable "project" {
  type = string
}

variable "env" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "subnet_ids" {
  description = "Subnets for the DB subnet group, at least 2 AZs. Normally the private subnets; must be subnets with an internet gateway route if publicly_accessible=true - RDS's public IP has nowhere to route to otherwise (the security group still gates actual access either way)."
  type        = list(string)
}

variable "allowed_security_group_ids" {
  description = "Security groups allowed to reach MySQL on 3306 (the backend ECS service's SG)"
  type        = list(string)
}

variable "database_name" {
  type    = string
  default = "lms_erp"
}

variable "database_user" {
  type    = string
  default = "lms_erp_app"
}

variable "database_password" {
  description = "From modules/secrets random_password output - never a literal here"
  type        = string
  sensitive   = true
}

variable "instance_class" {
  type    = string
  default = "db.t4g.micro"
}

variable "allocated_storage" {
  description = "Storage in GB"
  type        = number
  default     = 20
}

variable "engine_version" {
  description = "MySQL major.minor - matches docker-compose.yml's mysql:8.4.10"
  type        = string
  default     = "8.4"
}

variable "multi_az" {
  type    = bool
  default = false
}

variable "backup_retention_period" {
  description = "Days of automated backups to retain"
  type        = number
  default     = 1
}

variable "skip_final_snapshot" {
  description = "true for dev (fast teardown), false for prod (safety net)"
  type        = bool
  default     = true
}

variable "deletion_protection" {
  type    = bool
  default = false
}

variable "publicly_accessible" {
  description = "Whether the instance gets a publicly resolvable endpoint. Adding an ingress rule to the developer-access SG (see enable_developer_access_sg) does nothing on its own without this also being true - RDS instances with publicly_accessible=false have no route from outside the VPC at all, regardless of security groups. Leave false for prod."
  type        = bool
  default     = false
}

variable "enable_developer_access_sg" {
  description = "Creates an extra, empty security group attached to the instance for ad-hoc developer access. Terraform creates the group but deliberately declares no ingress rules for it - add/remove your own IP via the console or `aws ec2 authorize-security-group-ingress` as needed, and `terraform apply` will never revert that (it doesn't know the rule exists). Intended for dev only - leave false for prod."
  type        = bool
  default     = false
}