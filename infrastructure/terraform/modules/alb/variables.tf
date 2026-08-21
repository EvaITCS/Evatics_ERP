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

variable "vpc_id" {
  type = string
}

variable "public_subnet_ids" {
  type = list(string)
}

variable "target_port" {
  description = "Container port the target group forwards to (80 for frontend/nginx, 8080 for backend/Spring)"
  type        = number
}

variable "health_check_path" {
  type = string
}

variable "health_check_matcher" {
  description = "Expected HTTP status code(s) from the health check path"
  type        = string
  default     = "200"
}