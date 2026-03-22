# CLAUDE.md - Project Guide for AI Agent

## Session Start Protocol

**At the beginning of every session, read these files in order:**

1. `CLAUDE.md` (this file) - project context and instructions
2. `SESSION_LOG.md` - last 3 sessions (recent history)
3. `docs/development/TODO.md` - pending tasks

**Note:** `SESSION_ARCHIVE.md` contains full history but is NOT read at startup. Only reference it if you need older context. At session end, if SESSION_LOG.md has 4+ sessions, move the oldest to the archive.

---

## Project Overview

**Portaria** is an Event Credentials/Check-in System built as a modern web replacement for a legacy Windows desktop application (VISITMAIL, 2005).

| Item | Value |
|------|-------|
| **Domain** | portaria.events |
| **Email** | contato@portaria.events |
| **Trademark** | PORTARIA EVENTS (free in INPI classes 41 & 42) |
| **Target market** | Medium corporate/educational events (50-500 pax) |

---

## Directory Structure

```
portaria/
├── CLAUDE.md                    # THIS FILE - AI agent guide
├── SESSION_LOG.md               # Last 3 sessions
├── SESSION_ARCHIVE.md           # Older sessions (reference only)
├── CHANGELOG.md                 # Project milestones and decisions
├── README.md                    # Project readme (TBD)
│
├── docs/
│   ├── 01-especificacao-tecnica.md  # Full technical spec (30+ pages)
│   │
│   ├── development/
│   │   ├── TODO.md              # MVP roadmap (6 phases, target June 2026)
│   │   └── decisions.md         # Technical decisions log
│   │
│   ├── planning/
│   │   ├── brainstorming-nomes.md           # Name research → "Portaria"
│   │   ├── analise-disponibilidade-dominios-marcas.md  # Domain/trademark research
│   │   ├── questionario-sistema-legado.md   # 52-question form for father
│   │   ├── google-forms-script.md           # Copy/paste script for form
│   │   └── sanity-check-2025-12-26.md       # Viability check with Claude
│   │
│   └── research/
│       ├── conflitos-marca-inpi-descoberta.md  # INPI trademark conflict analysis
│       └── legacy-system/
│           ├── analise-sistema-legado-visitmail.md  # COMPREHENSIVE ANALYSIS (1095 lines)
│           ├── prints/
│           │   └── ANOTACOES.md             # Raw notes from UI exploration
│           └── Visitmail/                   # Actual legacy system files
│               ├── polhonueventos.exe       # Main executable (Delphi)
│               ├── DADOS/                   # Paradox database files (.DB, .PX, .MB)
│               └── Common/Borland Shared/   # BDE (Borland Database Engine)
│
└── src/                         # (To be created - API source code)
```

---

## Documentation Quick Reference

| Need to understand... | Read this file |
|-----------------------|----------------|
| Full technical specification | `docs/01-especificacao-tecnica.md` |
| MVP roadmap & tasks | `docs/development/TODO.md` |
| **Legacy system analysis** | `docs/research/legacy-system/analise-sistema-legado-visitmail.md` |
| Brand/trademark decisions | `docs/research/conflitos-marca-inpi-descoberta.md` |
| Naming decision | `docs/planning/brainstorming-nomes.md` |

---

## Legacy System Summary (VISITMAIL)

**Full analysis:** `docs/research/legacy-system/analise-sistema-legado-visitmail.md`

