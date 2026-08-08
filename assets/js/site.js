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
    scope.querySelectorAll("[style*='url(']").forEach(function (el) {
      const st = el.getAttribute("style");
      if (!st || st.indexOf("url(/") === -1) return;
      el.setAttribute(
        "style",
        st.replace(/url\(\s*(\/(?!\/)[^)]+)\)/g, function (_, path) {
          if (path.indexOf(BASE + "/") === 0) return "url(" + path + ")";
          return "url(" + BASE + path + ")";
        })
      );
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
          <button type="button" aria-haspopup="true">Financing Programs</button>
          <div class="mega" role="menu">
            <a href="${p("/#funding-programs")}"><strong>All Financing Programs</strong><span>Compare every path</span></a>
            <a href="${p("/fix-and-flip/")}"><strong>Fix &amp; Flip</strong><span>Purchase and renovation capital</span></a>
            <a href="${p("/rental/")}"><strong>Rental / DSCR</strong><span>Cash flow and reserves</span></a>
            <a href="${p("/bridge/")}"><strong>Bridge Financing</strong><span>Short-term transitional capital</span></a>
            <a href="${p("/ground-up/")}"><strong>Ground-Up Construction</strong><span>Plans, budgets, draws</span></a>
                        <a href="${p("/loan-products/")}"><strong>Program Overview</strong><span>Compare launch paths</span></a>
            <a href="${p("/multifamily/")}"><strong>Small Multifamily (2-4)</strong><span>Duplex, triplex, fourplex</span></a>
            <a href="${p("/purchase-rehab/")}"><strong>Purchase &amp; Rehab</strong><span>Acquisition plus major renovation</span></a>
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
        <div class="nav-item">
          <button type="button" aria-haspopup="true">About</button>
          <div class="dropdown" role="menu">
            <a href="${p("/about/")}"${is("about")}>About RECR</a>
            <a href="${p("/team/")}">Team</a>
            <a href="${p("/contact/")}"${is("contact")}>Contact</a>
          </div>
        </div>
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
  <a href="${p("/loan-products/")}">Financing Programs</a>
  <a href="${p("/fix-and-flip/")}">Fix &amp; Flip</a>
  <a href="${p("/rental/")}">Rental</a>
  <a href="${p("/purchase-rehab/")}">Purchase &amp; Rehab</a>
  <a href="${p("/bridge/")}">Bridge</a>
    <a href="${p("/multifamily/")}">Multifamily</a>
  <a href="${p("/tools/")}">Investor Tools</a>
  <a href="${p("/resources/")}">Learning Center</a>
  <a href="${p("/how-it-works/")}">How It Works</a>
  <a href="${p("/first-time/")}">First-Time Investors</a>
  <a href="${p("/experienced/")}">Experienced Borrowers</a>
  <a href="${p("/partners/")}">Partners</a>
  <a href="${p("/results/")}">Recently Closed</a>
  <a href="${p("/about/")}">About</a>
  <a href="${p("/team/")}">Team</a>
  <a href="${p("/contact/")}" style="padding-left:1.35rem">Contact</a>
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
        <p>Capital-path guidance for real-estate investors. RECR helps match non-owner-occupied investment transactions to private-lender and program options — not as the automatic direct funder.</p>
        <p style="margin-top:1rem">
          <a href="${BRAND.phoneHref}" style="color:#fff;font-weight:700">${BRAND.phone}</a><br>
          <a href="${BRAND.emailHref}">${BRAND.email}</a><br>
          ${BRAND.markets}<br>
          <span style="opacity:.85">${BRAND.addressCleveland}</span>
        </p>
      </div>
      <div class="footer-col">
        <h4>Programs</h4>
        <a href="${p("/loan-products/")}">All Programs</a>
        <a href="${p("/fix-and-flip/")}">Fix &amp; Flip</a>
        <a href="${p("/rental/")}">Rental / DSCR</a>
        <a href="${p("/purchase-rehab/")}">Purchase &amp; Rehab</a>
        <a href="${p("/bridge/")}">Bridge</a>
        <a href="${p("/ground-up/")}">Ground Up</a>
        <a href="${p("/multifamily/")}">Small Multifamily (2–4)</a>
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
        <h4>Markets</h4>
        <a href="${p("/cleveland-real-estate-investor-financing/")}">Cleveland / Northeast Ohio</a>
        <a href="${p("/south-florida-real-estate-investor-financing/")}">Fort Lauderdale / South Florida</a>
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
      description: "Capital-path guidance for real-estate investors. Property-first review across fix-and-flip, DSCR rental, purchase-and-rehab, bridge, ground-up, and 2–4 unit multifamily investment financing.",
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
    s.src = p("/assets/js/tracking-config.js");
    s.onload = cb;
    s.onerror = cb;
    document.head.appendChild(s);
  }

  /* Hero background video: muted autoplay (one per page).
     data-loop="false" (home + Fix & Flip):
       · play once on load → hold last frame while hero on screen
       · fully off-screen → reset to t=0
       · re-enter → play from start
     Always kick play immediately (do not wait on IntersectionObserver alone). */
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

    /* Ensure source URLs work on GH Pages project base */
    v.querySelectorAll("source").forEach(function (s) {
      const src = s.getAttribute("src");
      if (!src) return;
      if (src.startsWith("/") && BASE && src.indexOf(BASE + "/") !== 0) {
        s.setAttribute("src", BASE + src);
      }
    });
    if (v.getAttribute("poster")) {
      const po = v.getAttribute("poster");
      if (po.startsWith("/") && BASE && po.indexOf(BASE + "/") !== 0) {
        v.setAttribute("poster", BASE + po);
      }
    }

    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");
    v.setAttribute("webkit-playsinline", "");
    v.preload = "auto";

    const wantLoop =
      v.hasAttribute("loop") && v.getAttribute("data-loop") !== "false";
    v.loop = !!wantLoop;
    if (!wantLoop) v.removeAttribute("loop");

    const tryPlay = function () {
      try {
        v.muted = true;
        const pms = v.play();
        if (pms && typeof pms.catch === "function") pms.catch(function () {});
      } catch (e) { /* no-op */ }
    };

    v.addEventListener("ended", function () {
      if (wantLoop) return;
      try { v.pause(); } catch (e) { /* no-op */ }
    });

    const startFromBeginning = function () {
      const kick = function () {
        try {
          v.pause();
          if (v.readyState >= 1) v.currentTime = 0;
        } catch (e) { /* no-op */ }
        tryPlay();
      };
      if (v.readyState >= 1) kick();
      else v.addEventListener("loadedmetadata", kick, { once: true });
    };

    const resetParkAtStart = function () {
      try {
        v.pause();
        v.currentTime = 0;
      } catch (e) { /* no-op */ }
    };

    /* First paint: always try to play (main reliability fix) */
    try { v.load(); } catch (e) { /* no-op */ }
    startFromBeginning();
    v.addEventListener("canplay", tryPlay, { once: true });
    v.addEventListener("loadeddata", tryPlay, { once: true });

    if ("IntersectionObserver" in window && hero) {
      let offScreen = false;
      const io = new IntersectionObserver(
        function (entries) {
          const en = entries[0];
          if (!en) return;
          const fullyOff = !en.isIntersecting || en.intersectionRatio <= 0.02;
          const substantiallyOn = en.isIntersecting && en.intersectionRatio >= 0.15;
          if (fullyOff) {
            if (!offScreen) {
              offScreen = true;
              resetParkAtStart();
            }
            return;
          }
          if (substantiallyOn && offScreen) {
            offScreen = false;
            startFromBeginning();
          }
        },
        { threshold: [0, 0.02, 0.15, 0.5, 1], rootMargin: "0px" }
      );
      io.observe(hero);
    }
  }

  function bindSplitVideos() {
    const reduce =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.querySelectorAll("video.split-media-video").forEach(function (v) {
      if (reduce) {
        try { v.pause(); } catch (e) { /* no-op */ }
        return;
      }
      v.querySelectorAll("source").forEach(function (s) {
        const src = s.getAttribute("src");
        if (src && src.startsWith("/") && BASE && src.indexOf(BASE + "/") !== 0) {
          s.setAttribute("src", BASE + src);
        }
      });
      v.muted = true;
      v.defaultMuted = true;
      v.playsInline = true;
      v.setAttribute("muted", "");
      const tryPlay = function () {
        const pms = v.play();
        if (pms && typeof pms.catch === "function") pms.catch(function () {});
      };
      try { v.load(); } catch (e) { /* no-op */ }
      if (v.readyState >= 2) tryPlay();
      else v.addEventListener("loadeddata", tryPlay, { once: true });
    });
  }

  /**
   * Home #funding-programs: window-in-window zoom.
   * Launch cards → one large briefing locked to the same stage footprint.
   * Explore Another (or Escape) zooms back out; Continue Exploring closes and scrolls to #recr-homepage-story.
   */
  function bindProgramZoom() {
    const host = document.querySelector("[data-program-zoom]");
    if (!host) return;

    const viewport = host.querySelector(".program-zoom-viewport") || host;
    const gridLayer = host.querySelector('[data-zoom-layer="grid"]');
    const detailLayer = host.querySelector('[data-zoom-layer="detail"]');
    if (!gridLayer || !detailLayer) return;

    const reduce =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let activeId = null;
    let lastFocus = null;
    let animTimer = null;
    let lockedH = 0;

    function setOriginFromEl(el) {
      if (!el || !viewport) {
        host.style.setProperty("--zoom-ox", "50%");
        host.style.setProperty("--zoom-oy", "40%");
        return;
      }
      const vr = viewport.getBoundingClientRect();
      const er = el.getBoundingClientRect();
      const ox = ((er.left + er.width / 2 - vr.left) / Math.max(vr.width, 1)) * 100;
      const oy = ((er.top + er.height / 2 - vr.top) / Math.max(vr.height, 1)) * 100;
      host.style.setProperty("--zoom-ox", Math.max(8, Math.min(92, ox)).toFixed(1) + "%");
      host.style.setProperty("--zoom-oy", Math.max(8, Math.min(92, oy)).toFixed(1) + "%");
    }

    /** Pin the viewport to the 8-card stage height so the open box cannot grow past it. */
    function lockStageHeight() {
      const h = Math.ceil(gridLayer.getBoundingClientRect().height);
      if (h < 120) return;
      lockedH = h;
      viewport.style.height = h + "px";
      viewport.classList.add("is-height-locked");
    }

    function unlockStageHeight() {
      viewport.classList.remove("is-height-locked");
      viewport.style.height = "";
      lockedH = 0;
    }

    function showPage(id) {
      detailLayer.querySelectorAll("[data-program-page]").forEach((page) => {
        const match = page.getAttribute("data-program-page") === id;
        page.hidden = !match;
        if (match) page.removeAttribute("aria-hidden");
        else page.setAttribute("aria-hidden", "true");
      });
    }

    function lockButtons(expanded, id) {
      host.querySelectorAll("[data-program-zoom-in]").forEach((btn) => {
        const on = expanded && btn.getAttribute("data-program-zoom-in") === id;
        btn.setAttribute("aria-expanded", on ? "true" : "false");
      });
    }

    function scrollStageIntoView() {
      const headerH =
        parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 110;
      const top = viewport.getBoundingClientRect().top + window.scrollY - headerH - 16;
      window.scrollTo({ top: Math.max(0, top), behavior: reduce ? "auto" : "smooth" });
    }

    function zoomIn(id, triggerEl) {
      if (!id || activeId === id) return;
      const page = detailLayer.querySelector('[data-program-page="' + id + '"]');
      if (!page) return;

      lastFocus = triggerEl || document.activeElement;
      const card =
        (triggerEl && triggerEl.closest("[data-program-card]")) ||
        host.querySelector('[data-program-card="' + id + '"]');

      /* Measure grid BEFORE hiding it — this is the max window size */
      setOriginFromEl(card || triggerEl);
      lockStageHeight();

      host.querySelectorAll("[data-program-card]").forEach((c) => c.classList.remove("is-zoom-source"));
      if (card) card.classList.add("is-zoom-source");

      showPage(id);
      detailLayer.hidden = false;
      detailLayer.setAttribute("aria-hidden", "false");

      void detailLayer.offsetWidth;

      host.classList.add("is-zooming-in");
      if (!reduce) {
        requestAnimationFrame(() => {
          host.classList.add("is-zoomed");
        });
      } else {
        host.classList.add("is-zoomed");
      }

      activeId = id;
      lockButtons(true, id);
      scrollStageIntoView();

      if (animTimer) clearTimeout(animTimer);
      animTimer = setTimeout(() => {
        host.classList.remove("is-zooming-in");
        host.querySelectorAll("[data-program-card]").forEach((c) => c.classList.remove("is-zoom-source"));
        const focusTarget = page.querySelector("h2") || page.querySelector("[data-program-zoom-out]") || page;
        try {
          if (focusTarget && typeof focusTarget.focus === "function") {
            if (!focusTarget.hasAttribute("tabindex") && focusTarget.tagName !== "BUTTON" && focusTarget.tagName !== "A") {
              focusTarget.setAttribute("tabindex", "-1");
            }
            focusTarget.focus({ preventScroll: true });
          }
        } catch (e) { /* no-op */ }
        animTimer = null;
      }, reduce ? 50 : 560);

      try {
        if (typeof history !== "undefined" && history.replaceState) {
          history.replaceState(null, "", "#funding-programs/" + id);
        }
      } catch (e) { /* no-op */ }

      try {
        if (window.recrTrack) window.recrTrack("program_zoom_in", { program: id });
      } catch (e) { /* no-op */ }
    }

    function zoomOut() {
      if (!activeId) return;
      const card = host.querySelector('[data-program-card="' + activeId + '"]');
      setOriginFromEl(card);

      host.classList.remove("is-zooming-in");
      host.classList.remove("is-zoomed");
      lockButtons(false, activeId);

      if (animTimer) clearTimeout(animTimer);
      animTimer = setTimeout(() => {
        detailLayer.hidden = true;
        detailLayer.setAttribute("aria-hidden", "true");
        detailLayer.querySelectorAll("[data-program-page]").forEach((page) => {
          page.hidden = true;
          page.setAttribute("aria-hidden", "true");
        });
        unlockStageHeight();
        animTimer = null;
      }, reduce ? 50 : 480);

      const returnFocus = lastFocus;
      activeId = null;
      lastFocus = null;
      scrollStageIntoView();

      try {
        if (returnFocus && typeof returnFocus.focus === "function") {
          returnFocus.focus({ preventScroll: true });
        }
      } catch (e) { /* no-op */ }

      try {
        if (typeof history !== "undefined" && history.replaceState) {
          history.replaceState(null, "", "#funding-programs");
        }
      } catch (e) { /* no-op */ }

      try {
        if (window.recrTrack) window.recrTrack("program_zoom_out", {});
      } catch (e) { /* no-op */ }
    }

    function continueExploring() {
      const target = document.getElementById("recr-homepage-story");
      zoomOut();
      const go = () => {
        if (!target) return;
        const headerH =
          parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 110;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 12;
        window.scrollTo({ top: Math.max(0, top), behavior: reduce ? "auto" : "smooth" });
        try {
          if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
        } catch (err) { /* no-op */ }
      };
      // Wait for zoom-out to release layout before scrolling past the stage
      window.setTimeout(go, reduce ? 60 : 500);
      try {
        if (window.recrTrack) window.recrTrack("program_zoom_continue", {});
      } catch (err) { /* no-op */ }
    }

    host.addEventListener("click", (e) => {
      const cont = e.target.closest("[data-program-zoom-continue]");
      if (cont && host.contains(cont)) {
        e.preventDefault();
        continueExploring();
        return;
      }
      const out = e.target.closest("[data-program-zoom-out]");
      if (out && host.contains(out)) {
        e.preventDefault();
        zoomOut();
        return;
      }
      const inn = e.target.closest("[data-program-zoom-in]");
      if (inn && host.contains(inn)) {
        e.preventDefault();
        const id = inn.getAttribute("data-program-zoom-in");
        zoomIn(id, inn);
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && activeId) {
        e.preventDefault();
        zoomOut();
      }
    });

    /* Keep locked height honest on resize while zoomed */
    window.addEventListener("resize", () => {
      if (!activeId || !lockedH) return;
      /* Re-measure isn't possible while grid is hidden; keep last lock */
      if (viewport.style.height) {
        viewport.style.height = lockedH + "px";
      }
    });

    function applyHash() {
      const h = (location.hash || "").replace(/^#/, "");
      if (!h) return;
      const m = h.match(/^funding-programs(?:\/([a-z0-9-]+))?$/i);
      if (!m) return;
      if (m[1]) {
        const btn = host.querySelector('[data-program-zoom-in="' + m[1] + '"]');
        zoomIn(m[1], btn);
      }
    }
    applyHash();
    window.addEventListener("hashchange", applyHash);
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
    bindProgramZoom();
    injectSchema();
    bindTracking();
    bindHeroVideo();
    bindSplitVideos();
  });
})();
