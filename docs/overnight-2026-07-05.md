# Overnight sprint status - 2026-07-05

Cron run: 2026-07-05 23:02 UTC

## PR URLs

- M7-M11 implementation PR: https://github.com/jeffilola/noa/pull/57 - merged into `main` on 2026-06-19.
- Most recent prior overnight verification PR: https://github.com/jeffilola/noa/pull/86 - open, with `lint` and `build` checks passing.
- Current overnight verification PR: https://github.com/jeffilola/noa/pull/87.

Separate M7-M11 feature PRs are no longer applicable because the combined M7-M11 milestone batch is already merged on `main`. No PRs were merged, no force-push was used, and no secrets were added.

## Milestone and issue status

- M7 Learning & compliance records: merged in PR #57; issues #52-#56 are closed.
- M8 Wallet pass preview stub: merged in PR #57; issue #69 is closed.
- M9 Platform admin org list: merged in PR #57; issue #70 is closed.
- M10 Integration admin provider stub: merged in PR #57; issue #71 is closed.
- M11 CI quality split: merged in PR #57; issue #72 is closed.

`manageCheckRun` was requested where possible, but no check-run MCP tool is available in the current automation toolset.

## What shipped in PR #57

- M7: persisted compliance learning records seeded through `ensureComplianceRecordsForUser`, surfaced in org access decisions and holder compliance views.
- M8: preview-only Apple Wallet and Google Wallet placeholders at `/user/wallet`; no real issuance flow.
- M9: platform admin organization list and search under `/platform/organizations`.
- M10: integration admin provider connection form with test-mode URL validation and no live provider keys.
- M11: CI split into separate `lint` and `build` GitHub Actions jobs.

## Automated checks run on 2026-07-05

- `pnpm install --frozen-lockfile` - PASS.
- `pnpm qa:prepare` - FAIL/BLOCKED: Docker is not running in this cloud VM, so Postgres/migrations/seed could not start here.
- `pnpm --filter @noa/api test` - PASS: 12 tests discovered, 2 validation tests passed, 10 DB-backed tests skipped because Postgres was unavailable.
- `pnpm --filter @noa/web build` - PASS.
- `pnpm lint` - PASS: 7 turbo tasks successful.
- `pnpm build` - PASS: 9 workspace build tasks successful.
- `pnpm test` - PASS: 10 turbo test tasks successful, with the same 10 DB-backed API skips because Postgres was unavailable.
- PR #57 CI at merge - PASS: separate `lint` and `build` checks succeeded.
- PR #86 CI - PASS: separate `lint` and `build` checks succeeded on the previous overnight docs PR.

## M7 E2E checklist with pass/fail notes

From `docs/m7-testing.md`:

### Preconditions

- [ ] `docker compose up -d postgres` - NOT RUN in cloud VM; required locally.
- [ ] `pnpm qa:prepare` - BLOCKED in cloud VM because Docker is unavailable.
- [ ] `pnpm qa:dev` - NOT RUN; depends on successful local Docker/Postgres setup.
- [ ] Sign in as the Clerk user in `packages/database/.env` (`DEMO_CLERK_USER_ID`) - NOT RUN in cloud VM.

### Org admin view

- [ ] Switch to **Organization Admin** - NOT RUN; browser/local auth needed.
- [ ] Open **Users** and click **Access view** on the demo member row - NOT RUN.
- [ ] Confirm **Site safety orientation** or similar training title appears with a date - NOT RUN; DB-backed API test covering seeded/listed compliance records skipped without Postgres.
- [ ] Confirm **Electrical safety certification** appears with expiry around 2027 - NOT RUN; DB-backed API test covering seeded/listed compliance records skipped without Postgres.
- [ ] Confirm identity, credential, and last site access remain populated - NOT RUN.
- [ ] Toggle dark mode and confirm access panel readability - NOT RUN.

### Holder view

- [ ] Switch to **Identity Holder** - NOT RUN.
- [ ] Open **Training & certs** or `/user/compliance` - NOT RUN.
- [ ] Confirm the same training and certification rows appear - NOT RUN.
- [ ] Click **Refresh list** and confirm table reloads without error - NOT RUN.

### Automated support for M7

- [x] `ensureComplianceRecordsForUser` is exported from `@noa/database`.
- [x] Demo bootstrap paths call `ensureComplianceRecordsForUser` for holder/demo org records.
- [x] API milestone readiness test covers compliance record seeding/listing; it skipped here only because the database was unavailable.
- [x] `pnpm --filter @noa/api test` passed with DB-backed skips.
- [x] `pnpm --filter @noa/web build` passed.

## Prioritized manual E2E steps for morning review

1. Start Docker/Postgres locally, then run `pnpm qa:prepare` and `pnpm qa:dev`.
2. M7 first: complete the org access panel and holder compliance checks above, because those DB-backed/browser paths could not run in cloud.
3. M8: open `/user/wallet`; verify Apple/Google Wallet cards, `Preview only` labels, and clear no-real-issuance copy.
4. M9: open `/platform/organizations`; verify Demo Organization counts, search for `demo`, search for `zzzznotfound`, apply filters, and confirm the offline banner if the API is stopped.
5. M10: open `/integrations-admin/providers`; submit `https://api.origo.test` for success, then `http://example.com` for rejection; confirm no provider secrets are requested or stored.
6. M11: confirm GitHub Actions still shows separate `lint` and `build` jobs on PRs.

