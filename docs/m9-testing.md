# M9 testing — Platform org list

**What this is:** A page for **platform admins** to see all customer orgs in one table, search them, and filter the list.

**GitHub issue:** [#70](https://github.com/jeffilola/noa/issues/70)

---

## Before you start

1. Run `pnpm qa:dev`.
2. Run `pnpm db:seed` once if you haven’t lately.
3. Sign in as your demo Clerk user (the one in `packages/database/.env` as `DEMO_CLERK_USER_ID`).

---

## Browser test (do this)

1. In the top dashboard switcher, choose **Platform Administrator**.
   - You should land on the org list (not a blank “page not found”).
2. Open **Organizations** in the sidebar — or go to http://localhost:3000/platform/organizations
3. You should see **Demo Organization** in the table with numbers for members, credentials, and providers.

**Search**

4. In the search box, type `demo` and click **Search**.
5. Demo Organization should still show up.
6. Type something nonsense like `zzzznotfound` and search.
7. You should see an empty “no matches” message.

**Filters (second row of the form)**

8. **Show** → try **Has members** → click **Apply filters**. Demo org should still appear.
9. **Sort by** → try **Recently updated** → **Apply filters**. List should reload without errors.

**Offline test**

10. Stop the API (Ctrl+C on `pnpm qa:dev` API terminal), refresh the page.
11. You should see a yellow **API unreachable** banner — not a crash.

---

## Pass criteria

- [ ] Platform Admin switcher works and org list loads
- [ ] Demo org shows with member/credential/provider counts
- [ ] Search finds demo org; nonsense search shows empty state
- [ ] Show / Sort filters apply without errors
- [ ] Offline banner appears when API is stopped

---

## Optional — run tests in terminal

```powershell
cd C:\Users\jeffe\Projects\noa
pnpm --filter @noa/api test
pnpm --filter @noa/web build
```

---

## If something breaks

| Problem | Try this |
|--------|----------|
| “Page not found” on Platform Admin | Pull latest; `/platform` should redirect to `/platform/organizations` |
| Empty list or permission banner | Run `pnpm db:seed`, restart API, sign in again |
| API offline banner while dev is running | Check API on port 3001; Clerk keys match in `apps/api/.env` and `apps/web/.env.local` |
