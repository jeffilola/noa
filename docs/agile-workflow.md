# Agile workflow (Phase 1)

Lightweight process for the Noa monorepo. Optimized for a small team or solo builder with AI-assisted development.

## Project board

Use a GitHub Project with these columns:

| Column | Meaning |
|--------|---------|
| **Backlog** | Ideas and future work, not yet ready |
| **Ready** | Refined issue with acceptance criteria; can be picked up |
| **In Progress** | Someone is actively working on it (limit 1–2) |
| **Review** | PR open, CI running, awaiting review |
| **Done** | Merged and meets [Definition of Done](./definition-of-done.md) |

### Create the board

1. Open https://github.com/jeffilola/noa/projects
2. **New project** → Template: **Board**
3. Name: **Noa**
4. Add the columns above (rename defaults if needed)
5. Link to repository **jeffilola/noa**

Or from CLI (GitHub Projects v2):

```powershell
gh project create --owner jeffilola --title "Noa"
```

Then add issues from the repo to the board via the GitHub UI.

## Issues

Create issues with templates:

- **Bug report** — something broken
- **Feature** — user story + acceptance criteria
- **Spike** — time-boxed research

Every feature should have testable acceptance criteria before moving to **Ready**.

## Branch workflow

| Rule | Detail |
|------|--------|
| Default branch | `main` — always deployable |
| Branch names | `feature/short-name`, `fix/short-name`, `spike/short-name` |
| Work flow | Issue → branch → PR → review → merge |
| Direct push to `main` | Avoid — use PRs so CI runs |

### Start work

```powershell
git checkout main
git pull origin main
git checkout -b feature/my-change
# ... commits ...
git push -u origin feature/my-change
gh pr create --fill
```

## Pull requests

PRs use [.github/pull_request_template.md](../.github/pull_request_template.md):

- Summary and linked issue
- Test plan (required)
- CI must pass before merge

## Definition of Done

See [definition-of-done.md](./definition-of-done.md). Do not move issues to **Done** until the checklist is satisfied.

## Environment

Before coding or demoing, run through [environment-checklist.md](./environment-checklist.md).

## Branch protection (recommended)

On `main`:

- Require pull request before merging
- Require status check: **CI** (or **build** job)
- Do not allow force push

Configure at: **Repo → Settings → Branches → Add rule** for `main`.

Or ask a maintainer to apply the rule via GitHub Settings.

## What we are not doing yet (Phase 2+)

- Fixed sprint ceremonies
- Story points
- Release trains

Add those when the backlog grows beyond ~20 active issues.
