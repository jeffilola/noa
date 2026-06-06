# Environment checklist

Use this before development, demos, or debugging “it works on my machine”.

## Required for full stack

| Requirement | Check | Notes |
|-------------|-------|-------|
| Node.js 20+ | `node -v` | CI uses Node 22 |
| pnpm 9+ | `pnpm -v` | `corepack enable` if needed |
| Git | `git --version` | Windows: `C:\Program Files\Git\bin` on PATH |
| Docker Desktop | `docker --version` | For Postgres |
| Postgres running | `docker compose ps` | Port **5432** |
| Dependencies installed | `pnpm install` | From repo root |

## Start services

```powershell
cd C:\Users\jeffe\Projects\noa
docker compose up -d postgres
pnpm db:generate
pnpm --filter @noa/database migrate:deploy
pnpm db:seed
```

Terminal 1 — API:

```powershell
pnpm --filter @noa/api dev
```

Terminal 2 — Web:

```powershell
pnpm --filter @noa/web dev
```

| Service | URL | Healthy when |
|---------|-----|--------------|
| Web | http://localhost:3000 | Homepage loads |
| API | http://localhost:3001/api/v1/health | JSON OK (not `ERR_CONNECTION_REFUSED`) |
| Postgres | localhost:5432 | API starts without Prisma connection errors |

## Environment files (not in git)

Copy examples and fill in values:

| File | Purpose |
|------|---------|
| `apps/api/.env` | `DATABASE_URL`, Clerk secret, encryption keys |
| `apps/web/.env.local` | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, Clerk URLs |
| `packages/database/.env` | `DATABASE_URL` for Prisma CLI |

Clerk keys in **web** and **api** must match the same Clerk application.

## Optional (not needed for most v1 work)

| Integration | Needed when |
|-------------|-------------|
| HID Origo API (outbound) | **No** for v1 corporate access — PACS issues badges |
| HID webhook ingest | Testing PACS sync — can use **mock** POST to `/webhooks/hid-origo` |
| Brivo API | v2 / Noa-led flows — adapters are **stubs** in v1 |
| Redis | Not required for current local stack |

## Common failures

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| `ERR_CONNECTION_REFUSED` on `:3001` | API not running or crashed | Start API; check Postgres on 5432 |
| Yellow API banner on `/user` | API offline | Start Postgres + API |
| `/user` 404 when signed out | Clerk middleware | Sign in first |
| `Cannot find module './xxxx.js'` (Next.js) | Corrupt `.next` cache | Delete `apps/web/.next`, restart dev |
| `EADDRINUSE` on `:3000` | Old dev server | Kill process on port 3000, restart |
| `git` not recognized | Git not on PATH | Add `C:\Program Files\Git\bin` or restart terminal |
| CI web build type errors | Duplicate `@types/react` | See root `pnpm.overrides` in `package.json` |

## CI vs local

GitHub Actions runs:

- Postgres service container
- `pnpm install --frozen-lockfile`
- `pnpm db:generate` → migrate → `pnpm build` → `pnpm test`

Placeholder Clerk env vars are set in CI for builds; real Clerk keys are only needed locally for sign-in.

## Quick verification script (PowerShell)

```powershell
@(
  "Node: $(node -v)",
  "pnpm: $(pnpm -v)",
  "Docker: $(docker --version 2>&1 | Select-Object -First 1)",
  "Postgres port: $(Test-NetConnection localhost -Port 5432 -WarningAction SilentlyContinue | Select-Object -ExpandProperty TcpTestSucceeded)",
  "API health: $(try { (Invoke-WebRequest http://localhost:3001/api/v1/health -UseBasicParsing).StatusCode } catch { 'down' })",
  "Web: $(try { (Invoke-WebRequest http://localhost:3000 -UseBasicParsing).StatusCode } catch { 'down' })"
) -join "`n"
```
