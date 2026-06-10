**User story:** As a user, I want consistent light and dark palettes across the app shell, so that dashboards and shared UI look intentional in either mode.

**Acceptance criteria:**
- [ ] Semantic CSS tokens for light (`:root`) and dark (`.dark`) in `globals.css`
- [ ] `next-themes` provider with `class` strategy on `<html>`
- [ ] No flash of wrong theme on first paint (blocking script or `suppressHydrationWarning`)
- [ ] Dashboard surfaces (cards, nav, tables, badges, callouts) readable in both modes (WCAG-friendly contrast)
- [ ] Default follows system preference; user override persisted

**Size:** M

**Notes:** Foundation for all other M5 UI work. Marketing Relume pages follow in #41.

## Test procedures

1. Set OS to light mode — open `/user` — expect light surfaces and dark text.
2. Set OS to dark mode — reload — expect current dark aesthetic.
3. Toggle theme in header — choice persists after reload.
4. Check `/org`, `/user/identity`, `/user/security` in both modes — no illegible text or invisible borders.
