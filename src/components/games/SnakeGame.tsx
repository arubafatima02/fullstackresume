import { useEffect, useRef, useState, useCallback } from 'react';
import { RotateCcw, Trophy, Pause, Play } from 'lucide-react';

const GRID = 22;
const CELL = 18;
const BOARD_SIZE = GRID * CELL;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);

  const snakeRef = useRef<Point[]>([{ x: 11, y: 11 }]);
  const dirRef = useRef<Point>({ x: 1, y: 0 });
  const nextDirRef = useRef<Point>({ x: 1, y: 0 });
  const foodRef = useRef<Point>({ x: 16, y: 11 });
  const loopRef = useRef<number | null>(null);
  const speedRef = useRef<number>(120);

  const spawnFood = useCallback(() => {
    const snake = snakeRef.current;
    let pos: Point;
    do {
      pos = {
        x: Math.floor(Math.random() * GRID),
        y: Math.floor(Math.random() * GRID),
      };
    } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
    foodRef.current = pos;
  }, []);

  const reset = useCallback(() => {
    snakeRef.current = [{ x: 11, y: 11 }];
    dirRef.current = { x: 1, y: 0 };
    nextDirRef.current = { x: 1, y: 0 };
    speedRef.current = 120;
    spawnFood();
    setScore(0);
    setGameOver(false);
    setPaused(false);
    setRunning(true);
  }, [spawnFood]);

  useEffect(() => {
    try {
      const hs = localStorage.getItem('arb_snake_high');
      if (hs) setHighScore(parseInt(hs, 10));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const getPrimary = () => {
      const c = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
      return c || '#00d4aa';
    };
    const hexToRgb = (hex: string): [number, number, number] => {
      const h = hex.replace('#', '');
      if (h.length === 3) return [parseInt(h[0]+h[0],16), parseInt(h[1]+h[1],16), parseInt(h[2]+h[2],16)];
      return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
    };

    const draw = () => {
      // Background
      ctx.fillStyle = '#08090d';
      ctx.fillRect(0, 0, BOARD_SIZE, BOARD_SIZE);

      // Subtle grid
      ctx.strokeStyle = 'rgba(255,255,255,0.02)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= GRID; i++) {
        ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, BOARD_SIZE); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(BOARD_SIZE, i * CELL); ctx.stroke();
      }

      const primary = getPrimary();
      const [pr, pg, pb] = hexToRgb(primary.startsWith('#') ? primary : '#00d4aa');

      // Food — pulsing glow
      const food = foodRef.current;
      const pulse = Math.sin(Date.now() / 200) * 0.15 + 0.85;
      ctx.fillStyle = `rgba(${pr}, ${pg}, ${pb}, ${pulse})`;
      ctx.shadowBlur = 12;
      ctx.shadowColor = primary;
      ctx.beginPath();
      ctx.arc(food.x * CELL + CELL/2, food.y * CELL + CELL/2, (CELL-4)/2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Snake
      const snake = snakeRef.current;
      snake.forEach((seg, i) => {
        const t = i / Math.max(snake.length, 1);
        const alpha = 1 - t * 0.5;
        if (i === 0) {
          ctx.fillStyle = primary;
          ctx.shadowBlur = 8;
          ctx.shadowColor = primary;
        } else {
          ctx.fillStyle = `rgba(${pr}, ${pg}, ${pb}, ${alpha * 0.8})`;
          ctx.shadowBlur = 0;
        }
        const r = 4;
        const x = seg.x * CELL + 1;
        const y = seg.y * CELL + 1;
        const w = CELL - 2;
        const h = CELL - 2;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.fill();
      });
      ctx.shadowBlur = 0;
    };

    const tick = () => {
      if (paused) return;

      // Apply queued direction
      dirRef.current = nextDirRef.current;

      const snake = snakeRef.current;
      const dir = dirRef.current;
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

      if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID ||
          snake.some((s) => s.x === head.x && s.y === head.y)) {
        setGameOver(true);
        setRunning(false);
        return;
      }

      snake.unshift(head);

      const food = foodRef.current;
      if (head.x === food.x && head.y === food.y) {
        setScore((s) => {
          const ns = s + 10;
          if (ns > highScore) {
            setHighScore(ns);
            try { localStorage.setItem('arb_snake_high', String(ns)); } catch { /* ignore */ }
          }
          return ns;
        });
        // Speed up slightly
        speedRef.current = Math.max(60, speedRef.current - 3);
        if (loopRef.current) {
          clearInterval(loopRef.current);
          loopRef.current = window.setInterval(tick, speedRef.current);
        }
        spawnFood();
      } else {
        snake.pop();
      }

      draw();
    };

    if (running && !gameOver) {
      loopRef.current = window.setInterval(tick, speedRef.current);
    }

    draw();

    return () => {
      if (loopRef.current) clearInterval(loopRef.current);
    };
  }, [running, gameOver, paused, score, highScore, spawnFood]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const dir = dirRef.current;
      if (e.key === 'ArrowUp' && dir.y === 0) nextDirRef.current = { x: 0, y: -1 };
      else if (e.key === 'ArrowDown' && dir.y === 0) nextDirRef.current = { x: 0, y: 1 };
      else if (e.key === 'ArrowLeft' && dir.x === 0) nextDirRef.current = { x: -1, y: 0 };
      else if (e.key === 'ArrowRight' && dir.x === 0) nextDirRef.current = { x: 1, y: 0 };
      else if (e.key === ' ') { setPaused((p) => !p); e.preventDefault(); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const mobileDir = (x: number, y: number) => {
    const dir = dirRef.current;
    if (x === 0 && dir.y !== 0) return;
    if (y === 0 && dir.x !== 0) return;
    nextDirRef.current = { x, y };
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-8 text-sm">
        <div>Score: <span className="accent-text font-bold">{score}</span></div>
        <div>Best: <span className="accent-text font-bold">{highScore}</span></div>
      </div>

      <div className="relative">
        <canvas ref={canvasRef} width={BOARD_SIZE} height={BOARD_SIZE} className="rounded-xl" style={{ border: '1px solid var(--border-color)' }} tabIndex={0} />
        {(!running || gameOver) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl" style={{ background: 'rgba(8,9,13,0.85)', backdropFilter: 'blur(4px)' }}>
            {gameOver && (
              <div className="mb-4 text-center">
                <Trophy className="w-10 h-10 mx-auto mb-2 accent-text" />
                <p className="font-display font-semibold text-lg text-[var(--text-primary)]">Game Over</p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Score: {score}</p>
              </div>
            )}
            <button onClick={reset} className="btn-primary flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              {gameOver ? 'Play Again' : 'Start Game'}
            </button>
          </div>
        )}
        {running && paused && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl" style={{ background: 'rgba(8,9,13,0.75)' }}>
            <Play className="w-8 h-8 mb-2 accent-text" />
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Paused</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {running && !gameOver && (
          <button onClick={() => setPaused(!paused)} className="btn-ghost flex items-center gap-2 text-sm py-1.5 px-3">
            {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            {paused ? 'Resume' : 'Pause'}
          </button>
        )}
      </div>

      {/* Mobile controls */}
      <div className="md:hidden grid grid-cols-3 gap-2 w-48">
        <div></div>
        <button onClick={() => mobileDir(0, -1)} className="btn-ghost py-2">▲</button>
        <div></div>
        <button onClick={() => mobileDir(-1, 0)} className="btn-ghost py-2">◀</button>
        <button onClick={() => mobileDir(0, 1)} className="btn-ghost py-2">▼</button>
        <button onClick={() => mobileDir(1, 0)} className="btn-ghost py-2">▶</button>
      </div>

      <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
        Arrow keys to move. Spacebar to pause. Eat the glowing orbs to grow.
      </p>
    </div>
  );
}
