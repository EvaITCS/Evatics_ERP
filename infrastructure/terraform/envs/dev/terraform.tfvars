# Local/default values for `terraform plan`/`apply` run by hand. CI
# overrides project/environment/region via TF_VAR_* env vars instead of
# editing this file - see ../../../.github/workflows/terraform.yml.

project     = "lms-erp"
environment = "dev"
region      = "us-east-1"

vpc_cidr          = "10.0.0.0/16"
az_count          = 2
nat_gateway_count = 1

db_name                    = "lms_erp"
db_user                    = "lms_erp_app"
db_instance_class          = "db.t4g.micro"
db_allocated_storage       = 20
db_multi_az                = false
db_backup_retention_period = 1
db_skip_final_snapshot     = true
db_deletion_protection     = false

# Dev-only: lets a developer add their own IP to the RDS instance's
# developer-access SG (out-of-band, via console/CLI) for local debugging.
# Terraform never manages that SG's ingress rules - see
# infrastructure/terraform/README.md. Leave both false in prod.
db_publicly_accessible        = true
db_enable_developer_access_sg = true

backend_cpu                = 512
backend_memory             = 1024
backend_desired_count      = 1
backend_enable_autoscaling = false

frontend_cpu                = 256
frontend_memory             = 512
frontend_desired_count      = 1
frontend_enable_autoscaling = false