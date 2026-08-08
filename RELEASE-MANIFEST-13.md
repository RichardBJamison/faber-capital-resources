# RELEASE-MANIFEST-13

**Date:** 2026-08-08  
**Stage:** 13 — Release Candidate (local only; no flip/deploy)  
**Canonical host (intended):** `https://realestatecapitalresources.com`  
**Baseline:** Stage 12 accepted — six programs, two geos, Deal Path guidance-only, conceptual program facts.

## Count explanation (truth over target)

| Item | Count | Why |
|------|------:|-----|
| Launch sitemap URLs (`sitemap.xml`) | **48** | Stage 10 base 47 + Stage 11 `/tools/deal-path/` |
| `/results/` in sitemap | **0** | Mock-only proof hub; not enough verified substance to index |
| Potential future total | **48 or 49** | 49 only if Results earns verified proof before launch |
| Deferred products in sitemap | **0** | commercial / JV / portfolio excluded |

Development HTML still carries `noindex,nofollow` on every public page. Sitemap membership describes *intended production indexables after flip*, not current crawl/index behavior.

## Column key

- **Index at launch?** — After production flip + gates; `yes` = intended bucket A; `conditional` = Results only with verified proof.
- **Proof dep** — What `data/proof.json` must supply for this surface.
- **Program-fact dep** — Numeric thresholds blocked without written sheets.
- **Launch blocker** — Residual Stage 13 external gates (shared: noindex, forms mock, GA4 placeholder, counsel).

## Homepage pages (1)

| Route | Intent / owner | Index | Canonical OK | Title/H1 unique | Schema | Conversion | Proof dep | Program facts |
|-------|----------------|-------|--------------|-----------------|--------|------------|-----------|---------------|
| `/` | generic investor financing + conversion | yes (after flip) | yes | OK | City, FinancialService, Organization, Po | briefings → program/submit + deal-pa | home strip (verified-only; empty OK) | n/a |

## Program pages (6)

| Route | Intent / owner | Index | Canonical OK | Title/H1 unique | Schema | Conversion | Proof dep | Program facts |
|-------|----------------|-------|--------------|-----------------|--------|------------|-----------|---------------|
| `/bridge/` | bridge | yes (after flip) | yes | OK | BreadcrumbList, ListItem, WebPage | /submit-a-deal/ + program CTA | verified txs only (empty OK) | conceptual only — no numeric |
| `/fix-and-flip/` | fix and flip | yes (after flip) | yes | OK | BreadcrumbList, ListItem, WebPage | /submit-a-deal/ + program CTA | verified txs only (empty OK) | conceptual only — no numeric |
| `/ground-up/` | ground up | yes (after flip) | yes | OK | BreadcrumbList, ListItem, WebPage | /submit-a-deal/ + program CTA | verified txs only (empty OK) | conceptual only — no numeric |
| `/multifamily/` | multifamily | yes (after flip) | yes | OK | BreadcrumbList, ListItem, WebPage | /submit-a-deal/ + program CTA | verified txs only (empty OK) | conceptual only — no numeric |
| `/purchase-rehab/` | purchase rehab | yes (after flip) | yes | OK | BreadcrumbList, ListItem, WebPage | /submit-a-deal/ + program CTA | verified txs only (empty OK) | conceptual only — no numeric |
| `/rental/` | rental | yes (after flip) | yes | OK | BreadcrumbList, ListItem, WebPage | /submit-a-deal/ + program CTA | verified txs only (empty OK) | conceptual only — no numeric |

## Catalog pages (1)

| Route | Intent / owner | Index | Canonical OK | Title/H1 unique | Schema | Conversion | Proof dep | Program facts |
|-------|----------------|-------|--------------|-----------------|--------|------------|-----------|---------------|
| `/loan-products/` | program map | yes (after flip) | yes | OK | BreadcrumbList, ListItem, WebPage | /contact/ or /submit-a-deal/ | none | n/a |

## Geography pages (2)

| Route | Intent / owner | Index | Canonical OK | Title/H1 unique | Schema | Conversion | Proof dep | Program facts |
|-------|----------------|-------|--------------|-----------------|--------|------------|-----------|---------------|
| `/cleveland-real-estate-investor-financing/` | market authority | yes (after flip) | yes | OK | BreadcrumbList, ListItem, WebPage | /contact/ or /submit-a-deal/ | verified txs only (empty OK) | n/a |
| `/south-florida-real-estate-investor-financing/` | market authority | yes (after flip) | yes | OK | BreadcrumbList, ListItem, WebPage | /contact/ or /submit-a-deal/ | verified txs only (empty OK) | n/a |

## Tool pages (10)

