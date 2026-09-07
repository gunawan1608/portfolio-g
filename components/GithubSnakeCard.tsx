"use client";

import {
  type CSSProperties,
  type ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Cell = { x: number; y: number };
type ContributionLevel = 0 | 1 | 2 | 3 | 4;

type ContributionDay = {
  date: string;
  count: number;
  level: ContributionLevel;
};

type ContributionResponse = {
  username: string;
  year: number;
  years: number[];
  createdAt: string | null;
  totalContributions: number;
  activeDays: number;
  source: "github-graphql" | "github-profile";
  days: ContributionDay[];
};

type CalendarCell = ContributionDay & {
  inYear: boolean;
  week: number;
  weekday: number;
};

type MonthLabel = {
  label: string;
  week: number;
};

type CalendarData = {
  username: string;
  year: number;
  years: number[];
  createdAt: string | null;
  totalContributions: number;
  activeDays: number;
  source: ContributionResponse["source"] | null;
  cols: number;
  width: number;
  height: number;
  grid: ContributionLevel[][];
  monthLabels: MonthLabel[];
  days: CalendarCell[][];
};

const ROWS = 7;
const CELL = 10;
const GAP = 3;
const STEP = CELL + GAP;
const GRAPH_HEIGHT = ROWS * STEP - GAP;
const TICK_MS = 190;
const START_DELAY_MS = 520;
const DPR_LIMIT = 2;

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const WEEKDAY_LABELS = [
  { row: 1, label: "Mon" },
  { row: 3, label: "Wed" },
  { row: 5, label: "Fri" },
] as const;

const CONTRIBUTION_COLORS: Record<ContributionLevel, string> = {
  0: "#fff2ee",
  1: "#ffd7d0",
  2: "#ff9184",
  3: "#da020e",
  4: "#6e0410",
};

const SNAKE_BODY_RGB = "218, 2, 14";
const SNAKE_HEAD = "#111111";

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clampLevel(level: number): ContributionLevel {
  return Math.max(0, Math.min(4, level)) as ContributionLevel;
}

function cellKey(cell: Cell) {
  return `${cell.x},${cell.y}`;
}

function inBounds(x: number, y: number, cols: number) {
  return x >= 0 && x < cols && y >= 0 && y < ROWS;
}

function nextCell(cell: Cell, dir: Cell, cols: number): Cell | null {
  const x = cell.x + dir.x;
  const y = cell.y + dir.y;
  return inBounds(x, y, cols) ? { x, y } : null;
}

function manhattan(a: Cell, b: Cell) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function utcDate(year: number, month: number, day: number) {
  return new Date(Date.UTC(year, month, day));
}

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + amount);
  return next;
}

function diffDays(from: Date, to: Date) {
  return Math.round((to.getTime() - from.getTime()) / 86400000);
}

