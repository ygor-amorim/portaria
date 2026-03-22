# CODEX Codebase Review - Portaria

Date: 2026-03-22
Scope scanned: `api/` (the `web/` directory is currently empty)
Reviewer lens: maintainability, correctness, scalability, and intent clarity

## Executive Summary
The codebase has a clean route/service split and good baseline tests, but it has several high-impact correctness issues in multi-tenant auth and data integrity.

Top priorities:
1. Fix tenant-ambiguous sign-in.
2. Make signup transactional.
3. Enforce participant-room/event consistency.
4. Normalize update endpoint errors to avoid 500s for user mistakes.

## Evidence Collection
I validated findings using:
- Static code inspection of routes/services/migrations/tests.
- Test suite execution: `npm.cmd test` -> 5 suites, 57 tests, all passing.
- Targeted runtime probes for edge cases not currently covered by tests.

## Findings

### 1) Critical - Tenant-ambiguous sign-in

**Objective mismatch**
- The schema allows same email across organizations, but sign-in queries only by email.
- In multi-tenant systems, identity resolution must include tenant context or enforce globally unique email.

**Code evidence**
- `users` uniqueness is scoped to org, not global:
  - `api/src/migrations/20260320000002_create_users.js:10`
- Sign-in loads first user by email only:
  - `api/src/services/auth.js:53`

**Runtime evidence**
- Reproduced by creating two orgs with same email and different passwords.
- Result: password for one account succeeds, the other fails (`401`) even with valid credentials for that org.

**Risk**
- User lockout for legitimate accounts.
- Ambiguous identity semantics as tenant count grows.

**Recommendation**
- Either:
  1. Require tenant context in sign-in (`slug + email + password`), or
  2. Enforce globally unique email.
- Add tests for duplicate-email-across-org sign-in behavior.

---

### 2) High - Non-transactional signup can leave orphan organizations

**Objective mismatch**
- Signup is meant to create organization + first admin as a single business operation.
- Current flow performs separate writes without transaction boundaries.

**Code evidence**
- Org insert happens before user creation:
  - `api/src/services/auth.js:27-36`
- User validation can fail after org insert (for example invalid email):
  - `api/src/services/users.js:28-31`

**Runtime evidence**
- Reproduced with invalid email on signup.
- API returns `400 Invalid email address`, but organization row remains persisted with no admin user.

**Risk**
- Partial tenant state (orphan orgs), operational cleanup burden, inconsistent onboarding.

**Recommendation**
- Wrap signup in a DB transaction so org+admin are atomic.
- Add rollback tests for user-creation failure during signup.

---

### 3) High - Participants can reference rooms from a different event

**Objective mismatch**
- A participant in event A should not be attached to a room from event B.
- Current DB and service checks do not enforce this invariant.

**Code evidence**
- `participants.room_id` references `rooms.id` only:
  - `api/src/migrations/20260320000005_create_participants.js:5`
- Participant create/update accept `room_id` without verifying `room.event_id === participant.event_id`:
  - `api/src/services/participants.js:81`
  - `api/src/services/participants.js:127-130`

**Runtime evidence**
- Reproduced by creating two events, creating a room in event B, then creating a participant in event A with room_id from event B.
- Request succeeded (`201`), and persisted participant points to cross-event room.

**Risk**
- Cross-entity data corruption, incorrect room occupancy, analytics/reporting errors.

**Recommendation**
- Add service-layer validation for room ownership by event.
- Consider schema-level design to encode this invariant (where feasible).
- Add tests for both create and update cross-event room rejection.

---

### 4) Medium - Update endpoints produce avoidable 500s for client mistakes

**Objective mismatch**
- Invalid client payloads should return 4xx, not 500.

**Code evidence**
- Events update filters to allowed keys, then blindly updates:
  - `api/src/services/events.js:63-70`
- Empty allowed payload can trigger Knex "Empty .update()" error.
- Participants update can hit unique/FK DB errors with no mapping:
  - `api/src/services/participants.js:132-134`
- Error middleware only maps known `err.status`; DB errors default to 500:
  - `api/src/middlewares/errorHandler.js:3-7`

**Runtime evidence**
- PUT `/events/:id` with `{ "foo": "bar" }` returned `500 Internal server error` due to empty update.
- Participant email collision on update returned `500` from DB unique violation.

**Risk**
- Unstable API contract, poor client DX, noisy monitoring from avoidable server errors.

**Recommendation**
- Reject empty patch payloads with `400`.
- Map expected DB constraints to domain errors (`400`/`409`).
- Add tests for these edge cases.

---

### 5) Medium - Participant creation is synchronously coupled to email provider latency

**Objective mismatch**
- Registration write path should be fast and reliable.
- Current flow awaits external email call before returning response.

**Code evidence**
- Email send is awaited in request path:
  - `api/src/services/participants.js:92-106`

**Risk**
- Throughput and p95/p99 latency degradation under provider slowness.
- Greater variance and fragility in critical API path.

**Recommendation**
- Move email sending to async job/queue after commit.
- Return registration success independent of notification pipeline latency.

---

### 6) Medium - Unbounded list endpoints (scaling and UX risk)

**Objective mismatch**
- Production list endpoints usually require pagination and deterministic ordering.

**Code evidence**
- Unbounded queries in services:
  - `api/src/services/users.js:7-10`
  - `api/src/services/events.js:2-5`
  - `api/src/services/rooms.js:14-17`
  - `api/src/services/participants.js:19-29`

**Risk**
- Large response payloads, DB pressure, slow dashboards as data grows.

**Recommendation**
- Add `limit/offset` (or cursor) + stable order + metadata (`total`, `nextCursor`).

---

### 7) Low - Config hardening gaps

**Code evidence**
- Open CORS policy by default:
  - `api/src/app.js:15`
- JWT secret used without startup fail-fast validation:
  - `api/src/middlewares/auth.js:20`
  - `api/src/services/auth.js:9`

**Risk**
- Environment misconfiguration discovered late (runtime).
- Overexposed cross-origin surface in production unless externally constrained.

**Recommendation**
- Add boot-time env validation.
- Configure explicit CORS allowlist per environment.

## Testing Coverage Gaps
Current tests are strong on happy-path behavior and baseline isolation, but they do not cover:
1. Duplicate email across orgs during sign-in.
2. Signup rollback semantics.
3. Cross-event room assignment rejection.
4. Empty patch payload behavior.
5. Update-time unique/FK conflict mapping.

Key test files reviewed:
- `api/src/tests/auth.test.js`
- `api/src/tests/participants.test.js`
- `api/src/tests/events.test.js`

## Positive Practices Observed
1. Clear separation between routes and services.
2. Consistent use of async error forwarding with centralized error middleware.
3. Good baseline multi-tenant ownership checks (`organization_id` / event ownership guards).
4. Check-in flow uses a transaction with conditional update to prevent duplicate check-ins under concurrency.
5. Solid baseline automated tests and quick local run time.

## Suggested Remediation Order
1. Auth identity model (tenant-aware sign-in or global email uniqueness).
2. Signup transactionality.
3. Participant-room/event invariant enforcement.
4. Error contract hardening for update paths.
5. Pagination rollout for list endpoints.
6. Async notification pipeline and config hardening.
