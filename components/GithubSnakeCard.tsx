"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
type Cell = { x: number; y: number };
type ContribLevel = 0 | 1 | 2 | 3 | 4;

// ── Constants ──────────────────────────────────────────────────────────────
const ROWS = 7;
const CELL = 14;          // logical px per cell
const GAP = 3;
const STEP = CELL + GAP;  // 17 logical px

// Snake logical tick interval (ms between cell moves)
const TICK_MS = 320;
// Sub-frame animation: glide duration (ms) — must be < TICK_MS
const INTERP_MS = 280;

const GRID_EMPTY = "rgba(47,138,87,0.09)";
const CONTRIB_COLORS: Record<ContribLevel, string> = {
  0: GRID_EMPTY,
  1: "rgba(47,138,87,0.22)",
  2: "rgba(47,138,87,0.40)",
  3: "rgba(47,138,87,0.60)",
  4: "rgba(47,138,87,0.80)",
};
const HEAD_COLOR = "#1a5e38";

// ── RNG ────────────────────────────────────────────────────────────────────
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ── Wrap helper ───────────────────────────────────────────────────────────
function wrapX(x: number, cols: number) { return ((x % cols) + cols) % cols; }
function wrapY(y: number) { return ((y % ROWS) + ROWS) % ROWS; }

// ── BFS: returns first-step direction toward target avoiding snake body ───
function bfsStep(
  head: Cell,
  target: Cell,
  snake: Cell[],
  cols: number
): Cell | null {
  const body = new Set(snake.map((s) => `${s.x},${s.y}`));
  const DIRS: Cell[] = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];

  type N = { pos: Cell; first: Cell };
  const queue: N[] = [];
  const seen = new Set<string>();
  seen.add(`${head.x},${head.y}`);

  for (const d of DIRS) {
    const nx = wrapX(head.x + d.x, cols);
    const ny = wrapY(head.y + d.y);
    const k = `${nx},${ny}`;
    if (!body.has(k) && !seen.has(k)) {
      seen.add(k);
      queue.push({ pos: { x: nx, y: ny }, first: d });
    }
  }

  while (queue.length) {
    const { pos, first } = queue.shift()!;
    if (pos.x === target.x && pos.y === target.y) return first;
    for (const d of DIRS) {
      const nx = wrapX(pos.x + d.x, cols);
      const ny = wrapY(pos.y + d.y);
      const k = `${nx},${ny}`;
      if (!body.has(k) && !seen.has(k)) {
        seen.add(k);
        queue.push({ pos: { x: nx, y: ny }, first });
      }
    }
  }
  return null;
}

// ── Flood-fill reachable cells (avoids body) ─────────────────────────────
function floodCount(start: Cell, snake: Cell[], cols: number): number {
  const body = new Set(snake.map((s) => `${s.x},${s.y}`));
  const seen = new Set<string>();
  const DIRS: Cell[] = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];
  const q: Cell[] = [start];
  let n = 0;
  while (q.length) {
    const c = q.shift()!;
    const k = `${c.x},${c.y}`;
    if (seen.has(k) || body.has(k)) continue;
    seen.add(k); n++;
    for (const d of DIRS)
      q.push({ x: wrapX(c.x + d.x, cols), y: wrapY(c.y + d.y) });
  }
  return n;
}

