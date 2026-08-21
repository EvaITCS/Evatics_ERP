variable "project" {
  description = "Short project name, used to prefix repo names"
  type        = string
}

variable "repo_names" {
  description = "Suffixes for the repos to create, e.g. [\"backend\", \"frontend\"] -> <project>-backend, <project>-frontend"
  type        = list(string)
  default     = ["backend", "frontend"]
}

variable "untagged_image_expiry_days" {
  description = "Days after which untagged images are expired by the lifecycle policy"
  type        = number
  default     = 14
}

variable "tagged_image_keep_count" {
  description = "Number of most recent tagged images to retain per repo"
  type        = number
  default     = 20
}