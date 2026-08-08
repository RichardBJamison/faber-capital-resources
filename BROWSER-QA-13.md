# BROWSER-QA-13

**Date:** 2026-08-08  
**Runner:** `node qa/stage-13/browser-qa.mjs`  
**Result:** **PASS 75 / FAIL 0** (`qa/stage-13/results.json`)  
**Also:** Stage 11 Deal Path **PASS 60 / FAIL 0**

## Viewports

1440×900 · 1280×800 · 768×1024 · 390×844 · 360×800 (Deal Path overflow matrix)

## Surfaces

| Surface | Result |
|---------|--------|
| Homepage + six program links + funding region | PASS |
| Mobile nav toggle + overflow | PASS |
| loan-products, about, team, FAQ | PASS (200, noindex, zero mock) |
| Contact, Submit a Deal (mock form, no CRM) | PASS |
| Deal Path + critical guide paths (flip, OOS OO, OOS 5+, unknown) | PASS |
| DSCR tool + which-financing-path | PASS |
| Both geographies | PASS |
| All six program pages claims/mock | PASS |
| Results (off-sitemap design mocks labeled) | PASS |
| Footer links | PASS |

## Defects

None new in Stage 13 RC pass. Prior Stage 12 overflow/claim fixes held.

## Note

Stage 10 `validate-launch.py` still exits 1 on proof **mount presence** (historical flip gate). Stage 13 `validate-rc.py` correctly separates **RC PASS** (verified-only mounts OK) from **PRODUCTION BLOCKED** (noindex, forms mock, GA4 placeholder, no verified txs for Results).