function dateKey(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function graphWidth(cols: number) {
  return cols * STEP - GAP;
}

function rrect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
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

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeMove(t: number) {
  return t * t * (3 - 2 * t);
}

function interpolateWrapped(prev: Cell, current: Cell, cols: number, t: number) {
  void cols;
  return { x: lerp(prev.x, current.x, t), y: lerp(prev.y, current.y, t) };
}

function drawWrapped(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  cols: number,
  dpr: number,
  draw: (px: number, py: number) => void
) {
  const width = graphWidth(cols) * dpr;
  const height = GRAPH_HEIGHT * dpr;
  const pad = CELL * dpr;
  const px = x * STEP * dpr;
  const py = y * STEP * dpr;

  if (px > -pad && px < width && py > -pad && py < height) {
    draw(px, py);
  }
}

function drawHead(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  dir: Cell,
  dpr: number
) {
  const size = CELL * dpr;
  const radius = 2.5 * dpr;

  ctx.fillStyle = SNAKE_HEAD;
  rrect(ctx, px, py, size, size, radius);
  ctx.fill();

  const sheen = ctx.createLinearGradient(px, py, px + size, py + size);
  sheen.addColorStop(0, "rgba(246, 197, 0,0.34)");
  sheen.addColorStop(0.62, "rgba(255,255,255,0)");
  ctx.fillStyle = sheen;
  rrect(ctx, px, py, size, size, radius);
  ctx.fill();

  const forward = dir.x !== 0 ? dir.x : dir.y;
  const horizontal = dir.x !== 0;
  const eyeA = horizontal
    ? { x: px + (dir.x > 0 ? 6.9 : 3.1) * dpr, y: py + 3 * dpr }
    : { x: px + 3.2 * dpr, y: py + (dir.y > 0 ? 6.9 : 3.1) * dpr };
  const eyeB = horizontal
    ? { x: eyeA.x, y: py + 7 * dpr }
    : { x: px + 6.8 * dpr, y: eyeA.y };

  ctx.fillStyle = "#ffffff";
  for (const eye of [eyeA, eyeB]) {
    ctx.beginPath();
    ctx.arc(eye.x, eye.y, 1.6 * dpr, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "#da020e";
  for (const eye of [eyeA, eyeB]) {
    ctx.beginPath();
    ctx.arc(
      eye.x + (horizontal ? forward * 0.42 * dpr : 0),
      eye.y + (!horizontal ? forward * 0.42 * dpr : 0),
      0.72 * dpr,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
}

function drawGridLayer(
  ctx: CanvasRenderingContext2D,
  grid: ContributionLevel[][],
  cols: number,
  dpr: number
) {
  ctx.clearRect(0, 0, graphWidth(cols) * dpr, GRAPH_HEIGHT * dpr);

  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < ROWS; y++) {
      const px = x * STEP * dpr;
      const py = y * STEP * dpr;
      ctx.fillStyle = CONTRIBUTION_COLORS[grid[x]?.[y] ?? 0];
      rrect(ctx, px, py, CELL * dpr, CELL * dpr, 2 * dpr);
      ctx.fill();

      if ((grid[x]?.[y] ?? 0) === 0) {
        ctx.strokeStyle = "rgba(27,31,36,0.06)";
        ctx.lineWidth = dpr;
        rrect(ctx, px + 0.5 * dpr, py + 0.5 * dpr, (CELL - 1) * dpr, (CELL - 1) * dpr, 2 * dpr);
        ctx.stroke();
      }
    }
  }
}

function bfsStep(head: Cell, target: Cell, snake: Cell[], cols: number): Cell | null {
  const body = new Set(snake.slice(0, -1).map(cellKey));
  const dirs: Cell[] = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];
  const queue: { pos: Cell; first: Cell }[] = [];
  const seen = new Set<string>([`${head.x},${head.y}`]);

  for (const dir of dirs) {
    const nextCellValue = nextCell(head, dir, cols);
    if (!nextCellValue) continue;
    const key = cellKey(nextCellValue);
    if (!body.has(key) && !seen.has(key)) {
      seen.add(key);
      queue.push({ pos: nextCellValue, first: dir });
    }
  }

  while (queue.length) {
    const next = queue.shift();
    if (!next) break;
    if (next.pos.x === target.x && next.pos.y === target.y) return next.first;

    for (const dir of dirs) {
      const nextCellValue = nextCell(next.pos, dir, cols);
      if (!nextCellValue) continue;
      const key = cellKey(nextCellValue);
      if (!body.has(key) && !seen.has(key)) {
        seen.add(key);
        queue.push({ pos: nextCellValue, first: next.first });
      }
    }
  }

  return null;
}

function floodCount(start: Cell, snake: Cell[], cols: number) {
  const body = new Set(snake.slice(1).map(cellKey));
  const dirs: Cell[] = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];
  const queue: Cell[] = [start];
  const seen = new Set<string>();
  let count = 0;

  while (queue.length) {
    const cell = queue.shift();
    if (!cell) break;
    const key = `${cell.x},${cell.y}`;
    if (seen.has(key) || body.has(key)) continue;

    seen.add(key);
    count++;

    for (const dir of dirs) {
      const nextCellValue = nextCell(cell, dir, cols);
      if (nextCellValue) queue.push(nextCellValue);
    }
  }

  return count;
}

function chooseDir(
  snake: Cell[],
  food: Cell | null,
  dir: Cell,
  cols: number,
  rng: () => number
): Cell {
  const head = snake[0];
  const dirs: Cell[] = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];
  const noReverse = dirs.filter((next) => !(next.x === -dir.x && next.y === -dir.y));
  const body = new Set(snake.slice(0, -1).map(cellKey));
  const safe = noReverse.filter((next) => {
    const nextCellValue = nextCell(head, next, cols);
    return Boolean(nextCellValue && !body.has(cellKey(nextCellValue)));
  });

  if (!safe.length) {
    return (
      dirs.find((next) => {
        const nextCellValue = nextCell(head, next, cols);
        return Boolean(nextCellValue && !body.has(cellKey(nextCellValue)));
      }) ?? dir
    );
  }

  if (food) {
    const towardFood = bfsStep(head, food, snake, cols);
    if (towardFood && safe.some((next) => next.x === towardFood.x && next.y === towardFood.y)) {
      const nextHead = nextCell(head, towardFood, cols);
      if (!nextHead) return towardFood;
      const afterMove = [nextHead, ...snake.slice(0, -1)];
      if (floodCount(nextHead, afterMove, cols) >= Math.min(snake.length, 5)) {
        return towardFood;
      }
    }
  }

  return safe
    .map((next) => {
      const nextHead = nextCell(head, next, cols)!;
      const afterMove = [nextHead, ...snake.slice(0, -1)];
      const foodDistance = food ? manhattan(nextHead, food) : 0;
      return {
        dir: next,
        score:
          floodCount(nextHead, afterMove, cols) * 1.4 -
          foodDistance * 0.9 +
          (next.x === dir.x && next.y === dir.y ? 0.35 : 0) +
          rng() * 0.2,
      };
    })
    .sort((a, b) => b.score - a.score)[0]!.dir;
}

