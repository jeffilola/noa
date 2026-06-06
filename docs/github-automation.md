# GitHub automation

Automated Agile workflow for [jeffilola/noa](https://github.com/jeffilola/noa) using GitHub Actions, labels, Dependabot, and Project **#2**.

Project board: https://github.com/users/jeffilola/projects/2

---

## One-time setup (required)

### 1. Create a Personal Access Token

Project automation needs write access to your **user** project (the default `GITHUB_TOKEN` cannot update user-owned projects).

1. Open https://github.com/settings/tokens?type=beta (fine-grained) **or** classic token
2. **Fine-grained (recommended):**
   - Repository access: **Only jeffilola/noa**
   - Permissions: **Issues** read/write, **Pull requests** read/write, **Metadata** read, **Projects** read/write (account)
3. **Classic:** enable scopes `repo` and `project`
4. Copy the token

### 2. Add repository secret

1. https://github.com/jeffilola/noa/settings/secrets/actions
2. **New repository secret**
3. Name: `PROJECT_PAT`
4. Value: paste token

### 3. Link repo to the project (recommended)

```powershell
gh project link 2 --owner jeffilola --repo jeffilola/noa
```

### 4. Create labels (if missing)

Area labels for PR auto-labeling:

```powershell
gh label create "area:web" --color "1D76DB" --repo jeffilola/noa
gh label create "area:api" --color "5319E7" --repo jeffilola/noa
gh label create "area:database" --color "0E8A16" --repo jeffilola/noa
gh label create "area:domain" --color "FBCA04" --repo jeffilola/noa
gh label create "area:integrations" --color "D93F0B" --repo jeffilola/noa
gh label create "area:infra" --color "006B75" --repo jeffilola/noa
gh label create "area:docs" --color "0075CA" --repo jeffilola/noa
gh label create "ready" --color "C5DEF5" --description "Ready for sprint" --repo jeffilola/noa
gh label create "in-progress" --color "FEF2C0" --description "Actively being worked" --repo jeffilola/noa
```

---

## What runs automatically

| Trigger | Workflow | Action |
|---------|----------|--------|
| Issue opened | `project-automation.yml` | Add to board → **Backlog** |
| Issue labeled `ready` | `project-automation.yml` | Move to **Ready** |
| PR opened / ready for review | `project-automation.yml` | PR → **Review**; linked issue → **Review** |
| PR merged with `Closes #N` | `project-automation.yml` | Issue → **Done** |
| PR opened (no issue link) | `pr-automation.yml` | Comment reminder to add `Closes #N` |
| PR files changed | `labeler.yml` | Add `area:*` labels from paths |
| Push / PR | `ci.yml` | Build, test, migrate |
| Weekly | `dependabot.yml` | Dependency update PRs |

---

## Daily developer flow (automated)

```
1. Pick issue from Ready (or label issue `ready` after refining)
2. git checkout -b feature/my-change
3. Work + commit
4. gh pr create --fill   # body includes: Closes #1
5. CI runs → PR on board in Review
6. Merge PR → issue moves to Done
```

### PR body keywords

Use in PR description for automation:

```
Closes #1
Fixes #2
Resolves #3
Relates to #4   # reminder only, does not auto-close
```

---

## Manual board moves (when needed)

| When | Action |
|------|--------|
| Start coding | Label issue `in-progress` or drag to **In Progress** |
| Blocked | Comment on issue; leave in **In Progress** |
| Spike done | Close issue or move to **Done** |

Optional: add a second workflow for `in-progress` label → **In Progress** column (same pattern as `ready`).

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Issues not added to board | Add `PROJECT_PAT` secret; re-run failed workflow |
| Workflow fails with 403 on GraphQL | Token needs **Projects** write on your account |
| Labeler does not add labels | Create `area:*` labels (see above) |
| Issue not moved to Done on merge | PR body must include `Closes #N` |
| Two "Noa" projects exist | This repo uses **project #2** — IDs are in `project-automation.yml` |

---

## Files

| File | Purpose |
|------|---------|
| `.github/workflows/project-automation.yml` | Board status automation |
| `.github/workflows/pr-automation.yml` | PR hygiene |
| `.github/workflows/labeler.yml` | Path-based PR labels |
| `.github/workflows/ci.yml` | Build gate on `main` |
| `.github/dependabot.yml` | Weekly dependency PRs |
| `.github/labeler.yml` | Path → label rules |

---

## Native GitHub Project workflows (optional)

In the project UI: **⋯ → Workflows**, you can add rules that mirror this automation without Actions. Use either Actions (this repo) or native workflows — not both for the same rule, to avoid conflicts.
