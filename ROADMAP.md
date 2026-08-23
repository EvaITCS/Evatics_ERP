# LMS ERP — Backlog / Roadmap

Gap analysis as of 2026-08-23. Ordered by priority; each epic is broken into
backend/frontend tasks with acceptance criteria.

---

## Epic 1 — Attendance Module (highest priority)

CLAUDE.md lists attendance as a core domain, but nothing exists:
no `attendance` backend package, no `attendance` frontend folder.
`AppRoutes.jsx:30-32` already has commented-out placeholders for
`AdminAttendanceRoutes`, `COUNSELLORAttendanceRoutes`,
`EmployeeAttendanceRoutes`, and `MyEmployeeDashboardResponse.attendanceCount`
(`dashboard/dto/MyEmployeeDashboardResponse.java:20`) is never populated.

### Scope decision (make first)
- [ ] Decide: employee attendance (check-in/out per shift) vs student
      attendance (per batch session) vs both. Recommendation: start with
      **student batch-session attendance** (ties into trainer/batch flow),
      then employee check-in.

### Backend (`backend/src/main/java/com/lms_erp/attendance/`)
- [ ] New feature package following existing convention:
      `controller/`, `dto/`, `entity/`, `repository/`, `service/impl/`, `enums/`
- [ ] Entities (proposed):
      - `AttendanceSession` (batch, date, time, trainer, topic)
      - `StudentAttendanceRecord` (session ↔ StudentBatch entry, status
        PRESENT/ABSENT/LATE/EXCUSED, note)
- [ ] `AttendanceController` under `/api/attendance` with
      `@PreAuthorize` matching sibling controllers:
      - Trainer marks attendance for own batch sessions
      - Admin/Counsellor view + edit, reports per batch/student
      - Student views own attendance
- [ ] Wire `attendanceCount` into `DashboardService.employeeDashboard`
      (or the student equivalent) once data exists
- [ ] Schema: dev uses `ddl-auto=update` (entity-only is fine), but
      docker/prod need a **`V4__create_attendance.sql`** Flyway migration
      (source of truth is `db/migration/`, not `infrastructure/mysql/init.sql`)
- [ ] Service + controller tests (see Epic 3)

### Frontend (`lms-frontend/src/attendance/`)
- [ ] Feature folder: `pages/`, `routes/`, `services/`, `components/`, `styles/`
- [ ] `attendanceService.js` wrapping `api` from `src/api/axios.js`
- [ ] Pages:
      - Trainer: session list + mark-attendance grid
      - Admin: attendance reports (per batch / per student, date range)
      - Student: my attendance summary (feed `MyBatchPage.jsx`)
- [ ] Routes: create `AdminAttendanceRoutes`, `CounsellorAttendanceRoutes`,
      `EmployeeAttendanceRoutes` (or `TrainerAttendanceRoutes`) and uncomment
      the placeholders in `AppRoutes.jsx:30-32, 95, 147, 168`
- [ ] Add sidebar entries in the relevant layouts (`src/layouts/`)

---

## Epic 2 — Candidate Portal

`CandidateRoutes.jsx` is a hardcoded static page. Backend already supports
the flow: lead conversion → `CANDIDATE` role (seeded in V2),
`CandidateContract` entity (PENDING/SIGNED), and
`CandidateContractController` at `/api/student/contracts`
(`my-contract`, `{id}/file`, `{id}/sign`).

### Backend hardening
- [ ] Add `@PreAuthorize("hasRole('CANDIDATE')")` to
      `CandidateContractController` — it currently relies on JWT-only, so any
      authenticated role can call it
- [ ] Replace raw `RuntimeException` throws with `HttpException` factories
      (project convention per CLAUDE.md)
- [ ] Endpoint: candidate dashboard payload (application stage, contract
      status, next steps) — reuse `StudentApplicationStageResponse`

### Frontend (`lms-frontend/src/candidate/`)
- [ ] `services/candidateService.js` (contract fetch/view/sign, dashboard)
- [ ] Contract page: view PDF inline + sign — reuse the pattern in
      `student/pages/StudentContract.jsx` (already implements signing)
- [ ] Replace static `CandidateRoutes.jsx` content with real dashboard:
      welcome, program info, contract status card, progress steps
- [ ] Add candidate layout/nav (currently the page has its own inline header)

---

## Epic 3 — Backend Test Coverage

Only `ErpApplicationTests` (context loads) exists.

- [ ] Pick strategy: `@DataJpaTest` + H2, or Testcontainers MySQL
      (check `pom.xml` for what's already available before adding deps)
- [ ] Priority services to cover:
      - `LeadConversionService.convertLead` (person/user/role creation)
      - `ContractServiceImpl.signContract` (status transitions, ownership checks)
      - `BatchServiceImpl` (trainer assignment, student enrollment)
      - `DashboardService` (count correctness)
      - `InvitationTokenServiceImpl` (token expiry/status)
- [ ] Security slice tests: endpoints reject wrong roles
      (`CandidateContractController`, admin-only endpoints)
- [ ] Wire `./mvnw test` as a gate before PRs

---

## Epic 4 — Hygiene & Smaller Gaps

- [ ] **Docs drift**: CLAUDE.md says role `CONSULTANT` and an existing
      attendance module; code uses `COUNSELLOR` (V2 seed) and has no
      attendance. Update CLAUDE.md to match reality (or rename the role).
- [ ] **Admin user management UI**: backend has `UserController`/`RoleController`
      but frontend `src/user/` is service-only — build an admin page for
      listing/locking users and assigning roles (pair with existing
      `security/pages/LockedUsersPage.jsx`).
- [ ] **Frontend cleanup**: `src/main.jsx` / `src/App.jsx` are dead Vite
      leftovers (already documented as such) — delete them to avoid confusion.
- [ ] **Env sanity**: verify `.env.example` files cover all vars actually read
      (recent commit 13cdda5 made mail/geoapify optional — confirm examples match).

---

## Suggested order

1. Epic 1 scope decision → backend → frontend (largest missing feature,
   already scaffolded in routing)
2. Epic 2 backend hardening (small, security-relevant) → candidate portal UI
3. Epic 3 alongside each epic (test as features land)
4. Epic 4 whenever convenient