function buildCalendar(payload: ContributionResponse): CalendarData {
  const startOfYear = utcDate(payload.year, 0, 1);
  const endOfYear = utcDate(payload.year, 11, 31);
  const calendarStart = addDays(startOfYear, -startOfYear.getUTCDay());
  const calendarEnd = addDays(endOfYear, 6 - endOfYear.getUTCDay());
  const cols = Math.floor(diffDays(calendarStart, calendarEnd) / 7) + 1;
  const daysByDate = new Map(payload.days.map((day) => [day.date, day]));
  const days: CalendarCell[][] = Array.from({ length: cols }, () => []);
  const grid: ContributionLevel[][] = Array.from({ length: cols }, () =>
    Array(ROWS).fill(0 as ContributionLevel)
  );

  let activeDays = 0;
  const totalDays = diffDays(calendarStart, calendarEnd) + 1;

  for (let offset = 0; offset < totalDays; offset++) {
    const current = addDays(calendarStart, offset);
    const week = Math.floor(offset / 7);
    const weekday = current.getUTCDay();
    const key = dateKey(current);
    const inYear = current.getUTCFullYear() === payload.year;
    const contribution = inYear ? daysByDate.get(key) : null;
    const cell: CalendarCell = {
      date: key,
      count: contribution?.count ?? 0,
      level: clampLevel(contribution?.level ?? 0),
      inYear,
      week,
      weekday,
    };

    days[week][weekday] = cell;
    grid[week][weekday] = cell.level;
    if (inYear && cell.count > 0) activeDays++;
  }

  const monthLabels = MONTHS.map((label, month) => ({
    label,
    week: Math.floor(diffDays(calendarStart, utcDate(payload.year, month, 1)) / 7),
  }));

  return {
    username: payload.username,
    year: payload.year,
    years: payload.years,
    createdAt: payload.createdAt,
    totalContributions: payload.totalContributions,
    activeDays: payload.activeDays || activeDays,
    source: payload.source,
    cols,
    width: graphWidth(cols),
    height: GRAPH_HEIGHT,
    grid,
    monthLabels,
    days,
  };
}

