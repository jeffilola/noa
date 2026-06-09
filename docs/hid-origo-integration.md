# HID Origo Integration

Noa v1 uses HID Origo **Events API** for PACS-led ingest only — no outbound issue for `corporate_access`.

## APIs

| API | Base URL | v1 usage |
|-----|----------|----------|
| Mobile Identities (MA) | `ma.api.assaabloy.com` | v2 mobile app credentials |
| Credential Management (CM) | Apple/Google Wallet issuance | v2 wallet passes |
| Events | CloudEvents webhook | **v1 ingest** |

## Webhook ingest

`POST /api/v1/webhooks/hid-origo` accepts a single CloudEvent or a batch array.

| Event type | Effect |
|------------|--------|
| `com.hidglobal.origo.credentials.issued` | Upsert `Credential` with `issuanceSource: PACS` |
| `com.hidglobal.origo.credentials.revoked` | Set status `revoked` |
| `com.hidglobal.origo.credentials.suspended` | Set status `suspended` |

**Dedupe key:** `(organizationId, externalCredentialId)` where `externalCredentialId` maps from `data.origoCredentialId`.

**Required `data` fields:** `organizationId`, `origoCredentialId`. Optional: `userId` (Noa user UUID for assignment), `cardNumber`, `pacsCardholderId`, `credentialType`, `label`, `validFrom`, `validUntil`.

## Local mock ingest (no live HID account)

Use this to prove PACS-led ingest on a dev machine. Requires Postgres, seed data, and the API running.

### Prerequisites

```powershell
cd C:\Users\jeffe\Projects\noa
docker compose up -d postgres
pnpm db:generate
pnpm --filter @noa/database migrate:deploy
pnpm db:seed
pnpm --filter @noa/api dev
```

Demo org slug: `demo-org`. Holder user comes from `DEMO_CLERK_USER_ID` in `packages/database/.env` (or `user_demo_holder` fallback).

### Sample payloads (checked into repo)

| Fixture | Path |
|---------|------|
| ISSUED | [docs/fixtures/hid-origo/credential-issued.mock.json](./fixtures/hid-origo/credential-issued.mock.json) |
| REVOKED | [docs/fixtures/hid-origo/credential-revoked.mock.json](./fixtures/hid-origo/credential-revoked.mock.json) |

Fixtures use placeholders `__DEMO_ORG_ID__` and `__DEMO_USER_ID__` — replace with your seeded UUIDs or use the helper script below.

**ISSUED shape:**

```json
{
  "specversion": "1.0",
  "type": "com.hidglobal.origo.credentials.issued",
  "source": "https://origo.example/hid/mock",
  "id": "mock-evt-issued-001",
  "time": "2026-06-09T12:00:00.000Z",
  "data": {
    "organizationId": "<demo-org-uuid>",
    "origoCredentialId": "mock-origo-webhook-001",
    "cardNumber": "MOCK-9001",
    "userId": "<holder-user-uuid>",
    "credentialType": "corporate_access",
    "label": "Mock HQ Badge (webhook ingest)"
  }
}
```

**REVOKED shape** (same `origoCredentialId`; run after ISSUED):

```json
{
  "specversion": "1.0",
  "type": "com.hidglobal.origo.credentials.revoked",
  "source": "https://origo.example/hid/mock",
  "id": "mock-evt-revoked-001",
  "data": {
    "organizationId": "<demo-org-uuid>",
    "origoCredentialId": "mock-origo-webhook-001"
  }
}
```

### Helper script (recommended)

Resolves demo org + holder IDs from Postgres and posts the fixture. By default the holder is your **most recent demo-org sign-in** (not necessarily `DEMO_CLERK_USER_ID`). Override with `--as=user_xxx` if needed.

