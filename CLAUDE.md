# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

LMS ERP — an internal ERP for a training institute. Manages the pipeline from lead → candidate → student enrollment, plus employees, batches/programs, trainers, and attendance. Two-service monorepo:

- `backend/` — Spring Boot 3.5 (Java 17), REST API, MySQL via JPA/Hibernate + Flyway.
- `lms-frontend/` — React 19 app bootstrapped with Create React App (react-scripts 5), consumes the backend API.

`docker-compose.yml` at the repo root wires both services together with a MySQL container for local/prod-like runs.

## Commands

### Backend (`backend/`)

```bash
./mvnw spring-boot:run              # run the API locally (defaults to `dev` profile)
./mvnw test                         # run all tests
./mvnw test -Dtest=ErpApplicationTests            # run a single test class
./mvnw test -Dtest=ErpApplicationTests#contextLoads   # run a single test method
./mvnw clean package                # build the jar
```

Requires a running MySQL instance reachable per `DATABASE_HOST`/`DATABASE_PORT`/`DATABASE_NAME` (see `.env.example`). `spring.profiles.active` defaults to `dev`, which sets `hibernate.ddl-auto=update` and disables Flyway — Hibernate manages the schema directly in dev. Non-dev profiles (`docker`, `prod`) rely on Flyway migrations in `backend/src/main/resources/db/migration/` with `hibernate.ddl-auto=validate`, so schema changes for those profiles must go through a new `V{n}__description.sql` migration, not just an entity change.

### Frontend (`lms-frontend/`)

```bash
npm start        # dev server on :3000, proxies API calls to :8080 (see "proxy" in package.json)
npm test         # CRA/Jest test runner (interactive watch mode)
npm run build    # production build
```

`REACT_APP_BACKEND_API_URL` (see `lms-frontend/.env.example`) is inlined at build time by CRA and read in `src/shared/constants/env.js` / used by `src/api/axios.js`. Falls back to `http://localhost:8080` if unset.

### Full stack via Docker

```bash
docker compose up --build
```

Requires a root `.env` (copy from `.env.example`) with at minimum `JWT_SECRET` set — `docker-compose.yml` fails fast (`:?`) if it's missing. Runs MySQL + backend (`docker` profile) + frontend (built and served via nginx, see `lms-frontend/nginx.conf`) on ports configurable via `BACKEND_PORT`/`FRONTEND_PORT`/`DATABASE_PORT`.

## Architecture

### Backend: feature-package structure

Code under `backend/src/main/java/com/lms_erp/` is organized by business domain, not by layer: `auth`, `person`, `user`, `lead`, `candidate` (via lead conversion), `student`, `employee`, `trainer`, `batch`, `program`, `attendance`, `dashboard`, `master`, `common`, `email`. Each feature package typically contains its own `controller/`, `dto/`, `entity/`, `repository/`, `service/` (+ `service/impl/`), and sometimes `mapper/` (MapStruct), `enums/`, `exception/`, `scheduler/`, `validation/`. Cross-cutting pieces live outside feature packages:

- `config/` — `SecurityConfig`, `PasswordConfig`, and `@ConfigurationProperties` classes in `config/properties/` (e.g. `SecurityConfigProperties` for CORS origins, `AdminConfigProperties`, `FileConfigProperties`).
- `security/` — JWT machinery: `JwtUtil`, `JwtAuthenticationFilter`, `CustomUserDetailsService`, `CurrentUserService`, `SecurityConstants`.
- `exception/` — `GlobalExceptionHandler` (`@RestControllerAdvice`) and `HttpException` (a runtime exception with static factories like `HttpException.conflict(...)`/`badRequest(...)` — prefer this over throwing raw exceptions in services).
- `AdminInitializer` (`CommandLineRunner`, in the root package) seeds a single temp admin user (`ADMIN_TEMP_USERNAME`/`ADMIN_TEMP_PASSWORD`) on first boot, only if the `users` table is empty.

**Person model**: `Person` is the shared identity record (name, email, phone); `User` (login credentials), `Employee`, `Student`, and leads/candidates all reference back to a `Person` rather than duplicating personal fields. `PersonType`/`PersonTypeMap` tag a person with the roles they hold (student, employee, etc.).

