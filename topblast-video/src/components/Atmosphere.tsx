import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../theme';

/** Rising dust / ember particles. Deterministic per seed. */
export const Particles: React.FC<{
  count?: number;
  seed?: string;
  color?: string;
  speed?: number;
  opacity?: number;
  maxSize?: number;
}> = ({count = 140, seed = 'p', color = C.orangeHot, speed = 1, opacity = 1, maxSize = 3.2}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  return (
    <svg width={width} height={height} style={{position: 'absolute', inset: 0, opacity}}>
      {new Array(count).fill(0).map((_, i) => {
        const x0 = random(`${seed}x${i}`) * width;
        const v = (0.6 + random(`${seed}v${i}`) * 2.4) * speed;
        const r = 0.6 + random(`${seed}r${i}`) * maxSize;
        const depth = random(`${seed}d${i}`);
        const y = (((random(`${seed}y${i}`) * (height + 200) - frame * v * (0.6 + depth)) % (height + 200)) + height + 200) % (height + 200) - 100;
        const sway = Math.sin(frame / (30 + depth * 40) + i) * 18 * depth;
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(frame / (9 + depth * 12) + i * 1.7));
        return (
          <circle
            key={i}
            cx={x0 + sway}
            cy={y}
            r={r * (0.5 + depth)}
            fill={color}
            opacity={tw * (0.25 + depth * 0.75)}
            style={{filter: depth > 0.8 ? 'blur(1.5px)' : undefined}}
          />
        );
      })}
    </svg>
  );
};

/** Perspective grid floor that streams toward camera. */
export const GridFloor: React.FC<{
  color?: string;
  speed?: number;
  opacity?: number;
  horizon?: number;
}> = ({color = 'rgba(255,106,0,0.35)', speed = 6, opacity = 1, horizon = 600}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{perspective: 900, perspectiveOrigin: `50% ${horizon - 250}px`, opacity}}>
      <div
        style={{
          position: 'absolute',
          left: '-100%',
          width: '300%',
          top: horizon,
          height: 2400,
          transformOrigin: 'top center',
          transform: 'rotateX(78deg)',
          backgroundImage: `linear-gradient(${color} 2px, transparent 2px), linear-gradient(90deg, ${color} 2px, transparent 2px)`,
          backgroundSize: '120px 120px',
          backgroundPosition: `0px ${(frame * speed) % 120}px`,
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 60%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 70%, transparent 100%)',
        }}
      />
    </AbsoluteFill>
  );
};

/** Film grain + vignette to make everything feel shot, not generated. */
export const FilmFinish: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse 75% 70% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 85%, rgba(0,0,0,0.9) 100%)',
        }}
      />
      <svg width={width} height={height} style={{position: 'absolute', inset: 0, opacity: 0.07, mixBlendMode: 'screen'}}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={frame % 24} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

/** Soft coloured light blob. */
export const Glow: React.FC<{
  x: number;
  y: number;
  size: number;
  color: string;
  opacity?: number;
}> = ({x, y, size, color, opacity = 1}) => (
  <div
    style={{
      position: 'absolute',
      left: x - size / 2,
      top: y - size / 2,
      width: size,
      height: size,
      borderRadius: '50%',
      background: `radial-gradient(circle, ${color} 0%, transparent 65%)`,
      opacity,
      mixBlendMode: 'screen',
    }}
  />
);

/** Full-frame additive flash. */
export const Flash: React.FC<{amount: number; color?: string}> = ({amount, color = '#FFE6C7'}) =>
  amount <= 0.001 ? null : (
    <AbsoluteFill style={{background: color, opacity: amount, mixBlendMode: 'screen', pointerEvents: 'none'}} />
  );

/** Expanding ring shockwave. */
export const Shockwave: React.FC<{
  x: number;
  y: number;
  t: number; // 0..1
  maxR?: number;
  color?: string;
  width?: number;
}> = ({x, y, t, maxR = 1400, color = C.orangeHot, width = 6}) => {
  if (t <= 0 || t >= 1) return null;
  const r = maxR * (1 - Math.pow(1 - t, 3));
  return (
    <div
      style={{
        position: 'absolute',
        left: x - r,
        top: y - r,
        width: r * 2,
        height: r * 2,
        borderRadius: '50%',
        border: `${width * (1 - t) + 1}px solid ${color}`,
        boxShadow: `0 0 ${60 * (1 - t)}px ${color}, inset 0 0 ${60 * (1 - t)}px ${color}`,
        opacity: (1 - t) * 0.9,
        mixBlendMode: 'screen',
      }}
    />
  );
};
