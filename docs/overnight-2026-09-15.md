# Overnight sprint status: 2026-09-15

## Scope check

The cron prompt still describes the original M7-M11 overnight sprint plan. Current repository and GitHub state show that work already landed:

- M7-M11 shipped together in [PR #57](https://github.com/jeffilola/noa/pull/57), merged 2026-06-19.
- GitHub milestones M7, M8, M9, M10, and M11 are closed with zero open issues.
- Issues [#52](https://github.com/jeffilola/noa/issues/52)-[#56](https://github.com/jeffilola/noa/issues/56) and [#69](https://github.com/jeffilola/noa/issues/69)-[#72](https://github.com/jeffilola/noa/issues/72) are closed.
- [PR #99](https://github.com/jeffilola/noa/pull/99) remains the active draft M7 follow-up for the holder `/user/compliance` page.
- Current open roadmap work is M12-M16: [#73](https://github.com/jeffilola/noa/issues/73)-[#77](https://github.com/jeffilola/noa/issues/77).

No new M8-M11 implementation branches were created because those milestones are already merged and closed. Issue and milestone mutations were not performed from this run because only read-only GitHub inspection was available.

## PR status

| Area | PR | Status |
|------|----|--------|
| M7-M11 milestone bundle | [#57](https://github.com/jeffilola/noa/pull/57) | Merged; CI `lint` and `build` passed before merge |
| M7 holder compliance follow-up | [#99](https://github.com/jeffilola/noa/pull/99) | Open draft; merge state clean; GitHub `lint` and `build` checks green |
| 2026-09-15 overnight status | [#146](https://github.com/jeffilola/noa/pull/146) | Documentation-only PR from this run |

## Automated validation

### Current `main` checkout

| Command | Result | Notes |
|---------|--------|-------|
| `pnpm qa:prepare` | Failed | Docker/Postgres is unavailable in this cloud environment; script stopped with "Docker is not running." |
| `pnpm install --frozen-lockfile` | Passed | Needed because `node_modules` was missing. |
| `pnpm --filter @noa/api test` | Passed | 12 tests discovered; 2 passed; 10 DB-backed integration tests skipped because Postgres was unavailable. |
| `pnpm --filter @noa/web build` | Passed | Next build completed; expected Next `middleware` deprecation warning only. |

### Active M7 follow-up PR #99 worktree

| Command | Result | Notes |
|---------|--------|-------|
| `pnpm install --frozen-lockfile` | Passed | Installed in an isolated `/tmp/noa-pr99` worktree. |
| `pnpm qa:prepare` | Failed | Same Docker/Postgres availability gate as current `main`. |
| `pnpm --filter @noa/api test` | Passed | 13 tests discovered; 2 passed; 11 DB-backed integration tests skipped. Includes the signed-in holder compliance records test, skipped only because DB was unavailable. |
| `pnpm --filter @noa/web build` | Passed | Build output includes `/user/compliance`, confirming the M7 holder follow-up route is present on PR #99. |

## Morning manual E2E checklist

Prioritize the active M7 follow-up first, then spot-check the already-merged M8-M11 surfaces.

### M7: learning and compliance records

1. Run `docker compose up -d postgres`.
2. Run `pnpm qa:prepare`.
3. Run `pnpm qa:dev`.
4. Sign in as the Clerk user configured by `DEMO_CLERK_USER_ID`.
5. Switch to **Organization Admin**.
6. Open **Users** and click **Access view** on the demo member row.
7. Confirm the access decision panel shows:
   - [ ] **Site safety orientation** or similar training title with a date.
   - [ ] **Electrical safety certification** with an expiry around 2027.
   - [ ] Identity, credential, and last site access data from earlier milestones.
8. Toggle dark mode and confirm the panel remains readable.
9. Switch to **Identity Holder**.
10. Open **Training & certs** or `/user/compliance`.
11. Confirm the same training and certification rows render in the holder table.
12. Click **Refresh list** and confirm the table reloads without error.

### M8: wallet pass preview

1. Open `/user`.
2. Confirm the **Wallet preview** link is visible.
3. Open `/user/wallet`.
4. Confirm Apple Wallet and Google Wallet preview cards render.
5. Confirm both cards say **Preview only**.
6. Confirm copy states that no real pass, barcode, or Apple/Google enrollment is created.

### M9: platform admin org list

1. Switch to **Platform Administrator**.
2. Open `/platform/organizations`.
3. Confirm **Demo Organization** appears with member, credential, and provider counts.
4. Search `demo` and confirm the demo organization remains.
5. Search `zzzznotfound` and confirm the empty state renders.
6. Try **Has members** and **Recently updated** filters and confirm the list reloads.
7. Stop the API and refresh; confirm the API-unreachable banner appears instead of a crash.

### M10: integration admin test-mode stub

1. Switch to **Integration Admin**.
2. Open `/integrations-admin/providers`.
3. Confirm the provider dropdown, test API base URL field, warning copy, and **Validate test settings** button render.
4. Submit `https://api.origo.test` and confirm success.
5. Submit `http://example.com` and confirm an error.
6. Confirm no provider credentials or live keys are requested or stored.

### M11: CI quality split

1. Open PR checks on [PR #57](https://github.com/jeffilola/noa/pull/57), [PR #99](https://github.com/jeffilola/noa/pull/99), or the current status PR.
2. Confirm `lint` and `build` are separate CI jobs.
3. Confirm `build` still runs database-backed setup in GitHub Actions.

## Review recommendation

- Review and merge [PR #99](https://github.com/jeffilola/noa/pull/99) first if the holder `/user/compliance` page is still desired for M7 closeout.
- Treat M8-M11 as already done via [PR #57](https://github.com/jeffilola/noa/pull/57).
- Continue morning planning with M12-M16 issues [#73](https://github.com/jeffilola/noa/issues/73)-[#77](https://github.com/jeffilola/noa/issues/77).
