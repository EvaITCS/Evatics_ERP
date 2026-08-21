# Local/default values for `terraform plan`/`apply` run by hand. CI
# overrides project/environment/region via TF_VAR_* env vars instead of
# editing this file - see ../../../.github/workflows/terraform.yml.

project     = "lms-erp"
environment = "prod"
region      = "us-east-1"

vpc_cidr          = "10.1.0.0/16"
az_count          = 2
nat_gateway_count = 1

db_name                    = "lms_erp"
db_user                    = "lms_erp_app"
db_instance_class          = "db.t4g.small"
db_allocated_storage       = 50
db_multi_az                = false
db_backup_retention_period = 7
db_skip_final_snapshot     = false
db_deletion_protection     = true

backend_cpu                = 1024
backend_memory             = 2048
backend_desired_count      = 2
backend_enable_autoscaling = true

frontend_cpu                = 256
frontend_memory             = 512
frontend_desired_count      = 2
frontend_enable_autoscaling = false