// ── Smart AI: BFS toward food, safety-checked; fallback = most open space ─
function chooseDir(
  snake: Cell[],
  food: Cell | null,
  dir: Cell,
  cols: number,
  rng: () => number
): Cell {
  const head = snake[0];
  const DIRS: Cell[] = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];

  // Never reverse
  const notBack = DIRS.filter((d) => !(d.x === -dir.x && d.y === -dir.y));

  // Never enter own body (exclude very last tail as it will leave)
  const bodySet = new Set(snake.slice(0, snake.length - 1).map((s) => `${s.x},${s.y}`));
  const safe = notBack.filter((d) => {
    const nx = wrapX(head.x + d.x, cols);
    const ny = wrapY(head.y + d.y);
    return !bodySet.has(`${nx},${ny}`);
  });

  if (!safe.length) return notBack[0] ?? dir; // cornered — just don't reverse

  // Try BFS toward food with safety gate
  if (food) {
    const bd = bfsStep(head, food, snake, cols);
    if (bd && safe.some((s) => s.x === bd.x && s.y === bd.y)) {
      const nx = wrapX(head.x + bd.x, cols);
      const ny = wrapY(head.y + bd.y);
      const snakeAfterMove = [{ x: nx, y: ny }, ...snake.slice(0, -1)];
      const space = floodCount({ x: nx, y: ny }, snakeAfterMove, cols);
      // Accept if enough open space
      if (space >= Math.min(snake.length, 5)) return bd;
    }
  }

  // Fallback: pick safest direction by flood-fill score + tiny random jitter
  const ranked = safe.map((d) => {
    const nx = wrapX(head.x + d.x, cols);
    const ny = wrapY(head.y + d.y);
    const snakeAfterMove = [{ x: nx, y: ny }, ...snake.slice(0, -1)];
    return { d, score: floodCount({ x: nx, y: ny }, snakeAfterMove, cols) + rng() };
  });
  ranked.sort((a, b) => b.score - a.score);
  return ranked[0]!.d;
}

