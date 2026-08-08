/**
 * RECR proof renderer — Handoff 07
 * Loads data/proof.json and fills [data-proof-*] mounts.
 * Renders mock | verified only. Never draft. Never injects into JSON-LD/meta.
 */
(function () {
  "use strict";

  const PROGRAM_LABELS = {
    "fix-and-flip": "Fix & Flip",
    rental: "Rental / DSCR",
    bridge: "Bridge Financing",
    "ground-up": "Ground-Up Construction",
    multifamily: "Small Multifamily (2–4)",
    "purchase-rehab": "Purchase & Rehab",
  };

  function basePath() {
    const parts = location.pathname.split("/").filter(Boolean);
    if (parts[0] === "faber-capital-resources") return "/faber-capital-resources";
    return "";
  }

  function proofUrl() {
    return basePath() + "/data/proof.json";
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function mockBadge() {
    return (
      '<div class="proof-mock-badge" aria-label="Demonstration content">' +
      '<span class="proof-mock-badge__label">MOCK — DEMONSTRATION CONTENT</span>' +
      '<span class="proof-mock-badge__note">Replace with verified Bill/RECR record during polish.</span>' +
      "</div>"
    );
  }

  function isPublicStatus(st) {
    return st === "mock" || st === "verified";
  }

  /** Stage 12: launch surfaces default to verified-only. Mocks only if el allows them. */
  function allowMock(el) {
    if (!el) return false;
    return el.getAttribute("data-proof-include-mock") === "1";
  }

  function publicTransactions(data, el) {
    const seen = {};
    const includeMock = allowMock(el);
    return (data.transactions || []).filter(function (t) {
      if (t.status === "draft") return false;
      if (t.status === "mock" && !includeMock) return false;
      if (!isPublicStatus(t.status)) return false;
      if (seen[t.id]) return false;
      seen[t.id] = true;
      return true;
    });
  }

  function publicTestimonials(data, el) {
    const includeMock = allowMock(el);
    return (data.testimonials || []).filter(function (t) {
      if (t.status === "draft") return false;
      if (t.status === "mock" && !includeMock) return false;
      return isPublicStatus(t.status);
    });
  }

  function txCard(tx, opts) {
    opts = opts || {};
    const compact = !!opts.compact;
    const mock = tx.status === "mock";
    const prog = PROGRAM_LABELS[tx.program] || tx.program;
    let body =
      '<article class="proof-case' +
      (mock ? " proof-case--mock" : " proof-case--verified") +
      (compact ? " proof-case--compact" : "") +
      '" data-proof-status="' +
      esc(tx.status) +
      '" data-proof-id="' +
      esc(tx.id) +
      '" data-proof-case-program="' +
      esc(tx.program) +
      '">';
    if (mock) body += mockBadge();
    body +=
      '<header class="proof-case__head">' +
      '<span class="proof-case__program">' +
      esc(prog) +
      "</span>" +
      "<h3 class=\"proof-case__title\">" +
      esc(tx.propertyType) +
      (tx.marketLabel ? " · " + esc(tx.marketLabel) : "") +
      "</h3>" +
      (tx.yearLabel
        ? '<p class="proof-case__meta' +
          (mock ? " proof-case__meta--mock" : "") +
          '">' +
          (mock ? "<em>" : "") +
          esc(tx.yearLabel) +
          (mock ? "</em>" : "") +
          "</p>"
        : "") +
      "</header>";
    if (compact) {
      body +=
        '<p class="proof-case__line"><strong>Need</strong> ' +
        (mock ? "<em>" : "") +
        esc(tx.capitalNeed) +
        (mock ? "</em>" : "") +
        "</p>";
      body +=
        '<p class="proof-case__line"><strong>Path</strong> ' +
        (mock ? "<em>" : "") +
        esc(tx.structureArranged) +
        (mock ? "</em>" : "") +
        "</p>";
      body +=
        '<p class="proof-case__line"><strong>Result</strong> ' +
        (mock ? "<em>" : "") +
        esc(tx.result) +
        (mock ? "</em>" : "") +
        "</p>";
    } else {
      body += '<ol class="proof-case__flow">';
      body +=
        "<li><strong>Property / Situation</strong> " +
        (mock ? "<em>" : "") +
        esc(tx.situation) +
        (mock ? "</em>" : "") +
        "</li>";
      body +=
        "<li><strong>Capital Need</strong> " +
        (mock ? "<em>" : "") +
        esc(tx.capitalNeed) +
        (mock ? "</em>" : "") +
        "</li>";
      body +=
        "<li><strong>Structure Arranged</strong> " +
        (mock ? "<em>" : "") +
        esc(tx.structureArranged) +
        (mock ? "</em>" : "") +
        "</li>";
      body +=
        "<li><strong>Challenge</strong> " +
        (mock ? "<em>" : "") +
        esc(tx.challenge) +
        (mock ? "</em>" : "") +
        "</li>";
      body +=
        "<li><strong>Result</strong> " +
        (mock ? "<em>" : "") +
        esc(tx.result) +
        (mock ? "</em>" : "") +
        "</li>";
      body += "</ol>";
    }
    body += "</article>";
    return body;
  }

  function tmCard(tm) {
    const mock = tm.status === "mock";
    return (
      '<blockquote class="proof-quote' +
      (mock ? " proof-quote--mock" : "") +
      '" data-proof-status="' +
      esc(tm.status) +
      '" data-proof-id="' +
      esc(tm.id) +
      '">' +
      (mock ? mockBadge() : "") +
      "<p class=\"proof-quote__text\">" +
      (mock ? "<em>" : "") +
      "“" +
      esc(tm.quote) +
      "”" +
      (mock ? "</em>" : "") +
      "</p>" +
      '<footer class="proof-quote__attr">' +
      "<strong>" +
      esc(tm.displayName) +
      "</strong>" +
      (tm.role ? "<span>" + esc(tm.role) + "</span>" : "") +
      (tm.relationship
        ? '<span class="proof-quote__rel">' + esc(tm.relationship) + "</span>"
        : "") +
      "</footer></blockquote>"
    );
  }

  function renderHub(el, data) {
    const txs = publicTransactions(data, el);
    const tms = publicTestimonials(data, el);
    const verifiedCount = txs.filter(function (t) {
      return t.status === "verified";
    }).length;
    const mockCount = txs.filter(function (t) {
      return t.status === "mock";
    }).length;

    let html = "";
    if (mockCount && !verifiedCount) {
      html +=
        '<div class="proof-hub-banner" data-proof-status="mock" role="status">' +
        mockBadge() +
        "<p>This development hub shows a full proof experience using demonstration records. " +
        "Verified Bill/RECR transactions will replace these during polish. " +
        "If no verified cases exist at launch, mock cards are removed and Results stays out of production indexing until real proof is populated.</p>" +
        "</div>";
    } else if (!txs.length) {
      html +=
        '<div class="proof-hub-empty"><p><strong>No verified transactions are published yet.</strong> ' +
        "RECR will not invent case studies. Judge process quality, then bring a live file.</p></div>";
    }

    if (txs.length) {
      html += '<div class="proof-case-grid">';
      txs.forEach(function (tx) {
        html += txCard(tx, { compact: false });
      });
      html += "</div>";
    }

    if (tms.length) {
      html +=
        '<div class="proof-quote-section"><h2 class="proof-section-title">What partners say</h2>';
      if (tms.some(function (t) {
        return t.status === "mock";
      })) {
        html +=
          '<p class="proof-section-note">Demonstration quotes for layout QA only — not real attributions.</p>';
      }
      html += '<div class="proof-quote-grid">';
      tms.forEach(function (t) {
        html += tmCard(t);
      });
      html += "</div></div>";
    }

    el.innerHTML = html;
    el.setAttribute("data-proof-rendered", "1");
    el.setAttribute("data-proof-verified-count", String(verifiedCount));
    el.setAttribute("data-proof-mock-count", String(mockCount));
  }

  function renderProgram(el, data) {
    const program = el.getAttribute("data-proof-program");
    if (!program) return;
    const limit = parseInt(el.getAttribute("data-proof-limit") || "2", 10) || 2;
    const txs = publicTransactions(data, el)
      .filter(function (t) {
        return t.program === program;
      })
      .slice(0, limit);
    if (!txs.length) {
      el.innerHTML = "";
      el.hidden = true;
      return;
    }
    el.hidden = false;
    let html =
      '<div class="proof-inline">' +
      '<div class="proof-inline__head"><h2 class="proof-section-title">Representative path examples</h2>';
    if (txs.every(function (t) {
      return t.status === "mock";
    })) {
      html +=
        '<p class="proof-section-note">Demonstration records for design QA — not verified RECR outcomes.</p>';
    }
    html += '</div><div class=\"proof-case-grid proof-case-grid--compact\">';
    txs.forEach(function (tx) {
      html += txCard(tx, { compact: true });
    });
    html += "</div>";
    const hasVerified = publicTransactions(data, el).some(function (t) {
      return t.status === "verified";
    });
    if (hasVerified) {
      html +=
        '<p class="proof-inline__more"><a href="' +
        basePath() +
        '/results/">View all published proof</a></p>';
    }
    html += "</div>";
    el.innerHTML = html;
    el.setAttribute("data-proof-rendered", "1");
  }

  function renderMarket(el, data) {
    const market = el.getAttribute("data-proof-market");
    if (!market) return;
    const limit = parseInt(el.getAttribute("data-proof-limit") || "2", 10) || 2;
    const txs = publicTransactions(data, el)
      .filter(function (t) {
        return t.marketTag === market;
      })
      .slice(0, limit);
    if (!txs.length) {
      el.innerHTML = "";
      el.hidden = true;
      return;
    }
    el.hidden = false;
    let html =
      '<div class="proof-inline">' +
      '<div class="proof-inline__head"><h2 class="proof-section-title">Illustrative local scenarios</h2>' +
      '<p class="proof-section-note">Demonstration-only market scenarios for layout. Production shows local proof only when a verified case is approved for that market.</p>' +
      '</div><div class="proof-case-grid proof-case-grid--compact">';
    txs.forEach(function (tx) {
      html += txCard(tx, { compact: true });
    });
    html += "</div></div>";
    el.innerHTML = html;
    el.setAttribute("data-proof-rendered", "1");
  }

  function renderBill(el, data) {
    const bill = data.bill || {};
    const v = bill.verified || {};
    const m = bill.mock || {};
    let html =
      '<div class="proof-bill">' +
      '<div class="proof-bill__verified">' +
      "<h2>" +
      esc(bill.displayName || "William M. Faber") +
      "</h2>" +
      '<p class="lead-inline">' +
      esc(v.role || "") +
      "</p>";

    if (v.narrative && v.narrative.length) {
      v.narrative.forEach(function (para) {
        html += "<p>" + esc(para) + "</p>";
      });
    }

    html += "<ul class=\"list-check\">";
    if (v.focus) html += "<li><strong>Focus</strong> — " + esc(v.focus) + "</li>";
    if (v.approach) html += "<li><strong>Approach</strong> — " + esc(v.approach) + "</li>";
    if (v.method) html += "<li><strong>Method</strong> — " + esc(v.method) + "</li>";
    if (v.productFocus && v.productFocus.length) {
      html +=
        "<li><strong>Launch conversation paths</strong> — " +
        esc(v.productFocus.join(" · ")) +
        "</li>";
    }
    if (v.exclusions) html += "<li><strong>Out of launch sweet spot</strong> — " + esc(v.exclusions) + "</li>";
    html +=
      "<li><strong>Markets</strong> — " +
      esc((v.markets || []).join(" · ")) +
      (v.geographyNote ? " <span class=\"proof-section-note\">" + esc(v.geographyNote) + "</span>" : "") +
      "</li>";
    html +=
      "<li><strong>Contact</strong> — " +
      esc(v.phone || "") +
      " · " +
      esc(v.email || "") +
      "</li>";
    html += "</ul>";
    html +=
      '<p class="proof-section-note">Tenure dates, licenses, credentials, headshot, and prior employers are not published until Bill-approved primary sources land (see PROOF-INTAKE.md and VERIFIED-FACT-REGISTER.md). This biography refuses inventing authority markers.</p>';
    html += "</div>";

    // Mock timeline/credentials only when explicitly requested for design review
    if (allowMock(el) && m && (m.timeline || m.specialties || m.credentialsPlaceholder)) {
      html +=
        '<div class="proof-bill__mock" data-proof-status="mock">' +
        mockBadge() +
        "<h3>Design-only placeholders (not public facts)</h3>";
      if (m.timeline && m.timeline.length) {
        html += "<ol class=\"proof-timeline\">";
        m.timeline.forEach(function (row) {
          html +=
            "<li data-proof-status=\"mock\"><strong><em>" +
            esc(row.period) +
            "</em></strong> <em>" +
            esc(row.detail) +
            "</em></li>";
        });
        html += "</ol>";
      }
      html += "</div>";
    }

    html += "</div>";
    el.innerHTML = html;
    el.setAttribute("data-proof-rendered", "1");
    el.setAttribute("data-proof-bill-mode", allowMock(el) ? "verified+mock" : "verified-only");
  }

  function renderQuotes(el, data) {
    const limit = parseInt(el.getAttribute("data-proof-limit") || "4", 10) || 4;
    const tms = publicTestimonials(data, el).slice(0, limit);
    if (!tms.length) {
      el.innerHTML = "";
      el.hidden = true;
      return;
    }
    el.hidden = false;
    let html = '<div class="proof-quote-grid">';
    tms.forEach(function (t) {
      html += tmCard(t);
    });
    html += "</div>";
    el.innerHTML = html;
    el.setAttribute("data-proof-rendered", "1");
  }

  function renderHomeStrip(el, data) {
    const txs = publicTransactions(data, el).slice(0, 3);
    if (!txs.length) {
      // Honest empty: no mock strip on homepage when no verified cases
      el.innerHTML =
        '<div class="proof-home-strip proof-home-strip--empty">' +
        "<p><strong>Published case studies appear here when verified.</strong> " +
        "RECR will not invent closed-deal theater. Bring a live file — or use the " +
        '<a href="' +
        basePath() +
        '/tools/deal-path/">Deal Path Guide</a> to prepare the conversation.</p></div>';
      el.hidden = false;
      el.setAttribute("data-proof-rendered", "1");
      el.setAttribute("data-proof-mock-count", "0");
      el.setAttribute("data-proof-verified-count", "0");
      return;
    }
    el.hidden = false;
    const anyMock = txs.some(function (t) {
      return t.status === "mock";
    });
    let html = '<div class="proof-home-strip"' + (anyMock ? ' data-proof-status="mock"' : "") + ">";
    if (anyMock) {
      html +=
        mockBadge() +
        '<p class="proof-section-note">Demonstration path examples for layout only. Not verified outcomes.</p>';
    }
    html += '<div class="proof-case-grid proof-case-grid--compact">';
    txs.forEach(function (tx) {
      html += txCard(tx, { compact: true });
    });
    html += "</div></div>";
    el.innerHTML = html;
    el.setAttribute("data-proof-rendered", "1");
  }

  function mountAll(data) {
    document.querySelectorAll("[data-proof-hub]").forEach(function (el) {
      renderHub(el, data);
    });
    // Mount points only — not nested case cards (those use data-proof-case-program)
    document.querySelectorAll("[data-proof-program]:not([data-proof-id])").forEach(function (el) {
      renderProgram(el, data);
    });
    document.querySelectorAll("[data-proof-market]").forEach(function (el) {
      renderMarket(el, data);
    });
    document.querySelectorAll("[data-proof-bill]").forEach(function (el) {
      renderBill(el, data);
    });
    document.querySelectorAll("[data-proof-quotes]").forEach(function (el) {
      renderQuotes(el, data);
    });
    document.querySelectorAll("[data-proof-home]").forEach(function (el) {
      renderHomeStrip(el, data);
    });
  }

  function init() {
    if (window.__RECR_PROOF_INIT) return;
    window.__RECR_PROOF_INIT = true;
    if (
      !document.querySelector(
        "[data-proof-hub],[data-proof-program]:not([data-proof-id]),[data-proof-market],[data-proof-bill],[data-proof-quotes],[data-proof-home]"
      )
    ) {
      return;
    }
    fetch(proofUrl(), { credentials: "same-origin" })
      .then(function (r) {
        if (!r.ok) throw new Error("proof.json " + r.status);
        return r.json();
      })
      .then(mountAll)
      .catch(function (err) {
        console.warn("RECR proof: failed to load", err);
        document.querySelectorAll("[data-proof-hub]").forEach(function (el) {
          el.innerHTML =
            '<p class="proof-hub-empty">Proof data could not be loaded in this environment. Source of truth: <code>data/proof.json</code>.</p>';
        });
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
