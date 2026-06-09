**User story:** As a visitor, I want marketing pages to respect light/dark mode, so that the public site matches the signed-in product experience.

**Acceptance criteria:**
- [ ] Shared Relume components (`Navbar3`, `Footer3`, `BrandLogo`, etc.) use theme-aware tokens (not hardcoded dark hex)
- [ ] Home, about, security, contact, portal pages usable in light and dark
- [ ] `world-background` decorative layer adjusted for light mode (subtle, not blinding)

**Size:** M

**Depends on:** #39

## Test procedures

1. Open `/`, `/about`, `/portal` in light mode — no white-on-white or black-on-black blocks.
2. Repeat in dark mode — matches previous marketing look.
3. Toggle theme on marketing page — navbar/footer update without full broken layout.
