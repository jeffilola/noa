# M10 testing: Integration admin provider test-mode stub

## Automated checks

Run from the repo root:

```bash
pnpm --filter @noa/api test
pnpm --filter @noa/web build
```

## Manual E2E checklist

- [ ] Sign in with a user that has integration admin access.
- [ ] Open `/integrations-admin/providers`.
- [ ] Confirm the provider connection form renders for the demo organization.
- [ ] Submit the default HID Origo test URL and confirm validation succeeds.
- [ ] Change the URL to an `http://` value and confirm validation fails.
- [ ] Confirm the screen warns not to enter live API keys, client secrets, or production provider URLs.
- [ ] Confirm no provider credentials are requested or stored.

## API checks

- [ ] `POST /api/v1/organizations/:orgId/integrations/validate-test-mode` accepts `providerId`, `apiBaseUrl`, and `mode`.
- [ ] HTTPS URLs return a success message.
- [ ] Missing provider ids or non-HTTPS URLs return `400`.
