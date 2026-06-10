**User story:** As a platform engineer, I want access events stored as first-class records tied to user, org, and credential, so that last-access and history are real data—not audit log guesses.

**Acceptance criteria:**
- [ ] Prisma `AccessEvent` model: `organizationId`, `userId`, optional `credentialId`, `occurredAt`, `locationLabel`, `readerLabel`, `direction` (`entry` | `exit` | `unknown`), `source` (`PACS` | `NOA`), optional `externalEventId` for dedupe
- [ ] Unique constraint on `(organizationId, externalEventId)` when external id present
- [ ] Indexes for org+time and user+org+time queries
- [ ] Migration applied cleanly via `migrate:deploy`
- [ ] Demo seed: at least 3 events for demo holder (including one “yesterday” at Main entrance) linked to demo org + credential

**Size:** M

**Epic:** `epic:integrations` · **Areas:** `area:database`, `area:domain`

**Notes:** Foundation for M6 API/UI. Align field names with future HID/Brivo door-event ingest (#45).

## Test procedures

1. Run `pnpm db:generate` and `pnpm --filter @noa/database migrate:deploy`.
2. Run `pnpm db:seed` — expect no errors.
3. Query Postgres: `SELECT "locationLabel", "occurredAt" FROM "AccessEvent" ORDER BY "occurredAt" DESC LIMIT 5` — expect demo rows for demo org.
4. Re-run seed — expect idempotent upsert (no duplicate external ids).
