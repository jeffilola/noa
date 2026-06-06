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
| **M3: Webhook ingest demo** | Mock HID webhook → credential in UI | Sprint 3 |

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

**Sprint 1 · M1: Holder dashboard usable**

Focus issues (create on GitHub from [backlog.md](./backlog.md)):

1. Holder overview empty states + API-offline copy  
2. Identity profile save feedback  
3. Devices register/deactivate UX  
4. Demo seed data for holder  

Update this section at each planning session.