| Route | Intent / owner | Index | Canonical OK | Title/H1 unique | Schema | Conversion | Proof dep | Program facts |
|-------|----------------|-------|--------------|-----------------|--------|------------|-----------|---------------|
| `/tools/` | calculator or deal path | yes (after flip) | yes | OK | BreadcrumbList, ListItem, WebPage | related program + submit | none | no invented thresholds |
| `/tools/cap-rate/` | calculator or deal path | yes (after flip) | yes | OK | BreadcrumbList, ListItem, WebPage | related program + submit | none | no invented thresholds |
| `/tools/cash-flow/` | calculator or deal path | yes (after flip) | yes | OK | BreadcrumbList, ListItem, WebPage | related program + submit | none | no invented thresholds |
| `/tools/checklist/` | calculator or deal path | yes (after flip) | yes | OK | BreadcrumbList, ListItem, WebPage | related program + submit | none | no invented thresholds |
| `/tools/deal-analyzer/` | calculator or deal path | yes (after flip) | yes | OK | BreadcrumbList, ListItem, WebPage | related program + submit | none | no invented thresholds |
| `/tools/deal-path/` | calculator or deal path | yes (after flip) | yes | OK | BreadcrumbList, ListItem, WebPage | self | none | no invented thresholds |
| `/tools/dscr/` | calculator or deal path | yes (after flip) | yes | OK | BreadcrumbList, ListItem, WebPage | related program + submit | none | no invented thresholds |
| `/tools/mao/` | calculator or deal path | yes (after flip) | yes | OK | BreadcrumbList, ListItem, WebPage | related program + submit | none | no invented thresholds |
| `/tools/proof-of-funds/` | calculator or deal path | yes (after flip) | yes | OK | BreadcrumbList, ListItem, WebPage | related program + submit | none | no invented thresholds |
| `/tools/rehab-budget/` | calculator or deal path | yes (after flip) | yes | OK | BreadcrumbList, ListItem, WebPage | related program + submit | none | no invented thresholds |

## Resource pages (14)

| Route | Intent / owner | Index | Canonical OK | Title/H1 unique | Schema | Conversion | Proof dep | Program facts |
|-------|----------------|-------|--------------|-----------------|--------|------------|-----------|---------------|
| `/resources/` | education / Stage 09 decision | yes (after flip) | yes | OK | BreadcrumbList, ListItem, WebPage | program + deal-path/submit | none | n/a |
| `/resources/bridge-exit-risk/` | education / Stage 09 decision | yes (after flip) | yes | OK | BreadcrumbList, ListItem, WebPage | program + deal-path/submit | none | n/a |
| `/resources/bridge-to-dscr/` | education / Stage 09 decision | yes (after flip) | yes | OK | BreadcrumbList, ListItem | program + deal-path/submit | none | n/a |
| `/resources/commercial-docs/` | education / Stage 09 decision | yes (after flip) | yes | OK | BreadcrumbList, ListItem, WebPage | program + deal-path/submit | none | n/a |
| `/resources/construction-budget/` | education / Stage 09 decision | yes (after flip) | yes | OK | BreadcrumbList, ListItem, WebPage | program + deal-path/submit | none | n/a |
| `/resources/debt-vs-jv/` | education / Stage 09 decision | yes (after flip) | yes | OK | BreadcrumbList, ListItem, WebPage | program + deal-path/submit | none | n/a |
| `/resources/dscr-explained/` | education / Stage 09 decision | yes (after flip) | yes | OK | BreadcrumbList, ListItem, WebPage | program + deal-path/submit | none | n/a |
| `/resources/fix-and-flip-vs-purchase-rehab/` | education / Stage 09 decision | yes (after flip) | yes | OK | BreadcrumbList, ListItem | program + deal-path/submit | none | n/a |
| `/resources/preparing-a-deal-submission/` | education / Stage 09 decision | yes (after flip) | yes | OK | BreadcrumbList, ListItem, WebPage | program + deal-path/submit | none | n/a |
| `/resources/proof-of-funds/` | education / Stage 09 decision | yes (after flip) | yes | OK | BreadcrumbList, ListItem, WebPage | program + deal-path/submit | none | n/a |
| `/resources/rehab-draws/` | education / Stage 09 decision | yes (after flip) | yes | OK | BreadcrumbList, ListItem, WebPage | program + deal-path/submit | none | n/a |
| `/resources/understanding-arv/` | education / Stage 09 decision | yes (after flip) | yes | OK | BreadcrumbList, ListItem, WebPage | program + deal-path/submit | none | n/a |
| `/resources/which-financing-path/` | education / Stage 09 decision | yes (after flip) | yes | OK | BreadcrumbList, ListItem | program + deal-path/submit | none | n/a |
| `/resources/why-deals-delay/` | education / Stage 09 decision | yes (after flip) | yes | OK | BreadcrumbList, ListItem, WebPage | program + deal-path/submit | none | n/a |

## Company pages (8)

