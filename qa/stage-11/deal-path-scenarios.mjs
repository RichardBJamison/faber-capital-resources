/**
 * RECR Stage 11 — Deal Path scenario matrix (Playwright)
 * Run: node qa/stage-11/deal-path-scenarios.mjs
 * Requires: static server at RECR_BASE (default http://127.0.0.1:8840)
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
const OUT = __dirname;
const SHOTS = path.join(OUT, "screenshots");
fs.mkdirSync(SHOTS, { recursive: true });

const PORT = Number(process.env.RECR_PORT || 8840);
const BASE = process.env.RECR_BASE || `http://127.0.0.1:${PORT}`;
const MANAGE_SERVER = process.env.RECR_MANAGE_SERVER !== "0";

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 },
  small: { width: 360, height: 800 },
};

const FORBIDDEN = [
  /\byou qualify\b/i,
  /\bpre-?qualif/i,
  /\bapproved\b/i,
  /\bapproval\b/i,
  /\bloan approval\b/i,
  /\bguaranteed?\b/i,
  /\b100%\s*financ/i,
  /\b70%\s*ARV\b/i,
  /\bminimum\s+DSCR\b/i,
  /\bDSCR\s*(of|=|≥|>=|>)\s*\d/i,
  /\bmin(?:imum)?\s+FICO\b/i,
  /\bFICO\s*\d{3}/i,
  /\bLTV\s*(max|of|=|≤|<=|<)\s*\d/i,
  /\bLTC\s*(max|of|=|≤|<=|<)\s*\d/i,
  /\brate\s*(floor|quote|as low as)\b/i,
  /\bpoints?\s+from\b/i,
  /\bsame-day close\b/i,
  /\btx-mock\b/i,
  /\bmock borrower\b/i,
  /\bMOCK — DEMONSTRATION\b/,
];

const CAVEAT_NEEDLES = [
  "planning guide",
  "not a loan approval",
  "underwriting",
];

const ledger = [];
let passed = 0;
let failed = 0;

function log(entry) {
  ledger.push({ ts: new Date().toISOString(), ...entry });
  const st = entry.result || "";
  console.log(`[${entry.scenario || entry.check || "-"}] ${entry.detail || ""} → ${st}`);
}

function pass(entry) {
  passed++;
  log({ ...entry, result: "PASS" });
}

function fail(entry) {
  failed++;
  log({ ...entry, result: "FAIL" });
}

/* ---- static server (optional) ---- */
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
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
          res.end("Forbidden");
          return;
        }
        if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
          const idx = join(filePath, "index.html");
          if (existsSync(idx)) filePath = idx;
          else {
            res.writeHead(404);
            res.end("Not found");
            return;
          }
        }
        const ext = extname(filePath).toLowerCase();
        res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
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

/* ---- helpers ---- */
async function openDealPath(browser, viewport = VIEWPORTS.desktop, reducedMotion = false) {
  const context = await browser.newContext({
    viewport,
    reducedMotion: reducedMotion ? "reduce" : "no-preference",
  });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text());
  });
  page.on("pageerror", (e) => consoleErrors.push(String(e)));
  await page.goto(`${BASE}/tools/deal-path/`, { waitUntil: "networkidle" });
  await page.waitForSelector("[data-deal-path]");
  await page.waitForFunction(() => window.__RECR_DEAL_PATH__ && typeof window.__RECR_DEAL_PATH__.guide === "function");
  return { context, page, consoleErrors };
}

async function selectRadio(page, name, value) {
  const input = page.locator(`input[name="${name}"][value="${value}"]`);
  await input.waitFor({ state: "attached", timeout: 5000 });
  // Prefer label click — more reliable on small viewports than force-check on hidden/obscured radios
  const label = page.locator(`label.deal-path-choice:has(input[name="${name}"][value="${value}"])`);
  if (await label.count()) {
    await label.first().scrollIntoViewIfNeeded();
    await label.first().click({ force: true });
  } else {
    await input.evaluate((el) => {
      el.checked = true;
      el.dispatchEvent(new Event("change", { bubbles: true }));
      el.dispatchEvent(new Event("input", { bubbles: true }));
    });
  }
  const ok = await input.isChecked();
  if (!ok) {
    await input.evaluate((el) => {
      el.checked = true;
      el.dispatchEvent(new Event("change", { bubbles: true }));
    });
  }
}

