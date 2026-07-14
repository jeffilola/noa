# M11 testing — CI split (lint vs build)

**What this is:** GitHub Actions now runs **two separate checks** on each PR instead of one big job — so you can tell “lint problem” from “build/test problem” faster.

**GitHub issue:** [#72](https://github.com/jeffilola/noa/issues/72)

---

## What changed (simple)

| Check name | What it does |
|------------|----------------|
| **lint** | Installs deps and runs `pnpm lint` |
| **build** | Starts Postgres, generates Prisma client, runs migrations, builds the repo, runs tests |

---

## How to verify on GitHub

1. Open [PR #57](https://github.com/jeffilola/noa/pull/57) (or any open PR on this branch).
2. Scroll to **Checks**.
3. You should see **two** jobs: `lint` and `build` (not one combined job).
4. Both should be green on a good branch.

---

## Pass criteria

- [ ] PR shows separate `lint` and `build` checks
- [ ] `build` job still uses Postgres and runs tests
- [ ] If lint fails, build may still run (or vice versa) — they are independent

---

## Optional — run the same stuff locally

```powershell
cd C:\Users\jeffe\Projects\noa
pnpm lint
pnpm build
pnpm test
```

Fix anything that fails before merging.
