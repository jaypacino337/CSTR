import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Flash, Glow, GridFloor, Particles} from '../components/Atmosphere';
import {Logo} from '../components/Logo';
import {KineticLine} from '../components/Type';
import {C, DISPLAY, MONO, UI, expoOut, inOut, lerp, prog} from '../theme';

// 3–7s: two venue rails accelerate into the TopBlast engine.
const EX = 960;
const EY = 450;

const railPaths = (side: -1 | 1) =>
  [-60, -30, 0, 30, 60].map((o, i) => {
    const sx = EX + side * 560;
    const sy = 470 + o * 0.9;
    const c1x = EX + side * 330;
    const c2x = EX + side * 190;
    return {
      d: `M ${sx} ${sy} C ${c1x} ${sy + o * 0.4}, ${c2x} ${EY + o * 0.25}, ${EX + side * 70} ${EY + o * 0.12}`,
      i,
    };
  });

const Hologram: React.FC<{color: string; seed: number; p: number}> = ({color, seed, p}) => {
  const pts = new Array(22)
    .fill(0)
    .map((_, i) => {
      const y = 70 - i * 2.2 - Math.sin(i * 1.3 + seed) * 10 - Math.cos(i * 0.7 + seed * 2) * 6;
      return `${i * 12},${y}`;
    })
    .slice(0, Math.max(2, Math.round(22 * p)))
    .join(' ');
  return (
    <div
      style={{
        width: 280,
        height: 110,
        border: `1px solid ${color}55`,
        background: `linear-gradient(180deg, ${color}18, transparent)`,
        borderRadius: 10,
        padding: 12,
        boxShadow: `0 0 30px ${color}33`,
        opacity: 0.85,
        transform: 'perspective(600px) rotateX(12deg)',
      }}
    >
      <svg width={256} height={86} viewBox="0 0 256 86">
        {[20, 43, 66].map((y) => (
          <line key={y} x1={0} x2={256} y1={y} y2={y} stroke={`${color}30`} />
        ))}
        <polyline points={pts} fill="none" stroke={color} strokeWidth={2.4} style={{filter: `drop-shadow(0 0 4px ${color})`}} />
      </svg>
    </div>
  );
};

const VenueCard: React.FC<{
  a: string;
  b: string;
  color: string;
  x: number;
  p: number;
  seed: number;
  holo: number;
}> = ({a, b, color, x, p, seed, holo}) => (
  <div
    style={{
      position: 'absolute',
      left: x - 190,
      top: 330,
      width: 380,
      opacity: p,
      transform: `translateY(${(1 - p) * 60}px)`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 26,
    }}
  >
    <Hologram color={color} seed={seed} p={holo} />
    <div
      style={{
        width: 380,
        height: 132,
        borderRadius: 18,
        background: 'linear-gradient(180deg, rgba(20,22,28,0.92), rgba(8,9,12,0.95))',
        border: `1.5px solid ${color}`,
        boxShadow: `0 0 0 1px rgba(255,255,255,0.04) inset, 0 0 40px ${color}66, 0 0 120px ${color}33`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
      }}
    >
      <div style={{fontFamily: DISPLAY, fontWeight: 900, fontStretch: '118%', fontSize: 50, letterSpacing: '0.01em'}}>
        <span style={{color: C.white}}>{a}</span>
        <span style={{color}}>{b}</span>
      </div>
      <div style={{fontFamily: MONO, fontSize: 15, letterSpacing: '0.3em', color: `${color}`, opacity: 0.85}}>
        LAUNCH + LIQUIDITY
      </div>
    </div>
  </div>
);

