# M7 testing: Learning records for access decisions

## Automated checks

Run from the repo root:

```bash
pnpm qa:prepare
pnpm --filter @noa/api test
pnpm --filter @noa/web build
```

## Manual E2E checklist

- [ ] Sign in with the Clerk user configured as `DEMO_CLERK_USER_ID`.
- [ ] Open `/org/access` and confirm recent site access events are visible.
- [ ] Open `/org/users`, choose the demo member, and open the member access view.
- [ ] Confirm the access decision panel shows:
  - [ ] Identity verified from the signed-in user record.
  - [ ] Workforce status from the active organization membership.
  - [ ] Training & compliance from the seeded `Site safety orientation` record.
  - [ ] Credential from the active PACS/Noa credential assignment.
  - [ ] Last site access from access events.
  - [ ] Certification from the seeded `Electrical safety certification` record.
- [ ] Re-run `pnpm qa:prepare`, refresh the member page, and confirm records remain stable and are not duplicated.
- [ ] Temporarily stop the API, refresh the member page, and confirm the API offline banner appears.

## Expected result

Training and certification are no longer hard-coded panel stubs. They are read through the API from seeded compliance records created by the dev bootstrap.
