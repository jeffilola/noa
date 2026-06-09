# UI visual QA checklist

Run before closing M5 UX audit issues or shipping staging. Test each route in **light**, **dark**, and **system** theme.

## Setup

```powershell
pnpm --filter @noa/api dev
pnpm --filter @noa/web dev
```

Use the header theme control (System / Light / Dark).

## Holder (`/user/*`)

| Route | Check |
|-------|--------|
| `/user` | Stat tiles readable; offline banner if API down |
| `/user/identity` | Profile, credentials, devices sections; refresh credentials |
| `/user/security` | Export success message; deletion confirm requires `DELETE` |

## Org (`/org/*`)

| Route | Check |
|-------|--------|
| `/org` | Overview stats and tiles |
| `/org/integrations` | HID Origo row shows Active when seeded |
| `/org/credentials` | Table readable; badges visible |

## Auth & marketing

| Route | Check |
|-------|--------|
| `/sign-in` | Clerk card matches theme |
| `/` | Navbar theme toggle; footer readable |
| `/portal` | Hero and CTA contrast |

## Mobile

Repeat holder overview and marketing home at ~390px width.

## Pass criteria

- No white-on-white or black-on-black body text
- Borders and cards visible in both themes
- No React hydration warnings in browser console
- Theme choice persists after reload
