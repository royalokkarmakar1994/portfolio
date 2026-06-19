/* ============================================================
   ARK-OS  —  desktop engine
   boot · window manager · taskbar · start menu · apps
   ============================================================ */
(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- App registry ---------- */
  const APPS = {
    about:    { title: "About Me",       glyph: "👤", render: renderAbout,    w: 560, h: 520 },
    skills:   { title: "Tech Stack",     glyph: "🧩", render: renderSkills,   w: 540, h: 560 },
    experience:{ title: "Experience",    glyph: "💼", render: renderExp,      w: 620, h: 580 },
    projects: { title: "Projects",       glyph: "🚀", render: renderProjects, w: 560, h: 560 },
    education:{ title: "Education",       glyph: "🎓", render: renderEducation,w: 560, h: 560 },
    contact:  { title: "Contact",        glyph: "✉️", render: renderContact,  w: 480, h: 540 },
    resume:   { title: "Résumé",         glyph: "📄", render: renderResume,   w: 600, h: 580 },
    terminal: { title: "ark@os: ~",      glyph: "🖥️", render: renderTerminal, w: 600, h: 420 },
  };

  // icons shown on the desktop + start menu (order matters)
  const DESKTOP_ORDER = ["about", "experience", "projects", "skills", "education", "resume", "contact", "terminal"];

  /* ---------- Window manager state ---------- */
  const windows = new Map(); // id -> { node, app, taskbarBtn, prevRect }
  let zCounter = 100;
  let openSeq = 0;

  /* ============================================================
     BOOT SEQUENCE
     ============================================================ */
  function boot() {
    const fill = $("#boot-fill");
    const log = $("#boot-log");
    const lines = [
      "initializing ark-kernel...",
      "mounting /portfolio",
      "loading agentic-ai modules",
      "starting window manager",
      "ready.",
    ];
    let p = 0, li = 0;
    const tick = setInterval(() => {
      p += Math.random() * 16 + 6;
      if (p > 100) p = 100;
      fill.style.width = p + "%";
      const idx = Math.min(lines.length - 1, Math.floor((p / 100) * lines.length));
      if (idx !== li) { li = idx; log.textContent = "› " + lines[idx]; }
      if (p >= 100) {
        clearInterval(tick);
        setTimeout(() => {
          $("#boot").classList.add("hidden");
          // auto-open the About window as a welcome
          setTimeout(() => openApp("about"), 350);
        }, 450);
      }
    }, 220);
  }

  /* ============================================================
     DESKTOP ICONS
     ============================================================ */
  function buildDesktop() {
    const wrap = $("#desk-icons");
    DESKTOP_ORDER.forEach((id) => {
      const app = APPS[id];
      const icon = el("div", "desk-icon");
      icon.innerHTML = `<div class="desk-icon-glyph">${app.glyph}</div><div class="desk-icon-label">${app.title}</div>`;
      let lastClick = 0;
      icon.addEventListener("click", () => {
        document.querySelectorAll(".desk-icon").forEach((i) => i.classList.remove("selected"));
        icon.classList.add("selected");
        const now = Date.now();
        if (now - lastClick < 400) openApp(id); // double-click opens
        lastClick = now;
      });
      // also allow single-tap open on touch for usability
      icon.addEventListener("dblclick", () => openApp(id));
      wrap.appendChild(icon);
    });
    // single click on empty desktop clears selection
    $("#desktop").addEventListener("mousedown", (e) => {
      if (e.target.id === "desktop" || e.target.classList.contains("desk-watermark"))
        document.querySelectorAll(".desk-icon").forEach((i) => i.classList.remove("selected"));
    });
  }

  /* ============================================================
     START MENU
     ============================================================ */
  function buildStartMenu() {
    const menu = $("#start-menu");
    const grid = $("#sm-grid");
    DESKTOP_ORDER.forEach((id) => {
      const app = APPS[id];
      const item = el("div", "sm-item");
      item.innerHTML = `<div class="sm-item-glyph">${app.glyph}</div><div class="sm-item-label">${app.title}</div>`;
      item.addEventListener("click", () => { openApp(id); closeStart(); });
      grid.appendChild(item);
    });

    $("#start-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      menu.classList.toggle("open");
    });
    document.addEventListener("click", (e) => {
      if (!menu.contains(e.target) && e.target.id !== "start-btn") closeStart();
    });
  }
  function closeStart() { $("#start-menu").classList.remove("open"); }

  /* ============================================================
     WINDOW MANAGER
     ============================================================ */
  function openApp(id) {
    if (windows.has(id)) { focusWindow(id); restoreIfMin(id); return; }
    const app = APPS[id];
    const desk = $("#desktop");
    const deskRect = desk.getBoundingClientRect();

    const w = Math.min(app.w, deskRect.width - 24);
    const h = Math.min(app.h, deskRect.height - 24);
    const offset = (openSeq++ % 6) * 26;
    let left = Math.max(12, (deskRect.width - w) / 2 + offset - 60);
    let top = Math.max(12, (deskRect.height - h) / 2 + offset - 60);

    const win = el("div", "window");
    win.style.cssText = `left:${left}px;top:${top}px;width:${w}px;height:${h}px;z-index:${++zCounter}`;
    win.dataset.app = id;

    win.innerHTML = `
      <div class="win-titlebar">
        <div class="win-traffic">
          <button class="tl close" title="Close"></button>
          <button class="tl min" title="Minimize"></button>
          <button class="tl max" title="Maximize"></button>
        </div>
        <div class="win-title"><span class="wt-glyph">${app.glyph}</span>${esc(app.title)}</div>
      </div>
      <div class="win-body"></div>
      <div class="win-resize"></div>`;

    $(".win-body", win).innerHTML = app.render();
    desk.appendChild(win);

    // taskbar button
    const tbBtn = el("div", "tb-app active");
    tbBtn.innerHTML = `<span class="tb-glyph">${app.glyph}</span><span class="tb-label">${esc(app.title)}</span>`;
    tbBtn.addEventListener("click", () => {
      const rec = windows.get(id);
      if (!rec) return;
      if (rec.node.classList.contains("minimized")) { restoreIfMin(id); focusWindow(id); }
      else if (rec.node.classList.contains("focused")) minimize(id);
      else focusWindow(id);
    });
    $("#taskbar-apps").appendChild(tbBtn);

    windows.set(id, { node: win, app, taskbarBtn: tbBtn, prevRect: null });

    // controls
    $(".tl.close", win).addEventListener("click", (e) => { e.stopPropagation(); closeWindow(id); });
    $(".tl.min", win).addEventListener("click", (e) => { e.stopPropagation(); minimize(id); });
    $(".tl.max", win).addEventListener("click", (e) => { e.stopPropagation(); toggleMax(id); });
    $(".win-titlebar", win).addEventListener("dblclick", () => toggleMax(id));

    makeDraggable(win, id);
    makeResizable(win, id);
    win.addEventListener("mousedown", () => focusWindow(id));

    focusWindow(id);
    runAppHooks(id, win);
  }

  function focusWindow(id) {
    windows.forEach((rec, key) => {
      const on = key === id;
      rec.node.classList.toggle("focused", on);
      rec.taskbarBtn.classList.toggle("active", on && !rec.node.classList.contains("minimized"));
    });
    const rec = windows.get(id);
    if (rec) rec.node.style.zIndex = ++zCounter;
  }

  function minimize(id) {
    const rec = windows.get(id);
    if (!rec) return;
    rec.node.classList.add("minimized");
    rec.node.classList.remove("focused");
    rec.taskbarBtn.classList.remove("active");
  }
  function restoreIfMin(id) {
    const rec = windows.get(id);
    if (rec && rec.node.classList.contains("minimized")) {
      rec.node.classList.remove("minimized");
      focusWindow(id);
    }
  }
  function toggleMax(id) {
    const rec = windows.get(id);
    if (!rec) return;
    const n = rec.node;
    if (n.classList.contains("maximized")) {
      n.classList.remove("maximized");
      if (rec.prevRect) Object.assign(n.style, rec.prevRect);
    } else {
      rec.prevRect = { left: n.style.left, top: n.style.top, width: n.style.width, height: n.style.height };
      n.classList.add("maximized");
    }
    focusWindow(id);
  }
  function closeWindow(id) {
    const rec = windows.get(id);
    if (!rec) return;
    rec.node.classList.add("closing");
    rec.taskbarBtn.remove();
    setTimeout(() => rec.node.remove(), 150);
    windows.delete(id);
  }

  /* ---------- dragging ---------- */
  function makeDraggable(win, id) {
    const bar = $(".win-titlebar", win);
    let sx, sy, ox, oy, dragging = false;
    bar.addEventListener("mousedown", start);
    bar.addEventListener("touchstart", (e) => start(e.touches[0], e), { passive: true });

    function start(ev, raw) {
      if (win.classList.contains("maximized")) return;
      if (raw && raw.target && raw.target.classList.contains("tl")) return;
      dragging = true;
      sx = ev.clientX; sy = ev.clientY;
      ox = win.offsetLeft; oy = win.offsetTop;
      focusWindow(id);
      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", end);
      document.addEventListener("touchmove", tmove, { passive: false });
      document.addEventListener("touchend", end);
    }
    function move(ev) { if (dragging) drag(ev.clientX, ev.clientY); }
    function tmove(ev) { if (dragging) { ev.preventDefault(); drag(ev.touches[0].clientX, ev.touches[0].clientY); } }
    function drag(cx, cy) {
      const desk = $("#desktop").getBoundingClientRect();
      let nl = ox + (cx - sx), nt = oy + (cy - sy);
      nl = Math.max(-win.offsetWidth + 80, Math.min(nl, desk.width - 60));
      nt = Math.max(0, Math.min(nt, desk.height - 40));
      win.style.left = nl + "px"; win.style.top = nt + "px";
    }
    function end() {
      dragging = false;
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", end);
      document.removeEventListener("touchmove", tmove);
      document.removeEventListener("touchend", end);
    }
  }

  /* ---------- resizing ---------- */
  function makeResizable(win, id) {
    const handle = $(".win-resize", win);
    let sx, sy, sw, sh, resizing = false;
    handle.addEventListener("mousedown", (e) => {
      e.stopPropagation(); resizing = true;
      sx = e.clientX; sy = e.clientY; sw = win.offsetWidth; sh = win.offsetHeight;
      focusWindow(id);
      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", end);
    });
    function move(e) {
      if (!resizing) return;
      win.style.width = Math.max(280, sw + (e.clientX - sx)) + "px";
      win.style.height = Math.max(180, sh + (e.clientY - sy)) + "px";
    }
    function end() { resizing = false; document.removeEventListener("mousemove", move); document.removeEventListener("mouseup", end); }
  }

  /* ---------- post-render hooks (counters, terminal) ---------- */
  function runAppHooks(id, win) {
    if (id === "about" || id === "resume") animateCounters(win);
    if (id === "terminal") initTerminal(win);
  }
  function animateCounters(win) {
    win.querySelectorAll("[data-count]").forEach((node) => {
      const target = parseFloat(node.dataset.count);
      const suffix = node.dataset.suffix || "";
      let v = 0; const step = target / 45;
      const t = setInterval(() => {
        v += step;
        if (v >= target) { node.textContent = target + suffix; clearInterval(t); }
        else node.textContent = Math.floor(v) + suffix;
      }, 18);
    });
  }

  /* ============================================================
     CLOCK
     ============================================================ */
  function startClock() {
    const node = $("#tray-clock");
    function upd() {
      const d = new Date();
      const t = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
      const dt = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
      node.innerHTML = `<div>${t}</div><div class="tc-date">${dt}</div>`;
    }
    upd(); setInterval(upd, 1000 * 20);
  }

  /* ============================================================
     APP RENDERERS
     ============================================================ */
  function renderAbout() {
    const p = ARK.profile;
    const stats = ARK.stats.map((s) =>
      `<div class="stat-card"><div class="stat-num" data-count="${s.num}" data-suffix="${s.suffix}">0</div><div class="stat-label">${esc(s.label)}</div></div>`
    ).join("");
    const tags = ARK.about.tags.map((t) => `<span class="pill ${t.c}">${esc(t.t)}</span>`).join("");
    const paras = ARK.about.paragraphs.map((x) => `<p class="app-p">${x}</p>`).join("");
    const langs = ARK.about.languages.map((l) =>
      `<div class="lang-card"><span class="lang-name">${esc(l.name)}</span><span class="lang-level">${esc(l.level)}</span></div>`
    ).join("");
    return `
      <div class="hero-app-badge"><span class="dot"></span>${esc(p.tagline)}</div>
      <div class="hero-app-name">Alok Roy <span class="grad">Karmakar</span></div>
      <div class="hero-app-role">${esc(p.role)}</div>
      <p class="app-p">${esc(p.summary)}</p>
      <div class="stat-grid">${stats}</div>
      <div class="btn-row">
        <a class="app-btn primary" href="mailto:${p.email}">✉ Get In Touch</a>
        <a class="app-btn ghost" href="${p.linkedin}" target="_blank" rel="noopener">💼 LinkedIn</a>
        <a class="app-btn ghost" href="${p.github}" target="_blank" rel="noopener">🐙 GitHub</a>
      </div>
      <div class="app-divider"></div>
      <div class="app-eyebrow">Who I am</div>
      ${paras}
      <div class="pill-row">${tags}</div>
      <div class="app-divider"></div>
      <div class="app-eyebrow">Languages</div>
      ${langs}
      <div class="callout">
        <div class="callout-title">🎯 Currently seeking</div>
        <div class="callout-text">${esc(ARK.about.seeking)}</div>
      </div>`;
  }

  function renderSkills() {
    const groups = ARK.skills.map((g) => {
      const pills = g.items.map((i) => `<span class="pill gray">${esc(i)}</span>`).join("");
      return `<div class="skill-group">
        <div class="skill-group-title"><span class="skill-group-icon">${g.icon}</span>${esc(g.title)}</div>
        <div class="pill-row" style="margin-top:0">${pills}</div>
      </div>`;
    }).join("");
    return `<div class="app-eyebrow">Tech Stack</div>
      <div class="app-title">Skills & Technologies</div>
      <p class="app-sub">The toolkit behind the systems I build — from agentic AI down to enterprise data.</p>
      ${groups}`;
  }

  function renderExp() {
    const items = ARK.experience.map((j) => {
      const bullets = j.bullets.map((b) => `<li>${b}</li>`).join("");
      const tags = j.tags.map((t) => `<span class="pill ${j.accent}">${esc(t)}</span>`).join("");
      return `<div class="exp-item ${j.accent}">
        <div class="exp-top">
          <div><div class="exp-role">${esc(j.role)}</div><div class="exp-company ${j.accent}">${esc(j.company)}</div></div>
          <div class="exp-meta"><div class="exp-period">${esc(j.period)}</div><div class="exp-loc">📍 ${esc(j.location)}</div></div>
        </div>
        <ul class="exp-bullets">${bullets}</ul>
        <div class="pill-row">${tags}</div>
      </div>`;
    }).join("");
    return `<div class="app-eyebrow">Work Experience</div>
      <div class="app-title">Where I've made an impact</div>
      <p class="app-sub">6+ years across consulting, heavy industry, and finance — now building AI.</p>
      ${items}`;
  }

  function renderProjects() {
    const cards = ARK.projects.map((p) => {
      const tech = p.tech.map((t) => `<span class="pill gray">${esc(t)}</span>`).join("");
      return `<div class="proj-card">
        <div class="proj-head"><div class="proj-glyph">${p.icon}</div><div class="proj-name">${esc(p.name)}</div></div>
        <p class="proj-desc">${esc(p.desc)}</p>
        <div class="pill-row">${tech}</div>
      </div>`;
    }).join("");
    return `<div class="app-eyebrow">Projects</div>
      <div class="app-title">AI work in action</div>
      <p class="app-sub">Real systems built to solve real business problems — not just experiments.</p>
      ${cards}
      <div class="notice">📌 <strong>GitHub:</strong> Explore my code & repositories at
        <a href="${ARK.profile.github}" target="_blank" rel="noopener">github.com/royalokkarmakar1994</a>.
        Reach out for architecture diagrams, demos, or detailed walkthroughs — happy to share on request.</div>`;
  }

  function renderEducation() {
    const edu = ARK.education.map((e) =>
      `<div class="edu-card">
        <span class="edu-badge ${e.status}">${e.status === "current" ? "● Current" : e.status === "ongoing" ? "Ongoing" : "Completed"}</span>
        <div class="edu-degree">${esc(e.degree)}</div>
        <div class="edu-school">${esc(e.school)}</div>
        <div class="edu-year">${esc(e.year)}</div>
      </div>`
    ).join("");
    const certs = ARK.certifications.map((c) =>
      `<div class="cert-item"><div><div class="cert-name">${esc(c.name)}</div><div class="cert-issuer">${esc(c.issuer)}</div></div><span class="cert-year">${esc(c.year)}</span></div>`
    ).join("");
    return `<div class="app-eyebrow">Education</div>
      <div class="app-title">Academic background</div>
      ${edu}
      <div class="app-divider"></div>
      <div class="app-eyebrow">Certifications</div>
      ${certs}`;
  }

  function renderContact() {
    const p = ARK.profile;
    const rows = [
      { g: "📧", l: "Email", v: p.email, href: "mailto:" + p.email },
      { g: "📞", l: "Phone", v: p.phone, href: "tel:" + p.phone.replace(/[^+\d]/g, "") },
      { g: "💼", l: "LinkedIn", v: "alokroykarmakar1994", href: p.linkedin },
      { g: "🐙", l: "GitHub", v: "royalokkarmakar1994", href: p.github },
      { g: "📍", l: "Location", v: p.location, href: null },
    ].map((r) => {
      const inner = `<div class="cr-glyph">${r.g}</div><div><div class="cr-label">${esc(r.l)}</div><div class="cr-value">${esc(r.v)}</div></div>`;
      return r.href ? `<a class="contact-row" href="${r.href}" ${r.href.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>${inner}</a>`
                    : `<div class="contact-row">${inner}</div>`;
    }).join("");
    return `<div class="app-eyebrow">Contact</div>
      <div class="app-title">Let's build something<br>intelligent together</div>
      <p class="app-sub">Open to Remote AI Engineer · Agentic AI Developer · Data Scientist · ML Engineer roles globally.</p>
      <div class="contact-list">${rows}</div>
      <div class="callout"><div class="callout-title">🌍 Availability</div>
        <div class="callout-text">Based in ${esc(p.location)} · Remote-ready worldwide. Typically reply within a day.</div></div>`;
  }

  function renderResume() {
    const p = ARK.profile;
    const stats = ARK.stats.map((s) =>
      `<div class="stat-card"><div class="stat-num" data-count="${s.num}" data-suffix="${s.suffix}">0</div><div class="stat-label">${esc(s.label)}</div></div>`
    ).join("");
    const exp = ARK.experience.map((j) =>
      `<div class="exp-item ${j.accent}" style="padding-top:14px;padding-bottom:14px">
        <div class="exp-top"><div><div class="exp-role">${esc(j.role)}</div><div class="exp-company ${j.accent}">${esc(j.company)}</div></div>
        <div class="exp-meta"><div class="exp-period">${esc(j.period)}</div></div></div>
      </div>`
    ).join("");
    return `<div class="app-eyebrow">Résumé · Snapshot</div>
      <div class="app-title">${esc(p.name)}</div>
      <div class="hero-app-role">${esc(p.role)}</div>
      <p class="app-p">${esc(p.summary)}</p>
      <div class="stat-grid">${stats}</div>
      <div class="app-divider"></div>
      <div class="app-eyebrow">Experience timeline</div>
      ${exp}
      <div class="btn-row" style="margin-top:18px">
        <a class="app-btn primary" href="mailto:${p.email}">✉ Request full CV</a>
        <button class="app-btn ghost" onclick="window.print()">🖨 Print</button>
      </div>`;
  }

  /* ---------- Terminal app ---------- */
  function renderTerminal() {
    return `<div class="terminal" id="term-out">
      <div class="t-out"><span class="t-accent">ARK-OS</span> terminal · type <span class="t-accent">help</span> to begin.</div>
    </div>`;
  }
  function initTerminal(win) {
    const out = $("#term-out", win);
    function addLine(html) { const d = el("div", "t-out", html); out.appendChild(d); }
    function newPrompt() {
      const line = el("div", "term-input-line");
      line.innerHTML = `<span class="t-prompt">ark@os</span><span class="t-path">~</span><span class="t-prompt">$</span>`;
      const inp = el("input", "term-input");
      inp.setAttribute("autocomplete", "off"); inp.setAttribute("spellcheck", "false");
      line.appendChild(inp);
      out.appendChild(line);
      inp.focus();
      inp.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const cmd = inp.value.trim();
          inp.disabled = true;
          run(cmd);
          newPrompt();
          out.parentElement.scrollTop = out.parentElement.scrollHeight;
        }
      });
    }
    const cmds = {
      help: () => `available: <span class="t-accent">about, skills, experience, projects, education, contact, resume, whoami, social, clear, help</span>`,
      whoami: () => `${ARK.profile.name} — ${ARK.profile.role}`,
      about: () => { openApp("about"); return "opening About…"; },
      skills: () => { openApp("skills"); return "opening Tech Stack…"; },
      experience: () => { openApp("experience"); return "opening Experience…"; },
      projects: () => { openApp("projects"); return "opening Projects…"; },
      education: () => { openApp("education"); return "opening Education…"; },
      contact: () => { openApp("contact"); return "opening Contact…"; },
      resume: () => { openApp("resume"); return "opening Résumé…"; },
      social: () => `LinkedIn: <span class="t-accent">${ARK.profile.linkedin}</span>\nGitHub:   <span class="t-accent">${ARK.profile.github}</span>`,
      clear: () => "__CLEAR__",
    };
    function run(cmd) {
      if (!cmd) return;
      addLine(`<span class="t-dim">$ ${esc(cmd)}</span>`);
      const fn = cmds[cmd.toLowerCase()];
      if (!fn) { addLine(`<span class="t-out">command not found: ${esc(cmd)} — try <span class="t-accent">help</span></span>`); return; }
      const res = fn();
      if (res === "__CLEAR__") { out.innerHTML = ""; return; }
      addLine(`<span class="t-out">${res}</span>`);
    }
    newPrompt();
    win.querySelector(".win-body").addEventListener("click", () => {
      const inputs = win.querySelectorAll(".term-input");
      const last = inputs[inputs.length - 1];
      if (last && !last.disabled) last.focus();
    });
  }

  /* ============================================================
     INIT
     ============================================================ */
  let booted = false;
  function init() {
    if (booted) return;
    booted = true;
    buildDesktop();
    buildStartMenu();
    startClock();
    boot();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  // expose for terminal / debugging
  window.ARKOS = { openApp };
})();
