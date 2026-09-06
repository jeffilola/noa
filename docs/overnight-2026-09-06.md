# Overnight sprint summary: 2026-09-06

## Branch and PR status

- Automation branch: `cursor/noa-milestone-preparation-fcc2`
- M7-M11 baseline: already merged to `main` in [PR #57](https://github.com/jeffilola/noa/pull/57).
- Active M7 follow-up: [PR #99](https://github.com/jeffilola/noa/pull/99) (`M7 closeout: restore holder compliance records page`) is open/draft, clean to merge, and has green visible `lint` and `build` checks.
- Requested focused branches for M7-M11 exist on origin, but the corresponding work is already in `main`; no duplicate milestone PRs were opened.
- GitHub issue/milestone creation or closure was not performed because this automation has read-only `gh` access for issues/milestones.
- `manageCheckRun` was not available in the configured automation toolset.
- Status PR URL: to be added after this docs PR is opened.

## Milestone status

| Milestone | Status | Review URL |
|-----------|--------|------------|
| M7: Learning records | Merged in PR #57; holder compliance follow-up remains in review | [PR #57](https://github.com/jeffilola/noa/pull/57), [PR #99](https://github.com/jeffilola/noa/pull/99) |
| M8: Wallet pass preview | Merged; testing guide present | [PR #57](https://github.com/jeffilola/noa/pull/57) |
| M9: Platform admin org list | Merged; testing guide present | [PR #57](https://github.com/jeffilola/noa/pull/57) |
| M10: Integration admin stub | Merged; testing guide present | [PR #57](https://github.com/jeffilola/noa/pull/57) |
| M11: CI quality split | Merged; `lint` and `build` checks split | [PR #57](https://github.com/jeffilola/noa/pull/57) |

## Automated test commands

Current `main` branch:

```bash
pnpm install --frozen-lockfile        # pass
pnpm qa:prepare                      # blocked: Docker is not running in this cloud VM
pnpm --filter @noa/api test          # pass; 12 tests, 10 DB-backed skips because Postgres unavailable
pnpm --filter @noa/web build         # pass
```

Active M7 follow-up PR #99 validated in `/tmp/noa-pr99`:

```bash
pnpm install --frozen-lockfile        # pass
pnpm qa:prepare                      # blocked: Docker is not running in this cloud VM
pnpm --filter @noa/api test          # pass; 13 tests, 11 DB-backed skips because Postgres unavailable
pnpm --filter @noa/web build         # pass; build includes /user/compliance
```

## M7 manual E2E checklist for morning review

From [m7-testing.md](./m7-testing.md), run locally with Docker/Postgres:

1. `docker compose up -d postgres`
2. `pnpm qa:prepare`
3. `pnpm qa:dev`
4. Sign in as the Clerk user configured by `DEMO_CLERK_USER_ID`.
5. Switch to **Organization Admin**.
6. Open **Users** -> **Access view** for the demo member.
7. Confirm the access decision panel shows:
   - [ ] Site safety orientation, or similar training title, with a date.
   - [ ] Electrical safety certification with an expiry around 2027.
   - [ ] Identity, credential, and last site access data still populated.
8. Toggle dark mode and confirm the panel remains readable.
9. Switch to **Identity Holder**.
10. Open **Training & certs** or `/user/compliance` from PR #99.
11. Confirm the holder table shows the same seeded training and certification rows.
12. Click **Refresh list** and confirm the table reloads without error.

## Prioritized manual E2E for all milestone slices

1. M7: Complete the checklist above on PR #99 with local Docker/Postgres.
2. M8: Open `/user`, click **Wallet preview**, and confirm `/user/wallet` shows Apple Wallet and Google Wallet preview-only cards with no real issuance language.
3. M9: Switch to **Platform Administrator**, open `/platform/organizations`, search for `demo`, search for `zzzznotfound`, and verify filter/sort controls plus the offline API banner.
4. M10: Switch to **Integration Admin**, open `/integrations-admin/providers`, validate `https://api.origo.test`, then validate an `http://` URL and confirm the expected error.
5. M11: Inspect any current PR checks and confirm `lint` and `build` are separate jobs.

## Test guides

- [M7 testing](./m7-testing.md)
- [M8 testing](./m8-testing.md)
- [M9 testing](./m9-testing.md)
- [M10 testing](./m10-testing.md)
- [M11 testing](./m11-testing.md)
