# Brivo Access API Integration

Noa connects to [Brivo Access API](https://apidocs.brivo.com/access/) for mobile credentials and wallet passes in **Noa-led** flows (v2). v1 PACS-led corporate access does not use outbound Brivo issue.

## Dual track adapter (`BrivoAdapter`)

| Track | Brivo API | Use case |
|-------|-----------|----------|
| Mobile pass | Digital invitations API | Brivo mobile app credentials |
| Wallet pass | `POST /users/credentials/brivo-wallet-pass` | Apple/Google Wallet via Brivo |

## Authentication

- OAuth 2.0 client credentials at `https://auth.brivo.com/oauth/token`
- Header: `api-key` + `Authorization: Bearer {access_token}`
- Token TTL: 300 seconds — cache in `OrganizationProviderConnection` metadata (v2)

## Event subscriptions

Register webhooks for credential lifecycle (issued, revoked) similar to HID Origo Events. Map to `PacsIngestService`-style upsert when org uses Brivo as source of truth.

## v1 scope

- `BrivoAdapter.testConnection()` — stub success
- `BrivoAdapter.issue()` — stub for non-`corporate_access` types only
- Live HTTP — **v2**

## Organization connection

Admin registers via `POST /organizations/:id/integrations`:

```json
{
  "providerId": "brivo",
  "apiBaseUrl": "https://api.brivo.com/v1/api",
  "credentials": {
    "clientId": "...",
    "clientSecret": "...",
    "apiKey": "..."
  }
}
```

Secrets encrypted with `EncryptionService` into `credentialsEnc` / `credentialsIv`.
