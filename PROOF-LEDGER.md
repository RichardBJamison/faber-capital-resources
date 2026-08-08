# RECR Proof Ledger

Maintainer-only provenance control. **Not linked publicly. Not in sitemap.**  
**Updated:** 2026-08-08 — Stage 12

| Proof ID | Type | Status | Source | Permission | Appears on (components) | Last checked |
|----------|------|--------|--------|------------|-------------------------|--------------|
| bill.verified.role | Biography | verified | Existing RECR + interview role | Public | Team/About verified block; Person schema (name/role/org/contact only) | 2026-08-08 |
| bill.verified.markets | Biography | verified | Existing RECR markets + interview | Public | Team/About | 2026-08-08 |
| bill.verified.contact | Biography | verified | Existing RECR phone/email | Public | Team/About | 2026-08-08 |
| bill.verified.approach | Biography | verified | Interview + handoffs 00–11 | Public | Team/About | 2026-08-08 |
| bill.verified.focus | Biography | verified | Interview 1–4 / non-OO | Public | Team/About narrative | 2026-08-08 |
| bill.verified.method | Biography | verified | Interview Style Sheet / file method | Public | Team/About narrative | 2026-08-08 |
| bill.verified.productFocus | Biography | verified | Interview products + H04 launch six | Public | Team/About | 2026-08-08 |
| bill.verified.exclusions | Biography | verified | Interview commercial/OO/mobile; JV not launch | Public | Team/About | 2026-08-08 |
| bill.verified.narrative | Biography | verified | Stage 12 synthesis of interview (non-numeric) | Public | Team/About | 2026-08-08 |
| bill.mock.timeline | Biography | **MOCK / NOT EVIDENCE** | Design fixture | N/A mock | Only if `data-proof-include-mock` | 2026-08-08 |
| bill.mock.specialties | Biography | **MOCK / NOT EVIDENCE** | Design fixture | N/A mock | Only if include-mock | 2026-08-08 |
| bill.mock.credentials | Biography | **MOCK / NOT EVIDENCE** | Design fixture | N/A mock | Only if include-mock | 2026-08-08 |
| tx-mock-ff-01 | Transaction | **MOCK / NOT EVIDENCE** | Design fixture | N/A mock | Results hub only (include-mock) | 2026-08-08 |
| tx-mock-ff-02 | Transaction | **MOCK / NOT EVIDENCE** | Design fixture | N/A mock | Results hub only | 2026-08-08 |
| tx-mock-dscr-01 | Transaction | **MOCK / NOT EVIDENCE** | Design fixture | N/A mock | Results hub only | 2026-08-08 |
| tx-mock-dscr-02 | Transaction | **MOCK / NOT EVIDENCE** | Design fixture | N/A mock | Results hub only | 2026-08-08 |
| tx-mock-br-01 | Transaction | **MOCK / NOT EVIDENCE** | Design fixture | N/A mock | Results hub only | 2026-08-08 |
| tx-mock-gu-01 | Transaction | **MOCK / NOT EVIDENCE** | Design fixture | N/A mock | Results hub only | 2026-08-08 |
| tx-mock-mf-01 | Transaction | **MOCK / NOT EVIDENCE** | Design fixture | N/A mock | Results hub only | 2026-08-08 |
| tx-mock-pr-01 | Transaction | **MOCK / NOT EVIDENCE** | Design fixture | N/A mock | Results hub only | 2026-08-08 |
| tx-draft-private-01 | Transaction | draft | Internal test | Private | **Must never render** | 2026-08-08 |
| tm-mock-01 | Testimonial | **MOCK / NOT EVIDENCE** | Design fixture | mock-only | Results hub only (include-mock) | 2026-08-08 |
| tm-mock-02 | Testimonial | **MOCK / NOT EVIDENCE** | Design fixture | mock-only | Results hub only | 2026-08-08 |
| tm-mock-03 | Testimonial | **MOCK / NOT EVIDENCE** | Design fixture | mock-only | Results hub only | 2026-08-08 |
| tm-mock-04 | Testimonial | **MOCK / NOT EVIDENCE** | Design fixture | mock-only | Results hub only | 2026-08-08 |

## Stage 12 disposition summary

| Class | Count | Notes |
|-------|------:|-------|
| Verified Bill fields | 9 | Non-numeric; no years/licenses/volume |
| Verified transactions | **0** | None supplied |
| Mock transactions | 8 | Design; Results-only render |
| Draft transactions | 1 | Never renders |
| Verified testimonials | **0** | None supplied |
| Mock testimonials | 4 | Design; Results-only |

## Provenance rule

If a claim is not in this ledger with `verified` status and a real source, it must not appear unlabeled in public HTML or schema.

Launch surfaces default to **verified-only** rendering (`assets/js/proof.js`). Results may set `data-proof-include-mock="1"` while remaining **off the launch sitemap**.
