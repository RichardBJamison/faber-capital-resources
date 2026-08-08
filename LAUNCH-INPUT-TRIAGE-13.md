# LAUNCH-INPUT-TRIAGE-13

**Date:** 2026-08-08  
**Sources reconciled:** `STAGE-12-MISSING-INPUTS.md`, `VERIFIED-FACT-REGISTER.md`, `PROGRAM-FACT-MATRIX.md`, `CLAIM-AUDIT-12.md`, `PROOF-LEDGER.md`, `UNRESOLVED-FACTS.md`

---

## A. Launch-critical

Without these, a production flip would be misleading, unsafe, or operationally incomplete.

| ID | Item | Owner | Source needed | Status | Action |
|----|------|-------|---------------|--------|--------|
| LC-01 | Explicit Richard authorization to flip noindex / deploy | Richard | Verbal/written go | **Pending** | Do not flip until authorized |
| LC-02 | Form destination decision (phone/email-only vs production endpoint) | Richard + ops | Destination URL + test | **Pending** | Website can ship phone/email CTAs; mock forms must not look “live success to CRM” |
| LC-03 | No mock/unverified proof on **indexable** pages | Site (done for launch surfaces) | proof.json | **Launch surfaces clean** | Keep Results excluded or verified before index |
| LC-04 | Disclosures / role language counsel comfort | Counsel + Richard | Review | **Open** | Launch only with accepted disclosures |
| LC-05 | No reintroduced numeric program promises without sheets | Site (Stage 12 clean) | Written sheets if adding numbers | **OK if stay conceptual** | Do not publish oral 100%/75% without sheet + approval |
| LC-06 | Production host HTTPS + canonical host correct | Hosting owner | DNS/host access | **VERIFY ownership** | See DOMAIN plan |

**Note:** Zero verified transactions is **not** launch-critical for the 48-URL set if marketing does not claim live case studies. It **is** critical for Results indexing.

---

## B. Launch-important but removable

Improve authority; components can be omitted cleanly.

| ID | Item | Owner | Status | Clean omit action |
|----|------|-------|--------|-------------------|
| LI-01 | Verified transactions (5–10 ideal) | Bill/Richard | Missing | Keep Results off sitemap; home/team empty proof modules |
| LI-02 | Verified testimonials + permission | Bill/clients | Missing | Keep quotes mount empty |
| LI-03 | Bill career chronology / employers | Bill | Missing | Current narrative already non-chronology |
| LI-04 | Licenses / certifications / education | Bill | Missing | Do not invent; omit lists |
| LI-05 | Approved headshot | Bill | Missing | Keep text authority |
| LI-06 | `sameAs` profiles | Bill | Missing | Omit from schema |
| LI-07 | Public naming of Cogo / master-broker | Bill/Richard | Needs confirmation | Keep generic “private-lender capital partners” |
| LI-08 | Results as 49th indexable URL | Bill/Richard | Blocked by LI-01 | Leave excluded |

---

## C. Post-launch enrichment

| ID | Item | Notes |
|----|------|-------|
| PL-01 | Written program sheets → selective numeric claims | Only after register + claim audit |
| PL-02 | Oral 100%/75% LTV decision | Counsel + sheet; default remains unpublished |
| PL-03 | GA4 real ID + event QA | Optional; site works without |
| PL-04 | GHL / CRM full wiring | **Separate ops build** — not website Stage 13 |
| PL-05 | Session Two ops app (pipeline screens) | Not website |
| PL-06 | Additional geos / SEO articles | Out of launch RC scope |
| PL-07 | Portfolio product decision | Stays deferred |

---

## D. Proof gate (deterministic)

| Condition | Launch sitemap | Indexable Results |
|-----------|----------------|-------------------|
| 0 verified txs, mocks only on Results | **48** (exclude Results) | No |
| Verified txs enough for honest proof page, 0 mock on Results | **49** if added | Yes, with flip |
| Partial verified + residual mock on Results | **48** (exclude Results) | No |

No arbitrary minimum count. Recommendation: index Results only when the page honestly functions as proof without mock labels.

---

## E. Program-fact gate

| Public claim type | Allowed now? |
|-------------------|--------------|
| Conceptual path education | Yes |
| Broker/connector framing | Yes |
| Lender-specific numbers as RECR-wide | **No** |
| Calculator user inputs / industry rules of thumb with disclaimer | Yes |