**Auth/roles**: JWT-based, stateless (`SessionCreationPolicy.STATELESS`). Roles (`ADMIN`, `TRAINER`, `EMPLOYEE`, `STUDENT`, `CONSULTANT`, `CANDIDATE`, ...) are enforced with method-level `@PreAuthorize("hasRole('...')")`/`hasAnyRole(...)` on controllers, not URL-pattern-based rules — `SecurityConfig.filterChain` only permits `/auth/login`, `/auth/register`, and `/api/roles/**` without auth; everything else requires a valid JWT, and per-role access is decided at the method level. When adding an endpoint, check the sibling methods in the same controller for the expected `@PreAuthorize` role rather than guessing.

**Controller URL convention**: most REST controllers are namespaced under `/api/<resource>` (plural, kebab/dash-separated for multi-word resources, e.g. `/api/employee-documents`, `/api/person-educations`). `AuthController` is the deliberate exception at `/auth` (not `/api/auth`). A few student endpoints live at `/student` and `/student/profile` rather than `/api/student` — match existing sibling controllers in a package rather than assuming the `/api` prefix always applies.

**Migrations**: `V1__create_initial_schema.sql` was transcribed from `infrastructure/mysql/init.sql` and hand-reconciled against the JPA entities (see the comment header in that file for the specific deltas). `infrastructure/mysql/init.sql` is a reference dump, not what Flyway actually runs — treat the Flyway migrations under `db/migration/` as the source of truth for schema, and if `init.sql` is updated, re-sync the migration by hand rather than assuming they're kept in lockstep automatically.

### Frontend: feature-folder structure

`lms-frontend/src/` mirrors the backend's domain split: `auth`, `lead`, `employee`, `student`, `trainer`, `batch`, `program`, `attendance`, `candidate`, `master`, `person`, `security`, `user`, `dashboards`. Each feature folder typically has its own `pages/`, `components/`, `routes/`, `services/`, `styles/`, and sometimes `hooks/`, `utils/`, `context/`, `constants/`. `src/shared/` holds cross-cutting `components/`, `constants/`, `utils/`, `styles/`. `src/layouts/` has the per-role shells (`AdminLayout`, `ConsultantLayout`, `EmployeeLayout`, etc.) that wrap nested routes.

**Routing**: `src/routes/AppRoutes.jsx` is the single top-level route tree, composed by importing each feature's own route module (e.g. `../lead/routes/AdminLeadRoutes`) and nesting it under a role-gated layout route. Each role subtree is wrapped in `<ProtectedRoute allowedRole="...">` (`src/auth/ProtectedRoute`). To add a page for an existing role, add it to that feature's route module and import/spread it into the matching `<Route>` block in `AppRoutes.jsx`; to add a new role, add a new gated `<Route>` block there.

**API calls**: `src/api/axios.js` exports a shared `api` axios instance (baseURL from `REACT_APP_BACKEND_API_URL`, `Authorization: Bearer <token>` injected from `localStorage` via a request interceptor). Feature `services/` folders (e.g. `src/lead/services/`) wrap this instance with domain-specific calls — use `api` from `src/api/axios.js` rather than instantiating a new axios client or hitting `fetch` directly.

**Dead/legacy entrypoint files — do not use**: this app is CRA (`react-scripts`), and `src/index.js` → `src/App.js` is the real entrypoint (confirmed by `package.json` scripts and `public/index.html`). `src/main.jsx` and `src/App.jsx` are leftover Vite-style duplicates not wired into the build — `main.jsx` even imports `./context/AuthContext` and `./styles/global.css`, neither of which exists in this tree. Edit `index.js`/`App.js`, not the `.jsx` duplicates.

## Environment configuration

- Root `.env` (copy from `.env.example`) drives `docker-compose.yml` and is also read directly by Spring (`DATABASE_*`, `MAIL_*`, `ADMIN_TEMP_*`, `JWT_SECRET`).
- `lms-frontend/.env` (copy from `lms-frontend/.env.example`) only needs `REACT_APP_BACKEND_API_URL`, used for local `npm start`.
- Spring profiles: `dev` (local, Hibernate-managed schema, Flyway off), `docker` (Flyway-managed, CORS locked to `http://frontend:80`), `prod` (Flyway-managed, CORS locked to `https://erp.evaitcs.com`, requires `DATABASE_HOST`/`DATABASE_USER`/`DATABASE_PASSWORD` with no defaults).