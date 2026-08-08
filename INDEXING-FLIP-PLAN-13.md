# INDEXING-FLIP-PLAN-13

**Status:** Plan only. **Do not execute in Stage 13.**  
**Purpose:** Separate robots/crawl policy, meta indexability, sitemap membership, and AI crawler policies.

---

## 1. Current development behavior

| Control | Current state |
|---------|----------------|
| Meta robots on public HTML | `noindex,nofollow` on essentially all public pages |
| `robots.txt` | Allows default crawlers to paths that will be public; **Disallow** deferred products, internal, and `/results/` |
| `sitemap.xml` | **48** intended launch URLs; **no** `/results/` |
| OAI-SearchBot / GPTBot etc. | Policy defined in `robots.txt` (see file for per-agent blocks) |
| Proof render | Launch mounts verified-only; Results may show labeled mocks with `data-proof-include-mock` |
| Forms | Local mock; no lead transmission |
| GA4 | Placeholder ID |

**Important:** `robots.txt` Allow does **not** override meta `noindex`. Search engines that honor meta robots should still not index pages while noindex is present.

---

## 2. Intended production behavior (after gates)

| Control | Intended production |
|---------|---------------------|
| Meta robots — **bucket A** (48 sitemap URLs) | Remove `noindex,nofollow`; use indexable policy (e.g. omit robots meta or `index,follow` per counsel preference) |
| Meta robots — **bucket B/C** deferred & internal | Keep `noindex` (and robots Disallow) |
| Meta robots — **`/results/`** | **If still mock-only:** keep noindex + off sitemap + Disallow. **If verified proof earns it:** allow index with the flip and add to sitemap (→ 49) |
| `robots.txt` | Keep Disallow list for deferred/internal; update Results Disallow only if Results becomes verified indexable |
| `sitemap.xml` | Match release manifest (48 or 49) on production host only |
| Search Console / Bing | Submit sitemap **only after** flip + smoke green |
| AI crawlers | Leave intentional GPTBot/training policy unless Richard changes it; OAI-SearchBot remains separately considered |

---

## 3. Exact files / directives that would change at launch

| File / surface | Change |
|----------------|--------|
| Every **bucket A** `index.html` (and any non-index public HTML in A) | Replace `<meta name="robots" content="noindex,nofollow">` with production policy |
| `sitemap.xml` | Confirm host + membership; add `/results/` **only** if verified proof gate passes |
| `robots.txt` | Optional: remove `Disallow: /results/` only if Results is launch-indexable; never remove Disallow for deferred/internal without decision |
| `INDEXING-MANIFEST.md` | Update “current production” note after flip |
| `llms.txt` | Confirm no mock/forbidden claims; Results language still conditional if excluded |
| GA4 snippet | Replace `G-XXXXXXXXXX` **only if** real ID authorized |
| Form handlers | Point to production destination **only if** form destination gate passes (ops) |

**Not changed by indexing flip alone:** Cloudflare/WAF, DNS, GHL credentials.

---

## 4. Preconditions before any flip

1. `python3 qa/stage-13/validate-rc.py` reports **PRODUCTION READY** (or human accepts listed residual risks in writing).  
2. Zero mock markers on **intended indexable** pages (rendered DOM).  
3. Zero draft/private proof rendered.  
4. Claim audit still clean (no reintroduced 100%/JV/numeric invention).  
5. Counsel/required disclosures accepted for launch.  
6. Form destination decided and tested on production (or explicit phone/email-only launch).  
7. Analytics decision recorded (on with real ID / off).  
8. Canonical host resolves correctly over HTTPS.  
9. Full browser smoke + validator preflight green.  
10. Richard explicit authorization to flip.

---

## 5. Verification immediately after flip

```bash
# Production host checks (examples — run against live host, not local mockup)
curl -sI https://realestatecapitalresources.com/ | head
curl -s https://realestatecapitalresources.com/ | grep -i 'name="robots"'
curl -s https://realestatecapitalresources.com/sitemap.xml | grep -c '<loc>'
curl -s https://realestatecapitalresources.com/robots.txt | head -40
# Spot: home, 3 programs, deal-path, submit, about, team, both geos
# Confirm no "MOCK — DEMONSTRATION CONTENT" on indexable URLs
# Confirm /results/ policy matches decision
```

Browser: homepage, six briefings, Deal Path, Submit, Contact, two programs, mobile nav.

---

## 6. Rollback if production is wrong

| Symptom | Rollback |
|---------|----------|
| Pages indexing too early / wrong host | Restore `noindex,nofollow` on all public HTML; redeploy; request removal if needed |
| Mock/unverified proof live on indexable URL | Restore verified-only or empty state; re-add noindex to that URL; remove from sitemap |
| Forms transmit incorrectly | Disable form action / revert to mock-local or phone-only CTA; fix endpoint offline |
| Wrong canonical/www | Fix redirects + canonical tags; redeploy; avoid chain |
| Layout/runtime failure | Redeploy previous known-good artifact; keep noindex until re-verified |

Rollback does **not** require Search Console “URL deletion” as first step — fix source of truth first.

---

## 7. Distinctions (do not collapse)

| Mechanism | Job |
|-----------|-----|
| `robots.txt` | Crawl *permission* hints |
| Meta `noindex` | Index *eligibility* for that URL |
| Sitemap | *Hint* of preferred indexable URLs |
| OAI-SearchBot / GPTBot rules | AI crawler access / training policy — independent of Google index flip |
| WAF/Cloudflare bot fights | **Out of scope** for Stage 13; do not change here |
