**User story:** As org admin, I want a single member view that answers “does this contractor have access?” with identity, credential, and last-access signals, so that I can run the hero demo without switching screens.

**Acceptance criteria:**
- [ ] Org **Users** table links each member to `/org/users/[userId]` (or equivalent detail route)
- [ ] Detail page shows **Access decision** panel with modules: identity status, membership/workforce status, credential summary (active badge if any), **last access** (from API #46), placeholders for training/cert until real data exists
- [ ] Recent access events table (last 10) on same page
- [ ] Readable in light and dark theme; mobile layout does not break drawer nav
- [ ] Empty states when no credential or no access events yet

**Size:** M

**Epic:** `epic:org` · **Areas:** `area:web`

**Depends on:** #46

**Notes:** Implements hero demo steps 1–6 in [product-vision.md](../../docs/product-vision.md) (training/cert may remain stub copy).

## Test procedures

1. Sign in as demo org admin → **Users** → open demo holder member.
2. Access decision panel shows active membership + at least one credential from seed.
3. Last access shows yesterday + “Main entrance” (from seed).
4. Recent events table lists seeded events newest-first.
5. Toggle dark mode — panel and table remain readable.
6. Open on phone-width viewport — page scrolls; no menu overlap blocking content.
