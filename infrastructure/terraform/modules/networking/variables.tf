variable "project" {
  description = "Short project name, used to prefix/tag resources"
  type        = string
}

variable "env" {
  description = "Environment name (dev, prod)"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
}

variable "az_count" {
  description = "Number of availability zones to spread subnets across"
  type        = number
  default     = 2
}

variable "nat_gateway_count" {
  description = "Number of NAT gateways. 1 = single shared NAT (cheaper, single point of failure for egress). Set equal to az_count for per-AZ HA."
  type        = number
  default     = 1
}