# Sprint planning

Two-week cadence for Noa. Lightweight — suitable for solo or pair work.

## Schedule

| Ritual | When | Duration | Output |
|--------|------|----------|--------|
| **Sprint planning** | Day 1 of sprint | 30–45 min | Sprint backlog in **Ready** |
| **Daily check-in** | Optional | 5 min | Blockers noted on board |
| **Demo** | Last day of sprint | 15 min | [Demo note](./demos/README.md) |
| **Retro** | After demo (monthly or per sprint) | 15 min | [Retro note](./retros/README.md) |

**Sprint length:** 2 weeks  
**WIP limit:** 1–2 issues **In Progress**

## Milestones

| Milestone | Target outcome | Due (approx) |
|-----------|----------------|--------------|
| **M1: Holder dashboard usable** | Demo-ready holder UX, local seed data | Sprint 1 |
| **M2: Org admin read-only** | Org Admin read-only dashboards | Sprint 2 |
| **M3: Webhook ingest demo** | Mock HID webhook → credential in UI | Sprint 3 ✓ |
| **M4: Holder trust (GDPR & privacy)** | Export UX + deletion flow | Sprint 4 |
| **M5: Design system & light/dark UI** | Tokens, theme toggle, marketing parity | Sprint 5 ✓ |
| **M6: Site access history** | Access events + org access-decision demo | Sprint 6 ✓ |
| **M7: Learning records** | Training/certification records in access decisions | Sprint 7 ✓ |

View on GitHub: https://github.com/jeffilola/noa/milestones

## Planning checklist (Day 1)

1. **Review** [backlog.md](./backlog.md) and open milestone on GitHub.
2. **Close** or carry over unfinished issues from last sprint.
3. **Select** 5–10 issues for this sprint (total size ≈ one milestone slice).
4. **Refine** each issue:
   - User story or bug summary
   - Acceptance criteria (checkboxes)
   - Size: S / M / L
   - Epic label
5. **Move** selected issues to **Ready** on the project board.
6. **Pick** the first issue → **In Progress** → create branch `feature/…` or `fix/…`.

## Size guide

| Size | Guide | Examples |
|------|-------|----------|
| **S** | < 1 day, one file or small UI | Copy, nav fix, empty state |
| **M** | 1–3 days, API + UI slice | Devices panel, org users list |
| **L** | 3–5 days, multiple packages | Webhook ingest E2E, staging env |
| **XL** | > 5 days | Split into smaller issues or spike first |

## During the sprint

```
Backlog → Ready → In Progress → Review (PR open) → Done
```

- One PR per issue when possible.
- CI must pass (`build` check).
- Merge only when [Definition of Done](./definition-of-done.md) is met.

## End of sprint

1. Demo what merged (even if partial).
2. Write a demo note: `docs/demos/YYYY-MM-DD.md` (copy [template](./demos/TEMPLATE.md)).
3. Move incomplete **Ready** / **In Progress** items back to **Backlog** or next milestone.
4. Optional retro if anything felt slow or unclear.

## Current sprint

**Sprint 8 · planning**

M7 learning records are ready for review. Keep M8 scoped to the next single milestone branch and PR.

**Before Day 1 planning:** run the [M7 testing guide](./m7-testing.md) and demo note [2026-06-11-m7.md](./demos/2026-06-11-m7.md).

**Day 1 checklist:** review [backlog.md](./backlog.md) -> create **M8** milestone + issues -> move to **Ready** -> branch `feature/m8-...`.

**Post-M7 follow-up:** reconcile GitHub milestone/issue status once the M7 PR is ready for human review.

Update this section at each planning session.
