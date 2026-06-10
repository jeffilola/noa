**User story:** As org admin or security admin, I want read APIs for access events scoped to my organization, so that dashboards can show last access and history safely.

**Acceptance criteria:**
- [ ] `GET /organizations/:orgId/access-events` — paginated list, newest first; filter by `userId` optional
- [ ] `GET /organizations/:orgId/users/:userId/access-summary` — returns `lastAccess` (occurredAt, locationLabel, readerLabel) + `recentCount`
- [ ] `GET /users/me/access-events` — holder sees own events across orgs they belong to
- [ ] RBAC: org routes require org membership + `users:view:org` or org-admin equivalent; holder route uses identity permissions only
- [ ] No PII beyond location/reader labels already in event record
- [ ] API tests for scoping (cannot read another org’s events)

**Size:** M

**Epic:** `epic:org` · **Areas:** `area:api`, `area:domain`

**Depends on:** #44

## Test procedures

1. Seed DB; sign in as demo org admin — `GET` org events returns seeded rows.
2. Sign in as demo holder — `GET /users/me/access-events` returns only own events.
3. Sign in as demo holder — attempt org admin route for demo org — expect 403.
4. Call user access-summary for demo holder — `lastAccess.locationLabel` matches seed (“Main entrance”).
5. `pnpm test` — new access API tests pass.
