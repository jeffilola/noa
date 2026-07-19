# Overnight status: 2026-07-19

## Summary

The cron prompt for the overnight sprint still describes the original M7-M11 implementation push, but the current repository and GitHub state show that M7-M11 shipped through merged PR #57. The remaining review item for the M7 checklist is the holder Training & certs follow-up in PR #99, which restores `/user/compliance` and has green GitHub `lint` and `build` checks.

This document is the July 19 review packet for the morning handoff. It avoids duplicating already-merged milestone work and keeps the active follow-up PRs visible for human review.

## Pull requests

| PR | Status | Scope |
|----|--------|-------|
| [#57](https://github.com/jeffilola/noa/pull/57) | Merged | M7-M11 milestone implementation slices. |
| [#99](https://github.com/jeffilola/noa/pull/99) | Open draft, review-ready follow-up | M7 holder compliance page/API/sidebar/dev bootstrap gap from `docs/m7-testing.md`. |
| [#100](https://github.com/jeffilola/noa/pull/100) | Open draft | July 18 overnight status packet. |
| [#101](https://github.com/jeffilola/noa/pull/101) | Open draft | This review packet and validation summary. |

## Milestone status

| Milestone | GitHub state | Review status |
|-----------|--------------|---------------|
| M7: Learning & compliance records | Issues #52-#56 closed; milestone closed | Main slice merged in #57. Holder `/user/compliance` checklist gap is covered by #99. |
| M8: Wallet pass preview | Issue #69 closed | Merged in #57; test guide: `docs/m8-testing.md`. |
| M9: Platform admin org list | Issue #70 closed | Merged in #57; test guide: `docs/m9-testing.md`. |
| M10: Integration admin stub | Issue #71 closed | Merged in #57; test guide: `docs/m10-testing.md`. |
| M11: CI quality split | Issue #72 closed | Merged in #57; `lint` and `build` checks are split in GitHub Actions. |
| M12-M16 | Issues #73-#77 open | Current backlog according to `docs/backlog.md` and `docs/sprint-planning.md`. |

## Automated validation

| Command | Result | Notes |
|---------|--------|-------|
| `pnpm install --frozen-lockfile` | Pass | Current status branch dependencies installed cleanly. |
| `pnpm qa:prepare` | Blocked | Docker is not running in this cloud environment; run locally with Docker/Postgres for DB-backed setup. |
| `pnpm --filter @noa/api test` | Pass | Current main-baseline status branch: 12 tests, 2 pass, 10 DB-backed skips because Postgres is unavailable. |
| `pnpm --filter @noa/web build` | Pass | Current main-baseline status branch builds successfully; route list does not include `/user/compliance` because that follow-up is still in PR #99. |
| PR #99 `pnpm install --frozen-lockfile --force` | Pass | Detached worktree required a forced install after an initial no-op install left `node_modules` absent. |
| PR #99 `pnpm qa:prepare` | Blocked | Same Docker daemon limitation as the current branch. |
| PR #99 `pnpm --filter @noa/api test` | Pass | 13 tests, 2 pass, 11 DB-backed skips; includes the holder compliance records test but skips it without Postgres. |
| PR #99 `pnpm --filter @noa/domain test` | Pass | 13 tests pass. |
| PR #99 `pnpm --filter @noa/web build` | Pass | Route list includes `/user/compliance`. |

## M7 manual E2E checklist for morning review

Use `docs/m7-testing.md` as the source checklist, preferably against PR #99 because `origin/main` does not yet contain the holder `/user/compliance` follow-up.

### Setup

- [ ] `docker compose up -d postgres`
- [ ] `pnpm qa:prepare`
- [ ] `pnpm qa:dev`
- [ ] Sign in as the Clerk user configured by `DEMO_CLERK_USER_ID`.

### Org admin view

- [ ] Switch to **Organization Admin**.
- [ ] Open **Users** and click **Access view** on the demo member row.
- [ ] Confirm the access decision panel shows **Site safety orientation** or similar training with a date.
- [ ] Confirm the panel shows **Electrical safety certification** with an expiry around 2027.
- [ ] Confirm identity, credential, and last site access data still appear.
- [ ] Toggle dark mode and confirm the panel remains readable.

### Holder view

- [ ] Switch to **Identity Holder**.
- [ ] Open sidebar **Training & certs** or go to `/user/compliance`.
- [ ] Confirm the same seeded training and certification rows appear in the table.
- [ ] Click **Refresh list** and confirm the table reloads without an error.
- [ ] Toggle dark mode and confirm the holder page remains readable.

### M8-M11 smoke checks

- [ ] M8: `/user/wallet` shows Apple Wallet and Google Wallet preview-only cards with no real issuance.
- [ ] M9: `/platform/organizations` lists Demo Organization, search works, filters apply, and API-offline state is graceful.
- [ ] M10: `/integrations-admin/providers` validates HTTPS test URLs and rejects non-HTTPS URLs without storing live keys.
- [ ] M11: A current PR shows separate green `lint` and `build` GitHub Actions checks.

## Notes

- `manageCheckRun` is not available in the current Cursor Automation Tools MCP server.
- GitHub CLI is read-only in this environment, so no issues or milestones were modified.
- The untracked nested `noa/` folder at repo root was not touched.
