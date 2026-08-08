#!/usr/bin/env python3
"""RECR Stage 10 launch-gate validator (local only — does not deploy or submit).

Exit 0 = gates look ready for a future flip (still does not flip noindex).
Exit 1 = blockers remain.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HOST = "https://realestatecapitalresources.com"
ERRORS: list[str] = []
WARNINGS: list[str] = []


def err(msg: str) -> None:
    ERRORS.append(msg)


def warn(msg: str) -> None:
    WARNINGS.append(msg)


def main() -> int:
    # Sitemap
    sm = (ROOT / "sitemap.xml").read_text(encoding="utf-8")
    locs = re.findall(r"<loc>([^<]+)</loc>", sm)
    # Stage 11: 47 (post Stage 10) + /tools/deal-path/ = 48; Results still excluded
    EXPECTED_SITEMAP = 48
    if len(locs) != EXPECTED_SITEMAP:
        err(
            f"sitemap count {len(locs)} != {EXPECTED_SITEMAP} "
            "(Results excluded while mock-only; deal-path included after Stage 11)"
        )
    if not any("/tools/deal-path/" in u for u in locs):
        err("sitemap missing /tools/deal-path/ (Stage 11 launch tool)")
    if any("/results/" in u for u in locs):
        err("sitemap still contains /results/ while proof is mock-only")
    for bad in ("/commercial/", "/joint-venture/", "/portfolio/", "/nexus/", "/qa/"):
        if any(bad in u for u in locs):
            err(f"sitemap contains excluded path {bad}")

    # Mock markers on pages that would be indexable
    mock_hits = []
    for f in ROOT.rglob("index.html"):
        if any(p in f.parts for p in (".git", "legacy-fcr", "lab", "nexus", "qa", "deal-desk")):
            continue
        route = "/" if f.parent == ROOT else "/" + str(f.relative_to(ROOT).parent).replace("\\", "/") + "/"
        if route.startswith(("/commercial/", "/joint-venture/", "/portfolio/", "/results/")):
            continue
        text = f.read_text(encoding="utf-8", errors="replace")
        if "MOCK — DEMONSTRATION CONTENT" in text and "data-proof-" not in text:
            mock_hits.append(route + " (baked mock label)")
        # Runtime mounts inject mock while data/proof.json is mock-only — launch flip blocker
        if "proof.js" in text and any(
            m in text
            for m in (
                "data-proof-program",
                "data-proof-market",
                "data-proof-home",
                "data-proof-bill",
                "data-proof-quotes",
                "data-proof-hub",
            )
        ):
            mock_hits.append(route + " (runtime mock mount)")
    if mock_hits:
        warn(
            "Mock proof still present on launch surfaces until data/proof.json is verified: "
            + ", ".join(sorted(set(mock_hits))[:25])
        )
        err("launch flip blocked: mock proof mounts still active on launch surfaces")

    # JSON-LD parse + mock leakage in schema
    for f in ROOT.rglob("index.html"):
        if any(p in f.parts for p in (".git", "legacy-fcr", "lab", "nexus", "qa")):
            continue
        t = f.read_text(encoding="utf-8", errors="replace")
        for block in re.findall(
            r'<script type="application/ld\+json">(.*?)</script>', t, re.S
        ):
            try:
                data = json.loads(block)
            except json.JSONDecodeError as e:
                err(f"JSON-LD parse fail {f}: {e}")
                continue
            blob = json.dumps(data).lower()
            for needle in ("tx-mock", "mock borrower", "tm-mock", "demonstration content"):
                if needle in blob:
                    err(f"mock leakage in JSON-LD {f}: {needle}")

    # llms.txt
    llms = (ROOT / "llms.txt").read_text(encoding="utf-8")
    for needle in ("tx-mock", "Mock Borrower", "100% purchase", "70% ARV"):
        if needle in llms:
            err(f"llms.txt contains forbidden content: {needle}")
    if "/results/" in llms and "not treated as launch-indexable" not in llms:
        warn("llms.txt mentions results — ensure conditional language remains")

    # Entity IDs present on home + team
    home = (ROOT / "index.html").read_text(encoding="utf-8")
    team = (ROOT / "team/index.html").read_text(encoding="utf-8")
    for needle in (
        f"{HOST}/#organization",
        f"{HOST}/#website",
        f"{HOST}/#william-m-faber",
    ):
        if needle not in home and needle not in team:
            err(f"missing entity id in home/team: {needle}")
    if f"{HOST}/#organization" not in home:
        err("homepage missing Organization @id")
    if f"{HOST}/#william-m-faber" not in team:
        err("team missing Person @id")

    # noindex still on (dev gate)
    sample = list(ROOT.glob("**/index.html"))[:5]
    for f in [ROOT / "index.html", ROOT / "loan-products/index.html"]:
        if "noindex" not in f.read_text(encoding="utf-8"):
            err(f"dev noindex missing on {f}")

    print("=== RECR launch-gate validation (Stage 10) ===")
    print(f"Sitemap URLs: {len(locs)}")
    for w in WARNINGS:
        print("WARN:", w)
    if ERRORS:
        print(f"FAIL ({len(ERRORS)}):")
        for e in ERRORS:
            print(" -", e)
        print("\nThis script never deploys or flips noindex.")
        return 1
    print("OK: structural gates green (still do not flip noindex until human + verified proof gates).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
