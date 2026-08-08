# DOMAIN-AND-REDIRECT-PLAN-13

**Stage 13:** Documentation only. **No DNS, Cloudflare, hosting, or redirect changes.**

---

## 1. Intended primary host

| Item | Value | Evidence status |
|------|-------|-----------------|
| Primary HTTPS host | `https://realestatecapitalresources.com` | Used in site canonicals, sitemap, OG, schema |
| Ownership / DNS control | **VERIFY** before cutover | Do not assume control from notes alone |
| www vs non-www | Prefer **apex** (non-www) as canonical (matches current tags) | Confirm with hosting; 301 the other |
| HTTP → HTTPS | Required | Configure at edge/hosting at deploy time |

---

## 2. Known legacy / alternate hosts (VERIFY)

These may appear in project history. **Ownership and redirect rights are VERIFY unless proven.**

| Host / pattern | Intended action (when authorized) | Status |
|----------------|-----------------------------------|--------|
| `realestatecapitalresources.com` | Primary | Intended |
| `www.realestatecapitalresources.com` | 301 → apex | Plan |
| GitHub Pages mockup host (`richardbjamison.github.io/faber-capital-resources/`) | **Not** production index origin; keep noindex if left up | Dev only |
| Any legacy Faber Capital / FCR domains from old materials | Owner check → 301 path-preserving where content maps | **VERIFY** |
| Casper hybrid experiment hosts | Do not redirect production users to experiments | Exclude |

---

## 3. Path-preservation rule

When a legacy domain is redirected:

- Prefer **path-preserving** 301 where the path still exists on the new site.  
- Map retired product URLs (`/commercial/`, etc.) to a relevant hub (`/loan-products/` or homepage) **or** keep soft 404 with noindex — decide explicitly; do not invent product availability.  
- Avoid multi-hop chains (legacy → www → apex → path). Single hop preferred.

---

## 4. Canonical alignment

- Every bucket A page: `<link rel="canonical" href="https://realestatecapitalresources.com{path}">`  
- OG `og:url` matches canonical.  
- Sitemap locs use the same host.  
- After deploy: spot-check that live URL, canonical, and sitemap agree.

---

## 5. Verification after real deployment (future)

```bash
# Apex resolves + HTTPS
curl -sI https://realestatecapitalresources.com/ | head -15
# www → apex (expect 301/308 once)
curl -sI https://www.realestatecapitalresources.com/ | head -15
# HTTP → HTTPS
curl -sI http://realestatecapitalresources.com/ | head -15
# Canonical present
curl -s https://realestatecapitalresources.com/loan-products/ | grep -i canonical
# No redirect chain to final HTML
curl -sI -L https://realestatecapitalresources.com/fix-and-flip/ | grep -i location
```

---

## 6. What Stage 13 does **not** do

- No DNS edits  
- No Cloudflare page rules / WAF  
- No certificate purchase  
- No production redirect table application  
