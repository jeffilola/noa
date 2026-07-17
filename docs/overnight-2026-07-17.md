# Overnight sprint status — 2026-07-17

## Summary

The cron prompt for M7–M11 is stale in the current repository state: PR #57 already merged the M7–M11 implementation into `main`, and GitHub issues #52–#56 and #69–#72 are closed. Tonight's branch therefore focuses on the remaining M7 closeout gap found during verification: the testing guide requires a holder **Training & certs** page at `/user/compliance`, but current `main` did not build that route.

## Pull requests and milestone status

| Scope | PR | Status | Notes |
|-------|----|--------|-------|
| M7–M11 implementation | https://github.com/jeffilola/noa/pull/57 | Merged | Learning records, wallet preview, platform org list, integration admin stub, and CI split are on `main`. |
| M7 holder compliance follow-up | https://github.com/jeffilola/noa/pull/91 | Open draft | Earlier follow-up branch for `/user/compliance`; this run reapplies the relevant code to the current automation branch. |
| 2026-07-17 overnight closeout | Pending automation PR | In progress | Adds holder compliance records API/page/sidebar link plus this status note. |

Milestones M7, M8, M9, M10, and M11 are closed on GitHub. Current open milestone work starts at M12 (#73) through M16 (#77).

## Automated checks

| Command | Result | Notes |
|---------|--------|-------|
| `pnpm install --frozen-lockfile` | Pass | Installed all 10 workspace projects from the lockfile. |
| `pnpm qa:prepare` | Blocked | Docker daemon is unavailable in this cloud environment: `Docker is not running`. Run locally with Docker before manual browser QA. |
| `pnpm --filter @noa/api test` | Pass | 12 tests total; 2 pass, 10 DB-backed tests skipped because the database is unavailable. |
| `pnpm --filter @noa/web build` | Pass after workspace prebuild | Initial direct web build could not resolve `@noa/domain` until `pnpm --filter @noa/domain build` generated the workspace package artifact; retry completed successfully. |

`manageCheckRun` is not available in the Cursor Automation Tools MCP server for this run.

## M7 manual E2E checklist for morning review

Run locally:

```powershell
cd C:\Users\jeffe\Projects\noa
docker compose up -d postgres
pnpm qa:prepare
pnpm qa:dev
```

Sign in as the Clerk user configured in `packages/database/.env` (`DEMO_CLERK_USER_ID`).

### Org admin view

- [ ] Switch to **Organization Admin**.
- [ ] Open **Users** and click **Access view** on the demo member row.
- [ ] Confirm the access decision panel shows **Site safety orientation** or similar training title with a date.
- [ ] Confirm the panel shows **Electrical safety certification** with an expiry around **2027**.
- [ ] Confirm identity, credential, and last site access fields still render from earlier milestones.
- [ ] Toggle dark mode and confirm the panel remains readable.

### Holder view

- [ ] Switch to **Identity Holder**.
- [ ] Open sidebar **Training & certs** or go directly to `/user/compliance`.
- [ ] Confirm the same training and certification rows appear in the table.
- [ ] Click **Refresh list** and confirm the table reloads without error.
- [ ] Toggle dark mode and confirm the page remains readable.

## Additional M8–M11 smoke checks

- [ ] M8: `/user` shows **Wallet preview**; `/user/wallet` shows Apple Wallet and Google Wallet placeholders with **Preview only** and no real issuance language.
- [ ] M9: Platform Admin -> `/platform/organizations` lists Demo Organization, search for `demo` succeeds, nonsense search shows an empty state, and API-offline refresh shows a warning banner.
- [ ] M10: Integration Admin -> `/integrations-admin/providers` shows the test-mode provider form; `https://api.origo.test` validates successfully; `http://example.com` shows an error; no live provider keys are entered.
- [ ] M11: Any review PR shows separate GitHub Actions `lint` and `build` jobs.

## Prioritized morning review steps

1. Pull the 2026-07-17 overnight PR and run `pnpm qa:prepare` locally with Docker.
2. Complete the M7 org-admin and holder `/user/compliance` checklist above first; it is the only code gap found tonight.
3. Run the M8–M11 smoke checks to confirm the already-merged PR #57 behavior still works.
4. Review GitHub Actions on the overnight PR for separate `lint` and `build` checks.
