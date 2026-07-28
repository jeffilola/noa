# Overnight milestone status — 2026-07-28

## Summary

The cron prompt still describes the original M7-M11 sprint push, but the live repository and GitHub state show those milestones are already complete:

- M7-M11 issues are closed: #52-#56 and #69-#72.
- The M8-M11 slices were merged through PR #57.
- The active M7 closeout follow-up remains PR #99, which restores the holder `/user/compliance` page and adds holder compliance API coverage.
- No duplicate M8-M11 feature branches or PRs were opened.

## PRs and milestone status

| Milestone | Status | PR / issue notes |
|-----------|--------|------------------|
| M7: Learning records | Follow-up in review | PR #99: https://github.com/jeffilola/noa/pull/99 |
| M8: Wallet pass preview | Done | Merged in PR #57: https://github.com/jeffilola/noa/pull/57 |
| M9: Platform org list | Done | Merged in PR #57: https://github.com/jeffilola/noa/pull/57 |
| M10: Integration admin stub | Done | Merged in PR #57: https://github.com/jeffilola/noa/pull/57 |
| M11: CI quality split | Done | Merged in PR #57: https://github.com/jeffilola/noa/pull/57 |
| Overnight status docs | In review | This PR: pending at initial commit |

## Automated validation

Current branch (`cursor/noa-milestone-preparation-62d3`, even with `origin/main` before this docs update):

| Command | Result | Notes |
|---------|--------|-------|
| `pnpm install --frozen-lockfile` | Pass | Workspace dependencies installed. |
| `pnpm qa:prepare` | Blocked | Docker is not running in Cursor Cloud. |
| `pnpm --filter @noa/api test` | Pass | 12 tests total; 2 pass, 10 database-backed skips because Postgres is unavailable. |
| `pnpm --filter @noa/web build` | Pass | Next build succeeds; main currently exposes `/user/wallet` but not `/user/compliance`. |

PR #99 worktree (`origin/cursor/noa-milestone-preparation-01f8`):

| Command | Result | Notes |
|---------|--------|-------|
| `pnpm install --frozen-lockfile` | Pass | Workspace dependencies installed. |
| `pnpm qa:prepare` | Blocked | Docker is not running in Cursor Cloud. |
| `pnpm --filter @noa/api test` | Pass | 13 tests total; 2 pass, 11 database-backed skips. Includes holder compliance API coverage when DB is available. |
| `pnpm --filter @noa/web build` | Pass | Next build succeeds and includes `/user/compliance`. |

## M7 manual E2E checklist for morning review

Use the local Docker/Postgres environment because Cloud cannot run `qa:prepare`.

1. Start Docker/Postgres and run `pnpm qa:prepare`.
2. Start the app with `pnpm qa:dev`.
3. Sign in as the Clerk user configured by `DEMO_CLERK_USER_ID`.
4. Switch to **Organization Admin**.
5. Open **Users** and click **Access view** on the demo member row.
6. Confirm the access decision panel shows real compliance data:
   - **Site safety orientation** or similar training record with a date.
   - **Electrical safety certification** with an expiry around 2027.
   - Identity, credential, and last site access fields still populated.
7. Toggle dark mode and confirm the access panel remains readable.
8. Switch to **Identity Holder**.
9. Open **Training & certs** or go directly to `/user/compliance`.
10. Confirm the holder table shows the same seeded training and certification records.
11. Click **Refresh list** and confirm the table reloads without error.
12. If records are missing, rerun `pnpm db:seed`, restart the API, and retry the signed-in demo user.

## Prioritized morning review

1. Review PR #99 first; it is the only active M7 behavior follow-up and adds the holder compliance surface missing from main.
2. Run the M7 manual checklist above with Docker/Postgres available.
3. Spot-check the already-merged M8-M11 flows using `docs/m8-testing.md` through `docs/m11-testing.md`.
4. Review this overnight status PR after PR #99; it is documentation-only.
