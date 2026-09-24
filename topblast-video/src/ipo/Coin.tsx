import {DISPLAY} from '../theme';

const LIME = '#7CF21A';

/** Custom 3D glass IPO coin (CSS 3D): layered edge + two faces. */
export const Coin3D: React.FC<{size: number; rotY: number; rotX?: number; glow?: number}> = ({size, rotY, rotX = 0, glow = 1}) => {
  const T = size * 0.1;
  const layers = 16;
  const face = (back: boolean) => (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        transform: `translateZ(${back ? -T / 2 : T / 2}px) ${back ? 'rotateY(180deg)' : ''}`,
        background: 'radial-gradient(circle at 32% 28%, #FFFFFF 0%, #F3FAEF 45%, #DCEFD3 100%)',
        border: `${Math.max(2, size * 0.012)}px solid rgba(255,255,255,0.95)`,
        boxShadow: `inset 0 0 ${size * 0.08}px rgba(124,242,26,${0.45 * glow}), 0 0 ${size * 0.12 * glow}px rgba(124,242,26,${0.35 * glow})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backfaceVisibility: 'hidden',
      }}
    >
      <div style={{position: 'absolute', inset: size * 0.07, borderRadius: '50%', border: `${Math.max(1, size * 0.006)}px solid rgba(124,242,26,0.35)`}} />
      <div style={{fontFamily: DISPLAY, fontWeight: 900, fontStretch: '125%', fontSize: size * 0.27, color: LIME, transform: 'skewX(-10deg)', textShadow: `0 0 ${size * 0.04}px rgba(124,242,26,0.6)`, letterSpacing: '-0.02em'}}>IPO</div>
    </div>
  );
  return (
    <div style={{width: size, height: size, perspective: size * 3}}>
      <div style={{position: 'relative', width: size, height: size, transformStyle: 'preserve-3d', transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`}}>
        {new Array(layers).fill(0).map((_, i) => {
          const z = -T / 2 + (i / (layers - 1)) * T;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                transform: `translateZ(${z}px)`,
                background: i % 5 === 0 ? 'rgba(124,242,26,0.55)' : 'rgba(215,245,195,0.5)',
                border: '1px solid rgba(124,242,26,0.55)',
              }}
            />
          );
        })}
        {face(false)}
        {face(true)}
      </div>
    </div>
  );
};

/** Code-drawn glass coin stack (allocation). `p` 0..1 drops the top coin in. */
export const CoinStack: React.FC<{w: number; p: number}> = ({w, p}) => {
  const h = w * 1.3;
  const cx = w / 2;
  const rx = w * 0.44;
  const ry = w * 0.16;
  const tiers = [h * 0.82, h * 0.62, h * 0.42];
  const top = h * 0.22 - (1 - p) * 60;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{overflow: 'visible'}}>
      <defs>
        <linearGradient id="glassSide" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="rgba(124,242,26,0.35)" />
          <stop offset="0.5" stopColor="rgba(230,255,215,0.35)" />
          <stop offset="1" stopColor="rgba(124,242,26,0.4)" />
        </linearGradient>
        <linearGradient id="limeSide" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3FA80A" />
          <stop offset="0.5" stopColor="#8DF53A" />
          <stop offset="1" stopColor="#3FA80A" />
        </linearGradient>
        <radialGradient id="limeTop" cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#C4FF8A" />
          <stop offset="1" stopColor="#6BE016" />
        </radialGradient>
      </defs>
      <ellipse cx={cx} cy={h * 0.95} rx={rx * 1.05} ry={ry * 0.9} fill="rgba(124,242,26,0.25)" style={{filter: 'blur(6px)'}} />
      {tiers.map((y, i) => (
        <g key={i}>
          <path d={`M ${cx - rx} ${y} L ${cx - rx} ${y + h * 0.12} A ${rx} ${ry} 0 0 0 ${cx + rx} ${y + h * 0.12} L ${cx + rx} ${y} Z`} fill="url(#glassSide)" stroke="rgba(124,242,26,0.6)" strokeWidth={1.5} />
          <ellipse cx={cx} cy={y} rx={rx} ry={ry} fill="rgba(240,255,232,0.7)" stroke="rgba(124,242,26,0.7)" strokeWidth={1.5} />
          <ellipse cx={cx} cy={y} rx={rx * 0.55} ry={ry * 0.55} fill="rgba(124,242,26,0.18)" />
        </g>
      ))}
      <g opacity={p}>
        <path d={`M ${cx - rx} ${top} L ${cx - rx} ${top + h * 0.1} A ${rx} ${ry} 0 0 0 ${cx + rx} ${top + h * 0.1} L ${cx + rx} ${top} Z`} fill="url(#limeSide)" />
        <ellipse cx={cx} cy={top} rx={rx} ry={ry} fill="url(#limeTop)" stroke="#3FA80A" strokeWidth={1.5} />
        <text x={cx} y={top + ry * 0.35} textAnchor="middle" fontFamily="Archivo Variable" fontWeight={900} fontSize={w * 0.2} fill="#0B0B0B" transform={`translate(${cx} ${top}) scale(1 0.55) translate(${-cx} ${-top})`}>
          IPO
        </text>
      </g>
    </svg>
  );
};
