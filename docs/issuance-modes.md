# Issuance modes

Noa supports two organization-level issuance policies configured in `Organization.settings.issuancePolicy`.

## pacs_led (v1 default)

For organizations with physical access control systems (PACS):

- **Corporate access** credentials are **issued in PACS** (e.g. Lenel Elements → HID Origo).
- Noa **ingests** credential lifecycle events via `POST /webhooks/hid-origo` (HID CloudEvents).
- Credentials are stored with `issuanceSource: PACS`.
- `POST /credentials/issue` for `corporate_access` returns **409** with `{ message, issueInPacs: true }`.
- Admin UI hides/disables Issue for corporate access; shows **source: PACS** badge.

## noa_led (v2)

For organizations without PACS or for non-corporate credential types:

- Noa admin can issue credentials directly via provider adapters (HID, Brivo, etc.).
- Outbound HID Origo **issue** API calls for allowed types (`hotel_key`, `gym_membership`, `event_pass`, etc.).
- Optional Lenel write-back for pilot corporate Noa-led deployments.

**v1 scope:** Noa-led outbound HID issue for `corporate_access` is **not implemented**. See v2 roadmap.

## Deferred phases

| Phase | Scope |
|-------|--------|
| **v1.1** | Lenel Elements **read** API — enrich `pacsCardholderId` / cardholder metadata (`LenelS2Adapter.readCardholder`) |
| **v2** | Noa-led issuance for non-PACS types; optional HID/Brivo outbound issue + Lenel write-back |
