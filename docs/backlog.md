# Product backlog

Prioritized work for Noa. **Top = do first.** Move items to GitHub Issues when they are ready for a sprint (acceptance criteria filled in).

Legend: **S** / **M** / **L** size · **Epic** tag · Milestone when scheduled

---

## Now — Sprint 1 (M1: Holder dashboard usable)

| P | Size | Item | Epic | Notes |
|---|------|------|------|-------|
| 1 | S | Polish holder overview (`/user`) empty states + API-offline copy | Holder | Quick win |
| 2 | M | Identity hub: profile save feedback + validation errors | Holder | Phone/DOB in contact section; Photo ID via Clerk (upload/PACS later) |
| 3 | M | Devices panel: register/deactivate with clear success/error toasts | Holder | API must be up |
| 4 | S | Security page: link privacy + session info stub | Holder | |
| 5 | M | Seed demo holder data script for local demos | Holder | `pnpm db:seed` extension |
| 6 | S | Holder dashboard smoke test in CI (build-only or Playwright later) | Quality | Optional this sprint |

**Milestone:** [M1: Holder dashboard usable](https://github.com/jeffilola/noa/milestone/1)  
**Goal:** A signed-in Identity Holder can demo profile, credentials (empty or seeded), devices, and navigation without HID/Brivo.

---

## Next — Sprint 2 (M2: Org admin read-only)

| P | Size | Item | Epic | Notes |
|---|------|------|------|-------|
| 1 | M | Org overview with real membership + credential counts | Org | Scoped API |
| 2 | M | Org users list (read-only) | Org | RBAC: org_admin |
| 3 | M | Org credentials list (read-only, scoped) | Org | |
| 4 | S | Org audit log view (read-only) | Org | |
| 5 | M | Role-based nav: hide dashboards user cannot access | RBAC | Web + API guards |

**Milestone:** M2: Org admin read-only  
**Goal:** Org Admin can inspect their org without issuance or PACS write APIs.

---

## Later — Sprint 3 (M3: PACS ingest demo)

| P | Size | Item | Epic | Notes |
|---|------|------|------|-------|
| 1 | M | Spike: document + POST mock HID CloudEvents to `/webhooks/hid-origo` | Integrations | No live HID account |
| 2 | M | Credential appears in holder UI after webhook ingest | Integrations | End-to-end slice |
| 3 | S | Admin badge: PACS vs NOA source on credential cards | Holder | Already partial |
| 4 | L | Integration health placeholders → DB-backed status | Integrations | |

**Milestone:** M3: Webhook ingest demo  
**Goal:** Prove PACS-led mirror path without outbound HID issue.

---

## Backlog (unscheduled)

### Identity Holder
- Privacy: GDPR export download UX
- Privacy: account deletion request flow
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
3. Move issues to **Ready** on the project board.
4. When done, check off here or remove the row (GitHub Issues are the source of truth during the sprint).

Last updated: 2026-06-05
