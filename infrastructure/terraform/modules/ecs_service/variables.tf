variable "project" {
  type = string
}

variable "env" {
  type = string
}

variable "service_name" {
  description = "e.g. \"frontend\" or \"backend\" - this module is instantiated once per service"
  type        = string
}

variable "cluster_id" {
  description = "Cluster ARN, passed to the ECS service's `cluster` argument"
  type        = string
}

variable "cluster_name" {
  description = "Cluster name (not ARN) - required for the appautoscaling resource_id format \"service/<cluster-name>/<service-name>\""
  type        = string
}

variable "vpc_id" {
  type = string
}

variable "private_subnet_ids" {
  type = list(string)
}

variable "container_image" {
  description = "Full ECR image URI including tag, e.g. <account>.dkr.ecr.<region>.amazonaws.com/lms-erp-backend:abc123"
  type        = string
}

variable "container_port" {
  type = number
}

variable "cpu" {
  description = "Fargate task CPU units (256 = .25 vCPU)"
  type        = number
  default     = 256
}

variable "memory" {
  description = "Fargate task memory in MB"
  type        = number
  default     = 512
}

variable "desired_count" {
  type    = number
  default = 1
}

variable "alb_security_group_id" {
  description = "SG of the ALB in front of this service - the only allowed ingress source"
  type        = string
}

variable "target_group_arn" {
  type = string
}

variable "env_vars" {
  description = "Plain (non-secret) container environment variables"
  type = list(object({
    name  = string
    value = string
  }))
  default = []
}

variable "secrets" {
  description = "Container env vars sourced from Secrets Manager. value_from is the secret ARN."
  type = list(object({
    name       = string
    value_from = string
  }))
  default = []
}

variable "enable_autoscaling" {
  type    = bool
  default = false
}

variable "autoscaling_min_capacity" {
  type    = number
  default = 1
}

variable "autoscaling_max_capacity" {
  type    = number
  default = 3
}

variable "autoscaling_cpu_target" {
  description = "Target average CPU utilization percent for scale-out/in"
  type        = number
  default     = 70
}

variable "health_check_grace_period_seconds" {
  description = "Time the ECS service ignores failing ALB health checks after a task starts - covers Spring Boot + Flyway migration startup time for the backend"
  type        = number
  default     = 90
}

variable "log_retention_days" {
  type    = number
  default = 30
}