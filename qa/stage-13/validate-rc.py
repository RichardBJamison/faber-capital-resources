#!/usr/bin/env python3
"""RECR Stage 13 — Release Candidate validator (local only).

Verdicts:
  RC PASS / RC FAIL — internal structural soundness of the release candidate
  PRODUCTION READY / PRODUCTION BLOCKED — launch-critical external/factual gates

Does not deploy, flip noindex, submit sitemaps, or wire CRM.
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HOST = "https://realestatecapitalresources.com"
EXPECTED_SITEMAP = 48

RC_ERRORS: list[str] = []
RC_WARNINGS: list[str] = []
PROD_BLOCKERS: list[str] = []
PROD_NOTES: list[str] = []


def rc_err(msg: str) -> None:
    RC_ERRORS.append(msg)


def rc_warn(msg: str) -> None:
    RC_WARNINGS.append(msg)


def prod_block(msg: str) -> None:
    PROD_BLOCKERS.append(msg)


def prod_note(msg: str) -> None:
    PROD_NOTES.append(msg)


def route_for(f: Path) -> str:
    if f.parent == ROOT:
        return "/"
    return "/" + str(f.relative_to(ROOT).parent).replace("\\", "/") + "/"


def is_excluded_route(route: str) -> bool:
    prefixes = (
        "/commercial/",
        "/joint-venture/",
        "/portfolio/",
        "/results/",
        "/nexus/",
        "/brokerage/",
        "/resonant-design-offer/",
        "/lab/",
        "/legacy-fcr/",
        "/deal-desk/",
        "/qa/",
    )
    return any(route.startswith(p) for p in prefixes)


def main() -> int:
    # --- Sitemap ---
    sm = (ROOT / "sitemap.xml").read_text(encoding="utf-8")
    locs = re.findall(r"<loc>([^<]+)</loc>", sm)
    if len(locs) != EXPECTED_SITEMAP:
        rc_err(
            f"sitemap count {len(locs)} != {EXPECTED_SITEMAP} "
            "(Results excluded while mock-only; deal-path included)"
        )
    if not any("/tools/deal-path/" in u for u in locs):
        rc_err("sitemap missing /tools/deal-path/")
    if any("/results/" in u for u in locs):
        rc_err("sitemap contains /results/ while proof is mock-only")
        prod_block("Results in sitemap without verified proof policy")
    for bad in ("/commercial/", "/joint-venture/", "/portfolio/", "/nexus/", "/qa/"):
        if any(bad in u for u in locs):
            rc_err(f"sitemap contains excluded path {bad}")

    sitemap_routes = set()
    for u in locs:
        path = u.replace(HOST, "") or "/"
        if not path.endswith("/"):
            path += "/"
        sitemap_routes.add(path)

    # --- SEO integrity on sitemap pages ---
    titles: list[str] = []
    descs: list[str] = []
    h1s: list[str] = []
    for loc in locs:
        path = loc.replace(HOST, "") or "/"
        if not path.endswith("/"):
            path += "/"
        f = ROOT / "index.html" if path == "/" else ROOT / path.strip("/") / "index.html"
        if not f.exists():
            rc_err(f"sitemap URL missing file: {path}")
            continue
        t = f.read_text(encoding="utf-8", errors="replace")
        title_m = re.search(r"<title>([^<]*)</title>", t)
        desc_m = re.search(r'name="description"\s+content="([^"]*)"', t)
        h1_m = re.search(r"<h1[^>]*>(.*?)</h1>", t, re.S)
        can_m = re.search(r'rel="canonical"\s+href="([^"]*)"', t)
        rob_m = re.search(r'name="robots"\s+content="([^"]*)"', t)
        title = title_m.group(1).strip() if title_m else ""
        desc = desc_m.group(1).strip() if desc_m else ""
        h1 = re.sub(r"<[^>]+>", "", h1_m.group(1)).strip() if h1_m else ""
        can = can_m.group(1).strip() if can_m else ""
        rob = rob_m.group(1).strip() if rob_m else ""
        titles.append(title)
        descs.append(desc)
        h1s.append(h1)
        if not title:
            rc_err(f"missing title {path}")
        if not desc:
            rc_err(f"missing meta description {path}")
        if not h1:
            rc_err(f"missing H1 {path}")
        if can.rstrip("/") != (HOST + path).rstrip("/"):
            rc_err(f"canonical mismatch {path} -> {can}")
        if "noindex" not in rob.lower():
            # During Stage 13 this is an RC error if missing (dev gate must stay)
            rc_err(f"dev noindex missing on sitemap page {path}")
        if "{{CLAIM:" in t or "Search intent this page" in t:
            rc_err(f"scaffold residue on {path}")

    for label, seq in (("title", titles), ("description", descs), ("H1", h1s)):
        c = Counter([x for x in seq if x])
        for val, n in c.items():
            if n > 1:
                rc_err(f"duplicate {label} x{n}: {val[:80]}")

    # --- proof.json ---
    proof = json.loads((ROOT / "data/proof.json").read_text(encoding="utf-8"))
    txs = proof.get("transactions") or []
    tms = proof.get("testimonials") or []
    v_tx = sum(1 for t in txs if t.get("status") == "verified")
    m_tx = sum(1 for t in txs if t.get("status") == "mock")
    d_tx = sum(1 for t in txs if t.get("status") == "draft")
    v_tm = sum(1 for t in tms if t.get("status") == "verified")
    m_tm = sum(1 for t in tms if t.get("status") == "mock")

    prod_note(f"proof.json: verified_tx={v_tx} mock_tx={m_tx} draft_tx={d_tx} verified_tm={v_tm} mock_tm={m_tm}")

    if d_tx:
        # draft must never render — check mounts never include draft status in renderer logic is code-level;
        # flag if any public HTML hardcodes draft id
        for f in ROOT.rglob("index.html"):
            if any(p in f.parts for p in (".git", "node_modules", "legacy-fcr", "lab", "qa", "nexus")):
                continue
            if "tx-draft-private" in f.read_text(encoding="utf-8", errors="replace"):
                rc_err(f"draft proof id hardcoded in {route_for(f)}")

    # Launch pages must not request mock inclusion
    for f in ROOT.rglob("index.html"):
        if any(p in f.parts for p in (".git", "node_modules", "legacy-fcr", "lab", "qa", "nexus", "deal-desk")):
            continue
        route = route_for(f)
        text = f.read_text(encoding="utf-8", errors="replace")
        if is_excluded_route(route):
            continue
        if 'data-proof-include-mock="1"' in text or "data-proof-include-mock='1'" in text:
            rc_err(f"launch page allows mock proof: {route}")
        if "MOCK — DEMONSTRATION CONTENT" in text and "data-proof-" not in text:
            rc_err(f"baked mock label on launch page {route}")

    # Results may include mock for design but must stay off sitemap (already checked)
    results = ROOT / "results" / "index.html"
    if results.exists():
        rt = results.read_text(encoding="utf-8", errors="replace")
        if 'data-proof-include-mock="1"' not in rt and m_tx > 0 and v_tx == 0:
            rc_warn("Results has mocks in data but no include-mock; design hub may show empty")
        if "noindex" not in rt:
            rc_err("Results missing noindex while mock-only")

    # Production: Results indexing blocked while no verified txs
    if v_tx == 0:
        prod_block("No verified transactions — Results must stay excluded from production index/sitemap")
    if v_tm == 0:
        prod_note("No verified testimonials (ok if modules stay empty)")

    # --- JSON-LD mock leakage ---
    for f in ROOT.rglob("index.html"):
        if any(p in f.parts for p in (".git", "node_modules", "legacy-fcr", "lab", "nexus", "qa")):
            continue
        t = f.read_text(encoding="utf-8", errors="replace")
        for block in re.findall(
            r'<script type="application/ld\+json">(.*?)</script>', t, re.S
        ):
            try:
                data = json.loads(block)
            except json.JSONDecodeError as e:
                rc_err(f"JSON-LD parse fail {f}: {e}")
                continue
            blob = json.dumps(data).lower()
            for needle in ("tx-mock", "mock borrower", "tm-mock", "demonstration content"):
                if needle in blob:
                    rc_err(f"mock leakage in JSON-LD {f}: {needle}")

    # --- llms.txt ---
    llms = (ROOT / "llms.txt").read_text(encoding="utf-8")
    for needle in ("tx-mock", "Mock Borrower", "100% purchase", "70% ARV"):
        if needle in llms:
            rc_err(f"llms.txt forbidden content: {needle}")

    # --- Entity IDs ---
    home = (ROOT / "index.html").read_text(encoding="utf-8")
    team = (ROOT / "team/index.html").read_text(encoding="utf-8")
    if f"{HOST}/#organization" not in home:
        rc_err("homepage missing Organization @id")
    if f"{HOST}/#william-m-faber" not in team:
        rc_err("team missing Person @id")

    # --- robots.txt Results policy ---
    robots = (ROOT / "robots.txt").read_text(encoding="utf-8")
    if "Disallow: /results/" not in robots:
        rc_warn("robots.txt missing Disallow /results/ (expected while mock-only)")

    # --- JS syntax ---
    for js in (ROOT / "assets/js").glob("*.js"):
        try:
            r = subprocess.run(
                ["node", "--check", str(js)],
                capture_output=True,
                text=True,
                timeout=30,
            )
            if r.returncode != 0:
                rc_err(f"JS syntax {js.name}: {r.stderr.strip()[:200]}")
        except Exception as e:
            rc_warn(f"JS check skipped {js.name}: {e}")

    # --- Forms still mock (production block, not RC fail) ---
    contact = (ROOT / "contact/index.html").read_text(encoding="utf-8", errors="replace")
    submit = (ROOT / "submit-a-deal/index.html").read_text(encoding="utf-8", errors="replace")
    if "data-mock-form" in contact or "data-mock-form" in submit:
        prod_block("Contact/Submit forms still mock-local — production destination not wired")
    if "G-XXXXXXXXXX" in home or "G-XXXXXXXXXX" in contact:
        prod_block("GA4 measurement ID still placeholder G-XXXXXXXXXX")

    # --- noindex intentional during Stage 13 / pre-flip ---
    prod_block("Dev noindex,nofollow still present on launch pages (indexing flip not authorized)")

    # --- Production ready needs flip prep complete ---
    # Additional note: counsel not machine-checkable
    prod_note("Counsel/disclosures acceptance is human-gated (see LAUNCH-INPUT-TRIAGE-13.md LC-04)")
    prod_note("Richard deploy authorization is human-gated (LC-01)")

    # Stage 10 compatibility: mock mounts on launch pages still block *flip* if they would render mock.
    # Stage 12 verified-only: mounts without include-mock are RC-OK but prod still blocked by no verified proof for Results and by noindex/forms.
    launch_mounts = []
    for f in ROOT.rglob("index.html"):
        if any(p in f.parts for p in (".git", "node_modules", "legacy-fcr", "lab", "nexus", "qa", "deal-desk")):
            continue
        route = route_for(f)
        if is_excluded_route(route):
            continue
        text = f.read_text(encoding="utf-8", errors="replace")
        if "proof.js" in text and any(
            m in text
            for m in (
                "data-proof-program",
                "data-proof-market",
                "data-proof-home",
                "data-proof-bill",
                "data-proof-quotes",
            )
        ):
            launch_mounts.append(route)
    if launch_mounts:
        prod_note(
            "Proof mounts remain on launch pages (verified-only renderer). "
            f"Count={len(set(launch_mounts))}. Empty verified mounts OK for RC."
        )

    # --- Verdicts ---
    rc_pass = len(RC_ERRORS) == 0
    # PRODUCTION READY only if no blockers
    prod_ready = len(PROD_BLOCKERS) == 0

    print("=== RECR Stage 13 Release Candidate Validator ===")
    print(f"Sitemap URLs: {len(locs)}")
    print(f"Verified transactions: {v_tx} | Mock transactions: {m_tx}")
    print(f"Verified testimonials: {v_tm} | Mock testimonials: {m_tm}")
    print()
    for w in RC_WARNINGS:
        print("RC WARN:", w)
    for n in PROD_NOTES:
        print("NOTE:", n)
    print()
    if rc_pass:
        print("RC VERDICT: PASS — release candidate is internally sound.")
    else:
        print(f"RC VERDICT: FAIL ({len(RC_ERRORS)}):")
        for e in RC_ERRORS:
            print(" -", e)
    print()
    if prod_ready:
        print("PRODUCTION: READY — all machine-checkable launch-critical gates clear.")
        print("(Still requires human authorization to deploy/flip.)")
    else:
        print(f"PRODUCTION: BLOCKED ({len(PROD_BLOCKERS)}):")
        for e in PROD_BLOCKERS:
            print(" -", e)

    print()
    print("This script never deploys, flips noindex, submits URLs, or wires CRM.")

    # Exit codes: 0 = RC PASS (production may still be blocked)
    #             1 = RC FAIL
    # Write machine report
    report = {
        "rc": "PASS" if rc_pass else "FAIL",
        "production": "READY" if prod_ready else "BLOCKED",
        "sitemap_count": len(locs),
        "verified_tx": v_tx,
        "mock_tx": m_tx,
        "verified_tm": v_tm,
        "mock_tm": m_tm,
        "rc_errors": RC_ERRORS,
        "rc_warnings": RC_WARNINGS,
        "production_blockers": PROD_BLOCKERS,
        "notes": PROD_NOTES,
    }
    out = ROOT / "qa/stage-13/validate-rc-report.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {out}")

    return 0 if rc_pass else 1


if __name__ == "__main__":
    sys.exit(main())
