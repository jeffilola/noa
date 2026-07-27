# Overnight sprint summary: 2026-07-27

## Branch and PR status

- Automation branch: `cursor/noa-milestone-preparation-b64c`
- Main baseline: `cae785f` (`Merge M7-M11: compliance records, wallet preview, platform orgs, integration stub, CI split`)
- This overnight status PR: https://github.com/jeffilola/noa/pull/110
- M7-M11 implementation PR: https://github.com/jeffilola/noa/pull/57 - merged 2026-06-19 with green `lint` and `build` checks.
- Active M7 holder-compliance closeout PR: https://github.com/jeffilola/noa/pull/99 - open draft, mergeable, GitHub `lint` and `build` checks green.
- Named milestone branches `feature/m7-learning-records`, `feature/m8-wallet-pass-preview`, `feature/m9-platform-org-list`, `feature/m10-integration-admin-stub`, and `feature/m11-ci-quality-split` have no open PRs; their scope is already represented by merged PR #57, with the remaining M7 holder page in PR #99.
- `manageCheckRun` was not available in the Cursor Automation Tools MCP server for this run, so no aggregate check-run update was posted.

## Milestone status

| Milestone | Status | Evidence |
|-----------|--------|----------|
| M7: Learning records | Review-ready via PR #99 for the holder compliance follow-up; base M7 merged in PR #57 | Issues #52-#56 closed; PR #99 adds `/user/compliance`, holder nav, signed-in holder API coverage, and dev compliance bootstrap coverage |
| M8: Wallet pass preview | Done | Issue #69 closed; `/user/wallet` preview-only Apple/Google placeholders merged in PR #57 |
| M9: Platform admin org list | Done | Issue #70 closed; `/platform/organizations` searchable org list merged in PR #57 |
| M10: Integration admin stub | Done | Issue #71 closed; test-mode provider validation merged in PR #57 |
| M11: CI quality split | Done | Issue #72 closed; separate `lint` and `build` jobs merged in PR #57 |

## Automated test commands

### Main branch / current automation branch

```bash
pnpm install --frozen-lockfile            # passed
pnpm qa:prepare                          # blocked: Docker is not running in this environment
pnpm --filter @noa/api test              # passed; 12 tests, 10 DB-backed skips because Postgres is unavailable
pnpm --filter @noa/web build             # passed after workspace package build artifacts were present
```

Note: an initial parallel `pnpm --filter @noa/web build` raced before `@noa/domain` had been built and failed to resolve the workspace package. After building `@noa/domain`, the exact web build command passed twice.

### PR #99 (`cursor/noa-milestone-preparation-01f8`)

```bash
pnpm install --frozen-lockfile            # passed in /tmp/noa-pr99
pnpm qa:prepare                          # blocked: Docker is not running in this environment
pnpm --filter @noa/api test              # passed; 13 tests, 11 DB-backed skips because Postgres is unavailable
pnpm --filter @noa/web build             # passed; route list includes /user/compliance
```

PR #99 source check: `ensureComplianceRecordsForUser` is exported from `@noa/database`, called by dev holder bootstrap paths, and covered by the milestone readiness tests for both org access decisions and signed-in holder compliance records.

## Morning manual E2E checklist

Prioritize PR #99 first because it is the remaining M7 review surface.

1. **M7 org admin panel**
   - Run `docker compose up -d postgres`, `pnpm qa:prepare`, then `pnpm qa:dev`.
   - Sign in as the Clerk user configured by `DEMO_CLERK_USER_ID`.
   - Switch to **Organization Admin**.
   - Open **Users** and click **Access view** on the demo member row.
   - Confirm the access decision panel shows a real training record such as **Site safety orientation** and a certification such as **Electrical safety certification** with a 2027-ish expiry.
   - Toggle dark mode and confirm the panel remains readable.

2. **M7 holder compliance page**
   - Switch to **Identity Holder**.
   - Open **Training & certs** or `/user/compliance`.
   - Confirm the table lists the same seeded training and certification rows.
   - Click **Refresh list** and confirm the table reloads without errors.

3. **M8 wallet preview smoke**
   - Open `/user/wallet`.
   - Confirm Apple Wallet and Google Wallet cards render and both clearly say **Preview only** / no real issuance.

4. **M9 platform org list smoke**
   - Switch to **Platform Administrator** and open `/platform/organizations`.
   - Search `demo` and confirm Demo Organization remains visible with counts.
   - Search a nonsense string and confirm the empty state appears.

5. **M10 integration admin smoke**
   - Switch to **Integration Admin** and open `/integrations-admin/providers`.
   - Submit the default `https://api.origo.test` URL and confirm success.
   - Submit `http://example.com` and confirm validation rejects it.

6. **M11 CI split**
   - Inspect an open PR and confirm GitHub shows separate `lint` and `build` checks.

## Test guides

- [M7 testing](./m7-testing.md)
- [M8 testing](./m8-testing.md)
- [M9 testing](./m9-testing.md)
- [M10 testing](./m10-testing.md)
- [M11 testing](./m11-testing.md)
