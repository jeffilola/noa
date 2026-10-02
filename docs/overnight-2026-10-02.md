# Overnight status — 2026-10-02

Cron run for the M7-M11 overnight sprint prompt.

## Summary

- M7-M11 feature slices are already merged on `main` via [PR #57](https://github.com/jeffilola/noa/pull/57).
- Issues #52-#56 and #69-#72 are closed.
- The active M7 follow-up is [PR #99](https://github.com/jeffilola/noa/pull/99), which restores the holder-facing `/user/compliance` page and signed-in holder compliance API coverage.
- No duplicate M8-M11 feature branches were opened because those milestones are already represented on `main`.
- `manageCheckRun` is not available in this automation environment.

## PR status

| Scope | PR | Status |
|-------|----|--------|
| M7-M11 merged feature slices | [#57](https://github.com/jeffilola/noa/pull/57) | Merged |
| M7 holder compliance follow-up | [#99](https://github.com/jeffilola/noa/pull/99) | Open draft; merge state clean; historical `lint` and `build` green |
| 2026-10-02 overnight rollup | [#161](https://github.com/jeffilola/noa/pull/161) | Documentation-only status PR from this run |

## GitHub issue and milestone status

| Milestone | Issues | Status |
|-----------|--------|--------|
| M7: Learning & compliance records | #52-#56 | Closed |
| M8: Wallet pass preview | #69 | Closed |
| M9: Platform org list | #70 | Closed |
| M10: Integration admin test-mode stub | #71 | Closed |
| M11: CI quality split | #72 | Closed |
| M12-M16 | #73-#77 | Open; current roadmap |

## Automated validation

Current `main`-based checkout:

| Command | Result | Notes |
|---------|--------|-------|
| `pnpm install --frozen-lockfile` | Pass | Installed all workspace dependencies from the lockfile. |
| `pnpm qa:prepare` | Blocked | Docker daemon is not running in this environment. Re-run locally with Docker/Postgres. |
| `pnpm --filter @noa/api test` | Pass | 12 tests observed; 10 DB-backed cases skipped because the database is unavailable. |
| `pnpm --filter @noa/web build` | Pass | Next build completed; main includes `/user/wallet`, `/platform/organizations`, `/integrations-admin/providers`, and split CI docs/workflows. |

M7 follow-up PR #99 worktree:

| Command | Result | Notes |
|---------|--------|-------|
| `pnpm install --frozen-lockfile` | Pass | Installed dependencies in a detached worktree for `origin/cursor/noa-milestone-preparation-01f8`. |
| `pnpm qa:prepare` | Blocked | Same Docker daemon limitation. |
| `pnpm --filter @noa/api test` | Pass | 13 tests observed; 11 DB-backed cases skipped, including signed-in holder compliance records coverage. |
| `pnpm --filter @noa/web build` | Pass | Next build completed and includes `/user/compliance`. |

## Morning manual E2E priorities

Run locally with Docker/Postgres:

1. `docker compose up -d postgres`
2. `pnpm qa:prepare`
3. `pnpm qa:dev`
4. Sign in as `DEMO_CLERK_USER_ID`.

Then prioritize:

1. PR #99 M7 holder closeout:
   - Org Admin -> Users -> Access view shows real training and certification rows.
   - Holder -> Training & certs (`/user/compliance`) shows the same seeded records.
   - Refresh list reloads without an error.
   - Dark mode remains readable on the org access panel and holder table.
2. M8 wallet preview on `main`:
   - Holder dashboard links to `/user/wallet`.
   - Apple Wallet and Google Wallet cards both show `Preview only`.
   - Page clearly states no real pass is issued.
3. M9 platform org list on `main`:
   - Platform Admin -> Organizations loads Demo Organization with counts.
   - Search `demo` finds the row; nonsense search shows empty state.
   - Has members and Recently updated filters reload without errors.
4. M10 integration admin stub on `main`:
   - Integration Admin -> Providers shows the provider form and no-live-keys warning.
   - HTTPS test URL validates successfully.
   - HTTP test URL is rejected.
5. M11 CI split:
   - Open PR checks show separate `lint` and `build` jobs.
   - Confirm both are green on the overnight status PR before merging.

## Notes for reviewer

- `origin/feature/m7-learning-records` is stale/diverged from `main`; the active M7 review artifact is PR #99.
- M7-M11 milestones and issues should not be recreated unless the roadmap is intentionally reopened.
- The current active roadmap remains M12-M16 (#73-#77).
