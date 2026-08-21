variable "project" {
  type = string
}

variable "github_org" {
  description = "GitHub org/user that owns the repo"
  type        = string
  default     = "EvaITCS"
}

variable "github_repo" {
  type    = string
  default = "lms-erp"
}