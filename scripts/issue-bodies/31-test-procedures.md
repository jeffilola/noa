**User story:** As an Identity Holder, I want a newly ingested PACS credential to appear on my dashboard, so that I can see access synced from HID without manual refresh hacks.

**Acceptance criteria:**
- [ ] After a successful `POST /webhooks/hid-origo` ISSUED event for the signed-in holder, the credential appears on `/user/credentials`
- [ ] Credential is assigned to the correct user via existing ingest + assignment logic
- [ ] Holder overview count on `/user` reflects the new credential when API is online
- [ ] REVOKED/suspended webhook events update status in the holder UI
- [ ] Empty/error states unchanged when API is offline
- [ ] Smoke test documented in PR test plan (webhook POST → refresh `/user/credentials`)

**Size:** M

**Depends on:** Mock webhook ingest spike (#30)

**Notes:** Vertical slice — ingest already writes DB; this issue is end-to-end visibility for the holder dashboard.

## Test procedures

1. Start Postgres, API, and web. Sign in as your demo user (`DEMO_CLERK_USER_ID`).
2. Run `node scripts/post-hid-webhook.mjs issued` (or use an existing mock badge).
3. Open **http://localhost:3000/user/credentials** — you should see the new badge (e.g. “Mock HQ Badge”).
4. Open **http://localhost:3000/user** — credential count should include the new badge when the API is online.
5. Run `node scripts/post-hid-webhook.mjs revoked`, refresh `/user/credentials` — badge should show as revoked (or disappear from active list, per UI design).
6. Stop the API, reload `/user/credentials` — you should still see a friendly offline message, not a broken page.
