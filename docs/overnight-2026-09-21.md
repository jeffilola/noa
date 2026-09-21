# Overnight sprint status: 2026-09-21

## Summary

- The sprint prompt is stale against current `main`: M7-M11 were merged in [PR #57](https://github.com/jeffilola/noa/pull/57) on 2026-06-19.
- I did not create duplicate M8-M11 feature branches or PRs. Current open product work is M12-M16 ([#73](https://github.com/jeffilola/noa/issues/73)-[#77](https://github.com/jeffilola/noa/issues/77)).
- The active M7 follow-up is [PR #99](https://github.com/jeffilola/noa/pull/99), `M7 closeout: restore holder compliance records page`. It is still open as a draft, has a clean merge state, and its visible `lint` and `build` checks are green.
- `manageCheckRun` is not available in the configured automation tools, so no aggregate check run was posted.

## PR and milestone status

| Area | Status |
|------|--------|
| M7 learning records | Shipped in PR #57; holder compliance follow-up remains in draft PR #99 |
| M8 wallet pass preview | Shipped in PR #57 |
| M9 platform admin org list | Shipped in PR #57 |
| M10 integration admin stub | Shipped in PR #57 |
| M11 CI quality split | Shipped in PR #57 |
| M12-M16 | Open issues #73-#77 remain the current roadmap |

## Automated test results

| Command | Result | Notes |
|---------|--------|-------|
| `pnpm qa:prepare` | Failed | Docker is not running in this Cloud VM, so Postgres bootstrap, migrations, and seed could not run. |
| `pnpm install` | Passed | Lockfile was already up to date; dependencies installed cleanly. |
| `pnpm --filter @noa/api test` | Passed | 12 tests total: 2 passed, 10 DB-backed tests skipped because Postgres was unavailable. The safe integration URL validation tests ran and passed. |
| `pnpm --filter @noa/web build` | Passed | First parallel attempt ran before workspace package outputs existed and failed module resolution; rerun after package builds completed passed. |

## Manual E2E checklist for morning review

Use a local machine with Docker/Postgres running.

### M7 - Training and certs

- [ ] Run `pnpm qa:prepare`, then `pnpm qa:dev`.
- [ ] Sign in as the Clerk user configured by `DEMO_CLERK_USER_ID`.
- [ ] Switch to Organization Admin and open `/org/users`.
- [ ] Click the demo member's access view.
- [ ] Confirm the access decision panel shows real seeded training and certification records, including a site safety orientation and an electrical safety certification expiring around 2027.
- [ ] Confirm identity, credential, and last site access details still render.
- [ ] Toggle dark mode and confirm the panel remains readable.
- [ ] Review PR #99 for the holder `/user/compliance` follow-up before marking M7 fully closed.

### M8 - Wallet preview

- [ ] Sign in as a holder and open `/user`.
- [ ] Confirm the Wallet preview link is visible.
- [ ] Open `/user/wallet`.
- [ ] Confirm Apple Wallet and Google Wallet preview cards render.
- [ ] Confirm both cards clearly say preview-only and no real wallet issuance occurs.

### M9 - Platform org list

- [ ] Switch to Platform Administrator.
- [ ] Open `/platform/organizations`.
- [ ] Confirm Demo Organization appears with member, credential, and provider counts.
- [ ] Search for `demo` and confirm the demo org remains visible.
- [ ] Search for `zzzznotfound` and confirm the empty state renders.
- [ ] Apply the "Has members" and "Recently updated" filters.
- [ ] Stop the API and refresh the page to confirm the API-unreachable banner appears instead of a crash.

### M10 - Integration admin stub

- [ ] Switch to Integration Admin.
- [ ] Open `/integrations-admin/providers`.
- [ ] Confirm the provider dropdown, HTTPS test URL field, no-live-keys warning, and validation button render.
- [ ] Submit `https://api.origo.test` and confirm a success message.
- [ ] Submit `http://example.com` and confirm a validation error.
- [ ] Confirm no provider credentials or live keys are requested or stored.

### M11 - CI split

- [ ] Open PR #57 or any current PR.
- [ ] Confirm GitHub Actions exposes separate `lint` and `build` jobs.
- [ ] Confirm `build` still runs with Postgres and executes repository tests.

## Morning priorities

1. Review PR #99 first, because it is the remaining M7 holder compliance follow-up and is still draft.
2. Run `pnpm qa:prepare` locally with Docker to verify seeded compliance records end-to-end.
3. Walk the M7-M11 browser checklist above, prioritizing M7 and M10 because they depend on seeded role/demo data and API validation behavior.
