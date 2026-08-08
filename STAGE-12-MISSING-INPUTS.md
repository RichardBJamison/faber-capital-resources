# STAGE-12-MISSING-INPUTS

**Date:** 2026-08-08  
**Honest status:** Stage 12 can complete its *documentation, claim cleanup, Bill narrative enrichment, and mock-isolation* work without inventing facts. Full production launch still needs the items below from Richard/Bill.

## Blocking production indexing of real proof

1. **5–10 verified transactions** with: year, property type, privacy-safe market, situation, capital need, structure, challenge, result, program tag, publication permission, no sensitive IDs.
2. **2+ testimonials** with exact quote text, attribution preference, relationship, and **written permission**.
3. Decision: when verified items exist, convert `data/proof.json` records to `status: "verified"` and re-run mock-zero gate.

## Blocking richer Bill authority

4. Public title/role line if different from current (Intake A1).
5. Career chronology with date ranges Bill will publish (A2–A3).
6. Licenses / certifications / affiliations / education — only if current and publishable (A4).
7. Approved headshot + rights (A7).
8. `sameAs` public profiles if any (A8).
9. Optional: public approval to name **Cogo** and “master broker” status (BF-12).

## Blocking program numeric claims

10. **Current written Cogo (and other) program sheets** with effective dates for any leverage, LTV/LTC/ARV, DSCR, credit, fees, terms, loan size, geography, recourse.
11. Richard decision on whether any oral 100%/75% LTV claim may ever appear publicly and under what exact wording (counsel recommended).
12. Counsel pass on LLC/licensing language (BF-11) and disclosures.

## Operations (separate from website polish; listed for launch checklist)

13. Real GA4 ID.
14. Production form / CRM wiring (GHL is a separate ops build — not Stage 12 website work).
15. Production host flip: remove `noindex` only when all gates pass.

## Not missing for architecture

- Six-program universe, geos, Deal Path, Stage 09 guides, proof system shape, indexing gates — already built.
