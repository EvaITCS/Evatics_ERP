# LMS ERP – root Makefile
# Copy .env.example to .env and fill in values before running docker/deploy/terraform targets.

-include .env
export

# ── Configuration ───────────────────────────────────────────────────────────
# Resolved from .env; can be overridden on the command line:
#   make docker-push-backend PROJECT=my-project ENV=prod
REGISTRY   ?= $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com
PROJECT    ?= $(TF_VAR_project)
ENV        ?= dev

SERVICES := backend frontend

.PHONY: help env-check install-tools \
        build test clean \
        docker-build docker-push deploy secrets \
        tf-init tf-plan tf-apply \
        $(foreach s,$(SERVICES), \
          build-$(s) test-$(s) clean-$(s) \
          docker-build-$(s) docker-push-$(s) \
          deploy-$(s))

# ── Help ──────────────────────────────────────────────────────────────────────
help:
	@echo "LMS ERP – Build & Deploy Commands"
	@echo "======================================"
	@echo ""
	@echo "Setup:"
	@echo "  cp .env.example .env        Copy env template and fill in values"
	@echo "  make install-tools           Install terraform + aws cli (linux)"
	@echo ""
	@echo "Backend (Maven):"
	@echo "  make build                  Build all services"
	@echo "  make test                   Run tests for all services"
	@echo "  make clean                  Clean all services"
	@echo ""
	@echo "Docker (build via scripts/aws/build-images.sh):"
	@echo "  make docker-build            Build images locally, no push"
	@echo "  make docker-push             Build and push images to ECR"
	@echo ""
	@echo "Deploy (via scripts/aws/deploy-service.sh, ENV=dev|prod):"
	@echo "  make deploy ENV=dev          Roll both ECS services to the latest built tag"
	@echo ""
	@echo "Secrets (via scripts/aws/set-secrets.sh):"
	@echo "  make secrets ENV=dev          Push MAIL_USERNAME/MAIL_PASSWORD from .env to Secrets Manager"
	@echo ""
	@echo "Per-service targets:"
	@echo "  make build-<service>          e.g. make build-backend"
	@echo "  make test-<service>           e.g. make test-frontend"
	@echo "  make docker-build-<service>    e.g. make docker-build-backend"
	@echo "  make docker-push-<service>     e.g. make docker-push-frontend"
	@echo "  make deploy-<service>          e.g. make deploy-backend ENV=prod"
	@echo ""
	@echo "Terraform (infrastructure/terraform/envs/\$$(ENV)):"
	@echo "  make tf-init ENV=dev          terraform init"
	@echo "  make tf-plan ENV=dev          terraform plan"
	@echo "  make tf-apply ENV=dev         terraform apply"
	@echo ""
	@echo "Available services: $(SERVICES)"
	@echo "Environments: dev prod (ENV=dev by default)"
	@echo ""
	@echo "Registry: $(REGISTRY)/$(PROJECT)-<service>"

# ── Env guard ─────────────────────────────────────────────────────────────────
env-check:
	@test -n "$(AWS_ACCOUNT_ID)" || (echo "ERROR: AWS_ACCOUNT_ID is not set. Copy .env.example to .env and fill in values." && exit 1)
	@test -n "$(AWS_REGION)"     || (echo "ERROR: AWS_REGION is not set."     && exit 1)
	@test -n "$(PROJECT)"        || (echo "ERROR: TF_VAR_project is not set." && exit 1)

install-tools:
	./scripts/terraform/install/linux.sh
	./scripts/aws/install/linux.sh

# ── Maven – backend ─────────────────────────────────────────────────────────
build-backend:
	cd backend && ./mvnw clean install -DskipTests

test-backend:
	cd backend && ./mvnw test

clean-backend:
	cd backend && ./mvnw clean

# ── npm – frontend ──────────────────────────────────────────────────────────
build-frontend:
	cd lms-frontend && npm ci && npm run build

test-frontend:
	cd lms-frontend && npm ci && CI=true npm test

clean-frontend:
	rm -rf lms-frontend/build

build: build-backend build-frontend
test: test-backend test-frontend
clean: clean-backend clean-frontend

# ── Docker – all services ──────────────────────────────────────────────────────
docker-build: env-check
	./scripts/aws/build-images.sh --env $(ENV)

docker-push: env-check
	./scripts/aws/build-images.sh --push --env $(ENV)

deploy: env-check
	./scripts/aws/deploy-service.sh --env $(ENV)

secrets: env-check
	./scripts/aws/set-secrets.sh $(ENV)

# ── backend ───────────────────────────────────────────────────────────────────
docker-build-backend: env-check
	./scripts/aws/build-images.sh backend
docker-push-backend: env-check
	./scripts/aws/build-images.sh --push backend
deploy-backend: env-check
	./scripts/aws/deploy-service.sh --env $(ENV) backend

# ── frontend ──────────────────────────────────────────────────────────────────
docker-build-frontend: env-check
	./scripts/aws/build-images.sh --env $(ENV) frontend
docker-push-frontend: env-check
	./scripts/aws/build-images.sh --push --env $(ENV) frontend
deploy-frontend: env-check
	./scripts/aws/deploy-service.sh --env $(ENV) frontend

# ── Terraform ─────────────────────────────────────────────────────────────────
tf-init: env-check
	cd infrastructure/terraform/envs/$(ENV) && \
	  [ -f backend.hcl ] || cp backend.hcl.example backend.hcl && \
	  TF_VAR_environment=$(ENV) terraform init -backend-config=backend.hcl

tf-plan: env-check
	cd infrastructure/terraform/envs/$(ENV) && TF_VAR_environment=$(ENV) terraform plan

tf-apply: env-check
	cd infrastructure/terraform/envs/$(ENV) && TF_VAR_environment=$(ENV) terraform apply

# ── Quick shortcuts ───────────────────────────────────────────────────────────
backend:  deploy-backend
frontend: deploy-frontend
