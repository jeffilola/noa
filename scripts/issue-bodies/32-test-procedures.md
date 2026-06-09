**User story:** As an Identity Holder (and demo viewer), I want to see whether each credential came from PACS or Noa, so that the PACS-led v1 story is obvious in the UI.

**Acceptance criteria:**
- [ ] Holder credential cards on `/user/credentials` show a clear **PACS** vs **NOA** badge (not raw enum strings)
- [ ] Badge styling matches existing design tokens (`badge-pacs` / `badge-noa` or equivalent)
- [ ] Seed/demo credentials display correct source labels
- [ ] Webhook-ingested credentials show **PACS** after ingest demo
- [ ] Noa-issued types (e.g. gym pass from seed) show **NOA**

**Size:** S

**Notes:** Partial implementation exists in `credentials-grid.tsx` and admin `IssuanceSourceBadge` — unify/reuse for holder-facing UI.

## Test procedures

1. Sign in and open **http://localhost:3000/user/credentials**.
2. Find a **gym** or other Noa-seeded credential — label should say **NOA** (not raw enum text).
3. Run `node scripts/post-hid-webhook.mjs issued` if needed, refresh the page — mock HQ badge should show **PACS**.
4. Confirm badges are styled consistently (colors match the rest of the app, readable on mobile width).
5. Check you do **not** see internal values like `PACS`/`identity_holder` as plain unstyled text.
