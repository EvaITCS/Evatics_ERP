# Lets GitHub Actions assume AWS IAM roles via OIDC federation - no
# long-lived AWS access keys stored as GitHub secrets. One provider per
# AWS account (GitHub's OIDC issuer URL is global), so this module is
# instantiated once, from bootstrap/, not per-env.
#
# Two roles, split by blast radius:
#   - terraform: used by terraform.yml (plan on PRs, apply on push to main)
#     to manage all infra this project creates.
#   - deploy: used by backend-deploy.yml/frontend-deploy.yml to push images
#     and roll ECS services - it cannot touch networking/IAM/RDS.
#
# Trust is scoped to this repo (any branch/PR/environment within it) via
# the `sub` claim. Tighten to specific branches/environments later if desired.

data "tls_certificate" "github" {
  url = "https://token.actions.githubusercontent.com/.well-known/openid-configuration"
}

resource "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"

  client_id_list = ["sts.amazonaws.com"]

  thumbprint_list = [data.tls_certificate.github.certificates[0].sha1_fingerprint]
}

data "aws_iam_policy_document" "github_trust" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github.arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:${var.github_org}/${var.github_repo}:*"]
    }
  }
}

# --- terraform role: manages all project infra ---

resource "aws_iam_role" "terraform" {
  name               = "${var.project}-github-terraform"
  assume_role_policy = data.aws_iam_policy_document.github_trust.json
}

data "aws_iam_policy_document" "terraform_permissions" {
  statement {
    sid    = "InfraServices"
    effect = "Allow"
    actions = [
      "ec2:*",
      "rds:*",
      "ecs:*",
      "ecr:*",
      "elasticloadbalancing:*",
      "secretsmanager:*",
      "logs:*",
      "application-autoscaling:*",
      "cloudwatch:*",
    ]
    resources = ["*"]
  }

  statement {
    sid    = "IamForServiceRoles"
    effect = "Allow"
    actions = [
      "iam:CreateRole",
      "iam:DeleteRole",
      "iam:GetRole",
      "iam:TagRole",
      "iam:PassRole",
      "iam:PutRolePolicy",
      "iam:DeleteRolePolicy",
      "iam:GetRolePolicy",
      "iam:AttachRolePolicy",
      "iam:DetachRolePolicy",
      "iam:ListRolePolicies",
      "iam:ListAttachedRolePolicies",
      "iam:CreateOpenIDConnectProvider",
      "iam:GetOpenIDConnectProvider",
      "iam:TagOpenIDConnectProvider",
    ]
    # Scoped to roles this project creates, not every role in the account.
    resources = [
      "arn:aws:iam::*:role/${var.project}-*",
      "arn:aws:iam::*:oidc-provider/token.actions.githubusercontent.com",
    ]
  }

  statement {
    sid    = "StateBackend"
    effect = "Allow"
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:ListBucket",
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:DeleteItem",
    ]
    resources = [
      "arn:aws:s3:::${var.project}-terraform-state",
      "arn:aws:s3:::${var.project}-terraform-state/*",
      "arn:aws:dynamodb:*:*:table/${var.project}-terraform-locks",
    ]
  }
}

resource "aws_iam_role_policy" "terraform" {
  name   = "${var.project}-github-terraform"
  role   = aws_iam_role.terraform.id
  policy = data.aws_iam_policy_document.terraform_permissions.json
}

# --- deploy role: build/push images, roll ECS services, read ALB DNS ---

resource "aws_iam_role" "deploy" {
  name               = "${var.project}-github-deploy"
  assume_role_policy = data.aws_iam_policy_document.github_trust.json
}

data "aws_iam_policy_document" "deploy_permissions" {
  statement {
    sid       = "EcrAuth"
    effect    = "Allow"
    actions   = ["ecr:GetAuthorizationToken"]
    resources = ["*"]
  }

  statement {
    sid    = "EcrPushPull"
    effect = "Allow"
    actions = [
      "ecr:BatchCheckLayerAvailability",
      "ecr:GetDownloadUrlForLayer",
      "ecr:BatchGetImage",
      "ecr:PutImage",
      "ecr:InitiateLayerUpload",
      "ecr:UploadLayerPart",
      "ecr:CompleteLayerUpload",
    ]
    resources = ["arn:aws:ecr:*:*:repository/${var.project}-*"]
  }

  statement {
    sid    = "EcsDeploy"
    effect = "Allow"
    actions = [
      "ecs:DescribeServices",
      "ecs:DescribeTaskDefinition",
      "ecs:RegisterTaskDefinition",
      "ecs:UpdateService",
    ]
    resources = ["*"]
  }

  statement {
    sid       = "PassEcsRoles"
    effect    = "Allow"
    actions   = ["iam:PassRole"]
    resources = ["arn:aws:iam::*:role/${var.project}-*"]
  }

  statement {
    sid       = "ReadAlbDns"
    effect    = "Allow"
    actions   = ["elasticloadbalancing:DescribeLoadBalancers"]
    resources = ["*"]
  }
}

resource "aws_iam_role_policy" "deploy" {
  name   = "${var.project}-github-deploy"
  role   = aws_iam_role.deploy.id
  policy = data.aws_iam_policy_document.deploy_permissions.json
}