# Overnight status: 2026-10-06

## Summary

- The M7-M11 sprint prompt is already implemented on `main` via merged PR [#57](https://github.com/jeffilola/noa/pull/57).
- The focused M8-M11 feature branches still exist remotely, but their changes are already represented in the M7-M11 merge commit on `main`; no duplicate milestone PRs were opened.
- Active M7 follow-up PR [#99](https://github.com/jeffilola/noa/pull/99) remains the review target for the holder `/user/compliance` closeout gap from `docs/m7-testing.md`.
- This docs/status PR records today's validation results and the manual E2E checklist for the human morning review.

## PRs and milestone status

| Milestone | Status | PR / branch |
|-----------|--------|-------------|
| M7: Learning records | Main slice merged; holder compliance follow-up still open for review | [#57](https://github.com/jeffilola/noa/pull/57), [#99](https://github.com/jeffilola/noa/pull/99) |
| M8: Wallet pass preview | Merged on `main`; no live issuance included | [#57](https://github.com/jeffilola/noa/pull/57), `origin/feature/m8-wallet-pass-preview` |
| M9: Platform admin org list | Merged on `main` | [#57](https://github.com/jeffilola/noa/pull/57), `origin/feature/m9-platform-org-list` |
| M10: Integration admin stub | Merged on `main`; test-mode only, no provider keys | [#57](https://github.com/jeffilola/noa/pull/57), `origin/feature/m10-integration-admin-stub` |
| M11: CI quality split | Merged on `main`; CI exposes separate `lint` and `build` jobs | [#57](https://github.com/jeffilola/noa/pull/57), `origin/feature/m11-ci-quality-split` |

Open roadmap issues are M12-M16: [#73](https://github.com/jeffilola/noa/issues/73)-[#77](https://github.com/jeffilola/noa/issues/77). M7-M11 issues and milestones were previously closed after PR #57.

## Automated test results

Current `main` / status PR branch:

- `pnpm install --frozen-lockfile` - passed.
- `pnpm qa:prepare` - blocked: Docker is not running in this VM.
- `pnpm --filter @noa/api test` - passed: 12 tests, 2 pass, 10 DB-backed skips because Postgres is unavailable.
- `pnpm --filter @noa/web build` - passed.

Active M7 follow-up PR #99 worktree:

- `pnpm install --frozen-lockfile` - passed.
- `pnpm qa:prepare` - blocked: Docker is not running in this VM.
- `pnpm --filter @noa/api test` - passed: 13 tests, 2 pass, 11 DB-backed skips because Postgres is unavailable. The signed-in holder compliance-records test is present and skipped only for missing Postgres.
- `pnpm --filter @noa/web build` - passed and includes `/user/compliance`.

`manageCheckRun` was not available in the automation tool catalog for this run.

## Prioritized manual E2E for morning review

Use local Docker/Postgres, then run:

```powershell
docker compose up -d postgres
pnpm qa:prepare
pnpm qa:dev
```

Sign in as the Clerk user configured by `DEMO_CLERK_USER_ID`.

1. Organization admin M7 access panel
   - Switch to Organization Admin.
   - Open Users, then click Access view on the demo member row.
   - Confirm the access decision panel shows a seeded training record such as Site safety orientation.
   - Confirm the panel shows Electrical safety certification with an expiry around 2027.
   - Confirm identity, credential, and last site access details are still populated.
   - Toggle dark mode and confirm the panel remains readable.
2. Holder M7 compliance page on PR #99
   - Switch to Identity Holder.
   - Open Training & certs or `/user/compliance`.
   - Confirm the table lists the same training and certification rows.
   - Click Refresh list and confirm the table reloads without an error.
3. M8 wallet preview
   - Open `/user/wallet`.
   - Confirm Apple Wallet and Google Wallet placeholders render as preview-only stubs.
   - Confirm no real wallet issuance, pass download, or provider credential flow is triggered.
4. M9 platform organization list
   - Open `/platform/organizations`.
   - Search by seeded organization name.
   - Confirm pagination/counts and org rows render consistently.
5. M10 integration admin stub
   - Open `/integrations-admin/providers`.
   - Submit test-mode provider validation with a safe HTTPS test URL.
   - Confirm non-HTTPS URLs are rejected and no live provider keys are stored.
6. M11 CI split
   - Confirm open PRs show separate `lint` and `build` checks.
   - Treat both checks as required before human merge.

## Notes

- Do not merge PRs during overnight automation; human review/merge remains the next step.
- Do not close or recreate M7-M11 issues/milestones from this automation. GitHub write access for issues/milestones is not available here, and the milestone state already reflects the prior merged work.
