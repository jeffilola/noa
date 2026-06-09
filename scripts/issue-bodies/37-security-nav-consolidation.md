**User story:** As an Identity Holder, I want one Security & Privacy page in the nav, so that I am not sent to a stub page and a separate privacy URL.

**Acceptance criteria:**
- [ ] `/user/security` is the single holder privacy hub (export + deletion)
- [ ] `/user/privacy` redirects to `/user/security` (301 or Next redirect)
- [ ] User sidebar/nav links only reference Security (no duplicate Privacy link if one existed)
- [ ] Page header and copy match GDPR tone (export + erasure, audited actions)

**Size:** S

**Depends on:** #35 (export UX on security page)

## Test procedures

1. Open **http://localhost:3000/user/privacy** — redirects to `/user/security`.
2. Sidebar **Security** link opens the combined page with export and delete sections.
3. No placeholder-only content on `/user/security`.
