# Session Archive

Full history of past sessions. Only read if older context is needed.

---

## Session 1 — 2025-12-28

### What We Did
- Established workflow system (CLAUDE.md, SESSION_LOG.md, SESSION_ARCHIVE.md)
- Reviewed all project documentation (executive summary, technical spec, planning docs)
- Explored legacy system installer archive (Visitmail folder)
- Extracted complete database schema from binary Paradox files via PowerShell
- Found critical security issue: passwords stored in plain text in Usuario.db
- Analyzed legacy credential/badge PDFs — very basic (name + barcode only)
- Analyzed legacy Excel import format (11 columns, exact order required)
- Analyzed 4 legacy report types with filter options

### Key Discoveries
- Legacy system: Delphi app, Paradox DB, Win95-Win2K only, passwords in plain text
- Each event creates 3 dynamic tables ({EVENT}.DB, {EVENT}_etiqueta.DB, {EVENT}_presenca.DB)
- Network reliability was a major pain point — manual data export/merge workflow at venues
- Participant table had 17 fields including obsolete ones (Fax, full address, DDD)
- Import format was inflexible — clients had to match exact column order

### Files Created
- `CLAUDE.md`, `SESSION_LOG.md`, `SESSION_ARCHIVE.md`
- `docs/development/TODO.md` — updated with legacy analysis findings

---

## Session 2 — 2025-12-31

### What We Did
- Analyzed father's 52 questionnaire responses (CSV + PDF)
- Confirmed: problem is stability, not features; email confirmation is the only CRÍTICA feature
- Discovered MUST-HAVE: Excel import (workflow depends on it); Rooms is a new feature legacy lacks
- Occam's Razor MVP decisions: PDF first, thermal printing Phase 2, certificates Phase 2
- Created `api/` folder with full Express + Knex + pg scaffold
- Set up PostgreSQL `portaria` database, server running on port 3002

### Files Created
- `api/package.json`, `api/knexfile.js`, `api/.env.example`
- `api/src/app.js`, `api/src/server.js`, `api/src/config/database.js`

### Key Decisions
| Decision | Reason |
|----------|--------|
| PDF before thermal printing | Occam's razor — simpler first |
| Excel import as MUST-HAVE | Father's workflow depends on it — not optional |
| Rooms as new feature | Legacy didn't have it; validated need in questionnaire |

