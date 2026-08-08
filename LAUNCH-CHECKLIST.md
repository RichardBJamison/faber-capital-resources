# RECR Launch Checklist — Indexing & Claims Gate

**Development / GitHub Pages default:** every public HTML page carries  
`<meta name="robots" content="noindex,nofollow">`.

Do **not** remove that solely to “pass” an SEO audit on the mockup host  
(`richardbjamison.github.io/faber-capital-resources/`).

## Production indexing flip (only when ready)

1. Confirm no unresolved `{{CLAIM:…}}` tokens on public pages.
2. Confirm no development/scaffolding language on public pages.
3. Confirm product-scope items in `PRODUCT-SCOPE-VERIFICATION.md` resolved by Richard/Bill **or** accepted as published wording.
4. Confirm counsel has reviewed disclosures, privacy, terms, and role language.
5. Confirm GA4 ID is real (not `G-XXXXXXXXXX`).
6. Confirm production form/CRM wiring for Submit a Deal (or keep phone/email as primary).
7. **Then** replace `noindex,nofollow` with indexable robots policy on public pages only.
8. Keep `noindex` on `/nexus/`, `/brokerage/`, `/resonant-design-offer/`, `/lab/`, `/legacy-fcr/`, `/deal-desk/`.
9. Confirm `robots.txt` and `sitemap.xml` match production host.
10. Submit sitemap in Google Search Console / Bing Webmaster on production domain only.
11. Spot-crawl production: homepage, 3 program pages, tools, resources, about, results, submit-a-deal.

## Canonical host

Production canonicals currently point to:  
`https://realestatecapitalresources.com/`

Development host must not be treated as the indexable origin.

## Verification commands (local)

```bash
python3 serve.py   # or: python3 -m http.server 8840
# grep residual scaffolding
grep -RIn '{{CLAIM:\|Search intent this page\|ranking and conversion\|operational mockup' --include='*.html' . | grep -v legacy
# confirm noindex still on in dev
grep -RIn 'noindex' --include='*.html' index.html about team results | head
```


## Product-scope launch universe (Handoff 04)

**Indexable launch programs (when noindex is flipped):**
- Fix & Flip, Rental/DSCR, Purchase & Rehab, Bridge, Ground-Up, Small Multifamily (2–4)
- Tools, Learning Center, company/authority pages, convert pages

**Must remain noindex / off production sitemap until reactivated:**
- `/commercial/`
- `/joint-venture/`
- `/portfolio/`
- `/nexus/`, `/brokerage/`, `/resonant-design-offer/`, `/lab/`, `/deal-desk/`, `/legacy-fcr/`

**Do not reintroduce without written verification:**
- 100% purchase + rehab marketing claims
- 70% ARV as RECR program promise
- 75% LTV (or any numeric leverage) as public RECR claim
- 5+ unit commercial multifamily as RECR offering
- RECR as direct funder / underwriter language



## Geographic authority (Handoff 06)

Launch sitemap includes:
- `/cleveland-real-estate-investor-financing/`
- `/south-florida-real-estate-investor-financing/`

Both remain `noindex,nofollow` until production flip. No LocalBusiness street schema on geo pages until address verification policy is confirmed.


## Results launch rule (Handoff 07)

- If `/results/` contains **substantive verified** transaction proof at launch: it may join the normal production indexing flip with the rest of the public site.
- If `/results/` still has **no verified transactions** (or still contains mock markers): keep Results **out of the launch sitemap/indexing universe** until real proof is populated. Preserve the staging implementation for internal review.
- **Hard assertion before production indexing:** zero `data-proof-status="mock"` markers and zero “MOCK — DEMONSTRATION CONTENT” labels on any launch page.
- Global noindex removal must not accidentally index an empty or mock-only proof page.
- If Results is withheld from the final launch sitemap, update visitor-facing promises so pages do not repeatedly claim case studies that do not exist yet.

## Proof polish removal checklist

```bash
# Must return empty on launch candidates:
grep -RIn 'data-proof-status="mock"\|MOCK — DEMONSTRATION CONTENT' --include='*.html' --include='*.js' .
```

Source of truth: `data/proof.json`. Ledger: `PROOF-LEDGER.md`. Intake: `PROOF-INTAKE.md`.


## Browser QA (Stage 08)

Completed real Chromium Playwright pass (`BROWSER-QA-08.md`).

Launch blockers from Stage 08:
- None remaining after proof double-mount fix (Results nested cases).

Still in force from prior stages:
- Zero mock markers before production indexing
- Results indexing only with verified transactions
- GA4 real ID, CRM form production wiring
- Product-scope / unresolved numeric parameters


## Stage 10 — Search entity + discovery

- Intended launch sitemap: **47** (`/results/` excluded while mock-only). See `INDEXING-MANIFEST.md`.
- Entity IDs: `ENTITY-MAP.md`
- Discovery audit: `SEARCH-DISCOVERY-AUDIT-10.md`
- Pre-flip validator: `python3 qa/stage-10/validate-launch.py` (must exit 0 **and** mock mounts cleared)
- robots.txt documents OAI-SearchBot (allow) vs GPTBot (allow, separate policy) — no inclusion guarantee
- Do not submit sitemaps or flip noindex until validator is green and Bill proof is real


## Stage 12 — verified facts + mock isolation (2026-08-08)

- Fact register: `VERIFIED-FACT-REGISTER.md`
- Program matrix: `PROGRAM-FACT-MATRIX.md`
- Missing inputs: `STAGE-12-MISSING-INPUTS.md`
- Claim audit: `CLAIM-AUDIT-12.md`
- Browser QA: `BROWSER-QA-12.md`
- Proof: `data/proof.json` v2026-08-08-stage-12; launch mounts **verified-only**
- Results: still **excluded** from sitemap while only mocks exist (may use `data-proof-include-mock`)
- Intended launch sitemap count: **48** (Results not added)
- No live CRM / GHL wiring in website Stage 12
- Production flip still blocked by: mock Results design surface, zero verified txs, GA4 placeholder, CRM, counsel, program sheets for any numeric claim


## Stage 13 — Release candidate (2026-08-08)

- RC validator: `python3 qa/stage-13/validate-rc.py` → **RC PASS / PRODUCTION BLOCKED** (expected)
- Browser: `node qa/stage-13/browser-qa.mjs` → green
- Manifest: `RELEASE-MANIFEST-13.md` (48 URLs; Results excluded)
- Flip plan (do not execute): `INDEXING-FLIP-PLAN-13.md`
- Runbook: `PRODUCTION-RUNBOOK-13.md`
- Input triage: `LAUNCH-INPUT-TRIAGE-13.md`
- Forms/measurement: `FORM-AND-MEASUREMENT-READINESS-13.md`
- Domain plan: `DOMAIN-AND-REDIRECT-PLAN-13.md`
- Completion: `STAGE-13-COMPLETION.md`

**Stop:** no deploy/flip/CRM until Richard authorizes and production blockers close.
