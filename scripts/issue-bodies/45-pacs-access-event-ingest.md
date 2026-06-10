**User story:** As an integration admin, I want mock PACS door events ingested via webhook, so that we can demo access history without a live HID/Brivo account.

**Acceptance criteria:**
- [ ] `POST /api/v1/webhooks/pacs/access-events` accepts a normalized payload (single event or batch)
- [ ] Maps to `AccessEvent` upsert using `(organizationId, externalEventId)` dedupe
- [ ] Resolves user via Noa `userId` or credential assignment when only `credentialId` / card number provided
- [ ] Returns 400 on missing required fields; 404 when org/user/credential cannot be resolved
- [ ] `scripts/post-access-event.mjs` posts a sample event against local API (documented in script header)
- [ ] Integration test covers happy path + dedupe

**Size:** M

**Epic:** `epic:integrations` · **Areas:** `area:api`, `area:integrations`

**Depends on:** #44

## Test procedures

1. Seed DB and start API (`pnpm dev:api` or QA stack).
2. Run `node scripts/post-access-event.mjs --user demo-holder --location "Main entrance"`.
3. Confirm new row in `AccessEvent` (or via upcoming API #46).
4. Run the same command twice with same external id — expect single row (deduped).
5. Run `pnpm test` — access ingest integration test passes.
