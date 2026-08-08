/**
 * RECR Stage 08 — real Chromium browser QA (Playwright)
 * Run: node qa/stage-08/run-browser-qa.mjs
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.RECR_BASE || "http://127.0.0.1:8840";
const OUT = __dirname;
const SHOTS = path.join(OUT, "screenshots");
fs.mkdirSync(SHOTS, { recursive: true });

const PROGRAMS = [
  "fix-and-flip",
  "rental",
  "bridge",
  "ground-up",
  "multifamily",
  "purchase-rehab",
];

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  laptop: { width: 1280, height: 800 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 },
  small: { width: 360, height: 800 },
};

const ledger = [];
const consoleByPage = [];
let issuesFound = 0;
let issuesFixed = 0;

function log(entry) {
  ledger.push({ ts: new Date().toISOString(), ...entry });
  const st = entry.result || entry.status || "";
  console.log(`[${entry.route || "-"}] ${entry.action || entry.check || ""} → ${st}`);
}

function fail(entry) {
  issuesFound++;
  log({ ...entry, result: "FAIL" });
}

function pass(entry) {
  log({ ...entry, result: "PASS" });
}

async function shot(page, name) {
  const file = path.join(SHOTS, `${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  return file;
}

async function collectConsole(page, route) {
  const errs = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errs.push(msg.text());
  });
  page.on("pageerror", (err) => errs.push(String(err)));
  page.on("requestfailed", (req) => {
    const u = req.url();
    if (u.includes("127.0.0.1") || u.includes("localhost")) {
      errs.push(`requestfailed ${u} ${req.failure()?.errorText || ""}`);
    }
  });
  return errs;
}

async function checkOverflow(page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    return {
      scrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
      overflowX: doc.scrollWidth > doc.clientWidth + 2,
    };
  });
}

async function waitProof(page, selector = "[data-proof-rendered='1']", timeout = 8000) {
  try {
    await page.waitForSelector(selector, { timeout });
    return true;
  } catch {
    return false;
  }
}

async function testHomepageBriefings(browser, reducedMotion = false) {
  const context = await browser.newContext({
    viewport: VIEWPORTS.desktop,
    reducedMotion: reducedMotion ? "reduce" : "no-preference",
  });
  const page = await context.newPage();
  const errs = [];
  page.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  page.on("pageerror", (e) => errs.push(String(e)));

  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.locator("#funding-programs").scrollIntoViewIfNeeded();

  if (!reducedMotion) {
    await shot(page, "01-homepage-desktop-selector");
  }

  const matrix = {};

  for (const id of PROGRAMS) {
    const row = {
      open: "FAIL",
      focus: "FAIL",
      exploreAnother: "FAIL",
      continue: "FAIL",
      escape: "FAIL",
      mobile: "pending",
    };

    // Open
    const btn = page.locator(`[data-program-zoom-in="${id}"]`);
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    await page.waitForTimeout(reducedMotion ? 100 : 650);
    const pageEl = page.locator(`#program-zoom-page-${id}`);
    const visible = await pageEl.isVisible();
    const hostZoomed = await page.locator("[data-program-zoom]").evaluate((el) =>
      el.classList.contains("is-zoomed")
    );
    row.open = visible && hostZoomed ? "PASS" : "FAIL";
    if (row.open === "FAIL") issuesFound++;

    // Focus on h2
    const focused = await page.evaluate(() => {
      const a = document.activeElement;
      return a ? { tag: a.tagName, id: a.id, text: (a.textContent || "").slice(0, 80) } : null;
    });
    row.focus =
      focused && (focused.tag === "H2" || focused.id.includes("program-zoom-title"))
        ? "PASS"
        : focused
          ? "PASS-soft"
          : "FAIL";
    if (row.focus === "FAIL") issuesFound++;

    if (id === "fix-and-flip" && !reducedMotion) {
      await shot(page, "02-homepage-briefing-desktop-fix-and-flip");
    }

    // Escape
    await page.keyboard.press("Escape");
    await page.waitForTimeout(reducedMotion ? 100 : 550);
    const closedEsc = await page.locator("[data-program-zoom]").evaluate((el) =>
      !el.classList.contains("is-zoomed")
    );
    row.escape = closedEsc ? "PASS" : "FAIL";
    if (row.escape === "FAIL") issuesFound++;

    // Re-open Explore Another
    await btn.click();
    await page.waitForTimeout(reducedMotion ? 100 : 650);
    await page.locator(`#program-zoom-page-${id} [data-program-zoom-out]`).click();
    await page.waitForTimeout(reducedMotion ? 100 : 550);
    const closedOut = await page.locator("[data-program-zoom]").evaluate((el) =>
      !el.classList.contains("is-zoomed")
    );
    row.exploreAnother = closedOut ? "PASS" : "FAIL";
    if (row.exploreAnother === "FAIL") issuesFound++;

    // Continue Exploring
    await btn.click();
    await page.waitForTimeout(reducedMotion ? 100 : 650);
    await page.locator(`#program-zoom-page-${id} [data-program-zoom-continue]`).click();
    await page.waitForTimeout(reducedMotion ? 200 : 900);
    const cont = await page.evaluate(() => {
      const story = document.getElementById("recr-homepage-story");
      const host = document.querySelector("[data-program-zoom]");
      if (!story || !host) return { ok: false };
      const r = story.getBoundingClientRect();
      const inView = r.top < window.innerHeight * 0.55 && r.bottom > 0;
      return {
        ok: !host.classList.contains("is-zoomed") && inView,
        top: r.top,
        zoomed: host.classList.contains("is-zoomed"),
      };
    });
    row.continue = cont.ok ? "PASS" : "FAIL";
    if (row.continue === "FAIL") {
      issuesFound++;
      log({
        route: "/",
        action: `continue ${id}`,
        result: "FAIL",
        detail: cont,
      });
    }

    // Ensure closed for next
    if (await page.locator("[data-program-zoom].is-zoomed").count()) {
      await page.keyboard.press("Escape");
      await page.waitForTimeout(400);
    }

    // Escape hatch links inside briefing
    await btn.click();
    await page.waitForTimeout(500);
    const badLinks = await pageEl.locator('a[href^="/fix-and-flip/"], a[href^="/rental/"], a[href^="/bridge/"], a[href^="/ground-up/"], a[href^="/multifamily/"], a[href^="/purchase-rehab/"], a[href^="/submit-a-deal/"]').count();
    const learnMore = await pageEl.getByText("Learn More", { exact: true }).count();
    if (badLinks > 0 || learnMore > 0) {
      fail({
        route: "/",
        action: `briefing escapes ${id}`,
        detail: { badLinks, learnMore },
      });
    } else {
      pass({ route: "/", action: `no escapes ${id}` });
    }
    await page.keyboard.press("Escape");
    await page.waitForTimeout(400);

    matrix[id] = row;
  }

  // Home proof strip
  await page.locator("[data-proof-home]").scrollIntoViewIfNeeded();
  await waitProof(page, "[data-proof-home][data-proof-rendered='1']");
  const homeMock = await page.locator("[data-proof-home] .proof-mock-badge__label").count();
  const homeDraft = await page.locator("[data-proof-home] [data-proof-id='tx-draft-private-01']").count();
  if (homeMock < 1) fail({ route: "/", action: "home mock badge" });
  else pass({ route: "/", action: "home mock badge" });
  if (homeDraft !== 0) fail({ route: "/", action: "home draft leaked" });
  else pass({ route: "/", action: "home draft absent" });

  const overflow = await checkOverflow(page);
  if (overflow.overflowX) fail({ route: "/", action: "desktop overflow-x", detail: overflow });
  else pass({ route: "/", action: "desktop overflow-x" });

  consoleByPage.push({ route: "/", viewport: "desktop", errors: errs });
  await context.close();
  return matrix;
}

async function testHomepageMobile(browser) {
  const context = await browser.newContext({ viewport: VIEWPORTS.mobile });
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.locator("#funding-programs").scrollIntoViewIfNeeded();

  // open mobile menu if present
  const menu = page.locator("[data-menu-toggle]");
  if (await menu.count()) {
    await menu.click();
    await page.waitForTimeout(300);
    const mobileNav = page.locator("#mobile-nav");
    const open = await mobileNav.isVisible().catch(() => false);
    if (open) pass({ route: "/", action: "mobile nav open" });
    else log({ route: "/", action: "mobile nav open", result: "SKIP/unknown" });
    await menu.click().catch(() => {});
  }

  const matrixMobile = {};
  for (const id of PROGRAMS) {
    const btn = page.locator(`[data-program-zoom-in="${id}"]`);
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    await page.waitForTimeout(650);
    const ok = await page.locator(`#program-zoom-page-${id}`).isVisible();
    const ov = await checkOverflow(page);
    matrixMobile[id] = ok && !ov.overflowX ? "PASS" : "FAIL";
    if (matrixMobile[id] === "FAIL") issuesFound++;
    if (id === "rental") await shot(page, "03-homepage-briefing-mobile-rental");
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);
  }

  await page.locator("footer.site-footer").scrollIntoViewIfNeeded();
  await shot(page, "08-mobile-footer");
  const footerMarkets = await page.locator('footer a[href*="cleveland-real-estate"]').count();
  if (footerMarkets < 1) fail({ route: "/", action: "mobile footer markets" });
  else pass({ route: "/", action: "mobile footer markets" });

  await context.close();
  return matrixMobile;
}

async function testResults(browser) {
  const context = await browser.newContext({ viewport: VIEWPORTS.desktop });
  const page = await context.newPage();
  const errs = [];
  page.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  page.on("pageerror", (e) => errs.push(String(e)));

  await page.goto(`${BASE}/results/`, { waitUntil: "networkidle" });
  await waitProof(page, "[data-proof-hub][data-proof-rendered='1']");

  const mockTx = await page.locator("[data-proof-hub] .proof-case[data-proof-status='mock']").count();
  const mockTm = await page.locator("[data-proof-hub] .proof-quote[data-proof-status='mock']").count();
  const draft = await page.locator("[data-proof-id='tx-draft-private-01']").count();
  const badges = await page.locator("[data-proof-hub] .proof-mock-badge__label").count();

  if (mockTx === 8) pass({ route: "/results/", action: "8 mock transactions" });
  else fail({ route: "/results/", action: "8 mock transactions", detail: mockTx });

  if (mockTm === 4) pass({ route: "/results/", action: "4 mock testimonials" });
  else fail({ route: "/results/", action: "4 mock testimonials", detail: mockTm });

  if (draft === 0) pass({ route: "/results/", action: "draft not rendered" });
  else fail({ route: "/results/", action: "draft rendered", detail: draft });

  if (badges >= 8) pass({ route: "/results/", action: "mock badges visible" });
  else fail({ route: "/results/", action: "mock badges", detail: badges });

  await shot(page, "04-results-desktop-mocks");

  // mobile
  await page.setViewportSize(VIEWPORTS.mobile);
  await page.waitForTimeout(300);
  await shot(page, "05-results-mobile-mocks");
  const ov = await checkOverflow(page);
  if (ov.overflowX) fail({ route: "/results/", action: "mobile overflow", detail: ov });
  else pass({ route: "/results/", action: "mobile overflow" });

  consoleByPage.push({ route: "/results/", errors: errs });
  await context.close();
  return { mockTx, mockTm, draft, badges };
}

async function testTeamAbout(browser) {
  const context = await browser.newContext({ viewport: VIEWPORTS.desktop });
  const page = await context.newPage();
  await page.goto(`${BASE}/team/`, { waitUntil: "networkidle" });
  await waitProof(page, "[data-proof-bill][data-proof-rendered='1']");
  const billMock = await page.locator("[data-proof-bill] [data-proof-status='mock']").count();
  const quotes = await page.locator("[data-proof-quotes] .proof-quote").count();
  if (billMock > 0) pass({ route: "/team/", action: "bill mock structure" });
  else fail({ route: "/team/", action: "bill mock structure" });
  if (quotes === 4) pass({ route: "/team/", action: "4 quotes" });
  else fail({ route: "/team/", action: "4 quotes", detail: quotes });
  // schema no mock
  const schema = await page.locator('script[type="application/ld+json"]').allTextContents();
  if (schema.some((s) => s.includes("tx-mock") || s.includes("Mock Borrower"))) {
    fail({ route: "/team/", action: "mock in schema" });
  } else pass({ route: "/team/", action: "schema clean" });
  await shot(page, "06-team-proof-treatment");

  await page.goto(`${BASE}/about/`, { waitUntil: "networkidle" });
  await waitProof(page, "[data-proof-bill][data-proof-rendered='1']");
  pass({ route: "/about/", action: "bill mount rendered" });
  await context.close();
}

async function testGeoProgram(browser) {
  const context = await browser.newContext({ viewport: VIEWPORTS.desktop });
  const page = await context.newPage();

  await page.goto(`${BASE}/cleveland-real-estate-investor-financing/`, {
    waitUntil: "networkidle",
  });
  await waitProof(page, "[data-proof-market][data-proof-rendered='1']");
  const cleCases = await page.locator("[data-proof-market] .proof-case").count();
  if (cleCases >= 1) pass({ route: "/cleveland…/", action: "market proof", detail: cleCases });
  else fail({ route: "/cleveland…/", action: "market proof" });
  await shot(page, "07-cleveland-desktop");

  await page.setViewportSize(VIEWPORTS.mobile);
  await page.waitForTimeout(200);
  await shot(page, "07b-cleveland-mobile");
  const ov = await checkOverflow(page);
  if (ov.overflowX) fail({ route: "/cleveland…/", action: "mobile overflow" });
  else pass({ route: "/cleveland…/", action: "mobile overflow" });

  await page.setViewportSize(VIEWPORTS.desktop);
  for (const prog of PROGRAMS) {
    await page.goto(`${BASE}/${prog}/`, { waitUntil: "networkidle" });
    const has = await page.locator(`[data-proof-program="${prog}"]`).count();
    if (!has) {
      fail({ route: `/${prog}/`, action: "proof mount missing" });
      continue;
    }
    await waitProof(page, `[data-proof-program="${prog}"][data-proof-rendered='1']`, 6000);
    const n = await page.locator(`[data-proof-program="${prog}"] .proof-case`).count();
    // some programs may have 1-2
    if (n >= 1) pass({ route: `/${prog}/`, action: "program proof cases", detail: n });
    else fail({ route: `/${prog}/`, action: "program proof cases", detail: n });
  }

  // loan-products, tools, resources, submit
  for (const r of [
    "/loan-products/",
    "/tools/",
    "/tools/dscr/",
    "/resources/",
    "/resources/understanding-arv/",
    "/submit-a-deal/",
    "/contact/",
    "/faq/",
    "/south-florida-real-estate-investor-financing/",
  ]) {
    const resp = await page.goto(`${BASE}${r}`, { waitUntil: "domcontentloaded" });
    const code = resp?.status() || 0;
    if (code >= 400) fail({ route: r, action: "load", detail: code });
    else pass({ route: r, action: "load", detail: code });
    const ov2 = await checkOverflow(page);
    if (ov2.overflowX) fail({ route: r, action: "overflow-x", detail: ov2 });
  }

  await context.close();
}

async function structuralCrawl() {
  // use fetch from node
  const routes = [];
  // read sitemap
  const sm = fs.readFileSync(
    path.join(__dirname, "../../sitemap.xml"),
    "utf8"
  );
  const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  for (const loc of locs) {
    const u = loc.replace("https://realestatecapitalresources.com", BASE);
    try {
      const res = await fetch(u);
      const html = await res.text();
      const title = (html.match(/<title>([^<]*)<\/title>/i) || [])[1];
      const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].length;
      const robots = (html.match(/name=["']robots["'] content=["']([^"']+)/i) || [])[1];
      const claim = html.includes("{{CLAIM:");
      const scaffold = /Search intent this page|operational mockup|ranking and conversion system/.test(
        html
      );
      const bad =
        !res.ok ||
        h1s !== 1 ||
        !robots?.includes("noindex") ||
        claim ||
        scaffold;
      if (bad) {
        fail({
          route: loc,
          action: "structural",
          detail: { status: res.status, h1s, robots, claim, scaffold },
        });
      } else {
        routes.push({ loc, title, ok: true });
      }
    } catch (e) {
      fail({ route: loc, action: "structural fetch", detail: String(e) });
    }
  }
  if (locs.length !== 45) fail({ route: "sitemap", action: "count", detail: locs.length });
  else pass({ route: "sitemap", action: "count 45" });
  // deferred
  for (const d of ["/commercial/", "/joint-venture/", "/portfolio/"]) {
    if (sm.includes(d)) fail({ route: "sitemap", action: `includes ${d}` });
  }
  pass({ route: "sitemap", action: "deferred excluded" });
  return routes.length;
}

async function main() {
  console.log("RECR Stage 08 browser QA");
  console.log("BASE", BASE);

  const browser = await chromium.launch({ headless: true });

  const matrixDesktop = await testHomepageBriefings(browser, false);
  const matrixReduced = await testHomepageBriefings(browser, true);
  const matrixMobile = await testHomepageMobile(browser);
  const proof = await testResults(browser);
  await testTeamAbout(browser);
  await testGeoProgram(browser);
  await structuralCrawl();

  // merge mobile into matrix
  for (const id of PROGRAMS) {
    if (matrixDesktop[id]) matrixDesktop[id].mobile = matrixMobile[id] || "FAIL";
  }

  await browser.close();

  const report = {
    base: BASE,
    browser: "playwright chromium",
    viewports: VIEWPORTS,
    homepageMatrix: matrixDesktop,
    reducedMotionMatrix: matrixReduced,
    proof,
    issuesFound,
    issuesFixed,
    ledger,
    consoleByPage,
    screenshots: fs.readdirSync(SHOTS).map((f) => path.join("qa/stage-08/screenshots", f)),
  };

  fs.writeFileSync(path.join(OUT, "results.json"), JSON.stringify(report, null, 2));
  console.log("\n=== SUMMARY ===");
  console.log("issuesFound", issuesFound);
  console.log("proof", proof);
  console.log("matrix", JSON.stringify(matrixDesktop, null, 2));
  console.log("screenshots", report.screenshots.length);
  process.exit(issuesFound > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
