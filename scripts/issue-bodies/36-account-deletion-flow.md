**User story:** As an Identity Holder, I want a deliberate account deletion flow, so that I can exercise my right to erasure without accidental data loss.

**Acceptance criteria:**
- [ ] Deletion uses an in-app confirmation (type `DELETE` or equivalent) — not only `window.confirm`
- [ ] UI explains consequences: active credentials revoked, PII anonymized, holder record disabled
- [ ] Successful deletion shows confirmation, then signs the user out via Clerk and redirects to a safe page
- [ ] Re-signing in after deletion creates a fresh holder profile (or shows disabled state — document chosen behavior)
- [ ] API errors and offline state handled with clear feedback
- [ ] Deletion remains audited (`data_delete_requested`, `data_anonymized`, credential revokes with `gdpr_delete` reason)

**Size:** M

**Notes:** API `DELETE /gdpr/me` exists. Extend web flow; Clerk sign-out after success. Do not delete Clerk account in v1 unless explicitly scoped.

## Test procedures

1. Start Postgres, API, and web. Sign in as a **throwaway** demo Clerk user (not your primary account).
2. Open **http://localhost:3000/user/security** — deletion section visible with consequences explained.
3. Start deletion — confirm UI requires typed confirmation before proceeding.
4. Complete deletion — expect success message, then sign-out and redirect.
5. Sign in again with same Clerk user — expect new/empty holder or documented disabled behavior.
6. Optional DB check: user row has `anonymizedAt` set, credentials revoked.
7. Stop API, attempt deletion — expect error message, no partial UI crash.
