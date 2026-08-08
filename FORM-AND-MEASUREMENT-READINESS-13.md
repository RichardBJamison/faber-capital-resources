# FORM-AND-MEASUREMENT-READINESS-13

**Stage 13:** Document only. **Live CRM transmissions = 0.**  
No GHL field mapping, webhooks, or pipeline work in this stage.

---

## 1. Contact (`/contact/`)

| Item | State |
|------|--------|
| Fields | `name`, `email`, `phone`, `message` |
| Markup | `form[data-mock-form]` |
| Validation | Browser HTML5 + site conventions |
| Submit today | `site.js` intercepts → local status: *“Received locally (mock)…”* — **no network lead post** |
| Future handoff | Replace mock handler with production endpoint **or** keep phone/email primary and demote form |
| Privacy | No SSN/bank/ID fields; general inquiry only |
| Tracking hook | `track("deal_submit", …)` style events may fire for contact if wired in mock path — measurement ID still placeholder |

---

## 2. Submit a Deal (`/submit-a-deal/`)

| Item | State |
|------|--------|
| Fields | `name`, `email`, `phone`, `market`, `address`, `price`, `arv`, `rehab`, `capital`, `strategy`, `experience`, `notes` |
| Strategy options | Launch six + “Not sure” (no Commercial/Portfolio as recommended) |
| Markup | `form[data-mock-form]` |
| Submit today | Local mock confirm only — **no CRM** |
| Future handoff | Production form/CRM (ops). Field names already stable for mapping |
| Privacy | Business deal sketch; no high-sensitivity underwriting uploads |
| Related | Link to Deal Path for path uncertainty |

---

## 3. Deal Path (`/tools/deal-path/`)

| Item | State |
|------|--------|
| Inputs | Occupancy, units, property form, transaction, condition, capital need, strategy, timing, market, optional estimates, optional contact |
| Behavior | Multi-step wizard; guidance output; readiness checklist |
| Not | Approval, prequal, rate quote, hard lender rejection (except scope OOS: owner-occupied, 5+) |
| Persistence | Ephemeral in-page; payload `recr.deal_path.v1` in memory only |
| Submit today | Does **not** POST leads; CTAs deep-link Submit/Contact |
| Future handoff | Map `DEAL-PATH-DATA-CONTRACT.md` → CRM when ops ready |
| Contract file | `DEAL-PATH-DATA-CONTRACT.md` — leave unless fields change |

---

## 4. Analytics

| Item | State |
|------|--------|
| GA4 ID | `G-XXXXXXXXXX` placeholder in multiple HTML files |
| Config | `assets/js/tracking-config.js` + `site.js` `track()` |
| Intended events (names already used or intended) | `deal_submit`, briefing/program interactions, form mock submit |
| Stage 13 action | **Do not activate** real GA4 without authorized real property ID |
| Launch choice | (a) leave analytics off / placeholder inert, or (b) inject real ID after authorization |

---

## 5. Unresolved operational choices (external)

1. Primary lead path at go-live: form endpoint vs phone/email only.  
2. Who owns production form infrastructure (GHL ops separate).  
3. Whether Deal Path payload is stored at all pre-CRM.  
4. Real measurement ID and which events are mandatory day one.

---

## 6. Stage 13 confirmation

**Live external form/CRM transmissions: 0.**  
**No analytics ID invented.**
