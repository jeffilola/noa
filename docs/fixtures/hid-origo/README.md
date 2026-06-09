# HID Origo mock CloudEvents

Sample payloads for local PACS-led ingest. Placeholders `__DEMO_ORG_ID__` and `__DEMO_USER_ID__` are replaced by `scripts/post-hid-webhook.mjs` at runtime.

| File | Event type | Purpose |
|------|------------|---------|
| `credential-issued.mock.json` | `com.hidglobal.origo.credentials.issued` | Create/update a PACS credential on the demo holder |
| `credential-revoked.mock.json` | `com.hidglobal.origo.credentials.revoked` | Revoke the same credential (run after issued) |

External credential id in these fixtures: `mock-origo-webhook-001`.
