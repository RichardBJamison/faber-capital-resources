#!/usr/bin/env python3
"""Local server for RECR × Acqua-frame custom HTML lab. Default port 8840.

Deal Desk is built with GitHub Pages base:
  VITE_BASE=/faber-capital-resources/deal-desk/

So this server:
  1. Redirects /deal-desk/* → /faber-capital-resources/deal-desk/*
     (matches React Router basename + absolute asset URLs)
  2. Maps /faber-capital-resources/* → repo files at /*
  3. SPA-fallback: missing /deal-desk/* routes → deal-desk/index.html
"""
from __future__ import annotations

import http.server
import os
import socketserver
from pathlib import Path
from urllib.parse import unquote, urlsplit

PORT = int(os.environ.get("PORT", "8840"))
ROOT = Path(__file__).resolve().parent
GH_PREFIX = "/faber-capital-resources"


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        if self.path.split("?", 1)[0].endswith((".mp4", ".webm", ".mov")):
            self.send_header("Accept-Ranges", "bytes")
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def _parts(self) -> tuple[str, str]:
        split = urlsplit(self.path)
        path = unquote(split.path) or "/"
        query = f"?{split.query}" if split.query else ""
        return path, query

    def do_GET(self):
        orig_path, query = self._parts()
        path = orig_path
        under_gh = False

        # Local Nexus uses ../deal-desk/ → put browser on GH-shaped URL so
        # Router basename + absolute asset paths work.
        if path == "/deal-desk" or path.startswith("/deal-desk/"):
            self.send_response(302)
            self.send_header("Location", GH_PREFIX + path + query)
            self.end_headers()
            return

        # Strip GH prefix for filesystem lookup; browser URL stays prefixed.
        if path == GH_PREFIX or path.startswith(GH_PREFIX + "/"):
            under_gh = True
            path = path[len(GH_PREFIX) :] or "/"
            self.path = path + query

        candidate = ROOT / path.lstrip("/")

        # Directory → ensure trailing slash, then index
        if candidate.is_dir():
            if not path.endswith("/"):
                loc = (GH_PREFIX if under_gh else "") + path + "/" + query
                self.send_response(301)
                self.send_header("Location", loc)
                self.end_headers()
                return
            if (candidate / "index.html").is_file():
                return super().do_GET()

        # Real file
        if candidate.is_file():
            return super().do_GET()

        # Clean URL without extension that maps to a folder index
        if path != "/" and not path.endswith("/") and "." not in path.rsplit("/", 1)[-1]:
            as_dir = ROOT / path.lstrip("/")
            if (as_dir / "index.html").is_file() or as_dir.is_dir():
                loc = (GH_PREFIX if under_gh else "") + path + "/" + query
                self.send_response(301)
                self.send_header("Location", loc)
                self.end_headers()
                return

        # Deal Desk SPA fallback (client routes like /pipeline, /me)
        if path.startswith("/deal-desk/") or path.rstrip("/") == "/deal-desk":
            spa = ROOT / "deal-desk" / "index.html"
            if spa.is_file():
                self.path = "/deal-desk/index.html" + query
                return super().do_GET()

        return super().do_GET()


class ThreadingServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True


if __name__ == "__main__":
    with ThreadingServer(("127.0.0.1", PORT), Handler) as httpd:
        print(f"RECR × Acqua frame → http://127.0.0.1:{PORT}/")
        print(f"Nexus             → http://127.0.0.1:{PORT}/nexus/")
        print(f"Deal Desk         → http://127.0.0.1:{PORT}/deal-desk/  (→ GH path)")
        print(f"Root: {ROOT}")
        httpd.serve_forever()
