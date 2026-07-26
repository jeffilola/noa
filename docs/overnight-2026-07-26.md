# Overnight milestone status: 2026-07-26

## Current branch and PR status

- Automation branch: `cursor/noa-milestone-preparation-bdd9`
- Status PR: to be opened from this branch after validation notes are recorded.
- M7 follow-up PR: [#99 — M7 closeout: restore holder compliance records page](https://github.com/jeffilola/noa/pull/99)
- Original M7-M11 milestone PR: [#57 — Prepare M7-M11 milestone review slices](https://github.com/jeffilola/noa/pull/57) (merged)
- Previous overnight rollup PR: [#108 — Record 2026-07-25 overnight milestone status](https://github.com/jeffilola/noa/pull/108)

## Milestone status

| Milestone | Status | Review surface |
|-----------|--------|----------------|
| M7 | Merged in PR #57; active holder compliance follow-up is open/green in PR #99 | Review PR #99 for `/user/compliance` holder page and seeded compliance bootstrap |
| M8 | Merged in PR #57 | Wallet preview test guide: [m8-testing.md](./m8-testing.md) |
| M9 | Merged in PR #57 | Platform org list test guide: [m9-testing.md](./m9-testing.md) |
| M10 | Merged in PR #57 | Integration admin stub test guide: [m10-testing.md](./m10-testing.md) |
| M11 | Merged in PR #57 | CI split test guide: [m11-testing.md](./m11-testing.md) |

Notes:

- `feature/m7-learning-records` still exists on origin but has no open PR and is currently 8 commits behind / 2 commits ahead of `origin/main`.
- M7-M11 issues (#52-#56 and #69-#72) are already closed; current open milestone issues are M12-M16 (#73-#77).
- `manageCheckRun` is not available in the current Cursor Automation Tools MCP server.

## Automated validation

### Current `main` + overnight docs branch

```bash
pnpm install --frozen-lockfile          # pass
pnpm qa:prepare                         # fail: Docker is not running in Cursor Cloud
pnpm --filter @noa/api test             # pass: 12 tests, 2 passed, 10 DB-backed tests skipped
pnpm --filter @noa/web build            # pass
```

Notes:

- `qa:prepare` stops before migrations/seed because this environment has no running Docker daemon.
- The current branch is based on `origin/main`, so it reflects the M7-M11 work that already merged in PR #57.

### Active M7 follow-up PR #99

Validated in a detached worktree at `origin/cursor/noa-milestone-preparation-01f8`:

```bash
pnpm install --frozen-lockfile          # pass
pnpm qa:prepare                         # fail: Docker is not running in Cursor Cloud
pnpm --filter @noa/api test             # pass: 13 tests, 2 passed, 11 DB-backed tests skipped
pnpm --filter @noa/web build            # pass; route list includes /user/compliance
```

GitHub checks on PR #99 are green as of this run: `lint`, `build`, `label`, and `remind-issue-link`.

## Prioritized manual E2E for morning review

1. M7 follow-up PR #99: run `pnpm qa:prepare`, sign in as the `DEMO_CLERK_USER_ID`, switch to **Identity Holder**, open **Training & certs** (`/user/compliance`), confirm seeded training/cert rows render, and click **Refresh list**.
2. M7 org panel: switch to **Organization Admin**, open **Users** -> **Access view**, and confirm the decision panel shows real **Site safety orientation** and **Electrical safety certification** records instead of stub copy.
3. M7 theming: toggle dark mode on both the org access panel and holder compliance page.
4. M8: open `/user/wallet`; confirm Apple Wallet and Google Wallet cards say **Preview only** and do not imply real pass issuance.
5. M9: open `/platform/organizations`; search for `demo`, then `zzzznotfound`, and verify table counts plus empty state.
6. M10: open `/integrations-admin/providers`; validate `https://api.origo.test` succeeds and `http://example.com` fails without storing provider keys.
7. M11: inspect open PR checks and confirm separate `lint` and `build` jobs are present.

## Test guides

- [M7 testing](./m7-testing.md)
- [M8 testing](./m8-testing.md)
- [M9 testing](./m9-testing.md)
- [M10 testing](./m10-testing.md)
- [M11 testing](./m11-testing.md)
