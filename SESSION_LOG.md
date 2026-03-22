# Session Log

Last 3 sessions. Older sessions are in `SESSION_ARCHIVE.md`.

---

## Session 5 — 2026-03-22

### What We Did
- Fixed issues #1–4 (all HIGH security) and #12 (MEDIUM security) — 5 issues closed this session
- #1 Rate limiting: installed `express-rate-limit`, global limiter (200 req/15min) + stricter auth limiter (20 req/hour); both skip in `NODE_ENV=test`
- #2 Check-in race condition: wrapped in Knex transaction with conditional `WHERE status='registered'` update — if 0 rows affected → already checked in → 400; both DB writes atomic, rollback on failure
- #3 Role/JWT + `/users` route: added `role` to JWT payload, reduced expiry 14d → 24h, created `adminOnly` middleware, mounted `/users` route with admin guard on GET and POST, forced `role: 'operator'` on user create (stripped from `req.body`)
- #4 errorHandler: returns `'Internal server error'` on unhandled 500s, logs real error server-side only; application errors (explicit `err.status`) still return their message
- #12 HTML injection in email: added `escapeHtml()` utility, applied to `participantName`, `eventName`, `eventLocation` before template interpolation — no new dependencies
- Added `users.test.js`: 8 tests covering admin guard (403 for operators), role enforcement (admin always creates operators regardless of body), `/users` CRUD
- Test suite: 57/57 passing across 5 suites

### Files Created/Modified
- `api/src/app.js` — rate limiters added, `/users` route mounted
- `api/src/middlewares/adminOnly.js` — new, checks `req.user.role === 'admin'`
- `api/src/middlewares/errorHandler.js` — generic 500 message
- `api/src/services/auth.js` — role in JWT payload, expiry 14d → 24h
- `api/src/routes/users.js` — adminOnly guard on all routes, role forced to 'operator'
- `api/src/services/participants.js` — checkin() wrapped in Knex transaction
- `api/src/services/email.js` — escapeHtml() added, applied to all user-controlled template values
- `api/src/tests/users.test.js` — new, 8 tests
- `api/package.json` — express-rate-limit added

### Key Decisions
| Decision | Reason |
|----------|--------|
| Rate limiter skips in test mode | Prevents limiter from interfering with test suite's repeated requests |
| Conditional `WHERE status='registered'` instead of read-then-write | Atomic — eliminates TOCTOU race condition without needing a SELECT |
| `escapeHtml` inline utility (no package) | Five character substitutions don't justify a dependency |
| JWT expiry 24h not 8h | Event days can be long; receptionist shouldn't need to re-login mid-event |

### Next Session
- [ ] #6 Add DB indexes migration (events.organization_id, participants.event_id, participants.status)
- [ ] #5 Pagination on list endpoints (?page + ?limit)
- [ ] #7 Store UUID instead of base64 PNG in qr_code column

---

## Session 4 — 2026-03-22

### What We Did
- Ran automated code review and security audit on the full codebase — 2 CRITICAL, 4 HIGH, 8 MEDIUM, 5 LOW findings
- Fixed C1 (CRITICAL): multi-tenant isolation broken for rooms and participants — any authenticated user could access another org's data. Added `assertEventOwnership()` helper in both services, threaded `organizationId` through every function, updated routes to pass `req.user.organization_id`
- Fixed H2 (HIGH): raw `req.body` passed to Knex `.update()` — column injection possible. Added field whitelist (`allowed` array + `Object.fromEntries` filter) in events, rooms, and participants `update()`
- Fixed M2 (MEDIUM): no email format validation. Added `EMAIL_RE` regex check in `participants.create()`, `participants.update()`, and `users.create()`
- Fixed `findOne` on participants to use explicit `.select()` — was returning all columns including CPF to any caller
- Added 2 new tests: cross-org isolation for rooms and participants (both return 404 to org B), invalid email format returns 400
- Test suite: 49/49 passing
- Pushed portaria to GitHub: `github.com/ygor-amorim/portaria` (private) — initial commit, binaries excluded via `.gitignore`
- Created 15 GitHub issues covering all remaining HIGH/MEDIUM/LOW findings (rate limiting, check-in race condition, role/JWT, errorHandler, pagination, indexes, QR storage, room capacity, unaccent, slug validation, password strength, HTML escaping, JWT expiry, nodemailer cleanup, LGPD log)
- Disabled Claude co-author footer on commits globally (`~/.claude/settings.json` — `attribution: { commit: "", pr: "" }`)