function emptyCalendar(year: number, username: string): CalendarData {
  return buildCalendar({
    username,
    year,
    years: [year],
    createdAt: null,
    totalContributions: 0,
    activeDays: 0,
    source: "github-profile",
    days: [],
  });
}

export default function GitHubSnakeCard({ username = "gunawan1608" }: { username?: string }) {
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [calendar, setCalendar] = useState(() => emptyCalendar(currentYear, username));
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const [snakeStats, setSnakeStats] = useState({ eaten: 0, length: 1, done: false });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const baseCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const gridRef = useRef<ContributionLevel[][] | null>(null);
  const colsRef = useRef(calendar.cols);
  const snakeRef = useRef<Cell[]>([{ x: 2, y: 3 }]);
  const prevRef = useRef<Cell[]>([{ x: 2, y: 3 }]);
  const dirRef = useRef<Cell>({ x: 1, y: 0 });
  const foodRef = useRef<Cell | null>(null);
  const dprRef = useRef(1);
  const rngRef = useRef(mulberry32(42));
  const eatenRef = useRef(0);
  const doneRef = useRef(false);
  const rafRef = useRef(0);
  const runningRef = useRef(false);
  const moveStartRef = useRef(0);
  const nextStepAtRef = useRef(0);

  const graphVars = {
    "--ghsc-graph-width": `${calendar.width}px`,
    "--ghsc-graph-height": `${calendar.height}px`,
  } as CSSProperties;

  const contributionWord = calendar.totalContributions === 1 ? "contribution" : "contributions";

  const stopAnimation = useCallback(() => {
    runningRef.current = false;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
  }, []);

  const nearestFood = useCallback(
    (grid: ContributionLevel[][], cols: number, head: Cell, snake = snakeRef.current) => {
      if ((grid[head.x]?.[head.y] ?? 0) > 0) return head;

      const body = new Set(snake.slice(0, -1).map(cellKey));
      const dirs: Cell[] = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 },
      ];
      const queue: Cell[] = [head];
      const seen = new Set<string>([cellKey(head)]);

      while (queue.length) {
        const current = queue.shift();
        if (!current) break;

        if ((grid[current.x]?.[current.y] ?? 0) > 0) {
          return current;
        }

        for (const dir of dirs) {
          const nextCellValue = nextCell(current, dir, cols);
          if (!nextCellValue) continue;
          const key = cellKey(nextCellValue);

          if (!seen.has(key) && !body.has(key)) {
            seen.add(key);
            queue.push(nextCellValue);
          }
        }
      }

      return null;
    },
    []
  );

  const renderBaseLayer = useCallback(() => {
    const grid = gridRef.current;
    const cols = colsRef.current;
    if (!grid || typeof document === "undefined") return;

    const dpr = dprRef.current;
    const layer = baseCanvasRef.current ?? document.createElement("canvas");
    layer.width = graphWidth(cols) * dpr;
    layer.height = GRAPH_HEIGHT * dpr;
    baseCanvasRef.current = layer;

    const ctx = layer.getContext("2d");
    if (ctx) drawGridLayer(ctx, grid, cols, dpr);
  }, []);

  const setupCanvas = useCallback(
    (cols: number) => {
      const canvas = canvasRef.current;
      if (!canvas || typeof window === "undefined") return;

      const dpr = Math.min(window.devicePixelRatio || 1, DPR_LIMIT);
      dprRef.current = dpr;
      canvas.width = graphWidth(cols) * dpr;
      canvas.height = GRAPH_HEIGHT * dpr;
      canvas.style.width = `${graphWidth(cols)}px`;
      canvas.style.height = `${GRAPH_HEIGHT}px`;

      renderBaseLayer();
    },
    [renderBaseLayer]
  );

  const drawFrame = useCallback((progress: number) => {
    const canvas = canvasRef.current;
    const grid = gridRef.current;
    const base = baseCanvasRef.current;
    const cols = colsRef.current;
    if (!canvas || !grid) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = dprRef.current;
    const t = easeMove(Math.min(1, Math.max(0, progress)));
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (base) {
      ctx.drawImage(base, 0, 0);
    } else {
      drawGridLayer(ctx, grid, cols, dpr);
    }

    const food = foodRef.current;
    if (food && (grid[food.x]?.[food.y] ?? 0) > 0) {
      const fx = food.x * STEP * dpr;
      const fy = food.y * STEP * dpr;
      ctx.strokeStyle = "rgba(246, 197, 0,0.78)";
      ctx.lineWidth = 1.2 * dpr;
      rrect(ctx, fx - dpr, fy - dpr, CELL * dpr + 2 * dpr, CELL * dpr + 2 * dpr, 3 * dpr);
      ctx.stroke();
    }

    const current = snakeRef.current;
    const previous = prevRef.current;
    const length = current.length;

    for (let i = length - 1; i >= 1; i--) {
      const cell = current[i];
      const prev = previous[i] ?? cell;
      const pos = interpolateWrapped(prev, cell, cols, t);
      const alpha = 0.86 - (i / Math.max(1, length - 1)) * 0.44;

      drawWrapped(ctx, pos.x, pos.y, cols, dpr, (px, py) => {
        ctx.fillStyle = `rgba(${SNAKE_BODY_RGB},${alpha.toFixed(3)})`;
        rrect(ctx, px, py, CELL * dpr, CELL * dpr, 2.4 * dpr);
        ctx.fill();

        if (i % 2 === 0 && i < length - 1) {
          const inset = 2.2 * dpr;
          ctx.fillStyle = "rgba(0,0,0,0.05)";
          rrect(
            ctx,
            px + inset,
            py + inset,
            CELL * dpr - inset * 2,
            CELL * dpr - inset * 2,
            1.4 * dpr
          );
          ctx.fill();
        }
      });
    }

    if (length > 0) {
      const head = current[0];
      const prev = previous[0] ?? head;
      const pos = interpolateWrapped(prev, head, cols, t);
      drawWrapped(ctx, pos.x, pos.y, cols, dpr, (px, py) => {
        drawHead(ctx, px, py, dirRef.current, dpr);
      });
    }
  }, []);

  const stepSnake = useCallback(() => {
    const grid = gridRef.current;
    const cols = colsRef.current;
    if (!grid || doneRef.current) return false;

    if (!foodRef.current || (grid[foodRef.current.x]?.[foodRef.current.y] ?? 0) === 0) {
      foodRef.current = nearestFood(grid, cols, snakeRef.current[0], snakeRef.current);
    }

    if (!foodRef.current) {
      doneRef.current = true;
      runningRef.current = false;
      setSnakeStats((stats) => ({ ...stats, done: true }));
      return false;
    }

    const newDir = chooseDir(snakeRef.current, foodRef.current, dirRef.current, cols, rngRef.current);
    dirRef.current = newDir;

    const head = snakeRef.current[0];
    const nextHead = nextCell(head, newDir, cols);
    if (!nextHead) return true;

    const nextSnake = [nextHead, ...snakeRef.current];
    const ate = (grid[nextHead.x]?.[nextHead.y] ?? 0) > 0;

    prevRef.current = snakeRef.current.map((segment) => ({ ...segment }));

    if (ate) {
      grid[nextHead.x][nextHead.y] = 0;
      eatenRef.current++;
      foodRef.current = nearestFood(grid, cols, nextHead, nextSnake);
      renderBaseLayer();
    } else {
      nextSnake.pop();
    }

    snakeRef.current = nextSnake;

    const finished = !foodRef.current;
    if (finished) {
      doneRef.current = true;
      runningRef.current = false;
    }

    if (ate || finished) {
      setSnakeStats({
        eaten: eatenRef.current,
        length: nextSnake.length,
        done: finished,
      });
    }

    return !finished;
  }, [nearestFood, renderBaseLayer]);

  const animationLoop = useCallback(
    (now: number) => {
      if (!runningRef.current) {
        drawFrame(1);
        return;
      }

      if (nextStepAtRef.current === 0) {
        nextStepAtRef.current = now + START_DELAY_MS;
        moveStartRef.current = now;
      }

      if (now >= nextStepAtRef.current) {
        const shouldContinue = stepSnake();
        moveStartRef.current = now;
        nextStepAtRef.current = now + TICK_MS;

        if (!shouldContinue) {
          drawFrame(1);
          return;
        }
      }

      drawFrame((now - moveStartRef.current) / TICK_MS);
      rafRef.current = requestAnimationFrame(animationLoop);
    },
    [drawFrame, stepSnake]
  );

  const startAnimation = useCallback(
    (nextCalendar: CalendarData) => {
      stopAnimation();

      const seed =
        nextCalendar.username.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) *
          17 +
        nextCalendar.year;
      const startX = Math.max(0, Math.min(nextCalendar.cols - 1, Math.floor(nextCalendar.cols / 8)));

      gridRef.current = nextCalendar.grid.map((col) => [...col]);
      colsRef.current = nextCalendar.cols;
      snakeRef.current = [{ x: startX, y: 3 }];
      prevRef.current = [{ x: startX, y: 3 }];
      dirRef.current = { x: 1, y: 0 };
      foodRef.current = null;
      eatenRef.current = 0;
      doneRef.current = nextCalendar.activeDays === 0;
      rngRef.current = mulberry32(seed);
      moveStartRef.current = 0;
      nextStepAtRef.current = 0;

      setupCanvas(nextCalendar.cols);
      renderBaseLayer();
      drawFrame(1);
      setSnakeStats({ eaten: 0, length: 1, done: nextCalendar.activeDays === 0 });

      const reducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (nextCalendar.activeDays > 0 && !reducedMotion) {
        runningRef.current = true;
        rafRef.current = requestAnimationFrame(animationLoop);
      }
    },
    [animationLoop, drawFrame, renderBaseLayer, setupCanvas, stopAnimation]
  );

  useEffect(() => {
    const controller = new AbortController();

    stopAnimation();
    setStatus("loading");
    setError(null);

    const params = new URLSearchParams({
      username,
      year: String(selectedYear),
    });

    fetch(`/api/github-contributions?${params.toString()}`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error ?? "Unable to load GitHub contributions.");
        }
        return data as ContributionResponse;
      })
      .then((payload) => {
        if (controller.signal.aborted) return;
        const nextCalendar = buildCalendar(payload);
        setCalendar(nextCalendar);
        setStatus("ready");
        startAnimation(nextCalendar);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        const message = err instanceof Error ? err.message : "Unable to load GitHub contributions.";
        setStatus("error");
        setError(message);
        setSnakeStats({ eaten: 0, length: 1, done: false });
      });

    return () => {
      controller.abort();
      stopAnimation();
    };
  }, [selectedYear, startAnimation, stopAnimation, username]);

  useEffect(() => {
    const handleResize = () => {
      if (!gridRef.current) return;
      setupCanvas(colsRef.current);
      renderBaseLayer();
      drawFrame(1);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawFrame, renderBaseLayer, setupCanvas]);

  const handleYearChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(event.target.value));
  };

  return (
    <section className="ghsc-root" aria-label={`GitHub contribution calendar for ${username}`}>
      <div className="ghsc-topbar">
        <div className="ghsc-title-block">
          <span className="ghsc-kicker">GitHub contributions</span>
          <h2 className="ghsc-title">
            {calendar.totalContributions.toLocaleString()} {contributionWord} in {calendar.year}
          </h2>
        </div>

        <label className="ghsc-year-picker">
          <span>Year</span>
          <select value={selectedYear} onChange={handleYearChange} aria-label="Year">
            {calendar.years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="ghsc-chart">
        <div className="ghsc-graph-scroll" style={graphVars}>
          <div className="ghsc-graph-layout">
            <div className="ghsc-months" aria-hidden>
              {calendar.monthLabels.map((month) => (
                <span
                  className="ghsc-month"
                  key={month.label}
                  style={{ left: `${(month.week * STEP * 100) / calendar.width}%` }}
                >
                  {month.label}
                </span>
              ))}
            </div>

            <div className="ghsc-weekdays" aria-hidden>
              {WEEKDAY_LABELS.map((day) => (
                <span
                  className="ghsc-weekday"
                  key={day.label}
                  style={{ top: `${day.row * STEP}px` }}
                >
                  {day.label}
                </span>
              ))}
            </div>

            <div className="ghsc-canvas-frame">
              {status === "loading" && (
                <div className="ghsc-overlay">
                  <span className="ghsc-spinner" aria-hidden />
                  <span>Loading contributions...</span>
                </div>
              )}

              {status === "error" && (
                <div className="ghsc-overlay ghsc-overlay-error" role="alert">
                  <strong>Could not load contribution data.</strong>
                  <span>{error}</span>
                </div>
              )}

              {status === "ready" && calendar.activeDays === 0 && (
                <div className="ghsc-overlay ghsc-overlay-note">
                  <span>No visible contributions in {calendar.year}.</span>
                </div>
              )}

              {status === "ready" && snakeStats.done && calendar.activeDays > 0 && (
                <div className="ghsc-overlay ghsc-overlay-note">
                  <span>The snake finished this year.</span>
                </div>
              )}

              <canvas
                ref={canvasRef}
                className="ghsc-canvas"
                aria-hidden
                style={{ opacity: status === "ready" ? 1 : 0.22 }}
              />
            </div>
          </div>
        </div>

        <div className="ghsc-chart-footer">
          <a
            href="https://docs.github.com/en/account-and-profile/reference/profile-contributions-reference"
            target="_blank"
            rel="noreferrer"
          >
            How GitHub counts this graph
          </a>

          <div className="ghsc-legend" aria-label="Contribution intensity legend">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <span
                aria-hidden
                className="ghsc-legend-cell"
                key={level}
                style={{ backgroundColor: CONTRIBUTION_COLORS[level as ContributionLevel] }}
              />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>

      <style>{`
        .ghsc-root {
          display: flex;
          flex-direction: column;
          gap: 0.82rem;
          border: 1px solid rgba(218, 2, 14, 0.18);
          border-radius: 8px;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(255, 243, 239, 0.94)),
            linear-gradient(115deg, rgba(218, 2, 14, 0.08), transparent 48%, rgba(246, 197, 0, 0.14));
          box-shadow: 0 18px 38px rgba(91, 14, 19, 0.1);
          color: #171111;
          overflow: hidden;
          padding: 0.95rem;
        }

        .ghsc-topbar {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
        }

        .ghsc-title-block {
          display: flex;
          min-width: 0;
          flex-direction: column;
          gap: 0.18rem;
        }

        .ghsc-kicker {
          color: rgba(91, 38, 42, 0.64);
          font-family: var(--mono, monospace);
          font-size: 0.62rem;
          letter-spacing: 0.12em;
          line-height: 1;
          text-transform: uppercase;
        }

        .ghsc-title {
          margin: 0;
          color: #171111;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0;
          line-height: 1.35;
        }

        .ghsc-year-picker {
          display: flex;
          align-items: center;
          gap: 0.48rem;
          color: rgba(91, 38, 42, 0.68);
          font-family: var(--mono, monospace);
          font-size: 0.68rem;
          line-height: 1;
          white-space: nowrap;
        }

        .ghsc-year-picker select {
          min-width: 86px;
          border: 1px solid rgba(218, 2, 14, 0.18);
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.84);
          color: #171111;
          cursor: pointer;
          font: inherit;
          line-height: 1.2;
          padding: 0.35rem 0.58rem;
        }

        .ghsc-chart {
          border: 1px solid rgba(218, 2, 14, 0.15);
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.76);
          padding: 0.9rem 0.95rem 0.78rem;
        }

        .ghsc-graph-scroll {
          max-width: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          padding-bottom: 0.24rem;
          scrollbar-width: thin;
        }

        .ghsc-graph-layout {
          display: grid;
          grid-template-columns: 34px var(--ghsc-graph-width);
          grid-template-rows: 18px var(--ghsc-graph-height);
          width: max-content;
        }

        .ghsc-months {
          position: relative;
          grid-column: 2;
          grid-row: 1;
          height: 18px;
        }

        .ghsc-month {
          position: absolute;
          top: 0;
          color: rgba(91, 38, 42, 0.62);
          font-size: 0.67rem;
          line-height: 1;
          transform: translateX(0);
          white-space: nowrap;
        }

        .ghsc-weekdays {
          position: relative;
          grid-column: 1;
          grid-row: 2;
          height: var(--ghsc-graph-height);
        }

        .ghsc-weekday {
          position: absolute;
          right: 8px;
          color: rgba(91, 38, 42, 0.62);
          font-size: 0.67rem;
          line-height: 10px;
        }

        .ghsc-canvas-frame {
          position: relative;
          grid-column: 2;
          grid-row: 2;
          width: var(--ghsc-graph-width);
          height: var(--ghsc-graph-height);
        }

        .ghsc-canvas {
          display: block;
          width: var(--ghsc-graph-width);
          height: var(--ghsc-graph-height);
          transition: opacity 0.22s ease;
        }

        .ghsc-overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          border-radius: 6px;
          background: rgba(255, 248, 246, 0.92);
          color: rgba(91, 38, 42, 0.72);
          font-family: var(--mono, monospace);
          font-size: 0.66rem;
          text-align: center;
        }

        .ghsc-overlay-error {
          flex-direction: column;
          padding: 0.85rem;
          color: #da020e;
        }

        .ghsc-overlay-error span {
          color: rgba(91, 38, 42, 0.7);
          font-family: inherit;
          font-size: 0.62rem;
          line-height: 1.45;
          max-width: 34rem;
        }

        .ghsc-overlay-note {
          background: rgba(255, 255, 255, 0.86);
          color: rgba(91, 38, 42, 0.68);
        }

        .ghsc-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(218, 2, 14, 0.16);
          border-top-color: #da020e;
          border-radius: 50%;
          animation: ghscSpin 0.8s linear infinite;
          flex: 0 0 auto;
        }

        @keyframes ghscSpin {
          to { transform: rotate(360deg); }
        }

        .ghsc-chart-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          min-width: calc(var(--ghsc-graph-width) + 34px);
          padding: 0.54rem 0 0 34px;
        }

        .ghsc-chart-footer a {
          color: rgba(91, 38, 42, 0.68);
          font-size: 0.68rem;
          text-decoration: none;
        }

        .ghsc-chart-footer a:hover {
          color: #da020e;
          text-decoration: underline;
        }

        .ghsc-legend {
          display: inline-flex;
          align-items: center;
          gap: 0.28rem;
          color: rgba(91, 38, 42, 0.68);
          font-size: 0.66rem;
          white-space: nowrap;
        }

        .ghsc-legend-cell {
          width: 10px;
          height: 10px;
          border-radius: 2px;
          box-shadow: inset 0 0 0 1px rgba(27, 31, 36, 0.06);
        }

        @media (max-width: 720px) {
          .ghsc-root {
            padding: 0.78rem;
          }

          .ghsc-topbar {
            align-items: stretch;
            flex-direction: column;
            gap: 0.7rem;
          }

          .ghsc-year-picker {
            justify-content: space-between;
          }

          .ghsc-chart {
            padding: 0.74rem;
          }

          .ghsc-chart-footer {
            align-items: flex-start;
            flex-direction: column;
            min-width: calc(var(--ghsc-graph-width) + 34px);
          }

        }

        @media (prefers-reduced-motion: reduce) {
          .ghsc-spinner {
            animation: none;
          }

          .ghsc-canvas {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}
