import {Img, staticFile} from 'remotion';
import {C} from '../theme';

/**
 * The supplied TopBlast mark. The black "T" body is near-black, so on dark
 * backgrounds it gets a rim light via stacked drop-shadows to keep the
 * silhouette readable (matches the key art treatment).
 */
export const Logo: React.FC<{size: number; glow?: number; style?: React.CSSProperties}> = ({
  size,
  glow = 1,
  style,
}) => (
  <div style={{width: size, height: size, position: 'relative', ...style}}>
    <Img
      src={staticFile('logo.png')}
      style={{
        width: '100%',
        height: '100%',
        filter: [
          `drop-shadow(0 0 ${1.5}px rgba(255,190,140,${0.9 * glow}))`,
          `drop-shadow(0 0 ${size * 0.03}px rgba(255,106,0,${0.85 * glow}))`,
          `drop-shadow(0 0 ${size * 0.12}px rgba(255,80,0,${0.55 * glow}))`,
        ].join(' '),
      }}
    />
  </div>
);

/** Just the orange arrow from the mark, as vector, for the launch moments. */
export const Arrow: React.FC<{width: number; color?: string}> = ({width, color = C.orange}) => (
  <svg width={width} height={width * 1.55} viewBox="0 0 200 310">
    <defs>
      <linearGradient id="arrowG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FF8A1F" />
        <stop offset="1" stopColor={color} />
      </linearGradient>
    </defs>
    <path d="M100 0 L200 118 L150 118 L140 310 L60 310 L50 118 L0 118 Z" fill="url(#arrowG)" />
  </svg>
);
