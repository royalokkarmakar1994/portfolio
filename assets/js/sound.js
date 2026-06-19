/* ============================================================
   ARK-OS — sound engine (synthesized via Web Audio, no files)
   - subtle UI click on interactive elements
   - "open" chime when a window opens
   - mute toggle in the taskbar tray (persisted)
   ============================================================ */
(function () {
  "use strict";
  const KEY = "arkos.muted";
  let muted = localStorage.getItem(KEY) === "1";
  let ctx = null;

  function ac() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  // a tiny envelope-shaped tone
  function tone({ freq = 440, type = "sine", dur = 0.08, gain = 0.05, slideTo = null, delay = 0 }) {
    if (muted) return;
    const c = ac();
    if (!c) return;
    const t0 = c.currentTime + delay;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  const SFX = {
    click: () => tone({ freq: 520, type: "triangle", dur: 0.045, gain: 0.035, slideTo: 380 }),
    open:  () => { tone({ freq: 440, type: "sine", dur: 0.1, gain: 0.05, slideTo: 660 }); tone({ freq: 660, type: "sine", dur: 0.12, gain: 0.04, delay: 0.07, slideTo: 880 }); },
    close: () => tone({ freq: 400, type: "sine", dur: 0.1, gain: 0.04, slideTo: 200 }),
    toggle:() => tone({ freq: 300, type: "square", dur: 0.05, gain: 0.03, slideTo: 500 }),
  };

  // public
  window.ARKSound = {
    play: (name) => { if (SFX[name]) SFX[name](); },
    isMuted: () => muted,
    setMuted: (v) => { muted = !!v; localStorage.setItem(KEY, muted ? "1" : "0"); updateBtn(); },
    toggle: () => window.ARKSound.setMuted(!muted),
  };

  let btn;
  function updateBtn() {
    if (!btn) return;
    btn.textContent = muted ? "🔇" : "🔊";
    btn.title = muted ? "Sound off — click to unmute" : "Sound on — click to mute";
    btn.style.opacity = muted ? "0.5" : "1";
  }

  function init() {
    if (!window.ARKOS) return;

    // mute toggle in the taskbar tray (before the clock)
    const tray = window.ARKOS.taskbarTray;
    if (tray) {
      btn = document.createElement("div");
      btn.className = "tray-item";
      btn.style.cursor = "pointer";
      btn.addEventListener("click", () => { window.ARKSound.toggle(); SFX.toggle(); });
      const clock = tray.querySelector(".tray-clock");
      const divider = clock ? clock.previousElementSibling : null;
      tray.insertBefore(btn, divider || clock || null);
      updateBtn();
    }

    // window open/close chimes
    window.ARKOS.on("open", () => SFX.open());
    window.ARKOS.on("close", () => SFX.close());

    // delegated UI click sound on interactive elements
    document.addEventListener("pointerdown", (e) => {
      const t = e.target.closest(
        ".desk-icon, .sm-item, .tb-app, .start-btn, .tl, .app-btn, .contact-row, .proj-card, .sm-foot-btn, .tray-item, button"
      );
      if (t && !t.classList.contains("term-input")) SFX.click();
    }, { passive: true });
  }

  // ARKOS may not be ready yet; wait for it
  function waitForOS(tries) {
    if (window.ARKOS) init();
    else if (tries > 0) setTimeout(() => waitForOS(tries - 1), 40);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => waitForOS(50));
  else waitForOS(50);
})();