export const Rails: React.FC = () => {
  const f = useCurrentFrame();
  const cardsIn = prog(f, 4, 22);
  const draw = prog(f, 12, 30, inOut);
  const engine = prog(f, 20, 26);
  const push = prog(f, 0, 132, inOut);
  const pulse = 0.75 + 0.25 * Math.sin(f / 3);
  const flashIn = Math.max(0, 1 - f / 14);

  return (
    <AbsoluteFill style={{background: C.bg, overflow: 'hidden'}}>
      <Glow x={200} y={470} size={1100} color="rgba(44,123,255,0.28)" />
      <Glow x={1720} y={470} size={1100} color="rgba(25,195,125,0.24)" />
      <GridFloor color="rgba(255,106,0,0.22)" speed={4 + push * 10} horizon={640} />
      <Particles count={90} seed="rails" color="#FFD2AE" speed={1.2} opacity={0.5} maxSize={1.8} />

      <AbsoluteFill style={{transform: `scale(${lerp(1, 1.12, push)})`, transformOrigin: `${EX}px ${EY}px`}}>
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          <defs>
            <filter id="railGlow" x="-20%" y="-50%" width="140%" height="200%">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {([-1, 1] as const).map((side) => {
            const col = side === -1 ? C.blue : C.green;
            const hot = side === -1 ? C.blueHot : C.greenHot;
            return railPaths(side).map(({d, i}) => (
              <g key={`${side}${i}`} filter="url(#railGlow)">
                <path d={d} pathLength={1} fill="none" stroke={col} strokeOpacity={0.35} strokeWidth={i === 2 ? 5 : 2.5} strokeDasharray={`${draw} 1`} />
                {/* travelling light packets, accelerating */}
                {[0, 0.33, 0.66].map((k) => {
                  const speed = 0.012 + push * 0.03;
                  const t = (f * speed + k + i * 0.13) % 1;
                  return (
                    <path
                      key={k}
                      d={d}
                      pathLength={1}
                      fill="none"
                      stroke={hot}
                      strokeWidth={i === 2 ? 7 : 4}
                      strokeLinecap="round"
                      strokeDasharray="0.09 0.91"
                      strokeDashoffset={-t}
                      opacity={draw > 0.95 ? 1 : 0}
                    />
                  );
                })}
              </g>
            ));
          })}
          {/* engine rings */}
          <g transform={`translate(${EX} ${EY})`} opacity={engine}>
            {[190, 150, 120].map((r, i) => (
              <circle
                key={r}
                r={r * lerp(0.6, 1, engine)}
                fill="none"
                stroke={i === 0 ? C.orange : '#FFB27A'}
                strokeOpacity={i === 0 ? 0.8 : 0.4}
                strokeWidth={i === 0 ? 3 : 1.5}
                strokeDasharray={i === 0 ? '60 18' : i === 1 ? '4 10' : '120 40'}
                transform={`rotate(${f * (i % 2 ? -2.2 : 1.6)})`}
                style={{filter: `drop-shadow(0 0 8px ${C.orange})`}}
              />
            ))}
          </g>
        </svg>
        <Glow x={EX} y={EY} size={720} color="rgba(255,106,0,0.75)" opacity={engine * pulse} />
        <div
          style={{
            position: 'absolute',
            left: EX - 120,
            top: EY - 120,
            transform: `scale(${lerp(0.4, 1, engine)})`,
            opacity: engine,
          }}
        >
          <Logo size={240} glow={0.9 + pulse * 0.3} />
        </div>
        <VenueCard a="STONK" b="FUN" color={C.blue} x={EX - 700} p={cardsIn} seed={1} holo={prog(f, 8, 50)} />
        <VenueCard a="PUMP." b="FUN" color={C.green} x={EX + 700} p={cardsIn} seed={4} holo={prog(f, 8, 50)} />
      </AbsoluteFill>

      {/* Copy */}
      <div style={{position: 'absolute', top: 745, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
        <div style={{display: 'flex', gap: 42}}>
          <KineticLine segments="YOUR TOKEN." start={24} size={58} stretch={112} weight={800} style={{color: C.dim}} />
          <KineticLine segments="YOUR VENUE." start={38} size={58} stretch={112} weight={800} style={{color: C.dim}} />
        </div>
        <KineticLine
          segments={[
            {text: 'TOPBLAST', gradient: `linear-gradient(180deg, ${C.orangeHot}, ${C.red})`},
            {text: ' ON TOP.', color: C.white},
          ]}
          start={56}
          size={128}
          stagger={1.4}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 1010,
          width: '100%',
          textAlign: 'center',
          fontFamily: UI,
          fontSize: 19,
          letterSpacing: '0.36em',
          color: C.dim,
          opacity: prog(f, 70, 20, expoOut) * 0.85,
        }}
      >
        REWARD INFRASTRUCTURE · ABOVE THE VENUES YOU ALREADY USE
      </div>
      <Flash amount={flashIn * 0.9} color="#FF7A1A" />
    </AbsoluteFill>
  );
};
