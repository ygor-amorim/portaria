# Portaria — TODO

Quick-reference task list. Full roadmap at `docs/development/TODO.md`.
GitHub issues: https://github.com/ygor-amorim/portaria/issues

---

## Now (security — next session)

- [ ] #1 Rate limiting on auth + global baseline (`express-rate-limit`)
- [ ] #2 Check-in race condition — wrap in Knex transaction + atomic conditional update
- [ ] #3 Role in JWT payload + admin guard + mount `/users` route in app.js
- [ ] #4 errorHandler: return generic message on 500s (currently leaks DB schema info)

## Next (features)

- [ ] #8 Room capacity enforcement on participant create/update
- [ ] #9 Accent-insensitive search (`unaccent` extension + `whereRaw`)
- [ ] Excel/CSV import for participants
- [ ] Credential PDF generation (PDFKit)
- [ ] Reports: attendance summary, by-room

## Soon (scalability + cleanup)

- [ ] #5 Pagination on all list endpoints (?page + ?limit)
- [ ] #6 DB indexes migration (events.organization_id, participants.event_id, participants.status)
- [ ] #7 Store UUID instead of base64 PNG in qr_code column (generate on demand)
- [ ] #14 Remove nodemailer from package.json (replaced by Resend)
- [ ] #10 Slug format validation on signup
- [ ] #11 Password strength requirement (min 8 chars)
- [ ] #12 HTML-encode user strings in email templates
- [ ] #13 Shorten JWT expiry + signout endpoint
- [ ] #15 Log participant ID instead of email (LGPD)
- [ ] QR code inline in email: requires public URL hosting (solve when frontend deployed)
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
- [x] Jest test suite (auth, events, rooms, participants — 49 tests, all passing)
- [x] db:reset + dev:fresh npm scripts
- [x] Raspberry Pi disk freed (161G recovered, pi-agent cron resumed)
- [x] Multi-tenant isolation enforced on rooms and participants (C1 — CRITICAL)
- [x] Field whitelist on all update() calls — prevents column injection (H2 — HIGH)
- [x] Email format validation on participant and user creation (M2 — MEDIUM)
- [x] Pushed to GitHub (github.com/ygor-amorim/portaria, private)
- [x] 15 GitHub issues created for all remaining findings
