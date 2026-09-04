# Overnight sprint summary: 2026-09-04

## Branch and PR status

- Automation branch: `cursor/noa-milestone-preparation-2e35`
- Original M7-M11 implementation: PR #57, merged on 2026-06-19.
- Active M7 holder compliance follow-up: PR #99, open draft, clean merge state.
- Overnight status docs PR: PR #136, open draft for morning review.
- Requested feature branches `feature/m7-learning-records` through `feature/m11-ci-quality-split` still exist on origin, but they are stale relative to `main`; their milestone content has already landed through PR #57.
- GitHub issue/milestone creation or closure was not performed by this run because the available GitHub CLI is read-only and no issue/milestone write tool is configured.
- `manageCheckRun` is not available in the configured automation tools for this run.

## What shipped

- M7: persisted learning/compliance records for org access decisions landed in PR #57.
- M7 follow-up: PR #99 restores the holder **Training & certs** path at `/user/compliance` and includes signed-in holder compliance API coverage.
- M8: `/user/wallet` Apple/Google Wallet preview placeholder UI remains present on `main`.
- M9: `/platform/organizations` searchable platform admin organization list remains present on `main`.
- M10: `/integrations-admin/providers` test-mode provider validation form remains present on `main`.
- M11: CI remains split into separate `lint` and `build` jobs.

## Automated test commands

Current `main`-based automation branch:

```bash
pnpm qa:prepare                         # failed: Docker is not running in this cloud environment
pnpm install --frozen-lockfile          # passed
pnpm --filter @noa/api test             # passed; 12 tests, 10 DB-backed tests skipped
pnpm --filter @noa/web build            # passed; routes include M8-M11 pages
```

Active M7 follow-up PR #99 worktree:

```bash
pnpm qa:prepare                         # failed: Docker is not running in this cloud environment
pnpm install --frozen-lockfile          # passed
pnpm --filter @noa/api test             # passed; 13 tests, 11 DB-backed tests skipped
pnpm --filter @noa/web build            # passed; build output includes /user/compliance
```

## Prioritized manual E2E for morning review

1. M7 org admin: run `pnpm qa:prepare` locally with Docker/Postgres, sign in as `DEMO_CLERK_USER_ID`, switch to **Organization Admin**, open **Users** -> **Access view**, and confirm real training/cert rows appear in the access decision panel.
2. M7 holder: switch to **Identity Holder**, open **Training & certs** or `/user/compliance` from PR #99, and confirm the same seeded rows render and **Refresh list** reloads without error.
3. M7 visual pass: toggle dark mode on the org access panel and holder compliance page.
4. M8: open `/user/wallet` and confirm both Apple Wallet and Google Wallet cards say **Preview only** with no real issuance/barcode language.
5. M9: open `/platform/organizations`, search for `demo`, then `zzzznotfound`; verify Demo Organization, counts, filters, empty state, and API-offline banner.
6. M10: open `/integrations-admin/providers`, validate `https://api.origo.test` for success, then `http://example.com` for an error; confirm the no-live-keys warning is visible.
7. M11: inspect PR checks and confirm `lint` and `build` are separate checks.

## Test guides

- [M7 testing](./m7-testing.md)
- [M8 testing](./m8-testing.md)
- [M9 testing](./m9-testing.md)
- [M10 testing](./m10-testing.md)
- [M11 testing](./m11-testing.md)
