# UI visual QA checklist

Run before closing M5 UX audit issues or shipping staging. Test each route in **light**, **dark**, and **system** theme.

## Quick finish (#42)

**Terminal 1** — prepare DB and start API + web (requires Docker Desktop):

```powershell
pnpm qa:dev
```

**Terminal 2** — after `:3001` responds, run API smoke checks:

```powershell
pnpm qa:smoke
```

**One-time:** set your Clerk user in `packages/database/.env` so holder **and** org admin routes work on one account:

```powershell
# packages/database/.env
DEMO_CLERK_USER_ID=user_yourClerkIdHere
```

Then `pnpm qa:prepare` (or `pnpm qa:dev`) again. Sign in with that Clerk account.

**Browser** — toggle theme in the header, then open:

| Route | What to verify |
|-------|----------------|
| `/user/identity` | Profile, credentials, devices load (not offline) |
| `/user/security` | **Download my data** → success banner + JSON download |
| `/user/security` | **Request deletion** → modal requires typing `DELETE` |
| `/org` | Overview stats (not redirected to `/user`) |
| `/org/integrations` | HID Origo row shows **Active** |
| `/org/credentials` | Table readable; badges visible |
| `/` + `/portal` + `/sign-in` | Theme toggle; no hydration errors in console |

**Mobile:** repeat `/` and `/user` at ~390px width.

---

## Scripts reference

| Command | What it does |
|---------|----------------|
| `pnpm qa:prepare` | Postgres + migrate + seed only |
| `pnpm qa:stop` | Free ports `:3000` / `:3001` (stale dev servers) |
| `pnpm qa:servers` | Start API + web (auto-stops stale listeners) |
| `pnpm qa:dev` | `qa:prepare` then `qa:servers` |
| `pnpm qa:smoke` | Health, credentials, GDPR export, org integrations (API) |
| `node scripts/check-dev-env.mjs` | Clerk keys + demo user audit |

---

## Pass criteria

- No white-on-white or black-on-black body text
- Borders and cards visible in both themes
- No React hydration warnings in browser console
- Theme choice persists after reload

## Last run (2026-06-10)

**Environment:** Web on `:3000`. Postgres/Docker was offline during first pass.

| Area | Light | Dark | Notes |
|------|-------|------|-------|
| `/` marketing home | Pass | Pass | Theme toggle; footer readable; mobile ~390px OK |
| `/portal` | Pass | Pass | Hero/CTA contrast OK |
| `/sign-in` | Pass | Pass | Fixed `BrandLogo` hydration error |
| `/user` | Pass | Pass | Offline banner when API down |
| `/user/security` | Pass | Pass | Export/delete panels readable |
| `/org/*` | Blocked | Blocked | Needed `DEMO_CLERK_USER_ID` + live API |

**Fixes applied:** `BrandLogo` CSS tokens; `useNoaColors` mounted gate; `pnpm qa:*` scripts for easier re-run.
