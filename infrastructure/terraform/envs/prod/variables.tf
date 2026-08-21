# All variables here can be overridden without editing files via
# TF_VAR_<name> environment variables - this is how CI (terraform.yml)
# injects project/region/environment rather than hardcoding them.

variable "project" {
  description = "Short project name, used to namespace every resource. Override via TF_VAR_project."
  type        = string
  default     = "lms-erp"
}

variable "environment" {
  description = "Environment name. Override via TF_VAR_environment."
  type        = string
  default     = "prod"
}

variable "region" {
  description = "AWS region. Override via TF_VAR_region."
  type        = string
  default     = "us-east-1"
}

variable "vpc_cidr" {
  type    = string
  default = "10.1.0.0/16"
}

variable "az_count" {
  type    = number
  default = 2
}

variable "nat_gateway_count" {
  description = "1 = single shared NAT (cost-optimized). Bump to az_count for per-AZ HA egress."
  type        = number
  default     = 1
}

variable "db_name" {
  type    = string
  default = "lms_erp"
}

variable "db_user" {
  type    = string
  default = "lms_erp_app"
}

variable "db_instance_class" {
  type    = string
  default = "db.t4g.small"
}

variable "db_allocated_storage" {
  type    = number
  default = 50
}

variable "db_multi_az" {
  description = "Off by default to control cost - flip to true for HA once traffic justifies it"
  type        = bool
  default     = false
}

variable "db_backup_retention_period" {
  type    = number
  default = 7
}

variable "db_skip_final_snapshot" {
  type    = bool
  default = false
}

variable "db_deletion_protection" {
  type    = bool
  default = true
}

variable "admin_temp_username" {
  description = "Initial temp-admin login email - matches ADMIN_TEMP_USERNAME / AdminInitializer"
  type        = string
  default     = "admin@evaitcs.com"
}

variable "backend_image_tag" {
  description = "Tag in the backend ECR repo to deploy. \"bootstrap\" is a placeholder for the very first apply - real deploys are driven by backend-deploy.yml (the ecs_service module ignores task_definition drift from later terraform applies)."
  type        = string
  default     = "bootstrap"
}

variable "frontend_image_tag" {
  type    = string
  default = "bootstrap"
}

variable "backend_cpu" {
  type    = number
  default = 1024
}

variable "backend_memory" {
  type    = number
  default = 2048
}

variable "backend_desired_count" {
  type    = number
  default = 2
}

variable "backend_enable_autoscaling" {
  type    = bool
  default = true
}

variable "frontend_cpu" {
  type    = number
  default = 256
}

variable "frontend_memory" {
  type    = number
  default = 512
}

variable "frontend_desired_count" {
  type    = number
  default = 2
}

variable "frontend_enable_autoscaling" {
  type    = bool
  default = false
}