- **Owner:** Olho Nú (father's event company)
- **Developer:** Single unnamed contractor (2005)

| Aspect | Legacy (VISITMAIL) | New (Portaria) |
|--------|-------------------|----------------|
| **Age** | 20 years (2005) | 2025 |
| **Language** | Delphi (Object Pascal) | Node.js |
| **Database** | Paradox (Borland) | PostgreSQL |
| **Platform** | Windows desktop only | Web-based |
| **Security** | Passwords in plain text | bcrypt + JWT |
| **Architecture** | Multi-file per event | Single DB, multi-tenant |

**Critical bugs found:** 5 (including crashes, validation issues, dataset leaks)

**Key insight:** System is functional but obsolete and unstable. Full replacement justified.

---

## Architecture (New System)

```
src/
├── config/        # Database and app configuration
├── middlewares/   # Auth, error handling, validation
├── migrations/    # Knex database schema versions
├── routes/        # HTTP endpoint handlers
├── seeds/         # Test data (optional)
└── services/      # Business logic (validation, queries)
```

**Pattern:** Routes handle HTTP, Services handle logic. Routes call services, never query DB directly.

### Module Patterns

| Pattern | Structure | Needs `(app)`? | Used For |
|---------|-----------|----------------|----------|
| Factory | `module.exports = (app) => { return {...} }` | Yes | Services, Routes |
| Plain | `module.exports = (req, res, next) => {...}` | No | Middlewares |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js v24 |
| Framework | Express |
| Database | PostgreSQL 17 |
| Query Builder | Knex |
| Auth | JWT (jsonwebtoken) |
| Password Hashing | bcryptjs |
| Security | helmet, cors |
| PDF Generation | jsPDF or PDFKit (TBD) |
| QR Code | qrcode |
| Email | Nodemailer or SendGrid (TBD) |
| Validation | Joi or Zod (TBD) |

---

## Code Style

- **Naming:** camelCase for variables/functions, PascalCase for classes
- **Columns:** snake_case in database (user_id), camelCase in JS
- **Async:** Use async/await, not callbacks
- **Validation:** Check required fields in services, throw Error with message
- **Security:** Never return password fields, always filter by organization_id for multi-tenant isolation

---

## Agent Instructions

### Mentorship Style

- Challenge user to write code when pattern is familiar
- Guide step-by-step when concept is new
- User prefers to write code themselves when possible
- Always explain the "why" - user wants to internalize, not just copy

### How to Explain

- Explain the **why** alongside the **what** while writing code
- Be a guide, not paternalistic - user wants to understand and internalize
- User is a "wordcel" - prefer verbal explanations over complex diagrams
- Break down regex and syntax when introducing new patterns

### How to Code

- Write original code based on knowledge of libraries and patterns
- Do not copy from StackOverflow/GitHub - use understanding of docs and principles
- Keep it simple - no over-engineering
- Always use environment variables for secrets (never hardcode)

### Communication Style

- Concise but thorough
- Use tables for comparisons
- Confirm user's understanding before moving on when they recap

### Debugging Mode

When user shares an error:
1. Assess if user has seen this pattern before (based on session history)
2. If yes: nudge: "You've seen this before, look carefully"
3. If no: interpret and explain

User overrides:
- "just fix it": Claude fixes without explanation
- "teach me": Claude guides through parsing even if new

No judgment either way - user decides based on energy/time.

---

## Security Practices

- All secrets in `.env` (gitignored)
- `.env.example` contains only placeholders
- JWT secret from environment variable
- Passwords hashed with bcrypt (10 rounds)
- Protected routes use auth middleware
- Always filter queries by organization_id (multi-tenant isolation)
- Vague error messages for auth (prevents enumeration)

---

## Key Decisions

| Decision | Reason |
|----------|--------|
| bcryptjs over bcrypt-nodejs | bcrypt-nodejs is deprecated since 2014 |
| jsonwebtoken over jwt-simple | More features, better maintained |
| Knex over raw SQL | Migrations, query builder, multi-DB support |
| Service/Route separation | Testability, separation of concerns |
| PostgreSQL | Relational data, ACID compliance, production-ready |
| Multi-tenant via organization_id | Simpler than separate DBs, scales well |
| UUID primary keys | Security (no sequential enumeration), distributed-friendly |
| QR Code over barcode | Modern, works with phone cameras, more data capacity |
| Web over desktop | Zero installation, multi-user, accessible anywhere |

---

## Database Schema

### Multi-tenant hierarchy

```
Organization (tenant)
├── User (organizer/receptionist)
├── Event
│   ├── Room (track/session)
│   └── Participant
│       └── CheckIn (history)
```

### Tables

**organizations** - id (UUID), name, slug, logo_url, created_at, updated_at

**users** - id (UUID), organization_id (FK), email, password_hash, name, role, created_at, updated_at

**events** - id (UUID), organization_id (FK), code, name, description, start_date, end_date, location, logo_url, created_by (FK), created_at, updated_at

**rooms** - id (UUID), event_id (FK), name, capacity, description, created_at, updated_at

**participants** - id (UUID), event_id (FK), room_id (FK), name, email, cpf, company, job_title, phone, qr_code, status (registered/checked_in/absent), checked_in_at, custom_fields (JSONB), created_at, updated_at

**check_ins** - id (UUID), participant_id (FK), checked_in_by (FK), timestamp, method

---

## Environment Notes

- OS: Windows
- Shell: PowerShell (use `Invoke-RestMethod`, not `curl`)
- Run server from project root: `node src/server.js` (for dotenv to find `.env`)

---

## API Endpoints (Planned)

### Auth
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /auth/signup | No | Register organization + first user |
| POST | /auth/signin | No | Login, get JWT |

### Events
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /events | Yes | List organization's events |
| POST | /events | Yes | Create event |
| GET | /events/:id | Yes | Get event details |
| PUT | /events/:id | Yes | Update event |
| DELETE | /events/:id | Yes | Delete event |

### Rooms
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /events/:eventId/rooms | Yes | List event's rooms |
| POST | /events/:eventId/rooms | Yes | Create room |
| PUT | /events/:eventId/rooms/:id | Yes | Update room |
| DELETE | /events/:eventId/rooms/:id | Yes | Delete room |

### Participants
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /events/:eventId/participants | Yes | List participants |
| POST | /events/:eventId/participants | Yes | Register participant |
| GET | /events/:eventId/participants/:id | Yes | Get participant |
| PUT | /events/:eventId/participants/:id | Yes | Update participant |
| DELETE | /events/:eventId/participants/:id | Yes | Delete participant |

### Check-in
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /events/:eventId/participants/:id/checkin | Yes | Mark presence |
| GET | /events/:eventId/participants/:id/credential | Yes | Generate credential PDF |

### Public (no auth)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /register/:eventCode | No | Public registration form data |
| POST | /register/:eventCode | No | Submit registration |

### Reports
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /events/:eventId/reports/attendance | Yes | Attendance summary |
| GET | /events/:eventId/reports/by-room | Yes | Attendance by room |

---

## Current State

See `SESSION_LOG.md` for detailed history and `docs/development/TODO.md` for pending tasks.
