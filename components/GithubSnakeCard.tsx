"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
type Cell = { x: number; y: number };
type ContribLevel = 0 | 1 | 2 | 3 | 4;
type ContribWeek = { contributionDays: { contributionCount: number; contributionLevel: string; date: string }[] };

// ── Constants ──────────────────────────────────────────────────────────────
const COLS = 53;
const ROWS = 7;
const CELL = 9;
const GAP = 2;
const STEP = 11; // CELL + GAP
const TICK_MS = 90;
const CANVAS_W = COLS * STEP - GAP;
const CANVAS_H = ROWS * STEP - GAP;

// Color palette — Nokia-green retro theme
const BG_COLOR = "#0a1a0a";
const GRID_EMPTY = "#1a2f1a";
const CONTRIB_COLORS: Record<ContribLevel, string> = {
    0: "#1a2f1a",
    1: "#1e6b1e",
    2: "#2d9b2d",
    3: "#3fbf3f",
    4: "#5eea5e",
};
const SNAKE_HEAD = "#c8ff00";
const SNAKE_BODY = "#90d400";
const SNAKE_TAIL = "#5c8800";
const EAT_FLASH = "#ffffff";
const SCORE_COLOR = "#5eea5e";

// ── Contribution fetch ─────────────────────────────────────────────────────
async function fetchContributions(username: string): Promise<ContribLevel[][]> {
    try {
        const res = await fetch(
            `https://github-contributions-api.jogruber.de/v4/${username}?y=last`
        );
        if (!res.ok) throw new Error();
        const data: { weeks: ContribWeek[] } = await res.json();
        const grid: ContribLevel[][] = Array.from({ length: COLS }, () =>
            Array(ROWS).fill(0 as ContribLevel)
        );
        data.weeks.forEach((week, col) => {
            week.contributionDays.forEach((day, row) => {
                const lvl = Math.min(
                    4,
                    day.contributionCount === 0 ? 0 :
                        day.contributionCount <= 2 ? 1 :
                            day.contributionCount <= 5 ? 2 :
                                day.contributionCount <= 10 ? 3 : 4
                ) as ContribLevel;
                if (col < COLS && row < ROWS) grid[col][row] = lvl;
            });
        });
        return grid;
    } catch {
        // fallback — random seeded grid
        return Array.from({ length: COLS }, (_, c) =>
            Array.from({ length: ROWS }, (_, r) => {
                const seed = (c * 7 + r * 13 + c * r) % 17;
                return (seed < 5 ? 0 : seed < 9 ? 1 : seed < 13 ? 2 : seed < 16 ? 3 : 4) as ContribLevel;
            })
        );
    }
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function GitHubSnakeCard({ username = "gunawan1608" }: { username?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gridRef = useRef<ContribLevel[][] | null>(null);
    const snakeRef = useRef<Cell[]>([{ x: 2, y: 3 }]);
    const dirRef = useRef<Cell>({ x: 1, y: 0 });
    const nextDirRef = useRef<Cell>({ x: 1, y: 0 });
    const foodRef = useRef<Cell | null>(null);
    const scoreRef = useRef(0);
    const ateRef = useRef<Cell | null>(null);
    const ateTimerRef = useRef(0);
    const tickRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [score, setScore] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const [totalContribs, setTotalContribs] = useState(0);

    // Find a food cell that has contribution > 0
    const spawnFood = useCallback((grid: ContribLevel[][], snake: Cell[]) => {
        const occupied = new Set(snake.map(c => `${c.x},${c.y}`));
        const candidates: Cell[] = [];
        for (let x = 0; x < COLS; x++) {
            for (let y = 0; y < ROWS; y++) {
                if (grid[x][y] > 0 && !occupied.has(`${x},${y}`)) {
                    candidates.push({ x, y });
                }
            }
        }
        if (candidates.length === 0) return null;
        return candidates[Math.floor(Math.random() * candidates.length)];
    }, []);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        const grid = gridRef.current;
        if (!canvas || !grid) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const snake = snakeRef.current;
        const food = foodRef.current;
        const ate = ateRef.current;

        ctx.fillStyle = BG_COLOR;
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        // Draw contribution grid
        for (let x = 0; x < COLS; x++) {
            for (let y = 0; y < ROWS; y++) {
                const lvl = grid[x][y];
                ctx.fillStyle = CONTRIB_COLORS[lvl];
                const px = x * STEP;
                const py = y * STEP;
                ctx.beginPath();
                ctx.roundRect(px, py, CELL, CELL, 2);
                ctx.fill();
            }
        }

        // Draw food (pulsing eaten cell)
        if (food) {
            const isAte = ate && ate.x === food.x && ate.y === food.y;
            ctx.fillStyle = isAte ? EAT_FLASH : "#ffcc00";
            ctx.shadowColor = isAte ? "#ffffff" : "#ffaa00";
            ctx.shadowBlur = isAte ? 12 : 8;
            ctx.beginPath();
            ctx.roundRect(food.x * STEP, food.y * STEP, CELL, CELL, 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        // Draw snake
        snake.forEach((seg, i) => {
            const isHead = i === 0;
            const progress = i / snake.length;
            let color = SNAKE_BODY;
            if (isHead) color = SNAKE_HEAD;
            else if (progress > 0.75) color = SNAKE_TAIL;

            ctx.fillStyle = color;
            if (isHead) {
                ctx.shadowColor = SNAKE_HEAD;
                ctx.shadowBlur = 6;
            }
            ctx.beginPath();
            ctx.roundRect(seg.x * STEP, seg.y * STEP, CELL, CELL, isHead ? 3 : 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Head eyes
            if (isHead) {
                const dir = dirRef.current;
                ctx.fillStyle = BG_COLOR;
                const ex = seg.x * STEP + (dir.x === 1 ? 6 : dir.x === -1 ? 2 : 3);
                const ey1 = seg.y * STEP + (dir.y === 1 ? 6 : dir.y === -1 ? 2 : 2);
                const ey2 = seg.y * STEP + (dir.y === 1 ? 6 : dir.y === -1 ? 2 : 6);
                ctx.beginPath();
                ctx.arc(ex, ey1, 1.2, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(ex, ey2, 1.2, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }, []);

    const tick = useCallback(() => {
        const grid = gridRef.current;
        if (!grid) return;

        const snake = [...snakeRef.current];
        const dir = nextDirRef.current;
        dirRef.current = dir;

        const head = snake[0];
        let nx = head.x + dir.x;
        let ny = head.y + dir.y;

        // Wrap around edges
        if (nx < 0) nx = COLS - 1;
        if (nx >= COLS) nx = 0;
        if (ny < 0) ny = ROWS - 1;
        if (ny >= ROWS) ny = 0;

        // Self-collision — reset snake (not game over, just restart snake)
        const selfHit = snake.slice(1).some(s => s.x === nx && s.y === ny);
        if (selfHit) {
            snakeRef.current = [{ x: 2, y: 3 }];
            nextDirRef.current = { x: 1, y: 0 };
            dirRef.current = { x: 1, y: 0 };
            foodRef.current = spawnFood(grid, snakeRef.current);
            draw();
            tickRef.current = setTimeout(tick, TICK_MS);
            return;
        }

        const newHead = { x: nx, y: ny };
        snake.unshift(newHead);

        const food = foodRef.current;
        let ate = false;
        if (food && food.x === nx && food.y === ny) {
            // Eat: erase contribution, grow snake, spawn new food
            grid[nx][ny] = 0;
            scoreRef.current += 1;
            setScore(scoreRef.current);
            ateRef.current = { x: nx, y: ny };
            ateTimerRef.current = 3;
            ate = true;
            foodRef.current = spawnFood(grid, snake);
        } else {
            snake.pop();
        }

        if (ateTimerRef.current > 0) {
            ateTimerRef.current--;
            if (ateTimerRef.current === 0) ateRef.current = null;
        }

        snakeRef.current = snake;
        draw();
        tickRef.current = setTimeout(tick, ate ? TICK_MS * 0.6 : TICK_MS);
    }, [draw, spawnFood]);

    // Load contributions & start game
    useEffect(() => {
        fetchContributions(username).then(grid => {
            gridRef.current = grid;
            // Count total contributions
            let total = 0;
            grid.forEach(col => col.forEach(lvl => { if (lvl > 0) total++ }));
            setTotalContribs(total);
            foodRef.current = spawnFood(grid, snakeRef.current);
            draw();
            setLoaded(true);
            tickRef.current = setTimeout(tick, TICK_MS * 3);
        });
        return () => { if (tickRef.current) clearTimeout(tickRef.current); };
    }, [username, spawnFood, draw, tick]);

    // Keyboard / arrow key controls
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const dir = dirRef.current;
            if (e.key === "ArrowUp" && dir.y !== 1) nextDirRef.current = { x: 0, y: -1 };
            if (e.key === "ArrowDown" && dir.y !== -1) nextDirRef.current = { x: 0, y: 1 };
            if (e.key === "ArrowLeft" && dir.x !== 1) nextDirRef.current = { x: -1, y: 0 };
            if (e.key === "ArrowRight" && dir.x !== -1) nextDirRef.current = { x: 1, y: 0 };
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    return (
        <div className="gh-snake-card">
            {/* Header */}
            <div className="gh-snake-header">
                <div className="gh-snake-header-left">
                    <span className="gh-snake-pixel-dot" />
                    <span className="gh-snake-label">CONTRIBUTION.EXE</span>
                </div>
                <div className="gh-snake-header-right">
                    <span className="gh-snake-score-label">SCORE</span>
                    <span className="gh-snake-score">{String(score).padStart(4, "0")}</span>
                </div>
            </div>

            {/* Canvas */}
            <div className="gh-snake-canvas-wrap">
                {!loaded && (
                    <div className="gh-snake-loading">
                        <span className="gh-snake-loading-text">LOADING...</span>
                    </div>
                )}
                <canvas
                    ref={canvasRef}
                    width={CANVAS_W}
                    height={CANVAS_H}
                    className="gh-snake-canvas"
                    style={{ opacity: loaded ? 1 : 0 }}
                />
                {/* Scanlines overlay */}
                <div className="gh-snake-scanlines" aria-hidden />
                {/* Screen glare */}
                <div className="gh-snake-glare" aria-hidden />
            </div>

            {/* Footer stats */}
            <div className="gh-snake-footer">
                <div className="gh-snake-stat">
                    <span className="gh-snake-stat-val">{totalContribs}</span>
                    <span className="gh-snake-stat-lbl">cells left</span>
                </div>
                <div className="gh-snake-divider" />
                <div className="gh-snake-stat">
                    <span className="gh-snake-stat-val">{score}</span>
                    <span className="gh-snake-stat-lbl">eaten</span>
                </div>
                <div className="gh-snake-divider" />
                <div className="gh-snake-stat">
                    <span className="gh-snake-stat-val">
                        <span className="gh-snake-live-dot" />LIVE
                    </span>
                    <span className="gh-snake-stat-lbl">github.com</span>
                </div>
            </div>

            {/* Hint */}
            <p className="gh-snake-hint">↑ ↓ ← → to play · snake eats your contributions</p>
        </div>
    );
}