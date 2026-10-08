# Overnight sprint status: 2026-10-08

## Summary

The overnight M7-M11 prompt is stale relative to `main`. M7-M11 shipped together in [PR #57](https://github.com/jeffilola/noa/pull/57), and the active M7 holder compliance follow-up remains [PR #99](https://github.com/jeffilola/noa/pull/99).

No duplicate M8-M11 branches were opened tonight because the work, docs, and GitHub issues were already completed or merged. `origin/feature/m7-learning-records` is also behind `main` (`2` commits unique to that branch, `8` commits behind `origin/main`), so it was not used as the current review branch.

## PR and milestone status

| Slice | Status | PR |
|-------|--------|----|
| M7: Learning records | Merged in PR #57; holder compliance page follow-up remains open and draft-clean in PR #99 | [#57](https://github.com/jeffilola/noa/pull/57), [#99](https://github.com/jeffilola/noa/pull/99) |
| M8: Wallet pass preview | Merged in PR #57 | [#57](https://github.com/jeffilola/noa/pull/57) |
| M9: Platform admin org list | Merged in PR #57 | [#57](https://github.com/jeffilola/noa/pull/57) |
| M10: Integration admin stub | Merged in PR #57 | [#57](https://github.com/jeffilola/noa/pull/57) |
| M11: CI quality split | Merged in PR #57; GitHub shows separate `lint` and `build` checks | [#57](https://github.com/jeffilola/noa/pull/57) |
| Tonight's docs/status update | Pending review | This PR |

GitHub issue/milestone mutation was not performed tonight; the available `gh` CLI is read-only, and no write-capable issue or milestone tool is configured for this automation. Existing open issues are M12-M16 (#73-#77).

## Automated validation

### Current `main` snapshot / docs branch

```bash
pnpm install --frozen-lockfile        # pass
pnpm qa:prepare                       # blocked: Docker is not running in this environment
pnpm --filter @noa/api test           # pass: 12 tests, 0 failures, 10 DB-backed skips
pnpm --filter @noa/web build          # pass
```

Notes:

- `qa:prepare` stops before migrations/seed because Docker is unavailable on this VM.
- API tests still cover non-DB validation paths; DB-backed integration cases are skipped without Postgres.
- Web build on `main` includes the merged M8-M11 routes, but not the PR #99 holder `/user/compliance` route because PR #99 is still unmerged.

### Active M7 follow-up PR #99

Validated in a detached worktree at `origin/cursor/noa-milestone-preparation-01f8`:

```bash
pnpm install --frozen-lockfile        # pass
pnpm qa:prepare                       # blocked: Docker is not running in this environment
pnpm --filter @noa/api test           # pass: 13 tests, 0 failures, 11 DB-backed skips
pnpm --filter @noa/web build          # pass; build includes /user/compliance
```

GitHub checks visible tonight:

- PR #57: `lint` success, `build` success.
- PR #99: `lint` success, `build` success; merge state `CLEAN`; draft remains open.

## M7 manual E2E checklist for morning review

Run locally with Docker/Postgres:

```powershell
cd C:\Users\jeffe\Projects\noa
docker compose up -d postgres
pnpm qa:prepare
pnpm qa:dev
```

Sign in as the Clerk user in `packages/database/.env` (`DEMO_CLERK_USER_ID`).

### Org admin view

- [ ] Switch to **Organization Admin**.
- [ ] Open **Users** and click **Access view** on the demo member row.
- [ ] Confirm **Site safety orientation** or similar training title appears with a date.
- [ ] Confirm **Electrical safety certification** appears with an expiry around 2027.
- [ ] Confirm identity, credential, and last site access are still filled in.
- [ ] Toggle dark mode and confirm the panel remains readable.

### Holder view

- [ ] Switch to **Identity Holder**.
- [ ] Open **Training & certs** or `/user/compliance`.
- [ ] Confirm the same training and certification rows appear in the table.
- [ ] Click **Refresh list** and confirm the table reloads without error.

### Pass criteria

- [ ] Org access panel shows real training and certification records, not generic stub copy.
- [ ] Holder compliance page lists the same seeded records.
- [ ] Dark mode is readable on both pages.

Manual pass/fail notes: not run in this environment because Docker/Postgres and browser sign-in are required. Prioritize PR #99 locally because it contains the holder `/user/compliance` follow-up.

## Prioritized morning review order

1. PR #99 M7 follow-up: run the full M7 checklist above after `pnpm qa:prepare`.
2. PR #57 already merged: spot-check M8 `/user/wallet`, M9 `/platform/organizations`, M10 `/integrations-admin/providers`, and M11 split checks only if regression confidence is needed.
3. Tonight's docs/status PR: verify the status record and backlog/planning/demo links are accurate.
