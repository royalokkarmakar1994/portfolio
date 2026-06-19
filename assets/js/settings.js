/* ============================================================
   ARK-OS — Display Settings app
   accent color · wallpaper · light/dark · brightness
   persisted to localStorage, applied on boot
   ============================================================ */
(function () {
  "use strict";
  const KEY = "arkos.settings";

  const ACCENTS = [
    { id: "cyan",   name: "Cyan",   a: "#38bdf8", b: "#2dd4bf", glow: "rgba(56,189,248,0.35)" },
    { id: "violet", name: "Violet", a: "#a78bfa", b: "#f472b6", glow: "rgba(167,139,250,0.35)" },
    { id: "emerald",name: "Emerald",a: "#34d399", b: "#22d3ee", glow: "rgba(52,211,153,0.35)" },
    { id: "amber",  name: "Amber",  a: "#fbbf24", b: "#fb923c", glow: "rgba(251,191,36,0.35)" },
    { id: "rose",   name: "Rose",   a: "#fb7185", b: "#f472b6", glow: "rgba(251,113,133,0.35)" },
    { id: "blue",   name: "Royal",  a: "#60a5fa", b: "#818cf8", glow: "rgba(96,165,250,0.35)" },
  ];

  const WALLS = [
    { id: "aurora",  name: "Aurora",  css: "radial-gradient(ellipse 80% 60% at 75% 15%, rgba(56,189,248,0.10), transparent 60%), radial-gradient(ellipse 70% 60% at 15% 85%, rgba(45,212,191,0.08), transparent 60%), linear-gradient(180deg, #0a0e1a 0%, #070a13 100%)" },
    { id: "nebula",  name: "Nebula",  css: "radial-gradient(ellipse 70% 70% at 30% 25%, rgba(167,139,250,0.16), transparent 60%), radial-gradient(ellipse 60% 60% at 80% 80%, rgba(244,114,182,0.10), transparent 60%), linear-gradient(180deg, #0c0a18 0%, #060410 100%)" },
    { id: "deep",    name: "Deep",    css: "radial-gradient(ellipse 90% 70% at 50% 0%, rgba(34,211,238,0.10), transparent 65%), linear-gradient(180deg, #04111a 0%, #02080d 100%)" },
    { id: "carbon",  name: "Carbon",  css: "linear-gradient(180deg, #0c1018 0%, #06080d 100%)" },
    { id: "sunset",  name: "Sunset",  css: "radial-gradient(ellipse 80% 60% at 50% 110%, rgba(251,146,60,0.16), transparent 60%), radial-gradient(ellipse 70% 50% at 50% -10%, rgba(167,139,250,0.12), transparent 60%), linear-gradient(180deg, #120a14 0%, #07050a 100%)" },
  ];

  const DEFAULTS = { accent: "cyan", wallpaper: "aurora", theme: "dark", brightness: 100 };

  function load() {
    try { return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem(KEY) || "{}")); }
    catch (e) { return Object.assign({}, DEFAULTS); }
  }
  function save(s) { localStorage.setItem(KEY, JSON.stringify(s)); }

  let state = load();

  function apply(s) {
    const root = document.documentElement;
    const ac = ACCENTS.find((x) => x.id === s.accent) || ACCENTS[0];
    root.style.setProperty("--accent", ac.a);
    root.style.setProperty("--accent-2", ac.b);
    root.style.setProperty("--accent-glow", ac.glow);
    root.style.setProperty("--blue-soft", hexA(ac.a, 0.12));
    root.style.setProperty("--teal-soft", hexA(ac.b, 0.12));

    const wall = WALLS.find((x) => x.id === s.wallpaper) || WALLS[0];
    const desk = document.getElementById("desktop");
    if (desk) desk.style.background = wall.css;

    root.setAttribute("data-theme", s.theme);
    root.style.filter = s.brightness !== 100 ? `brightness(${s.brightness}%)` : "";
  }

  // hex -> rgba string with alpha
  function hexA(hex, a) {
    const n = hex.replace("#", "");
    const r = parseInt(n.substring(0, 2), 16), g = parseInt(n.substring(2, 4), 16), b = parseInt(n.substring(4, 6), 16);
    return `rgba(${r},${g},${b},${a})`;
  }

  // apply immediately on load (before boot finishes) so it's never a flash
  apply(state);

  function render() {
    const esc = window.ARKOS ? window.ARKOS.esc : (x) => x;
    const accentSwatches = ACCENTS.map((a) =>
      `<button class="set-swatch ${a.id === state.accent ? "active" : ""}" data-accent="${a.id}" title="${a.name}"
        style="background:linear-gradient(135deg,${a.a},${a.b})"></button>`
    ).join("");
    const wallCards = WALLS.map((w) =>
      `<button class="set-wall ${w.id === state.wallpaper ? "active" : ""}" data-wall="${w.id}" title="${w.name}">
        <span class="set-wall-prev" style="background:${w.css}"></span>
        <span class="set-wall-name">${w.name}</span>
      </button>`
    ).join("");
    return `
      <div class="app-eyebrow">System</div>
      <div class="app-title">Display Settings</div>
      <p class="app-sub">Personalize ARK-OS. Changes save automatically and persist on your next visit.</p>

      <div class="set-section">
        <div class="set-label">Accent color</div>
        <div class="set-swatches">${accentSwatches}</div>
      </div>

      <div class="set-section">
        <div class="set-label">Wallpaper</div>
        <div class="set-walls">${wallCards}</div>
      </div>

      <div class="set-section">
        <div class="set-label">Appearance</div>
        <div class="set-seg" id="set-theme">
          <button class="${state.theme === "dark" ? "active" : ""}" data-theme="dark">🌙 Dark</button>
          <button class="${state.theme === "light" ? "active" : ""}" data-theme="light">☀️ Light</button>
        </div>
      </div>

      <div class="set-section">
        <div class="set-label">Brightness · <span id="set-bright-val">${state.brightness}%</span></div>
        <input type="range" min="55" max="100" value="${state.brightness}" id="set-bright" class="set-range" />
      </div>

      <div class="set-section">
        <button class="app-btn ghost" id="set-reset">↺ Reset to defaults</button>
      </div>`;
  }

  function onMount(body) {
    function update(patch) {
      state = Object.assign({}, state, patch);
      save(state); apply(state);
    }
    body.querySelectorAll("[data-accent]").forEach((b) =>
      b.addEventListener("click", () => {
        update({ accent: b.dataset.accent });
        body.querySelectorAll("[data-accent]").forEach((x) => x.classList.toggle("active", x === b));
      })
    );
    body.querySelectorAll("[data-wall]").forEach((b) =>
      b.addEventListener("click", () => {
        update({ wallpaper: b.dataset.wall });
        body.querySelectorAll("[data-wall]").forEach((x) => x.classList.toggle("active", x === b));
      })
    );
    body.querySelectorAll("#set-theme button").forEach((b) =>
      b.addEventListener("click", () => {
        update({ theme: b.dataset.theme });
        body.querySelectorAll("#set-theme button").forEach((x) => x.classList.toggle("active", x === b));
      })
    );
    const range = body.querySelector("#set-bright");
    const val = body.querySelector("#set-bright-val");
    if (range) range.addEventListener("input", () => { val.textContent = range.value + "%"; update({ brightness: +range.value }); });
    const reset = body.querySelector("#set-reset");
    if (reset) reset.addEventListener("click", () => { state = Object.assign({}, DEFAULTS); save(state); apply(state); body.innerHTML = render(); onMount(body); });
  }

  function register() {
    if (!window.ARKOS) { setTimeout(register, 40); return; }
    window.ARKOS.registerApp("settings", {
      title: "Settings", glyph: "⚙️", render, onMount, w: 540, h: 600,
    });
  }
  register();
})();
