# Overnight sprint summary: 2026-09-23

## Branch and PR status

- Automation branch: `cursor/noa-milestone-preparation-971b`
- M7-M11 implementation PR: [#57](https://github.com/jeffilola/noa/pull/57) merged.
- Active M7 holder compliance follow-up: [#99](https://github.com/jeffilola/noa/pull/99) open as a draft, merge state clean, visible GitHub `lint` and `build` checks green.
- Prior overnight status PR: [#151](https://github.com/jeffilola/noa/pull/151) open as a draft, merge state clean, visible GitHub `lint` and `build` checks green.
- Current docs/status PR: created from this branch for the human morning review.

## Milestone status

The overnight prompt still describes the original M7-M11 sprint plan, but GitHub and `main` show that work is already complete:

| Milestone | Status | Review surface |
|-----------|--------|----------------|
| M7: Learning records | Done in PR #57; holder compliance follow-up remains PR #99 | [m7-testing.md](./m7-testing.md) |
| M8: Wallet pass preview | Done in PR #57 | [m8-testing.md](./m8-testing.md) |
| M9: Platform org list | Done in PR #57 | [m9-testing.md](./m9-testing.md) |
| M10: Integration admin stub | Done in PR #57 | [m10-testing.md](./m10-testing.md) |
| M11: CI quality split | Done in PR #57 | [m11-testing.md](./m11-testing.md) |

No duplicate M8-M11 feature branches or PRs were created tonight because issues #69-#72 and milestones M8-M11 are already closed. M7 issues #52-#56 are also closed; PR #99 is the remaining holder-facing closeout check.

## Automated test commands

Current branch (`main` plus this docs update):

```bash
pnpm install --frozen-lockfile             # passed
pnpm qa:prepare                           # blocked: Docker is not running in this environment
pnpm --filter @noa/api test               # passed; 12 tests total, 2 passed, 10 DB-backed tests skipped
pnpm --filter @noa/web build              # passed after dependency packages were built by the API test sequence
```

Active M7 follow-up branch (`origin/cursor/noa-milestone-preparation-01f8`, PR #99):

```bash
pnpm install --frozen-lockfile             # passed
pnpm qa:prepare                           # blocked: Docker is not running in this environment
pnpm --filter @noa/api test               # passed; 13 tests total, 2 passed, 11 DB-backed tests skipped
pnpm --filter @noa/web build              # passed after dependency packages were built; route list includes /user/compliance
```

Notes:

- The cloud environment has no Docker daemon, so `qa:prepare` cannot start Postgres or run DB-backed seed/migration checks here.
- Running `pnpm --filter @noa/web build` before workspace package build outputs exist can fail with missing `@noa/domain` or `@noa/shared`. In the requested sequential flow, the API test command builds those packages first; the subsequent web build passed.
- `manageCheckRun` is not available in the configured automation tools, so no aggregate check run was posted.

## M7 manual E2E checklist for morning review

Use a local machine with Docker/Postgres:

1. `docker compose up -d postgres`
2. `pnpm qa:prepare`
3. `pnpm qa:dev`
4. Sign in as the Clerk user configured by `DEMO_CLERK_USER_ID`.

Org admin view:

- [ ] Switch to **Organization Admin**.
- [ ] Open **Users** and click **Access view** on the demo member row.
- [ ] Confirm **Site safety orientation** or equivalent training appears with a date.
- [ ] Confirm **Electrical safety certification** appears with an expiry around 2027.
- [ ] Confirm identity, credential, and last site access details still render.
- [ ] Toggle dark mode and confirm the panel remains readable.

Holder view on PR #99:

- [ ] Switch to **Identity Holder**.
- [ ] Open **Training & certs** or `/user/compliance`.
- [ ] Confirm the holder table shows the same seeded training and certification rows.
- [ ] Click **Refresh list** and confirm the table reloads without error.

Follow-up milestone smoke checks:

- [ ] M8: open `/user/wallet`; confirm Apple and Google preview cards show **Preview only** and no real issuance language.
- [ ] M9: open `/platform/organizations`; search for `demo`, then `zzzznotfound`; confirm counts, results, and empty state.
- [ ] M10: open `/integrations-admin/providers`; validate `https://api.origo.test`, then validate an `http://` URL and confirm the expected error.
- [ ] M11: inspect PR checks and confirm `lint` and `build` are separate jobs.

## Morning review priority

1. Review PR #99 first because it is the only open M7 product follow-up and is where `/user/compliance` is currently validated.
2. Run the full M7 browser checklist locally with Docker so the skipped DB-backed compliance seed checks execute against Postgres.
3. Skim M8-M11 from PR #57/main using the linked test guides; they remain merged and issue-complete.
