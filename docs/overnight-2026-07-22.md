# Overnight sprint summary: 2026-07-22

## Branch and PR status

- Automation branch: `cursor/noa-milestone-preparation-5a25`
- Base branch: `main` at `cae785f`
- M7-M11 implementation PR: [#57](https://github.com/jeffilola/noa/pull/57) — merged; GitHub checks `lint` and `build` passed.
- Active M7 follow-up PR: [#99](https://github.com/jeffilola/noa/pull/99) — open draft, mergeable, GitHub checks `lint` and `build` passed.
- Current overnight status PR: pending until this document is committed and opened.
- Requested stale branch `feature/m7-learning-records`: exists on origin, but is behind `main` and omits the already-merged M8-M11 slices; it should not be opened as a new review PR without rebasing/replacing it.
- GitHub issue/milestone creation or closure: not performed by this run because the available GitHub CLI is read-only and no issue/milestone write tool is configured.

## Milestone status

| Milestone | Status | Review artifact |
|-----------|--------|-----------------|
| M7: Learning records | Merged in #57; holder compliance follow-up open in #99 | [M7 testing](./m7-testing.md), [demo note](./demos/2026-06-11-m7.md) |
| M8: Wallet pass preview | Merged in #57 | [M8 testing](./m8-testing.md) |
| M9: Platform org list | Merged in #57 | [M9 testing](./m9-testing.md) |
| M10: Integration admin stub | Merged in #57 | [M10 testing](./m10-testing.md) |
| M11: CI quality split | Merged in #57 | [M11 testing](./m11-testing.md) |

## What shipped previously

- M7: persisted compliance records, seeded demo training/certification records, org access decision panel backed by real records.
- M8: `/user/wallet` Apple and Google Wallet preview placeholders with explicit "preview only" language and no issuance.
- M9: `/platform/organizations` searchable and filterable platform admin organization list backed by `GET /organizations`.
- M10: `/integrations-admin/providers` test-mode provider validation form with HTTPS-only placeholder validation and no live provider keys.
- M11: GitHub Actions split into separate `lint` and `build` jobs.

## Automated test commands

Results will be updated after the committed docs pass is pushed and the local validation commands complete.

```bash
pnpm qa:prepare
pnpm --filter @noa/api test
pnpm --filter @noa/web build
```

## Prioritized manual E2E for morning review

1. M7 org admin: run `pnpm qa:prepare`, sign in as `DEMO_CLERK_USER_ID`, open Organization Admin -> Users -> Access view, and confirm "Site safety orientation" plus "Electrical safety certification" appear in the access decision panel.
2. M7 holder follow-up (#99): switch to Identity Holder, open Training & certs or `/user/compliance`, confirm the seeded training/cert rows match the org access panel, click Refresh list, and toggle dark mode.
3. M8: open `/user/wallet`, confirm Apple Wallet and Google Wallet cards both show "Preview only" and explain no real pass is issued.
4. M9: open `/platform/organizations`, search `demo`, try the empty search `zzzznotfound`, and apply "Has members" plus "Recently updated" filters.
5. M10: open `/integrations-admin/providers`, validate `https://api.origo.test`, then validate an `http://` URL and confirm the expected error.
6. M11: inspect PR checks and confirm separate `lint` and `build` jobs.

