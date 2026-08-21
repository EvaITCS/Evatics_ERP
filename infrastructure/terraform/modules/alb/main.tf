# Generic internet-facing ALB, one per service (see the plan's "why two
# ALBs" note: the backend's controller paths aren't uniformly /api/**, so
# a single ALB with path-based routing between frontend/backend would be
# fragile). No HTTPS listener yet - no domain is delegated to AWS, so this
# is plain HTTP on the ALB's own *.elb.amazonaws.com DNS name. Add an ACM
# cert + :443 listener + redirect once a domain exists.

locals {
  name = "${var.project}-${var.env}-${var.service_name}"
  tags = {
    Project     = var.project
    Environment = var.env
    Service     = var.service_name
    ManagedBy   = "terraform"
  }
}

resource "aws_security_group" "alb" {
  name        = "${local.name}-alb"
  description = "Allow inbound HTTP from the internet to the ${var.service_name} ALB"
  vpc_id      = var.vpc_id

  tags = merge(local.tags, { Name = "${local.name}-alb" })
}

resource "aws_vpc_security_group_ingress_rule" "http" {
  security_group_id = aws_security_group.alb.id
  ip_protocol       = "tcp"
  from_port         = 80
  to_port           = 80
  cidr_ipv4         = "0.0.0.0/0"
}

resource "aws_vpc_security_group_egress_rule" "all" {
  security_group_id = aws_security_group.alb.id
  ip_protocol       = "-1"
  cidr_ipv4         = "0.0.0.0/0"
}

resource "aws_lb" "this" {
  name               = local.name
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = var.public_subnet_ids

  tags = local.tags
}

resource "aws_lb_target_group" "this" {
  name        = local.name
  port        = var.target_port
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip" # required for awsvpc-networked Fargate tasks

  health_check {
    path                = var.health_check_path
    matcher             = var.health_check_matcher
    healthy_threshold   = 3
    unhealthy_threshold = 3
    interval            = 30
    timeout             = 5
  }

  # ECS handles rolling deregistration; a short grace period keeps
  # deploys quick without dropping in-flight requests.
  deregistration_delay = 30

  tags = local.tags
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.this.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.this.arn
  }
}