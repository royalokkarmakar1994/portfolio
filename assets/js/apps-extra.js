/* ============================================================
   ARK-OS — Code Playground + File Manager
   ============================================================ */
(function () {
  "use strict";

  /* ---------------- CODE PLAYGROUND ---------------- */
  const SAMPLE = {
    html: `<h1>Hello from ARK-OS 👋</h1>\n<p>Edit any tab and hit <b>Run</b>.</p>\n<button id="b">Click me</button>`,
    css: `body{font-family:system-ui;background:#0a0e1a;color:#e6edf6;padding:20px}\nh1{color:#38bdf8}\nbutton{background:#2dd4bf;border:0;padding:10px 18px;border-radius:8px;color:#04121f;font-weight:700;cursor:pointer}`,
    js: `document.getElementById('b').onclick = () => {\n  document.body.style.background = '#11203a';\n  alert('Running live in a sandboxed iframe!');\n};`,
  };

  function pgRender() {
    return `
      <div class="app-eyebrow">Developer</div>
      <div class="app-title">Code Playground</div>
      <p class="app-sub">Write HTML, CSS & JS — runs live in a sandboxed iframe. Nothing leaves your browser.</p>
      <div class="pg-wrap">
        <div class="pg-tabs">
          <button class="pg-tab active" data-tab="html">HTML</button>
          <button class="pg-tab" data-tab="css">CSS</button>
          <button class="pg-tab" data-tab="js">JS</button>
        </div>
        <textarea class="pg-editor" spellcheck="false"></textarea>
        <div class="pg-bar">
          <button class="app-btn primary" id="pg-run">▶ Run</button>
          <button class="app-btn ghost" id="pg-reset">↺ Reset</button>
          <span class="pg-out-label">Output</span>
        </div>
        <iframe class="pg-out" id="pg-out" sandbox="allow-scripts allow-modals"></iframe>
      </div>`;
  }

  function pgMount(body) {
    const code = { html: SAMPLE.html, css: SAMPLE.css, js: SAMPLE.js };
    let active = "html";
    const editor = body.querySelector(".pg-editor");
    const out = body.querySelector("#pg-out");
    editor.value = code[active];

    function show(tab) {
      code[active] = editor.value;       // save current
      active = tab;
      editor.value = code[active];
      body.querySelectorAll(".pg-tab").forEach((t) => t.classList.toggle("active", t.dataset.tab === tab));
    }
    function run() {
      code[active] = editor.value;
      const doc = `<!doctype html><html><head><style>${code.css}</style></head><body>${code.html}<script>try{${code.js}}catch(e){document.body.insertAdjacentHTML('beforeend','<pre style="color:#fb7185">'+e+'</pre>')}<\/script></body></html>`;
      out.srcdoc = doc;
    }
    body.querySelectorAll(".pg-tab").forEach((t) => t.addEventListener("click", () => show(t.dataset.tab)));
    body.querySelector("#pg-run").addEventListener("click", run);
    body.querySelector("#pg-reset").addEventListener("click", () => {
      code.html = SAMPLE.html; code.css = SAMPLE.css; code.js = SAMPLE.js;
      editor.value = code[active]; run();
    });
    // tab key inserts spaces
    editor.addEventListener("keydown", (e) => {
      if (e.key === "Tab") { e.preventDefault(); const s = editor.selectionStart; editor.value = editor.value.slice(0, s) + "  " + editor.value.slice(editor.selectionEnd); editor.selectionStart = editor.selectionEnd = s + 2; }
    });
    run();
  }

  /* ---------------- FILE MANAGER ---------------- */
  function fmRender() {
    const esc = window.ARKOS.esc;
    const p = window.ARK.profile;
    return `
      <div class="app-eyebrow">System</div>
      <div class="app-title">File Manager</div>
      <p class="app-sub">~/portfolio — double-click to open.</p>
      <div class="fm-grid" id="fm-grid">
        <div class="fm-item" data-open="readme"><div class="fm-glyph">📄</div><div class="fm-name">README.txt</div></div>
        <div class="fm-item" data-open="about"><div class="fm-glyph">👤</div><div class="fm-name">about.app</div></div>
        <div class="fm-item" data-open="projects"><div class="fm-glyph">🚀</div><div class="fm-name">projects/</div></div>
        <div class="fm-item" data-open="experience"><div class="fm-glyph">💼</div><div class="fm-name">experience/</div></div>
        <div class="fm-item" data-link="${esc(p.github)}"><div class="fm-glyph">🐙</div><div class="fm-name">github.url</div></div>
        <div class="fm-item" data-link="${esc(p.linkedin)}"><div class="fm-glyph">💼</div><div class="fm-name">linkedin.url</div></div>
        <div class="fm-item" data-cv="1"><div class="fm-glyph">⬇️</div><div class="fm-name">Download_CV</div></div>
        <div class="fm-item" data-open="contact"><div class="fm-glyph">✉️</div><div class="fm-name">contact.app</div></div>
      </div>
      <div id="fm-readme"></div>`;
  }

  function fmMount(body, { openApp }) {
    const p = window.ARK.profile;
    const readmeBox = body.querySelector("#fm-readme");
    body.querySelectorAll(".fm-item").forEach((item) => {
      const act = () => {
        if (item.dataset.open === "readme") {
          readmeBox.innerHTML = `<div class="app-divider"></div><div class="fm-readme"><span class="t-accent">README.txt</span>

${window.ARKOS.esc(p.name)} — ${window.ARKOS.esc(p.role)}

${window.ARKOS.esc(p.summary)}

  • Email   : ${window.ARKOS.esc(p.email)}
  • Phone   : ${window.ARKOS.esc(p.phone)}
  • GitHub  : github.com/royalokkarmakar1994
  • Location: ${window.ARKOS.esc(p.location)}

Tip: open the Terminal app and type 'help'.</div>`;
          if (readmeBox.scrollIntoView) readmeBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
        } else if (item.dataset.open) {
          openApp(item.dataset.open);
        } else if (item.dataset.link) {
          window.open(item.dataset.link, "_blank", "noopener");
        } else if (item.dataset.cv) {
          // no binary CV in repo — route to email request, matching the Resume app
          window.location.href = "mailto:" + p.email + "?subject=CV%20Request&body=Hi%20Alok%2C%20could%20you%20share%20your%20full%20CV%3F";
        }
      };
      item.addEventListener("dblclick", act);
      let last = 0;
      item.addEventListener("click", () => { const n = Date.now(); if (n - last < 400) act(); last = n; });
    });
  }

  function register() {
    if (!window.ARKOS || !window.ARK) { setTimeout(register, 40); return; }
    window.ARKOS.registerApp("playground", { title: "Playground", glyph: "💻", render: pgRender, onMount: pgMount, w: 620, h: 600 });
    window.ARKOS.registerApp("files", { title: "Files", glyph: "📁", render: fmRender, onMount: fmMount, w: 520, h: 520 });
  }
  register();
})();
