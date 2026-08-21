# Terraform — AWS infrastructure

ECS (Fargate) for the frontend and backend, RDS for MySQL, Secrets Manager for
credentials. For the end-to-end operational walkthrough (first-time setup,
day-2 deploys, secret rotation), see
[`documentation/DEPLOYMENT.md`](../../documentation/DEPLOYMENT.md). This file
is the Terraform-specific reference: layout, modules, variables, local usage.

## Layout

```
infrastructure/terraform/
  bootstrap/          # one-time, account-wide. Apply manually, first, with local state.
  modules/              # reusable building blocks, no environment-specific values
  envs/
    dev/                # root module wiring the modules together for dev
    prod/               # same, for prod
```

`bootstrap/` and `envs/*` are separate Terraform root modules (each needs its
own `terraform init`/`plan`/`apply` run from within that directory) — they
are not connected by `terraform_remote_state`. `envs/*` looks up bootstrap's
ECR repos by name via a data source (`data "aws_ecr_repository"`) instead.

## Why this shape

- **`bootstrap` is separate from `envs/*`**: the S3 bucket + DynamoDB table it
  creates must exist *before* `envs/dev`/`envs/prod` can point their `backend
  "s3"` block at them — a chicken-and-egg problem any single-apply layout
  can't avoid. It also owns the GitHub OIDC provider and ECR repos, which are
  account-wide, not per-environment (see below).
- **ECR repos live in `bootstrap`, not per-env**: an image is built once by
  CI and the same tag is deployed to dev, then promoted to prod — not
  rebuilt per environment. Separate registries per env would make that
  promotion a copy operation instead of a tag reference.
- **Two ALBs per environment (frontend + backend), not one with path
  routing**: the frontend calls the backend directly from the browser
  (`REACT_APP_BACKEND_API_URL`, baked in at image build time — see
  `lms-frontend/Dockerfile`). Backend controller paths aren't uniformly
  `/api/**` (there's also bare `/auth`, `/student`, `/lead-sources` — see the
  root `CLAUDE.md`), so a single ALB doing path-based routing would need a
  hand-maintained rule per non-`/api` prefix and silently break on the next
  controller that doesn't follow convention. Two ALBs cost ~$16/mo more and
  avoid that fragility. Collapse them behind one ALB + host-based routing
  once a real domain exists.
- **No custom domain / TLS yet**: nothing is delegated to Route53. Both ALBs
  serve plain HTTP on their own `*.elb.amazonaws.com` DNS name. Add an ACM
  cert + `:443` listener + redirect once a domain is available — that's a
  change inside `modules/alb`, not a restructure.
- **File uploads are out of scope**: the backend writes to a local `./uploads`
  dir (`file.upload-dir`), which doesn't survive on ephemeral Fargate tasks
  and won't be consistent across multiple tasks. Not addressed by this
  infrastructure — revisit separately (EFS mount or migrate the app to S3).

## Modules

