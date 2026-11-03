# Portaria

Event credentialing and check-in system, built to replace **VISITMAIL**, a Windows desktop application written in Delphi in 2005 that is still used to run corporate and academic events in Brazil.

The legacy system belongs to my father's event company. Its source code is lost, its developer is unreachable, and it stores everything (including passwords, in plain text) in Paradox database files that only run on Windows. Portaria rebuilds it as a multi-tenant web API.

**Status:** backend MVP. The API, data model, auth, check-in flow, email confirmations and test suite are done. Frontend, credential PDFs, reports and deployment are next (see [TODO.md](TODO.md)).

---

## Starting from a system with no source code

Before writing any code, I reverse-engineered the legacy application from the outside:

- **Ran it and documented every screen.** 40 annotated screenshots and a ~1,100-line analysis of its menus, workflows, data model and reports ([`docs/research/legacy-system/`](docs/research/legacy-system/)).
- **Read its database layout.** VISITMAIL creates a separate set of Paradox tables for every event (`EVENT`, `EVENT_etiqueta`, `EVENT_presenca`) plus a few global tables. Portaria replaces this with a single relational schema scoped by organization.
- **Found five bugs**, including a crash when opening the participant-type screen that then leaks an open dataset into the rest of the session, and an attendance report that counts check-ins instead of unique participants.
- **Interviewed the people who operate it.** A 52-question form sent to the event staff, with the answers analysed to define the MVP scope ([`docs/planning/`](docs/planning/)).

| | VISITMAIL (2005) | Portaria |
|---|---|---|
| Platform | Windows desktop | Web API |
| Language | Delphi | Node.js |
| Storage | Paradox, one file set per event | PostgreSQL, single multi-tenant schema |
| Passwords | Plain text | bcrypt |
| Access | One machine | Multiple operators, role-based |
| Badges | Printed labels with sequential IDs | QR codes tied to a UUID |

## What the API does

- **Organizations and users.** Signup creates an organization and its first admin in one transaction. Admins create operators (e.g. receptionists); roles travel in a 24h JWT.
- **Events, rooms and participants.** Full CRUD, with rooms enforcing capacity and participants validated against rooms of the same event.
- **Search.** Paginated participant lists, filterable by name, company and status, accent-insensitive via Postgres `unaccent` (it matters for Portuguese names).
- **Registration emails.** Each participant gets a confirmation email via Resend with their QR code, generated on demand from the participant's UUID.
- **Check-in.** Done in a single transaction with a conditional update (`WHERE status = 'registered'`), so two receptionists scanning the same badge at once cannot both succeed. Every check-in is logged with who performed it.

## Security work

After the first working version, I ran a code review and security audit over the whole codebase (2 critical, 4 high, 8 medium, 5 low findings), opened a [GitHub issue](https://github.com/ygor-amorim/portaria/issues?q=is%3Aissue) for each one, and fixed them before adding features. A second, independent review ([`CODEX_CODEBASE_REVIEW.md`](CODEX_CODEBASE_REVIEW.md)) found four more correctness issues, all fixed. Among them:

- **Tenant isolation** was broken on rooms and participants: any authenticated user could read another organization's data. Every query is now scoped by `organization_id`, with cross-tenant tests.
- **Column injection**: raw request bodies reached Knex `.update()`. Updates now go through per-entity field allowlists.
- **Race condition** on check-in, fixed with the transaction described above.
- **HTML injection** in email templates through participant and event names.
- **Rate limiting** (global and a stricter limit on auth), generic 500 responses with errors logged server-side only, and no sensitive fields (password hashes, CPF) in default selects.
- **Sign-in ambiguity** across tenants and **non-atomic signup** that could leave orphan organizations.

## Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 24, Express 5 |
| Database | PostgreSQL 17, Knex (migrations + query builder) |
| Auth | JWT, bcryptjs, role-based middleware |
| Security | helmet, cors, express-rate-limit |
| Email | Resend (SPF/DKIM/DMARC on a verified domain) |
| QR codes | qrcode |
| Tests | Jest + Supertest, 74 integration tests against a dedicated test database |

Routes handle HTTP and services hold the business logic; routes never query the database directly.

## Running locally

Requires Node.js 24 and PostgreSQL with the `unaccent` extension available.

```bash
cd api
npm install
cp .env.example .env        # fill in DB credentials and JWT_SECRET
npm run migrate
npm run dev                 # or: npm run dev:fresh to reset the DB first
```

`dev.html` at the repository root is a small browser console for exercising the endpoints by hand.

Tests run against a separate `portaria_test` database:

```bash
npm test
```

## How this was built

Solo project. I wrote it with Claude Code configured as a mentor rather than an autocompleter ([`CLAUDE.md`](CLAUDE.md)): it challenges me to write familiar patterns myself and explains new ones before I use them. Each working session is logged in [`SESSION_LOG.md`](SESSION_LOG.md) with what changed and why, and technical decisions are recorded in [`docs/development/decisions.md`](docs/development/decisions.md).
