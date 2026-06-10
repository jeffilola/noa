# M8 testing: Wallet pass preview stub

## Automated checks

Run from the repo root:

```bash
pnpm --filter @noa/web build
```

## Manual E2E checklist

- [ ] Sign in as a holder demo user.
- [ ] Open `/user` and confirm the `Wallet preview` quick link is visible.
- [ ] Open `/user/wallet`.
- [ ] Confirm Apple Wallet and Google Wallet preview cards render.
- [ ] Confirm each card is labeled `Preview only`.
- [ ] Confirm the page states that no PassKit package, Google Wallet object, barcode signing, or provider enrollment is created.
- [ ] Confirm the empty state appears if the holder has no credentials.

## Scope notes

M8 is UI-only. It does not issue real wallet passes and does not add provider-side issuance APIs.
