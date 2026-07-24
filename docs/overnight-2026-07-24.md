# Overnight milestone status: 2026-07-24

## Branch and PR status

- Automation branch: `cursor/noa-milestone-preparation-145c`
- Base: `origin/main` at `cae785f` (`Merge M7-M11: compliance records, wallet preview, platform orgs, integration stub, CI split`)
- M7-M11 implementation: already merged to `main` in PR #57.
- Requested legacy branch `feature/m7-learning-records`: exists on origin, but is 8 commits behind and 2 commits ahead of `origin/main`; no open PR is attached to that branch, and it is superseded by the merged M7-M11 work plus the active M7 follow-up PR #99.
- Active M7 closeout follow-up: https://github.com/jeffilola/noa/pull/99 (`M7 closeout: restore holder compliance records page`), with GitHub `lint` and `build` checks passing.
- Current run PR: to be opened after this report is committed.

## Milestone status

| Milestone | Status | Review surface |
|-----------|--------|----------------|
| M7: Learning & compliance records | Issues #52-#56 closed; merged in PR #57; holder closeout follow-up remains in PR #99 | PR #99 |
| M8: Wallet pass preview | Issue #69 closed; merged in PR #57 | `docs/m8-testing.md` |
| M9: Platform admin org list | Issue #70 closed; merged in PR #57 | `docs/m9-testing.md` |
| M10: Integration admin stub | Issue #71 closed; merged in PR #57 | `docs/m10-testing.md` |
| M11: CI quality split | Issue #72 closed; merged in PR #57 | `docs/m11-testing.md` |

## What shipped in this run

- No duplicate M7-M11 implementation branches were created because the milestone work is already merged/closed.
- Added this current overnight status report for the human review queue.
- Refreshed docs pointers for the M7 demo note and planning/backlog status dates.

## Automated test commands

Current `main`-based docs branch (`cursor/noa-milestone-preparation-145c`):

```bash
pnpm install --frozen-lockfile       # passed
pnpm qa:prepare                      # failed: Docker is not running in this environment
pnpm --filter @noa/api test          # passed; 12 tests / 0 failures / 10 DB-backed skips
pnpm --filter @noa/web build         # passed
```

Active M7 closeout PR #99 (`cursor/noa-milestone-preparation-01f8`) was also validated in a separate worktree:

```bash
pnpm install --frozen-lockfile       # passed
pnpm qa:prepare                      # failed: Docker is not running in this environment
pnpm --filter @noa/api test          # passed; 13 tests / 0 failures / 11 DB-backed skips
pnpm --filter @noa/web build         # passed; build output includes /user/compliance
```

GitHub checks on PR #99 remain green (`lint`, `build`). The unavailable Docker daemon is the only blocker to full local seeded E2E in this cloud run.

## M7 manual E2E checklist for morning review

Cloud/browser manual status: **not run in this environment**. Prioritize these on a local machine with Docker, Clerk dev credentials, and browser access.

### Org admin view

1. Run `docker compose up -d postgres`.
2. Run `pnpm qa:prepare`.
3. Run `pnpm qa:dev` or `pnpm qa:servers`.
4. Sign in as the Clerk user configured by `DEMO_CLERK_USER_ID`.
5. Switch to **Organization Admin**.
6. Open **Users** and click **Access view** on the demo member row.
7. Confirm the access decision panel shows:
   - [ ] **Site safety orientation** (or equivalent seeded training title) with a completion date
   - [ ] **Electrical safety certification** with expiry around 2027
   - [ ] Identity, credential, and last site access fields still populated
8. Toggle dark mode and confirm the panel remains readable.

### Holder view

9. Switch to **Identity Holder**.
10. Open **Training & certs** or navigate directly to `/user/compliance`.
11. Confirm the same training and certification rows appear in the holder table.
12. Click **Refresh list** and confirm the table reloads without error.

### Pass/fail notes

- [ ] Org access panel shows real training + cert data, not generic stub copy.
- [ ] Holder compliance page lists the same seeded records.
- [ ] Dark mode is readable on both pages.

## Prioritized manual E2E after M7

1. M8: open `/user/wallet` and verify Apple/Google Wallet preview placeholders clearly say preview-only/no issuance.
2. M9: open `/platform/organizations`, search for `demo`, and verify count columns plus empty states.
3. M10: open `/integrations-admin/providers`, submit a valid test URL, then submit an `http://` URL and verify validation copy.
4. M11: inspect any open PR checks and confirm `lint` and `build` are separate GitHub Actions jobs.
