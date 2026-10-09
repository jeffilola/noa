# Overnight milestone status - 2026-10-09

## Summary

- M7-M11 remain shipped on `main` through [PR #57](https://github.com/jeffilola/noa/pull/57), with issues #52-#56 and #69-#72 closed.
- The original focused `feature/m7` through `feature/m11` branches still exist but are behind `main`; no duplicate feature PRs were opened.
- Active M7 follow-up: [PR #99](https://github.com/jeffilola/noa/pull/99) adds the holder `/user/compliance` page and signed-in holder compliance API path for the current M7 testing guide.
- This overnight run is documented in the current status PR.
- `manageCheckRun` was not available in the configured automation tools, so aggregate status is recorded here and in PR comments instead.

## PRs and milestone status

| Milestone | Status | Review URL |
|-----------|--------|------------|
| M7: Learning records | Shipped in PR #57; holder `/user/compliance` follow-up remains reviewable in PR #99 | [#57](https://github.com/jeffilola/noa/pull/57), [#99](https://github.com/jeffilola/noa/pull/99) |
| M8: Wallet pass preview | Shipped and closed | [#57](https://github.com/jeffilola/noa/pull/57) |
| M9: Platform admin org list | Shipped and closed | [#57](https://github.com/jeffilola/noa/pull/57) |
| M10: Integration admin stub | Shipped and closed | [#57](https://github.com/jeffilola/noa/pull/57) |
| M11: CI quality split | Shipped and closed; CI has separate `lint` and `build` jobs | [#57](https://github.com/jeffilola/noa/pull/57) |

## Automated checks

### Current `main` / overnight docs branch

| Command | Result | Notes |
|---------|--------|-------|
| `pnpm qa:prepare` | Blocked | Docker is not running in this Cloud VM; rerun locally with Docker/Postgres. |
| `pnpm install --frozen-lockfile` | Passed | Workspace dependencies installed. |
| `pnpm --filter @noa/api test` | Passed | 12 tests observed, 0 failures, 10 DB-backed cases skipped because Postgres is unavailable. |
| `pnpm --filter @noa/web build` | Passed | Next build completed; routes include `/user/wallet`, `/platform/organizations`, and `/integrations-admin/providers`. |

### M7 follow-up PR #99

| Command | Result | Notes |
|---------|--------|-------|
| `pnpm qa:prepare` | Blocked | Same Docker/Postgres limitation in the isolated PR #99 worktree. |
| `pnpm install --frozen-lockfile` | Passed | Worktree dependencies installed. |
| `pnpm --filter @noa/api test` | Passed | 13 tests observed, 0 failures, 11 DB-backed cases skipped because Postgres is unavailable. |
| `pnpm --filter @noa/web build` | Passed | Next build completed and included `/user/compliance`. |

## Morning manual E2E priorities

Run these locally with Docker/Postgres before merging or closing any remaining review work.

1. Start local dependencies: `docker compose up -d postgres`, then `pnpm qa:prepare` and `pnpm qa:dev`.
2. M7 org admin: switch to Organization Admin, open Users, click Access view for the demo member, and confirm real training/certification rows plus identity, credential, and last access data.
3. M7 holder: switch to Identity Holder, open Training & certs or `/user/compliance`, confirm the same seeded training/cert rows, and click Refresh list.
4. M7 theme check: toggle dark mode on the access panel and holder table.
5. M8: open `/user/wallet`, confirm Apple/Google preview cards, "Preview only" labeling, and no real issuance language.
6. M9: open `/platform/organizations`, search for `demo`, search for a nonsense string, apply "Has members" and "Recently updated", then verify the offline API banner by stopping the API and refreshing.
7. M10: open `/integrations-admin/providers`, validate the default HTTPS test URL for success, then validate an `http://` URL for the expected error.
8. M11: verify current PR checks show separate green `lint` and `build` jobs.
