# Overnight status - 2026-09-16

## Summary

The M7-M11 sprint prompt is stale against the current repository state. M7-M11 were already merged to `main` in PR #57, and the corresponding issues/milestones are closed. I did not recreate duplicate M8-M11 branches or PRs.

The remaining M7 follow-up for morning review is PR #99, which restores the holder-facing `/user/compliance` page and includes signed-in holder compliance API coverage. That PR remains open as a draft, has a clean merge state, and its visible GitHub `lint` and `build` checks are green.

## PRs and milestone status

| Area | Status | PR / issue links |
|------|--------|------------------|
| M7-M11 implementation batch | Merged to `main`; issues #52-#56 and #69-#72 are closed | https://github.com/jeffilola/noa/pull/57 |
| M7 holder compliance follow-up | Open draft, clean, green visible checks; review this before closing the holder gap | https://github.com/jeffilola/noa/pull/99 |
| Overnight status PR | Pending until this branch is opened | To be filled after PR creation |
| Next roadmap | M12-M16 remain open and are the current backlog | #73, #74, #75, #76, #77 |

## Automated checks run

### Current `main` checkout

| Command | Result | Notes |
|---------|--------|-------|
| `pnpm qa:prepare` | Failed | Docker/Postgres is unavailable in this cloud environment. Script stopped with "Docker is not running." |
| `pnpm install --frozen-lockfile` | Passed | Lockfile was current; dependencies installed locally for validation. |
| `pnpm --filter @noa/api test` | Passed | 12 tests, 0 failures, 10 DB-backed skips because Postgres is unavailable. Includes `ensureComplianceRecordsForUser` coverage for org access decisions. |
| `pnpm --filter @noa/web build` | Passed | Reran after workspace packages were built; build completed and listed M8-M11 routes including `/user/wallet`, `/platform/organizations`, `/integrations-admin/providers`, and split admin areas. |

### PR #99 isolated worktree

| Command | Result | Notes |
|---------|--------|-------|
| `pnpm install --frozen-lockfile` | Passed | Isolated worktree at `/tmp/noa-pr99`. |
| `pnpm qa:prepare` | Failed | Same Docker/Postgres environment blocker. |
| `pnpm --filter @noa/api test` | Passed | 13 tests, 0 failures, 11 DB-backed skips. Includes signed-in holder compliance records coverage. |
| `pnpm --filter @noa/web build` | Passed | Build completed and route output includes `/user/compliance`. |

`manageCheckRun` was not available in the Cursor Automation Tools MCP namespace, so no aggregate check run was posted.

## Morning manual E2E checklist

Run locally with Docker/Postgres available:

```powershell
cd C:\Users\jeffe\Projects\noa
docker compose up -d postgres
pnpm qa:prepare
pnpm qa:dev
```

Sign in as the Clerk user configured by `DEMO_CLERK_USER_ID`.

### Priority 1 - M7 / PR #99 holder compliance gap

- [ ] Switch to **Organization Admin**.
- [ ] Open **Users** and click **Access view** on the demo member row.
- [ ] Confirm the access decision panel shows **Site safety orientation** or similar training with a date.
- [ ] Confirm the panel shows **Electrical safety certification** with an expiry around 2027.
- [ ] Confirm identity, credential, and last site access details still render.
- [ ] Toggle dark mode and confirm the access panel remains readable.
- [ ] Switch to **Identity Holder**.
- [ ] Open sidebar **Training & certs** or `/user/compliance`.
- [ ] Confirm the holder table shows the same seeded training and certification rows.
- [ ] Click **Refresh list** and confirm the table reloads without an error.

Pass/fail notes from cloud validation: automated build/test checks pass, but browser E2E could not be run because Docker/Postgres is unavailable here.

### Priority 2 - M8 wallet preview on `main`

- [ ] Open `/user` and confirm a **Wallet preview** link is present.
- [ ] Open `/user/wallet`.
- [ ] Confirm Apple Wallet and Google Wallet preview cards are visible.
- [ ] Confirm each card says **Preview only** and the page says no real pass is issued.

### Priority 3 - M9 platform org list on `main`

- [ ] Switch to **Platform Administrator**.
- [ ] Open `/platform/organizations`.
- [ ] Confirm **Demo Organization** appears with member, credential, and provider counts.
- [ ] Search `demo` and confirm the demo org remains.
- [ ] Search `zzzznotfound` and confirm the empty state appears.
- [ ] Try **Has members** and **Recently updated** filters.
- [ ] Stop the API and refresh to confirm the API-unreachable banner appears instead of a crash.

### Priority 4 - M10 integration admin stub on `main`

- [ ] Switch to **Integration Admin**.
- [ ] Open `/integrations-admin/providers`.
- [ ] Confirm the provider dropdown, test API base URL field, warning about no live keys, and **Validate test settings** button are visible.
- [ ] Submit default `https://api.origo.test` and confirm success.
- [ ] Submit `http://example.com` and confirm the validation error.

### Priority 5 - M11 CI quality split

- [ ] Open PR #57 or any current PR checks.
- [ ] Confirm separate `lint` and `build` jobs are shown.
- [ ] Confirm `build` still runs Postgres-backed setup, repo build, and tests.

## Recommendation

Review PR #99 first because it is the only remaining M7-specific holder gap not on `main`. Treat M8-M11 as already shipped through PR #57 unless the human wants follow-up polish in a new milestone.