### Files Created/Modified
- `api/src/services/rooms.js` — assertEventOwnership, organizationId on all functions, field whitelist on update
- `api/src/services/participants.js` — assertEventOwnership, organizationId on all functions, email validation, field whitelist on update, explicit select on findOne
- `api/src/services/events.js` — field whitelist on update
- `api/src/services/users.js` — email format validation
- `api/src/routes/rooms.js` — passes req.user.organization_id to all service calls
- `api/src/routes/participants.js` — passes req.user.organization_id to all service calls
- `api/src/tests/participants.test.js` — invalid email test, cross-org isolation test
- `api/src/tests/rooms.test.js` — cross-org isolation test
- `.gitignore` — new (excludes node_modules, .env, legacy system binaries)
- `SESSION_ARCHIVE.md` — Sessions 1 and 2 moved here
- `~/.claude/settings.json` — attribution disabled

### Key Decisions
| Decision | Reason |
|----------|--------|
| `assertEventOwnership` inside each service (not shared util) | Each service already has `app` in scope; premature abstraction avoided |
| Field whitelist via `Object.fromEntries` filter | Simple, explicit, no extra deps — unknown keys silently dropped |
| Push to GitHub before creating issues | Issues require a remote; also right time for version control given codebase maturity |
| Exclude `docs/research/legacy-system/Visitmail/` from git | Binary DLLs, .exe, Paradox .DB files — not source code, bloat the repo |
| No new features this session | Stability and security before growth — all CRITICAL/HIGH fixed first |

### Next Session
- [ ] Fix issue #1: rate limiting (`express-rate-limit` on auth + global baseline)
- [ ] Fix issue #2: check-in race condition (Knex transaction + atomic conditional update)
- [ ] Fix issue #3: role in JWT, admin guard, mount `/users` route
- [ ] Fix issue #4: errorHandler generic 500 messages

---

## Session 3 — 2026-03-22

### What We Did
- Built full CRUD for events, rooms, participants, and check-in (all scoped by organization_id)
- Added QR code generation on participant create: `randomUUID()` used as both PK and QR payload, stored as base64 PNG in `qr_code` (text column)
- Fixed `whereIlike is not a function` — Knex uses `.where('name', 'ilike', ...)` not `.whereIlike()`
- Migrated `qr_code` column from `varchar(255)` to `text` (base64 PNG is several KB)
- Set up Jest test suite (~30 tests): auth, events, rooms, participants — happy + sad paths, cross-org isolation, QR format validation
- Added `portaria_test` DB + global setup (migrations before suite), `--runInBand` for serial execution, `cross-env` for Windows-compatible env vars
- Set up email confirmation via Resend (replaced Nodemailer — Microsoft disabled basic SMTP auth for personal accounts)
- Verified Cloudflare Email Routing for `contato@portaria.events` + added Outlook alias for receiving
- Resend domain verified via Cloudflare auto-configure (SPF, DKIM, DMARC records)
- Email template: branded HTML, QR code as CID inline + attachment fallback (Gmail blocks CID; Outlook renders fine)
- Fixed dev.html: `createEvent` renamed to `submitEvent` (browser DOM API collision), added `type="button"` to all buttons
- Added `db:reset` and `dev:fresh` npm scripts for test data management
- Changed server startup message to formatted command table
- Diagnosed pi-agent idle: Pi disk 100% full — incomplete downloads + duplicate files. Deleted via SSH, freed 161G, cron resumed.

### Files Created/Modified
- `api/src/services/participants.js` — QR generation, email send, fixed ilike filter
- `api/src/services/email.js` — Resend-based branded email with CID QR attachment
- `api/src/migrations/20260321000001_alter_participants_qr_code_text.js` — varchar → text
- `api/jest.config.js`, `api/src/tests/setup.js`, `api/src/tests/helpers.js` — test infrastructure
- `api/src/tests/auth.test.js` — 7 tests
- `api/src/tests/events.test.js` — 13 tests
- `api/src/tests/rooms.test.js` — 5 tests
- `api/src/tests/participants.test.js` — 13 tests
- `api/src/scripts/db-reset.js`, `api/src/server.js`, `api/package.json` — scripts + startup message
- `dev.html` — submitEvent rename, type="button" on all buttons
- `TODO.md` — updated

### Key Decisions
| Decision | Reason |
|----------|--------|
| Resend over Nodemailer | Microsoft disabled basic SMTP auth for personal Outlook accounts |
| CID inline + attachment fallback | No perfect cross-client solution without public image hosting |
| `randomUUID()` as QR payload | Participant UUID is unique, scannable, tied to record |
| bcrypt 1 round in test mode | 10 rounds made test suite slow; safe for test env |

### Next Session
- [ ] Code review and security audit
- [ ] Fix any critical findings before building new features

---
