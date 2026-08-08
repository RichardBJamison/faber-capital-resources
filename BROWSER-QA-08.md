# RECR Browser QA — Stage 08

**Date:** 2026-08-07  
**Base:** `http://127.0.0.1:8840/` via `python3 serve.py`  
**Browser:** Playwright Chromium 1.62.1 (headless)  
**Driver script:** `qa/stage-08/run-browser-qa.mjs`  
**Artifacts:** `qa/stage-08/screenshots/`, `qa/stage-08/results.json`, `qa/stage-08/run-log.txt`

## Viewports

| Name | Size |
|------|------|
| Desktop | 1440×900 |
| Laptop | 1280×800 (structural load set) |
| Tablet | 768×1024 (structural load set) |
| Mobile | 390×844 |
| Small mobile | 360×800 (spot in suite config) |

## Template families exercised

Homepage (+ all 6 briefings), loan-products, 6 program pages, tools index, DSCR tool, resources index, understanding-arv, about, team, results, Cleveland geo, South Florida geo, submit-a-deal, contact, faq, shared nav/footer.

## Homepage interaction matrix (desktop + mobile)

| Program | Open | Focus | Explore Another | Continue → | Escape | Mobile layout |
|---------|------|-------|-----------------|------------|--------|---------------|
| fix-and-flip | PASS | PASS | PASS | PASS | PASS | PASS |
| rental | PASS | PASS | PASS | PASS | PASS | PASS |
| bridge | PASS | PASS | PASS | PASS | PASS | PASS |
| ground-up | PASS | PASS | PASS | PASS | PASS | PASS |
| multifamily | PASS | PASS | PASS | PASS | PASS | PASS |
| purchase-rehab | PASS | PASS | PASS | PASS | PASS | PASS |

Reduced-motion path: same suite re-run with `reducedMotion: reduce` — briefing open/close still PASS.

**Locked exits confirmed:** no Learn More / program-page / Submit escapes inside briefing panels.

## Proof renderer (browser)

| Check | Result |
|-------|--------|
| Mock transactions on Results | **8** |
| Nested duplicate cases (bug found then fixed) | **0** after fix |
| Mock testimonials | **4** |
| Draft `tx-draft-private-01` | **0** rendered |
| Mock badges visible (text + styling) | PASS |
| Program mounts (each of 6) | ≥1 matching case |
| Geo market mounts | PASS |
| Team bill mock + 4 quotes | PASS |
| Schema free of mock IDs | PASS |

## Defects

| # | Issue | Fix | Retest |
|---|--------|-----|--------|
| 1 | Results hub rendered nested program cards inside each case (20 DOM `.proof-case` nodes). Cause: case articles used `data-proof-program`, so `renderProgram` treated them as mounts. | Cases use `data-proof-case-program`; mounts selected with `[data-proof-program]:not([data-proof-id])`; double-init guard | PASS — 8 top-level, 0 nested |
| 2 | (Optional polish) Footer Markets column density on narrow widths | Shared footer grid CSS for tablet/mobile stacking | Visual capture on mobile footer |

**Found:** 1 real defect (+ polish)  
**Fixed:** 1  
**Deferred (not launch blockers):** formal multi-engine matrix; full WCAG audit; final CRM wiring honesty already documented

## Conversion changes

- Footer Markets column verified on mobile open/nav.
- CTA hierarchy: briefing dual-exit unchanged; Continue lands `#recr-homepage-story`.
- Shared min-height on buttons for tap targets.
- Proof mock wash toned slightly so it stays labeled without overpowering chrome.

No new CTAs added for empty space. Homepage briefing architecture locked.

## Accessibility / performance

| Check | Result |
|-------|--------|
| Keyboard Escape on briefings | PASS |
| Focus after open (H2) | PASS |
| Mobile menu toggle | PASS |
| Reduced motion briefing path | PASS |
| Site-code console errors (suite pages) | None recorded as hard failures |
| proof.json load | 200, non-blocking render |

## SEO / business guardrails

| Guardrail | Status |
|-----------|--------|
| Sitemap count | **45** |
| Six programs | Unchanged |
| Commercial/JV/Portfolio deferred | Still excluded from sitemap/nav |
| Geo ownership | Unchanged |
| Mock facts in schema/meta | None |
| Unverified 100%/70% claims | None introduced |
| Dev noindex,nofollow | Intact on launch pages |

## Structural crawl

All 45 sitemap URLs: HTTP OK, one H1, noindex, no `{{CLAIM:}}`, no scaffold phrases (suite assertion PASS).

## Screenshots (review paths)

| File | Content |
|------|---------|
| `qa/stage-08/screenshots/01-homepage-desktop-selector.png` | Homepage program selector |
| `qa/stage-08/screenshots/02-homepage-briefing-desktop-fix-and-flip.png` | Open Fix & Flip briefing |
| `qa/stage-08/screenshots/03-homepage-briefing-mobile-rental.png` | Open rental briefing (mobile) |
| `qa/stage-08/screenshots/04-results-desktop-mocks.png` | Results with mock badges |
| `qa/stage-08/screenshots/05-results-mobile-mocks.png` | Results mobile |
| `qa/stage-08/screenshots/06-team-proof-treatment.png` | Team Bill + mock quotes |
| `qa/stage-08/screenshots/06b-about-proof-treatment.png` | About Bill proof |
| `qa/stage-08/screenshots/07-cleveland-desktop.png` | Cleveland geo |
| `qa/stage-08/screenshots/07b-cleveland-mobile.png` | Cleveland mobile |
| `qa/stage-08/screenshots/08-mobile-footer.png` | Mobile footer / Markets |
| `qa/stage-08/screenshots/08-mobile-nav.png` | Mobile nav open |

## Re-run

```bash
cd ~/Me-Nexus/working/faber-capital-resources-gh
python3 serve.py   # port 8840
node qa/stage-08/run-browser-qa.mjs
```

## Stop

No commit, push, deploy, or noindex removal. Stage 08 complete after browser QA, fix, retest, and this report.
