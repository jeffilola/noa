**User story:** As an Org Admin, I want integration connection status backed by real data, so that I can see whether HID Origo ingest is configured for my organization.

**Acceptance criteria:**
- [ ] `OrganizationProviderConnection` status (or equivalent) exposed via scoped org integrations API
- [ ] `/org` integrations UI (or org overview integration panel) reads status from API — no hard-coded placeholders
- [ ] Demo org shows HID Origo connection as **active** when seed data includes a connection row
- [ ] Missing/disabled connection shows an actionable empty state
- [ ] RBAC: only org admins with integration visibility can read connection status

**Size:** L

**Notes:** v1 can remain read-only; "Test connection" live ping is out of scope unless trivial with existing stub adapter.

## Test procedures

1. Sign in as org admin, open **http://localhost:3000/org** (and integrations page if separate).
2. For **Demo Organization**, HID Origo should show **active** (or equivalent connected state) — not a hard-coded “coming soon” placeholder.
3. Sign in as a user **without** org admin — integrations status should not be visible or should redirect.
4. Stop the API, reload the org integrations area — expect a clear offline/unavailable message.
5. Optional: after `pnpm db:seed`, confirm status matches a row in `OrganizationProviderConnection` for demo-org + HID provider.
