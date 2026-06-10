# M6 testing guide — issues #44–#48

Run issues **in order**. Each section ends with **Pass criteria** — check every box before moving on.

## One-time setup

```powershell
cd C:\Users\jeffe\Projects\noa
git checkout feature/m6-access-events
docker compose up -d postgres
pnpm db:generate
pnpm --filter @noa/database migrate:deploy
pnpm db:seed
pnpm qa:dev
```

Keep `pnpm qa:dev` running (API on `:3001`, web on `:3000`).

Sign in with the account linked in `packages/database/.env` as `DEMO_CLERK_USER_ID` (holder + org admin on one account after seed).

---

## #44 — AccessEvent schema + demo seed

**What you’re proving:** Events exist in Postgres with correct shape and idempotent seed.

### Steps

1. **Migration**
   ```powershell
   pnpm --filter @noa/database migrate:deploy
   ```
   Expect: `Applying migration ... access_events` or “already applied”, exit 0.

2. **Seed**
   ```powershell
   pnpm db:seed
   ```
   Expect: `Seed complete:` with no stack trace.

3. **Inspect rows**
   ```powershell
   echo 'SELECT "locationLabel", "occurredAt"::date, "externalEventId" FROM "AccessEvent" ORDER BY "occurredAt" DESC LIMIT 5;' | docker exec -i noa-postgres-1 psql -U noa -d noa
   ```
   Expect at least 3 rows; one row has `locationLabel = Main entrance` and `occurredAt` = **yesterday’s date**.

4. **Idempotent seed**
   ```powershell
   pnpm db:seed
   echo 'SELECT COUNT(*) FROM "AccessEvent" WHERE "externalEventId" LIKE ''demo-seed-access-%'';' | docker exec -i noa-postgres-1 psql -U noa -d noa -t
   ```
   Expect count still **3** (not 6).

### Pass criteria

- [ ] Migration applies without error
- [ ] Seed completes without error
- [ ] ≥3 demo access events in DB
- [ ] “Main entrance” event dated yesterday
- [ ] Re-seed does not duplicate demo external ids

---

## #45 — Mock PACS access event ingest

**What you’re proving:** Webhook creates/updates events; script works; dedupe holds.

### Steps

1. **Automated tests**
   ```powershell
   pnpm --filter @noa/api test
   ```
   Expect: `Access event ingest integration` — all ✔ (ingest, dedupe, 400, 404).

2. **Post a new event** (API must be running)

   The event is attached to a **specific Noa user**. It only appears on `/user/access` when you are signed in as that same Clerk user.

   ```powershell
   # Best: match packages/database/.env DEMO_CLERK_USER_ID (same as browser session)
   node scripts/post-access-event.mjs --location="Side door test"

   # Or pass your Clerk user id explicitly (copy from script output or Clerk dashboard)
   node scripts/post-access-event.mjs --as=user_xxxxxxxx --location="Side door test"
   ```

   Expect: script prints `User: user_xxx (uuid)` and HTTP 200 with `"processed": 1`.
   **Sign in as that `user_xxx`**, then open http://localhost:3000/user/access.

3. **Dedupe** — run again with same external id:
   ```powershell
   node scripts/post-access-event.mjs --external-id=evt-dedupe-test --location="Side door updated"
   node scripts/post-access-event.mjs --external-id=evt-dedupe-test --location="Side door updated"
   ```
   Expect: first run `action: "created"`, second `action: "updated"`.

4. **Bad payload** (optional)
   ```powershell
   curl -s -X POST http://localhost:3001/api/v1/webhooks/pacs/access-events -H "Content-Type: application/json" -d "{\"organizationId\":\"x\"}"
   ```
   Expect: HTTP 400.

### Pass criteria

- [ ] API integration tests pass
- [ ] Script posts successfully with API running
- [ ] Same `externalEventId` updates row instead of duplicating
- [ ] Missing fields return 400

---

## #46 — Access events read API

**What you’re proving:** Org-scoped and holder-scoped reads work; RBAC blocks cross-role access.

Use browser DevTools → Network while signed in, or call with Clerk session token.