| Module | Creates | Notable inputs |
|---|---|---|
| `networking` | VPC, 2 public + 2 private subnets across `az_count` AZs, IGW, NAT gateway(s), route tables | `vpc_cidr`, `nat_gateway_count` (1 = shared/cheap, = `az_count` for per-AZ HA egress) |
| `ecr` | ECR repos (one per name in `repo_names`), image-scan-on-push, lifecycle policy | `repo_names` (default `["backend", "frontend"]`) |
| `secrets` | Secrets Manager entries: `db-password`/`jwt-secret`/`admin-temp-password` (Terraform-generated `random_password`, never typed anywhere), `mail-username`/`mail-password`/`admin-temp-username` (placeholder value, `ignore_changes` on `secret_string` — real value set out-of-band) | `admin_temp_username` |
| `rds` | MySQL 8.4 instance, subnet group, parameter group, its own security group | `instance_class`, `multi_az`, `database_password` (pass `module.secrets.db_password`, never a literal) |
| `ecs_cluster` | ECS cluster, `FARGATE`/`FARGATE_SPOT` capacity providers, Container Insights | — |
| `alb` | Internet-facing ALB + target group (`target_type = "ip"`) + `:80` listener + its own SG. One instance per service. | `target_port`, `health_check_path` |
| `ecs_service` | Fargate task definition + service, execution/task IAM roles, CloudWatch log group, its own SG (ingress from the ALB's SG only), optional CPU autoscaling | `container_image`, `env_vars`, `secrets` (list of `{name, value_from}` pointing at Secrets Manager ARNs), `enable_autoscaling` |
| `github_oidc` | IAM OIDC provider for GitHub Actions + two roles: `terraform` (broad, manages all project infra) and `deploy` (narrow: ECR push, ECS register/update, `iam:PassRole` on project roles only, ALB DNS lookup) | `github_org`, `github_repo` — **verify these against the repo that will actually run the Actions workflows** |

Full variable/output lists are in each module's `variables.tf`/`outputs.tf`.

### A deliberate cycle-break worth knowing about

`envs/*/main.tf` does **not** pass the backend ECS service's security group
into the `rds` module's `allowed_security_group_ids`. Doing so would create a
module cycle: `rds` would depend on `backend_service` (for its SG), while
`backend_service`'s `DATABASE_HOST` env var depends on `module.rds.address`.
Instead, `rds` is created with `allowed_security_group_ids = []`, and a
standalone `aws_vpc_security_group_ingress_rule` resource in `envs/*/main.tf`
wires the two SGs together after both modules exist. If you're extending
this, prefer that pattern (a root-level resource bridging two module
outputs) over threading a dependency back into a module input.

### Image tags and `lifecycle { ignore_changes = [task_definition] }`

`modules/ecs_service` sets `container_image` from a `*_image_tag` variable
that defaults to `"bootstrap"` — a placeholder so the very first `apply`
(before any real image has been pushed) has something syntactically valid to
register. Real deploys happen via `backend-deploy.yml`/`frontend-deploy.yml`,
which register a new task definition revision directly with the AWS API and
call `update-service`. The `aws_ecs_service` resource has
`ignore_changes = [task_definition]` specifically so a later `terraform
apply` (e.g. resizing a task) doesn't fight that and roll the service back to
the `bootstrap` placeholder image.

ECR repos are `image_tag_mutability = "IMMUTABLE"` — CI tags images with the
git SHA (backend) or `<sha>-<env>` (frontend, since `REACT_APP_BACKEND_API_URL`
is baked in per-env at build time), so this only bites if a workflow re-runs
against the exact same commit and tries to push the same tag twice.

### Ad-hoc local access to the dev database

RDS is `publicly_accessible = false` by default with a security group that
only trusts the backend ECS service's own SG (see the cycle-break note
above) — there's no path in from a laptop. `envs/dev/terraform.tfvars` sets
`db_publicly_accessible = true` and `db_enable_developer_access_sg = true`,
which gives the dev instance a public endpoint and an extra, empty security
group (`modules/rds`'s `aws_security_group.developer_access`) attached to
it. "Empty" is deliberate: this module declares no ingress rules for that
group at all, so add/remove your own IP by hand -
`terraform output rds_developer_access_security_group_id` to find its ID,
then `aws ec2 authorize-security-group-ingress --group-id <id> --protocol
tcp --port 3306 --cidr <your-ip>/32` (or the console) - and `terraform
apply` will never see or revert it, since it's not declared in state.
`db_publicly_accessible`/`db_enable_developer_access_sg` both default to
`false` in the `rds` module itself and are not set in `envs/prod` - prod's
posture is unchanged.

## Local usage

Install Terraform and the AWS CLI with the scripts in `../../scripts/` if you
don't have them:

```bash
../../scripts/terraform/install/linux.sh   # or mac.sh / windows.ps1
../../scripts/aws/install/linux.sh          # or mac.sh / windows.ps1
aws configure                                 # or an SSO profile
```

Terraform variables can be set via `TF_VAR_<name>` env vars instead of
`-var`/tfvars edits. Two layers of `.env`:

- **Repo root `.env`** (copy from the root `.env.example`) — `TF_VAR_project`,
  `TF_VAR_region`, `TF_VAR_github_org`, `TF_VAR_github_repo`. Shared by
  `bootstrap` and both envs, so it lives one level up from all of them.
- **Per-directory `.env`** in `bootstrap`/`envs/dev`/`envs/prod` — only for
  values that must differ by directory. Today that's just
  `TF_VAR_environment` in `envs/dev`/`envs/prod` (bootstrap needs nothing
  beyond the root `.env`, so it has no `.env.example` of its own).

Source the root one first, then the directory-local one (if it has one).
Using `git rev-parse --show-toplevel` for the root path avoids having to
hand-count `../..` for directories at different depths (`bootstrap` is 3
levels down from the repo root, `envs/dev`/`envs/prod` are 4):

```bash
set -a && source "$(git rev-parse --show-toplevel)/.env" && source .env 2>/dev/null; set +a
```

(`set -a` exports everything sourced afterward, which is what makes
`TF_VAR_*` visible to `terraform`; the `2>/dev/null` no-ops harmlessly in
`bootstrap`, which has no local `.env`.)

**Bootstrap (once per AWS account, local state):**

```bash
cd bootstrap
set -a && source "$(git rev-parse --show-toplevel)/.env" && set +a   # edit the root .env first
terraform init
terraform apply
```

Note the outputs (`state_bucket`, `lock_table`, `github_terraform_role_arn`,
`github_deploy_role_arn`, `ecr_repository_urls`) — you'll need them for CI
setup (see `documentation/DEPLOYMENT.md`).

**An environment:**

```bash
cd envs/dev   # or envs/prod
cp .env.example .env   # sets TF_VAR_environment for this directory
set -a && source "$(git rev-parse --show-toplevel)/.env" && source .env && set +a
cp backend.hcl.example backend.hcl   # edit if you changed `project` from the default
terraform init -backend-config=backend.hcl
terraform plan
terraform apply
```

`terraform.tfvars` in each env directory holds the default sizing (dev:
`db.t4g.micro`, single task, no autoscaling; prod: `db.t4g.small`, 2 tasks,
backend autoscaling 2–4 on CPU) — leave those in tfvars; `.env`/`TF_VAR_*` is
for the identity vars (`project`/`region`/`environment`) that differ by who's
running the command or which account/directory they're targeting. CI sets
the same `TF_VAR_*` vars directly in the workflow YAML from repo Variables,
without a `.env` file.

Remember to re-source when you switch directories — unlike direnv, a plain
`source` doesn't auto-unload when you `cd` elsewhere, so an exported
`TF_VAR_environment=prod` from a previous session will silently carry into a
`dev` run in the same terminal unless you re-source or open a fresh shell.

## Verification after a first apply

```bash
terraform output frontend_url   # http://<frontend-alb-dns>
terraform output backend_url    # http://<backend-alb-dns>
```

- Open `frontend_url` in a browser — the SPA should load and its login call
  should succeed against `backend_url`.
- `curl <backend_url>/actuator/health` should return `{"status":"UP"}` once
  the backend task has passed Flyway migration + Spring Boot startup
  (`health_check_grace_period_seconds = 90` in `ecs_service` gives it that
  long before the ALB starts failing it).
- `aws ecs describe-services --cluster lms-erp-dev --services
  lms-erp-dev-backend` (or check the AWS Console) to confirm the service
  reached `desired_count` running tasks.
