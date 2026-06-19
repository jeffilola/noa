# M10 testing — Integration admin (test mode)

**What this is:** A fake “connect your PACS provider” form for demos. It checks that a URL looks OK. It does **not** save passwords, API keys, or connect to HID/Brivo for real.

**GitHub issue:** [#71](https://github.com/jeffilola/noa/issues/71)

**Where the form lives:** Integration Admin → **Providers** → http://localhost:3000/integrations-admin/providers

---

## Before you start

```powershell
cd C:\Users\jeffe\Projects\noa
pnpm db:seed
pnpm qa:dev
```

Sign in as your demo Clerk user (`DEMO_CLERK_USER_ID` in `packages/database/.env`).

---

## Browser test (do this)

1. In the top dashboard switcher, choose **Integration Admin**.
   - If you do not see it, run `pnpm db:seed` again and restart `pnpm qa:dev`.
2. Click **Providers** in the sidebar.
3. You should see a form with:
   - **Provider** dropdown (HID Origo, Brivo, LenelS2)
   - **Test API base URL** field (default `https://api.origo.test`)
   - Yellow warning about not using live keys
   - **Validate test settings** button

If you only see “Integration admin setup needed”, run seed + restart dev servers (see above).

**Good URL test**

4. Click **Validate test settings** with the default HTTPS URL.
5. You should see a **success** message below the button.

**Bad URL test**

6. Change the URL to `http://example.com` (note: **http**, not https).
7. Click **Validate test settings** again.
8. You should see an **error** message.

---

## Pass criteria

- [ ] Integration Admin → Providers shows the form (not a blank placeholder page)
- [ ] `https://…` URL → success message
- [ ] `http://…` URL → error message
- [ ] Warning about no live keys is visible

---

## What this is NOT

- Not a real HID Origo connection
- Not storing provider credentials in the database

---

## Optional — run tests in terminal

```powershell
pnpm --filter @noa/api test
pnpm --filter @noa/web build
```
