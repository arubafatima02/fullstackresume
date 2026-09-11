const COLOR_MAP: Record<string, string> = {
  red: '#ff4757',
  blue: '#3b82f6',
  'sky blue': '#38bdf8',
  skyblue: '#38bdf8',
  green: '#00d4aa',
  grey: '#9ca3af',
  gray: '#9ca3af',
  orange: '#fb923c',
  yellow: '#facc15',
  pink: '#ec4899',
  cyan: '#22d3ee',
  magenta: '#e879f9',
  white: '#f8fafc',
  gold: '#f59e0b',
  lime: '#84cc16',
  teal: '#14b8a6',
  navy: '#1e3a8a',
  crimson: '#dc143c',
  emerald: '#10b981',
  amber: '#f59e0b',
  azure: '#0ea5e9',
  mint: '#34d399',
};

export function resolveColor(input: string): string | null {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return null;

  if (COLOR_MAP[trimmed]) return COLOR_MAP[trimmed];
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(trimmed)) return trimmed;
  if (/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+/i.test(trimmed)) return trimmed;

  try {
    const ctx = document.createElement('canvas').getContext('2d');
    if (ctx) {
      ctx.fillStyle = trimmed;
      const resolved = ctx.fillStyle;
      if (resolved && resolved !== '#000000' && resolved !== 'rgba(0, 0, 0, 0)') return resolved;
      if (trimmed === 'black') return '#000000';
    }
  } catch {
    // ignore
  }

  return null;
}

export function hexToRgba(hex: string, alpha: number): string {
  let r = 0, g = 0, b = 0;
  if (hex.startsWith('#')) {
    const h = hex.slice(1);
    if (h.length === 3) {
      r = parseInt(h[0] + h[0], 16);
      g = parseInt(h[1] + h[1], 16);
      b = parseInt(h[2] + h[2], 16);
    } else if (h.length === 6) {
      r = parseInt(h.slice(0, 2), 16);
      g = parseInt(h.slice(2, 4), 16);
      b = parseInt(h.slice(4, 6), 16);
    }
  } else if (hex.startsWith('rgb')) {
    const match = hex.match(/\d+/g);
    if (match && match.length >= 3) {
      r = parseInt(match[0]);
      g = parseInt(match[1]);
      b = parseInt(match[2]);
    }
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  let r = 0, g = 0, b = 0;
  const h = hex.slice(1);
  if (h.length === 3) {
    r = parseInt(h[0] + h[0], 16) / 255;
    g = parseInt(h[1] + h[1], 16) / 255;
    b = parseInt(h[2] + h[2], 16) / 255;
  } else {
    r = parseInt(h.slice(0, 2), 16) / 255;
    g = parseInt(h.slice(2, 4), 16) / 255;
    b = parseInt(h.slice(4, 6), 16) / 255;
  }
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let hue = 0, sat = 0;
  const light = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    sat = light > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: hue = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: hue = ((b - r) / d + 2) / 6; break;
      case b: hue = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: hue * 360, s: sat * 100, l: light * 100 };
}

export function applyThemeColor(color: string): void {
  const root = document.documentElement;
  const { h, s, l } = hexToHsl(color);
  // Derive a dimmer version for borders/subtle elements
  const dimColor = `hsl(${h}, ${Math.min(s, 60)}%, ${Math.max(l - 15, 20)}%)`;

  root.style.setProperty('--primary-color', color);
  root.style.setProperty('--accent-color', color);
  root.style.setProperty('--primary-dim', dimColor);
  root.style.setProperty('--glow-effect', `0 0 12px ${hexToRgba(color, 0.25)}`);
  root.style.setProperty('--glow-strong', `0 0 24px ${hexToRgba(color, 0.4)}`);
  root.style.setProperty('--border-active', hexToRgba(color, 0.3));
}

export const PRESET_COLORS = [
  { name: 'Teal', value: '#00d4aa' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Cyan', value: '#22d3ee' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Sky', value: '#0ea5e9' },
];
