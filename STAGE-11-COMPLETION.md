# RECR Stage 11 — Deal Path + Conversion Intelligence

**Date:** 2026-08-08  
**Mode:** Local development only  
**Stop condition:** No commit, push, deploy, external lead submission, URL submission, crawler/WAF change, or indexing flip.

---

## A. Conversion audit

**Found**

| Surface | Behavior |
|---------|----------|
| `/submit-a-deal/` | Full mock form (`data-mock-form`); local confirm only; strategy options are launch programs + “Not sure” (deferred Commercial/Portfolio not offered as recommended paths) |
| `/contact/` | Mock short form; points to Submit a Deal |
| `/tools/*` | Calculators (DSCR, MAO, cash flow, rehab budget, checklist, deal analyzer) — kept as math tools |
| Six programs | Educational + Submit CTAs |
| Stage 09 decision guides | Static path education |
| Homepage briefings | Educational conversion; not a deal wizard |
| CRM | Not wired; honest mock notes |

**Gaps filled**

- No progressive “which conversation / what to have ready” bridge between learning and hand-raise
- No provider-neutral payload for future GHL mapping

**Reused vs rebuilt**

- **Reused:** design system (`acqua-frame.css`), site shell (`site.js`), form-card patterns, Submit/Contact language, existing calculators linked out, Stage 09 guides as supporting resources
- **Built:** `/tools/deal-path/` wizard + `assets/js/deal-path.js` guidance engine + CSS modules in acqua-frame + data contract

**Route decision:** **New route justified** — `/tools/deal-path/`  
Unique purpose (interactive readiness + conversation path), strong inbound links, no cannibalization of Submit a Deal or calculators.  
**Launch-indexable count: 48** (47 + deal-path). `/results/` still excluded.

Full audit: `CONVERSION-AUDIT-11.md`

---

## B. Final user flow

**Steps (5)**

1. **Property & scope** — occupancy, units (1–4 / 5+), existing vs ground-up, transaction stage  
2. **Condition & capital need** — ready / light rehab / major rehab / ground-up; capital conversation type  
3. **Strategy & exit** — renovate-sell, buy-rehab-hold, hold stabilized, build-sell/hold, temporary bridge, not sure; timing; optional market  
4. **Deal math (optional)** — purchase, rehab/construction, ARV, rent, notes; links to DSCR/MAO/rehab tools  
5. **Generate path** — optional contact (ephemeral only) → results

**Required vs optional**

- Required for progress: steps 1–3 field groups (scope/condition/strategy)  
- Optional: market, all numbers, contact  

**Unknown / not sure**

- Allowed on strategy, capital need, timing, market, and all figures  
- Produces readiness checklist items — not a dead end  

**Out of scope**

- Owner-occupied → scope explanation; no investor-loan recommendation  
- 5+ units → scope explanation (2–4 launch limit); no deferred Commercial routing  

---

## C. Decision logic (conceptual only)

| Program | Conceptual signals | Thresholds invented? |
|---------|-------------------|----------------------|
| **Fix & Flip** | Renovate-and-sell (esp. light/ordinary rehab; purchase capital) | **No** |
| **Purchase & Rehab** | Buy + major rehab; purchase_and_rehab capital; buy_rehab_hold; stacked acquisition+work | **No** |
| **Rental / DSCR** | Hold stabilized / ready-to-rent; refinance/hold intent | **No** (no min DSCR) |
| **Bridge** | Temporary bridge strategy and/or timing constraint before longer-term state | **No** |
| **Ground-Up** | Ground-up form/condition or build_sell / build_hold | **No** |
| **Small MF 2–4** | Units 2–4 → multifamily **context** alongside capital path (does not replace strategy) | **No** |

Transitions explained when appropriate (bridge → rental; construction → future hold) **without** conversion guarantees.

---

## D. Result experience

- **Deal snapshot** — user-supplied facts; estimates labeled  
- **Likely conversation path** — plain-English territory (e.g. “Fix & Flip — short-term capital…”)  
- **Why worth discussing** — strategy / condition / timing reasons  
- **What to have ready** — personalized missing-info checklist  
- **Useful next resources** — 1–4 canonical links (path guide, ARV, DSCR tool, etc.)  
- **CTAs** — program overview · Submit this deal · Talk through this deal · Edit / start over  
- **Caveat (visible, not buried):** planning guide, not approval/commitment/quote/underwriting  

---

## E. Future GHL contract

- **Doc:** `DEAL-PATH-DATA-CONTRACT.md`  
- **Schema / version:** `recr.deal_path.v1`  
- **Collected:** occupancy, units, propertyForm, transaction, condition, capitalNeed, strategy, timingConstraint, market, estimates, optional contact, derived guidance  
- **Live external submissions in Stage 11:** **zero**  
- Payload held in-page only (`root._dealPathPayload`); no localStorage of PII  

