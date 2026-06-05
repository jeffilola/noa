# Noa RBAC Architecture

Noa implements production RBAC across identity, organization, credential visibility, lifecycle orchestration, compliance, audit, and integrations.

## Noa responsibility boundary

**Noa manages:**
- Identity management
- Organization management
- Credential visibility
- Credential lifecycle orchestration (suspend, revoke — not issuance)
- Compliance
- Audit logging
- Integration management

**Noa never manages** (these remain with credential providers and PACS):
- Doors
- Readers
- Access levels
- Access schedules
- Credential issuance

Provisioning is requested via `credentials:provision:request`. Permission keys such as `credentials:issue`, `doors:*`, and `access_levels:*` are forbidden in the Noa catalog.

## Database schema

| Table | Purpose |
|-------|---------|
| `Role` | Canonical role definitions (`identity_holder`, `org_admin`, …) |
| `Permission` | Fine-grained permission keys |
| `RolePermission` | Many-to-many role → permission mapping |
| `UserRole` | Role assignments per user, scoped by organization or platform |

`UserRole.scopeKey` is `organizationId` for org roles or `__platform__` for platform roles.

`Membership.role` remains for org membership status and legacy mapping, but **`UserRole` is the authorization source of truth**.

## Roles

| Role key | Name | Scope |
|----------|------|-------|
| `identity_holder` | Identity Holder | Implicit for every authenticated user |
| `org_admin` | Organization Administrator | Organization |
| `security_admin` | Security Administrator | Organization |
| `compliance_auditor` | Compliance Auditor | Organization |
| `integration_admin` | Integration Administrator | Organization |
| `platform_admin` | Platform Administrator | Platform |

Permission matrices and navigation live in `packages/domain/src/rbac/`.

## Authorization middleware (API)

1. **`ClerkAuthGuard`** — Authenticates the session and attaches `req.auth` with `roles[]`, `permissions[]`, `organizationId`, and `isReadOnly`.
2. **`RequirePermission(...)`** — Permission check against `req.auth.permissions`.
3. **`RequireRole(...)`** — Role check against `req.auth.roles`.
4. **`RequireOrgScope()`** — Ensures route organization matches session org (platform admins bypass).
5. **`RequireOrgAdmin()`** — Organization administrator or platform administrator, blocks read-only roles from mutations.

### Session introspection

```
GET /api/v1/users/me/access
```

Returns roles, permissions, dashboards, holder navigation, and role assignments.

Send `x-organization-id` to resolve organization-scoped permissions for a specific tenant.

## Service layer

| Service | Location | Responsibility |
|---------|----------|----------------|
| `RbacService` | `apps/api/src/auth/rbac.service.ts` | Catalog sync, access resolution, assign/revoke roles |
| `AccessService` | `apps/api/src/auth/access.service.ts` | Session-level access resolution |

Domain constants and seed catalog: `packages/domain/src/rbac/seed-data.ts`.

## Dashboard navigation

Navigation configs are defined once in `packages/domain/src/rbac/navigation.ts` and consumed by the web app.

| Role | Base path |
|------|-----------|
| Identity Holder | `/user` |
| Organization Admin | `/org` |
| Security Admin | `/security-admin` |
| Compliance Auditor | `/compliance` |
| Integration Admin | `/integrations-admin` |
| Platform Admin | `/platform` |

The top navigation loads dashboards from `/users/me/access` and renders only roles assigned to the signed-in user.

## Seed data

```powershell
cd packages/database
pnpm migrate:deploy
pnpm seed
```

Demo users (Clerk IDs):
- `user_demo_holder` — holder only
- `user_demo_org_admin` — org admin for `demo-org`
- `user_demo_security` — security admin
- `user_demo_compliance` — compliance auditor
- `user_demo_integration` — integration admin
- `user_demo_platform` — platform admin

## Migration

Migration: `packages/database/prisma/migrations/20250602120000_rbac/`

After schema changes:

```powershell
pnpm --filter @noa/database generate
pnpm --filter @noa/database migrate:deploy
pnpm --filter @noa/database seed
```
