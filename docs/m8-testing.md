# M8 testing — Wallet preview (fake passes)

**What this is:** A preview page showing what Apple Wallet / Google Wallet **might** look like. It does **not** create real phone passes.

**GitHub issue:** [#69](https://github.com/jeffilola/noa/issues/69)

---

## Before you start

1. Run `pnpm qa:dev`.
2. Sign in as a **holder** (your demo Clerk user is fine).

---

## Browser test (do this)

1. Go to http://localhost:3000/user
2. You should see a **Wallet preview** link on the dashboard.
3. Click it — or open http://localhost:3000/user/wallet
4. You should see **two cards**: Apple Wallet and Google Wallet.
5. Each card should say **Preview only**.
6. The page should explain that **no real pass** is created (no barcode, no enrollment with Apple/Google).

---

## Pass criteria

- [ ] Wallet preview link on `/user`
- [ ] Both preview cards visible
- [ ] “Preview only” on each card
- [ ] Clear message that this is not real issuance

---

## Optional — build check

```powershell
pnpm --filter @noa/web build
```

Should complete with no errors.

---

## What this is NOT

- Not adding passes to your iPhone or Android wallet
- Not calling HID/Brivo to issue credentials
