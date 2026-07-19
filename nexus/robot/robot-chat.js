/**
 * Robot Chat — staged floating assistant
 * Canonical package: ~/Me-Nexus/library/Robot Chat/
 *
 * Desktop: circle → full chat → mid → center → mouse follow
 * Mobile:  circle → full chat (no movement); auto-close to circle after 8s if not dismissed
 *
 * Optional window.ROBOT_CHAT_CONFIG:
 *   robotSrc, robotCircleSrc, chatHref, homeHref, chatLabel, homeLabel,
 *   messageHtml — speech bubble HTML (default Hello / help today)
 *   storageKey (default robot-chat-seen-v2)
 *   storage — "session" (default, once per browser session) | "local" (once ever per browser)
 *
 * Events (for host sites with ambient cursor, e.g. Resonant/Impulse):
 *   robot-chat:cursor-pause  — fired when circle starts following the mouse
 *   robot-chat:cursor-resume — fired when bot is closed after follow
 */
(function () {
  if (window.__robotChatLoaded || window.__sjChatbotLoaded) return;
  window.__robotChatLoaded = true;
  window.__sjChatbotLoaded = true;

  var C = window.ROBOT_CHAT_CONFIG || {};
  var T_CIRCLE = 6000;
  var T_OPEN = 12000;
  var T_MID = 18000;
  var T_CIRCLE_MID = 24000;
  var T_CIRCLE_CENTER = 27000;
  // Mobile: circle @ 6s → open @ 9s → auto-close to circle 8s after open
  var T_MOBILE_CIRCLE = 6000;
  var T_MOBILE_OPEN = 9000;
  var T_MOBILE_AUTO_CLOSE = 8000;
  var ROBOT = C.robotSrc || "assets/chatbot-robot.png";
  var ROBOT_CIRCLE = C.robotCircleSrc || "assets/chatbot-robot-circle.png";
  var CHAT_HREF = C.chatHref || "#contact";
  var HOME_HREF = C.homeHref || "#top";
  var CHAT_LABEL = C.chatLabel || "Chat Live";
  var HOME_LABEL = C.homeLabel || "Take Me Home";
  var MESSAGE_HTML =
    C.messageHtml || "Hello!<br>How can I<br>help you today?";
  // v2: do not mark seen until sequence finishes (v1 marked at stage 1 and got stuck)
  var STORAGE_KEY = C.storageKey || "robot-chat-seen-v2";
  // "local" = once ever (FCR admin); "session" = once per visit (Resonant default)
  var USE_LOCAL = String(C.storage || "session").toLowerCase() === "local";
  var store = USE_LOCAL ? window.localStorage : window.sessionStorage;

  // Trail behind pointer (Resonant ambient uses 0.25; lower = more lag)
  var FOLLOW_LERP = 0.18;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var canUseFollow =
    finePointer && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Mobile / touch: simple circle ↔ chat only (no stage travel)
  var isMobileUI =
    !finePointer || window.matchMedia("(max-width: 991px)").matches;

  function emit(name) {
    try {
      window.dispatchEvent(new CustomEvent(name, { detail: { source: "robot-chat" } }));
    } catch (err) {}
  }

  function hasSeenSequence() {
    try {
      return store && store.getItem(STORAGE_KEY) === "1";
    } catch (err) {
      return false;
    }
  }

  function markSequenceSeen() {
    try {
      if (store) store.setItem(STORAGE_KEY, "1");
    } catch (err) {}
  }

  /** Stop page UI under the bot from receiving the event (bubble phase only) */
  function stopPageHit(e) {
    if (!e) return;
    e.stopPropagation();
  }

  var STYLE = [
    "#sj-chatbot{",
    "position:fixed;left:14px;bottom:14px;top:auto;right:auto;",
    "z-index:2147483600;font-family:Helvetica,Arial,sans-serif;",
    "pointer-events:none;",
    "transition:left .9s cubic-bezier(.22,.61,.36,1),right .9s cubic-bezier(.22,.61,.36,1),bottom .9s cubic-bezier(.22,.61,.36,1),top .9s cubic-bezier(.22,.61,.36,1),transform .9s cubic-bezier(.22,.61,.36,1);",
    "}",
    "#sj-chatbot *{box-sizing:border-box;}",
    "#sj-chatbot.is-on{pointer-events:auto;}",
    /* capture hits so nothing underneath receives the click */
    "#sj-chatbot.is-on .sj-open,",
    "#sj-chatbot.is-on .sj-circle-slot,",
    "#sj-chatbot.is-on .sj-circle,",
    "#sj-chatbot.is-on .sj-circle-x,",
    "#sj-chatbot.is-on .sj-x,",
    "#sj-chatbot.is-on .sj-btn{pointer-events:auto;}",
    "#sj-chatbot.is-hidden{display:none!important;}",

    "#sj-chatbot.is-mid{left:14px;right:auto;top:50%;bottom:auto;transform:translateY(-50%);}",
    "#sj-chatbot.is-center{left:50%;right:auto;top:50%;bottom:auto;transform:translate(-50%,-50%);}",
    "#sj-chatbot.is-center:not(.is-following),",
    "#sj-chatbot.is-center:not(.is-following) *{pointer-events:none!important;}",

    "#sj-chatbot.is-closed,",
    "#sj-chatbot.is-circle:not(.is-mid):not(.is-center):not(.is-following){",
    "left:14px!important;right:auto!important;top:auto!important;bottom:14px!important;transform:none!important;",
    "}",

    "#sj-chatbot.is-following{",
    "left:0!important;top:0!important;right:auto!important;bottom:auto!important;",
    "transition:none!important;will-change:transform;",
    "pointer-events:none;",
    "}",
    "#sj-chatbot.is-following .sj-circle-slot{",
    "pointer-events:auto;z-index:2147483601;",
    "}",
    "#sj-chatbot.is-following .sj-circle{pointer-events:auto;}",
    /* X above robot, always tappable during follow */
    "#sj-chatbot.is-following .sj-circle-x{",
    "display:grid!important;pointer-events:auto!important;z-index:2147483602;",
    "}",

    "#sj-chatbot .sj-open{display:none!important;align-items:flex-end;gap:2px;}",
    "#sj-chatbot.is-open .sj-open{display:flex!important;}",
    "#sj-chatbot.is-circle .sj-open,#sj-chatbot.is-closed .sj-open{display:none!important;}",

    "#sj-chatbot .sj-robot{",
    "width:120px;height:120px;flex-shrink:0;object-fit:contain;display:block;",
    "background:transparent!important;border:0!important;box-shadow:none!important;",
    "filter:drop-shadow(0 10px 18px rgba(30,100,255,0.35));",
    "}",

    "#sj-chatbot .sj-speech{position:relative;margin:0 0 34px 0;max-width:min(250px,calc(100vw - 150px));}",
    "#sj-chatbot .sj-speech-inner{",
    "position:relative;padding:16px 18px 14px;border-radius:18px;",
    "background:linear-gradient(145deg,#163a7a,#0a162e);",
    "border:1.5px solid rgba(110,185,255,0.65);",
    "box-shadow:0 0 22px rgba(50,130,255,0.28),0 10px 28px rgba(0,0,0,0.28);color:#eaf4ff;",
    "}",
    "#sj-chatbot .sj-speech-inner:before{",
    "content:'';position:absolute;inset:0;border-radius:18px;pointer-events:none;",
    "background-image:linear-gradient(rgba(90,170,255,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(90,170,255,0.07) 1px,transparent 1px);",
    "background-size:12px 12px;",
    "}",
    "#sj-chatbot .sj-speech-inner:after{",
    "content:'';position:absolute;right:-8px;bottom:16px;width:16px;height:16px;",
    "background:#0d1c3a;border-right:1.5px solid rgba(110,185,255,0.65);border-bottom:1.5px solid rgba(110,185,255,0.65);",
    "transform:rotate(-45deg);",
    "}",

    "#sj-chatbot .sj-x{",
    "position:absolute;top:6px;right:6px;z-index:3;",
    "width:26px;height:26px;border-radius:50%;",
    "border:1px solid rgba(120,180,255,0.35);",
    "background:rgba(0,0,0,0.45);color:#eaf4ff;",
    "font-size:18px;line-height:1;cursor:pointer;display:grid;place-items:center;padding:0;",
    "}",
    "#sj-chatbot .sj-msg{",
    "position:relative;z-index:1;margin:0 0 12px;padding-right:22px;",
    "font-size:14px;font-weight:700;line-height:1.3;",
    "text-shadow:0 0 10px rgba(80,160,255,0.4);",
    "}",
    "#sj-chatbot .sj-actions{position:relative;z-index:1;display:flex;flex-direction:column;gap:8px;}",
    "#sj-chatbot .sj-btn{",
    "display:flex;align-items:center;justify-content:center;",
    "min-height:36px;padding:0 12px;border-radius:999px;",
    "border:1px solid rgba(120,185,255,0.55);",
    "background:rgba(70,150,255,0.2);",
    "color:#eaf4ff!important;text-decoration:none!important;",
    "font-size:12px;font-weight:600;text-align:center;",
    "}",
    "#sj-chatbot .sj-btn:hover{background:rgba(70,150,255,0.32);}",
    "#sj-chatbot .sj-btn-alt{background:rgba(255,255,255,0.07);border-color:rgba(180,210,255,0.4);}",
    "#sj-chatbot .sj-btn-alt:hover{background:rgba(255,255,255,0.14);}",

    "#sj-chatbot .sj-circle-slot{",
    "display:none;position:relative;width:64px;height:64px;",
    "}",
    "#sj-chatbot .sj-circle{",
    "display:block;width:64px;height:64px;padding:0;border:0;",
    "border-radius:50%;overflow:hidden;cursor:pointer;",
    "background:radial-gradient(circle at 40% 35%,#1a3a7a 0%,#05080f 70%);",
    "box-shadow:0 8px 24px rgba(20,80,200,0.4),0 0 0 2px rgba(100,170,255,0.35);",
    "}",
    "#sj-chatbot .sj-circle img{width:100%;height:100%;object-fit:cover;display:block;pointer-events:none;}",
    "#sj-chatbot .sj-circle-x{",
    "display:none;position:absolute;left:50%;top:50%;z-index:4;",
    "width:26px;height:26px;margin:0;padding:0;border-radius:50%;",
    "border:1px solid rgba(120,180,255,0.55);",
    "background:rgba(0,0,0,0.55);color:#eaf4ff;",
    "font-size:16px;line-height:1;font-weight:700;",
    "transform:translate(-50%,-35%);",
    "cursor:pointer;place-items:center;",
    "box-shadow:0 2px 8px rgba(0,0,0,0.35);",
    "}",
    "#sj-chatbot.is-following .sj-circle-x{display:grid;}",
    "#sj-chatbot .sj-circle-x:hover{background:rgba(20,40,80,0.75);border-color:rgba(150,200,255,0.8);}",
    "#sj-chatbot.is-circle .sj-circle-slot,#sj-chatbot.is-closed .sj-circle-slot{display:block!important;}",
    "#sj-chatbot.is-open .sj-circle-slot{display:none!important;}",

    "@media (max-width:420px){",
    "#sj-chatbot .sj-robot{width:100px;height:100px;}",
    "#sj-chatbot .sj-speech{max-width:min(210px,calc(100vw - 130px));}",
    "#sj-chatbot .sj-circle-slot,#sj-chatbot .sj-circle{width:58px;height:58px;}",
    "#sj-chatbot .sj-circle-x{width:24px;height:24px;font-size:15px;}",
    "}",
    "@media (prefers-reduced-motion:reduce){#sj-chatbot{transition:none;}}"
  ].join("");

  function build() {
    if (document.getElementById("sj-chatbot")) return;

    var style = document.createElement("style");
    style.id = "sj-chatbot-styles";
    style.textContent = STYLE;
    document.head.appendChild(style);

    var root = document.createElement("div");
    root.id = "sj-chatbot";
    root.className = "is-hidden";
    root.innerHTML =
      '<div class="sj-open" aria-hidden="true">' +
      '  <div class="sj-speech" role="dialog" aria-label="Chat">' +
      '    <div class="sj-speech-inner">' +
      '      <button type="button" class="sj-x" aria-label="Close chat">&times;</button>' +
      '      <p class="sj-msg">' + MESSAGE_HTML + "</p>" +
      '      <div class="sj-actions">' +
      '        <a class="sj-btn" href="' + CHAT_HREF + '">' + CHAT_LABEL + "</a>" +
      '        <a class="sj-btn sj-btn-alt" href="' + HOME_HREF + '">' + HOME_LABEL + "</a>" +
      "      </div>" +
      "    </div>" +
      "  </div>" +
      '  <img class="sj-robot" src="' + ROBOT + '" alt="" width="120" height="120" draggable="false" />' +
      "</div>" +
      '<div class="sj-circle-slot">' +
      '  <button type="button" class="sj-circle" aria-label="Open chat">' +
      '    <img src="' + ROBOT_CIRCLE + '" alt="" width="64" height="64" draggable="false" />' +
      "  </button>" +
      '  <button type="button" class="sj-circle-x" aria-label="Close chat" tabindex="-1">&times;</button>' +
      "</div>";

    document.body.appendChild(root);

    var openEl = root.querySelector(".sj-open");
    var xBtn = root.querySelector(".sj-x");
    var circle = root.querySelector(".sj-circle");
    var circleX = root.querySelector(".sj-circle-x");

    var dismissed = false;
    var timers = [];
    var ambientPaused = false;

    var followOn = false;
    var targetX = window.innerWidth / 2;
    var targetY = window.innerHeight / 2;
    var currentX = targetX;
    var currentY = targetY;
    var mouseSeen = false;
    var frameId = 0;

    function halfSize() {
      return (circle.offsetWidth || 64) / 2;
    }

    function clearTimers() {
      while (timers.length) clearTimeout(timers.pop());
    }

    function pauseAmbient() {
      if (ambientPaused) return;
      ambientPaused = true;
      emit("robot-chat:cursor-pause");
    }

    function resumeAmbient() {
      if (!ambientPaused) return;
      ambientPaused = false;
      emit("robot-chat:cursor-resume");
    }

    function stopFollow() {
      followOn = false;
      if (frameId) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
      }
      root.style.transform = "";
    }

    function renderFollow() {
      if (!followOn) return;
      currentX += (targetX - currentX) * FOLLOW_LERP;
      currentY += (targetY - currentY) * FOLLOW_LERP;
      var h = halfSize();
      root.style.transform =
        "translate3d(" + (currentX - h) + "px," + (currentY - h) + "px,0)";
      frameId = window.requestAnimationFrame(renderFollow);
    }

    function onMouseMove(e) {
      targetX = e.clientX;
      targetY = e.clientY;
      mouseSeen = true;
    }

    function startFollow() {
      if (!canUseFollow || followOn) return;
      followOn = true;
      // Full auto sequence has played — stay closed corner on next page/load
      markSequenceSeen();
      root.className = "is-on is-circle is-following";
      openEl.setAttribute("aria-hidden", "true");

      currentX = window.innerWidth / 2;
      currentY = window.innerHeight / 2;
      if (!mouseSeen) {
        targetX = currentX;
        targetY = currentY;
      }
      var h = halfSize();
      root.style.transform =
        "translate3d(" + (currentX - h) + "px," + (currentY - h) + "px,0)";
      if (frameId) window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(renderFollow);

      // Host ambient cursor (Resonant/Impulse dot) yields to robot
      pauseAmbient();
    }

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener(
      "pagehide",
      function () {
        if (frameId) window.cancelAnimationFrame(frameId);
        resumeAmbient();
      },
      { once: true }
    );

    function showHidden() {
      stopFollow();
      root.className = "is-hidden";
      openEl.setAttribute("aria-hidden", "true");
    }

    function showCircle() {
      stopFollow();
      root.className = "is-on is-circle";
      openEl.setAttribute("aria-hidden", "true");
    }

    function showOpen() {
      stopFollow();
      root.className = "is-on is-open";
      openEl.setAttribute("aria-hidden", "false");
    }

    /** Mobile: schedule collapse to corner circle if still open after 8s */
    function scheduleMobileAutoClose() {
      timers.push(
        setTimeout(function () {
          if (dismissed) return;
          if (!root.classList.contains("is-open")) return;
          markSequenceSeen();
          showClosedCircle();
        }, T_MOBILE_AUTO_CLOSE)
      );
    }

    function showOpenMid() {
      stopFollow();
      root.className = "is-on is-open is-mid";
      openEl.setAttribute("aria-hidden", "false");
    }

    function showCircleMid() {
      stopFollow();
      root.className = "is-on is-circle is-mid";
      openEl.setAttribute("aria-hidden", "true");
    }

    function showCircleCenter() {
      stopFollow();
      root.className = "is-on is-circle is-center";
      openEl.setAttribute("aria-hidden", "true");

      // No mouse-follow on touch / reduced-motion: sequence complete after center
      if (!canUseFollow) {
        markSequenceSeen();
        return;
      }

      timers.push(
        setTimeout(function () {
          if (dismissed) return;
          startFollow();
        }, 2950)
      );
    }

    function showClosedCircle() {
      stopFollow();
      root.className = "is-on is-closed";
      openEl.setAttribute("aria-hidden", "true");
    }

    function dismissBot(e) {
      if (e) stopPageHit(e);
      dismissed = true;
      markSequenceSeen();
      clearTimers();
      showClosedCircle();
      // restore host ambient cursor after follow stage ends
      resumeAmbient();
    }

    // Bubble-phase only: let our buttons handle the event first, then block page
    ["click", "mousedown", "pointerdown", "touchstart"].forEach(function (type) {
      root.addEventListener(
        type,
        function (e) {
          if (root.classList.contains("is-hidden")) return;
          var t = e.target;
          if (t && t.closest && t.closest("a.sj-btn")) return;
          e.stopPropagation();
        },
        false
      );
    });

    xBtn.addEventListener("click", dismissBot);

    // Stomach X — only while following
    function onCircleClose(e) {
      if (!root.classList.contains("is-following")) return;
      stopPageHit(e);
      if (e && e.preventDefault) e.preventDefault();
      dismissBot(e);
    }
    circleX.addEventListener("pointerdown", onCircleClose);
    circleX.addEventListener("click", onCircleClose);

    circle.addEventListener("click", function (e) {
      stopPageHit(e);
      if (root.classList.contains("is-following")) {
        dismissBot(e);
        return;
      }
      // Open only from parked closed corner (or mobile circle after auto-sequence)
      if (!root.classList.contains("is-closed") && !root.classList.contains("is-circle")) {
        return;
      }
      // Don't abort desktop auto-sequence mid-run (is-circle before closed)
      if (!isMobileUI && !root.classList.contains("is-closed")) return;

      clearTimers();
      dismissed = false;
      showOpen();
      if (isMobileUI) {
        // Re-open on mobile also auto-collapses after 8s
        scheduleMobileAutoClose();
      } else {
        markSequenceSeen();
        dismissed = true;
      }
    });
    // While following, press on the circle also closes (same as X)
    circle.addEventListener("pointerdown", function (e) {
      if (!root.classList.contains("is-following")) return;
      stopPageHit(e);
      if (e.preventDefault) e.preventDefault();
      dismissBot(e);
    });

    function startMobileSequence() {
      dismissed = false;
      clearTimers();
      stopFollow();
      resumeAmbient();
      showHidden();

      // Circle only (bottom-left) — no travel
      timers.push(
        setTimeout(function () {
          if (dismissed) return;
          showCircle();
        }, T_MOBILE_CIRCLE)
      );

      // Open chatbot
      timers.push(
        setTimeout(function () {
          if (dismissed) return;
          showOpen();
          scheduleMobileAutoClose();
        }, T_MOBILE_OPEN)
      );
    }

    function startDesktopSequence() {
      dismissed = false;
      clearTimers();
      stopFollow();
      resumeAmbient();
      showHidden();

      // Absolute timers from load — no class gates
      timers.push(
        setTimeout(function () {
          if (dismissed) return;
          showCircle();
        }, T_CIRCLE)
      );

      timers.push(
        setTimeout(function () {
          if (dismissed) return;
          showOpen();
        }, T_OPEN)
      );

      timers.push(
        setTimeout(function () {
          if (dismissed) return;
          showOpenMid();
        }, T_MID)
      );

      timers.push(
        setTimeout(function () {
          if (dismissed) return;
          showCircleMid();
        }, T_CIRCLE_MID)
      );

      timers.push(
        setTimeout(function () {
          if (dismissed) return;
          showCircleCenter();
        }, T_CIRCLE_CENTER)
      );
    }

    function startSequence() {
      // Already finished this site visit → stay parked closed bottom-left
      if (hasSeenSequence()) {
        dismissed = true;
        clearTimers();
        stopFollow();
        resumeAmbient();
        showClosedCircle();
        return;
      }

      if (isMobileUI) startMobileSequence();
      else startDesktopSequence();
    }

    if (document.readyState === "complete") {
      startSequence();
    } else {
      window.addEventListener("load", startSequence, { once: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build, { once: true });
  } else {
    build();
  }
})();
