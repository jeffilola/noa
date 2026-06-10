# M9 testing: Platform admin organization list

## Automated checks

Run from the repo root:

```bash
pnpm --filter @noa/api test
pnpm --filter @noa/web build
```

## Manual E2E checklist

- [ ] Sign in with a platform admin demo user.
- [ ] Open `/platform/organizations`.
- [ ] Confirm seeded organizations appear with member, credential, and provider connection counts.
- [ ] Search by organization name.
- [ ] Search by organization slug.
- [ ] Search for a value that does not match and confirm the empty state appears.
- [ ] Stop the API, refresh the page, and confirm the API offline banner appears.

## API checks

- [ ] `GET /api/v1/organizations` returns organizations for a platform admin.
- [ ] `GET /api/v1/organizations?search=demo` filters by name, slug, or Clerk org id.
- [ ] Non-platform users are rejected by the existing permission guard.
