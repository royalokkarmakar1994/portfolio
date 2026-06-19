/* ============================================================
   ARK-OS — Games (Snake + Tetris)
   canvas-based, keyboard + on-screen controls, score, cleanup
   ============================================================ */
(function () {
  "use strict";

  function render() {
    return `
      <div class="game-tabs">
        <button class="game-tab active" data-game="snake">🐍 Snake</button>
        <button class="game-tab" data-game="tetris">🟦 Tetris</button>
      </div>
      <div id="game-host"></div>`;
  }

  function onMount(body, { setCleanup }) {
    let stop = null;
    function launch(which) {
      if (stop) { stop(); stop = null; }
      const host = body.querySelector("#game-host");
      host.innerHTML = "";
      stop = which === "tetris" ? Tetris(host) : Snake(host);
      body.querySelectorAll(".game-tab").forEach((t) => t.classList.toggle("active", t.dataset.game === which));
    }
    body.querySelectorAll(".game-tab").forEach((t) =>
      t.addEventListener("click", () => launch(t.dataset.game))
    );
    launch("snake");
    setCleanup(() => { if (stop) stop(); });
  }

  /* ---------------- SNAKE ---------------- */
  function Snake(host) {
    const SIZE = 17, CELL = 18, W = SIZE * CELL;
    host.innerHTML = `
      <div class="game-wrap">
        <div class="game-hud"><div class="game-score">SCORE <b id="sn-score">0</b></div><div class="game-score">BEST <b id="sn-best">0</b></div></div>
        <div class="game-stage">
          <canvas class="game-canvas" width="${W}" height="${W}"></canvas>
          <div class="game-over" id="sn-over" style="display:none"><h3>Game Over</h3><button class="app-btn primary" id="sn-restart">↻ Play again</button></div>
        </div>
        <div class="game-tip">Arrow keys / WASD to move · or use buttons below</div>
        <div class="game-tabs"><button class="game-tab" data-d="up">↑</button><button class="game-tab" data-d="left">←</button><button class="game-tab" data-d="down">↓</button><button class="game-tab" data-d="right">→</button></div>
      </div>`;
    const cv = host.querySelector("canvas"), ctx = cv.getContext("2d");
    const scoreEl = host.querySelector("#sn-score"), bestEl = host.querySelector("#sn-best");
    const overEl = host.querySelector("#sn-over");
    let best = +(localStorage.getItem("arkos.snake.best") || 0);
    bestEl.textContent = best;

    let snake, dir, next, food, score, alive, timer;
    function reset() {
      snake = [{ x: 8, y: 8 }]; dir = { x: 1, y: 0 }; next = dir;
      score = 0; alive = true; placeFood(); scoreEl.textContent = 0; overEl.style.display = "none";
    }
    function placeFood() {
      do { food = { x: rnd(SIZE), y: rnd(SIZE) }; }
      while (snake.some((s) => s.x === food.x && s.y === food.y));
    }
    function rnd(n) { return Math.floor(Math.random() * n); }
    function step() {
      if (!alive) return;
      dir = next;
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
      if (head.x < 0 || head.y < 0 || head.x >= SIZE || head.y >= SIZE || snake.some((s) => s.x === head.x && s.y === head.y)) {
        alive = false; overEl.style.display = "flex";
        if (score > best) { best = score; localStorage.setItem("arkos.snake.best", best); bestEl.textContent = best; }
        return;
      }
      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) { score++; scoreEl.textContent = score; placeFood(); }
      else snake.pop();
      draw();
    }
    function draw() {
      const cs = getComputedStyle(document.documentElement);
      const accent = cs.getPropertyValue("--accent").trim() || "#38bdf8";
      const accent2 = cs.getPropertyValue("--accent-2").trim() || "#2dd4bf";
      ctx.clearRect(0, 0, W, W);
      ctx.fillStyle = accent2; ctx.globalAlpha = 0.9;
      ctx.fillRect(food.x * CELL + 3, food.y * CELL + 3, CELL - 6, CELL - 6);
      ctx.globalAlpha = 1;
      snake.forEach((s, i) => { ctx.fillStyle = i === 0 ? accent : accent; ctx.globalAlpha = i === 0 ? 1 : 0.6; ctx.fillRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2); });
      ctx.globalAlpha = 1;
    }
    function setDir(d) {
      const map = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
      const nd = map[d]; if (!nd) return;
      if (nd.x === -dir.x && nd.y === -dir.y) return; // no reverse
      next = nd;
    }
    function key(e) {
      const k = e.key.toLowerCase();
      const m = { arrowup: "up", w: "up", arrowdown: "down", s: "down", arrowleft: "left", a: "left", arrowright: "right", d: "right" };
      if (m[k]) { e.preventDefault(); setDir(m[k]); }
    }
    document.addEventListener("keydown", key);
    host.querySelectorAll("[data-d]").forEach((b) => b.addEventListener("click", () => setDir(b.dataset.d)));
    host.querySelector("#sn-restart").addEventListener("click", () => { reset(); draw(); });
    reset(); draw();
    timer = setInterval(step, 110);
    return () => { clearInterval(timer); document.removeEventListener("keydown", key); };
  }

  /* ---------------- TETRIS ---------------- */
  function Tetris(host) {
    const COLS = 10, ROWS = 18, CELL = 18, W = COLS * CELL, H = ROWS * CELL;
    host.innerHTML = `
      <div class="game-wrap">
        <div class="game-hud"><div class="game-score">SCORE <b id="tt-score">0</b></div><div class="game-score">LINES <b id="tt-lines">0</b></div></div>
        <div class="game-stage">
          <canvas class="game-canvas" width="${W}" height="${H}"></canvas>
          <div class="game-over" id="tt-over" style="display:none"><h3>Game Over</h3><button class="app-btn primary" id="tt-restart">↻ Play again</button></div>
        </div>
        <div class="game-tip">← → move · ↑ rotate · ↓ soft drop · Space hard drop</div>
        <div class="game-tabs"><button class="game-tab" data-a="left">←</button><button class="game-tab" data-a="rot">⟳</button><button class="game-tab" data-a="down">↓</button><button class="game-tab" data-a="right">→</button></div>
      </div>`;
    const cv = host.querySelector("canvas"), ctx = cv.getContext("2d");
    const scoreEl = host.querySelector("#tt-score"), linesEl = host.querySelector("#tt-lines"), overEl = host.querySelector("#tt-over");

    const SHAPES = {
      I: [[1, 1, 1, 1]],
      O: [[1, 1], [1, 1]],
      T: [[0, 1, 0], [1, 1, 1]],
      S: [[0, 1, 1], [1, 1, 0]],
      Z: [[1, 1, 0], [0, 1, 1]],
      J: [[1, 0, 0], [1, 1, 1]],
      L: [[0, 0, 1], [1, 1, 1]],
    };
    const COLORS = { I: "#22d3ee", O: "#fbbf24", T: "#a78bfa", S: "#34d399", Z: "#fb7185", J: "#60a5fa", L: "#fb923c" };
    const KEYS = Object.keys(SHAPES);

    let grid, cur, score, lines, alive, dropTimer, fall = 600;
    function newGrid() { return Array.from({ length: ROWS }, () => Array(COLS).fill(null)); }
    function spawn() {
      const t = KEYS[Math.floor(Math.random() * KEYS.length)];
      cur = { t, m: SHAPES[t].map((r) => r.slice()), x: Math.floor((COLS - SHAPES[t][0].length) / 2), y: 0 };
      if (collide(cur.m, cur.x, cur.y)) { alive = false; overEl.style.display = "flex"; }
    }
    function collide(m, ox, oy) {
      for (let y = 0; y < m.length; y++) for (let x = 0; x < m[y].length; x++) {
        if (!m[y][x]) continue;
        const nx = ox + x, ny = oy + y;
        if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
        if (ny >= 0 && grid[ny][nx]) return true;
      }
      return false;
    }
    function merge() {
      cur.m.forEach((r, y) => r.forEach((v, x) => { if (v) { const ny = cur.y + y; if (ny >= 0) grid[ny][cur.x + x] = cur.t; } }));
    }
    function clearLines() {
      let cleared = 0;
      for (let y = ROWS - 1; y >= 0; y--) {
        if (grid[y].every((c) => c)) { grid.splice(y, 1); grid.unshift(Array(COLS).fill(null)); cleared++; y++; }
      }
      if (cleared) { lines += cleared; score += [0, 40, 100, 300, 1200][cleared]; scoreEl.textContent = score; linesEl.textContent = lines; }
    }
    function rotate(m) {
      const R = m[0].map((_, i) => m.map((row) => row[i]).reverse());
      return R;
    }
    function tick() {
      if (!alive) return;
      if (!collide(cur.m, cur.x, cur.y + 1)) cur.y++;
      else { merge(); clearLines(); spawn(); }
      draw();
    }
    function move(dx) { if (!collide(cur.m, cur.x + dx, cur.y)) { cur.x += dx; draw(); } }
    function softDrop() { if (!collide(cur.m, cur.x, cur.y + 1)) { cur.y++; draw(); } }
    function hardDrop() { while (!collide(cur.m, cur.x, cur.y + 1)) cur.y++; merge(); clearLines(); spawn(); draw(); }
    function rot() { const r = rotate(cur.m); let nx = cur.x; if (!collide(r, nx, cur.y)) { cur.m = r; draw(); } else if (!collide(r, nx - 1, cur.y)) { cur.x--; cur.m = r; draw(); } else if (!collide(r, nx + 1, cur.y)) { cur.x++; cur.m = r; draw(); } }
    function cell(x, y, color) { ctx.fillStyle = color; ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2); }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) if (grid[y][x]) cell(x, y, COLORS[grid[y][x]]);
      cur.m.forEach((r, y) => r.forEach((v, x) => { if (v) cell(cur.x + x, cur.y + y, COLORS[cur.t]); }));
    }
    function key(e) {
      if (!alive) return;
      const k = e.key;
      if (k === "ArrowLeft") { e.preventDefault(); move(-1); }
      else if (k === "ArrowRight") { e.preventDefault(); move(1); }
      else if (k === "ArrowDown") { e.preventDefault(); softDrop(); }
      else if (k === "ArrowUp") { e.preventDefault(); rot(); }
      else if (k === " ") { e.preventDefault(); hardDrop(); }
    }
    function reset() { grid = newGrid(); score = 0; lines = 0; alive = true; scoreEl.textContent = 0; linesEl.textContent = 0; overEl.style.display = "none"; spawn(); draw(); }

    document.addEventListener("keydown", key);
    host.querySelectorAll("[data-a]").forEach((b) => b.addEventListener("click", () => {
      const a = b.dataset.a; if (a === "left") move(-1); else if (a === "right") move(1); else if (a === "down") softDrop(); else if (a === "rot") rot();
    }));
    host.querySelector("#tt-restart").addEventListener("click", reset);
    reset();
    dropTimer = setInterval(tick, fall);
    return () => { clearInterval(dropTimer); document.removeEventListener("keydown", key); };
  }

  function register() {
    if (!window.ARKOS) { setTimeout(register, 40); return; }
    window.ARKOS.registerApp("games", { title: "Games", glyph: "🎮", render, onMount, w: 380, h: 560 });
  }
  register();
})();
