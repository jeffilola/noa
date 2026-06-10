# Demo script — Contractor access question

Reference for the **Universal Workforce Identity** hero demo. Full context: [product-vision.md](../product-vision.md).

## One-line pitch

**Does this contractor have access?** — Identity verified. Training complete. Credential active. Last access yesterday. Certification valid until 2027.

## Flow

1. Open org admin view → select contractor (Alex).
2. Show **identity verified** (profile / verification status).
3. Show **workforce status** — active contractor for [Org] *(M4)*.
4. Show **training / compliance** — safety training complete *(M5)*.
5. Show **credential** — active badge / mobile pass *(M1–M3)*.
6. Show **last access** — yesterday, [site] *(M6)*.
7. Show **certification** — valid until 2027 *(M5)*.

## Close

> PACS owns the door. LMS owns the course. Noa owns the **person** — one verified identity, org-scoped proof.

## Checklist before demo

- [ ] Demo org + contractor user seeded
- [ ] Org admin can open user / access view
- [ ] Credential visible (seed or M3 webhook)
- [ ] Training/cert stubs or real records (M5)
- [ ] At least one access event (M6)
- [ ] Access decision panel wired (M6)

Track progress in sprint demo notes under `docs/demos/`.