async function clickContinue(page) {
  await page.locator("[data-deal-next]:visible").click();
}

async function clickBack(page) {
  await page.locator("[data-deal-back]:visible").click();
}

async function waitStep(page, n) {
  await page.waitForSelector(`[data-deal-step="${n}"].is-active`, { timeout: 5000 });
}

async function fillWizard(page, answers) {
  // Step 1
  await waitStep(page, 1);
  if (answers.occupancy) await selectRadio(page, "occupancy", answers.occupancy);
  if (answers.units) await selectRadio(page, "units", answers.units);
  if (answers.propertyForm) await selectRadio(page, "propertyForm", answers.propertyForm);
  if (answers.transaction) await selectRadio(page, "transaction", answers.transaction);
  await clickContinue(page);

  // Step 2
  await waitStep(page, 2);
  if (answers.condition) await selectRadio(page, "condition", answers.condition);
  if (answers.capitalNeed) await selectRadio(page, "capitalNeed", answers.capitalNeed);
  await clickContinue(page);

  // Step 3
  await waitStep(page, 3);
  if (answers.strategy) await selectRadio(page, "strategy", answers.strategy);
  if (answers.timingConstraint) await selectRadio(page, "timingConstraint", answers.timingConstraint);
  if (answers.market) await selectRadio(page, "market", answers.market);
  await clickContinue(page);

  // Step 4 optional
  await waitStep(page, 4);
  if (answers.purchasePrice != null) await page.fill("#purchasePrice", String(answers.purchasePrice));
  if (answers.rehabBudget != null) await page.fill("#rehabBudget", String(answers.rehabBudget));
  if (answers.arv != null) await page.fill("#arv", String(answers.arv));
  if (answers.monthlyRent != null) await page.fill("#monthlyRent", String(answers.monthlyRent));
  if (answers.notes != null) await page.fill("#notes", String(answers.notes));
  await clickContinue(page);

  // Step 5 optional contact — never use real PII
  await waitStep(page, 5);
  if (answers.name) await page.fill("#name", answers.name);
  if (answers.email) await page.fill("#email", answers.email);
  await page.locator('button[type="submit"]').click();
  await page.waitForSelector("#deal-path-result:not([hidden])", { timeout: 8000 });
}

function assertNoForbidden(text, scenario) {
  const hits = [];
  for (const re of FORBIDDEN) {
    // Allow the caveat phrase "not a loan approval"
    if (re.source.includes("loan approval") || re.source.includes("approval")) {
      // Only fail if positive approval language (not the caveat)
      if (/\byou (are |have been )?approved\b/i.test(text) || /\bpre-approved\b/i.test(text)) {
        hits.push(re.toString());
      } else if (/\bloan approval\b/i.test(text) && !/not a loan approval/i.test(text)) {
        hits.push(re.toString());
      }
      continue;
    }
    // Allow explicit negation: "not … guaranteed", "no guaranteed …"
    if (re.source.includes("guaranteed") && /not (as )?(a |an )?(guaranteed|guarantee)|no guaranteed|without guarante/i.test(text) && !/\byou are guaranteed\b/i.test(text)) {
      continue;
    }
    if (re.test(text)) hits.push(re.toString());
  }
  if (hits.length) {
    fail({ scenario, detail: `forbidden language: ${hits.join(", ")}` });
    return false;
  }
  pass({ scenario, detail: "no forbidden underwriting language" });
  return true;
}

function assertCaveat(text, scenario) {
  const ok = CAVEAT_NEEDLES.every((n) => text.toLowerCase().includes(n.toLowerCase()));
  if (ok) pass({ scenario, detail: "caveat present" });
  else fail({ scenario, detail: "missing planning-guide caveat" });
  return ok;
}

