"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
type Cell = { x: number; y: number };
type ContribLevel = 0 | 1 | 2 | 3 | 4;
type SnakeRange = 7 | 30 | 120 | 365 | 701;

// ── Constants ──────────────────────────────────────────────────────────────
const ROWS = 7;
const CELL = 10;
const GAP = 3;
const STEP = CELL + GAP;
const TICK_MS = 90;
const TURN_PROB = 0.22;

// Modern theme (aligns with portfolio greens)
const BG_COLOR = "rgba(255,255,255,0)";
const GRID_EMPTY = "rgba(47,138,87,0.10)";
const CONTRIB_COLORS: Record<ContribLevel, string> = {
  0: GRID_EMPTY,
  1: "rgba(47,138,87,0.22)",
  2: "rgba(47,138,87,0.34)",
  3: "rgba(47,138,87,0.48)",
  4: "rgba(47,138,87,0.68)",
};
const SNAKE_HEAD = "#2f8a57";
const SNAKE_BODY = "rgba(47,138,87,0.78)";
const SNAKE_TAIL = "rgba(47,138,87,0.5)";
const EAT_FLASH = "rgba(255,255,255,0.95)";

const RANGE_OPTIONS: { value: SnakeRange; label: string; param: string }[] = [
  { value: 7, label: "7D", param: "7" },
  { value: 30, label: "30D", param: "30" },
  { value: 120, label: "120D", param: "120" },
  { value: 365, label: "365D", param: "365" },
  { value: 701, label: "700+", param: "730" },
];

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("timeout")), ms);
    p.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      }
    );
  });
}

function parseGithubCalendarSvg(svgText: string): {
  grid: ContribLevel[][];
  cols: number;
  total: number;
} {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgText, "image/svg+xml");
  const rects = Array.from(doc.querySelectorAll('rect[data-level]')) as SVGRectElement[];

  const cells: { x: number; y: number; level: ContribLevel }[] = [];
  let maxX = 0;
  let maxY = 0;
  let total = 0;

  for (const r of rects) {
    const x = Number(r.getAttribute("x") ?? "0");
    const y = Number(r.getAttribute("y") ?? "0");
    const level = clamp(Number(r.getAttribute("data-level") ?? "0"), 0, 4) as ContribLevel;
    cells.push({ x, y, level });
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
    if (level > 0) total += 1;
  }

  const colCount = Math.floor(maxX / 11) + 1;
  const grid: ContribLevel[][] = Array.from({ length: colCount }, () => Array(ROWS).fill(0 as ContribLevel));

  for (const c of cells) {
    const col = Math.floor(c.x / 11);
    const row = Math.floor(c.y / 11);
    if (col >= 0 && col < colCount && row >= 0 && row < ROWS) {
      grid[col][row] = c.level;
    }
  }

  return { grid, cols: colCount, total };
}

function buildFallbackGrid(cols: number, rng: () => number): { grid: ContribLevel[][]; cols: number; total: number } {
  const grid: ContribLevel[][] = Array.from({ length: cols }, () => Array(ROWS).fill(0 as ContribLevel));
  let total = 0;
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < ROWS; y++) {
      const roll = rng();
      const lvl: ContribLevel = roll < 0.72 ? 0 : roll < 0.84 ? 1 : roll < 0.92 ? 2 : roll < 0.975 ? 3 : 4;
      grid[x][y] = lvl;
      if (lvl > 0) total++;
    }
  }
  return { grid, cols, total };
}

