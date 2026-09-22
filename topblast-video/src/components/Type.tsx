import {useCurrentFrame} from 'remotion';
import {DISPLAY, expoOut, prog} from '../theme';

type Seg = {text: string; color?: string; gradient?: string};

/**
 * Per-character kinetic reveal: each glyph rises out of a blur with a stagger.
 * `segments` lets one line mix colours (e.g. TOP white / BLAST orange).
 */
export const KineticLine: React.FC<{
  segments: Seg[] | string;
  start: number;
  size: number;
  stagger?: number;
  dur?: number;
  weight?: number;
  stretch?: number;
  tracking?: number;
  exitAt?: number;
  exitDur?: number;
  font?: string;
  style?: React.CSSProperties;
  rise?: number;
}> = ({
  segments,
  start,
  size,
  stagger = 1.2,
  dur = 22,
  weight = 900,
  stretch = 125,
  tracking = 0.02,
  exitAt,
  exitDur = 12,
  font = DISPLAY,
  style,
  rise = 0.55,
}) => {
  const frame = useCurrentFrame();
  const segs: Seg[] = typeof segments === 'string' ? [{text: segments}] : segments;
  let idx = 0;
  const exit = exitAt === undefined ? 0 : prog(frame, exitAt, exitDur);
  return (
    <div
      style={{
        fontFamily: font,
        fontWeight: weight,
        fontStretch: `${stretch}%`,
        fontSize: size,
        letterSpacing: `${tracking}em`,
        lineHeight: 1,
        whiteSpace: 'pre',
        display: 'flex',
        justifyContent: 'center',
        ...style,
      }}
    >
      {segs.map((s, si) => (
        <span key={si} style={{display: 'inline-flex'}}>
          {s.text.split('').map((ch, ci) => {
            const i = idx++;
            const p = prog(frame, start + i * stagger, dur, expoOut);
            const e = exit;
            return (
              <span
                key={ci}
                style={{
                  display: 'inline-block',
                  color: s.gradient ? 'transparent' : s.color,
                  backgroundImage: s.gradient,
                  WebkitBackgroundClip: s.gradient ? 'text' : undefined,
                  backgroundClip: s.gradient ? 'text' : undefined,
                  opacity: p * (1 - e),
                  transform: `translateY(${(1 - p) * rise * size - e * 0.3 * size}px) scale(${0.9 + 0.1 * p})`,
                  filter: `blur(${(1 - p) * 14 + e * 10}px)`,
                }}
              >
                {ch === ' ' ? ' ' : ch}
              </span>
            );
          })}
        </span>
      ))}
    </div>
  );
};

/** Horizontal wipe reveal for a block (masked). */
export const Wipe: React.FC<{p: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  p,
  children,
  style,
}) => (
  <div
    style={{
      clipPath: `inset(-20% ${(1 - p) * 100}% -20% 0)`,
      ...style,
    }}
  >
    {children}
  </div>
);
