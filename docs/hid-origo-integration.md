# HID Origo Integration

Noa v1 uses HID Origo **Events API** for PACS-led ingest only — no outbound issue for `corporate_access`.

## APIs

| API | Base URL | v1 usage |
|-----|----------|----------|
| Mobile Identities (MA) | `ma.api.assaabloy.com` | v2 mobile app credentials |
| Credential Management (CM) | Apple/Google Wallet issuance | v2 wallet passes |
| Events | CloudEvents webhook | **v1 ingest** |

## Webhook ingest

`POST /api/v1/webhooks/hid-origo` accepts CloudEvents batch:

- `com.hidglobal.origo.credentials.issued` → upsert `Credential`, `issuanceSource: PACS`
- `com.hidglobal.origo.credentials.revoked` → status `revoked`
- Suspended events → status `suspended`

Dedupe key: `(organizationId, externalCredentialId)`.

## Adapter (`HidOrigoAdapter`)

| Method | v1 | v2 |
|--------|----|----|
| `issue()` | Throws for `corporate_access` | MA/CM HTTP |
| `testConnection()` | Stub OK | Live ping |
| Ingest mappers | **Active** | Same |

## Lenel Elements flow

Elements issues → HID provisions → card number returns to Elements → controllers updated. Noa mirrors via webhook only.

See [issuance-modes.md](./issuance-modes.md).
