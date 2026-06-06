# Definition of Done

An issue is **Done** when all of the following are true.

## Code

- [ ] Changes are merged to `main` via pull request (no direct pushes except hotfixes agreed in advance).
- [ ] Branch is up to date with `main` before merge.
- [ ] Scope matches the issue — no unrelated drive-by changes.

## Quality

- [ ] CI passes (`CI` workflow: install, migrate, build, test).
- [ ] New behavior has tests when the change affects business logic, API contracts, or RBAC (not required for pure UI copy or docs-only).
- [ ] No secrets committed (`.env`, API keys, Clerk secrets, database passwords).

## Documentation

- [ ] User-visible or operator-visible behavior is noted in the PR description.
- [ ] New env vars are listed in the relevant `.env.example` and [environment-checklist.md](./environment-checklist.md).
- [ ] RBAC or integration boundary changes update [rbac.md](./rbac.md) or the relevant integration doc.

## Manual verification

- [ ] Author ran a smoke test for the affected area (see checklist below).
- [ ] PR **Test plan** section is filled in.

### Smoke paths (pick what applies)

| Area | Minimum check |
|------|----------------|
| Web / Holder | Sign in → `/user` loads without 500 |
| API | `GET /api/v1/health` returns OK with Postgres up |
| RBAC | Wrong role gets 403 or hidden nav |
| Database | Migration applies cleanly on fresh DB (`migrate:deploy`) |

## Product

- [ ] Acceptance criteria on the linked issue are met.
- [ ] Empty/error states handled when API or Clerk is unavailable (for user-facing work).

## After merge

- [ ] Issue moved to **Done** on the project board.
- [ ] Follow-up issues filed for known gaps (do not expand scope in the same PR).
