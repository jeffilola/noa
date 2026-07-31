# Overnight milestone status — 2026-07-31

Triggered by the recurring overnight sprint automation at 2026-07-31 23:01 UTC.

## Executive summary

- The sprint prompt is stale for current `main`: M7-M11 are already merged and their issues/milestones are closed.
- Current `main` is commit `cae785f` (`Merge M7-M11: compliance records, wallet preview, platform orgs, integration stub, CI split`).
- No duplicate M8-M11 feature branches, issues, or milestone PRs were opened.
- The active M7 follow-up remains PR #99 for the holder compliance records page; its GitHub `lint` and `build` checks are green.
- `manageCheckRun` is not available in the configured Cursor Automation Tools server for this run.

## Milestone and PR status

| Milestone | Status | PRs / issues |
|-----------|--------|--------------|
| M7: Learning records | Access-panel learning records are done on `main`; holder compliance page follow-up remains open for review | Merged PR #57; active follow-up PR #99; issues #52-#56 closed |
| M8: Wallet pass preview | Done on `main` | Merged PR #57; issue #69 closed |
| M9: Platform admin org list | Done on `main` | Merged PR #57; issue #70 closed |
| M10: Integration admin stub | Done on `main` | Merged PR #57; issue #71 closed |
| M11: CI quality split | Done on `main` | Merged PR #57; issue #72 closed |

Open next-sprint issues remain M12-M16 (#73-#77). Existing open overnight status PRs and dependency PRs were left untouched.

## Automated validation

Environment setup:

- `pnpm install --frozen-lockfile` — passed.

Requested commands:

| Command | Result | Notes |
|---------|--------|-------|
| `pnpm qa:prepare` | Failed, environment-blocked | Exit 1: Docker is not running in this cloud runner. Run locally with Docker/Postgres for full DB seed and browser setup. |
| `pnpm --filter @noa/api test` | Passed | Exit 0. Node test runner reported 12 tests: 2 passed, 10 DB-backed cases skipped because the database was unavailable. The skipped M7 case covers `ensureComplianceRecordsForUser` plus org access-decision listing. |
| `pnpm --filter @noa/web build` | Passed | Exit 0. Next build completed successfully. Current `main` route output includes `/user/wallet`, `/platform/organizations`, and `/integrations-admin/providers`; `/user/compliance` is on active follow-up PR #99. |

PR #99 status check snapshot: `lint` success, `build` success, merge state clean.

## M7 manual E2E checklist for morning review

Source: [m7-testing.md](./m7-testing.md).

### Browser test — org admin view

- [ ] Switch to **Organization Admin**.
- [ ] Open **Users** and click **Access view** on the demo member row.
- [ ] Confirm the access decision panel shows **Site safety orientation** or similar training title with a date.
- [ ] Confirm the panel shows **Electrical safety certification** with expiry around 2027.
- [ ] Confirm identity, credential, and last site access details still render.
- [ ] Toggle dark mode and confirm the panel remains readable.

### Browser test — holder view

- [ ] Switch to **Identity Holder**.
- [ ] Open sidebar **Training & certs** or `/user/compliance`.
- [ ] Confirm the same seeded training and certification rows appear in the table.
- [ ] Click **Refresh list** and confirm the table reloads without error.

### Pass criteria

- [ ] Org access panel shows real training and certification records, not generic stub copy.
- [ ] Holder compliance page lists the same seeded records.
- [ ] Dark mode is readable on both pages.

## Prioritized manual review steps

1. Review PR #99 first: it is the active M7 follow-up that restores holder-facing `/user/compliance`.
2. Run `pnpm qa:prepare` locally with Docker/Postgres, then `pnpm qa:dev`.
3. Exercise the M7 org admin and holder checklists above.
4. Spot-check merged M8-M11 flows from `docs/m8-testing.md` through `docs/m11-testing.md` if time permits.
5. Confirm open status PRs are documentation-only before merging or closing them.
