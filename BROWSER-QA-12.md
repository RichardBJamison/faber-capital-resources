# BROWSER-QA-12

**Date:** 2026-08-08  
**Runner:** `node qa/stage-12/browser-qa.mjs`  
**Result:** **PASS 40 / FAIL 0** (`qa/stage-12/results.json`)  
**Also:** Stage 11 Deal Path suite **PASS 60 / FAIL 0** after readiness-copy assertion fix.

## Surfaces exercised

| Surface | Viewport(s) | Checks |
|---------|-------------|--------|
| Homepage | 1440 | zero mock markers; program links; overflow |
| Team / About | 1440 | Bill name; broker framing; zero mock; no invented numeric credentials |
| Results | 1440 | labeled mocks only (`include-mock`); draft not rendered |
| Six programs | 1440 | zero mock; no residual JV-100 claim |
| Cleveland / South Florida | 390 | zero mock; no overflow |
| Deal Path | 390 reduced-motion | OOS owner-occupied + 5+; no overflow; noindex |
| Submit / Contact | 1440 | noindex; zero CRM network calls |
| Keyboard | 1440 | Deal Path radio focus |
| Sitemap | file | 48 locs; no `/results/` |

## Defects found / fixed

1. **South Florida mobile overflow (~12px)** — lateral `.reveal-left` / `.reveal-right` transforms before `.is-in`. Fixed with `overflow-x: clip` on html/body + mobile reveal uses vertical translate only.  
2. **Stage 11 scenario 04b false fail** — forbidden-language regex matched educational “automatic product conversion” negation. Tightened assertion.

## Deferred

- Full Stage 08 matrix re-run not duplicated; Stage 12 targeted post-substitution surfaces.  
- Results remains mock-only design hub (intentional; off sitemap).
