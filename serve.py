#!/usr/bin/env python3
"""Local server for RECR × Acqua-frame custom HTML lab. Default port 8840."""
from __future__ import annotations

import http.server
import os
import socketserver
from pathlib import Path

PORT = int(os.environ.get("PORT", "8840"))
ROOT = Path(__file__).resolve().parent


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        # Allow media scrubbing / progressive load in Chrome
        if self.path.split("?", 1)[0].endswith((".mp4", ".webm", ".mov")):
            self.send_header("Accept-Ranges", "bytes")
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_GET(self):
        # Clean URLs: /fix-and-flip/ → fix-and-flip/index.html
        path = self.path.split("?", 1)[0]
        if path != "/" and not path.endswith("/") and "." not in path.rsplit("/", 1)[-1]:
            self.path = path + "/"
            path = self.path.split("?", 1)[0]
        candidate = ROOT / path.lstrip("/")
        if path.endswith("/") and (candidate / "index.html").is_file():
            return super().do_GET()
        if not path.endswith("/") and candidate.is_dir() and (candidate / "index.html").is_file():
            self.send_response(301)
            self.send_header("Location", path + "/")
            self.end_headers()
            return
        return super().do_GET()


class ThreadingServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True


if __name__ == "__main__":
    with ThreadingServer(("127.0.0.1", PORT), Handler) as httpd:
        print(f"RECR × Acqua frame → http://127.0.0.1:{PORT}/")
        print(f"Root: {ROOT}")
        httpd.serve_forever()
