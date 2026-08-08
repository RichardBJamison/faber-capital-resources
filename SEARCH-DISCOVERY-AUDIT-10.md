# SEARCH-DISCOVERY-AUDIT-10

**Date:** 2026-08-08  
**Scope:** 48 Stage-09 sitemap URLs + deferred product routes + internal surfaces inventory.

## Before (systemic patterns)

| Pattern | Finding |
|---------|---------|
| Canonical / OG URL | Present on all launch pages sampled |
| robots meta | Universal `noindex,nofollow` (dev gate) |
| JSON-LD coverage | Only ~9 pages had schema; most program/tool/resource pages had none |
| @id consistency | About nested full Organization without `@id`; Team Person lacked stable `@id` |
| Breadcrumb schema | Rare (geo + a few decision guides) |
| Breadcrumb nav HTML | Most interior pages |
| Sitemap | 48 including `/results/` (mock-only proof) |
| robots.txt | Allow public; Disallow deferred + internal; GPTBot allow; **no OAI-SearchBot explicit rule** |
| llms.txt | Present; listed six programs; **included street address**; no Stage 09 decision guides; no Results conditional |
| Mock in head/meta/schema | 0 static |
| Weak inbound | `/services/` (0), `/accessibility/` (1), `/resources/proof-of-funds/` (1) |
| Links to deferred **products** from launch | None (commercial-docs is educational resource, not product) |
| Primary content vs JS | Program/decision copy is HTML; proof cases inject via JS (expected) |

## After Stage 10

| Change | Result |
|--------|--------|
| Sitemap | **47** — `/results/` removed (mock-only conditional) |
| Entity @ids | Organization / WebSite / FinancialService / Person stabilized (see ENTITY-MAP.md) |
| WebPage + BreadcrumbList | Injected across launch interiors missing BreadcrumbList |
| About / Team schema | Reference Organization/Person by `@id` |
| robots.txt | Documented search + OAI-SearchBot + GPTBot policy; Disallow deferred, internal, qa, results |
| llms.txt | Six programs, two markets, three decision guides; no street address; Results conditional; no mock claims |
| Weak inbound | About → Services; footer → Accessibility; prep → proof-of-funds |
| INDEXING-MANIFEST.md | Buckets A–D |
| validate-launch.py | Local gate reporter |

## Intentional non-actions

- No new editorial routes  
- No LocalBusiness  
- No Product/Offer schema for unpriced financing  
- No noindex flip  
- No Search Console submission  
- Mock proof remains in runtime UI only (labeled)  

## Results conditional (truth over 48)

Stage 09 sitemap included `/results/`. Stage 07 rule: mock-only proof must not launch-index.  
**Sitemap after Stage 10 = 47.** Re-add Results only when verified transactions replace mocks.
