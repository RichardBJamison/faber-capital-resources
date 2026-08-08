# RECR Indexing Manifest (Stage 10 + Stage 11)

**Truth over target count.** Stage 09 ended at 48 sitemap URLs including `/results/`.  
`/results/` is **mock-only** proof → **removed from launch sitemap** → 47 after Stage 10.  
Stage 11 adds **`/tools/deal-path/`** (Deal Path Guide) as a justified launch tool.  
**Launch sitemap count after Stage 11: 48.**  
**Stage 12:** still **48** — `/results/` remains excluded (no verified transactions yet).

Development HTML remains `noindex,nofollow` until production flip. This file defines **intended production** buckets.

---

## A. Launch indexable (intended 48)

All current `sitemap.xml` URLs (48), including:

- `/` homepage  
- Six programs + `/loan-products/`  
- Two geos (Cleveland, South Florida)  
- Three Stage 09 decision guides  
- Tools + resources hub and children currently in sitemap  
- **`/tools/deal-path/`** — Deal Path Guide (Stage 11 conversion / readiness tool; not underwriting)  
- About, Team, How it works, First-time, Experienced, Partners, Services, FAQ, Contact, Submit a Deal  
- Legal: disclosures, privacy, terms, accessibility  

Full list = `sitemap.xml` locs.

## B. Deferred product — remain excluded

| Route | Reason |
|-------|--------|
| `/commercial/` | Not a launch product |
| `/joint-venture/` | Not a launch product |
| `/portfolio/` | Unresolved / not launch |

Also Disallow in robots.txt.

## C. Internal / private / dev — never search-indexed

| Surface | Notes |
|---------|--------|
| `/nexus/` | Internal |
| `/brokerage/` | Internal |
| `/resonant-design-offer/` | Internal |
| `/lab/` | Lab |
| `/deal-desk/` | App surface |
| `/legacy-fcr/` | Legacy |
| `/qa/` | QA artifacts |
| `qa/stage-*` files | Not routes for users |

## D. Conditional proof

| Route | Rule |
|-------|------|
| `/results/` | **Not launch-indexable** while only mock/demo proof exists. Keep `noindex`; off sitemap; robots Disallow. When **verified** transactions replace mocks and mock markers are zero, re-add to sitemap and allow index with the production flip. |

---

## Production flip prerequisites (do not execute in Stage 10)

1. `qa/stage-10/validate-launch.py` exits 0  
2. Zero `data-proof-status="mock"` / “MOCK — DEMONSTRATION CONTENT” on indexable pages  
3. Zero draft/private proof render  
4. sitemap matches this manifest  
5. Canonical host = `https://realestatecapitalresources.com`  
6. Replace meta `noindex,nofollow` → production robots policy **only** for bucket A  
7. Buckets B–D stay non-indexable  
8. No Search Console / Bing submission until gates pass  
