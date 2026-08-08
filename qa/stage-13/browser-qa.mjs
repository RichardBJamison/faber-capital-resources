/**
 * RECR Stage 13 — Release Candidate browser QA
 * Run: node qa/stage-13/browser-qa.mjs
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
const PORT = Number(process.env.RECR_PORT || 8843);
const BASE = process.env.RECR_BASE || `http://127.0.0.1:${PORT}`;
const SHOTS = path.join(__dirname, "screenshots");
fs.mkdirSync(SHOTS, { recursive: true });

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  laptop: { width: 1280, height: 800 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 },
  small: { width: 360, height: 800 },
};

const PROGRAMS = ["fix-and-flip", "rental", "bridge", "ground-up", "multifamily", "purchase-rehab"];

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
let passN = 0;
let failN = 0;

function ok(detail) {
  passN++;
  ledger.push({ result: "PASS", detail });
  console.log("PASS ", detail);
}
function bad(detail) {
  failN++;
  ledger.push({ result: "FAIL", detail });
  console.log("FAIL ", detail);
}

async function overflow(page) {
  return page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
}

async function mockCount(page) {
  return page.evaluate(() => document.querySelectorAll('[data-proof-status="mock"]').length);
}

async function noindex(page) {
  const c = await page.locator('meta[name="robots"]').getAttribute("content");
  return c && /noindex/i.test(c);
}

async function main() {
  let server;
  try {
    server = await startServer();
  } catch (e) {
    if (e.code !== "EADDRINUSE") throw e;
  }

  const browser = await chromium.launch({ headless: true });
  try {
    // Homepage + briefings desktop
    {
      const ctx = await browser.newContext({ viewport: VIEWPORTS.desktop });
      const page = await ctx.newPage();
      const errs = [];
      page.on("pageerror", (e) => errs.push(String(e)));
      await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
      if (await noindex(page)) ok("home noindex");
      else bad("home noindex missing");
      if ((await mockCount(page)) === 0) ok("home zero mock markers");
      else bad("home mock markers");
      if (!(await overflow(page))) ok("home desktop no overflow");
      else bad("home desktop overflow");

      // Try open a briefing if selector exists
      const briefing = page.locator("#funding-programs, [data-program], .program-card").first();
      if (await briefing.count()) {
        await briefing.scrollIntoViewIfNeeded().catch(() => {});
        ok("home funding programs region present");
      } else {
        bad("home funding programs region missing");
      }
      // six program destinations
      for (const p of PROGRAMS) {
        const n = await page.locator(`a[href="/${p}/"], a[href*="/${p}/"]`).count();
        if (n > 0) ok(`home link to /${p}/`);
        else bad(`home missing link /${p}/`);
      }
      await page.screenshot({ path: path.join(SHOTS, "home-desktop.png") });
      if (errs.length === 0) ok("home no pageerror");
      else bad("home pageerror " + errs[0]);
      await ctx.close();
    }

    // Mobile nav
    {
      const ctx = await browser.newContext({ viewport: VIEWPORTS.mobile });
      const page = await ctx.newPage();
      await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
      const toggle = page.locator(
        'button[aria-label*="menu" i], button.nav-toggle, .menu-toggle, [data-nav-toggle], button:has-text("Menu")'
      );
      if ((await toggle.count()) > 0) {
        await toggle.first().click().catch(() => {});
        ok("mobile nav toggle present");
      } else {
        // shell may inject later
        await page.waitForTimeout(500);
        if ((await page.locator("nav a, .site-header a").count()) > 3) ok("mobile nav links available");
        else bad("mobile nav not found");
      }
      if (!(await overflow(page))) ok("home mobile no overflow");
      else bad("home mobile overflow");
      await page.screenshot({ path: path.join(SHOTS, "home-mobile.png") });
      await ctx.close();
    }

    // Multi-viewport smoke on key pages
    const smoke = [
      "/loan-products/",
      "/about/",
      "/team/",
      "/faq/",
      "/contact/",
      "/submit-a-deal/",
      "/tools/deal-path/",
      "/tools/dscr/",
      "/resources/which-financing-path/",
      "/cleveland-real-estate-investor-financing/",
      "/south-florida-real-estate-investor-financing/",
    ];
    for (const route of smoke) {
      const ctx = await browser.newContext({ viewport: VIEWPORTS.laptop });
      const page = await ctx.newPage();
      const res = await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
      if (res && res.status() < 400) ok(`${route} status ${res.status()}`);
      else bad(`${route} bad status`);
      if (await noindex(page)) ok(`${route} noindex`);
      else bad(`${route} noindex`);
      if ((await mockCount(page)) === 0) ok(`${route} zero mock`);
      else bad(`${route} has mock`);
      await ctx.close();
    }

    // All six programs
    for (const p of PROGRAMS) {
      const ctx = await browser.newContext({ viewport: VIEWPORTS.desktop });
      const page = await ctx.newPage();
      await page.goto(`${BASE}/${p}/`, { waitUntil: "networkidle" });
      await page.waitForTimeout(400);
      if ((await mockCount(page)) === 0) ok(`/${p}/ zero mock`);
      else bad(`/${p}/ mock`);
      const body = await page.locator("main").innerText();
      if (/qualifying joint-venture structure|100%\s*financing for acquisition/i.test(body))
        bad(`/${p}/ residual bad claim`);
      else ok(`/${p}/ claims clean`);
      await ctx.close();
    }

    // Viewports overflow sample
    for (const [name, vp] of Object.entries(VIEWPORTS)) {
      const ctx = await browser.newContext({ viewport: vp, reducedMotion: name === "mobile" ? "reduce" : "no-preference" });
      const page = await ctx.newPage();
      await page.goto(`${BASE}/tools/deal-path/`, { waitUntil: "networkidle" });
      if (!(await overflow(page))) ok(`deal-path ${name} no overflow`);
      else bad(`deal-path ${name} overflow`);
      await ctx.close();
    }

    // Deal Path logic scenarios (critical)
    {
      const ctx = await browser.newContext({ viewport: VIEWPORTS.desktop });
      const page = await ctx.newPage();
      await page.goto(`${BASE}/tools/deal-path/`, { waitUntil: "networkidle" });
      await page.waitForFunction(() => window.__RECR_DEAL_PATH__);
      const cases = [
        {
          id: "flip",
          a: {
            occupancy: "investment",
            units: "1",
            propertyForm: "existing",
            transaction: "purchasing",
            condition: "needs_light_rehab",
            capitalNeed: "purchase",
            strategy: "renovate_sell",
            timingConstraint: "no",
            market: "cleveland",
            estimates: {},
            contact: {},
          },
          primary: "fix-and-flip",
        },
        {
          id: "oos-oo",
          a: {
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
          },
          oos: true,
        },
        {
          id: "oos-5",
          a: {
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
          },
          oos: true,
        },
        {
          id: "unknown",
          a: {
            occupancy: "investment",
            units: "1",
            propertyForm: "existing",
            transaction: "evaluating",
            condition: "needs_light_rehab",
            capitalNeed: "unknown",
            strategy: "not_sure",
            timingConstraint: "unknown",
            market: "unknown",
            estimates: {},
            contact: {},
          },
          needs: true,
        },
      ];
      for (const c of cases) {
        const g = await page.evaluate((a) => window.__RECR_DEAL_PATH__.guide(a), c.a);
        if (c.oos && g.outcome === "oos") ok(`deal-path ${c.id} oos`);
        else if (c.primary && g.primaryPath === c.primary) ok(`deal-path ${c.id} → ${c.primary}`);
        else if (c.needs && (g.outcome === "needs_conversation" || !g.primaryPath)) ok(`deal-path ${c.id} needs conversation`);
        else bad(`deal-path ${c.id} unexpected ${JSON.stringify({ o: g.outcome, p: g.primaryPath })}`);
      }
      // keyboard
      await page.locator('input[name="occupancy"][value="investment"]').focus();
      if ((await page.evaluate(() => document.activeElement?.getAttribute("name"))) === "occupancy") ok("deal-path keyboard focus");
      else bad("deal-path keyboard focus");
      await ctx.close();
    }

    // Forms mock local — no CRM
    for (const route of ["/contact/", "/submit-a-deal/"]) {
      const ctx = await browser.newContext({ viewport: VIEWPORTS.tablet });
      const page = await ctx.newPage();
      const external = [];
      page.on("request", (r) => {
        const u = r.url();
        if (!/127\.0\.0\.1|localhost|fonts\.g|gstatic/.test(u)) external.push(u);
      });
      await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
      const form = page.locator("form[data-mock-form]");
      if ((await form.count()) > 0) {
        // fill minimal
        await page.fill('input[name="name"]', "RC Test Investor").catch(() => {});
        await page.fill('input[name="email"]', "rc-test@example.com").catch(() => {});
        await page.locator('button[type="submit"], form[data-mock-form] button').first().click().catch(() => {});
        await page.waitForTimeout(300);
        ok(`${route} mock form present`);
      } else {
        bad(`${route} mock form missing`);
      }
      if (!external.some((u) => /gohighlevel|leadconnector|hubapi|zapier/i.test(u))) ok(`${route} no CRM request`);
      else bad(`${route} CRM request leaked`);
      await ctx.close();
    }

    // Results off-sitemap design surface
    {
      const ctx = await browser.newContext({ viewport: VIEWPORTS.desktop });
      const page = await ctx.newPage();
      await page.goto(`${BASE}/results/`, { waitUntil: "networkidle" });
      await page.waitForTimeout(600);
      const m = await mockCount(page);
      if (m > 0) ok(`results design mocks labeled count=${m}`);
      else ok("results empty or verified-only (acceptable)");
      if (await noindex(page)) ok("results noindex");
      else bad("results noindex missing");
      await page.screenshot({ path: path.join(SHOTS, "results.png") });
      await ctx.close();
    }

    // Footer / nav presence
    {
      const ctx = await browser.newContext({ viewport: VIEWPORTS.desktop });
      const page = await ctx.newPage();
      await page.goto(`${BASE}/about/`, { waitUntil: "networkidle" });
      await page.waitForTimeout(400);
      const footerLinks = await page.locator("footer a, .site-footer a").count();
      if (footerLinks > 3) ok(`footer links ${footerLinks}`);
      else bad(`footer links low ${footerLinks}`);
      await ctx.close();
    }
  } finally {
    await browser.close();
    if (server) server.close();
  }

  const out = { pass: passN, fail: failN, ledger };
  fs.writeFileSync(path.join(__dirname, "results.json"), JSON.stringify(out, null, 2));
  console.log(`\n=== Stage 13 Browser QA ===\nPASS ${passN}  FAIL ${failN}`);
  process.exit(failN > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
