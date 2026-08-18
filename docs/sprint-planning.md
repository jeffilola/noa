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

| Milestone | Target outcome | Status |
|-----------|----------------|--------|
| **M1–M6** | Holder, org admin, PACS, GDPR, design system, access history | Done |
| **M7: Learning records** | Training/cert on access decision panel | Done (PR #57) |
| **M8: Wallet pass preview** | Holder wallet preview stub | Done (PR #57) |
| **M9: Platform org list** | Platform admin org search/list | Done (PR #57) |
| **M10: Integration admin stub** | Test-mode provider validation | Done (PR #57) |
| **M11: CI quality split** | Separate lint and build jobs | Done (PR #57) |
| **M12: Mobile smoke screen** | Expo holder app shell | **Current** (#73) |
| **M13: Revocation workflow** | Security admin revocation orchestration | Planned (#74) |
| **M14: Compliance export** | Export job + download | Planned (#75) |
| **M15: API scoping tests** | Cross-org integration tests | Planned (#76) |
| **M16: Ops docs** | Clerk runbook + roadmap docs | Planned (#77) |

View on GitHub: https://github.com/jeffilola/noa/milestones

Latest overnight review: [overnight-2026-08-18.md](./overnight-2026-08-18.md).

## Current sprint

**Sprint 12 · M12: Expo mobile smoke screen**

Focus: [#73](https://github.com/jeffilola/noa/issues/73) — scaffold `apps/mobile`, one signed-in smoke screen, README + test doc.

**Up next (same epic batch):** M13 → M16 per [backlog.md](./backlog.md).

## Planning checklist (Day 1)

1. **Review** [backlog.md](./backlog.md) and open milestone on GitHub.
2. **Close** or carry over unfinished issues from last sprint.
3. **Select** issues for this sprint (total size ≈ one milestone slice).
4. **Refine** each issue: user story, acceptance criteria, size, epic label.
5. **Move** selected issues to **Ready** on the project board.
6. **Pick** the first issue → **In Progress** → branch `feature/m12-expo-smoke`.

## Size guide

| Size | Guide | Examples |
|------|-------|----------|
| **S** | < 1 day | Copy, nav fix, runbook |
| **M** | 1–3 days | API + UI slice, Expo shell |
| **L** | 3–5 days | Export job E2E, staging |
| **XL** | > 5 days | Split into smaller issues |

## During the sprint

```
Backlog → Ready → In Progress → Review (PR open) → Done
```

- One PR per milestone when possible.
- CI must pass (`lint` + `build`).
- Merge only when [Definition of Done](./definition-of-done.md) is met.

## End of sprint

1. Demo what merged.
2. Write a demo note: `docs/demos/YYYY-MM-DD.md`.
3. Close milestone issues on GitHub.
4. Optional retro.

Last updated: 2026-08-18
