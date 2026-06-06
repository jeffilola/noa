# Noa Platform

Privacy-first identity and credential orchestration. **v1** ships PACS-led corporate access: credentials mirror from HID Origo webhooks; Noa does not issue `corporate_access` to HID.

## Structure

```
apps/api            NestJS REST API
apps/web            Next.js user + admin dashboards
apps/wallet-mobile  React Native (Expo) holder app
packages/database   Prisma schema + client
packages/domain     Domain types, issuance policy, ports
packages/encryption AES-256-GCM + AWS KMS (local fallback)
packages/integrations  HID, Brivo, Lenel adapters
packages/wallet     PassKit + Google Wallet builders
docs/               Integration and issuance docs
```

## Prerequisites

- Node.js 20+
- pnpm 9+
- Docker (Postgres + Redis)

## Quick start

```bash
docker compose up -d
pnpm install
cp apps/api/.env.example apps/api/.env
cp packages/database/.env.example packages/database/.env
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm dev
```

- API: http://localhost:3001/api/v1
- Web: http://localhost:3000

## Key endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/webhooks/hid-origo` | HID CloudEvents ingest |
| POST | `/credentials/issue` | Issue (409 for corporate + pacs_led) |
| GET | `/presentation/token/current` | 30s rotating token |
| POST | `/presentation/verify` | Verifier consume |
| POST | `/wallet/passes/issue` | Apple/Google pass (stub) |
| GET | `/gdpr/export` | GDPR data export |
| GET | `/audit/logs` | Audit log |

## Docs

- [agile-workflow.md](docs/agile-workflow.md) — Phase 1: board, issues, PRs, DoD
- [definition-of-done.md](docs/definition-of-done.md)
- [environment-checklist.md](docs/environment-checklist.md)
- [issuance-modes.md](docs/issuance-modes.md)
- [hid-origo-integration.md](docs/hid-origo-integration.md)
- [brivo-integration.md](docs/brivo-integration.md)

## Testing

```bash
pnpm test
pnpm build
```
