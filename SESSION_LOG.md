# Session Log

Last 3 sessions. Older sessions are in `SESSION_ARCHIVE.md`.

---

## Session 1 - 2025-12-28

### Context

First session using the standardized workflow (adapted from cofrinho-api). Previous planning work was done in web Claude sessions before this project had a formal structure.

### What We Did

#### 1. Established Workflow System
- Created `CLAUDE.md` with full project context, directory structure, and AI agent instructions
- Created `SESSION_LOG.md` (this file)
- Created `SESSION_ARCHIVE.md` (empty, for future use)
- Adapted workflow from cofrinho-api project

#### 2. Reviewed All Project Documentation
Read and understood all existing docs:
- `docs/01-especificacao-tecnica.md` - Full technical spec (30+ pages)
- `docs/development/TODO.md` - MVP roadmap
- `docs/planning/*` - All planning docs
- `docs/research/*` - INPI trademark analysis, legacy system analysis

#### 3. Updated TODO.md
- Marked legacy analysis as DONE
- Marked cofrinho-API core as DONE (only tests remaining)
- Added legacy analysis findings summary
- Updated milestones table with current status

#### 4. Explored Legacy System Installer Archive
Location: `docs/research/legacy-system/Visitmail/`

**Key config file findings:**
- **DBDWORK.INI** - Database path: `C:\visitmail\dados`
- **Setup.ini** - Supported OS: Win95-Win2K only
- **idapi.cnf** - Paradox 7 format, DBWINUS0 language driver

**Important correction:** The Excel file `Lista de Presença__10.07.2019__Niterói.xlsx` is NOT an export - it was a failed IMPORT from a client (system required specific formatting).

#### 5. Explored Live Installation at C:\VISITMAIL

**Directory structure:**
```
C:\VISITMAIL\
├── polhonueventos.exe           # Main app (2.5MB)
└── DADOS/                       # Database folder
    ├── Global tables (7 files)
    ├── TECH2004.* (3 files)     # Sample event from 2004
    ├── PORT25.* (3 files)       # Test event created today
    └── PORTARIA25.* (3 files)   # Test event created today
```

**File sizes analysis:**
- Eventos.MB: 360KB (BLOB file with logos - has actual data)
- Most .DB files: 4KB (minimum Paradox block size)
- Recent activity (28/12/2025) on multiple files - user was testing

#### 6. Extracted Complete Database Schema

Used PowerShell to extract ASCII strings from binary Paradox files.

**CRITICAL SECURITY FINDING - Plain text passwords:**
```
Usuario.db contains passwords in PLAIN TEXT:
- FALCÃO: KHM001
- PAULO AFONSO: PAULO
- PAULO MAIA: PAULO
```

### Complete Legacy Database Schema

#### Global Tables

| Table | Fields | Notes |
|-------|--------|-------|
| **Usuario** | Username, Nomecompleto, Perfil, Senha | Passwords in plain text! |
| **Eventos** | Evento, Numeroevento, Bancodados, Imagem, Icone, Usuario, Atualizacao | Bancodados = DB name for event |
| **Tipo_participante** | Codigo, Descricao, Usuario, Atualizacao | AP=Apoio, CG=Congressista, etc |
| **Atividade_participante** | Codigo, Descricao, Usuario, Atualizacao | CO=Comércio, IN=Indústria, etc |
| **uf** | Codigo, Descricao, Usuario, Data | Brazilian states (19 entries) |
| **parametros** | Dataprocessada | Last processed date |
| **erro** | (unknown) | Error log |

#### Per-Event Tables (created dynamically per event)

| Table | Fields | Notes |
|-------|--------|-------|
| **{EVENT}.DB** | Nome, Empresa, Numeroparticipante, Cargo, Tipo, Endereco, TipoEndereco, Bairro, Cidade, Uf, Cep, Ddd, Telefone, Fax, Email, Atividade, Atualizacao, Usuario | **17 fields!** Way too many |
| **{EVENT}_etiqueta.DB** | Numeroparticipante, Data, Hora, Usuario | Badge print log |
| **{EVENT}_presenca.DB** | Numeroparticipante, Data, Hora, Usuario | Check-in log |

#### Sample Data Found

**Users:** ADMIN, FALCÃO (Carlos Alberto Falcão), PAULO AFONSO (Paulo Afonso Monteiro), PAULO MAIA

**Events:** PORTARIA (db: PORTARIA25), TECHMODA (db: TECH2004)

