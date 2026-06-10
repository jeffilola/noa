# M11 testing: CI quality split

## Expected CI behavior

The `CI` workflow now has two top-level jobs:

- `lint`: installs dependencies, generates the Prisma client, and runs `pnpm lint`.
- `build`: starts Postgres, applies migrations, builds the repo, and runs tests.

## Manual verification

- [ ] Open a PR and confirm GitHub shows separate `lint` and `build` checks.
- [ ] Confirm the `lint` job can fail independently from build/test.
- [ ] Confirm the `build` job still runs database migrations against the Postgres service.
- [ ] Confirm `pnpm build` and `pnpm test` still run in the `build` job.

## Local commands

```bash
pnpm lint
pnpm build
pnpm test
```
