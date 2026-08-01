/**
 * FCR / RECR site corner robot — closed chat circle only.
 *
 * Small fixed circle, bottom-left. No popup, no animation, no open panel.
 */
(function () {
  "use strict";

  if (window.__fcrCornerRobotLoaded) return;
  window.__fcrCornerRobotLoaded = true;

  var CIRCLE =
    "https://richardbjamison.github.io/faber-capital-resources/nexus/robot/chatbot-robot-circle.png";

  function build() {
    if (document.getElementById("fcr-corner-robot")) return;

    var style = document.createElement("style");
    style.id = "fcr-corner-robot-styles";
    style.textContent =
      "#fcr-corner-robot{" +
      "position:fixed;left:16px;bottom:16px;z-index:50;pointer-events:none;" +
      "width:64px;height:64px;display:grid;place-items:center;" +
      "border-radius:50%;" +
      "background:rgba(255,255,255,.92);" +
      "box-shadow:0 8px 22px rgba(23,35,63,.22);" +
      "border:2px solid rgba(255,255,255,.95);" +
      "overflow:hidden;" +
      "}" +
      "#fcr-corner-robot img{" +
      "display:block;width:56px;height:56px;object-fit:cover;" +
      "border-radius:50%;" +
      "}" +
      "@media (max-width:640px){" +
      "#fcr-corner-robot{left:12px;bottom:12px;width:54px;height:54px;}" +
      "#fcr-corner-robot img{width:46px;height:46px;}" +
      "}";
    document.head.appendChild(style);

    var root = document.createElement("div");
    root.id = "fcr-corner-robot";
    root.setAttribute("aria-hidden", "true");
    root.innerHTML =
      '<img src="' +
      CIRCLE +
      '" alt="" width="56" height="56" draggable="false" />';
    document.body.appendChild(root);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build, { once: true });
  } else {
    build();
  }
})();
