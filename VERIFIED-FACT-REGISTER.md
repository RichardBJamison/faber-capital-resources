# RECR Verified Fact Register — Stage 12

**Updated:** 2026-08-08  
**Rule:** Provenance before publication. Mock content is never evidence.  
**Primary first-party source this stage:** Bill Faber recorded interviews 2026-07-28 / 2026-07-29, extracted in `~/Me-Nexus/working/recr-agency-build/WORKFLOW-FROM-BILL.md` (transcripts in that project’s `transcripts/`).  
**Secondary:** Existing RECR publishable contact/role language reconfirmed in `data/proof.json` + prior handoffs; `PRODUCT-SCOPE-VERIFICATION.md`.

**Status keys:** `verified` | `needs confirmation` | `rejected-outdated` | `lender-specific-private`

---

## A. Bill / RECR identity

| ID | Fact / claim | Source | Date | Scope | Status | Safe for schema | Pages allowed |
|----|--------------|--------|------|-------|--------|-----------------|---------------|
| BF-01 | Display name **William M. Faber** | Existing public RECR materials + interview identity | known / ongoing | Bill | verified | Yes (Person.name) | Team, About, schema |
| BF-02 | Business authority for Faber Capital Resources / RECR program direction and investor capital-path conversations | Existing site + interview role | known | Bill/RECR | verified | Yes (jobTitle carefully) | Team, About, schema |
| BF-03 | Markets of focus: **Cleveland, OH** and **Fort Lauderdale / South Florida** | Existing site; interview local markets | known | RECR | verified | Markets as text, not LocalBusiness address | Team, About, geos, home |
| BF-04 | Phone **954-676-4205** | Existing published RECR contact | known | RECR | verified | Yes (telephone) | Contact, Team, About, schema |
| BF-05 | Email **fabercapitalresources@gmail.com** | Existing published RECR contact | known | RECR | verified | Yes (email) | Contact, Team, About, schema |
| BF-06 | RECR is a **broker / connector**, not automatically the direct funder | Interview: *“We're only the connector, which is the definition of a broker.”* `0729` | 2026-07-29 | RECR | verified | Organization description only; no license claim | Sitewide role language |
| BF-07 | Business-purpose / **non-owner-occupied** residential investment is the sweet spot | Interview `0728-b`, `0729` | 2026-07-28/29 | RECR | verified | No | About, programs, Deal Path OOS |
| BF-08 | Unit universe: **1–4 residential**; multi-family **up to four** | Interview `0728-b @ 44:09` | 2026-07-28 | RECR | verified | No | Multifamily, Deal Path, product scope |
| BF-09 | Commercial/office CRE is **not** the launch sweet spot | Interview: will not offer commercial such as office `0728-b` | 2026-07-28 | RECR | verified | No | Product deferral, About |
| BF-10 | Mobile homes excluded from fit | Interview `0728-b` | 2026-07-28 | RECR | verified | No | Internal; optional FAQ |
| BF-11 | LLC / entity borrower framing preferred for licensing posture (RECR not licensed to lend to a person) | Interview `0729` | 2026-07-29 | RECR | **needs confirmation** for public legal wording | **No** until counsel | Disclosures counsel track |
| BF-12 | Cogo (Kogo) is an anchor private-lender relationship; Bill described special master-broker status | Interview `0728-b`, `0729` | 2026-07-28/29 | Bill / lender | **needs confirmation** for public naming / title | **No** until Richard/Bill approve public lender naming | Internal register only unless approved |
| BF-13 | Career chronology, years in business, degrees, licenses, awards, headshot, sameAs profiles | Intake A2–A8 blank | — | Bill | **needs confirmation** | **No** | Not published |
| BF-14 | Funded volume / lifetime deal count | No approved record | — | Bill/RECR | **needs confirmation** | **No** | Not published |

### Interview-backed narrative (publishable as non-numeric)

| ID | Fact / claim | Source | Status | Schema |
|----|--------------|--------|--------|--------|
| BF-15 | RECR is “a reservoir of products that solve funding problems for real estate investors” (paraphrase OK) | `0728-b @ 13:30` | verified (voice) | No |
| BF-16 | Transaction-first method: property, plan, exit → match private-lender options | Interview workflow + prior handoffs | verified | No |
| BF-17 | Style Sheet / complete file packaging is central to how Bill works a deal | Interview `0729` | verified (process) | No |
| BF-18 | Hard-money / private-money vocabulary is appropriate market language when factually used; does not make RECR the hard-money lender | Interview + PS-07 | verified | No |

