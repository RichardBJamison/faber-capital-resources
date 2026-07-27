/**
 * FCR site corner robot.
 *
 * Decorative presence only: no popup, no close control, no animation,
 * no pointer tracking, and no interruption to page navigation.
 */
(function () {
  "use strict";

  if (window.__fcrCornerRobotLoaded) return;
  window.__fcrCornerRobotLoaded = true;

  function build() {
    if (document.getElementById("fcr-corner-robot")) return;

    var style = document.createElement("style");
    style.id = "fcr-corner-robot-styles";
    style.textContent =
      "#fcr-corner-robot{" +
      "position:fixed;left:18px;bottom:14px;z-index:50;pointer-events:none;" +
      "width:104px;height:104px;display:grid;place-items:end start;" +
      "}" +
      "#fcr-corner-robot img{" +
      "display:block;width:104px;height:104px;object-fit:contain;" +
      "filter:drop-shadow(0 10px 18px rgba(23,35,63,.28));" +
      "}" +
      "@media (max-width:640px){#fcr-corner-robot{left:10px;bottom:10px;width:72px;height:72px;}#fcr-corner-robot img{width:72px;height:72px;}}";
    document.head.appendChild(style);

    var root = document.createElement("div");
    root.id = "fcr-corner-robot";
    root.setAttribute("aria-hidden", "true");
    root.innerHTML = '<img src="https://richardbjamison.github.io/faber-capital-resources/nexus/robot/chatbot-robot.png" alt="" width="104" height="104" draggable="false" />';
    document.body.appendChild(root);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build, { once: true });
  } else {
    build();
  }
})();
