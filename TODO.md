# Portaria — TODO

Quick-reference task list. Full roadmap at `docs/development/TODO.md`.

---

## Now

- [ ] Accent-insensitive search: `unaccent` extension + `whereRaw` on participants `findAll`
- [ ] Excel/CSV import for participants
- [ ] Credential PDF generation (PDFKit)
- [ ] Remove nodemailer (replaced by Resend, still in package.json)

## Next

- [ ] Reports: attendance summary, by-room
- [ ] QR code inline in email: requires public URL hosting (solve when frontend is deployed)
- [ ] Users route: register `POST /users` in app.js (route exists, not mounted)

## Soon

- [ ] Deploy (Railway or Render — decision pending)
- [ ] Frontend approach decision (React próprio, Retool/Appsmith, or freelancer)

## Decisions Pending

- [ ] Validation library: Joi or Zod?
- [ ] Deploy target: Railway or Render?
- [ ] Frontend approach: React próprio, Retool/Appsmith, or freelancer?

---

## Done

- [x] Legacy system analysis (VISITMAIL)
- [x] Questionnaire (father, 30/12/2025)
- [x] MVP scope defined
- [x] API scaffolding (Express, Knex, pg, JWT, bcrypt)
- [x] PostgreSQL database created (`portaria`, port 5432)
- [x] All 6 migrations written (organizations → users → events → rooms → participants → check_ins)
- [x] Auth: signup, signin, JWT middleware
- [x] Events CRUD (scoped by organization_id)
- [x] Rooms CRUD (scoped by event_id)
- [x] Participants CRUD + filters (name, company, status)
- [x] Check-in endpoint (guards duplicate, logs to check_ins table)
- [x] dev.html testing console (fixed createEvent naming collision)
- [x] QR code generation on participant create (stored as base64 PNG in DB)
- [x] Email confirmation via Resend (domain verified, QR as attachment + CID)
- [x] Jest test suite (auth, events, rooms, participants — ~30 tests, all passing)
- [x] db:reset + dev:fresh npm scripts
- [x] Raspberry Pi disk freed (161G recovered, pi-agent cron resumed)
