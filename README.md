# Faber client link — GitHub Pages

**Public URL:** https://richardbjamison.github.io/faber-capital-resources/

| Surface | Path | What it is |
|--------|------|------------|
| **Mock-up 2 (live root)** | `/` | Real Estate Capital Resources (acqua-frame). Offer + Nexus in the menu. |
| **Nexus (Miami pastel)** | `/nexus/` | Doodle Bug / RECR client Nexus |
| **Offer** | `/resonant-design-offer/` | Resonant Design three-door offer |
| **Mock-up 1 (archive)** | `/legacy-fcr/` | Old Faber Capital Resources WordPress-style mirror |

Lab source for mock-up 2: `~/Me-Nexus/working/acqua-funding/site/`

## Pre-launch hardening (2026-08-07)

- Content cleanup, claim-token removal, authority polish, OG/schema/canonicals: complete on public routes.
- Development remains `noindex,nofollow` until production flip — see `LAUNCH-CHECKLIST.md`.
- Product-scope questions for Richard/Bill: `PRODUCT-SCOPE-VERIFICATION.md`.
- Unverified numbers/credentials register: `UNRESOLVED-FACTS.md`.
- Public sitemap: 46 routes. Internal surfaces excluded: `/nexus/`, `/brokerage/`, `/resonant-design-offer/`, `/lab/`, `/deal-desk/`, `/legacy-fcr/`.
## Product-scope reconciliation (Handoff 04 — 2026-08-07)

- Launch programs: Fix & Flip, Rental/DSCR, Purchase & Rehab, Bridge, Ground-Up, Small Multifamily (2–4).
- Deferred (retained, noindex, off sitemap): Commercial, Joint Venture, Portfolio.
- Removed unverified 100% purchase+rehab and 70% ARV marketing claims.
- Role locked: broker / connector / capital-path guide. Labeling: Financing Programs.
- Homepage selector: **6** cards (not forced to 9).
- See PRODUCT-SCOPE-VERIFICATION.md, UNRESOLVED-FACTS.md, LAUNCH-CHECKLIST.md.



## Search authority + knowledge graph (Handoff 06 — 2026-08-07)

- Geo pages: Cleveland + South Florida investor financing.
- Sitemap target: **45** launch-eligible URLs.
- Intent ownership: `SEARCH-INTENT-MAP.md`.
- Homepage six-card briefings remain locked (Handoff 05).


## Proof system (Handoff 07 — 2026-08-07)

- Source of truth: `data/proof.json` (`mock` | `verified` | `draft`)
- Renderer: `assets/js/proof.js` + proof CSS in `acqua-frame.css`
- Intake: `PROOF-INTAKE.md` · Ledger: `PROOF-LEDGER.md`
- Development renders labeled mocks; **zero mock data in JSON-LD/meta/llms**
- Launch: strip all mocks before indexing; Results may stay off-sitemap if empty of verified proof


## Browser QA (Stage 08)

- Report: `BROWSER-QA-08.md`
- Artifacts: `qa/stage-08/` (not public content)
- Re-run: `python3 serve.py` then `node qa/stage-08/run-browser-qa.mjs`


## Stage 10 — Entity + discovery

- `ENTITY-MAP.md` · `INDEXING-MANIFEST.md` · `SEARCH-DISCOVERY-AUDIT-10.md`
- Launch sitemap: **47** (Results conditional)
- Validator: `qa/stage-10/validate-launch.py`


## Release candidate (Stages 11–13 — 2026-08-08)

- **Deal Path** conversion tool: `/tools/deal-path/` (guidance only, not underwriting).
- **Proof system:** `data/proof.json` + verified-only launch mounts; `/results/` mock design hub **off** launch sitemap.
- **Launch sitemap:** **48** URLs. Results excluded until verified transactions.
- **RC status:** `STAGE-13-COMPLETION.md` — RC PASS / PRODUCTION BLOCKED (noindex, mock forms, no verified txs, GA4 placeholder).
- **Client preview:** this GitHub Pages site remains `noindex` until production flip.
- Runbooks: `PRODUCTION-RUNBOOK-13.md`, `RELEASE-MANIFEST-13.md`, `LAUNCH-INPUT-TRIAGE-13.md`.

