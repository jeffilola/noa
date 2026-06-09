**User story:** As a user, I want a theme control in the header, so that I can switch light/dark/system without leaving the page.

**Acceptance criteria:**
- [ ] Theme toggle visible on dashboard header (`AppNav`) and marketing navbar
- [ ] Options: System / Light / Dark (or equivalent clear control)
- [ ] Clerk sign-in/up components match active theme (#40)
- [ ] `UserButton` popover styled for both themes

**Size:** S

**Depends on:** #39

## Test procedures

1. Open `/` signed out — find theme control in navbar.
2. Open `/user` signed in — find theme control in app header.
3. Switch Light → Dark → System; Clerk sign-in page matches each mode.
