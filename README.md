# ARK-OS — Portfolio of Alok Roy Karmakar

An interactive, **desktop-operating-system themed** portfolio for an Agentic AI Developer · Data Scientist · ML Engineer. Boot sequence → desktop with app icons → draggable, minimizable, resizable windows → taskbar & start menu.

🔗 **Live:** https://royalokkarmakar1994.github.io/portfolio/

## Features
- **Boot screen** with animated progress and kernel log
- **Desktop** with app icons (double-click or click from the Start menu to open)
- **Window manager** — drag, focus, minimize, maximize, resize, close
- **Taskbar** with running apps, system tray, mute toggle, and live clock
- **Start menu** with quick links
- **Content apps:** About, Tech Stack, Experience, Projects, Education, Résumé, Contact
- **Interactive Terminal** — type `help` (commands open apps)
- **🎮 Games** — playable Snake & Tetris (score + high-score, keyboard/buttons)
- **⚙️ Display Settings** — accent colors, wallpapers, light/dark, brightness (saved & persisted)
- **💻 Code Playground** — live HTML/CSS/JS editor running in a sandboxed iframe
- **📁 File Manager** — README, app shortcuts, CV/profile links
- **🔊 Sound** — synthesized Web Audio UI clicks & chimes with a mute toggle
- Fully responsive, dark theme with electric-blue/teal accents
- **Zero build step** — pure HTML/CSS/JS, deploys straight to GitHub Pages

## Structure
```
index.html              # OS shell (boot, desktop, taskbar, start menu)
index-classic.html      # previous single-scroll version (kept as fallback)
assets/
  css/os.css            # all styling (incl. light theme + feature apps)
  js/data.js            # content (single source of truth — edit here)
  js/os.js              # OS engine: boot, window manager, registerApp() API
  js/settings.js        # Display Settings app
  js/games.js           # Snake + Tetris
  js/apps-extra.js      # Code Playground + File Manager
  js/sound.js           # Web Audio sound engine + mute toggle
```

## Adding an app
Plugin apps self-register against the OS engine:
```js
window.ARKOS.registerApp("myapp", {
  title: "My App", glyph: "✨",
  render() { return "<div>…</div>"; },     // returns HTML string
  onMount(body, { openApp, setCleanup }) {} // optional: wire events
});
```

## Editing content
All text lives in `assets/js/data.js`. Update that file — no markup changes needed.

## Run locally
```bash
python -m http.server 8000
# open http://localhost:8000
```
