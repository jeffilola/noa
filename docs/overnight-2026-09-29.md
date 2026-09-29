# Overnight sprint status: 2026-09-29

## Summary

- M7-M11 are already shipped on `main` via PR #57, so this run did not recreate duplicate feature branches or PRs for closed milestones.
- M7 active follow-up remains PR #99 for the holder compliance records page; it is open as a draft and GitHub reports `lint` and `build` as successful.
- GitHub issues #52-#56 and #69-#72 are closed. Current open milestone work is M12-M16 (#73-#77).
- Local verification was environment-blocked: Docker is unavailable, and the VM ran out of disk space before dependencies could be installed.

## PR URLs

| Scope | PR |
|-------|----|
| M7-M11 merged milestone slice | https://github.com/jeffilola/noa/pull/57 |
| Active M7 holder compliance follow-up | https://github.com/jeffilola/noa/pull/99 |
| Current overnight status docs PR | To be filled after this branch opens a PR |

## Milestone status

| Milestone | Status | Evidence |
|-----------|--------|----------|
| M7: Learning records | Closed / shipped; follow-up draft open | Issues #52-#56 closed; PR #57 merged; PR #99 open for `/user/compliance` follow-up |
| M8: Wallet pass preview | Closed / shipped | Issue #69 closed; `/user/wallet`; `docs/m8-testing.md` |
| M9: Platform org list | Closed / shipped | Issue #70 closed; `/platform/organizations`; `GET /organizations`; `docs/m9-testing.md` |
| M10: Integration admin stub | Closed / shipped | Issue #71 closed; `/integrations-admin/providers`; `validate-test-mode`; `docs/m10-testing.md` |
| M11: CI quality split | Closed / shipped | Issue #72 closed; `.github/workflows/ci.yml` has separate `lint` and `build` jobs; `docs/m11-testing.md` |

## Automated command results

| Command | Result |
|---------|--------|
| `pnpm qa:prepare` | Failed before app setup: Docker is not running in this cloud VM. |
| `pnpm install --frozen-lockfile` | Failed with `ERR_PNPM_ENOSPC` while installing all workspaces. |
| Filtered API/web `pnpm install --frozen-lockfile --filter ...` | Failed with `ERR_PNPM_ENOSPC` while adding `react-icons` to the pnpm store. |
| `pnpm --filter @noa/api test` | Failed because dependencies could not be installed; first missing binary was `tsc`. |
| `pnpm --filter @noa/web build` | Failed because dependencies could not be installed; missing binary was `next`. |

These are environment failures, not observed application test failures. The partial dependency installs were removed afterward so the working tree stayed clean.

## Spot checks from source

- M7 dev bootstrap: `ensureComplianceRecordsForUser` is exported from `@noa/database` and called by holder demo bootstrap outside production.
- M7 API coverage: `apps/api/test/milestone-readiness.integration.test.ts` exercises compliance record seeding/listing when a database is available.
- M8 UI: `apps/web/src/app/user/wallet/page.tsx` renders Apple Wallet and Google Wallet preview-only cards.
- M9 UI/API: `apps/web/src/app/platform/organizations/page.tsx` wires search/filter/sort to the platform organization API.
- M10 UI/API: `apps/web/src/app/integrations-admin/providers/page.tsx` renders the provider test-mode form; API validation is exposed at `POST /organizations/:orgId/integrations/validate-test-mode`.
- M11 CI: `.github/workflows/ci.yml` defines independent `lint` and `build` jobs.

## M7 manual E2E checklist for morning review

Run locally with Docker and the seeded Clerk user from `packages/database/.env`.

### Setup

- [ ] `docker compose up -d postgres` - not run in cloud; Docker unavailable.
- [ ] `pnpm qa:prepare` - not run successfully in cloud; Docker unavailable.
- [ ] `pnpm qa:dev` - not run in cloud; depends on QA prepare.
- [ ] Sign in as `DEMO_CLERK_USER_ID` - not run in cloud; browser/dev stack unavailable.

### Org admin view

- [ ] Switch to **Organization Admin** - not run in cloud.
- [ ] Open **Users** and click **Access view** on the demo member row - not run in cloud.
- [ ] Confirm **Site safety orientation** or equivalent training appears with a date - not run in cloud.
- [ ] Confirm **Electrical safety certification** appears with an expiry around 2027 - not run in cloud.
- [ ] Confirm identity, credential, and last site access data still render - not run in cloud.
- [ ] Toggle dark mode and confirm the panel remains readable - not run in cloud.

### Holder view

- [ ] Switch to **Identity Holder** - not run in cloud.
- [ ] Open **Training & certs** or `/user/compliance` - not run in cloud.
- [ ] Confirm the same training and certification rows appear in the holder table - not run in cloud.
- [ ] Click **Refresh list** and confirm the table reloads without error - not run in cloud.

### Pass criteria

- [ ] Org access panel shows real training + cert records, not generic stub copy.
- [ ] Holder compliance page lists the same seeded records.
- [ ] Dark mode is readable on both pages.

## Additional prioritized E2E for tomorrow

1. M7 first: complete the checklist above against PR #99 if reviewing the holder compliance follow-up.
2. M8: open `/user/wallet`; confirm Apple/Google cards both say **Preview only** and no real issuance is implied.
3. M9: open `/platform/organizations`; search `demo`; test a no-match search; apply **Has members** and **Recently updated** filters.
4. M10: open `/integrations-admin/providers`; validate `https://api.origo.test` succeeds and an `http://` URL fails.
5. M11: inspect a PR checks panel and confirm `lint` and `build` are separate checks.

## Notes

- `manageCheckRun` was not available in the automation tool catalog for this run.
- No GitHub issues or milestones were modified; `gh` access is read-only in this environment.
