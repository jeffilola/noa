# Overnight sprint summary: 2026-08-06

## Branch and PR status

- Automation branch: `cursor/noa-milestone-preparation-a3ed`
- Primary M7-M11 delivery PR: https://github.com/jeffilola/noa/pull/57 (merged)
- Active M7 follow-up PR: https://github.com/jeffilola/noa/pull/99 (draft, clean, CI `lint` + `build` green as of this run's GitHub check)
- Latest overnight status PR: pending
- Requested `feature/m7-learning-records`: visible on origin, but M7-M11 already landed through PR #57 and the active M7 closeout branch is PR #99.
- GitHub issue/milestone creation or closure: not performed by this run; M7-M11 milestones and issues are already closed, and only read-only `gh` access is available here.

## Milestone status

| Milestone | Status | Evidence |
|-----------|--------|----------|
| M7 Learning records | Merged in PR #57; holder `/user/compliance` follow-up remains in PR #99 | Issues #52-#56 closed; PR #99 restores holder Training & certs page |
| M8 Wallet pass preview | Merged in PR #57 | Issue #69 closed; `/user/wallet` preview-only Apple/Google cards |
| M9 Platform org list | Merged in PR #57 | Issue #70 closed; `/platform/organizations` search/list backed by `GET /organizations` |
| M10 Integration admin stub | Merged in PR #57 | Issue #71 closed; `/integrations-admin/providers` test-mode validation form |
| M11 CI quality split | Merged in PR #57 | Issue #72 closed; separate GitHub Actions `lint` and `build` jobs |

Current open roadmap issues are M12-M16: #73, #74, #75, #76, and #77.

## Automated test commands

```bash
pnpm qa:prepare                         # failed: Docker is not running in this VM
pnpm install --frozen-lockfile           # passed; node_modules was absent before install
pnpm --filter @noa/api test             # passed; 12 tests, 0 failed, 10 DB-backed skips
pnpm --filter @noa/web build            # passed; Next build generated 35 app routes
```

`manageCheckRun` is not available in the configured Cursor Automation Tools MCP server for this run.

Build note: the web route list includes `/user/wallet`, `/platform/organizations`, and
`/integrations-admin/providers`. The holder `/user/compliance` route is still part of the active
M7 follow-up PR #99 rather than `main`.

Compliance bootstrap note: `ensureComplianceRecordsForUser` remains present on `main`, is guarded
against production use, and is invoked by the holder demo bootstrap path. The DB-backed test that
asserts it seeds two records for org access decisions skipped here because Docker/Postgres was not
available.

## M7 manual E2E checklist for morning review

From [m7-testing.md](./m7-testing.md):

- [ ] Run `docker compose up -d postgres`, `pnpm qa:prepare`, then `pnpm qa:dev`.
- [ ] Sign in as `DEMO_CLERK_USER_ID`.
- [ ] Switch to **Organization Admin**.
- [ ] Open **Users** -> **Access view** on the demo member row.
- [ ] Confirm the access decision panel shows **Site safety orientation** or similar training with a date.
- [ ] Confirm the panel shows **Electrical safety certification** with an expiry around 2027.
- [ ] Confirm identity, credential, and last site access details still render.
- [ ] Toggle dark mode and confirm the panel remains readable.
- [ ] Switch to **Identity Holder**.
- [ ] Open **Training & certs** or `/user/compliance` from PR #99.
- [ ] Confirm the holder table shows the same training and certification records.
- [ ] Click **Refresh list** and confirm the table reloads without error.

Priority: review PR #99 first if the holder checklist item is the only remaining M7 closeout gap.

## M8-M11 smoke checklist

1. M8: open `/user/wallet`; verify Apple Wallet and Google Wallet cards say **Preview only** and explain no real pass issuance.
2. M9: open `/platform/organizations`; search for `demo`, then `zzzznotfound`; verify counts, filters, and empty state.
3. M10: open `/integrations-admin/providers`; validate default `https://api.origo.test`, then `http://example.com`; verify success/error behavior and no live-key storage.
4. M11: inspect the PR checks; verify `lint` and `build` are separate.
