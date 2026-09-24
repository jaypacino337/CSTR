import {keys, inOut} from '../../theme';

export const G = '#39FF4A';
export const G_SOFT = '#9DFFA6';
export const G_DIM = 'rgba(57,255,74,0.35)';
export const RED = '#FF5A5A';
export const INK = '#030504';
export const SOFT = 'rgba(236,255,238,0.6)';
export const HAIR = 'rgba(160,255,170,0.12)';

// Ladder: $0.25 ranges, highest on top.
export const TOP_LOW = 676.5;
export const ROWS = 9;
export const WIN_ROW = 4; // 675.50 – 675.75
export const lowOf = (i: number) => TOP_LOW - i * 0.25;
export const CLOSE = 675.62;

// SPY across the game (frames local to the Game scene)
export const LOCK_F = 250;
export const CLOSE_F = 440;
export const spyAt = (f: number) => {
  const base = keys(f, [0, 200, 330, 372, 408, CLOSE_F], [675.12, 675.31, 675.27, 675.86, 675.49, CLOSE], inOut);
  const damp = Math.max(0, 1 - f / CLOSE_F);
  return base + (Math.sin(f / 5.3) * 0.035 + Math.sin(f / 2.1) * 0.015) * damp;
};
