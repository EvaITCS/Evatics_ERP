locals {
  name = "${var.project}-${var.env}"
  tags = {
    Project     = var.project
    Environment = var.env
    ManagedBy   = "terraform"
  }
}

# name is suffixed by public/private on purpose: RDS's ModifyDBSubnetGroup
# API refuses to drop a subnet that the instance's ENI is actively placed in
# ("Some of the subnets to be deleted are currently in use"), so mutating
# this group's subnet_ids in place (same name) fails once the instance is
# running. Changing the name instead makes Terraform create a *new* subnet
# group and repoint aws_db_instance.this.db_subnet_group_name at it -
# ModifyDBInstance with a different (valid, non-conflicting) subnet group is
# the AWS-supported way to relocate an instance to different subnets.
# create_before_destroy so the new group exists - and the instance is
# repointed to it - before the old, still-referenced group is destroyed.
resource "aws_db_subnet_group" "this" {
  name       = "${local.name}-db-${var.publicly_accessible ? "public" : "private"}"
  subnet_ids = var.subnet_ids

  tags = merge(local.tags, { Name = "${local.name}-db" })

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_security_group" "db" {
  name        = "${local.name}-db"
  description = "Allow MySQL from the backend ECS service only"
  vpc_id      = var.vpc_id

  tags = merge(local.tags, { Name = "${local.name}-db" })
}

resource "aws_vpc_security_group_ingress_rule" "mysql_from_backend" {
  for_each = toset(var.allowed_security_group_ids)

  security_group_id            = aws_security_group.db.id
  referenced_security_group_id = each.value
  from_port                    = 3306
  to_port                      = 3306
  ip_protocol                  = "tcp"
}

resource "aws_vpc_security_group_egress_rule" "all" {
  security_group_id = aws_security_group.db.id
  ip_protocol       = "-1"
  cidr_ipv4         = "0.0.0.0/0"
}

# Empty on purpose: this SG exists so a developer can add their own IP as an
# ingress rule out-of-band (console or `aws ec2 authorize-security-group-ingress`)
# without touching the aws_security_group.db resource above, and without
# `terraform apply` ever reverting it - this module declares no
# aws_vpc_security_group_ingress_rule for this group, so Terraform has no
# opinion on whatever rules get added to it by hand. Remove the manually-added
# rule again when you're done; the group itself is harmless to leave attached.
resource "aws_security_group" "developer_access" {
  count = var.enable_developer_access_sg ? 1 : 0

  name        = "${local.name}-developer-access"
  description = "Ad-hoc developer access to RDS - add/remove your own IP manually, Terraform does not manage ingress rules on this group"
  vpc_id      = var.vpc_id

  tags = merge(local.tags, { Name = "${local.name}-developer-access" })
}

# MySQL 8.4 major-version parameters. ddl-auto=validate on the app side
# means Flyway (not Hibernate) owns schema changes here.
resource "aws_db_parameter_group" "this" {
  name   = "${local.name}-mysql84"
  family = "mysql8.4"

  tags = local.tags
}

resource "aws_db_instance" "this" {
  identifier = "${local.name}-mysql"

  engine         = "mysql"
  engine_version = var.engine_version

  instance_class    = var.instance_class
  allocated_storage = var.allocated_storage
  storage_type      = "gp3"
  storage_encrypted = true

  db_name  = var.database_name
  username = var.database_user
  password = var.database_password
  port     = 3306

  db_subnet_group_name = aws_db_subnet_group.this.name
  vpc_security_group_ids = concat(
    [aws_security_group.db.id],
    var.enable_developer_access_sg ? [aws_security_group.developer_access[0].id] : []
  )
  parameter_group_name = aws_db_parameter_group.this.name

  multi_az                  = var.multi_az
  backup_retention_period   = var.backup_retention_period
  deletion_protection       = var.deletion_protection
  skip_final_snapshot       = var.skip_final_snapshot
  final_snapshot_identifier = var.skip_final_snapshot ? null : "${local.name}-mysql-final"

  auto_minor_version_upgrade = true
  publicly_accessible        = var.publicly_accessible

  tags = local.tags
}