**User story:** As an Identity Holder, I want a clear, reliable data export experience, so that I can download my Noa data for GDPR portability without confusion.

**Acceptance criteria:**
- [ ] `/user/security` embeds export controls (no placeholder-only page; privacy actions reachable in one place)
- [ ] Export shows loading state, then success feedback with filename and a short summary (e.g. credential count, device count)
- [ ] Downloaded JSON includes `exportedAt` and expected sections (`profile`, `memberships`, `assignments`, `devices`, `walletPasses`)
- [ ] API/offline/auth errors show actionable messages (not a silent failure)
- [ ] Export action remains audited (`data_export` in audit log)
- [ ] `/user/privacy` redirects to `/user/security` (or is removed) to avoid duplicate entry points

**Size:** M

**Notes:** API `GET /gdpr/export` exists. `PrivacyActions` has a basic download — polish UX and consolidate pages.

## Test procedures

1. Start Postgres, API, and web. Sign in as demo holder.
2. Open **http://localhost:3000/user/security** — export section visible (not placeholder text only).
3. Click **Download my data** — browser saves `noa-export-YYYY-MM-DD.json`.
4. Open the JSON — confirm `profile`, `memberships`, `assignments`, `devices`, `exportedAt` present.
5. Success message on page mentions download completed.
6. Stop API, click export again — friendly error, page does not crash.
7. Optional: check audit log for `data_export` action.
