# Product vision — Universal Workforce Identity

> **Status:** Strategic direction (2026-06). Marketing copy not updated yet. Use this doc for sprint planning, demos, and issue framing.

## Category

**Universal Workforce Identity** — not a credential wallet.

Credentials, training, certifications, contractor status, compliance, and access history are **modules attached to one verified person**, scoped per organization.

---

## One external sentence

**Noa gives organizations one verified workforce identity per person — with access, training, certifications, and compliance attached — so security and ops can answer “can this person be on site?” with proof, not guesswork.**

Shorter variant (hero / pitch):

**One verified identity for every organization you work with — access and compliance included.**

---

## Internal north star

**When a security manager asks “Does this contractor have access?”, Noa answers in one place:**

| Signal | Example |
|--------|---------|
| Identity verified | Yes — profile and verification on file |
| Safety training completed | Yes — record linked to org membership |
| Credential active | Yes — PACS badge / mobile pass |
| Last site access | Yesterday — access event, not admin guesswork |
| Certification valid | Until 2027 — expiry visible on membership |

**North star metric (qualitative for v1):** Can we demo that answer for one contractor, one org, one credential — without opening five other systems?

**Platform rule:** Identity is the spine. Credentials are one attachment, not the product name.

---

## Hero demo script (contractor access question)

**Audience:** Security manager or org admin  
**Duration:** ~3 minutes  
**Preconditions:** Demo org seeded; contractor user has membership, training stub, credential, and at least one access event (future sprints fill gaps).

### Setup (30s)

> “Meet Alex — a contractor for Demo Organization. Before Alex badges in today, you need one answer: are they cleared for site access?”

Open **Org Admin → Users** (or future **Access decision** view). Search/select Alex.

### The question (15s)

> “Does this contractor have access?”

### The answer (90s) — walk the modules

1. **Identity verified**  
   > “Identity is verified — signed in, profile on file, Photo ID from Clerk / future PACS sync.”

2. **Workforce status**  
   > “Status: active contractor for Demo Organization — not employee, not visitor.”

3. **Training & compliance** *(stub → real in M5)*  
   > “Safety training completed on [date]. Policy acknowledgements current.”

4. **Credential**  
   > “Building credential active — HQ badge, valid through [date]. Source: PACS mirror / Noa.”

5. **Access history** *(stub → real in M6)*  
   > “Last access: yesterday, Main entrance — from access events, not a spreadsheet.”

6. **Certification** *(stub → real in M5)*  
   > “Electrical certification valid until 2027.”

### Close (30s)

> “HID answers the door. Your LMS answers the course. Noa answers the **person** — one identity, org-scoped proof, one screen. That’s workforce identity, not another wallet app.”

### Demo gaps today (honest)

| Module | Sprint / milestone |
|--------|-------------------|
| Verified identity, org membership, credentials (seed/API) | M1 ✅, M2 in progress, M3 ingest |
| Training / certifications on membership | M5 |
| Contractor / visitor workforce status | M4 |
| Site access history (events) | M6 |
| Single “access decision” UI | M6+ |

Use [demos/TEMPLATE.md](./demos/TEMPLATE.md) after each sprint; reference this script when the gaps close.

---

## Product map (modules)

```
Workforce Identity (platform)
├── Identity & verification     verified person, profile, Photo ID, encryption
├── Workforce lifecycle         employee / contractor / visitor / temp; onboarding
├── Access & credentials        badges, mobile passes, PACS mirror (v1 wedge)
├── Learning & certifications   training records, certs, expiry
├── Compliance & records        audit, exports, policy acknowledgements
└── Site & access history       door/check-in events tied to identity + org
```

Each module is **org-scoped** (membership + RBAC). The holder sees their attachments; org/security/compliance roles see what they’re allowed to see.

---

## Why incumbents don’t own this

| Vendor type | Owns | Doesn’t own |
|-------------|------|-------------|
| PACS (HID, Lenel, Brivo) | Doors, badges, some events | Training, contractor lifecycle, cross-org identity |
| IdP (Okta, Entra) | Workforce auth | Site access, certs, physical access proof |
| LMS / compliance tools | Courses, records | Live credential state, revocation, access history |
| VMS | Visitors | Employees, contractors, unified identity |

**Noa wedge:** verified identity + org attachments + audit — then deepen each module.

---

## Positioning shift (when copy updates)

| | Before | After |
|---|--------|--------|
| Category | Universal credential wallet | Universal workforce identity |
| Buyer story | “All your passes in one app” | “Can this person access? Here’s the proof.” |
| Credentials | The product | One module on the identity spine |
| Holder hub | Wallet-centric | Identity-centric (`My Identity` stays; “Access & credentials” as a section) |

---

## Related docs

- [Backlog](./backlog.md) — M4+ milestone rows
- [Sprint planning](./sprint-planning.md) — cadence and current sprint
- [RBAC](./rbac.md) — roles map to module owners (org, security, compliance)

Last updated: 2026-06-07
