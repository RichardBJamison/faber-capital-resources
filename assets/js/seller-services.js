/* Seller Services funnel chrome */
(function () {
  "use strict";

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

  const STAGES = [
    { id: "land", href: p("/seller-services/"), label: "Overview" },
    { id: "form", href: p("/seller-services/launch/"), label: "Submit" },
    { id: "thanks", href: p("/seller-services/thanks/"), label: "Submitted" },
    { id: "portal", href: p("/seller-services/portal/"), label: "Workspace" },
    { id: "kit", href: p("/seller-services/kit/"), label: "Deal Kit" },
    { id: "finance", href: p("/seller-services/finance/"), label: "Financing" },
  ];

  function injectChrome() {
    if (document.querySelector(".dl-rail")) return;
    const here = document.body.dataset.funnel || "land";
    const idx = Math.max(0, STAGES.findIndex((s) => s.id === here));

    const rail = document.createElement("nav");
    rail.className = "dl-rail";
    rail.setAttribute("aria-label", "Seller Services stages");
    rail.innerHTML = STAGES.map((s, i) => {
      const state = i < idx ? "is-done" : i === idx ? "is-now" : "";
      return `<a class="dl-rail-step ${state}" href="${s.href}" data-stage="${s.id}">
        <span class="dl-rail-num">${i + 1}</span>
        <span class="dl-rail-label">${s.label}</span>
      </a>`;
    }).join('<span class="dl-rail-line" aria-hidden="true"></span>');

    const header = document.querySelector(".site-header");
    if (header) header.insertAdjacentElement("afterend", rail);
    else document.body.insertAdjacentElement("afterbegin", rail);
  }

  function bindWizard() {
    const form = document.querySelector("[data-wizard]");
    if (!form) return;
    const steps = Array.from(form.querySelectorAll("[data-step]"));
    const dots = Array.from(form.querySelectorAll("[data-dot]"));
    let n = 0;

    function show(i) {
      n = Math.max(0, Math.min(steps.length - 1, i));
      steps.forEach((el, k) => (el.hidden = k !== n));
      dots.forEach((el, k) => {
        el.classList.toggle("is-on", k === n);
        el.classList.toggle("is-done", k < n);
      });
      const fill = form.querySelector("[data-fill]");
      if (fill) fill.style.width = ((n + 1) / steps.length) * 100 + "%";
      form.querySelector("[data-back]").hidden = n === 0;
      form.querySelector("[data-next]").hidden = n === steps.length - 1;
      form.querySelector("[data-submit]").hidden = n !== steps.length - 1;
    }

    form.querySelector("[data-next]")?.addEventListener("click", () => {
      const pane = steps[n];
      const bad = pane && Array.from(pane.querySelectorAll("[required]")).find((el) => !el.checkValidity());
      if (bad) {
        bad.reportValidity();
        return;
      }
      show(n + 1);
    });
    form.querySelector("[data-back]")?.addEventListener("click", () => show(n - 1));
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      try {
        localStorage.setItem("recr_seller_services", JSON.stringify({ ...data, submittedAt: new Date().toISOString() }));
      } catch (_) {}
      location.href = p("/seller-services/thanks/");
    });
    show(0);
  }

  function bindCopy() {
    document.querySelectorAll("[data-copy]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const sel = btn.getAttribute("data-copy");
        const src = sel ? document.querySelector(sel) : null;
        const text = ((src && (src.value || src.textContent)) || "").trim();
        try {
          await navigator.clipboard.writeText(text);
          const old = btn.textContent;
          btn.textContent = "Copied";
          setTimeout(() => (btn.textContent = old), 1400);
        } catch (_) {}
      });
    });
  }

  function bindFaq() {
    document.querySelectorAll("[data-faq] button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.closest("[data-faq-item]");
        const open = item.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
  }

  function fillPortal() {
    const slot = document.querySelector("[data-saved-deal]");
    if (!slot) return;
    let saved = null;
    try {
      saved = JSON.parse(localStorage.getItem("recr_seller_services") || "null");
    } catch (_) {}
    if (!saved) return;
    slot.hidden = false;
    slot.querySelector("[data-saved-name]").textContent = saved.name || "you";
    slot.querySelector("[data-saved-addr]").textContent = saved.address || "Address on file";
  }

  function whenHeader(fn) {
    if (document.querySelector(".site-header")) {
      fn();
      return;
    }
    const obs = new MutationObserver(() => {
      if (document.querySelector(".site-header")) {
        obs.disconnect();
        fn();
      }
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(() => {
      obs.disconnect();
      fn();
    }, 800);
  }

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(function () {
    whenHeader(injectChrome);
    bindWizard();
    bindCopy();
    bindFaq();
    fillPortal();
    const share = document.getElementById("share-link");
    if (share) share.value = location.origin + p("/seller-services/kit/");
  });
})();
