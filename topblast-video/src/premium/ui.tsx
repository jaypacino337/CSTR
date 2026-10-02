import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {C, DISPLAY, UI, expoOut, prog} from '../theme';

export const INK = '#060607';
export const HAIR = 'rgba(255,255,255,0.08)';
export const SOFT = 'rgba(247,244,238,0.6)';

type Seg = {text: string; color?: string; gradient?: string};

/**
 * Word-by-word fade: each word rises a few pixels out of a light blur.
 * Deliberately restrained — reads like a product film, not a trailer.
 */
export const FadeWords: React.FC<{
  segments: Seg[] | string;
  start: number;
  size: number;
  dur?: number;
  stagger?: number;
  font?: string;
  weight?: number;
  stretch?: number;
  tracking?: number;
  exitAt?: number;
  exitDur?: number;
  align?: 'center' | 'left';
  style?: React.CSSProperties;
}> = ({segments, start, size, dur = 22, stagger = 4, font = UI, weight = 700, stretch = 100, tracking = 0, exitAt, exitDur = 14, align = 'center', style}) => {
  const f = useCurrentFrame();
  const segs: Seg[] = typeof segments === 'string' ? [{text: segments}] : segments;
  const out = exitAt === undefined ? 0 : prog(f, exitAt, exitDur);
  let w = 0;
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'nowrap',
        justifyContent: align === 'center' ? 'center' : 'flex-start',
        fontFamily: font,
        fontWeight: weight,
        fontStretch: `${stretch}%`,
        fontSize: size,
        letterSpacing: `${tracking}em`,
        lineHeight: 1.05,
        whiteSpace: 'pre',
        opacity: 1 - out,
        filter: out > 0 ? `blur(${out * 6}px)` : undefined,
        ...style,
      }}
    >
      {segs.map((s, si) =>
        s.text.split(/(\s+)/).map((word, wi) => {
          if (/^\s+$/.test(word)) return <span key={`${si}-${wi}`}>{word}</span>;
          const p = prog(f, start + w++ * stagger, dur, expoOut);
          return (
            <span
              key={`${si}-${wi}`}
              style={{
                display: 'inline-block',
                color: s.gradient ? 'transparent' : s.color,
                backgroundImage: s.gradient,
                WebkitBackgroundClip: s.gradient ? 'text' : undefined,
                backgroundClip: s.gradient ? 'text' : undefined,
                opacity: p,
                transform: `translateY(${(1 - p) * size * 0.22}px)`,
                filter: p < 1 ? `blur(${(1 - p) * 6}px)` : undefined,
              }}
            >
              {word}
            </span>
          );
        }),
      )}
    </div>
  );
};

/** Opacity envelope for a scene inside an overlapping Sequence. */
export const Fade: React.FC<{dur: number; inDur?: number; outDur?: number; children: React.ReactNode}> = ({dur, inDur = 10, outDur = 12, children}) => {
  const f = useCurrentFrame();
  const o = Math.min(prog(f, 0, inDur), 1 - prog(f, dur - outDur, outDur));
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

/**
 * The Blast Zone as a place: everything beneath the entry line is a lit
 * volume with a receding grid and slow data motes. Driven by a GLOBAL frame
 * `g` so consecutive scenes can hand it off without any visible jump.
 */
export const ZoneField: React.FC<{g: number; reveal: number; lineY: number}> = ({g, reveal, lineY}) => {
  if (reveal <= 0.001) return null;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: lineY,
          bottom: 0,
          opacity: reveal,
          background: 'linear-gradient(180deg, rgba(255,106,0,0.26) 0%, rgba(255,64,20,0.13) 28%, rgba(110,18,0,0.10) 65%, rgba(0,0,0,0) 100%)',
        }}
      />
      <div style={{position: 'absolute', left: 0, right: 0, top: lineY, bottom: 0, overflow: 'hidden', perspective: 700, perspectiveOrigin: '50% 0px', opacity: reveal * 0.55}}>
        <div
          style={{
            position: 'absolute',
            left: '-60%',
            width: '220%',
            top: 0,
            height: 1800,
            transformOrigin: 'top center',
            transform: 'rotateX(74deg)',
            backgroundImage: 'linear-gradient(rgba(255,138,31,0.28) 1px, transparent 1px), linear-gradient(90deg, rgba(255,138,31,0.22) 1px, transparent 1px)',
            backgroundSize: '96px 96px',
            backgroundPosition: `0px ${(g * 0.5) % 96}px`,
            maskImage: 'linear-gradient(to bottom, black 0%, black 30%, transparent 85%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 30%, transparent 85%)',
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          left: '10%',
          right: '10%',
          top: lineY - 90,
          height: 260,
          opacity: reveal * 0.9,
          background: 'radial-gradient(ellipse 50% 45% at 50% 35%, rgba(255,110,20,0.30), transparent 70%)',
        }}
      />
      {new Array(46).fill(0).map((_, i) => {
        const x = random(`zx${i}`) * 1920;
        const span = 1080 - lineY + 40;
        const v = 0.35 + random(`zv${i}`) * 0.7;
        const y = 1080 - ((random(`zy${i}`) * span + g * v) % span);
        const near = Math.max(0, Math.min(1, (y - lineY) / 120));
        const dash = random(`zd${i}`) > 0.6;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: dash ? 10 : 2.5,
              height: 2.5,
              background: i % 4 ? '#FFB27A' : '#FFE3CC',
              opacity: reveal * near * (0.25 + random(`zo${i}`) * 0.5),
            }}
          />
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: lineY - 0.75,
          height: 1.5,
          opacity: reveal,
          background: `linear-gradient(90deg, transparent, ${C.orangeHot} 12%, #FFE0C2 50%, ${C.orangeHot} 88%, transparent)`,
          boxShadow: '0 0 14px rgba(255,106,0,0.75)',
        }}
      />
    </AbsoluteFill>
  );
};

export const Mono: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{fontFamily: '"JetBrains Mono", monospace', fontSize: 15, letterSpacing: '0.22em', color: SOFT, ...style}}>{children}</div>
);

export {DISPLAY};
