/**
 * Doodle Bug corner robot — closed chat circle only.
 *
 * Small fixed circle, bottom-left. No open panel, no follow, no sequence.
 */
(function () {
  "use strict";

  if (window.__doodleBugCornerRobotLoaded) return;
  window.__doodleBugCornerRobotLoaded = true;

  var config = window.ROBOT_CHAT_CONFIG || {};
  var robotSrc =
    config.robotCircleSrc ||
    config.robotSrc ||
    "./robot/chatbot-robot-circle.png";

  function build() {
    if (document.getElementById("sj-chatbot")) return;

    var style = document.createElement("style");
    style.id = "doodle-bug-corner-robot-styles";
    style.textContent =
      "#sj-chatbot{" +
      "position:fixed;left:16px;bottom:16px;z-index:40;pointer-events:none;" +
      "width:64px;height:64px;display:grid;place-items:center;" +
      "border-radius:50%;" +
      "background:rgba(255,255,255,.92);" +
      "box-shadow:0 8px 22px rgba(23,35,63,.22);" +
      "border:2px solid rgba(255,255,255,.95);" +
      "overflow:hidden;" +
      "}" +
      "#sj-chatbot .sj-corner-robot{" +
      "display:block;width:56px;height:56px;object-fit:cover;" +
      "border-radius:50%;" +
      "}" +
      "@media (max-width:640px){" +
      "#sj-chatbot{left:12px;bottom:12px;width:54px;height:54px;}" +
      "#sj-chatbot .sj-corner-robot{width:46px;height:46px;}" +
      "}";
    document.head.appendChild(style);

    var root = document.createElement("div");
    root.id = "sj-chatbot";
    root.setAttribute("aria-hidden", "true");
    root.innerHTML =
      '<img class="sj-corner-robot" src="' +
      robotSrc +
      '" alt="" width="56" height="56" draggable="false" />';
    document.body.appendChild(root);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build, { once: true });
  } else {
    build();
  }
})();
