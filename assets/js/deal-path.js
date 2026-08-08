/**
 * RECR Deal Path — conversation guidance (not underwriting)
 * Schema: recr.deal_path.v1
 */
(function () {
  "use strict";

  const SCHEMA = "recr.deal_path.v1";
  const ROOT_SEL = "[data-deal-path]";

  const PATHS = {
    "fix-and-flip": {
      label: "Fix & Flip",
      href: "/fix-and-flip/",
      blurb:
        "A conversation about short-term capital for purchase and renovation with a planned resale exit.",
    },
    "purchase-rehab": {
      label: "Purchase & Rehab",
      href: "/purchase-rehab/",
      blurb:
        "A conversation about stacking acquisition and major renovation into one capital plan — exit can be sale or hold, but the plan must be explicit.",
    },
    rental: {
      label: "Rental / DSCR",
      href: "/rental/",
      blurb:
        "A conversation about longer-term investment-rental financing where property income and debt service matter — not a consumer mortgage script.",
    },
    bridge: {
      label: "Bridge Financing",
      href: "/bridge/",
      blurb:
        "A conversation about temporary capital because timing or property condition does not yet match the intended longer-term state.",
    },
    "ground-up": {
      label: "Ground-Up Construction",
      href: "/ground-up/",
      blurb:
        "A conversation about construction capital structured around plans, budget, draws, completion, and a sale or hold takeout.",
    },
    multifamily: {
      label: "Small Multifamily (2–4)",
      href: "/multifamily/",
      blurb:
        "Property-type context for duplex, triplex, or fourplex residential investment within RECR’s 1–4 unit launch scope.",
    },
  };

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }
  function $all(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
  }

  function val(form, name) {
    const el = form.elements.namedItem(name);
    if (!el) return "";
    if (el instanceof RadioNodeList) {
      return el.value || "";
    }
    return (el.value || "").trim();
  }

  function basePath() {
    const parts = location.pathname.split("/").filter(Boolean);
    if (parts[0] === "faber-capital-resources") return "/faber-capital-resources";
    return "";
  }

  function p(path) {
    if (!path || !path.startsWith("/")) return path;
    return basePath() + path;
  }

  function collect(form) {
    return {
      occupancy: val(form, "occupancy"),
      units: val(form, "units"),
      propertyForm: val(form, "propertyForm"),
      transaction: val(form, "transaction"),
      condition: val(form, "condition"),
      capitalNeed: val(form, "capitalNeed"),
      strategy: val(form, "strategy"),
      timingConstraint: val(form, "timingConstraint"),
      market: val(form, "market"),
      estimates: {
        purchasePrice: val(form, "purchasePrice") || null,
        rehabBudget: val(form, "rehabBudget") || null,
        arv: val(form, "arv") || null,
        monthlyRent: val(form, "monthlyRent") || null,
        notes: val(form, "notes") || "",
      },
      contact: {
        name: val(form, "name") || null,
        email: val(form, "email") || null,
        phone: val(form, "phone") || null,
      },
    };
  }

  function readinessMissing(a) {
    const m = [];
    if (!a.occupancy) m.push("Confirm investment vs owner-occupied intent");
    if (!a.units) m.push("Unit count / property scale");
    if (!a.propertyForm) m.push("Existing property vs ground-up");
    if (!a.strategy || a.strategy === "not_sure") m.push("Intended exit / strategy (even a provisional one)");
    if (!a.condition && a.propertyForm !== "ground_up") m.push("Property condition (ready vs needs work)");
    if (a.strategy === "renovate_sell" || a.strategy === "buy_rehab_hold" || a.condition === "needs_major_rehab" || a.condition === "needs_light_rehab") {
      if (!a.estimates.rehabBudget) m.push("Rehab / construction budget estimate (or “unknown — discuss”)");
    }
    if (a.strategy === "renovate_sell" || a.strategy === "buy_rehab_hold") {
      if (!a.estimates.arv) m.push("After-repair value assumption (if using resale math)");
    }
    if (a.strategy === "hold_stabilized" || a.strategy === "buy_rehab_hold" || a.strategy === "build_hold") {
      if (!a.estimates.monthlyRent) m.push("Expected monthly rent (estimate is fine)");
    }
    if (a.transaction === "purchasing" || a.transaction === "evaluating") {
      if (!a.estimates.purchasePrice) m.push("Purchase price or offer range (if known)");
    }
    if (a.timingConstraint === "yes" && a.strategy !== "temporary_bridge") {
      m.push("Clear statement of the timing constraint and the dated next step");
    }
    if (!a.market || a.market === "unknown") m.push("Market (Cleveland, South Florida, or other)");
    // Process readiness (educational — not underwriting gates; from verified process themes)
    m.push("Identity / entity basics (LLC or borrower identity package when asked)");
    m.push("Property package: address/contract status, photos, and the offer or current deed context");
    if (
      a.condition === "needs_light_rehab" ||
      a.condition === "needs_major_rehab" ||
      a.strategy === "renovate_sell" ||
      a.strategy === "buy_rehab_hold" ||
      a.propertyForm === "ground_up"
    ) {
      m.push("Scope/work orders or construction budget the appraiser and capital partner can follow");
    }
    if (a.strategy === "temporary_bridge" || a.timingConstraint === "yes") {
      m.push("Named next step / exit (sale, refinance conversation, or hold plan) — not a guaranteed takeout");
    }
    return m;
  }

  function resourcesFor(primary, secondary, a) {
    const links = [];
    const add = (label, href) => {
      if (!links.some((l) => l.href === href)) links.push({ label, href });
    };
    add("Which financing path fits?", "/resources/which-financing-path/");
    if (primary === "fix-and-flip" || secondary === "fix-and-flip" || primary === "purchase-rehab") {
      add("Fix & Flip vs Purchase & Rehab", "/resources/fix-and-flip-vs-purchase-rehab/");
      add("Understanding ARV", "/resources/understanding-arv/");
      add("MAO calculator", "/tools/mao/");
    }
    if (primary === "rental" || secondary === "rental") {
      add("DSCR explained", "/resources/dscr-explained/");
      add("DSCR calculator", "/tools/dscr/");
    }
    if (primary === "bridge" || secondary === "bridge" || a.timingConstraint === "yes") {
      add("Bridge exit risk", "/resources/bridge-exit-risk/");
      add("Bridge to DSCR", "/resources/bridge-to-dscr/");
    }
    if (primary === "ground-up") {
      add("Construction budget guide", "/resources/construction-budget/");
    }
    if (a.units === "2" || a.units === "3" || a.units === "4") {
      add("Small multifamily (2–4)", "/multifamily/");
    }
    add("Preparing a deal submission", "/resources/preparing-a-deal-submission/");
    add("Submission checklist", "/tools/checklist/");
    return links.slice(0, 4);
  }

  /**
   * Conceptual path logic only — no lender thresholds.
   */
  function guide(a) {
    const reasons = [];
    let outcome = "path";
    let primary = null;
    let secondary = null;
    let multifamilyContext = a.units === "2" || a.units === "3" || a.units === "4";

    // Scope exits
    if (a.occupancy === "owner_occupied") {
      return {
        outcome: "oos",
        oosKind: "owner_occupied",
        primaryPath: null,
        secondaryPath: null,
        multifamilyContext: false,
        reasons: [
          "You indicated owner-occupied / primary-residence intent. RECR’s current launch experience is for business-purpose investment property (non-owner-occupied where applicable).",
        ],
        readinessMissing: readinessMissing(a),
        resourceLinks: [
          { label: "About RECR’s role", href: "/about/" },
          { label: "Contact the desk", href: "/contact/" },
        ],
      };
    }

    if (a.units === "5plus") {
      return {
        outcome: "oos",
        oosKind: "five_plus",
        primaryPath: null,
        secondaryPath: null,
        multifamilyContext: false,
        reasons: [
          "You indicated 5+ units. RECR’s current small-multifamily launch scope is 2–4 residential units. We do not route this tool into deferred commercial product pages.",
        ],
        readinessMissing: readinessMissing(a),
        resourceLinks: [
          { label: "Small multifamily (2–4) scope", href: "/multifamily/" },
          { label: "Contact for a human read", href: "/contact/" },
        ],
      };
    }

    // Ground-up
    if (
      a.propertyForm === "ground_up" ||
      a.condition === "ground_up" ||
      a.strategy === "build_sell" ||
      a.strategy === "build_hold"
    ) {
      primary = "ground-up";
      reasons.push("The project starts with construction / plans rather than ordinary acquisition of an improved residence for light rehab.");
      if (a.strategy === "build_hold") {
        secondary = "rental";
        reasons.push("If the long-term plan is hold, a later rental/DSCR-style conversation may matter after completion — not as an automatic product conversion.");
      }
    } else if (a.strategy === "temporary_bridge" || (a.timingConstraint === "yes" && a.strategy !== "renovate_sell")) {
      primary = "bridge";
      reasons.push("You described a timing or condition constraint that needs temporary capital before the intended longer-term state.");
      if (a.strategy === "buy_rehab_hold" || a.strategy === "hold_stabilized" || a.strategy === "build_hold") {
        secondary = "rental";
        reasons.push("A defined hold exit suggests discussing bridge → stabilization → rental/DSCR as a sequence, not a single automatic product swap.");
      } else if (a.strategy === "renovate_sell") {
        secondary = "fix-and-flip";
        reasons.push("If the exit is sale after work, bridge and flip conversations can overlap — the dated exit still rules the bridge discussion.");
      }
    } else if (a.strategy === "hold_stabilized" || (a.condition === "ready_rent" && (a.strategy === "buy_rehab_hold" || a.capitalNeed === "refinance"))) {
      primary = "rental";
      reasons.push("The plan centers on holding investment rental property where income and debt service are part of the financing discussion.");
      if (a.condition === "needs_light_rehab" || a.condition === "needs_major_rehab") {
        secondary = "purchase-rehab";
        reasons.push("Work is still in the picture; acquisition/rehab capital may need discussion before a pure stabilized hold loan conversation.");
      }
    } else if (a.strategy === "buy_rehab_hold") {
      primary = "purchase-rehab";
      reasons.push("Acquisition plus renovation with a hold intent usually means the capital plan and the eventual hold conversation both matter.");
      secondary = "rental";
      if (a.timingConstraint === "yes") {
        reasons.push("Timing pressure may add a bridge-style temporary capital discussion before stabilization.");
        // keep secondary rental; mention bridge in reasons / resources
      }
    } else if (a.strategy === "renovate_sell") {
      if (a.condition === "needs_major_rehab" || a.capitalNeed === "purchase_and_rehab") {
        primary = "purchase-rehab";
        secondary = "fix-and-flip";
        reasons.push("Major renovation plus acquisition points to a purchase-and-rehab capital-plan conversation; resale exit also keeps fix-and-flip in view.");
      } else {
        primary = "fix-and-flip";
        reasons.push("Purchase/renovate/sell is the classic fix-and-flip conversation territory.");
        if (a.capitalNeed === "purchase_and_rehab") {
          secondary = "purchase-rehab";
          reasons.push("If purchase and rehab must be stacked tightly, also discuss purchase-and-rehab structuring.");
        }
      }
    } else if (a.strategy === "not_sure" || !a.strategy) {
      outcome = "needs_conversation";
      reasons.push("Strategy is still open — that is fine. A path conversation should start from property type, work, timing, and exit options rather than forcing a product label.");
    } else if (a.condition === "needs_major_rehab" && (a.capitalNeed === "purchase" || a.capitalNeed === "purchase_and_rehab" || a.transaction === "purchasing")) {
      primary = "purchase-rehab";
      reasons.push("Major work with acquisition capital in play suggests a purchase-and-rehab plan discussion.");
    } else if (a.condition === "ready_rent") {
      primary = "rental";
      reasons.push("Property described as ready to rent/hold points toward a rental/DSCR-style conversation.");
    } else {
      outcome = "needs_conversation";
      reasons.push("The combination of answers does not force a single product label — a short path review is the honest next step.");
    }

    // Multifamily context annotation (does not replace primary)
    if (multifamilyContext && primary && primary !== "multifamily" && primary !== "ground-up") {
      reasons.push("Unit count is 2–4: keep Small Multifamily (2–4) in view for property-type context alongside the capital strategy.");
    }
    if (multifamilyContext && !primary && outcome === "needs_conversation") {
      secondary = "multifamily";
    }
    if (multifamilyContext && primary === "rental") {
      // secondary multifamily as context
      if (!secondary) secondary = "multifamily";
    }

    const missing = readinessMissing(a);
    const resourceLinks = resourcesFor(primary, secondary, a);

    return {
      outcome: primary ? "path" : outcome,
      primaryPath: primary,
      secondaryPath: secondary,
      multifamilyContext,
      reasons,
      readinessMissing: missing,
      resourceLinks,
    };
  }

  function snapshotLines(a) {
    const lines = [];
    const map = {
      occupancy: { investment: "Investment / business-purpose intent", owner_occupied: "Owner-occupied intent" },
      units: { "1": "1 unit", "2": "2 units (duplex)", "3": "3 units (triplex)", "4": "4 units (fourplex)", "5plus": "5+ units" },
      propertyForm: { existing: "Existing improved property", ground_up: "Ground-up / construction" },
      transaction: { purchasing: "Purchasing / acquiring", owned: "Already owned", evaluating: "Evaluating a potential acquisition" },
      condition: {
        ready_rent: "Ready to rent / relatively stabilized",
        needs_light_rehab: "Needs light renovation",
        needs_major_rehab: "Needs major renovation",
        ground_up: "Ground-up construction",
      },
      capitalNeed: {
        purchase: "Purchase / acquisition capital",
        rehab: "Rehab capital",
        purchase_and_rehab: "Purchase + rehab together",
        refinance: "Refinance / recapitalize",
        bridge_timing: "Temporary / timing capital",
        unknown: "Capital need still open",
      },
      strategy: {
        renovate_sell: "Renovate and sell",
        buy_rehab_hold: "Acquire / renovate then hold",
        hold_stabilized: "Hold stabilized rental",
        build_sell: "Build then sell",
        build_hold: "Build then hold",
        temporary_bridge: "Temporary bridge to a defined next step",
        not_sure: "Not sure yet",
      },
      timingConstraint: { yes: "Timing constraint present", no: "No special timing pressure", unknown: "Timing unclear" },
      market: {
        cleveland: "Cleveland / Northeast Ohio",
        south_florida: "Fort Lauderdale / South Florida",
        other: "Other market",
        unknown: "Market not specified",
      },
    };
    Object.keys(map).forEach((k) => {
      if (a[k] && map[k][a[k]]) lines.push(map[k][a[k]]);
    });
    const e = a.estimates || {};
    if (e.purchasePrice) lines.push("Purchase / basis estimate: " + e.purchasePrice + " (user-supplied)");
    if (e.rehabBudget) lines.push("Rehab / construction budget estimate: " + e.rehabBudget + " (user-supplied)");
    if (e.arv) lines.push("ARV / value estimate: " + e.arv + " (user-supplied)");
    if (e.monthlyRent) lines.push("Monthly rent estimate: " + e.monthlyRent + " (user-supplied)");
    if (e.notes) lines.push("Notes: " + e.notes);
    return lines;
  }

  function renderResult(root, a, g) {
    const result = $("#deal-path-result", root);
    const caveat =
      "This is a planning guide, not a loan approval, commitment, quote, or underwriting decision. Available programs and terms depend on the property, borrower, lender, and final review.";

    let html = "";
    html += '<div class="deal-path-result-card" tabindex="-1" id="deal-path-result-focus">';
    html += '<p class="deal-path-caveat" role="note"><strong>Important:</strong> ' + caveat + "</p>";

    html += "<h2>Your deal snapshot</h2><ul class=\"deal-path-snapshot\">";
    snapshotLines(a).forEach((line) => {
      html += "<li>" + escapeHtml(line) + "</li>";
    });
    html += "</ul>";

    if (g.outcome === "oos") {
      html += "<h2>Scope note</h2>";
      html += '<p class="deal-path-lead">' + escapeHtml(g.reasons[0] || "") + "</p>";
      html += "<p>You can still contact RECR for a human conversation, but this tool will not force-fit an investment path that is outside the current launch scope.</p>";
    } else if (g.outcome === "needs_conversation" || !g.primaryPath) {
      html += "<h2>Likely next step</h2>";
      html += '<p class="deal-path-lead">A short path conversation before locking a product label.</p>';
      g.reasons.forEach((r) => {
        html += "<p>" + escapeHtml(r) + "</p>";
      });
    } else {
      const prim = PATHS[g.primaryPath];
      html += "<h2>Likely conversation path</h2>";
      html += '<p class="deal-path-lead"><strong>' + escapeHtml(prim.label) + "</strong> — " + escapeHtml(prim.blurb) + "</p>";
      html += "<h3>Why this is worth discussing</h3><ul>";
      g.reasons.forEach((r) => {
        html += "<li>" + escapeHtml(r) + "</li>";
      });
      html += "</ul>";
      if (g.secondaryPath && PATHS[g.secondaryPath]) {
        const sec = PATHS[g.secondaryPath];
        html +=
          "<h3>Secondary / transition context</h3><p><strong>" +
          escapeHtml(sec.label) +
          "</strong> — " +
          escapeHtml(sec.blurb) +
          "</p>";
      }
      if (g.multifamilyContext) {
        html +=
          "<p><em>2–4 unit context:</em> keep " +
          escapeHtml(PATHS.multifamily.label) +
          " in view for property-type documentation even when the capital strategy is flip, bridge, rehab, or DSCR.</p>";
      }
    }

    html += "<h2>What to have ready</h2>";
    if (g.readinessMissing.length) {
      html += "<p>Useful next inputs for a better path conversation:</p><ul>";
      g.readinessMissing.forEach((m) => {
        html += "<li>" + escapeHtml(m) + "</li>";
      });
      html += "</ul>";
    } else {
      html += "<p>You already provided a solid sketch. Bring any supporting comps, rent roll, or budget detail you have — incomplete is fine; fiction is not.</p>";
    }

    if (g.resourceLinks && g.resourceLinks.length) {
      html += "<h2>Useful next resources</h2><ul class=\"deal-path-links\">";
      g.resourceLinks.forEach((l) => {
        html += '<li><a href="' + p(l.href) + '">' + escapeHtml(l.label) + "</a></li>";
      });
      html += "</ul>";
    }

    html += '<div class="deal-path-actions">';
    if (g.primaryPath && PATHS[g.primaryPath]) {
      html +=
        '<a class="btn btn-outline" href="' +
        p(PATHS[g.primaryPath].href) +
        '">Read ' +
        escapeHtml(PATHS[g.primaryPath].label) +
        " overview</a>";
    }
    html +=
      '<a class="btn btn-primary" href="' +
      p("/submit-a-deal/") +
      '">Submit this deal for preliminary review</a>';
    html +=
      '<a class="btn btn-outline" href="' + p("/contact/") + '">Talk through this deal</a>';
    html +=
      '<button type="button" class="btn btn-outline" data-deal-path-restart>Edit answers / start over</button>';
    html += "</div>";

    html +=
      '<p class="form-note">No data is stored on our servers from this tool in the current development build. Future CRM handoff will use schema <code>' +
      SCHEMA +
      "</code> (see DEAL-PATH-DATA-CONTRACT.md). Do not paste sensitive IDs or bank data here.</p>";

    html += "</div>";
    result.innerHTML = html;
    result.hidden = false;

    // payload for future CRM (not submitted)
    const payload = {
      schema: SCHEMA,
      generatedAt: new Date().toISOString(),
      sourcePage: "/tools/deal-path/",
      ...a,
      guidance: {
        outcome: g.outcome,
        primaryPath: g.primaryPath,
        secondaryPath: g.secondaryPath,
        multifamilyContext: g.multifamilyContext,
        reasons: g.reasons,
        readinessMissing: g.readinessMissing,
        resourceLinks: g.resourceLinks,
      },
    };
    result.dataset.payload = "ready";
    root._dealPathPayload = payload;

    const focus = $("#deal-path-result-focus", root);
    if (focus) {
      try {
        focus.focus({ preventScroll: false });
      } catch (e) {}
    }
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function showStep(root, n) {
    $all("[data-deal-step]", root).forEach((panel) => {
      const id = panel.getAttribute("data-deal-step");
      const on = String(id) === String(n);
      panel.hidden = !on;
      panel.classList.toggle("is-active", on);
    });
    $all("[data-deal-progress] li", root).forEach((li) => {
      const s = li.getAttribute("data-step");
      li.classList.toggle("is-current", String(s) === String(n));
      li.classList.toggle("is-done", Number(s) < Number(n));
      if (String(s) === String(n)) li.setAttribute("aria-current", "step");
      else li.removeAttribute("aria-current");
    });
    const live = $("[data-deal-step-live]", root);
    if (live) live.textContent = "Step " + n + " of 5";
    root.dataset.currentStep = String(n);
  }

  function validateStep(form, step) {
    const required = {
      1: ["occupancy", "units", "propertyForm", "transaction"],
      2: ["condition", "capitalNeed"],
      3: ["strategy", "timingConstraint"],
      4: [], // optional math
      5: [], // optional contact
    };
    const names = required[step] || [];
    let ok = true;
    names.forEach((name) => {
      const el = form.elements.namedItem(name);
      const wrap = form.querySelector('[data-field="' + name + '"]');
      const err = form.querySelector('[data-error-for="' + name + '"]');
      const v = val(form, name);
      if (!v) {
        ok = false;
        if (wrap) wrap.classList.add("has-error");
        if (err) {
          err.hidden = false;
          err.textContent = "Please choose an option to continue.";
        }
      } else {
        if (wrap) wrap.classList.remove("has-error");
        if (err) {
          err.hidden = true;
          err.textContent = "";
        }
      }
    });
    return ok;
  }

  function init(root) {
    const form = $("form", root);
    if (!form) return;
    let step = 1;
    showStep(root, 1);

    root.addEventListener("click", (e) => {
      const next = e.target.closest("[data-deal-next]");
      const back = e.target.closest("[data-deal-back]");
      const restart = e.target.closest("[data-deal-path-restart]");
      if (next) {
        e.preventDefault();
        if (!validateStep(form, step)) return;
        if (step < 5) {
          step += 1;
          showStep(root, step);
        }
      }
      if (back) {
        e.preventDefault();
        if (step > 1) {
          step -= 1;
          showStep(root, step);
          $("#deal-path-result", root).hidden = true;
        }
      }
      if (restart) {
        e.preventDefault();
        form.reset();
        step = 1;
        showStep(root, 1);
        const res = $("#deal-path-result", root);
        res.hidden = true;
        res.innerHTML = "";
        root._dealPathPayload = null;
      }
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      // final step generate
      if (!validateStep(form, 1) || !validateStep(form, 2) || !validateStep(form, 3)) {
        step = 1;
        showStep(root, 1);
        return;
      }
      const a = collect(form);
      const g = guide(a);
      renderResult(root, a, g);
      // keep step 5 visible with result below
      step = 5;
      showStep(root, 5);
    });

    // ground-up sync: if property form ground_up, set condition
    form.addEventListener("change", (e) => {
      if (e.target && e.target.name === "propertyForm" && e.target.value === "ground_up") {
        const cond = form.elements.namedItem("condition");
        if (cond) {
          // set radio
          const r = form.querySelector('input[name="condition"][value="ground_up"]');
          if (r) r.checked = true;
        }
      }
    });
  }

  function boot() {
    $all(ROOT_SEL).forEach(init);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  // test hook
  window.__RECR_DEAL_PATH__ = { guide, collect, SCHEMA };
})();
