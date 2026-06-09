**User story:** As a product owner, I want holder and org flows audited in both themes, so that we can ship staging without obvious UI flaws.

**Acceptance criteria:**
- [ ] Checklist pass for `/user/*`, `/org/*`, auth routes in light + dark
- [ ] Fix contrast, spacing, empty/error/offline states found in audit
- [ ] No hydration warnings from theme-dependent rendering
- [ ] Short `docs/ui-visual-qa.md` checklist added

**Size:** M

**Depends on:** #39, #40, #41

## Test procedures

1. Run checklist in `docs/ui-visual-qa.md` on desktop and mobile width.
2. Record any failing route — should be zero before closing issue.
3. Stop API — offline banners readable in both themes.
