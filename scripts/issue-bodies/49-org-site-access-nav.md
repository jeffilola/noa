**User story:** As an org admin, I want **Site access** in the org sidebar so I can open the org-wide access feed without typing a URL.

**Acceptance criteria:**
- [ ] **Site access** appears in Organization Admin sidebar between **Users** and **Credentials** (when user has `org:users:manage`)
- [ ] Link navigates to `/org/access`
- [ ] `pnpm qa:prepare` rebuilds `@noa/domain` so local dev picks up nav changes after pull
- [ ] Sidebar shows map-pin icon for **Site access**

## Test procedures

1. Run `pnpm qa:prepare` (or `pnpm --filter @noa/domain build`) and `pnpm qa:dev`.
2. Sign in → switch to **Organization Admin** dashboard.
3. Confirm sidebar lists **Site access** between **Users** and **Credentials**.
4. Click **Site access** → `/org/access` loads with event table (or empty state if API offline).
