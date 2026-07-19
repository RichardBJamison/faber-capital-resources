/**
 * FCR hero boomerang — continuous play, soft end-caps (no hard freeze).
 * Pre-baked forward+reverse MP4.
 *
 * Cruise 0.65. Cap zones at start / mid / end.
 * End-cap slow is heavier than systems-control: floor ~half (0.12),
 * and easing dives harder into the turn (stay-cruise then steep drop).
 */
(function () {
  var v = document.getElementById("fcr-hero-video");
  if (!v) return;

  var CRUISE = 0.65;
  // Twice as slow at the turn as systems-control floor (0.23 → ~0.12)
  var FLOOR = 0.12;
  // Soft slow zone length (seconds of timeline on each side of a turnaround)
  var CAP = 0.55;
  var D = 0;
  var MID = 0;
  var ready = false;

  v.muted = true;
  v.defaultMuted = true;
  v.setAttribute("muted", "");
  v.setAttribute("playsinline", "");
  v.setAttribute("webkit-playsinline", "");
  v.setAttribute("autoplay", "");
  v.playsInline = true;
  v.controls = false;
  v.removeAttribute("controls");
  v.loop = false;
  v.removeAttribute("loop");
  v.preload = "auto";

  function setRate(rate) {
    var r = Math.max(0.0625, Math.min(2, rate));
    try {
      v.playbackRate = r;
    } catch (e) {
      try {
        v.playbackRate = CRUISE;
      } catch (e2) {}
    }
  }

  function play() {
    try {
      v.muted = true;
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
    } catch (e) {}
  }

  /** Distance to nearest turnaround (start, mid reverse, end). */
  function distToCap(t) {
    return Math.min(t, Math.abs(t - MID), Math.max(0, D - t));
  }

  /**
   * Soft cruise with end-cap dive.
   * Stays near CRUISE longer, then slows harder as it enters the turn —
   * not a linear/deliberate ease, not a hard stop.
   */
  function rateAt(t) {
    if (D <= 0) return CRUISE;
    var d = distToCap(t);
    if (d >= CAP) return CRUISE;
    var u = d / CAP; // 1 = zone edge (still fast), 0 = turnaround (floor)
    // Ease: stay closer to cruise early, dive to floor near the cap (power 3)
    var f = 1 - Math.pow(1 - u, 3);
    return FLOOR + (CRUISE - FLOOR) * f;
  }

  function wrapIfNeeded(t) {
    // Seamless cycle at end of reverse half — no pause
    if (t >= D - 0.04) {
      try {
        v.currentTime = 0.02;
      } catch (e) {}
      setRate(rateAt(0.02));
      play();
      return true;
    }
    return false;
  }

  function onTick() {
    if (!ready || D <= 0) return;
    if (v.paused) play();

    var t = v.currentTime || 0;
    if (wrapIfNeeded(t)) return;

    setRate(rateAt(t));
  }

  function onEnded() {
    try {
      v.currentTime = 0.02;
    } catch (e) {}
    setRate(rateAt(0.02));
    play();
  }

  function setup() {
    if (ready) return;
    D = v.duration || 0;
    if (!D || !isFinite(D)) return;
    MID = D * 0.5;
    ready = true;
    v.loop = false;
    try {
      if (v.currentTime > 0.15) v.currentTime = 0;
    } catch (e) {}
    setRate(rateAt(0));
    play();
  }

  v.addEventListener("timeupdate", onTick);
  v.addEventListener("ended", onEnded);
  v.addEventListener("seeking", function () {
    if (ready) setRate(rateAt(v.currentTime || 0));
  });

  function frame() {
    onTick();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  if (v.readyState >= 1) setup();
  else v.addEventListener("loadedmetadata", setup);

  v.addEventListener("loadeddata", play);
  v.addEventListener("canplay", function () {
    v.classList.add("ready");
    if (!ready) setup();
    play();
  });
  v.addEventListener("canplaythrough", play, { once: true });

  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) play();
  });
  window.addEventListener("pageshow", play);

  var unlock = function () {
    play();
    if (!ready && v.readyState >= 1) setup();
    document.removeEventListener("touchstart", unlock, true);
    document.removeEventListener("scroll", unlock, true);
    document.removeEventListener("click", unlock, true);
  };
  document.addEventListener("touchstart", unlock, { capture: true, passive: true });
  document.addEventListener("scroll", unlock, { capture: true, passive: true });
  document.addEventListener("click", unlock, { capture: true, passive: true });

  setTimeout(play, 400);
  setTimeout(function () {
    play();
    if (!ready && v.readyState >= 1) setup();
  }, 1200);
})();
