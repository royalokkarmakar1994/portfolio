# ARK-OS — Portfolio of Alok Roy Karmakar

An interactive, **desktop-operating-system themed** portfolio for an Agentic AI Developer · Data Scientist · ML Engineer. Boot sequence → desktop with app icons → draggable, minimizable, resizable windows → taskbar & start menu.

🔗 **Live:** https://royalokkarmakar1994.github.io/portfolio/

## Features
- **Boot screen** with animated progress and kernel log
- **Desktop** with app icons (double-click or click from the Start menu to open)
- **Window manager** — drag, focus, minimize, maximize, resize, close
- **Taskbar** with running apps, system tray, and live clock
- **Start menu** with quick links
- **Apps:** About, Tech Stack, Experience, Projects, Education, Résumé, Contact, and an interactive **Terminal** (type `help`)
- Fully responsive, dark theme with electric-blue/teal accents
- **Zero build step** — pure HTML/CSS/JS, deploys straight to GitHub Pages

## Structure
```
index.html              # OS shell (boot, desktop, taskbar, start menu)
index-classic.html      # previous single-scroll version (kept as fallback)
assets/
  css/os.css            # all styling
  js/data.js            # content (single source of truth — edit here)
  js/os.js              # OS engine: boot, window manager, apps, terminal
```

## Editing content
All text lives in `assets/js/data.js`. Update that file — no markup changes needed.

## Run locally
```bash
python -m http.server 8000
# open http://localhost:8000
```
