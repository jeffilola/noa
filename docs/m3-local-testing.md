# M3 local testing guide

Copy-paste terminal commands to verify Milestone 3 work locally: mock HID webhook ingest (#30), holder credential visibility (#31), issuance source badges (#32), and org integration health (#33).

**Repo:** [github.com/jeffilola/noa](https://github.com/jeffilola/noa)

---

## One-time setup

Open PowerShell at the repo root (`C:\Users\jeffe\Projects\noa` on Windows).

### 1. Start Postgres

```powershell
cd C:\Users\jeffe\Projects\noa
docker compose up -d postgres
```

### 2. Install dependencies and prepare the database

```powershell
pnpm install
pnpm db:generate
pnpm --filter @noa/database migrate:deploy
pnpm db:seed
```

Set your Clerk user in `packages/database/.env` (optional but recommended for seed alignment):

```powershell
# packages/database/.env
DEMO_CLERK_USER_ID=user_yourClerkIdHere
```

Re-seed after changing demo user or RBAC permissions:

```powershell
pnpm db:seed
```

### 3. Configure Clerk (API + web must use the same Clerk app)

```powershell
# apps/api/.env
CLERK_SECRET_KEY=sk_test_...

# apps/web/.env.local
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
```

### 4. Check environment

```powershell
node scripts/check-dev-env.mjs
```

### 5. Start dev servers (two terminals)

**Terminal A — API (port 3001):**

```powershell
cd C:\Users\jeffe\Projects\noa
pnpm --filter @noa/api dev
```

**Terminal B — Web (port 3000):**

```powershell
cd C:\Users\jeffe\Projects\noa
pnpm --filter @noa/web dev
```

**Verify API is up:**

```powershell
curl http://localhost:3001/api/v1/health
```

Expected: `{"status":"ok"}`

Sign in at **http://localhost:3000** with the same Clerk user you use for local dev.

---

## Issue #30 — Mock HID webhook ingest

### Resolve which holder the script will target

```powershell
cd C:\Users\jeffe\Projects\noa\packages\database
pnpm exec tsx scripts/resolve-demo-webhook-context.ts
```

By default this picks your **most recent demo-org sign-in**. Override with `--as=user_xxx` on the webhook script.

### Issue a mock PACS badge

```powershell
cd C:\Users\jeffe\Projects\noa
node scripts/post-hid-webhook.mjs issued
```

Expected response includes `"processed": 1` and `"externalCredentialId": "mock-origo-webhook-001"`.

### Idempotency (no duplicate badge)

```powershell
node scripts/post-hid-webhook.mjs issued
```

Same credential id should be updated, not duplicated.

### Revoke the mock badge

```powershell
node scripts/post-hid-webhook.mjs revoked
```

Expected: `"action": "revoked"`.

### Re-activate after revoke

```powershell
node scripts/post-hid-webhook.mjs issued
```

### Target a specific Clerk user

```powershell
node scripts/post-hid-webhook.mjs issued --as=user_yourClerkIdHere
node scripts/post-hid-webhook.mjs revoked --as=user_yourClerkIdHere
```

### Verify in Postgres (optional)

```powershell
docker compose exec postgres psql -U noa -d noa -c "SELECT \"externalCredentialId\", \"issuanceSource\", status FROM \"Credential\" WHERE \"externalCredentialId\" = 'mock-origo-webhook-001';"
```

---

## Issue #31 — Holder credentials after webhook ingest

Requires API + web running and signed-in holder.

### 1. Issue mock badge

```powershell
node scripts/post-hid-webhook.mjs issued
```

### 2. Browser checks

| Step | URL | Expected |
|------|-----|----------|
| Credentials list | http://localhost:3000/user/identity#credentials | **Mock HQ Badge (webhook ingest)** appears; click **Refresh list** if needed |
| Overview count | http://localhost:3000/user | Active credential count includes the mock badge |
| Revoke | Run `node scripts/post-hid-webhook.mjs revoked`, refresh credentials | Mock badge status shows **revoked** |
| Re-issue | Run `node scripts/post-hid-webhook.mjs issued`, refresh | Mock badge back to **active** |

### 3. Offline behavior

Stop the API (Ctrl+C in Terminal A), reload http://localhost:3000/user/identity#credentials — page should show a friendly offline/error state, not a crash.

Restart API and refresh.

---

## Issue #32 — PACS vs NOA badges on holder cards

Sign in and open **http://localhost:3000/user/identity#credentials**.

| Credential (seed / mock) | Expected badge |
|--------------------------|----------------|
| Demo Gym Membership | **NOA** (styled `badge-noa`) |
| HQ Building Access | **PACS** (`badge-pacs`) |
| Mock HQ Badge (after webhook issued) | **PACS** |

If mock badge is missing, run:

```powershell
node scripts/post-hid-webhook.mjs issued
```

Then refresh the credentials section.

Badges must show **PACS** / **NOA** — not raw enum strings or unstyled text.

---

## Issue #33 — Org integration connection health

Requires org admin access on **Demo Organization** (combined demo user from seed).

### 1. Re-seed if org admin nav is missing Integrations

After RBAC updates:

```powershell
pnpm db:seed
```

Restart API and web, sign in again.

### 2. Browser checks

| Step | URL | Expected |
|------|-----|----------|
| Org overview | http://localhost:3000/org | **Integrations** tile visible |
| Integrations page | http://localhost:3000/org/integrations | HID Origo row shows **Active**; API base URL from seed |
| Non-admin | Sign in as user without org admin | `/org` shows access empty state or redirect |
| Offline | Stop API, reload `/org/integrations` | Offline banner; no hard-coded placeholder data |

### 3. Verify API directly (optional)

Resolve demo org id:

```powershell
cd C:\Users\jeffe\Projects\noa\packages\database
pnpm exec tsx scripts/resolve-demo-webhook-context.ts
```

Use the `orgId` from JSON with a Clerk session token, or use dev headers if configured.

```powershell
curl http://localhost:3001/api/v1/organizations/<orgId>/integrations
```

(Requires org admin auth — easiest to verify via the web UI while signed in.)

### 4. Confirm seed row (optional)

```powershell
docker compose exec postgres psql -U noa -d noa -c "SELECT opc.status, cp.name FROM \"OrganizationProviderConnection\" opc JOIN \"CredentialProvider\" cp ON cp.id = opc.\"providerId\" JOIN \"Organization\" o ON o.id = opc.\"organizationId\" WHERE o.slug = 'demo-org';"
```

Expected: `active` for HID Origo.

---

## Full M3 smoke test (quick script)

Run in order with API + web up and browser signed in:

```powershell
cd C:\Users\jeffe\Projects\noa

# Health
curl http://localhost:3001/api/v1/health

# Webhook lifecycle
node scripts/post-hid-webhook.mjs issued
node scripts/post-hid-webhook.mjs issued
node scripts/post-hid-webhook.mjs revoked
node scripts/post-hid-webhook.mjs issued

# Then in browser:
# - /user/identity#credentials  → mock badge active, PACS badge
# - /user                       → credential counts updated
# - /org/integrations           → HID Origo Active
```

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `fetch failed` on webhook script | Start API: `pnpm --filter @noa/api dev` |
| Mock badge never appears in UI | Script holder must match signed-in user; use `--as=user_xxx` or sign in as user shown in script output |
| Org `/org` access denied | Set `DEMO_CLERK_USER_ID`, `pnpm db:seed`, restart API/web, same `CLERK_SECRET_KEY` in api + web |
| Hydration date warnings | Pull latest; dates use `YYYY-MM-DD` formatting |
| Integrations nav missing | `pnpm db:seed` after RBAC change, restart servers |

---

## Related docs

- [HID Origo integration](./hid-origo-integration.md) — payload shapes, fixtures, production blockers
- [Environment checklist](./environment-checklist.md) — full env var reference
- GitHub issues: [#30](https://github.com/jeffilola/noa/issues/30) · [#31](https://github.com/jeffilola/noa/issues/31) · [#32](https://github.com/jeffilola/noa/issues/32) · [#33](https://github.com/jeffilola/noa/issues/33)
