# RECR Entity Map (Stage 10)

Stable identifiers for structured data and machine files. **Do not invent new @id patterns.**

| Entity | @id | Authoritative page | Notes |
|--------|-----|--------------------|-------|
| Organization | `https://realestatecapitalresources.com/#organization` | `/` (homepage JSON-LD) | Real Estate Capital Resources; alternateName RECR, Faber Capital Resources |
| WebSite | `https://realestatecapitalresources.com/#website` | `/` | publisher → Organization |
| FinancialService (guidance) | `https://realestatecapitalresources.com/#service` | `/` | serviceType = capital-path guidance; **not** Product/Offer |
| Person (Bill) | `https://realestatecapitalresources.com/#william-m-faber` | `/team/` | Verified facts only; worksFor → Organization |
| WebPage (home) | `https://realestatecapitalresources.com/#webpage` | `/` | |
| WebPage (about) | `https://realestatecapitalresources.com/about/#webpage` | `/about/` | AboutPage |
| WebPage (team) | `https://realestatecapitalresources.com/team/#webpage` | `/team/` | ProfilePage |

## Verified Person properties (allowed in JSON-LD)

- name: William M. Faber  
- jobTitle: Business authority for Faber Capital Resources / RECR program direction and investor capital-path conversations  
- worksFor: Organization @id  
- telephone / email (already public)  
- url: `/team/`  

**Forbidden in Person JSON-LD until verified:** tenure, licenses, education, awards, sameAs profiles, mock specialties/timeline, transaction claims.

## Organization properties (homepage)

- name, alternateName, url, telephone, email  
- description: broker/connector capital-path guidance (not direct funder)  
- areaServed: Cleveland, OH; Fort Lauderdale / South Florida  
- address: Cleveland reference already used on public About copy (`1273 W 6th St…`) — **not** LocalBusiness; do not invent branches  
- logo: `/assets/img/logo.png`  

## Program / market / resource pages

Each launch interior page carries:

- `WebPage` + `BreadcrumbList` with stable `#webpage` / `#breadcrumb` where injected  
- `isPartOf` → WebSite  
- `about` → Organization  

No Product/Offer markup without concrete publishable terms.

## Mock proof wall

`data/proof.json` mock/draft records **never** enter Organization, Person, WebPage descriptions, llms.txt, or meta.