```powershell
# Issue mock badge to demo holder
node scripts/post-hid-webhook.mjs issued

# Target a specific Clerk user
node scripts/post-hid-webhook.mjs issued --as=user_3EdNaRfqgoQM6xnpo4Z4McerU4Z

# Re-post same event — should update in place, not duplicate
node scripts/post-hid-webhook.mjs issued

# Revoke the mock badge
node scripts/post-hid-webhook.mjs revoked
```

Expected ISSUED response:

```json
{
  "processed": 1,
  "skipped": 0,
  "credentials": [
    {
      "id": "<uuid>",
      "externalCredentialId": "mock-origo-webhook-001",
      "action": "issued"
    }
  ]
}
```

Verify in Postgres:

```sql
SELECT id, "externalCredentialId", "issuanceSource", status, "cardNumber"
FROM "Credential"
WHERE "externalCredentialId" = 'mock-origo-webhook-001';
```

### Manual curl / PowerShell

Replace `<demo-org-uuid>` and `<holder-user-uuid>` with values from seed (query `Organization` where `slug = 'demo-org'` and `User` for your holder).

**curl:**

```bash
curl -s -X POST http://localhost:3001/api/v1/webhooks/hid-origo \
  -H "Content-Type: application/json" \
  -d @docs/fixtures/hid-origo/credential-issued.mock.json
```

**PowerShell** (after replacing placeholders in the JSON file or building inline):

```powershell
$body = Get-Content docs/fixtures/hid-origo/credential-issued.mock.json -Raw
Invoke-RestMethod -Method Post `
  -Uri http://localhost:3001/api/v1/webhooks/hid-origo `
  -ContentType 'application/json' `
  -Body $body
```

### Idempotency check

Posting the same `origoCredentialId` twice for the same organization updates the existing row — credential count stays at 1. Integration tests cover this in `apps/api/test/pacs-led.integration.test.ts`.

## Production blockers (v1 local vs prod)

| Gap | v1 local mock | Production need |
|-----|---------------|-----------------|
| **Webhook auth** | Endpoint is unauthenticated | Verify HID signature / shared secret or mTLS |
| **Tenant mapping** | `organizationId` supplied in payload | Map HID Origo tenant → Noa org (do not trust client-supplied org id) |
| **Replay protection** | Dedupe by `(org, externalCredentialId)` only | Event id / timestamp replay window, idempotency store |
| **Ingress** | Direct POST to API | Public URL, rate limits, WAF |
| **Payload trust** | Any JSON accepted | Schema validation, allowlisted event types |
| **User assignment** | Optional `userId` in payload | Reliable cardholder → Noa user mapping (employee id, email hash, etc.) |

## Adapter (`HidOrigoAdapter`)

| Method | v1 | v2 |
|--------|----|----|
| `issue()` | Throws for `corporate_access` | MA/CM HTTP |
| `testConnection()` | Stub OK | Live ping |
| Ingest mappers | **Active** | Same |

## Lenel Elements flow

Elements issues → HID provisions → card number returns to Elements → controllers updated. Noa mirrors via webhook only.

See [issuance-modes.md](./issuance-modes.md).

## Test procedures

Run these after the spike is merged (or on branch `spike/issue-30-hid-webhook-mock`).

1. **Start the basics** — Postgres running, then `pnpm db:seed`, then start the API (`pnpm --filter @noa/api dev`).
2. **Send a fake “new badge” message** — from the repo root:
   ```powershell
   node scripts/post-hid-webhook.mjs issued
   ```
   You should see `"processed": 1` and a credential id in the response.
3. **Send the same message again** — run the same command a second time. You should still get **one** badge (same id), not two.
4. **Send a fake “badge removed” message**:
   ```powershell
   node scripts/post-hid-webhook.mjs revoked
   ```
   Response should show `"action": "revoked"`.
5. **Optional check in the database** — credential `mock-origo-webhook-001` should exist with `issuanceSource` PACS, then status revoked after step 4.

If step 2 fails with “Demo org missing”, run `pnpm db:seed` again.

For holder UI, badges, and org integrations tests (issues #31–#33), see [m3-local-testing.md](./m3-local-testing.md).
