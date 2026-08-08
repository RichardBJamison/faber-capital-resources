# PRODUCTION-RUNBOOK-13

**Short launch runbook.** Stage 13 **does not execute** Launch or Rollback — plans only.

---

## Preflight — reversible / local (do before any deploy)

- [ ] Read `LAUNCH-INPUT-TRIAGE-13.md` — all **launch-critical** items accepted or waived in writing  
- [ ] Proof gate: launch surfaces show **0** mock markers; Results policy decided (exclude vs verified)  
- [ ] Claims: no new unsupported numbers/credentials since Stage 12  
- [ ] Counsel/disclosures accepted if required  
- [ ] Form destination decided (endpoint tested **or** phone/email-only copy)  
- [ ] Analytics decision (real GA4 ID authorized **or** leave inert)  
- [ ] `RELEASE-MANIFEST-13.md` matches `sitemap.xml` count  
- [ ] `python3 qa/stage-13/validate-rc.py` → **RC PASS**; note PRODUCTION status  
- [ ] `node qa/stage-13/browser-qa.mjs` → green  
- [ ] `node qa/stage-11/deal-path-scenarios.mjs` → green  
- [ ] Richard: “preflight green — authorize deploy”

---

## Launch — NOT AUTHORIZED IN STAGE 13

Execute only after explicit authorization. Order:

1. **Deploy** site artifact to production host (hosting method as owned by Richard).  
2. **Verify** primary host HTTPS, www rule, sample status codes (see DOMAIN plan).  
3. **Forms:** if endpoint configured, test one **fictional** submission; if phone/email-only, confirm form does not fake CRM success.  
4. **Analytics:** inject real ID only if authorized; confirm network to GA only then.  
5. **Indexing flip** per `INDEXING-FLIP-PLAN-13.md` — bucket A only; keep deferred/internal noindex.  
6. **Sitemap:** confirm production `sitemap.xml`; add Results only if proof gate earned.  
7. **Search Console / Bing:** submit sitemap **only after** flip + smoke green.  
8. **Do not** change WAF/crawler policy unless separately authorized.

---

## Post-launch verification

| Check | Pass criteria |
|-------|----------------|
| Host/canonical | Apex HTTPS; canonicals match live host |
| Status/redirects | 200 on key paths; www/HTTP single-hop |
| robots | Disallow deferred/internal; Results per decision |
| Indexability | Bucket A no longer noindex; B/C still noindex |
| Sitemap | Count = manifest; no deferred; Results policy correct |
| Schema | Parses; no mock IDs |
| Forms | Destination works or honest non-CRM UX |
| Analytics | Only if enabled — correct ID |
| Console | No hard errors on key paths |
| Desktop/mobile | Home, briefings, Deal Path, Submit, Contact, 2 programs, geos |
| Mock zero | No mock labels on indexable URLs |

---

## Rollback (plan only)

| Failure | Action |
|---------|--------|
| Wrong host/canonical | Fix DNS/redirects; restore correct canonicals; redeploy |
| Forms wrong/transmit bad | Disable endpoint; phone/email fallback; purge bad leads if any |
| Mock/unverified public | Re-noindex affected URLs; fix proof data; redeploy |
| Premature indexability | Restore noindex sitewide; redeploy; pause Search Console |
| Layout/runtime break | Redeploy last known-good build; keep noindex until re-QA |

---

## One-line success

Production serves the same release-candidate content Richard signed off on, with gates that were still open either closed with evidence or explicitly deferred without lying to users.
