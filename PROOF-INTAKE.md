# RECR Proof Intake — Bill + Transactions + Testimonials

**Purpose:** Live conversation checklist for Richard + Bill.  
**Architecture:** `data/proof.json` is the single public-render source. Status: `mock` | `verified` | `draft`.  
**Rule:** Do not re-ask facts already clear in Bill’s recorded interview. Reconcile interview first; use this form for gaps and publication approvals only.

---

## Section A — Bill biography (publishable)

Already on-site as **verified** (do not re-ask unless Bill wants different wording):

- Display name: **William M. Faber**
- Role: Business authority for Faber Capital Resources / RECR program direction and investor capital-path conversations
- Markets of focus: Cleveland, OH and Fort Lauderdale / South Florida
- Phone / email already published
- Role frame: capital-path guide / broker-connector (not automatic direct funder)

**Still needed for verified publication:**

| # | Item | Bill/Richard note | Approved for public? |
|---|------|-------------------|----------------------|
| A1 | Exact public title/role line Bill wants (if different from current) | | Y/N |
| A2 | Year began real-estate finance / lending / banking work + accurate description | | Y/N |
| A3 | Prior companies, roles, date ranges comfortable to publish | | Y/N |
| A4 | Education, licenses, certifications, affiliations (current + publishable) | | Y/N |
| A5 | Financing specialties Bill wants associated with his name | | Y/N |
| A6 | Cleveland / South Florida professional history that can be stated factually | | Y/N |
| A7 | Approved professional headshot (file + rights) | | Y/N |
| A8 | Legitimate public profiles for `sameAs` (LinkedIn, etc.) | | Y/N |

Mock timeline/credentials on Team/About are **design fixtures only** until A2–A8 are approved.

---

## Section B — Representative transactions (target 5–10 strong files)

For each deal Bill will allow on the site:

| Field | Deal 1 | Deal 2 | Deal 3 | … |
|-------|--------|--------|--------|---|
| Approx year | | | | |
| Property type | | | | |
| City/market publishable? | | | | |
| Investor goal / situation | | | | |
| Financing problem | | | | |
| Path/structure arranged | | | | |
| Launch program (one of six) | | | | |
| Constraint solved | | | | |
| Verified outcome | | | | |
| Amount OK to publish? | | | | |
| Timing OK to publish? | | | | |
| Anonymize borrower/address? | | | | |
| Source document | | | | |
| How to describe Bill/RECR role | | | | |

Launch programs only: Fix & Flip · Rental/DSCR · Bridge · Ground-Up · Small Multifamily 2–4 · Purchase & Rehab.

---

## Section C — Testimonials

| Field | T1 | T2 | T3 |
|-------|----|----|-----|
| Person name | | | |
| Relationship to Bill/RECR | | | |
| Company/title | | | |
| Exact quote or source material | | | |
| Permission to publish | | | |
| Name display preference | | | |
| Company/logo OK? | | | |
| Related program/market | | | |

Two excellent, attributable quotes beat ten generic ones. No star ratings.

---

## How to load verified proof later

1. Edit `data/proof.json`: set `status` to `verified`, replace mock copy with approved text.  
2. Remove or leave unused mock IDs (`status: mock`) — launch polish must clear all `data-proof-status="mock"` from rendered HTML.  
3. Update `PROOF-LEDGER.md` provenance.  
4. Re-run launch assertion: **zero mock markers** on launch pages before indexing.

