# Product backlog

Prioritized work for Noa. **Top = do first.** Move items to GitHub Issues when they are ready for a sprint (acceptance criteria filled in).

Legend: **S** / **M** / **L** size · **Epic** tag · Milestone when scheduled

---

## Now — Sprint 5 (M5: Design system & light/dark UI)

| P | Size | Item | Epic | Issue |
|---|------|------|------|-------|
| 1 | M | Semantic design tokens + theme provider | Platform | #39 |
| 2 | M | Theme toggle + Clerk appearance sync | Platform | #40 |
| 3 | M | Marketing pages theme-aware | Platform | #41 |
| 4 | S | UX visual QA pass (holder + org) | Platform | #42 |

**Milestone:** [M5: Design system & light/dark UI](https://github.com/jeffilola/noa/milestone/5)  
**Goal:** Cohesive light/dark experience across marketing and dashboards before staging.

---

## Done — Sprint 4 (M4: Holder trust / GDPR)

Issues #35–#37 merged in PR #38. GDPR export, account deletion, consolidated security page.

---

## Done — Sprint 3 (M3: PACS ingest demo)

Issues #30–#33 merged. Mock HID webhook → credential in holder UI; PACS/NOA badges; org integrations status.

See [m3-local-testing.md](./m3-local-testing.md).

---

## Done — Sprint 2 (M2: Org admin read-only)

Org overview, users, credentials, audit, role-based nav. Milestone closed.

---

## Done — Sprint 1 (M1: Holder dashboard usable)

Issues #1–#4 merged. Holder dashboard demo-ready with seed data.

---

## Later — unscheduled (after M5)

### Identity Holder
- ~~Privacy: GDPR export download UX~~ → M4 #35
- ~~Privacy: account deletion request flow~~ → M4 #36
- Wallet pass preview (stub UI)
- Mobile app shell (Expo) smoke screen

### Org / Platform / Security / Compliance
- Platform admin: org list with search
- Security admin: revocation request workflow (orchestration only)
- Compliance: export job + download
- Integration admin: provider connection form (stub test)

### Infrastructure & quality
- Staging: Vercel (web) + API host + managed Postgres
- Sentry for web + API
- Split CI: lint job vs build job
- API integration tests for `/users/me`, `/credentials` scoping
- Runbook: Clerk key mismatch

### v2 / deferred
- Noa-led issuance via HID/Brivo outbound APIs
- Lenel Elements read API enrichment
- Live HID Origo sandbox credentials

---

## Epics (labels)

Use GitHub labels when creating issues:

| Label | Scope |
|-------|--------|
| `epic:holder` | `/user/*` Identity Holder |
| `epic:org` | `/org/*` Org Admin |
| `epic:rbac` | Roles, permissions, nav |
| `epic:integrations` | Webhooks, providers, PACS |
| `epic:compliance` | Audit, exports, compliance dashboards |
| `epic:infra` | CI, staging, observability |
| `epic:quality` | Tests, DoD, tooling |

---

## How to use this file

1. Pick the **current milestone** (see [sprint planning](./sprint-planning.md)).
2. Create a **Feature** issue per row with acceptance criteria from the template.
3. Add **Test procedures** at the end of every issue — plain step-by-step checks anyone can run when the work is done.
4. Move issues to **Ready** on the project board.
4. When done, check off here or remove the row (GitHub Issues are the source of truth during the sprint).

Last updated: 2026-06-05