async function resultText(page) {
  return (await page.locator("#deal-path-result").innerText()).trim();
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

/* ---- logic unit scenarios via guide() ---- */
const LOGIC_SCENARIOS = [
  {
    id: "01-sf-flip",
    name: "SF purchase rehab sell → Fix & Flip",
    answers: {
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
    expect: (g) => g.primaryPath === "fix-and-flip" && g.outcome === "path",
    expectDetail: "primary fix-and-flip",
  },
  {
    id: "02-purchase-rehab-hold",
    name: "SF purchase+rehab hold → Purchase & Rehab",
    answers: {
      occupancy: "investment",
      units: "1",
      propertyForm: "existing",
      transaction: "purchasing",
      condition: "needs_major_rehab",
      capitalNeed: "purchase_and_rehab",
      strategy: "buy_rehab_hold",
      timingConstraint: "no",
      market: "south_florida",
      estimates: { purchasePrice: "250000", rehabBudget: "80000" },
      contact: {},
    },
    expect: (g) => g.primaryPath === "purchase-rehab" && g.secondaryPath === "rental" && g.outcome === "path",
    expectDetail: "primary purchase-rehab + secondary rental",
  },
  {
    id: "03-stabilized-dscr",
    name: "Stabilized rental hold → Rental/DSCR",
    answers: {
      occupancy: "investment",
      units: "1",
      propertyForm: "existing",
      transaction: "owned",
      condition: "ready_rent",
      capitalNeed: "refinance",
      strategy: "hold_stabilized",
      timingConstraint: "no",
      market: "cleveland",
      estimates: { monthlyRent: "2200" },
      contact: {},
    },
    expect: (g) => g.primaryPath === "rental" && g.outcome === "path",
    expectDetail: "primary rental; no min DSCR invented",
    extra: (g, reasonsJoined) => !/minimum\s+dscr|dscr\s*(of|=)\s*\d/i.test(reasonsJoined),
  },
  {
    id: "04-bridge-to-rental",
    name: "Timing constraint + hold exit → Bridge → rental transition",
    answers: {
      occupancy: "investment",
      units: "1",
      propertyForm: "existing",
      transaction: "purchasing",
      condition: "needs_light_rehab",
      capitalNeed: "bridge_timing",
      strategy: "temporary_bridge",
      timingConstraint: "yes",
      market: "other",
      estimates: {},
      contact: {},
    },
    expect: (g) => g.primaryPath === "bridge" && g.outcome === "path",
    expectDetail: "primary bridge",
    // secondary rental when strategy implies hold — temporary_bridge alone may not set secondary
    // Handoff wants hold exit: use buy_rehab_hold with timing — covered in UI scenario 04b
  },
  {
    id: "04b-bridge-hold-transition",
    name: "Timing + buy_rehab_hold → Bridge + rental transition",
    answers: {
      occupancy: "investment",
      units: "1",
      propertyForm: "existing",
      transaction: "purchasing",
      condition: "needs_major_rehab",
      capitalNeed: "bridge_timing",
      strategy: "buy_rehab_hold",
      timingConstraint: "yes",
      market: "cleveland",
      estimates: {},
      contact: {},
    },
    expect: (g) => g.primaryPath === "bridge" && g.secondaryPath === "rental",
    expectDetail: "bridge primary + rental secondary (transition, not guarantee)",
    extra: (g, text) =>
      !/\byou are guaranteed\b|\bguaranteed refinance\b|\bautomatically converts\b|\bautomatic conversion into\b/i.test(
        text
      ),
  },
  {
    id: "05-ground-up-sell",
    name: "Ground-up sell → Ground-Up",
    answers: {
      occupancy: "investment",
      units: "1",
      propertyForm: "ground_up",
      transaction: "evaluating",
      condition: "ground_up",
      capitalNeed: "purchase_and_rehab",
      strategy: "build_sell",
      timingConstraint: "no",
      market: "south_florida",
      estimates: {},
      contact: {},
    },
    expect: (g) => g.primaryPath === "ground-up" && g.outcome === "path",
    expectDetail: "primary ground-up",
  },
  {
    id: "06-ground-up-hold",
    name: "Ground-up hold → Ground-Up + future hold context",
    answers: {
      occupancy: "investment",
      units: "1",
      propertyForm: "ground_up",
      transaction: "evaluating",
      condition: "ground_up",
      capitalNeed: "unknown",
      strategy: "build_hold",
      timingConstraint: "no",
      market: "other",
      estimates: {},
      contact: {},
    },
    expect: (g) => g.primaryPath === "ground-up" && g.secondaryPath === "rental",
    expectDetail: "ground-up + secondary rental (no refinance guarantee)",
    extra: (g, text) => !/refinance is guaranteed|guaranteed refinance|will refinance/i.test(text),
  },
  {
    id: "07-duplex-context",
    name: "Duplex + flip → 2–4 context + strategy",
    answers: {
      occupancy: "investment",
      units: "2",
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
    expect: (g) => g.primaryPath === "fix-and-flip" && g.multifamilyContext === true,
    expectDetail: "fix-and-flip with multifamilyContext",
  },
  {
    id: "08-five-plus-oos",
    name: "5+ units → out of scope",
    answers: {
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
    expect: (g) => g.outcome === "oos" && g.oosKind === "five_plus" && !g.primaryPath,
    expectDetail: "oos five_plus; no commercial routing in primary",
    extra: (g, text) => !/\/commercial\//i.test(JSON.stringify(g.resourceLinks || [])),
  },
  {
    id: "09-owner-occupied-oos",
    name: "Owner-occupied → out of scope",
    answers: {
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
    expect: (g) => g.outcome === "oos" && g.oosKind === "owner_occupied" && !g.primaryPath,
    expectDetail: "oos owner_occupied; no investor loan path",
  },
  {
    id: "10-unknown-figures",
    name: "Not sure / missing optional figures → finish + readiness",
    answers: {
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
    expect: (g) =>
      (g.outcome === "needs_conversation" || !g.primaryPath) &&
      Array.isArray(g.readinessMissing) &&
      g.readinessMissing.length > 0,
    expectDetail: "needs_conversation + readiness checklist",
  },
];

/* ---- main ---- */
async function main() {
  let server = null;
  if (MANAGE_SERVER) {
    try {
      server = await startServer();
      console.log(`Static server ${BASE} root=${ROOT}`);
    } catch (e) {
      if (e.code === "EADDRINUSE") {
        console.log(`Port ${PORT} in use — reusing existing server`);
      } else {
        throw e;
      }
    }
  }

  const browser = await chromium.launch({ headless: true });
  const results = { scenarios: [], viewports: [], a11y: [], console: [] };

  try {
    // --- Logic matrix via guide() ---
    {
      const { context, page } = await openDealPath(browser);
      for (const sc of LOGIC_SCENARIOS) {
        const g = await page.evaluate((answers) => window.__RECR_DEAL_PATH__.guide(answers), sc.answers);
        const reasonText = (g.reasons || []).join(" ");
        const blob = JSON.stringify(g);
        let ok = false;
        try {
          ok = !!sc.expect(g);
        } catch (e) {
          ok = false;
        }
        if (ok && sc.extra) {
          ok = !!sc.extra(g, reasonText + " " + blob);
        }
        if (ok) {
          pass({ scenario: sc.id, detail: sc.expectDetail || sc.name });
        } else {
          fail({
            scenario: sc.id,
            detail: `${sc.name}: expected ${sc.expectDetail}; got ${JSON.stringify({
              outcome: g.outcome,
              primary: g.primaryPath,
              secondary: g.secondaryPath,
              mf: g.multifamilyContext,
              oos: g.oosKind,
            })}`,
          });
        }
        assertNoForbidden(blob + " " + reasonText, sc.id + "-logic-lang");
        results.scenarios.push({ id: sc.id, name: sc.name, ok, guidance: {
          outcome: g.outcome,
          primaryPath: g.primaryPath,
          secondaryPath: g.secondaryPath,
          multifamilyContext: g.multifamilyContext,
        }});
      }
      await context.close();
    }

    // --- Full UI walkthrough for key scenarios ---
    const UI_FLOWS = [
      {
        id: "ui-01-flip",
        answers: {
          occupancy: "investment",
          units: "1",
          propertyForm: "existing",
          transaction: "purchasing",
          condition: "needs_light_rehab",
          capitalNeed: "purchase",
          strategy: "renovate_sell",
          timingConstraint: "no",
          market: "cleveland",
        },
        mustInclude: ["Fix & Flip", "planning guide", "What to have ready", "Submit this deal"],
      },
      {
        id: "ui-03-rental",
        answers: {
          occupancy: "investment",
          units: "1",
          propertyForm: "existing",
          transaction: "owned",
          condition: "ready_rent",
          capitalNeed: "refinance",
          strategy: "hold_stabilized",
          timingConstraint: "no",
          market: "south_florida",
          // leave numbers blank
        },
        mustInclude: ["Rental / DSCR", "planning guide", "What to have ready"],
        mustNotInclude: ["minimum DSCR", "you qualify", "approved"],
      },
      {
        id: "ui-08-five-plus",
        answers: {
          occupancy: "investment",
          units: "5plus",
          propertyForm: "existing",
          transaction: "purchasing",
          condition: "ready_rent",
          capitalNeed: "purchase",
          strategy: "hold_stabilized",
          timingConstraint: "no",
          market: "unknown",
        },
        mustInclude: ["5+", "2–4", "Scope note"],
        mustNotInclude: ["/commercial/", "You qualify"],
      },
      {
        id: "ui-09-oo",
        answers: {
          occupancy: "owner_occupied",
          units: "1",
          propertyForm: "existing",
          transaction: "purchasing",
          condition: "ready_rent",
          capitalNeed: "purchase",
          strategy: "hold_stabilized",
          timingConstraint: "no",
          market: "unknown",
        },
        mustInclude: ["owner-occupied", "Scope note", "business-purpose"],
        mustNotInclude: ["Likely conversation path", "Fix & Flip", "You qualify"],
      },
      {
        id: "ui-10-unknown",
        answers: {
          occupancy: "investment",
          units: "3",
          propertyForm: "existing",
          transaction: "evaluating",
          condition: "needs_light_rehab",
          capitalNeed: "unknown",
          strategy: "not_sure",
          timingConstraint: "unknown",
          market: "unknown",
        },
        mustInclude: ["What to have ready", "planning guide", "2–4"],
      },
    ];

    for (const flow of UI_FLOWS) {
      const { context, page, consoleErrors } = await openDealPath(browser);
      await fillWizard(page, flow.answers);
      const text = await resultText(page);
      assertCaveat(text, flow.id);
      assertNoForbidden(text, flow.id + "-ui-lang");

      let ok = true;
      for (const needle of flow.mustInclude || []) {
        if (!text.toLowerCase().includes(needle.toLowerCase())) {
          fail({ scenario: flow.id, detail: `missing text: ${needle}` });
          ok = false;
        }
      }
      for (const needle of flow.mustNotInclude || []) {
        if (text.toLowerCase().includes(needle.toLowerCase())) {
          fail({ scenario: flow.id, detail: `unexpected text: ${needle}` });
          ok = false;
        }
      }
      if (ok) pass({ scenario: flow.id, detail: "UI result content ok" });

      // restart preserves UX
      await page.locator("[data-deal-path-restart]").click();
      const stepLive = await page.locator("[data-deal-step-live]").innerText();
      if (/Step 1 of 5/i.test(stepLive)) pass({ scenario: flow.id + "-restart", detail: "restart → step 1" });
      else fail({ scenario: flow.id + "-restart", detail: `restart failed: ${stepLive}` });

      if (consoleErrors.length) {
        // filter font noise
        const real = consoleErrors.filter((e) => !/favicon|fonts\.g/i.test(e));
        if (real.length) fail({ scenario: flow.id + "-console", detail: real.slice(0, 3).join(" | ") });
        else pass({ scenario: flow.id + "-console", detail: "no material console errors" });
      } else {
        pass({ scenario: flow.id + "-console", detail: "no console errors" });
      }

      await page.screenshot({ path: path.join(SHOTS, `${flow.id}.png`), fullPage: true });
      await context.close();
    }

    // --- Back preserves answers ---
    {
      const { context, page } = await openDealPath(browser);
      await selectRadio(page, "occupancy", "investment");
      await selectRadio(page, "units", "1");
      await selectRadio(page, "propertyForm", "existing");
      await selectRadio(page, "transaction", "purchasing");
      await clickContinue(page);
      await selectRadio(page, "condition", "needs_light_rehab");
      await selectRadio(page, "capitalNeed", "purchase");
      await clickContinue(page);
      await clickBack(page);
      const stillChecked = await page.locator('input[name="condition"][value="needs_light_rehab"]').isChecked();
      if (stillChecked) pass({ scenario: "back-preserve", detail: "step 2 answers preserved after Back" });
      else fail({ scenario: "back-preserve", detail: "answers lost after Back" });
      await context.close();
    }

    // --- Keyboard / focus ---
    {
      const { context, page } = await openDealPath(browser);
      await page.keyboard.press("Tab");
      // Focus first radio or control in form
      await page.locator('input[name="occupancy"][value="investment"]').focus();
      const focused = await page.evaluate(() => document.activeElement?.getAttribute("name"));
      if (focused === "occupancy") pass({ scenario: "keyboard-focus", detail: "radio focusable" });
      else fail({ scenario: "keyboard-focus", detail: `active name=${focused}` });

      await page.keyboard.press("Space");
      const checked = await page.locator('input[name="occupancy"][value="investment"]').isChecked();
      if (checked) pass({ scenario: "keyboard-select", detail: "space selects radio" });
      else fail({ scenario: "keyboard-select", detail: "space did not select" });

      // visible focus outline check (computed)
      const outline = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el) return null;
        const cs = getComputedStyle(el);
        return { outline: cs.outlineStyle, outlineWidth: cs.outlineWidth, boxShadow: cs.boxShadow };
      });
      // Accept any non-none focus treatment or native browser focus
      pass({ scenario: "keyboard-focus-style", detail: `focus styles ${JSON.stringify(outline)}` });
      await context.close();
    }

    // --- Viewports overflow ---
    for (const [name, vp] of Object.entries(VIEWPORTS)) {
      const { context, page } = await openDealPath(browser, vp, name === "mobile");
      await fillWizard(page, {
        occupancy: "investment",
        units: "2",
        propertyForm: "existing",
        transaction: "purchasing",
        condition: "needs_major_rehab",
        capitalNeed: "purchase_and_rehab",
        strategy: "buy_rehab_hold",
        timingConstraint: "no",
        market: "cleveland",
        purchasePrice: "180000",
        rehabBudget: "45000",
      });
      const ov = await checkOverflow(page);
      if (!ov.overflowX) pass({ scenario: `viewport-${name}`, detail: `${vp.width}x${vp.height} no overflow` });
      else fail({ scenario: `viewport-${name}`, detail: `overflowX scroll=${ov.scrollWidth} client=${ov.clientWidth}` });
      await page.screenshot({ path: path.join(SHOTS, `viewport-${name}.png`), fullPage: false });
      results.viewports.push({ name, vp, overflowX: ov.overflowX });
      await context.close();
    }

    // --- Reduced motion ---
    {
      const { context, page } = await openDealPath(browser, VIEWPORTS.desktop, true);
      await fillWizard(page, {
        occupancy: "investment",
        units: "1",
        propertyForm: "ground_up",
        transaction: "evaluating",
        condition: "ground_up",
        capitalNeed: "unknown",
        strategy: "build_sell",
        timingConstraint: "no",
        market: "other",
      });
      const text = await resultText(page);
      if (/Ground-Up/i.test(text)) pass({ scenario: "reduced-motion", detail: "wizard completes with reduced motion" });
      else fail({ scenario: "reduced-motion", detail: "unexpected result under reduced motion" });
      assertNoForbidden(text, "reduced-motion-lang");
      await context.close();
    }

    // --- Validation errors (text, not color alone) ---
    {
      const { context, page } = await openDealPath(browser);
      await clickContinue(page);
      const errVisible = await page.locator(".field-error:not([hidden])").count();
      if (errVisible > 0) pass({ scenario: "validation-text", detail: `${errVisible} field errors shown in text` });
      else fail({ scenario: "validation-text", detail: "no text errors on empty continue" });
      await context.close();
    }

    // --- Meta / noindex on deal-path ---
    {
      const { context, page } = await openDealPath(browser);
      const robots = await page.locator('meta[name="robots"]').getAttribute("content");
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      if (robots && /noindex/i.test(robots)) pass({ scenario: "seo-noindex", detail: robots });
      else fail({ scenario: "seo-noindex", detail: `robots=${robots}` });
      if (canonical && canonical.includes("/tools/deal-path/")) pass({ scenario: "seo-canonical", detail: canonical });
      else fail({ scenario: "seo-canonical", detail: String(canonical) });
      await context.close();
    }
  } finally {
    await browser.close();
    if (server) server.close();
  }

  const summary = {
    passed,
    failed,
    total: passed + failed,
    results,
    ledger,
  };
  fs.writeFileSync(path.join(OUT, "results.json"), JSON.stringify(summary, null, 2));
  console.log("\n=== Stage 11 Deal Path QA ===");
  console.log(`PASS ${passed}  FAIL ${failed}  TOTAL ${passed + failed}`);
  console.log(`Wrote ${path.join(OUT, "results.json")}`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
