# M7 testing — Training & certs on access panel

**What this is:** Real training and certification data on the org **access decision** panel (and a holder page to view your own records). No more fake “demo stub” text.

**GitHub issues:** [#52](https://github.com/jeffilola/noa/issues/52)–[#56](https://github.com/jeffilola/noa/issues/56)

---

## Before you start

```powershell
cd C:\Users\jeffe\Projects\noa
docker compose up -d postgres
pnpm qa:prepare
pnpm qa:dev
```

Sign in as the Clerk user in `packages/database/.env` (`DEMO_CLERK_USER_ID`).

---

## Browser test — org admin view

1. Switch to **Organization Admin**.
2. Open **Users** → click **Access view** on the demo member row.
3. On the access decision panel, check you see:
   - [ ] **Site safety orientation** (or similar training title) with a date
   - [ ] **Electrical safety certification** with expiry around **2027**
   - [ ] Identity, credential, and last site access still filled in (from earlier milestones)

4. Toggle dark mode — panel should still be readable.

---

## Browser test — holder view

5. Switch to **Identity Holder**.
6. Sidebar → **Training & certs** (or `/user/compliance`).
7. You should see the same training + certification rows in a table.
8. Click **Refresh list** — table reloads without error.

---

## Pass criteria

- [ ] Org access panel shows real training + cert (not generic stub copy)
- [ ] Holder compliance page lists the same seeded records
- [ ] Dark mode OK on both pages

---

## Optional — automated checks

```powershell
pnpm --filter @noa/api test
pnpm --filter @noa/web build
```

---

## If something breaks

| Problem | Try this |
|--------|----------|
| “No active certification” | Open access view for **your** signed-in user; run `pnpm db:seed` |
| Empty compliance table | Restart API after seed; click Refresh list |
| API offline banner | Run `pnpm qa:dev` |

Full deep-dive steps: see git history for the detailed M7 guide if needed.
