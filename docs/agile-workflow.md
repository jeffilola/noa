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

Or from PowerShell (use UTF-8 **without BOM** — `Out-File` breaks GitHub's JSON parser):

```powershell
$env:Path = "C:\Program Files\Git\bin;C:\Program Files\GitHub CLI;" + $env:Path
cd C:\Users\jeffe\Projects\noa

$json = '{"required_status_checks":{"strict":true,"contexts":["build"]},"enforce_admins":false,"required_pull_request_reviews":{"required_approving_review_count":0,"dismiss_stale_reviews":false},"restrictions":null,"allow_force_pushes":false,"allow_deletions":false}'
[System.IO.File]::WriteAllText("$PWD\branch-protection.json", $json, (New-Object System.Text.UTF8Encoding $false))

gh api --method PUT repos/jeffilola/noa/branches/main/protection --input branch-protection.json
Remove-Item branch-protection.json
```

## Phase 2 — Cadence

See dedicated docs:

| Doc | Purpose |
|-----|---------|
| [backlog.md](./backlog.md) | Prioritized product backlog by epic |
| [sprint-planning.md](./sprint-planning.md) | 2-week sprints, milestones, planning checklist |
| [demos/](./demos/README.md) | Weekly / end-of-sprint demo notes |
| [retros/](./retros/README.md) | Keep / stop / try retros |

**Current focus:** Sprint 1 · **M1: Holder dashboard usable**

## What we are not doing yet (Phase 3+)

- Staging environment automation
- Story points / velocity charts
- Release trains
