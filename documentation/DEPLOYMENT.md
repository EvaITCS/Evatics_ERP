Ho# Deployment

How LMS ERP runs on AWS: ECS Fargate for the frontend and backend, RDS for
MySQL, Secrets Manager for credentials, GitHub Actions for CI/CD. Terraform
owns the infrastructure; this doc is the operational walkthrough. For
module-level Terraform reference, see
[`infrastructure/terraform/README.md`](../infrastructure/terraform/README.md).

## Architecture at a glance

```
Internet
/            \
        frontend ALB        backend ALB      (plain HTTP - no domain yet)
|                    |
frontend ECS service   backend ECS service        RDS MySQL
(nginx, static build)   (Spring Boot)  ------------->  (private subnet)
|
Secrets Manager
(db password, JWT secret, mail creds,
temp admin credentials)
```

- Frontend and backend are separate ECS services behind separate ALBs (see
  the Terraform README for why: the frontend calls the backend directly from
  the browser, and backend routes aren't uniformly `/api/**`).
- The frontend image bakes `REACT_APP_BACKEND_API_URL` in at _build_ time
  (Create React App inlines `REACT_APP_*` vars), so it's rebuilt per
  environment rather than promoted as one artifact like the backend is.
- Two environments: `dev` and `prod`, each a fully separate VPC/RDS/ECS
  cluster stack. No staging environment.
- No custom domain is delegated to AWS yet. Both ALBs are reached via their
  default `*.elb.amazonaws.com` DNS name over HTTP.

## Prerequisites

- An AWS account with permission to create the resources below (or an admin
  who can run the one-time bootstrap for you).
- Terraform and the AWS CLI. Install with:

```bash
./scripts/terraform/install/linux.sh   # or mac.sh / windows.ps1
./scripts/aws/install/linux.sh          # or mac.sh / windows.ps1
```

- `docker` and `jq` if you'll use the manual deploy scripts in
  `scripts/aws/` (see "Deploying without CI" below) - not needed for the
  Terraform-only steps.
- AWS credentials configured locally for the one-time bootstrap step
  (`aws configure` or an SSO profile). Day-to-day CI/CD doesn't need this —
  it authenticates via OIDC (see below).
- Admin/maintainer access on the GitHub repo, to set repo Variables and
  configure Environment protection rules.

## One-time setup

### 1. Bootstrap the AWS account

```bash
cp .env.example .env   # from the repo root: edit project, region, and the org/repo that runs Actions
cd infrastructure/terraform/bootstrap
set -a && source "$(git rev-parse --show-toplevel)/.env" && set +a
terraform init
terraform apply
```

(`set -a` exports everything `source .env` sets, which is what makes
`TF_VAR_*` in `.env` visible to `terraform`. See
`infrastructure/terraform/README.md` for the full `.env` convention used
across `bootstrap`/`envs/dev`/`envs/prod`.)

This creates, once, account-wide:

- The S3 bucket + DynamoDB table that `envs/dev` and `envs/prod` use for
  remote state.
- A GitHub OIDC provider + two IAM roles (`terraform`, `deploy`) that GitHub
  Actions assumes — no long-lived AWS access keys are stored in GitHub.
- The ECR repos (`lms-erp-backend`, `lms-erp-frontend`), shared across both
  environments.

Keep this state local (or move it to its own small S3 bucket manually) — it
is intentionally _not_ part of the `envs/*` remote state, because it has to
exist before that backend config is usable.

Note the outputs:

```bash
terraform output
```

You'll need `github_terraform_role_arn`, `github_deploy_role_arn`, and the
bucket/table names (`lms-erp-terraform-state`, `lms-erp-terraform-locks` if
you used the default `project` value) for the next steps.

### 2. Configure GitHub repo Variables

Settings → Secrets and variables → Actions → Variables:

| Name                     | Value                                                               |
| ------------------------ | ------------------------------------------------------------------- |
| `PROJECT_NAME`           | `lms-erp` (or whatever `TF_VAR_project` you set in the root `.env`) |
| `AWS_REGION`             | `us-east-1` (or whatever region you bootstrapped in)                |
| `AWS_TERRAFORM_ROLE_ARN` | bootstrap output `github_terraform_role_arn`                        |
| `AWS_DEPLOY_ROLE_ARN`    | bootstrap output `github_deploy_role_arn`                           |

No secrets need to be added here — auth is via OIDC, not stored keys.

### 3. Configure GitHub Environments

Settings → Environments, create `dev` and `prod`. Add a required reviewer to
`prod` (not `dev`) so infra applies and app deploys to prod need a manual
approval click, while dev flows straight through. This is what
`.github/workflows/terraform.yml`, `backend-deploy.yml`, and
`frontend-deploy.yml` gate their prod jobs on (`environment: prod`).

### 4. First apply per environment

```bash
cd infrastructure/terraform/envs/dev
cp .env.example .env   # sets TF_VAR_environment=dev - project/region come from the root .env
set -a && source "$(git rev-parse --show-toplevel)/.env" && source .env && set +a
cp backend.hcl.example backend.hcl   # edit bucket/table names if you changed `project`
terraform init -backend-config=backend.hcl
terraform apply
```

Repeat for `envs/prod`. This first apply uses the `bootstrap` placeholder
image tag (see the Terraform README's "Image tags" section) — the ECS
services will exist but their tasks won't be healthy until a real image is
pushed by the deploy workflow below.

### 5. Set the real mail credentials

`modules/secrets` creates `mail-username`/`mail-password` in Secrets Manager
with a placeholder value (`CHANGE_ME`) — Terraform deliberately never writes
real third-party credentials into state or tfvars. Set `MAIL_USERNAME`/
`MAIL_PASSWORD` in the repo root `.env`, then push them to Secrets Manager:

```bash
./scripts/aws/set-secrets.sh dev
./scripts/aws/set-secrets.sh prod
```

(Equivalent to `aws secretsmanager put-secret-value --secret-id
lms-erp/<env>/mail-username --secret-string "$MAIL_USERNAME"`, and the same
for `mail-password` — see `scripts/aws/set-secrets.sh` if you'd rather run
those by hand.)

The backend picks these up on its next task restart (force a new deployment,
or just wait for the next CI deploy).

### 6. First app deploy

Push to `main` with changes under `backend/**` or `lms-frontend/**` (or just
merge a no-op change) to trigger `backend-deploy.yml`/`frontend-deploy.yml`.
Each builds an image, pushes to ECR, deploys to dev automatically, then waits
for prod approval before promoting.

## Day-2 operations

### Deploying a change

- Changes under `backend/**` → `backend-deploy.yml` builds **one** image
  (tagged with the git SHA), deploys it to dev, then (after approval)
  updates prod's ECS service to the exact same image — a promotion, not a
  rebuild.
- Changes under `lms-frontend/**` → `frontend-deploy.yml` builds **two**
  images (one per env, tagged `<sha>-dev` / `<sha>-prod`), because
  `REACT_APP_BACKEND_API_URL` differs per environment and CRA bakes it in at
  build time. The workflow looks up each env's backend ALB DNS automatically
  via `aws elbv2 describe-load-balancers`.
- Changes under `infrastructure/terraform/**` → `terraform.yml` plans on the
  PR (output posted to the job summary) and applies dev then prod, in order,
  on merge to `main`.

### Deploying without CI

`scripts/aws/build-images.sh` and `scripts/aws/deploy-service.sh` are the
manual equivalent of the two deploy workflows above — same image tagging,
same ECR push, same "download task def → swap image → register a new
revision → `update-service`" flow — run from your own machine with your own
AWS credentials instead of GitHub Actions OIDC. Useful for a one-off deploy
or for debugging what CI would do without waiting on a PR/merge. A root
`Makefile` wraps both:

```bash
make docker-push ENV=dev    # build + push both images (build-images.sh --push --env dev)
make deploy ENV=dev          # roll both ECS services to that tag (deploy-service.sh --env dev)
# make docker-push ENV=prod && make deploy ENV=prod   # once you're ready to promote
```

Or call the scripts directly for more control (single service, explicit
tag, `--dry-run` to preview the AWS calls without making them):

```bash
./scripts/aws/build-images.sh --push --env dev backend
./scripts/aws/deploy-service.sh --env dev backend
./scripts/aws/deploy-service.sh --env prod --tag v1.2.3 backend   # promote a specific tag
```

Both default to the current commit's short SHA as the image tag (frontend
appends `-<env>`, since it isn't built once and promoted like the backend —
see each script's `--help` for why). Pass `--tag` to override — ECR repos
are `image_tag_mutability = "IMMUTABLE"`, so re-running against the same
commit/tag without one will fail on push. Requires `docker`, `aws`, and
`jq` locally (`make docker-build`/`deploy` will tell you if one's missing).

Mail credentials: `make secrets ENV=dev` (wraps `scripts/aws/set-secrets.sh`,
see step 5 above).

### Checking service health

```bash
aws ecs describe-services --cluster lms-erp-dev --services lms-erp-dev-backend
aws elbv2 describe-target-health --target-group-arn <arn>   # from terraform output or the AWS console
curl http://<backend-alb-dns>/actuator/health
```

Logs: CloudWatch log groups `/ecs/dev/backend`, `/ecs/dev/frontend` (and the
`prod` equivalents), 30-day retention.

### Retrieving the temp admin credentials

The backend's `AdminInitializer` seeds a temp admin on first boot (only if
the `users` table is empty), matching `ADMIN_TEMP_USERNAME`/
`ADMIN_TEMP_PASSWORD`, which come from Secrets Manager:

```bash
aws secretsmanager get-secret-value --secret-id lms-erp/dev/admin-temp-username --query SecretString --output text
aws secretsmanager get-secret-value --secret-id lms-erp/dev/admin-temp-password --query SecretString --output text
```

The app forces a password change on first login (`mustChangePassword`).

### Rolling back

Re-run `backend-deploy.yml`/`frontend-deploy.yml` from a previous commit
(Actions → the workflow → "Re-run jobs" on an older successful run), or
manually:

```bash
aws ecs update-service --cluster lms-erp-prod --service lms-erp-prod-backend \
  --task-definition <previous-task-def-arn> --force-new-deployment
```

Previous task definition revisions aren't deleted by deploys, so any past
revision ARN (`aws ecs list-task-definitions --family-prefix lms-erp-prod-backend`)
is a valid rollback target.

### Rotating secrets

`db-password` and `jwt-secret` are Terraform-generated (`random_password`).
To rotate: `terraform taint` the relevant `random_password` resource inside
`modules/secrets` (or just re-apply with a manually bumped `keepers`, if you
add one) and re-apply, then force a new deployment on the backend service so
it picks up the new value. Rotating the JWT secret invalidates all
outstanding tokens (everyone gets logged out) — plan for that.

## Known gaps / deliberate scope cuts

- **No custom domain / HTTPS**: everything is plain HTTP on ALB DNS names.
  Follow-up once a domain is delegated to Route53: ACM cert, `:443`
  listeners, HTTP→HTTPS redirect, update `SECURITY_CORS_ALLOWED_ORIGINS` and
  the frontend's `REACT_APP_BACKEND_API_URL` build arg to the real hostnames.

Resolved — SQL logging disabled and document persistence moved to MySQL; ECS local-upload dependency removed.

- **No staging environment**: only `dev` and `prod`.
