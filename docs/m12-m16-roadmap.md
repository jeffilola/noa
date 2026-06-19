# M12–M16 roadmap

Next milestone batch after M7–M11 (merged in PR #57).

| Milestone | Issue | What to build | Size |
|-----------|-------|---------------|------|
| **M12** | [#73](https://github.com/jeffilola/noa/issues/73) | Expo holder smoke screen in `apps/wallet-mobile` | M |
| **M13** | [#74](https://github.com/jeffilola/noa/issues/74) | Revocation request UI + API (orchestration only, no live PACS) | M |
| **M14** | [#75](https://github.com/jeffilola/noa/issues/75) | Compliance export job create/poll/download | L |
| **M15** | [#76](https://github.com/jeffilola/noa/issues/76) | Integration tests for `/users/me` and `/credentials` scoping | M |
| **M16** | [#77](https://github.com/jeffilola/noa/issues/77) | Clerk key mismatch runbook + backlog/sprint doc sync | S |

## Existing placeholders (replace during implementation)

- `/security-admin/revocations` — DashboardPlaceholder → M13
- `/compliance/exports` — DashboardPlaceholder → M14

## Suggested order

1. **M12** — new surface, independent
2. **M15** — tests protect existing APIs
3. **M16** — docs while context is fresh
4. **M13** — security admin workflow
5. **M14** — largest slice (async job + download)

## Test docs (create per milestone)

- `docs/m12-testing.md` … `docs/m16-testing.md` (plain-language checklists like M7–M11)

Last updated: 2026-06-16
