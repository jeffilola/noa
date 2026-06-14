# Overnight M7-M11 sprint report

Run timestamp: 2026-06-14 23:00 UTC

## Summary

The focused milestone branches are pushed and validated for morning review, but this automation could not open the focused PRs because the PR tool is restricted to the designated automation branch `cursor/noa-milestone-preparation-0974`. The only PR this run can open is this docs-only summary PR.

GitHub milestone/issue writes for M8-M11 and aggregate check-run writes were not available in this automation. I did not use `gh` for writes.

Docs summary PR: https://github.com/jeffilola/noa/pull/60

## Review branches

| Milestone | Branch | Review URL | Status |
|---|---|---|---|
| M7: Learning & compliance records | `feature/m7-learning-records` | https://github.com/jeffilola/noa/compare/main...feature/m7-learning-records | Pushed; focused PR creation blocked by automation branch restriction |
| M8: Wallet pass preview | `feature/m8-wallet-pass-preview` | https://github.com/jeffilola/noa/compare/main...feature/m8-wallet-pass-preview | Pushed; focused PR creation blocked by automation branch restriction |
| M9: Platform admin org list | `feature/m9-platform-org-list` | https://github.com/jeffilola/noa/compare/main...feature/m9-platform-org-list | Pushed; focused PR creation blocked by automation branch restriction |
| M10: Integration admin stub | `feature/m10-integration-admin-stub` | https://github.com/jeffilola/noa/compare/main...feature/m10-integration-admin-stub | Pushed; focused PR creation blocked by automation branch restriction |
| M11: CI quality split | `feature/m11-ci-quality-split` | https://github.com/jeffilola/noa/compare/main...feature/m11-ci-quality-split | Pushed; focused PR creation blocked by automation branch restriction |

## Automated validation

| Branch | Command | Result |
|---|---|---|
| `feature/m7-learning-records` | `pnpm qa:prepare` | Failed: Docker is not running in this environment |
| `feature/m7-learning-records` | `pnpm db:generate` | Passed |
| `feature/m7-learning-records` | `pnpm --filter @noa/api test` | Passed; DB-backed integration tests skipped because Postgres was unavailable |
| `feature/m7-learning-records` | `pnpm --filter @noa/web build` | Passed |
| `feature/m8-wallet-pass-preview` | `pnpm --filter @noa/web build` | Passed |
| `feature/m9-platform-org-list` | `pnpm --filter @noa/api test` | Passed; DB-backed integration tests skipped because Postgres was unavailable |
| `feature/m9-platform-org-list` | `pnpm --filter @noa/web build` | Passed |
| `feature/m10-integration-admin-stub` | `pnpm --filter @noa/api test` | Passed; M10 validation unit tests passed and DB-backed existing tests skipped because Postgres was unavailable |
| `feature/m10-integration-admin-stub` | `pnpm --filter @noa/web build` | Passed |
| `feature/m11-ci-quality-split` | `pnpm lint` | Passed |
| `feature/m11-ci-quality-split` | `pnpm build` | Passed |
| `feature/m11-ci-quality-split` | `pnpm test` | Passed; DB-backed API tests skipped because Postgres was unavailable |

Dependencies were installed with `pnpm install --frozen-lockfile` before validation. No secrets were committed, and the untracked nested `noa/` folder was not touched.

## M7 closeout notes

M7 includes:

- Compliance record Prisma schema and migration.
- Demo seeding for training and certification records.
- `ensureComplianceRecordsForUser` and Clerk-user bootstrap helpers for dev/demo access panel data.
- Org and holder compliance read paths.
- Access decision panel updates replacing hard-coded training/certification stubs.
- `docs/m7-testing.md`, demo note, backlog, and sprint-planning updates on the focused branch.

## M7 manual E2E checklist for morning review

| Step | Automation note |
|---|---|
| Sign in with the Clerk user configured as `DEMO_CLERK_USER_ID`. | Not run in headless automation |
| Open `/org/access` and confirm recent site access events are visible. | Not run in headless automation |
| Open `/org/users`, choose the demo member, and open the member access view. | Not run in headless automation |
| Confirm identity verified is shown from the signed-in user record. | Not run in headless automation |
| Confirm workforce status is shown from the active organization membership. | Not run in headless automation |
| Confirm training & compliance is shown from seeded `Site safety orientation`. | Not run in headless automation |
| Confirm credential is shown from the active PACS/Noa credential assignment. | Not run in headless automation |
| Confirm last site access is shown from access events. | Not run in headless automation |
| Confirm certification is shown from seeded `Electrical safety certification`. | Not run in headless automation |
| Re-run `pnpm qa:prepare`, refresh the member page, and confirm records remain stable and are not duplicated. | Blocked here because Docker is not running; run locally with Docker/Postgres |
| Temporarily stop the API, refresh the member page, and confirm the API offline banner appears. | Not run in headless automation |

## Prioritized morning E2E

1. Open PRs manually from the five focused branch compare links above, or use this report to recreate PR descriptions with each branch's `docs/m*-testing.md` checklist.
2. Run `pnpm qa:prepare` locally with Docker/Postgres on `feature/m7-learning-records`, then complete the M7 checklist in `docs/m7-testing.md`.
3. Review M8 at `/user/wallet`: confirm Apple/Google preview cards, `Preview only` labels, no real issuance, and holder empty state.
4. Review M9 at `/platform/organizations`: confirm platform admin access, counts, search by name/slug/Clerk org id, empty state, and offline banner.
5. Review M10 at `/integrations-admin/providers`: confirm test-mode validation succeeds for HTTPS, fails for HTTP, and asks for no live provider secrets.
6. Review M11 CI after opening a PR: confirm separate `lint` and `build` checks and that the `build` job still runs migrations, build, and tests.

