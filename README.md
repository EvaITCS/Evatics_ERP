# LMS ERP

An internal ERP for a training institute. Manages the pipeline from lead →
candidate → student enrollment, plus employees, batches/programs, trainers,
and attendance.

Two-service monorepo:

- **`backend/`** — Spring Boot 3.5 (Java 17), REST API, MySQL via
  JPA/Hibernate + Flyway.
- **`lms-frontend/`** — React 19 app (Create React App), consumes the
  backend API.

## Repository layout

```
backend/                    Spring Boot API
lms-frontend/                 React app
infrastructure/
  mysql/                       Reference schema dump (not what Flyway runs - see backend/src/main/resources/db/migration/)
  terraform/                   AWS infra (ECS Fargate, RDS, Secrets Manager) - see infrastructure/terraform/README.md
scripts/
  aws/                         Manual build/deploy/secrets scripts + AWS CLI installers
  terraform/install/            Terraform installers
documentation/
  DEPLOYMENT.md                 AWS deployment - one-time setup, day-2 ops
  ER_DIAGRAM.pdf
.github/workflows/            CI/CD (Terraform apply, image build/deploy)
Makefile                       make targets wrapping the above (build, test, docker, deploy, terraform)
```

## Quick start (Docker Compose)

```bash
cp .env.example .env   # fill in at least JWT_SECRET
docker compose up --build
```

Runs MySQL + backend (`docker` profile) + frontend (nginx) on
`localhost:3000`/`localhost:8080`/`localhost:3306` by default (see
`BACKEND_PORT`/`FRONTEND_PORT`/`DATABASE_PORT` in `.env.example` to change).

## Local development (without Docker)

```bash
# Backend - needs MySQL reachable per DATABASE_HOST/PORT/NAME, defaults to `dev` profile
# (Hibernate-managed schema, Flyway off)
cd backend && ./mvnw spring-boot:run

# Frontend - dev server on :3000, proxies API calls to :8080
cd lms-frontend && cp .env.example .env && npm start
```

See [`CLAUDE.md`](./CLAUDE.md) for the full architecture rundown (feature-package/feature-folder
structure, auth/roles model, Spring profiles, routing conventions) and common
commands (single-test runs, builds, etc).

## Deploying to AWS

Terraform-provisioned ECS Fargate (frontend + backend behind separate ALBs),
RDS MySQL, and Secrets Manager, with GitHub Actions for CI/CD. Start with
[`documentation/DEPLOYMENT.md`](./documentation/DEPLOYMENT.md) for the full
walkthrough (one-time account setup through day-2 operations); see
[`infrastructure/terraform/README.md`](./infrastructure/terraform/README.md)
for the Terraform module reference.

Manual (non-CI) deploys go through the root `Makefile`:

```bash
make docker-push ENV=dev   # build + push both images to ECR
make deploy ENV=dev          # roll both ECS services to that tag
make secrets ENV=dev          # push MAIL_USERNAME/MAIL_PASSWORD from .env to Secrets Manager
make help                     # full target list
```

## Documentation index

- [`CLAUDE.md`](./CLAUDE.md) — architecture guide (also read by Claude Code)
- [`documentation/DEPLOYMENT.md`](./documentation/DEPLOYMENT.md) — AWS deployment walkthrough
- [`infrastructure/terraform/README.md`](./infrastructure/terraform/README.md) — Terraform module reference
- [`documentation/ER_DIAGRAM.pdf`](./documentation/ER_DIAGRAM.pdf) — database entity-relationship diagram
