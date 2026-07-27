/* Acqua-frame shell + scroll-forward reveal */
(function () {
  "use strict";

  const BRAND = {
    name: "Real Estate Capital Resources",
    short: "RECR",
    phone: "954-676-4205",
    phoneHref: "tel:9546764205",
    email: "fabercapitalresources@gmail.com",
    emailHref: "mailto:fabercapitalresources@gmail.com",
    markets: "Cleveland, OH · Fort Lauderdale / South Florida",
    addressCleveland: "1273 W 6th St, Cleveland, OH 44113",
  };

  /* GitHub Pages project base; empty on local lab (port 8840). */
  const BASE = (function () {
    const parts = location.pathname.split("/").filter(Boolean);
    if (parts[0] === "faber-capital-resources") return "/faber-capital-resources";
    return "";
  })();

  function p(path) {
    if (!path) return path;
    if (/^(https?:|mailto:|tel:|#|\/\/)/i.test(path)) return path;
    if (path.startsWith("/")) return BASE + path;
    return path;
  }

  /** Rewrite root-absolute href/src/poster so GH Pages subpath works without bulk HTML edits. */
  function rewriteRootAbsolute(root) {
    if (!BASE) return;
    const scope = root || document;
    scope.querySelectorAll("[href], [src], [poster]").forEach(function (el) {
      ["href", "src", "poster"].forEach(function (attr) {
        if (!el.hasAttribute(attr)) return;
        const v = el.getAttribute(attr);
        if (!v || !v.startsWith("/") || v.startsWith("//")) return;
        if (v === BASE || v.indexOf(BASE + "/") === 0) return;
        el.setAttribute(attr, BASE + v);
      });
    });
  }

  function phoneIcon() {
    return `<span class="header-phone-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" focusable="false"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8z"/></svg></span>`;
  }

  function shell(active) {
    const is = (k) => (active === k ? ' aria-current="page"' : "");
    /* West Forest layout: top utility bar (phone right) + main bar (logo left, menu right) */
    return `
<header class="site-header" role="banner">
  <!-- Top utility bar: phone centered at rest, drifts right on scroll (WFC-style) -->
  <div class="header-top">
    <a class="header-phone" href="${BRAND.phoneHref}" aria-label="Call ${BRAND.phone}">
      <span class="header-phone-label">Call:</span>
      <span class="header-phone-num">${BRAND.phone}</span>
      ${phoneIcon()}
    </a>
  </div>
  <!-- Main bar: logo left, menu right -->
  <div class="header-main">
    <div class="container header-inner">
      <a class="logo" href="${p("/")}">
        <span class="logo-mark">RECR</span>
        <span class="logo-text">
          <span class="logo-name">Real Estate Capital Resources</span>
          <span class="logo-sub">Capital Path Guidance</span>
        </span>
      </a>
      <nav class="nav-desktop" aria-label="Primary">
        <a href="${p("/")}"${is("home")}>Home</a>
        <div class="nav-item">
          <button type="button" aria-haspopup="true">Funding Programs</button>
          <div class="mega" role="menu">
            <a href="${p("/#funding-programs")}"><strong>All Funding Programs</strong><span>Compare every path</span></a>
            <a href="${p("/fix-and-flip/")}"><strong>Fix &amp; Flip</strong><span>Purchase and renovation capital</span></a>
            <a href="${p("/rental/")}"><strong>Rental / DSCR</strong><span>Cash flow and reserves</span></a>
            <a href="${p("/bridge/")}"><strong>Bridge Financing</strong><span>Short-term transitional capital</span></a>
            <a href="${p("/ground-up/")}"><strong>Ground-Up Construction</strong><span>Plans, budgets, draws</span></a>
            <a href="${p("/commercial/")}"><strong>Commercial Real Estate</strong><span>Investor-owned commercial</span></a>
            <a href="${p("/multifamily/")}"><strong>Multifamily</strong><span>2+ unit investment</span></a>
            <a href="${p("/purchase-rehab/")}"><strong>100% Purchase &amp; Rehab</strong><span>Qualifying JV transactions</span></a>
            <a href="${p("/joint-venture/")}"><strong>Joint-Venture Funding</strong><span>When pure debt is not the fit</span></a>
          </div>
        </div>
        <a href="${p("/how-it-works/")}"${is("how")}>How It Works</a>
        <div class="nav-item">
          <button type="button" aria-haspopup="true">Investors</button>
          <div class="dropdown" role="menu">
            <a href="${p("/first-time/")}">First-Time Investors</a>
            <a href="${p("/experienced/")}">Experienced Borrowers</a>
            <a href="${p("/tools/")}">Investor Tools</a>
            <a href="${p("/resources/")}">Learning Center</a>
            <a href="${p("/results/")}">Recently Closed</a>
            <a href="${p("/services/")}">Our Services</a>
            <a href="${p("/partners/")}">Partners</a>
          </div>
        </div>
        <a href="${p("/about/")}"${is("about")}>About</a>
        <a href="${p("/contact/")}"${is("contact")}>Contact</a>
        <a href="${p("/resonant-design-offer/")}"${is("offer")}>Offer</a>
        <a class="nexus-nav-btn" href="${p("/nexus/")}" target="_blank" rel="noopener">Nexus</a>
        <a class="btn btn-primary header-cta" href="${p("/submit-a-deal/")}">Submit a Deal</a>
      </nav>
      <button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" data-menu-toggle>
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</header>
<div class="mobile-nav" id="mobile-nav" hidden>
  <a class="header-phone header-phone--mobile" href="${BRAND.phoneHref}">
    <span class="header-phone-label">Call:</span>
    <span class="header-phone-num">${BRAND.phone}</span>
    ${phoneIcon()}
  </a>
  <a href="${p("/")}">Home</a>
  <a href="${p("/loan-products/")}">Funding Programs</a>
  <a href="${p("/fix-and-flip/")}">Fix &amp; Flip</a>
  <a href="${p("/rental/")}">Rental</a>
  <a href="${p("/purchase-rehab/")}">100% Purchase &amp; Rehab</a>
  <a href="${p("/bridge/")}">Bridge</a>
  <a href="${p("/commercial/")}">Commercial</a>
  <a href="${p("/multifamily/")}">Multifamily</a>
  <a href="${p("/tools/")}">Investor Tools</a>
  <a href="${p("/resources/")}">Learning Center</a>
  <a href="${p("/how-it-works/")}">How It Works</a>
  <a href="${p("/first-time/")}">First-Time Investors</a>
  <a href="${p("/experienced/")}">Experienced Borrowers</a>
  <a href="${p("/partners/")}">Partners</a>
  <a href="${p("/results/")}">Recently Closed</a>
  <a href="${p("/about/")}">About</a>
  <a href="${p("/contact/")}">Contact</a>
  <a href="${p("/resonant-design-offer/")}"${is("offer")}>Offer</a>
  <a class="nexus-nav-btn" href="${p("/nexus/")}" target="_blank" rel="noopener">Nexus</a>
  <a class="btn btn-primary" href="${p("/submit-a-deal/")}">Submit a Deal</a>
</div>`;
  }

  function footer() {
    return `
<footer class="site-footer" role="contentinfo">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="logo-name">Real Estate Capital Resources</div>
        <span class="logo-sub" style="display:block;margin-top:.4rem;color:#c4a35a">RECR</span>
        <p>Real estate capital for investors and their next opportunity. Transaction-first review across purchase, rehab, rental, bridge, construction, and selected joint-venture paths.</p>
        <p style="margin-top:1rem">
          <a href="${BRAND.phoneHref}" style="color:#fff;font-weight:700">${BRAND.phone}</a><br>
          <a href="${BRAND.emailHref}">${BRAND.email}</a><br>
          ${BRAND.markets}<br>
          <span style="opacity:.85">${BRAND.addressCleveland}</span>
        </p>
      </div>
      <div class="footer-col">
        <h4>Products</h4>
        <a href="${p("/loan-products/")}">All Programs</a>
        <a href="${p("/fix-and-flip/")}">Fix &amp; Flip</a>
        <a href="${p("/rental/")}">Rental / DSCR</a>
        <a href="${p("/purchase-rehab/")}">100% Purchase &amp; Rehab</a>
        <a href="${p("/bridge/")}">Bridge</a>
        <a href="${p("/ground-up/")}">Ground Up</a>
        <a href="${p("/commercial/")}">Commercial</a>
        <a href="${p("/multifamily/")}">Multifamily</a>
        <a href="${p("/joint-venture/")}">Joint Venture</a>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <a href="${p("/about/")}">About</a>
        <a href="${p("/how-it-works/")}">How It Works</a>
        <a href="${p("/services/")}">Our Services</a>
        <a href="${p("/results/")}">Recently Closed</a>
        <a href="${p("/team/")}">Meet the Team</a>
        <a href="${p("/partners/")}">Partners</a>
        <a href="${p("/faq/")}">FAQ</a>
      </div>
      <div class="footer-col">
        <h4>Help &amp; Legal</h4>
        <a href="${p("/contact/")}">Contact</a>
        <a href="${p("/submit-a-deal/")}">Submit a Deal</a>
        <a href="${p("/tools/")}">Investor Tools</a>
        <a href="${p("/resources/")}">Learning Center</a>
        <a href="${p("/privacy/")}">Privacy</a>
        <a href="${p("/terms/")}">Terms</a>
        <a href="${p("/disclosures/")}">Disclosures</a>
        <a href="${p("/accessibility/")}">Accessibility</a>
      </div>
    </div>
    <p class="disclaimer">Illustrative program language only. Actual leverage, rates, fees, and eligibility vary by borrower, property, market, and capital partner. Not a commitment to lend. Mockup for review — noindex until launch checklist clears.</p>
    <div class="footer-bottom">
      <span>&copy; ${new Date().getFullYear()} Real Estate Capital Resources. All rights reserved.</span>
      <span>RECR framework · Acqua visual frame · custom HTML</span>
    </div>
  </div>
</footer>`;
  }

  function injectShell() {
    const active = document.body.dataset.active || "";
    const mount = document.getElementById("site-shell");
    /* Header only in the mount (or top of body). Footer always last —
       never inject footer into #site-shell or it stacks above <main>. */
    if (mount) {
      mount.outerHTML = shell(active);
    } else {
      document.body.insertAdjacentHTML("afterbegin", shell(active));
    }
    if (!document.querySelector("footer.site-footer")) {
      document.body.insertAdjacentHTML("beforeend", footer());
    }
  }

  function bindMenu() {
    const btn = document.querySelector("[data-menu-toggle]");
    const nav = document.getElementById("mobile-nav");
    if (!btn || !nav) return;
    btn.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      nav.hidden = !open;
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function bindReveal() {
    const nodes = document.querySelectorAll(
      ".reveal, .reveal-left, .reveal-right, .reveal-scale"
    );
    if (!nodes.length) return;
    if (!("IntersectionObserver" in window)) {
      nodes.forEach((n) => n.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    nodes.forEach((n) => io.observe(n));
  }

  function bindForms() {
    document.querySelectorAll("form[data-mock-form]").forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const note = form.querySelector("[data-form-status]");
        if (note) {
          note.textContent =
            "Received locally (mock). Wire this form when you approve go-live.";
          note.hidden = false;
        } else {
          alert("Received locally (mock). Wire this form when you approve go-live.");
        }
        form.reset();
      });
    });
  }

  /**
   * Smooth header state:
   * - Hysteresis so the fold can't flicker / glitch at the threshold
   * - rAF throttle for one paint per frame
   * - Single class `is-scrolled` (CSS drives phone drift + soft shrink)
   * - Ring only when centered at top
   */
  function bindHeaderScroll() {
    const header = document.querySelector(".site-header");
    if (!header) return;

    const ENTER = 28; // must scroll past this to engage
    const EXIT = 10;  // must return below this to release
    let isScrolled = false;
    let ticking = false;

    function apply(y) {
      if (!isScrolled && y > ENTER) isScrolled = true;
      else if (isScrolled && y < EXIT) isScrolled = false;
      header.classList.toggle("is-scrolled", isScrolled);
      // legacy aliases kept for any residual selectors
      header.classList.toggle("scrolled", isScrolled);
      header.classList.toggle("nav-scroll", isScrolled);
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY || document.documentElement.scrollTop || 0;
        apply(y);
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    apply(window.scrollY || document.documentElement.scrollTop || 0);
  }

  /* —— Flip cards —— front = title + points, back = detail.
     Both faces live in the DOM so search engines read all of it.
     Desktop: CSS hover (acqua-frame.css). Touch: click. Keyboard: Enter/Space.
     Fine-pointer hover also sets .is-flipped for aria-pressed consistency. */
  function bindFlip() {
    const cards = document.querySelectorAll(".flip-card");
    const fineHover = () =>
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    cards.forEach((card) => {
      if (!card.hasAttribute("tabindex")) card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.setAttribute("aria-pressed", "false");
      const setFlipped = (on) => {
        card.classList.toggle("is-flipped", on);
        card.setAttribute("aria-pressed", on ? "true" : "false");
      };
      const toggle = () => setFlipped(!card.classList.contains("is-flipped"));
      card.addEventListener("mouseenter", () => {
        if (fineHover()) setFlipped(true);
      });
      card.addEventListener("mouseleave", () => {
        if (fineHover()) setFlipped(false);
      });
      card.addEventListener("click", (e) => {
        if (e.target.closest("a, button")) return; // let real links work
        if (fineHover()) return; // hover already handles desktop
        toggle();
      });
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
      });
    });
  }

  /* —— Structured data —— emitted from what the page already renders:
     breadcrumbs, FAQ (<details>), headings, canonical. Never asserts a fact
     the page does not state. */
  const ORIGIN = "https://realestatecapitalresources.com";

  function jsonld(obj) {
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(obj);
    document.head.appendChild(s);
  }
  function canonical() {
    const el = document.querySelector('link[rel="canonical"]');
    return el ? el.href : ORIGIN + location.pathname;
  }
  function orgSchema() {
    jsonld({
      "@context": "https://schema.org",
      "@type": ["Organization", "FinancialService"],
      "@id": ORIGIN + "/#organization",
      name: BRAND.name, alternateName: BRAND.short, url: ORIGIN,
      telephone: BRAND.phone, email: BRAND.email,
      description: "Capital-path guidance for real-estate investors. Property-first review across purchase, rehab, rental, bridge, construction, commercial, multifamily, and joint-venture structures.",
      areaServed: [
        { "@type": "City", name: "Cleveland", address: { "@type": "PostalAddress", addressRegion: "OH" } },
        { "@type": "City", name: "Fort Lauderdale", address: { "@type": "PostalAddress", addressRegion: "FL" } }
      ],
      address: { "@type": "PostalAddress", streetAddress: "1273 W 6th St", addressLocality: "Cleveland", addressRegion: "OH", postalCode: "44113", addressCountry: "US" }
    });
    jsonld({ "@context": "https://schema.org", "@type": "WebSite", "@id": ORIGIN + "/#website", url: ORIGIN, name: BRAND.name, publisher: { "@id": ORIGIN + "/#organization" } });
  }
  function breadcrumbSchema() {
    const nav = document.querySelector(".breadcrumb");
    if (!nav) return;
    const items = [];
    nav.querySelectorAll("a, span:not([aria-hidden])").forEach((el) => {
      const name = (el.textContent || "").trim();
      if (!name || name === "/") return;
      const entry = { "@type": "ListItem", position: items.length + 1, name: name };
      if (el.tagName === "A") entry.item = el.href;
      items.push(entry);
    });
    if (items.length < 2) return;
    jsonld({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items });
  }
  function faqSchema() {
    const items = [];
    document.querySelectorAll(".faq-item").forEach((item) => {
      const q = item.querySelector("summary");
      const a = item.querySelector(".faq-body");
      if (!q || !a) return;
      const qt = (q.textContent || "").replace(/[+–\s]+$/, "").trim();
      const at = (a.textContent || "").trim();
      if (qt && at) items.push({ "@type": "Question", name: qt, acceptedAnswer: { "@type": "Answer", text: at } });
    });
    if (items.length) jsonld({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: items });
  }
  function pageSchema() {
    const kind = document.body.dataset.schema;
    if (!kind) return;
    const h1 = document.querySelector("h1");
    const name = h1 ? h1.textContent.trim() : document.title;
    const desc = (document.querySelector('meta[name="description"]') || {}).content || "";
    if (kind === "program") {
      jsonld({ "@context": "https://schema.org", "@type": "Service", name, description: desc, url: canonical(), serviceType: "Real estate investment financing", provider: { "@id": ORIGIN + "/#organization" }, audience: { "@type": "Audience", audienceType: "Real estate investors" } });
    } else if (kind === "article") {
      jsonld({ "@context": "https://schema.org", "@type": "Article", headline: name, description: desc, url: canonical(), publisher: { "@id": ORIGIN + "/#organization" }, mainEntityOfPage: canonical() });
    } else if (kind === "tool") {
      jsonld({ "@context": "https://schema.org", "@type": "WebApplication", name, description: desc, url: canonical(), applicationCategory: "FinanceApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@id": ORIGIN + "/#organization" } });
    } else if (kind === "howto") {
      const steps = [];
      document.querySelectorAll(".step").forEach((s, i) => {
        const h = s.querySelector("h3"), p = s.querySelector("p");
        if (h) steps.push({ "@type": "HowToStep", position: i + 1, name: h.textContent.trim(), text: p ? p.textContent.trim() : h.textContent.trim() });
      });
      if (steps.length) jsonld({ "@context": "https://schema.org", "@type": "HowTo", name, description: desc, step: steps });
    }
  }
  function injectSchema() { orgSchema(); breadcrumbSchema(); faqSchema(); pageSchema(); }

  /* —— Measurement —— GA4 loads only when RECR_GA4_ID is a real measurement ID.
     Events: phone_click, email_click, deal_submit, calculator_complete.
     Never send document contents or full deal notes to analytics. */
  function gtag() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(arguments);
  }
  function initAnalytics() {
    const id = window.RECR_GA4_ID || "";
    if (!id || id === "G-XXXXXXXXXX" || id.indexOf("G-") !== 0) return;
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    document.head.appendChild(s);
    gtag("js", new Date());
    gtag("config", id, { anonymize_ip: true, send_page_view: true });
    window.recrTrack = function (name, params) {
      try { gtag("event", name, params || {}); } catch (e) { /* no-op */ }
    };
  }
  function bindTracking() {
    const track = window.recrTrack || function () {};
    document.querySelectorAll('a[href^="tel:"]').forEach((a) => {
      a.addEventListener("click", () => track("phone_click", { link_url: a.getAttribute("href") }));
    });
    document.querySelectorAll('a[href^="mailto:"]').forEach((a) => {
      a.addEventListener("click", () => track("email_click", { link_url: a.getAttribute("href") }));
    });
    document.querySelectorAll("form[data-mock-form]").forEach((form) => {
      form.addEventListener("submit", () => {
        const prog = (form.querySelector("[name=strategy]") || {}).value || "";
        track("deal_submit", { form_id: form.id || "deal_or_contact", program: prog });
      });
    });
    // calculator_complete: tools pages fire when a result value changes after input
    document.querySelectorAll(".calc-result .result-value").forEach((el) => {
      const obs = new MutationObserver(() => {
        track("calculator_complete", { page: location.pathname });
      });
      obs.observe(el, { childList: true, characterData: true, subtree: true });
    });
  }

  /* Load optional tracking-config.js if present (sets RECR_GA4_ID, GSC, IndexNow host). */
  function loadTrackingConfig(cb) {
    const s = document.createElement("script");
    s.src = "/assets/js/tracking-config.js";
    s.onload = cb;
    s.onerror = cb;
    document.head.appendChild(s);
  }

  /* Hero background video: muted autoplay (one per page).
     data-loop="false" (home + Fix & Flip):
       · play once → stay on LAST frame while hero remains on screen
       · only when hero is FULLY off-screen → reset to t=0 (paused)
       · when hero comes back on-screen → play from the beginning
     Never restart just because the video ended.
     Perf: keep preload=metadata in HTML; never loop = less bandwidth on long sessions. */
  function bindHeroVideo() {
    const v = document.querySelector(".hero-video");
    if (!v) return;
    const hero = v.closest(".hero") || v.parentElement;
    const reduce =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      v.pause();
      v.removeAttribute("autoplay");
      v.removeAttribute("src");
      v.querySelectorAll("source").forEach((s) => s.removeAttribute("src"));
      try { v.load(); } catch (e) { /* no-op */ }
      return;
    }
    v.muted = true;
    v.playsInline = true;
    /* Hint decoder: background presentation, not a player chrome */
    try { v.setAttribute("playsinline", ""); } catch (e) { /* no-op */ }
    const wantLoop =
      v.hasAttribute("loop") && v.getAttribute("data-loop") !== "false";
    v.loop = false;
    v.removeAttribute("loop");

    if (wantLoop) {
      /* reserved if we ever re-enable home loop via attr */
      v.loop = true;
      v.setAttribute("loop", "");
      const tryPlayLoop = () => {
        const p = v.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      };
      if (v.readyState >= 2) tryPlayLoop();
      else v.addEventListener("loadeddata", tryPlayLoop, { once: true });
      return;
    }

    let offScreen = true; /* start as off so first visible entry starts cleanly */
    let playingThrough = false;

    const tryPlay = () => {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };

    /* Freeze on final frame — do NOT seek (seeking can flash frame 0). */
    v.addEventListener("ended", () => {
      playingThrough = false;
      try {
        v.pause();
      } catch (e) { /* no-op */ }
    });

    const startFromBeginning = () => {
      playingThrough = true;
      const kick = () => {
        try {
          v.pause();
          v.currentTime = 0;
        } catch (e) { /* no-op */ }
        tryPlay();
      };
      if (v.readyState >= 1) kick();
      else v.addEventListener("loadedmetadata", kick, { once: true });
    };

    const resetParkAtStart = () => {
      playingThrough = false;
      try {
        v.pause();
        v.currentTime = 0;
      } catch (e) { /* no-op */ }
    };

    if ("IntersectionObserver" in window && hero) {
      const io = new IntersectionObserver(
        (entries) => {
          const en = entries[0];
          if (!en) return;
          /* Fully gone only — avoids flicker mid-hero / sticky-header noise */
          const fullyOff = !en.isIntersecting || en.intersectionRatio <= 0.02;
          const substantiallyOn = en.isIntersecting && en.intersectionRatio >= 0.2;

          if (fullyOff) {
            if (!offScreen) {
              offScreen = true;
              resetParkAtStart();
            }
            return;
          }
          if (substantiallyOn && offScreen) {
            /* Re-entered after being completely off (or first paint) */
            offScreen = false;
            startFromBeginning();
          }
          /* still on-screen (including after ended): leave currentTime alone */
        },
        { threshold: [0, 0.02, 0.2, 0.5, 1], rootMargin: "0px" }
      );
      io.observe(hero);
    } else {
      startFromBeginning();
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    loadTrackingConfig(() => {
      initAnalytics();
    });
    rewriteRootAbsolute(document);
    injectShell();
    bindMenu();
    bindHeaderScroll();
    bindReveal();
    bindForms();
    bindFlip();
    injectSchema();
    bindTracking();
    bindHeroVideo();
  });
})();
