**User story:** As an identity holder, I want to see my recent site access history, so that I can confirm when and where I last badged in.

**Acceptance criteria:**
- [ ] New section or route under holder dashboard (e.g. `/user/access` or section on `/user`) listing recent access events
- [ ] Shows occurred time, location, org name, direction badge
- [ ] Uses `GET /users/me/access-events` from #46
- [ ] Empty state when no events; link/copy explains events come from org PACS sync
- [ ] Theme-aware styling consistent with M5 dashboard

**Size:** S

**Epic:** `epic:holder` · **Areas:** `area:web`

**Depends on:** #46

## Test procedures

1. Sign in as demo holder → open access history view.
2. Seeded events visible with correct org name and locations.
3. Sign in as fresh user with no events — empty state shown (no crash).
4. Light and dark themes — table/card readable.
