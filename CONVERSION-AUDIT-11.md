# CONVERSION-AUDIT-11

**Date:** 2026-08-08  
**Stage:** Deal Path + Conversion Intelligence

## Before

| Surface | Behavior | Gap |
|---------|----------|-----|
| `/submit-a-deal/` | Full mock form (`data-mock-form`); local confirm only; strategy select includes Commercial/Portfolio (deferred products) | No guided path logic before form; user must already know product labels |
| `/contact/` | Mock short form; points to Submit a Deal | Fine for generic contact |
| `/tools/*` | Calculators (DSCR, MAO, cash flow, rehab budget, checklist, deal analyzer) | No “which conversation” wizard |
| Program pages | Educational + Submit CTA | No intermediate readiness tool |
| Stage 09 decision guides | Path choice education | Static; not interactive deal snapshot |
| Homepage briefings | Educational conversion to homepage story | Locked; not a deal wizard |
| CRM | Not wired; honest mock notes | Payload not standardized for GHL |

## Decision

**New route justified:** `/tools/deal-path/`

- Unique purpose: progressive deal readiness + conversation-path guidance  
- Does not replace Submit a Deal (contact + numbers still there)  
- Does not replace calculators (links out to DSCR/MAO/etc.)  
- Earns sitemap membership as a launch tool  

**Also:** light cleanup of submit-a-deal strategy options (remove deferred Commercial/Portfolio as recommended paths).

## After

| Item | Status |
|------|--------|
| Deal Path tool | `/tools/deal-path/` |
| Data contract | `DEAL-PATH-DATA-CONTRACT.md` (`recr.deal_path.v1`) |
| Scenario QA | `qa/stage-11/deal-path-scenarios.mjs` — **60/60 PASS** |
| Launch sitemap | **48** (47 + deal-path; Results still excluded) |
| Completion report | `STAGE-11-COMPLETION.md` |
