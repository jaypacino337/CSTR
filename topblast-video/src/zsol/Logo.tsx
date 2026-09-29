// zSOL app-icon logo, redrawn as vector: magenta→violet→blue→cyan→mint tile, white Z
// with the vertical stroke through it. Traced from the 1254px master.
export const LOGO_GRAD = 'linear-gradient(45deg, #E61CFF 0%, #8A1BFF 22%, #2D63FF 50%, #00D5FF 78%, #16F5C8 100%)';

export const ZsolLogo: React.FC<{size: number; glow?: number; id?: string; style?: React.CSSProperties}> = ({size, glow = 1, id = 'zl', style}) => (
  <div style={{position: 'relative', width: size, height: size, ...style}}>
    {glow > 0 && (
      <div style={{position: 'absolute', inset: size * 0.06, borderRadius: size * 0.2, backgroundImage: LOGO_GRAD, filter: `blur(${size * 0.12}px)`, opacity: 0.75 * glow}} />
    )}
    <svg width={size} height={size} viewBox="175 185 904 904" style={{position: 'absolute', inset: 0}}>
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#E61CFF" />
          <stop offset="0.24" stopColor="#8A1BFF" />
          <stop offset="0.52" stopColor="#2D63FF" />
          <stop offset="0.8" stopColor="#00D5FF" />
          <stop offset="1" stopColor="#16F5C8" />
        </linearGradient>
        <radialGradient id={`${id}-h`} cx="0.3" cy="0.15" r="0.8">
          <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="195" y="203" width="863" height="832" rx="150" fill={`url(#${id}-g)`} />
      <rect x="195" y="203" width="863" height="832" rx="150" fill={`url(#${id}-h)`} />
      <rect x="195.5" y="203.5" width="862" height="831" rx="150" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
      <g fill="#F6F2FF" stroke="#F6F2FF" strokeWidth="14" strokeLinejoin="round">
        <polygon points="452,412 841,412 841,500 590,737 843,737 808,843 402,843 402,748 658,520 388,520" />
        <rect x="580" y="329" width="95" height="90" />
        <rect x="580" y="836" width="95" height="92" />
      </g>
    </svg>
  </div>
);

// Main zSOL mark: the gradient Z glyph (magenta → violet → cyan → mint), no tile.
// `sheen` 0→1 sweeps a light band across the glyph.
const Z_POINTS = '408,304 913,304 913,424 580,754 902,754 866,896 344,896 344,774 676,449 352,449 395,312';
const ZGlyph: React.FC<{id: string; fill: string}> = ({id, fill}) => (
  <g fill={fill} stroke={fill} strokeWidth="12" strokeLinejoin="round" id={id}>
    <polygon points={Z_POINTS} />
    <rect x="562" y="202" width="135" height="104" />
    <rect x="560" y="894" width="135" height="102" />
  </g>
);
export const ZsolMark: React.FC<{size: number; glow?: number; sheen?: number; id?: string; style?: React.CSSProperties}> = ({size, glow = 1, sheen = 0, id = 'zm', style}) => {
  const grad = `url(#${id}-g)`;
  const vb = '223 195 810 810';
  const defs = (
    <defs>
      <linearGradient id={`${id}-g`} x1="340" y1="1000" x2="920" y2="200" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#D400FF" />
        <stop offset="0.32" stopColor="#8F5BFF" />
        <stop offset="0.58" stopColor="#00DBFF" />
        <stop offset="0.82" stopColor="#00EDD2" />
        <stop offset="1" stopColor="#00F7A0" />
      </linearGradient>
      <clipPath id={`${id}-c`}>
        <polygon points={Z_POINTS} />
        <rect x="562" y="202" width="135" height="104" />
        <rect x="560" y="894" width="135" height="102" />
      </clipPath>
    </defs>
  );
  return (
    <div style={{position: 'relative', width: size, height: size, ...style}}>
      {glow > 0 && (
        <svg width={size} height={size} viewBox={vb} style={{position: 'absolute', inset: 0, filter: `blur(${size * 0.06}px)`, opacity: 0.8 * glow}}>
          {defs}
          <ZGlyph id={`${id}-b`} fill={grad} />
        </svg>
      )}
      <svg width={size} height={size} viewBox={vb} style={{position: 'absolute', inset: 0}}>
        {defs}
        <ZGlyph id={`${id}-f`} fill={grad} />
        {sheen > 0 && sheen < 1 && (
          <g clipPath={`url(#${id}-c)`}>
            <rect x={200 + sheen * 900 - 150} y="100" width="150" height="1000" fill="rgba(255,255,255,0.55)" transform={`rotate(25 ${200 + sheen * 900} 600)`} />
          </g>
        )}
      </svg>
    </div>
  );
};