### Steps (browser — recommended)

1. **Org admin — list events**  
   Open `http://localhost:3000/org/access` (org-wide feed) or **Users → Access view** on a member.  
   Network: `GET .../organizations/{orgId}/access-events`.  
   Expect: JSON array with seeded events, newest first.

2. **Org admin — access summary**  
   On same member page, network call `GET .../users/{userId}/access-summary`.  
   Expect: `lastAccess.locationLabel` = **Main entrance**, `recentCount` ≥ 1.

3. **Holder — own events**  
   Sign in as holder → `http://localhost:3000/user/access`.  
   Network: `GET .../users/me/access-events`.  
   Expect: only your events; each includes `organization.name`.

4. **RBAC negative** (if you have a holder-only account without org admin)  
   Holder tries org route → expect **403** in network tab.

5. **Automated**
   ```powershell
   pnpm --filter @noa/api test
   ```
   Expect: `lists holder access events and summary` ✔

### Pass criteria

- [ ] Org admin sees org access events
- [ ] Access summary shows Main entrance as last access
- [ ] Holder `/users/me/access-events` returns own rows only
- [ ] Holder cannot use org admin routes (403)
- [ ] API tests pass

---

## #47 — Org access decision panel

**What you’re proving:** Hero demo UI on one screen.

### Steps

1. Sign in as **org admin** → switch dashboard to **Organization Admin** (top switcher).
2. Sidebar → **Users** (or **Site access** for org-wide feed).
3. Click **Access view** on the demo holder row.
4. On `/org/users/[userId]` verify **Access decision** panel shows:
   - Identity verified (not disabled)
   - Active membership / workforce status
   - At least one **active credential** (HQ Building Access from seed)
   - **Last site access** with Main entrance + yesterday’s date
   - Training/cert lines marked as demo stubs
5. **Recent access events** table below — ≥3 rows, newest at top.
6. Toggle **dark mode** (sidebar menu) — panel + table readable.
7. DevTools → mobile width (~390px) — page scrolls; menu doesn’t cover content.

### Pass criteria

- [ ] Users table has “Access view” link
- [ ] Access decision panel shows credential + last access from real data
- [ ] Recent events table populated
- [ ] Light and dark themes OK
- [ ] Mobile layout usable

---

## #48 — Holder access history

**What you’re proving:** Holder sees cross-org event history.

### Steps

1. Sign in as **holder** (same demo account is fine).
2. Sidebar → **Site access** → `/user/access`.
3. Expect table with: when, organization, location, direction, source.
4. Seeded locations include **Main entrance**, **Parking gate**.
5. Toggle dark mode — table readable.
6. **Empty state** (optional): sign in as a Clerk user with no seed/events — friendly empty message, no crash.

### Pass criteria

- [ ] `/user/access` in holder nav
- [ ] Seeded events visible with org name
- [ ] Direction and source badges show
- [ ] Dark mode readable
- [ ] Empty state when no events (optional account)

---

## Quick smoke (all issues)

```powershell
pnpm qa:dev          # in one terminal
pnpm --filter @noa/api test
node scripts/post-access-event.mjs --location="Smoke test"
```

Then browser:

1. `/org/users` → Access view → decision panel + events  
2. `/user/access` → holder history  

---

## Troubleshooting

| Symptom | Fix |
|--------|-----|
| API unreachable banner | `pnpm qa:dev` or `pnpm --filter @noa/api dev` |
| No org access | Set `DEMO_CLERK_USER_ID` in `packages/database/.env`, re-seed, restart API |
| Empty access events | `pnpm db:seed` then refresh |
| Org sidebar missing **Site access** | Run `pnpm --filter @noa/domain build` and restart dev, or `pnpm qa:prepare` (rebuilds domain) |
| Issue #45 events missing on `/user/access` | Script posted for a different user — use `--as=` with your Clerk id, or set `DEMO_CLERK_USER_ID` in `packages/database/.env`, re-seed, sign in as that user |
| Clerk 401 | Match `CLERK_SECRET_KEY` in `apps/api/.env` and `apps/web/.env.local` |

Last updated: 2026-06-10
