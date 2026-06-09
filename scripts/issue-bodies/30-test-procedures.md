**Question to answer:** Can we demonstrate PACS-led ingest locally by posting mock HID Origo CloudEvents to the existing webhook without live Origo credentials?

**Success criteria:**
- [ ] Document mock payload shape and curl/PowerShell examples in `docs/hid-origo-integration.md` (or a short spike note linked from there)
- [ ] Sample CloudEvents for `com.hidglobal.origo.credentials.issued` and `com.hidglobal.origo.credentials.revoked` checked into repo or documented inline
- [ ] POST to `POST /api/v1/webhooks/hid-origo` creates/updates a `Credential` with `issuanceSource: PACS` for demo org + holder
- [ ] Idempotent re-post of the same event does not duplicate credentials
- [ ] Blockers for production ingest (auth, signing, org mapping) listed in the doc

**Time box:** 1 day

**Expected output:** Operator-ready doc + verified local curl against running API + Postgres

**Size:** M

**Notes:** Endpoint and ingest service exist; no outbound HID API calls required for v1.

## Test procedures

1. Start Postgres, run `pnpm db:seed`, and start the API (`pnpm --filter @noa/api dev`).
2. Run `node scripts/post-hid-webhook.mjs issued` — expect `"processed": 1` in the response.
3. Run the same command again — expect the **same** credential id (no duplicate badge).
4. Run `node scripts/post-hid-webhook.mjs revoked` — expect `"action": "revoked"`.
5. Open `docs/hid-origo-integration.md` — confirm examples, fixtures path, and production blockers are documented.

Full steps also in `docs/hid-origo-integration.md` → **Test procedures**. For all M3 issues (#30–#33), see [m3-local-testing.md](./m3-local-testing.md).
