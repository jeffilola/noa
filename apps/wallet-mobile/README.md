# Noa Holder (Expo) — M12 smoke screen

Minimal React Native shell for the Identity Holder mobile app.

## What works today (M12)

- App boots on iOS, Android, or Expo Go
- Holder welcome smoke screen
- Ping `GET /api/v1/health` to confirm API reachability
- Pull-to-refresh on API status

Not included yet: Clerk sign-in, credential list, wallet passes, NFC.

## Prerequisites

- Node.js 20+
- pnpm 9+ (from repo root)
- [Expo Go](https://expo.dev/go) on a phone, or Android Studio / Xcode simulator

## Run locally

From the **repo root**:

```bash
pnpm install
pnpm qa:dev
```

In a second terminal:

```bash
pnpm --filter @noa/wallet-mobile dev
```

Press `a` for Android emulator, `i` for iOS simulator, or scan the QR code with Expo Go.

## API URL on emulators

| Environment | `EXPO_PUBLIC_API_URL` |
|-------------|------------------------|
| iOS simulator | `http://localhost:3001/api/v1` (default) |
| Android emulator | `http://10.0.2.2:3001/api/v1` |
| Physical device | Your machine LAN IP, e.g. `http://192.168.1.10:3001/api/v1` |

Example (PowerShell):

```powershell
$env:EXPO_PUBLIC_API_URL="http://10.0.2.2:3001/api/v1"
pnpm --filter @noa/wallet-mobile dev
```

## Verify

```bash
pnpm --filter @noa/wallet-mobile build
```

Manual checklist: [docs/m12-testing.md](../../docs/m12-testing.md)

## GitHub

Milestone M12 · Issue [#73](https://github.com/jeffilola/noa/issues/73)