---

## F. Scenario QA

**Runner:** `node qa/stage-11/deal-path-scenarios.mjs`  
**Result:** **PASS 60 / FAIL 0** (`qa/stage-11/results.json`)

| # | Scenario | Result |
|---|----------|--------|
| 1 | SF → purchase → rehab → sell → Fix & Flip | PASS |
| 2 | SF → purchase + major rehab → hold → Purchase & Rehab (+ rental secondary) | PASS |
| 3 | Stabilized rental → hold → Rental/DSCR; no min DSCR | PASS |
| 4 | Timing/bridge → Bridge; hold transition → Bridge + rental secondary | PASS |
| 5 | Ground-up → sell → Ground-Up | PASS |
| 6 | Ground-up → hold → Ground-Up + future hold context (no refinance guarantee) | PASS |
| 7 | Duplex → fix-and-flip + 2–4 multifamilyContext | PASS |
| 8 | 5+ → OOS; no `/commercial/` | PASS |
| 9 | Owner-occupied → OOS; no investor path | PASS |
| 10 | Not sure / missing figures → finish + readiness checklist | PASS |

**Viewports (no overflowX):** 1440×900, 768×1024, 390×844, 360×800 — all PASS  
**Keyboard:** radio focusable, Space selects, native outline focus — PASS  
**Reduced motion:** wizard completes — PASS  
**Validation:** text field errors on empty continue — PASS  
**Restart / Back:** answers preserved; restart → step 1 — PASS  

**Defects found & fixed**

1. TDZ bug: `const readinessMissing = readinessMissing(a)` shadowing → renamed local to `missing`  
2. Reason copy used “guaranteed conversion” (negation) — reworded to “automatic product conversion”  
3. Mobile radio `.check()` flaky — label click + evaluate fallback in QA helper  

---

## G. Search / indexing state

| Item | State |
|------|--------|
| Sitemap before Stage 11 | 47 (Results excluded) |
| Sitemap after Stage 11 | **48** (+ `/tools/deal-path/`) |
| `/results/` | Excluded; mock-only; still a launch flip blocker |
| Deal Path SEO | unique title/desc/H1/canonical/OG/BreadcrumbList; **dev `noindex,nofollow`** |
| Schema | WebPage + BreadcrumbList only; no mock leakage |
| INDEXING-MANIFEST | Updated intended **48** |
| SEARCH-INTENT-MAP | Deal Path owns interactive readiness intent; which-financing-path remains educational owner |
| `validate-launch.py` | Expected count **48**; requires deal-path loc |
| Validator result | **Exit 1 — expected:** mock proof mounts still block production flip; sitemap count 48 OK |

---

## H. Guardrails (literal)

- **No** invented LTV/LTC/FICO/DSCR mins, rates, fees, 100% financing, 70% ARV promises  
- **No** mock proof as decision criteria  
- **No** owner-occupied → investor loan path  
- **No** 5+ → deferred Commercial routing  
- **No** Commercial / JV / Portfolio product links from tool logic  
- Broker/connector framing preserved  

---

## I. Files changed (material)

| Area | Paths |
|------|--------|
| Tool UI | `tools/deal-path/index.html` |
| Logic | `assets/js/deal-path.js` |
| Styles | `assets/css/acqua-frame.css` (deal-path modules) |
| Inbound links | `index.html`, `tools/index.html`, `loan-products/index.html`, `submit-a-deal/index.html`, `resources/which-financing-path/index.html` |
| Sitemap | `sitemap.xml` (+ deal-path) |
| Manifests | `INDEXING-MANIFEST.md`, `SEARCH-INTENT-MAP.md` |
| Contracts / audit | `CONVERSION-AUDIT-11.md`, `DEAL-PATH-DATA-CONTRACT.md`, `STAGE-11-COMPLETION.md` |
| QA | `qa/stage-11/deal-path-scenarios.mjs`, `qa/stage-11/results.json`, screenshots |
| Launch gate | `qa/stage-10/validate-launch.py` (expected 48 + deal-path check) |

---

## J. Stop condition

Confirmed:

- **No** commit  
- **No** push  
- **No** deploy  
- **No** external lead / CRM submission  
- **No** URL or sitemap submission  
- **No** crawler / WAF change  
- **No** production indexing flip (`noindex` intact)  

---

## Success definition

A visitor who does not know RECR product names can describe an investment scenario and receive a clear, honest financing **conversation path** plus a personalized **readiness checklist** — without RECR pretending to underwrite the deal.

**Loop closed:** Search / market / program education → decision support (Deal Path) → deal readiness → conversation / submission.

**Remaining launch work (not Stage 11):** verified proof, verified lender/program facts, live CRM wiring, production launch gate.