// ── Fetch full-year GitHub contribution SVG ───────────────────────────────
async function fetchContribs(username: string): Promise<{
  grid: ContribLevel[][]; cols: number; total: number;
}> {
  const res = await fetch(`https://ghchart.rshah.org/2f8a57/${username}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("fetch failed");
  const svg = await res.text();

  const doc = new DOMParser().parseFromString(svg, "image/svg+xml");
  const rects = Array.from(doc.querySelectorAll("rect[data-level]")) as Element[];

  // Detect cell step from first rect x values
  const xs = rects.map((r) => Number(r.getAttribute("x") ?? 0)).filter((v) => v > 0);
  xs.sort((a, b) => a - b);
  const colStep = xs.length > 1 ? xs[0] : 14; // first non-zero x is one step

  let maxCol = 0;
  const cells: { col: number; row: number; level: ContribLevel }[] = [];

  for (const r of rects) {
    const x = Number(r.getAttribute("x") ?? 0);
    const y = Number(r.getAttribute("y") ?? 0);
    const lvl = Math.min(4, Math.max(0, Number(r.getAttribute("data-level") ?? 0))) as ContribLevel;
    const col = Math.round(x / colStep);
    const row = Math.round(y / colStep);
    cells.push({ col, row, level: lvl });
    if (col > maxCol) maxCol = col;
  }

  const totalCols = maxCol + 1;
  const grid: ContribLevel[][] = Array.from({ length: totalCols }, () =>
    Array(ROWS).fill(0 as ContribLevel)
  );
  let total = 0;

  for (const c of cells) {
    if (c.col >= 0 && c.col < totalCols && c.row >= 0 && c.row < ROWS) {
      grid[c.col][c.row] = c.level;
      if (c.level > 0) total++;
    }
  }

  return { grid, cols: totalCols, total };
}

// ── Fallback grid ─────────────────────────────────────────────────────────
function mkFallback(cols: number, rng: () => number) {
  const grid: ContribLevel[][] = Array.from({ length: cols }, () =>
    Array(ROWS).fill(0 as ContribLevel)
  );
  let total = 0;
  for (let x = 0; x < cols; x++)
    for (let y = 0; y < ROWS; y++) {
      const r = rng();
      const l: ContribLevel = r < 0.65 ? 0 : r < 0.80 ? 1 : r < 0.90 ? 2 : r < 0.97 ? 3 : 4;
      grid[x][y] = l;
      if (l > 0) total++;
    }
  return { grid, cols, total };
}

// ── Rounded rect ──────────────────────────────────────────────────────────
function rrect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

// ── Draw head ─────────────────────────────────────────────────────────────
function drawHead(
  ctx: CanvasRenderingContext2D,
  px: number, py: number,
  dir: Cell, dpr: number
) {
  const s = CELL * dpr;
  const r = 5 * dpr;

  // Base fill
  ctx.fillStyle = HEAD_COLOR;
  rrect(ctx, px, py, s, s, r);
  ctx.fill();

  // Sheen gradient
  const g = ctx.createLinearGradient(px, py, px + s * 0.55, py + s * 0.45);
  g.addColorStop(0, "rgba(255,255,255,0.20)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  rrect(ctx, px, py, s, s, r);
  ctx.fill();

  // Eyes & fangs: position by direction
  let e1x: number, e1y: number, e2x: number, e2y: number;
  let fd = { x: 0, y: 0 };
  const sc = dpr;

  if (dir.x === 1) {
    e1x = px + s - 4.5 * sc; e1y = py + 3.2 * sc;
    e2x = px + s - 4.5 * sc; e2y = py + s - 5 * sc;
    fd = { x: 1, y: 0 };
  } else if (dir.x === -1) {
    e1x = px + 3.5 * sc; e1y = py + 3.2 * sc;
    e2x = px + 3.5 * sc; e2y = py + s - 5 * sc;
    fd = { x: -1, y: 0 };
  } else if (dir.y === -1) {
    e1x = px + 3 * sc; e1y = py + 3.5 * sc;
    e2x = px + s - 5 * sc; e2y = py + 3.5 * sc;
    fd = { x: 0, y: -1 };
  } else {
    e1x = px + 3 * sc; e1y = py + s - 4.5 * sc;
    e2x = px + s - 5 * sc; e2y = py + s - 4.5 * sc;
    fd = { x: 0, y: 1 };
  }

  // White sclera
  ctx.fillStyle = "#ffffff";
  for (const [ex, ey] of [[e1x, e1y], [e2x, e2y]]) {
    ctx.beginPath();
    ctx.arc(ex, ey, 2.8 * sc, 0, Math.PI * 2);
    ctx.fill();
  }
  // Pupil
  ctx.fillStyle = "#091c10";
  for (const [ex, ey] of [[e1x, e1y], [e2x, e2y]]) {
    ctx.beginPath();
    ctx.arc(ex + fd.x * 0.7 * sc, ey + fd.y * 0.7 * sc, 1.4 * sc, 0, Math.PI * 2);
    ctx.fill();
  }

  // Fangs
  const fx = px + s / 2 + fd.x * (s / 2);
  const fy = py + s / 2 + fd.y * (s / 2);
  const fl = 5.5 * sc;
  const spread = 3 * sc;
  ctx.fillStyle = "rgba(235,235,235,0.96)";
  for (const sign of [-1, 1] as const) {
    ctx.beginPath();
    if (fd.x !== 0) {
      ctx.moveTo(fx, fy + sign * spread);
      ctx.lineTo(fx + fd.x * fl, fy + sign * (spread * 0.35));
      ctx.lineTo(fx, fy + sign * (spread + 2 * sc));
    } else {
      ctx.moveTo(fx + sign * spread, fy);
      ctx.lineTo(fx + sign * (spread * 0.35), fy + fd.y * fl);
      ctx.lineTo(fx + sign * (spread + 2 * sc), fy);
    }
    ctx.closePath();
    ctx.fill();
  }
}

// ── Easing ────────────────────────────────────────────────────────────────
function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

// ── Component ─────────────────────────────────────────────────────────────
export default function GitHubSnakeCard({ username = "gunawan1608" }: { username?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<ContribLevel[][] | null>(null);
  const colsRef = useRef(53);
  const snakeRef = useRef<Cell[]>([{ x: 2, y: 3 }]);
  const prevRef = useRef<Cell[]>([{ x: 2, y: 3 }]);   // prev positions for interpolation
  const dirRef = useRef<Cell>({ x: 1, y: 0 });
  const foodRef = useRef<Cell | null>(null);
  const dprRef = useRef(1);
  const rngRef = useRef(mulberry32(42));
  const allEatenRef = useRef(false);
  const eatenRef = useRef(0);
  const tickRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef(0);
  const interpStartRef = useRef(0);

  const [loaded, setLoaded] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [totalActive, setTotalActive] = useState(0);
  const [eatenDsp, setEatenDsp] = useState(0);
  const [allDone, setAllDone] = useState(false);
  const snakeLenRef = useRef(1);
  const [snakeLen, setSnakeLen] = useState(1);

  // ── Nearest food ────────────────────────────────────────────────────────
  const nearestFood = useCallback(
    (grid: ContribLevel[][], cols: number, head: Cell): Cell | null => {
      let best: Cell | null = null;
      let bd = Infinity;
      for (let x = 0; x < cols; x++)
        for (let y = 0; y < ROWS; y++)
          if ((grid[x]?.[y] ?? 0) > 0) {
            const d = Math.abs(x - head.x) + Math.abs(y - head.y);
            if (d < bd) { bd = d; best = { x, y }; }
          }
      return best;
    }, []
  );

  // ── Draw a single frame at interpolation progress t (0..1) ─────────────
  const drawFrame = useCallback((t: number) => {
    const canvas = canvasRef.current;
    const grid = gridRef.current;
    const cols = colsRef.current;
    if (!canvas || !grid) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = dprRef.current;
    const ease = easeInOut(Math.min(1, Math.max(0, t)));
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid
    for (let x = 0; x < cols; x++)
      for (let y = 0; y < ROWS; y++) {
        ctx.fillStyle = CONTRIB_COLORS[grid[x]?.[y] ?? 0];
        rrect(ctx, x * STEP * dpr, y * STEP * dpr, CELL * dpr, CELL * dpr, 3 * dpr);
        ctx.fill();
      }

    // Food glow
    const food = foodRef.current;
    if (food && (grid[food.x]?.[food.y] ?? 0) > 0) {
      const fx = food.x * STEP * dpr;
      const fy = food.y * STEP * dpr;
      const cs = CELL * dpr;
      ctx.strokeStyle = "rgba(47,138,87,0.62)";
      ctx.lineWidth = 1.5 * dpr;
      rrect(ctx, fx - dpr, fy - dpr, cs + 2 * dpr, cs + 2 * dpr, 4 * dpr);
      ctx.stroke();
      ctx.strokeStyle = "rgba(47,138,87,0.18)";
      ctx.lineWidth = dpr;
      rrect(ctx, fx - 3 * dpr, fy - 3 * dpr, cs + 6 * dpr, cs + 6 * dpr, 6 * dpr);
      ctx.stroke();
    }

    // Body (tail → neck)
    const cur = snakeRef.current;
    const prv = prevRef.current;
    const len = cur.length;
    for (let i = len - 1; i >= 1; i--) {
      const c = cur[i];
      const p = prv[i] ?? c;

      // Handle wrap-around: if distance is > 1 cell, snap (no lerp across seam)
      let ix: number, iy: number;
      if (Math.abs(c.x - p.x) > 1 || Math.abs(c.y - p.y) > 1) {
        ix = c.x; iy = c.y;
      } else {
        ix = lerp(p.x, c.x, ease);
        iy = lerp(p.y, c.y, ease);
      }

      const alpha = 0.82 - (i / Math.max(1, len - 1)) * 0.42;
      ctx.fillStyle = `rgba(47,138,87,${alpha.toFixed(2)})`;
      rrect(ctx, ix * STEP * dpr, iy * STEP * dpr, CELL * dpr, CELL * dpr, 3 * dpr);
      ctx.fill();

      // Scale texture
      if (i % 2 === 0 && i < len - 2) {
        const pad = 2.5 * dpr;
        ctx.fillStyle = "rgba(0,0,0,0.055)";
        rrect(ctx,
          ix * STEP * dpr + pad, iy * STEP * dpr + pad,
          CELL * dpr - pad * 2, CELL * dpr - pad * 2,
          2 * dpr
        );
        ctx.fill();
      }
    }

    // Head
    if (len > 0) {
      const c = cur[0];
      const p = prv[0] ?? c;
      let hx: number, hy: number;
      if (Math.abs(c.x - p.x) > 1 || Math.abs(c.y - p.y) > 1) {
        hx = c.x; hy = c.y;
      } else {
        hx = lerp(p.x, c.x, ease);
        hy = lerp(p.y, c.y, ease);
      }
      drawHead(ctx, hx * STEP * dpr, hy * STEP * dpr, dirRef.current, dpr);
    }
  }, []);

  // ── Animation loop ───────────────────────────────────────────────────────
  const animLoop = useCallback((now: number) => {
    const t = (now - interpStartRef.current) / INTERP_MS;
    drawFrame(t);
    if (t < 1) rafRef.current = requestAnimationFrame(animLoop);
  }, [drawFrame]);

  // ── Logical tick ─────────────────────────────────────────────────────────
  const tick = useCallback(() => {
    const grid = gridRef.current;
    const cols = colsRef.current;
    if (!grid || allEatenRef.current) return;

    // Refresh food target
    if (!foodRef.current || (grid[foodRef.current.x]?.[foodRef.current.y] ?? 0) === 0)
      foodRef.current = nearestFood(grid, cols, snakeRef.current[0]);

    if (!foodRef.current) {
      allEatenRef.current = true;
      setAllDone(true);
      return;
    }

    const newDir = chooseDir(snakeRef.current, foodRef.current, dirRef.current, cols, rngRef.current);
    dirRef.current = newDir;

    const head = snakeRef.current[0];
    const nx = wrapX(head.x + newDir.x, cols);
    const ny = wrapY(head.y + newDir.y);

    // Snapshot previous for interpolation
    prevRef.current = snakeRef.current.map((s) => ({ ...s }));

    const newSnake = [{ x: nx, y: ny }, ...snakeRef.current];

    const ate = (grid[nx]?.[ny] ?? 0) > 0;
    if (ate) {
      grid[nx][ny] = 0;
      eatenRef.current++;
      setEatenDsp(eatenRef.current);
      foodRef.current = nearestFood(grid, cols, { x: nx, y: ny });
    } else {
      newSnake.pop();
    }

    snakeRef.current = newSnake;
    snakeLenRef.current = newSnake.length;
    setSnakeLen(newSnake.length);

    // Start interpolation
    cancelAnimationFrame(rafRef.current);
    interpStartRef.current = performance.now();
    rafRef.current = requestAnimationFrame(animLoop);

    tickRef.current = setTimeout(tick, ate ? TICK_MS * 0.82 : TICK_MS);
  }, [animLoop, nearestFood]);

  // ── Canvas setup (HD / DPR) ──────────────────────────────────────────────
  const setupCanvas = useCallback((cols: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    dprRef.current = dpr;
    canvas.width = (cols * STEP - GAP) * dpr;
    canvas.height = (ROWS * STEP - GAP) * dpr;
    canvas.style.width = "100%";
    canvas.style.height = "auto";
  }, []);

  // ── Init ─────────────────────────────────────────────────────────────────
  const init = useCallback(
    (data: { grid: ContribLevel[][]; cols: number; total: number }) => {
      if (tickRef.current) clearTimeout(tickRef.current);
      cancelAnimationFrame(rafRef.current);

      gridRef.current = data.grid;
      colsRef.current = data.cols;
      eatenRef.current = 0;
      allEatenRef.current = false;
      setTotalActive(data.total);
      setEatenDsp(0);
      setAllDone(false);

      const sx = Math.floor(data.cols / 8);
      snakeRef.current = [{ x: sx, y: 3 }];
      prevRef.current = [{ x: sx, y: 3 }];
      dirRef.current = { x: 1, y: 0 };
      foodRef.current = null;
      snakeLenRef.current = 1;
      setSnakeLen(1);

      setupCanvas(data.cols);
      drawFrame(1);
      setLoaded(true);
      setIsFetching(false);

      tickRef.current = setTimeout(tick, TICK_MS * 6);
    },
    [setupCanvas, drawFrame, tick]
  );

  // ── Fetch once on mount ──────────────────────────────────────────────────
  useEffect(() => {
    let gone = false;
    if (tickRef.current) clearTimeout(tickRef.current);
    cancelAnimationFrame(rafRef.current);
    setLoaded(false);
    setIsFetching(true);

    const seed = username.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 7 + 365;
    rngRef.current = mulberry32(seed);

    const fbTimer = setTimeout(() => {
      if (!gone) init(mkFallback(53, rngRef.current));
    }, 7000);

    fetchContribs(username)
      .then((d) => { clearTimeout(fbTimer); if (!gone) init(d); })
      .catch(() => { clearTimeout(fbTimer); if (!gone) init(mkFallback(53, rngRef.current)); });

    return () => {
      gone = true;
      clearTimeout(fbTimer);
      if (tickRef.current) clearTimeout(tickRef.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, [username, init]);

  // ── Resize: keep canvas crisp ────────────────────────────────────────────
  useEffect(() => {
    const fn = () => {
      if (gridRef.current) { setupCanvas(colsRef.current); drawFrame(1); }
    };
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, [setupCanvas, drawFrame]);

  const remaining = Math.max(0, totalActive - eatenDsp);

  return (
    <div className="ghsc-root" aria-label="GitHub contributions snake">

      {/* Header */}
      <div className="ghsc-header">
        <div className="ghsc-header-left">
          <span className="ghsc-dot" aria-hidden />
          <span className="ghsc-label">GitHub Activity</span>
          <span className="ghsc-user">@{username}</span>
        </div>
        <span className="ghsc-badge">1 Tahun Terakhir</span>
      </div>

      {/* Canvas area */}
      <div className="ghsc-canvas-wrap">
        {!loaded && (
          <div className="ghsc-loading">
            <div className="ghsc-spinner" />
            <span className="ghsc-loading-text">
              {isFetching ? "Mengambil data GitHub…" : "Memuat…"}
            </span>
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="ghsc-canvas"
          style={{ opacity: loaded ? 1 : 0 }}
        />
        {allDone && (
          <div className="ghsc-done">
            <span>🐍 Semua kontribusi telah dimakan!</span>
            <span className="ghsc-done-sub">Refresh halaman untuk reset</span>
          </div>
        )}
      </div>

      {/* Footer stats */}
      <div className="ghsc-footer">
        <div className="ghsc-stat">
          <span className="ghsc-stat-v">{remaining}</span>
          <span className="ghsc-stat-l">tersisa</span>
        </div>
        <div className="ghsc-div" />
        <div className="ghsc-stat">
          <span className="ghsc-stat-v ghsc-eaten">{eatenDsp}</span>
          <span className="ghsc-stat-l">dimakan</span>
        </div>
        <div className="ghsc-div" />
        <div className="ghsc-stat">
          <span className="ghsc-stat-v">{totalActive}</span>
          <span className="ghsc-stat-l">aktif</span>
        </div>
        <div className="ghsc-div" />
        <div className="ghsc-stat">
          <span className="ghsc-stat-v">{snakeLen}</span>
          <span className="ghsc-stat-l">panjang ular</span>
        </div>
      </div>

      <style>{`
        .ghsc-root {
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.88);
          background: linear-gradient(160deg, rgba(255,255,255,0.93), rgba(220,243,226,0.78));
          box-shadow: 0 4px 22px rgba(47,138,87,0.09), inset 0 1px 0 rgba(255,255,255,0.82);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* ── Header ── */
        .ghsc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.72rem 1rem 0.58rem;
          border-bottom: 1px solid rgba(47,138,87,0.10);
          gap: 0.75rem;
          flex-shrink: 0;
        }
        .ghsc-header-left {
          display: flex;
          align-items: center;
          gap: 0.42rem;
          flex: 1;
          min-width: 0;
        }
        .ghsc-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #2f8a57;
          box-shadow: 0 0 0 3px rgba(47,138,87,0.18);
          animation: ghscPulse 2.4s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes ghscPulse {
          0%,100% { box-shadow: 0 0 0 3px rgba(47,138,87,0.18); }
          50%      { box-shadow: 0 0 0 6px rgba(47,138,87,0.06); }
        }
        .ghsc-label {
          font-family: var(--mono, monospace);
          font-size: 0.61rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--text-faint, #8ba08e);
          white-space: nowrap;
        }
        .ghsc-user {
          font-family: var(--mono, monospace);
          font-size: 0.59rem;
          color: #2f8a57;
          letter-spacing: 0.04em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ghsc-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.26rem 0.62rem;
          border-radius: 999px;
          border: 1px solid rgba(47,138,87,0.18);
          background: rgba(255,255,255,0.72);
          font-family: var(--mono, monospace);
          font-size: 0.61rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: #395845;
          white-space: nowrap;
          flex-shrink: 0;
        }

        /* ── Canvas ── */
        .ghsc-canvas-wrap {
          position: relative;
          width: 100%;
          padding: 0.65rem 0.9rem 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          min-height: 72px;
        }
        .ghsc-canvas {
          display: block;
          width: 100%;
          height: auto;
          transition: opacity 0.4s ease;
        }
        .ghsc-loading {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 0.55rem;
        }
        .ghsc-spinner {
          width: 20px; height: 20px; border-radius: 50%;
          border: 2px solid rgba(47,138,87,0.14);
          border-top-color: rgba(47,138,87,0.72);
          animation: ghscSpin 0.85s linear infinite;
        }
        @keyframes ghscSpin { to { transform: rotate(360deg); } }
        .ghsc-loading-text {
          font-family: var(--mono, monospace);
          font-size: 0.57rem; letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-faint, #8ba08e);
        }
        .ghsc-done {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 0.32rem;
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(6px);
          padding: 1rem;
        }
        .ghsc-done span {
          font-family: var(--mono, monospace);
          font-size: 0.70rem; letter-spacing: 0.04em;
          color: #1e6a42; font-weight: 600;
          text-align: center;
        }
        .ghsc-done-sub {
          font-size: 0.57rem !important;
          color: #8ba08e !important;
          font-weight: 400 !important;
        }

        /* ── Footer ── */
        .ghsc-footer {
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 0.5rem 1rem 0.72rem;
          border-top: 1px solid rgba(47,138,87,0.10);
          gap: 0.5rem; flex-shrink: 0;
        }
        .ghsc-stat {
          display: flex; flex-direction: column;
          align-items: center; gap: 0.07rem;
        }
        .ghsc-stat-v {
          font-family: var(--mono, monospace);
          font-size: 0.78rem; font-weight: 700;
          color: var(--text, #173223);
          letter-spacing: 0.02em; line-height: 1;
        }
        .ghsc-eaten { color: #2f8a57 !important; }
        .ghsc-stat-l {
          font-family: var(--mono, monospace);
          font-size: 0.47rem; letter-spacing: 0.13em;
          text-transform: uppercase;
          color: var(--text-faint, #8ba08e);
        }
        .ghsc-div {
          width: 1px; height: 20px;
          background: rgba(47,138,87,0.11);
          flex-shrink: 0;
        }

        @media (max-width: 640px) {
          .ghsc-header { padding: 0.58rem 0.8rem 0.48rem; }
          .ghsc-user   { display: none; }
          .ghsc-canvas-wrap { padding: 0.52rem 0.7rem 0.62rem; }
          .ghsc-footer  { padding: 0.44rem 0.7rem 0.62rem; }
          .ghsc-stat-v  { font-size: 0.68rem; }
          .ghsc-badge   { font-size: 0.57rem; padding: 0.20rem 0.48rem; }
        }
      `}</style>
    </div>
  );
}