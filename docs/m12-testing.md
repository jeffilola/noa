# M12 testing — Expo holder smoke screen

**What this is:** A minimal mobile app that boots and checks the Noa API. No sign-in or wallet passes yet.

**GitHub issue:** [#73](https://github.com/jeffilola/noa/issues/73)  
**App path:** `apps/wallet-mobile`

---

## Before you start

```powershell
cd C:\Users\jeffe\Projects\noa
pnpm install
pnpm qa:dev
```

Keep `pnpm qa:dev` running (API on port 3001).

---

## Terminal check

```powershell
pnpm --filter @noa/wallet-mobile build
```

Expect: exit 0 (TypeScript passes).

---

## Browser / device test

1. In a **second terminal**:
   ```powershell
   pnpm --filter @noa/wallet-mobile dev
   ```
2. Open the app:
   - **Expo Go:** scan the QR code on your phone (same Wi‑Fi as your PC), or
   - **Android emulator:** press `a` in the Expo terminal, or
   - **iOS simulator (Mac):** press `i`
3. You should see:
   - [ ] Title **Noa Holder**
   - [ ] **M12 smoke screen** label at the top
   - [ ] **API status** shows **API reachable** (green dot) when `pnpm qa:dev` is running
4. Pull down to refresh — status reloads without crashing.
5. Stop the API (Ctrl+C on `pnpm qa:dev`), pull to refresh:
   - [ ] Status changes to **API offline** (red dot)

---

## Android emulator note

If API stays offline on Android emulator, restart Expo with:

```powershell
$env:EXPO_PUBLIC_API_URL="http://10.0.2.2:3001/api/v1"
pnpm --filter @noa/wallet-mobile dev
```

---

## Pass criteria

- [ ] `pnpm --filter @noa/wallet-mobile build` passes
- [ ] App opens without a redbox error
- [ ] API online when dev stack is running
- [ ] API offline when API is stopped
- [ ] `apps/wallet-mobile/README.md` steps work

---

## What this is NOT

- Not Clerk mobile sign-in
- Not real wallet pass issuance
- Not NFC / presentation mode (removed from M12 smoke scope; comes later)