**Participant Types:** AP (Pessoal de Apoio), CG (Congressista), SO (Sonorização), SS (AA)

**Activities:** CO (Comércio), IN (Indústria), OU (Outros)

### Key Discoveries

1. **Security disaster:** Passwords stored in plain text
2. **Over-engineered participant table:** 17 fields including obsolete ones (Fax, full address)
3. **Dynamic table creation:** Each event creates 3 new tables ({EVENT}, {EVENT}_etiqueta, {EVENT}_presenca)
4. **Multi-file architecture:** Paradox uses .DB (data) + .PX (index) + .MB (blobs)
5. **BDE dependency:** Borland Database Engine required, configured via alias "dolhonu"
6. **Network reliability issues:** System has network support, but event venues often have unreliable/no network. Fallback was manual data export to each PC + FREQMDB standalone at room entrances + manual merge after. Portaria's web-based architecture solves this (works over any internet connection, including mobile data).

#### 7. Analyzed Legacy Example Files
Location: `docs/research/legacy-system/exemplos/`

**Credentials (etiqueta.pdf, etiqueta3.pdf, ETIQ4.pdf):**
- Very basic layout: Name + Event + Barcode only
- Barcode format: "VISITMAIL XXXXXX" (6-digit sequential ID)
- Missing: company, participant type, logo, room assignment
- Lots of wasted white space
- Portaria opportunity: much richer, professional credentials

**Import Format (parti.xlsx):**
```
NOME | EMPRESA | CARGO | ENDEREÇO | BAIRRO | CEP | CIDADE | ESTADO | TELEFONE | FAX | E-MAIL
```
- 11 columns required in exact order
- System was inflexible - columns had to match exactly
- Portaria improvement: auto-detect columns, flexible order, skip obsolete fields

**Reports (4 types analyzed):**

1. **Relação Participantes** - All registered
   - Columns: Participante | Empresa | Cargo | Tipo | Telefone | Email
   - Footer: TOTAL PARTICIPANTES

2. **Relação com Controle de Presença** - Attendance report
   - Same + period filter
   - Bug: counts check-ins not unique participants

3. **Relação Etiquetas Emitidas** - Badge audit trail
   - Columns: Participante | Empresa | Cargo | Tipo | **Usuário** | **Emissão** | **Hora**
   - Shows who printed, when (audit)

4. **Cadastro de Tipos** - Simple type list

**Report Filters Available:**
- By Company, By Type, By Period, Attended vs All
- Graphs exist but possibly broken (3 options)

### Schema Simplification for Portaria

| Legacy Field | Keep? | Notes |
|--------------|-------|-------|
| Nome | Yes | Essential |
| Empresa | Yes | Essential |
| Cargo | Yes | Useful |
| Email | Yes | Essential for confirmation |
| Telefone | Yes | Merge DDD into single field |
| Tipo | Yes | Participant type |
| Atividade | Maybe | Could be optional |
| Endereco, Bairro, Cidade, Uf, Cep | No | Unnecessary for credentials |
| TipoEndereco | No | Obsolete |
| Fax | No | Obsolete |
| DDD | No | Merge with Telefone |

### Files Created/Modified
- `CLAUDE.md` - new
- `SESSION_LOG.md` - new (this file)
- `SESSION_ARCHIVE.md` - new
- `docs/development/TODO.md` - updated

### Technical Notes

**Paradox file types:**
- `.DB` - Data file
- `.PX` - Primary index
- `.MB` - Memo/BLOB (binary large objects)
- `.VAL` - Validity checks

**Reading Paradox from PowerShell:**
```powershell
[System.Text.Encoding]::ASCII.GetString([System.IO.File]::ReadAllBytes('file.db')) -replace '[^\x20-\x7E]', ' '
```

**BDE alias:** `dolhonu` → `C:\visitmail\dados`

### Session Conclusion

**Status:** Legacy analysis COMPLETE. Ready for planning phase.

**Accomplished:**
- ✅ Workflow system established (CLAUDE.md, SESSION_LOG.md, SESSION_ARCHIVE.md)
- ✅ Complete legacy database schema extracted from Paradox files
- ✅ Plain text passwords confirmed (security issue)
- ✅ Network architecture pain point documented
- ✅ Credential/badge format analyzed
- ✅ Excel import format documented (11 columns, inflexible)
- ✅ 4 report types analyzed with filter options
- ✅ TODO.md updated with completed items

**Waiting for:**
- Questionnaire responses from father (expected this week)