| Route | Intent / owner | Index | Canonical OK | Title/H1 unique | Schema | Conversion | Proof dep | Program facts |
|-------|----------------|-------|--------------|-----------------|--------|------------|-----------|---------------|
| `/about/` | authority / process | yes (after flip) | yes | OK | AboutPage, BreadcrumbList, ListItem | /contact/ or /submit-a-deal/ | bill.verified only (no mock timeline def | n/a |
| `/experienced/` | authority / process | yes (after flip) | yes | OK | BreadcrumbList, ListItem, WebPage | /contact/ or /submit-a-deal/ | none | n/a |
| `/faq/` | authority / process | yes (after flip) | yes | OK | Answer, BreadcrumbList, FAQPage, ListIte | /contact/ or /submit-a-deal/ | none | n/a |
| `/first-time/` | authority / process | yes (after flip) | yes | OK | BreadcrumbList, ListItem, WebPage | /contact/ or /submit-a-deal/ | none | n/a |
| `/how-it-works/` | authority / process | yes (after flip) | yes | OK | BreadcrumbList, ListItem, WebPage | /contact/ or /submit-a-deal/ | none | n/a |
| `/partners/` | authority / process | yes (after flip) | yes | OK | BreadcrumbList, ListItem, WebPage | /contact/ or /submit-a-deal/ | none | n/a |
| `/services/` | authority / process | yes (after flip) | yes | OK | BreadcrumbList, ListItem, WebPage | /contact/ or /submit-a-deal/ | none | n/a |
| `/team/` | authority / process | yes (after flip) | yes | OK | BreadcrumbList, ListItem, Person, Profil | /contact/ or /submit-a-deal/ | bill.verified only (no mock timeline def | n/a |

## Conversion pages (2)

| Route | Intent / owner | Index | Canonical OK | Title/H1 unique | Schema | Conversion | Proof dep | Program facts |
|-------|----------------|-------|--------------|-----------------|--------|------------|-----------|---------------|
| `/contact/` | hand-raise | yes (after flip) | yes | OK | BreadcrumbList, ListItem, WebPage | self | none | n/a |
| `/submit-a-deal/` | hand-raise | yes (after flip) | yes | OK | BreadcrumbList, ListItem, WebPage | self | none | n/a |

## Legal pages (4)

| Route | Intent / owner | Index | Canonical OK | Title/H1 unique | Schema | Conversion | Proof dep | Program facts |
|-------|----------------|-------|--------------|-----------------|--------|------------|-----------|---------------|
| `/accessibility/` | compliance | yes (after flip) | yes | OK | BreadcrumbList, ListItem, WebPage | /contact/ or /submit-a-deal/ | none | n/a |
| `/disclosures/` | compliance | yes (after flip) | yes | OK | BreadcrumbList, ListItem, WebPage | /contact/ or /submit-a-deal/ | none | n/a |
| `/privacy/` | compliance | yes (after flip) | yes | OK | BreadcrumbList, ListItem, WebPage | /contact/ or /submit-a-deal/ | none | n/a |
| `/terms/` | compliance | yes (after flip) | yes | OK | BreadcrumbList, ListItem, WebPage | /contact/ or /submit-a-deal/ | none | n/a |

## Conditional / off-sitemap

| Route | Intent | Index | Proof dep | Blocker |
|-------|--------|-------|-----------|---------|
| `/results/` | Recently Closed / proof hub | conditional — NO while mock-only | 8 mock txs + 4 mock tms with include-mock | zero verified txs — excluded from sitemap |

## Deferred product routes (not launch)

| Route | Status |
|-------|--------|
| `/commercial/` | Deferred — noindex, off sitemap, robots Disallow |
| `/joint-venture/` | Deferred — noindex, off sitemap, robots Disallow |
| `/portfolio/` | Deferred — noindex, off sitemap, robots Disallow |

## Internal / never index

`/nexus/`, `/brokerage/`, `/resonant-design-offer/`, `/lab/`, `/deal-desk/`, `/legacy-fcr/`, `/qa/`

## SEO audit snapshot (Stage 13)

- Unique title / description / H1 across all 48 sitemap URLs: **PASS** (`qa/stage-13/seo-audit.json`)
- Canonicals point at production host path: **PASS**
- Dev noindex present on all 48: **PASS**
- Scaffold / `{{CLAIM:}}` residue on launch pages: **0**
- Broken absolute internal links among launch set: **0**
- Orphan launch pages (no inbound `/…` links from peers): **0**

## Primary conversion map

```
Education (programs / geos / resources / tools)
  → Deal Path (optional readiness)
  → Submit a Deal  OR  Contact
```

Visitors who already know their path may skip Deal Path. Direct Submit/Contact remain first-class.

## Shared launch blockers (all routes)

1. Production indexing flip not authorized (noindex intentional).
2. Forms are local mock only — production destination undecided in website stage.
3. GA4 ID is placeholder `G-XXXXXXXXXX`.
4. Counsel review of disclosures/role language still open.
5. No verified transactions/testimonials — Results stays excluded (does not block other 48 if copy does not promise live cases).

