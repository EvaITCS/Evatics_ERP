variable "project" {
  type = string
}

variable "env" {
  type = string
}

variable "admin_temp_username" {
  description = "Initial temp-admin login (email) - matches ADMIN_TEMP_USERNAME / AdminInitializer"
  type        = string
  default     = "admin@evaitcs.com"
}

variable "recovery_window_in_days" {
  description = "Secrets Manager deletion recovery window. 0 disables recovery (immediate delete) - useful for dev to avoid name collisions on recreate."
  type        = number
  default     = 7
}