**Next session:**
1. Review questionnaire responses
2. Design PostgreSQL schema based on real requirements
3. Plan API endpoints
4. Start portaria-api project setup

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
- Diagnosed pi-agent idle since Thursday: Pi disk 100% full — two incomplete `.part` downloads (91G + 24G) + duplicate Dune Part Two (35G×2). Deleted via SSH, freed 161G, disk at 91%, cron resumed.

### Files Created/Modified
- `api/src/services/participants.js` — QR generation, email send, fixed ilike filter
- `api/src/services/email.js` — Resend-based branded email with CID QR attachment
- `api/src/migrations/20260321000001_alter_participants_qr_code_text.js` — varchar → text
- `api/jest.config.js` — test config with globalSetup, 30s timeout
- `api/src/tests/setup.js` — runs migrations on test DB before suite
- `api/src/tests/helpers.js` — truncateAll(), signupAndGetToken(), authHeader()
- `api/src/tests/auth.test.js` — 7 tests
- `api/src/tests/events.test.js` — 13 tests (includes cross-org isolation)
- `api/src/tests/rooms.test.js` — 5 tests
- `api/src/tests/participants.test.js` — 13 tests (filters, QR format, checkin, double-checkin guard)
- `api/src/scripts/db-reset.js` — truncates all tables
- `api/src/server.js` — startup message rewritten as command table
- `api/package.json` — added dev:fresh, db:reset, updated test script
- `portaria/dev.html` — submitEvent rename, type="button" on all buttons
- `portaria/TODO.md` — updated with current done/pending state

### Key Decisions
| Decision | Reason |
|----------|--------|
| Resend over Nodemailer | Microsoft disabled basic SMTP auth for personal Outlook accounts |
| CID inline + attachment fallback | No perfect cross-client solution without public image hosting; Outlook renders CID, Gmail needs attachment |
| QR code column as `text` | Base64 PNG is several KB — well beyond varchar(255) limit |
| bcrypt 1 round in test mode | 10 rounds made test suite take ~30s; 1 round is safe for test env |
| Fire-and-forget email | Participant creation must not block on email failure |
| `randomUUID()` as QR payload | Simple — participant UUID is unique, scannable, tied to record |

### Next Session
- [ ] Accent-insensitive search: `unaccent` extension + `whereRaw` on participants findAll
- [ ] Excel/CSV import for participants
- [ ] Credential PDF generation (PDFKit)
- [ ] Remove nodemailer from package.json (replaced by Resend, still listed)
- [ ] Mount `/users` route in app.js (route exists, not registered)

---

## Session 2 - 2025-12-31

### Context

Questionnaire answered by father (30/12). Session to analyze responses and start API setup.

### What We Did

#### 1. Questionnaire Analysis
- Read father's 52 responses (CSV + PDF)
- Cross-checked Claude Web's analysis (`analise-questionario-sistema-legado.md`)
- **Key insight confirmed:** Problem is stability, not features
- **Only CRÍTICA feature:** Email confirmation
- **MUST-HAVE discovered:** Excel import (workflow depends on it)
- **NEW feature:** Rooms/salas (legacy didn't have)

#### 2. Occam's Razor MVP Decisions
- PDF first, thermal printing Phase 2
- Certificates Phase 2
- Pricing discussion after functional MVP

#### 3. Updated TODO.md
- Marked questionnaire as DONE
- Added questionnaire findings section
- Updated MVP definition (Excel import added)
- Updated milestones

#### 4. API Scaffolding
Created `api/` folder with full structure:
```
api/
├── package.json (express, knex, pg, dotenv, jsonwebtoken, bcryptjs, helmet, cors)
├── .env
├── .env.example
├── knexfile.js
└── src/
    ├── app.js (Express + middlewares)
    ├── server.js (listen on PORT)
    └── config/
        └── database.js (Knex connection)
```

#### 5. PostgreSQL Setup
- Started PostgreSQL service
- Created `portaria` database
- Server running on port 3002

### Session Conclusion

**Status:** API scaffolding COMPLETE. Server running.

**Accomplished:**
- ✅ Questionnaire analyzed and validated
- ✅ TODO.md updated with findings
- ✅ API folder structure created
- ✅ Dependencies installed
- ✅ Express app configured
- ✅ PostgreSQL running with portaria database
- ✅ Server running on port 3002

**Next session:**
1. Create migrations (organizations, users, events, rooms, participants, check_ins)
2. Set up auth routes (signup, signin)
3. Start building core routes/services

---
