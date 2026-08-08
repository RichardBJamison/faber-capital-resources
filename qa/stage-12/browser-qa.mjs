/**
 * RECR Stage 12 — browser QA after verified-fact / mock isolation
 * Run: node qa/stage-12/browser-qa.mjs
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { createReadStream, existsSync, statSync } from "fs";
import { extname, join, normalize } from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const PORT = Number(process.env.RECR_PORT || 8841);
const BASE = process.env.RECR_BASE || `http://127.0.0.1:${PORT}`;
const OUT = __dirname;
const SHOTS = path.join(OUT, "screenshots");
fs.mkdirSync(SHOTS, { recursive: true });

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 },
};

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".woff2": "font/woff2",
};

function startServer() {
  return new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      try {
        let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
        if (urlPath.endsWith("/")) urlPath += "index.html";
        let filePath = normalize(join(ROOT, urlPath));
        if (!filePath.startsWith(ROOT)) {
          res.writeHead(403);
          return res.end("Forbidden");
        }
        if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
          const idx = join(filePath, "index.html");
          if (existsSync(idx)) filePath = idx;
          else {
            res.writeHead(404);
            return res.end("Not found");
          }
        }
        res.writeHead(200, { "Content-Type": MIME[extname(filePath).toLowerCase()] || "application/octet-stream" });
        createReadStream(filePath).pipe(res);
      } catch (e) {
        res.writeHead(500);
        res.end(String(e));
      }
    });
    server.listen(PORT, "127.0.0.1", () => resolve(server));
    server.on("error", reject);
  });
}

const ledger = [];
let pass = 0;
let fail = 0;

function ok(detail, extra = {}) {
  pass++;
  ledger.push({ result: "PASS", detail, ...extra });
  console.log(`PASS  ${detail}`);
}
function bad(detail, extra = {}) {
  fail++;
  ledger.push({ result: "FAIL", detail, ...extra });
  console.log(`FAIL  ${detail}`);
}

async function overflow(page) {
  return page.evaluate(() => {
    const d = document.documentElement;
    return d.scrollWidth > d.clientWidth + 2;
  });
}

async function mockMarkers(page) {
  return page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll('[data-proof-status="mock"]'));
    const labels = Array.from(document.body.querySelectorAll("*"))
      .map((el) => el.textContent || "")
      .filter((t) => t.includes("MOCK — DEMONSTRATION CONTENT"));
    return {
      statusNodes: nodes.length,
      labelHits: labels.length,
      bodyHasMockLabel: document.body.innerText.includes("MOCK — DEMONSTRATION CONTENT"),
    };
  });
}

async function main() {
  let server;
  try {
    server = await startServer();
  } catch (e) {
    if (e.code !== "EADDRINUSE") throw e;
    console.log("port in use — reusing");
  }

  const browser = await chromium.launch({ headless: true });
  const summary = {
    mockLaunch: {},
    results: {},
    dealPath: {},
    viewports: {},
  };

  try {
    // Homepage desktop: no mock markers; verified-empty proof strip
    {
      const ctx = await browser.newContext({ viewport: VIEWPORTS.desktop });
      const page = await ctx.newPage();
      await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
      await page.waitForTimeout(800);
      const m = await mockMarkers(page);
      if (m.statusNodes === 0) ok("homepage: zero mock status nodes");
      else bad(`homepage: mock status nodes=${m.statusNodes}`);
      summary.mockLaunch.home = m;
      if (!(await overflow(page))) ok("homepage desktop no overflow");
      else bad("homepage desktop overflow");
      await page.screenshot({ path: path.join(SHOTS, "home-desktop.png") });
      // six briefing cards
      const cards = await page.locator("#funding-programs .program-card, #funding-programs [data-program], .program-selector button, [data-briefing]").count();
      // fallback: count program links in story
      const six = await page.locator('a[href="/fix-and-flip/"], a[href="/rental/"], a[href="/bridge/"], a[href="/ground-up/"], a[href="/multifamily/"], a[href="/purchase-rehab/"]').count();
      if (six >= 6) ok(`homepage program links present (${six})`);
      else bad(`homepage program links low (${six})`);
      await ctx.close();
    }

    // Team / About — Bill verified, no mock badge
    for (const route of ["/team/", "/about/"]) {
      const ctx = await browser.newContext({ viewport: VIEWPORTS.desktop });
      const page = await ctx.newPage();
      await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
      await page.waitForSelector("[data-proof-rendered='1']", { timeout: 8000 }).catch(() => null);
      const text = await page.locator("main").innerText();
      if (/William M\. Faber/i.test(text)) ok(`${route} Bill name`);
      else bad(`${route} missing Bill name`);
      if (/broker\/connector|capital-path/i.test(text)) ok(`${route} broker framing`);
      else bad(`${route} missing broker framing`);
      const m = await mockMarkers(page);
      if (m.statusNodes === 0) ok(`${route} zero mock markers`);
      else bad(`${route} mock markers ${m.statusNodes}`);
      if (/years of experience:\s*\d|FICO\s*\d{3}|100%\s*financ/i.test(text)) bad(`${route} invented numeric claim`);
      else ok(`${route} no invented numeric credentials`);
      await page.screenshot({ path: path.join(SHOTS, route.replace(/\//g, "") + ".png") });
      await ctx.close();
    }

    // Results — mocks allowed and labeled; draft never
    {
      const ctx = await browser.newContext({ viewport: VIEWPORTS.desktop });
      const page = await ctx.newPage();
      await page.goto(`${BASE}/results/`, { waitUntil: "networkidle" });
      await page.waitForSelector("[data-proof-rendered='1']", { timeout: 8000 });
      const m = await mockMarkers(page);
      summary.results = m;
      if (m.statusNodes > 0 && m.bodyHasMockLabel) ok(`results: mock cards labeled (${m.statusNodes})`);
      else bad(`results: expected labeled mocks, got ${JSON.stringify(m)}`);
      const body = await page.locator("main").innerText();
      if (/tx-draft|Private draft only|Should never render/i.test(body)) bad("results: draft leaked");
      else ok("results: draft not rendered");
      await page.screenshot({ path: path.join(SHOTS, "results-desktop.png") });
      await ctx.close();
    }

    // Six programs — no mock markers
    for (const slug of ["fix-and-flip", "rental", "bridge", "ground-up", "multifamily", "purchase-rehab"]) {
      const ctx = await browser.newContext({ viewport: VIEWPORTS.desktop });
      const page = await ctx.newPage();
      await page.goto(`${BASE}/${slug}/`, { waitUntil: "networkidle" });
      await page.waitForTimeout(600);
      const m = await mockMarkers(page);
      if (m.statusNodes === 0) ok(`/${slug}/ zero mock`);
      else bad(`/${slug}/ mock=${m.statusNodes}`);
      const t = await page.locator("main").innerText();
      if (/qualifying joint-venture structure|100% financing for acquisition/i.test(t)) bad(`/${slug}/ residual JV 100% claim`);
      else ok(`/${slug}/ no residual JV-100 claim`);
      await ctx.close();
    }

    // Geos
    for (const route of [
      "/cleveland-real-estate-investor-financing/",
      "/south-florida-real-estate-investor-financing/",
    ]) {
      const ctx = await browser.newContext({ viewport: VIEWPORTS.mobile });
      const page = await ctx.newPage();
      await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(500);
      const m = await mockMarkers(page);
      if (m.statusNodes === 0) ok(`${route} zero mock`);
      else bad(`${route} mock=${m.statusNodes}`);
      if (!(await overflow(page))) ok(`${route} mobile no overflow`);
      else bad(`${route} mobile overflow`);
      await ctx.close();
    }

    // Deal Path mobile + OOS
    {
      const ctx = await browser.newContext({ viewport: VIEWPORTS.mobile, reducedMotion: "reduce" });
      const page = await ctx.newPage();
      await page.goto(`${BASE}/tools/deal-path/`, { waitUntil: "networkidle" });
      await page.waitForFunction(() => window.__RECR_DEAL_PATH__);
      // OOS owner-occupied via guide
      const g = await page.evaluate(() =>
        window.__RECR_DEAL_PATH__.guide({
          occupancy: "owner_occupied",
          units: "1",
          propertyForm: "existing",
          transaction: "purchasing",
          condition: "ready_rent",
          capitalNeed: "purchase",
          strategy: "hold_stabilized",
          timingConstraint: "no",
          market: "unknown",
          estimates: {},
          contact: {},
        })
      );
      if (g.outcome === "oos") ok("deal-path OOS owner-occupied");
      else bad("deal-path OOS owner-occupied failed");
      const g5 = await page.evaluate(() =>
        window.__RECR_DEAL_PATH__.guide({
          occupancy: "investment",
          units: "5plus",
          propertyForm: "existing",
          transaction: "purchasing",
          condition: "ready_rent",
          capitalNeed: "purchase",
          strategy: "hold_stabilized",
          timingConstraint: "no",
          market: "unknown",
          estimates: {},
          contact: {},
        })
      );
      if (g5.outcome === "oos") ok("deal-path OOS 5+");
      else bad("deal-path OOS 5+ failed");
      if (!(await overflow(page))) ok("deal-path mobile no overflow");
      else bad("deal-path mobile overflow");
      const robots = await page.locator('meta[name="robots"]').getAttribute("content");
      if (robots && /noindex/i.test(robots)) ok("deal-path noindex intact");
      else bad("deal-path noindex missing");
      await page.screenshot({ path: path.join(SHOTS, "deal-path-mobile.png") });
      await ctx.close();
    }

    // Submit / Contact
    for (const route of ["/submit-a-deal/", "/contact/"]) {
      const ctx = await browser.newContext({ viewport: VIEWPORTS.desktop });
      const page = await ctx.newPage();
      const reqs = [];
      page.on("request", (r) => {
        const u = r.url();
        if (!u.includes("127.0.0.1") && !u.includes("localhost") && !u.includes("fonts.g") && !u.includes("gstatic")) {
          reqs.push(u);
        }
      });
      await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
      if (/noindex/i.test((await page.locator('meta[name="robots"]').getAttribute("content")) || "")) ok(`${route} noindex`);
      else bad(`${route} noindex`);
      // no CRM hosts
      const crm = reqs.filter((u) => /gohighlevel|leadconnector|hooks\.zapier|api\.hubapi/i.test(u));
      if (crm.length === 0) ok(`${route} no CRM network calls`);
      else bad(`${route} CRM calls ${crm.join(",")}`);
      await ctx.close();
    }

    // Keyboard focus on deal-path
    {
      const ctx = await browser.newContext({ viewport: VIEWPORTS.desktop });
      const page = await ctx.newPage();
      await page.goto(`${BASE}/tools/deal-path/`, { waitUntil: "networkidle" });
      await page.locator('input[name="occupancy"][value="investment"]').focus();
      const name = await page.evaluate(() => document.activeElement?.getAttribute("name"));
      if (name === "occupancy") ok("keyboard focus radio");
      else bad(`keyboard focus name=${name}`);
      await ctx.close();
    }

    // Sitemap count
    {
      const sm = fs.readFileSync(path.join(ROOT, "sitemap.xml"), "utf8");
      const locs = sm.match(/<loc>/g) || [];
      if (locs.length === 48) ok("sitemap count 48");
      else bad(`sitemap count ${locs.length}`);
      if (!sm.includes("/results/")) ok("sitemap excludes results");
      else bad("sitemap includes results");
    }
  } finally {
    await browser.close();
    if (server) server.close();
  }

  const out = { pass, fail, ledger, summary };
  fs.writeFileSync(path.join(OUT, "results.json"), JSON.stringify(out, null, 2));
  console.log(`\n=== Stage 12 Browser QA ===\nPASS ${pass}  FAIL ${fail}`);
  process.exit(fail > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
