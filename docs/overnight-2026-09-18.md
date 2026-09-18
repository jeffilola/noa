# Overnight milestone status — 2026-09-18

## Summary

- The M7-M11 sprint prompt is stale against the current repository state.
- M7-M11 shipped together in [PR #57](https://github.com/jeffilola/noa/pull/57), which is merged to `main`.
- M7 issues [#52](https://github.com/jeffilola/noa/issues/52)-[#56](https://github.com/jeffilola/noa/issues/56) and M8-M11 issues [#69](https://github.com/jeffilola/noa/issues/69)-[#72](https://github.com/jeffilola/noa/issues/72) are closed.
- The active M7 follow-up remains [PR #99](https://github.com/jeffilola/noa/pull/99), which restores the holder `/user/compliance` page and keeps the M7 closeout review-ready.
- Current active roadmap issues are M12-M16: [#73](https://github.com/jeffilola/noa/issues/73)-[#77](https://github.com/jeffilola/noa/issues/77).

## PRs for morning review

| Scope | PR | Status |
|-------|----|--------|
| M7-M11 milestone batch | [#57](https://github.com/jeffilola/noa/pull/57) | Merged |
| M7 holder compliance follow-up | [#99](https://github.com/jeffilola/noa/pull/99) | Open draft, clean merge state, historical CI green |
| M12 mobile smoke screen | [#80](https://github.com/jeffilola/noa/pull/80) | Open, clean merge state |
| 2026-09-18 overnight status | Pending | This docs-only branch will be opened as a PR after commit/push. |

No duplicate M8-M11 PRs were created because their implementation and docs are already merged and their issues are closed.

## Milestone status

| Milestone | Status | Notes |
|-----------|--------|-------|
| M7: Learning records | Closed in PR #57; follow-up PR #99 open | PR #99 adds holder `/user/compliance`; API/web validation passed with Docker limitation noted below. |
| M8: Wallet pass preview | Closed in PR #57 | `docs/m8-testing.md` is present; `/user/wallet` builds on `main`. |
| M9: Platform org list | Closed in PR #57 | `docs/m9-testing.md` is present; `/platform/organizations` builds on `main`. |
| M10: Integration admin stub | Closed in PR #57 | `docs/m10-testing.md` is present; `/integrations-admin/providers` builds on `main`. |
| M11: CI quality split | Closed in PR #57 | `docs/m11-testing.md` is present; PR #99 shows separate green `lint` and `build` checks. |

## Automated validation

### Current branch at `origin/main`

| Command | Result | Notes |
|---------|--------|-------|
| `pnpm qa:prepare` | Blocked | Docker is not running in this environment, so Postgres-backed prepare cannot start. |
| `pnpm install --frozen-lockfile` | Pass | Needed because `node_modules` was absent. |
| `pnpm --filter @noa/api test` | Pass | 12 tests reported, 10 DB-backed tests skipped because no database was available. |
| `pnpm --filter @noa/web build` | Pass | First attempt raced before `@noa/shared` was built; rerun after API dependency builds completed successfully. |

### PR #99 (`cursor/noa-milestone-preparation-01f8`)

| Command | Result | Notes |
|---------|--------|-------|
| `pnpm install --frozen-lockfile` | Pass | Clean detached worktree install. |
| `pnpm qa:prepare` | Blocked | Docker is not running in this environment. |
| `pnpm --filter @noa/api test` | Pass | 13 tests reported, 11 DB-backed tests skipped, including signed-in holder compliance coverage. |
| `pnpm --filter @noa/web build` | Pass | Next build completed and included `/user/compliance`. |

`manageCheckRun` was not available in the configured automation tools, so no aggregate tracking check was updated.

## M7 manual E2E checklist for tomorrow

Run locally with Docker/Postgres:

```sh
docker compose up -d postgres
pnpm qa:prepare
pnpm qa:dev
```

Then sign in as the Clerk user from `packages/database/.env` (`DEMO_CLERK_USER_ID`).

| Step | Status | Notes |
|------|--------|-------|
| Switch to Organization Admin. | Pending manual local E2E | Requires browser + local Clerk/Docker stack. |
| Open Users, then Access view on the demo member row. | Pending manual local E2E | API/build validation for PR #99 passed. |
| Confirm Site safety orientation (or similar) appears with a date. | Pending manual local E2E | `ensureComplianceRecordsForUser` coverage exists but DB-backed test skipped without Docker. |
| Confirm Electrical safety certification appears with expiry around 2027. | Pending manual local E2E | Same DB limitation as above. |
| Confirm identity, credential, and last site access remain populated. | Pending manual local E2E | Covered by the M7 browser path. |
| Toggle dark mode and verify the access panel remains readable. | Pending manual local E2E | Browser-only check. |
| Switch to Identity Holder. | Pending manual local E2E | PR #99 adds the holder route. |
| Open Training & certs or `/user/compliance`. | Automated partial pass | PR #99 web build includes `/user/compliance`; browser verification still pending. |
| Confirm the same training + certification rows appear in the table. | Pending manual local E2E | Requires seeded local database. |
| Click Refresh list and confirm reload succeeds. | Pending manual local E2E | Requires API + browser session. |

Priority for morning review: open PR #99 locally, run the Docker-backed M7 browser checklist above, then decide whether to merge the M7 closeout follow-up.
