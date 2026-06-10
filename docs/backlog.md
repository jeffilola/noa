# Product backlog

Prioritized work for Noa. **Top = do first.** Move items to GitHub Issues when they are ready for a sprint (acceptance criteria filled in).

Legend: **S** / **M** / **L** size · **Epic** tag · Milestone when scheduled

---

## Now — Overnight review queue

**Status:** M7-M11 slices are prepared for human review. GitHub milestones/issues still need final human-side reconciliation if automation write access is unavailable.

| Milestone | Theme | Test guide |
|-----------|-------|------------|
| M7 | Learning records on access decisions | [m7-testing.md](./m7-testing.md) |
| M8 | Wallet pass preview stub | [m8-testing.md](./m8-testing.md) |
| M9 | Platform admin org list with search | [m9-testing.md](./m9-testing.md) |
| M10 | Integration admin test-mode provider form | [m10-testing.md](./m10-testing.md) |
| M11 | CI lint/build split | [m11-testing.md](./m11-testing.md) |

---

## Done — Sprint 7 (M7: Learning records for access decisions)

Issues #52–#56 target this milestone. Compliance records replace training/certification stubs in the org member access panel. Testing: [m7-testing.md](./m7-testing.md). Demo: [demos/2026-06-11-m7.md](./demos/2026-06-11-m7.md).

---

## Done — Sprint 6 (M6: Site access history)

Issues #44–#48 merged in PR #49. Access events, org access decision panel, `/org/access`, holder `/user/access`. Testing: [m6-testing.md](./m6-testing.md). Demo: [demos/2026-06-10.md](./demos/2026-06-10.md).

---

## Done — Sprint 5 (M5: Design system & light/dark UI)

Issues #39–#42 merged in PR #43. Light/dark tokens, theme toggle, marketing parity, mobile nav fixes, QA scripts.

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

## Later — unscheduled (after M6)

### Identity Holder
- ~~Privacy: GDPR export download UX~~ → M4 #35
- ~~Privacy: account deletion request flow~~ → M4 #36
- ~~Wallet pass preview (stub UI)~~ → M8
- Mobile app shell (Expo) smoke screen

### Org / Platform / Security / Compliance
- ~~Platform admin: org list with search~~ → M9
- Security admin: revocation request workflow (orchestration only)
- Compliance: export job + download
- ~~Integration admin: provider connection form (stub test)~~ → M10

### Infrastructure & quality
- Staging: Vercel (web) + API host + managed Postgres
- Sentry for web + API
- ~~Split CI: lint job vs build job~~ → M11
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

Last updated: 2026-06-10
