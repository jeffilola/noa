# Product backlog

Prioritized work for Noa. **Top = do first.** Move items to GitHub Issues when they are ready for a sprint (acceptance criteria filled in).

Legend: **S** / **M** / **L** size · **Epic** tag · Milestone when scheduled

---

## Now — Sprint 12–16 (M12–M16)

| P | Size | Item | Epic | Issue |
|---|------|------|------|-------|
| 1 | M | Expo mobile app smoke screen | Holder | #73 |
| 2 | M | Security admin revocation workflow (orchestration) | Org | #74 |
| 3 | L | Compliance export job + download | Compliance | #75 |
| 4 | M | API scoping tests (`/users/me`, `/credentials`) | Quality | #76 |
| 5 | S | Ops runbooks + sprint doc updates | Quality | #77 |

**Milestone:** [M12–M16 on GitHub](https://github.com/jeffilola/noa/milestones)  
**Goal:** Mobile shell, security/compliance workflows, API test coverage, and operator runbooks.

---

## Done — Sprint 7–11 (M7–M11)

Merged in PR #57. Learning records, wallet preview stub, platform org list, integration test-mode form, CI lint/build split.

| Milestone | Theme | Test guide |
|-----------|-------|------------|
| M7 | Learning records on access decisions | [m7-testing.md](./m7-testing.md) |
| M8 | Wallet pass preview stub | [m8-testing.md](./m8-testing.md) |
| M9 | Platform admin org list | [m9-testing.md](./m9-testing.md) |
| M10 | Integration admin test-mode form | [m10-testing.md](./m10-testing.md) |
| M11 | CI lint/build split | [m11-testing.md](./m11-testing.md) |

Issues #52–#56 (M7), #69–#72 (M8–M11). Demo: [demos/2026-06-11-m7.md](./demos/2026-06-11-m7.md). Latest overnight status: [overnight-2026-07-14.md](./overnight-2026-07-14.md).

---

## Done — Sprint 6 (M6: Site access history)

Issues #44–#48 merged in PR #49. Testing: [m6-testing.md](./m6-testing.md). Demo: [demos/2026-06-10.md](./demos/2026-06-10.md).

---

## Done — Sprint 5 (M5: Design system & light/dark UI)

Issues #39–#42 merged in PR #43.

---

## Done — Sprint 4 (M4: Holder trust / GDPR)

Issues #35–#37 merged in PR #38.

---

## Done — Sprint 3 (M3: PACS ingest demo)

Issues #30–#33 merged. See [m3-local-testing.md](./m3-local-testing.md).

---

## Done — Sprint 2 (M2: Org admin read-only)

Org overview, users, credentials, audit, role-based nav.

---

## Done — Sprint 1 (M1: Holder dashboard usable)

Issues #1–#4 merged.

---

## Later — unscheduled

### Infrastructure & quality
- Staging: Vercel (web) + API host + managed Postgres
- Sentry for web + API

### v2 / deferred
- Noa-led issuance via HID/Brivo outbound APIs
- Lenel Elements read API enrichment
- Live HID Origo sandbox credentials

---

## Epics (labels)

| Label | Scope |
|-------|--------|
| `epic:holder` | `/user/*` Identity Holder |
| `epic:org` | `/org/*` Org Admin |
| `epic:rbac` | Roles, permissions, nav |
| `epic:integrations` | Webhooks, providers, PACS |
| `epic:compliance` | Audit, exports, compliance dashboards |
| `epic:infra` | CI, staging, observability |
| `epic:quality` | Tests, DoD, tooling |

Last updated: 2026-07-14