async function fetchContributionsSvg(username: string, range: SnakeRange): Promise<string> {
  const opt = RANGE_OPTIONS.find((o) => o.value === range) ?? RANGE_OPTIONS[3];
  const url = `https://ghchart.rshah.org/${username}?t=${opt.param}`;
  const res = await fetch(url, {
    cache: "no-store",
    headers: { Accept: "image/svg+xml,text/plain,*/*" },
  });
  if (!res.ok) throw new Error("Failed to fetch contribution chart");
  return await res.text();
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function GitHubSnakeCard({ username = "gunawan1608" }: { username?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<ContribLevel[][] | null>(null);
  const colsRef = useRef<number>(53);
  const snakeRef = useRef<Cell[]>([{ x: 0, y: 3 }]);
  const dirRef = useRef<Cell>({ x: 1, y: 0 });
  const foodRef = useRef<Cell | null>(null);
  const ateRef = useRef<Cell | null>(null);
  const ateTimerRef = useRef(0);
  const tickRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rngRef = useRef<ReturnType<typeof mulberry32> | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [range, setRange] = useState<SnakeRange>(365);
  const [totalCells, setTotalCells] = useState(0);
  const [eaten, setEaten] = useState(0);
  const [isFetching, setIsFetching] = useState(false);

  const dims = useMemo(() => {
    const cols = colsRef.current;
    const w = cols * STEP - GAP;
    const h = ROWS * STEP - GAP;
    return { cols, w, h };
  }, [range, loaded]);

  const spawnFood = useCallback((grid: ContribLevel[][], cols: number, snake: Cell[]) => {
    const occupied = new Set(snake.map((c) => `${c.x},${c.y}`));
    const candidates: Cell[] = [];
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < ROWS; y++) {
        if (grid[x][y] > 0 && !occupied.has(`${x},${y}`)) {
          candidates.push({ x, y });
        }
      }
    }
    if (candidates.length === 0) return null;
    const r = rngRef.current ?? Math.random;
    return candidates[Math.floor(r() * candidates.length)];
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const grid = gridRef.current;
    const cols = colsRef.current;
    if (!canvas || !grid) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = cols * STEP - GAP;
    const h = ROWS * STEP - GAP;

    const snake = snakeRef.current;
    const food = foodRef.current;
    const ate = ateRef.current;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, w, h);

    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < ROWS; y++) {
        const lvl = grid[x][y];
        ctx.fillStyle = CONTRIB_COLORS[lvl];
        const px = x * STEP;
        const py = y * STEP;
        ctx.beginPath();
        ctx.roundRect(px, py, CELL, CELL, 4);
        ctx.fill();
      }
    }

    if (food) {
      const isAte = ate && ate.x === food.x && ate.y === food.y;
      ctx.fillStyle = isAte ? EAT_FLASH : "rgba(47,138,87,0.16)";
      ctx.strokeStyle = "rgba(47,138,87,0.5)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(food.x * STEP, food.y * STEP, CELL, CELL, 4);
      ctx.fill();
      ctx.stroke();
    }

    snake.forEach((seg, i) => {
      const isHead = i === 0;
      const progress = i / Math.max(1, snake.length - 1);
      const color = isHead ? SNAKE_HEAD : progress > 0.72 ? SNAKE_TAIL : SNAKE_BODY;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(seg.x * STEP, seg.y * STEP, CELL, CELL, isHead ? 5 : 4);
      ctx.fill();
    });
  }, []);

  const chooseNextDir = useCallback((grid: ContribLevel[][], cols: number) => {
    const r = rngRef.current ?? Math.random;
    const dir = dirRef.current;
    const head = snakeRef.current[0];

    const dirs: Cell[] = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
    ];

    const isOpposite = (a: Cell, b: Cell) => a.x === -b.x && a.y === -b.y;

    const candidates = dirs.filter((d) => !isOpposite(d, dir));
    const scored = candidates
      .map((d) => {
        let nx = head.x + d.x;
        let ny = head.y + d.y;
        if (nx < 0) nx = cols - 1;
        if (nx >= cols) nx = 0;
        if (ny < 0) ny = ROWS - 1;
        if (ny >= ROWS) ny = 0;

        const selfHit = snakeRef.current.slice(0, 8).some((s) => s.x === nx && s.y === ny);
        if (selfHit) return { d, score: -999 };

        const towardsFood = foodRef.current && (nx === foodRef.current.x || ny === foodRef.current.y) ? 2 : 0;
        const cellBonus = grid[nx]?.[ny] ? grid[nx][ny] : 0;
        return { d, score: cellBonus + towardsFood + r() * 0.35 };
      })
      .sort((a, b) => b.score - a.score);

    const best = scored[0]?.d ?? dir;
    if (r() < TURN_PROB) {
      return scored[Math.min(scored.length - 1, Math.floor(r() * scored.length))]?.d ?? best;
    }
    return best;
  }, []);

  const tick = useCallback(() => {
    const grid = gridRef.current;
    const cols = colsRef.current;
    if (!grid) return;

    const snake = [...snakeRef.current];
    const dir = chooseNextDir(grid, cols);
    dirRef.current = dir;

    const head = snake[0];
    let nx = head.x + dir.x;
    let ny = head.y + dir.y;

    if (nx < 0) nx = cols - 1;
    if (nx >= cols) nx = 0;
    if (ny < 0) ny = ROWS - 1;
    if (ny >= ROWS) ny = 0;

    const selfHit = snake.slice(1).some((s) => s.x === nx && s.y === ny);
    if (selfHit) {
      snakeRef.current = [{ x: Math.floor(cols / 6), y: 3 }];
      dirRef.current = { x: 1, y: 0 };
      foodRef.current = spawnFood(grid, cols, snakeRef.current);
      draw();
      tickRef.current = setTimeout(tick, TICK_MS);
      return;
    }

    const newHead = { x: nx, y: ny };
    snake.unshift(newHead);

    const food = foodRef.current;
    let ate = false;
    if (food && food.x === nx && food.y === ny) {
      grid[nx][ny] = 0;
      setEaten((v) => v + 1);
      ateRef.current = { x: nx, y: ny };
      ateTimerRef.current = 3;
      ate = true;
      foodRef.current = spawnFood(grid, cols, snake);
    } else {
      snake.pop();
    }

    if (ateTimerRef.current > 0) {
      ateTimerRef.current--;
      if (ateTimerRef.current === 0) ateRef.current = null;
    }

    snakeRef.current = snake;
    draw();
    tickRef.current = setTimeout(tick, ate ? TICK_MS * 0.65 : TICK_MS);
  }, [chooseNextDir, draw, spawnFood]);

  useEffect(() => {
    let cancelled = false;
    if (tickRef.current) clearTimeout(tickRef.current);

    setLoaded(false);
    setIsFetching(true);
    setEaten(0);

    const seed = username.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) + range * 97;
    rngRef.current = mulberry32(seed);

    const rng = rngRef.current;

    withTimeout(fetchContributionsSvg(username, range), 8000)
      .then((svg) => {
        if (cancelled) return;
        const parsed = parseGithubCalendarSvg(svg);
        const safeParsed = parsed.total > 0 ? parsed : buildFallbackGrid(53, rng);

        gridRef.current = safeParsed.grid;
        colsRef.current = safeParsed.cols;
        setTotalCells(safeParsed.total);

        snakeRef.current = [{ x: Math.floor(safeParsed.cols / 6), y: 3 }];
        dirRef.current = { x: 1, y: 0 };
        foodRef.current = spawnFood(safeParsed.grid, safeParsed.cols, snakeRef.current);

        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = safeParsed.cols * STEP - GAP;
          canvas.height = ROWS * STEP - GAP;
        }

        draw();
        setLoaded(true);
        setIsFetching(false);
        tickRef.current = setTimeout(tick, TICK_MS * 6);
      })
      .catch(() => {
        if (cancelled) return;
        const fallback = buildFallbackGrid(53, rng);
        gridRef.current = fallback.grid;
        colsRef.current = fallback.cols;
        setTotalCells(fallback.total);
        snakeRef.current = [{ x: Math.floor(fallback.cols / 6), y: 3 }];
        dirRef.current = { x: 1, y: 0 };
        foodRef.current = spawnFood(fallback.grid, fallback.cols, snakeRef.current);

        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = fallback.cols * STEP - GAP;
          canvas.height = ROWS * STEP - GAP;
        }

        draw();
        setLoaded(true);
        setIsFetching(false);
        tickRef.current = setTimeout(tick, TICK_MS * 6);
      });

    return () => {
      cancelled = true;
      if (tickRef.current) clearTimeout(tickRef.current);
    };
  }, [username, range, spawnFood, draw, tick]);

  return (
    <div className="gh-snake-card" aria-label="GitHub contributions snake">
      <div className="gh-snake-header">
        <div className="gh-snake-header-left">
          <span className="gh-snake-label">GitHub Activity</span>
        </div>

        <div className="gh-snake-header-right" aria-label="Contribution range">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`gh-snake-range${range === opt.value ? " is-active" : ""}`}
              onClick={() => setRange(opt.value)}
              disabled={isFetching}
            >
              {opt.label}
            </button>
          ))}
          <span className="gh-snake-day-label">{RANGE_OPTIONS.find((o) => o.value === range)?.label}</span>
        </div>
      </div>

      <div className="gh-snake-canvas-wrap">
        {!loaded && (
          <div className="gh-snake-loading">
            <span className="gh-snake-loading-text">Loading contributions…</span>
          </div>
        )}

        <canvas
          ref={canvasRef}
          className="gh-snake-canvas"
          style={{ opacity: loaded ? 1 : 0 }}
        />
      </div>

      <div className="gh-snake-footer">
        <div className="gh-snake-stat">
          <span className="gh-snake-stat-val">{Math.max(0, totalCells - eaten)}</span>
          <span className="gh-snake-stat-lbl">cells left</span>
        </div>
        <div className="gh-snake-divider" />
        <div className="gh-snake-stat">
          <span className="gh-snake-stat-val">{eaten}</span>
          <span className="gh-snake-stat-lbl">eaten</span>
        </div>
        <div className="gh-snake-divider" />
        <div className="gh-snake-stat">
          <span className="gh-snake-stat-val">
            <span className="gh-snake-live-dot" />Live
          </span>
          <span className="gh-snake-stat-lbl">{username}</span>
        </div>
      </div>
    </div>
  );
}