# Overnight sprint summary: 2026-10-07

## Branch and PR status

- Automation branch: `cursor/noa-milestone-preparation-ced9` (started clean and equal to `origin/main`).
- Requested milestone feature branches exist on origin but are stale behind `main`: `feature/m7-learning-records`, `feature/m8-wallet-pass-preview`, `feature/m9-platform-org-list`, `feature/m10-integration-admin-stub`, and `feature/m11-ci-quality-split`.
- Consolidated M7-M11 review PR: https://github.com/jeffilola/noa/pull/57 (merged).
- Active M7 holder compliance follow-up PR: https://github.com/jeffilola/noa/pull/99 (open draft, clean merge state, GitHub `lint` and `build` checks green).
- This docs-only status PR records the overnight rerun and avoids duplicating already-merged M8-M11 work.

## Milestone status

| Milestone | Status |
|-----------|--------|
| M7: Learning records | Closed in PR #57; PR #99 remains the review target for the holder `/user/compliance` follow-up. |
| M8: Wallet pass preview | Closed in PR #57. |
| M9: Platform admin org list | Closed in PR #57. |
| M10: Integration admin stub | Closed in PR #57. |
| M11: CI quality split | Closed in PR #57. |

Open roadmap work remains M12-M16 (#73-#77).

## Automated test commands

Current `main`-equivalent checkout:

```bash
pnpm install --frozen-lockfile        # passed
pnpm qa:prepare                      # blocked: Docker daemon is not running in this cloud environment
pnpm --filter @noa/api test          # passed: 12 tests, 2 pass, 10 DB-backed skips without Postgres
pnpm --filter @noa/web build         # passed
```

Active M7 PR #99 worktree (`origin/cursor/noa-milestone-preparation-01f8`):

```bash
pnpm install --frozen-lockfile        # passed
pnpm qa:prepare                      # blocked: Docker daemon is not running in this cloud environment
pnpm --filter @noa/api test          # passed: 13 tests, 2 pass, 11 DB-backed skips without Postgres
pnpm --filter @noa/domain test       # passed: 13 tests
pnpm --filter @noa/web build         # passed and includes /user/compliance
```

`manageCheckRun` was not available in the configured automation tools.

## M7 E2E checklist for morning review

Run locally with Docker/Postgres:

1. Start Postgres and bootstrap data: `docker compose up -d postgres && pnpm qa:prepare && pnpm qa:dev`.
2. Sign in as the Clerk user configured by `DEMO_CLERK_USER_ID`.
3. Switch to **Organization Admin**.
4. Open **Users** and click **Access view** on the demo member row.
5. Confirm the access decision panel shows real compliance data:
   - [ ] Site safety orientation (or similar training title) with a date.
   - [ ] Electrical safety certification with expiry around 2027.
   - [ ] Identity, credential, and last site access fields still filled in.
6. Toggle dark mode and confirm the panel remains readable.
7. Switch to **Identity Holder**.
8. Open **Training & certs** or `/user/compliance` from PR #99.
9. Confirm the holder page lists the same seeded training and certification rows.
10. Click **Refresh list** and confirm the table reloads without error.

## Prioritized manual E2E for M8-M11 regression

1. M8: open `/user/wallet` and confirm both Apple and Google Wallet preview placeholders render with preview-only language.
2. M9: open `/platform/organizations`, search by `demo`, and verify count/search/empty states.
3. M10: open `/integrations-admin/providers`, submit `https://api.origo.test`, then submit an `http://` URL and verify validation behavior.
4. M11: inspect PR checks and confirm `lint` and `build` are separate CI jobs.

## Test guides

- [M7 testing](./m7-testing.md)
- [M8 testing](./m8-testing.md)
- [M9 testing](./m9-testing.md)
- [M10 testing](./m10-testing.md)
- [M11 testing](./m11-testing.md)
