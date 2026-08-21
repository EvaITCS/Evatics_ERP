locals {
  env = var.environment
}

module "networking" {
  source = "../../modules/networking"

  project           = var.project
  env               = local.env
  vpc_cidr          = var.vpc_cidr
  az_count          = var.az_count
  nat_gateway_count = var.nat_gateway_count
}

module "secrets" {
  source = "../../modules/secrets"

  project             = var.project
  env                 = local.env
  admin_temp_username = var.admin_temp_username
}

# ECR repos are created once, account-wide, by ../../bootstrap - look them
# up by the well-known name instead of re-declaring them per env.
data "aws_ecr_repository" "backend" {
  name = "${var.project}-backend"
}

data "aws_ecr_repository" "frontend" {
  name = "${var.project}-frontend"
}

module "rds" {
  source = "../../modules/rds"

  project = var.project
  env     = local.env
  vpc_id  = module.networking.vpc_id

  # Public subnets when db_publicly_accessible is set - RDS's public IP has
  # no route in otherwise, since the private subnets only route outbound via
  # NAT (no inbound path from the internet). The security group is still
  # what actually gates access either way; see infrastructure/terraform/README.md.
  subnet_ids = var.db_publicly_accessible ? module.networking.public_subnet_ids : module.networking.private_subnet_ids

  database_name     = var.db_name
  database_user     = var.db_user
  database_password = module.secrets.db_password

  instance_class          = var.db_instance_class
  allocated_storage       = var.db_allocated_storage
  multi_az                = var.db_multi_az
  backup_retention_period = var.db_backup_retention_period
  skip_final_snapshot     = var.db_skip_final_snapshot
  deletion_protection     = var.db_deletion_protection

  publicly_accessible        = var.db_publicly_accessible
  enable_developer_access_sg = var.db_enable_developer_access_sg

  # NOT wired to the backend service's SG here - see the standalone
  # aws_vpc_security_group_ingress_rule below. Passing it as a module
  # input would create rds -> backend_service -> rds cycle, since the
  # backend service's env vars need module.rds.address.
  allowed_security_group_ids = []
}

# Allow the backend ECS service to reach MySQL. Declared as a standalone
# resource (not an rds module input) specifically to avoid the module
# cycle noted above: this resource depends on both modules, but neither
# module depends on the other.
resource "aws_vpc_security_group_ingress_rule" "backend_to_db" {
  security_group_id            = module.rds.security_group_id
  referenced_security_group_id = module.backend_service.security_group_id
  from_port                    = module.rds.port
  to_port                      = module.rds.port
  ip_protocol                  = "tcp"
}

module "ecs_cluster" {
  source = "../../modules/ecs_cluster"

  project = var.project
  env     = local.env
}

module "backend_alb" {
  source = "../../modules/alb"

  project      = var.project
  env          = local.env
  service_name = "backend"

  vpc_id            = module.networking.vpc_id
  public_subnet_ids = module.networking.public_subnet_ids

  target_port       = 8080
  health_check_path = "/actuator/health"
}

module "frontend_alb" {
  source = "../../modules/alb"

  project      = var.project
  env          = local.env
  service_name = "frontend"

  vpc_id            = module.networking.vpc_id
  public_subnet_ids = module.networking.public_subnet_ids

  target_port       = 80
  health_check_path = "/"
}

module "backend_service" {
  source = "../../modules/ecs_service"

  project      = var.project
  env          = local.env
  service_name = "backend"

  cluster_id   = module.ecs_cluster.cluster_id
  cluster_name = module.ecs_cluster.cluster_name

  vpc_id             = module.networking.vpc_id
  private_subnet_ids = module.networking.private_subnet_ids

  container_image = "${data.aws_ecr_repository.backend.repository_url}:${var.backend_image_tag}"
  container_port  = 8080

  cpu           = var.backend_cpu
  memory        = var.backend_memory
  desired_count = var.backend_desired_count

  alb_security_group_id = module.backend_alb.security_group_id
  target_group_arn      = module.backend_alb.target_group_arn

  health_check_grace_period_seconds = 90

  env_vars = [
    { name = "SPRING_PROFILES_ACTIVE", value = "prod" },
    { name = "DATABASE_HOST", value = module.rds.address },
    { name = "DATABASE_PORT", value = tostring(module.rds.port) },
    { name = "DATABASE_NAME", value = var.db_name },
    { name = "DATABASE_USER", value = var.db_user },
    { name = "SECURITY_CORS_ALLOWED_ORIGINS", value = "http://${module.frontend_alb.dns_name}" },
  ]

  secrets = [
    { name = "DATABASE_PASSWORD", value_from = module.secrets.db_password_secret_arn },
    { name = "JWT_SECRET", value_from = module.secrets.jwt_secret_arn },
    { name = "ADMIN_TEMP_USERNAME", value_from = module.secrets.admin_temp_username_secret_arn },
    { name = "ADMIN_TEMP_PASSWORD", value_from = module.secrets.admin_temp_password_secret_arn },
    { name = "MAIL_USERNAME", value_from = module.secrets.mail_username_secret_arn },
    { name = "MAIL_PASSWORD", value_from = module.secrets.mail_password_secret_arn },
  ]

  enable_autoscaling = var.backend_enable_autoscaling
}

module "frontend_service" {
  source = "../../modules/ecs_service"

  project      = var.project
  env          = local.env
  service_name = "frontend"

  cluster_id   = module.ecs_cluster.cluster_id
  cluster_name = module.ecs_cluster.cluster_name

  vpc_id             = module.networking.vpc_id
  private_subnet_ids = module.networking.private_subnet_ids

  container_image = "${data.aws_ecr_repository.frontend.repository_url}:${var.frontend_image_tag}"
  container_port  = 80

  cpu           = var.frontend_cpu
  memory        = var.frontend_memory
  desired_count = var.frontend_desired_count

  alb_security_group_id = module.frontend_alb.security_group_id
  target_group_arn      = module.frontend_alb.target_group_arn

  health_check_grace_period_seconds = 30

  enable_autoscaling = var.frontend_enable_autoscaling
}