---

## B. Product universe (launch)

| ID | Fact / claim | Source | Status | Notes |
|----|--------------|--------|--------|-------|
| PU-01 | Launch programs: Fix & Flip, Rental/DSCR, Bridge, Ground-Up, Small Multifamily 2–4, Purchase & Rehab | Interview foundation products + H04 scope | verified | Site architecture |
| PU-02 | Commercial, Joint Venture, Portfolio/blanket **deferred** from launch marketing | Interview JV/equity weak; PS-01/05/08 | verified | Routes noindex, off sitemap |
| PU-03 | Ground-up supported as direction; not Cogo’s two-product concentration | Interview `0728-b` | verified | Non-numeric public pages |
| PU-04 | JV equity is case-by-case, not a standard initial offering; sources not secured as dependable launch product | Interview `0728-a`, `0728-b` | verified | Do not market as flagship differentiator |

---

## C. Numerical / leverage / speed (public marketing)

| ID | Fact / claim | Source | Status | Decision |
|----|--------------|--------|--------|----------|
| NM-01 | “100% financing for acquisition and rehab up to 75% LTV” via Cogo status | Bill oral `0728-b @ 06:07–06:52` | **needs confirmation** | **Not RECR-wide public claim** without current written Cogo/program sheet. Prior H04 + LAUNCH-CHECKLIST: do not reintroduce. |
| NM-02 | Site historical “100% on JV” framing | Legacy site / clone wording | **rejected-outdated** | Conflicts with Bill’s tape (not a JV claim). Remove residual public copy. |
| NM-03 | 70% ARV as RECR promise | Legacy | **rejected-outdated** | Educational calculator defaults only; not RECR promise |
| NM-04 | Cogo floor ~$75,000 (other lenders may go lower) | Bill oral `0728-a` | **lender-specific-private** | Not published as RECR minimum |
| NM-05 | DSCR floors, FICO floors, rates, points, fees, max loan | No written sheet in repo | **needs confirmation** | Confirmed per transaction only |
| NM-06 | Same-day closing advertising | Bill: same-day **closing** “definitely no” | verified (negative) | Do not advertise |
| NM-07 | Ordinary transaction timing ~14 days; 3–5 day possible under right circumstances | Bill oral `0728-a` | **needs confirmation** for marketing | Use “expected / varies”; no guarantees |
| NM-08 | “Guaranteed approved”, “pre-approval”, “pre-qualified” | Bill: banned / no | verified (prohibition) | Sitewide ban |

---

## D. Transactions & testimonials

| ID | Fact | Status |
|----|------|--------|
| TX-* | Any real RECR/Faber closed case for publication | **needs confirmation** — none supplied Stage 12 |
| TM-* | Any real borrower/partner quote with permission | **needs confirmation** — none supplied Stage 12 |
| tx-mock-*, tm-mock-* | Design fixtures | **rejected as evidence** — may remain in `proof.json` as `mock` for Results design only |

---

## E. Conflicts

| Conflict | Claims | Resolution for Stage 12 |
|----------|--------|-------------------------|
| 100% leverage framing | Oral Cogo 100%/75% LTV vs legacy site 100% JV vs H04 ban | **Do not publish numbers.** Register oral claim as needs confirmation + lender-specific. Remove residual JV-100% marketing. |
| Product breadth | FAQ/about still list commercial/JV/portfolio as offered | Align public copy to **six** launch programs; deferred products stay deferred. |

---

## F. Contact / org (non-proof)

| ID | Fact | Status | Schema |
|----|------|--------|--------|
| ORG-01 | Public brand: Real Estate Capital Resources (RECR); also known as Faber Capital Resources | verified | Organization name / alternateName |
| ORG-02 | Street office address for LocalBusiness | unresolved | **No** LocalBusiness street schema |
| ORG-03 | GA4 measurement ID | placeholder G-XXXXXXXXXX | Not public claim |
| ORG-04 | Production CRM endpoint | not wired | Dev mock forms only |
