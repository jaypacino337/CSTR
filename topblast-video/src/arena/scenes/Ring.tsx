import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {Glow, GridFloor, Particles} from '../../components/Atmosphere';
import {KineticLine} from '../../components/Type';
import {DISPLAY, MONO, UI, expoOut, inOut, lerp, prog} from '../../theme';
import {A, AGENTS} from '../theme';
import {AgentMark} from './Fight';
import {useCalm} from '../../components/calm';

// 17–22s: pull back to the full colosseum; tokenized stocks orbit the floor.
const CX = 960;
const CY = 540;
const R = 780;
const r = 205;
const H = 140;
const TAU = Math.PI * 2;

export const Ring: React.FC = () => {
  const f = useCurrentFrame();
  const calm = useCalm();
  const build = prog(f, 0, 30, expoOut);
  const cam = prog(f, 0, 164, inOut);
  const rot = f * 0.006;
  const beam = prog(f, 24, 24);

  const arches = new Array(22).fill(0).map((_, k) => {
    const th = (k / 22) * TAU + rot;
    return {th, s: Math.sin(th), c: Math.cos(th)};
  });
  const arch = (a: {th: number; s: number; c: number}, front: boolean) => {
    const w = 62 * Math.abs(a.s) + 4;
    const x = CX + R * 0.985 * a.c;
    const top = CY + r * a.s + (front ? 30 : 34);
    const h = H - 44;
    const rr = w / 2;
    return (
      <path
        key={`${front}${a.th}`}
        d={`M ${x - w / 2} ${top + h} L ${x - w / 2} ${top + rr} A ${rr} ${rr} 0 0 1 ${x + w / 2} ${top + rr} L ${x + w / 2} ${top + h} Z`}
        fill={front ? '#08080A' : '#1B1C18'}
      />
    );
  };

  const roster = [
    ...AGENTS.map((a) => ({n: a.n, sub: 'SEASON 01', c: a.c, community: false, at: 8})),
    {n: 'YOUR AGENT', sub: 'SEASON 2', c: A.lime, community: true, at: 58},
    {n: 'YOUR AGENT', sub: 'SEASON 2', c: A.lime, community: true, at: 70},
  ];
  const chips = roster
    .map((tk, i) => {
      const th = (i / roster.length) * TAU - f * 0.016;
      const s = Math.sin(th);
      return {tk, x: CX + 500 * Math.cos(th), y: CY - 10 + 120 * s, depth: (s + 1) / 2, i};
    })
    .sort((a, b) => a.depth - b.depth);

  // crowd camera flashes on the rim
  const flashes = new Array(40).fill(0).map((_, i) => {
    const th = random(`fl${i}`) * TAU;
    const on = Math.sin(f * (0.3 + random(`fs${i}`) * 0.5) + i * 3) > 0.93;
    return {x: CX + R * Math.cos(th), y: CY + r * Math.sin(th) - 6, on};
  });

  return (
    <AbsoluteFill style={{background: A.bg, overflow: 'hidden'}}>
      <Glow x={CX} y={CY + 60} size={1900} color="rgba(216,255,26,0.2)" />
      <GridFloor color="rgba(216,255,26,0.12)" speed={1.5} horizon={820} />
      <Particles count={90} seed="ring" color={A.limeHot} speed={0.9} opacity={0.45} maxSize={2} />

      <AbsoluteFill style={{transform: `scale(${lerp(1.35, 0.94, cam) * lerp(0.9, 1, build)})`, transformOrigin: `${CX}px ${CY + 60}px`, opacity: build}}>
        {/* back half */}
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          <defs>
            <linearGradient id="wallF" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FFFFFF" />
              <stop offset="1" stopColor="#C9CCC1" />
            </linearGradient>
            <linearGradient id="wallB" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#8E9188" />
              <stop offset="1" stopColor="#5E6159" />
            </linearGradient>
            <radialGradient id="floor" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="rgba(216,255,26,0.28)" />
              <stop offset="0.7" stopColor="rgba(20,22,14,0.95)" />
              <stop offset="1" stopColor="#0A0B08" />
            </radialGradient>
            <filter id="rglow" x="-10%" y="-40%" width="120%" height="180%">
              <feGaussianBlur stdDeviation="8" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path d={`M ${CX - R} ${CY} A ${R} ${r} 0 0 1 ${CX + R} ${CY} L ${CX + R} ${CY + H} A ${R} ${r} 0 0 0 ${CX - R} ${CY + H} Z`} fill="url(#wallB)" />
          {arches.filter((a) => a.s < -0.05).map((a) => arch(a, false))}
          <ellipse cx={CX} cy={CY + H} rx={R} ry={r} fill="url(#floor)" />
          <ellipse cx={CX} cy={CY + H} rx={R * 0.7} ry={r * 0.7} fill="none" stroke={A.lime} strokeOpacity={0.5} strokeWidth={2} strokeDasharray="10 14" transform={`rotate(0)`} />
          <ellipse cx={CX} cy={CY + H} rx={R * 0.4} ry={r * 0.4} fill="none" stroke={A.lime} strokeOpacity={0.35} strokeWidth={1.5} />
        </svg>

        {/* spotlight + champion in the centre */}
        <div style={{position: 'absolute', left: CX - 90, top: -100, width: 180, height: CY + H + 100, background: `linear-gradient(to bottom, transparent, rgba(216,255,26,0.35) 70%, rgba(216,255,26,0.6))`, filter: 'blur(24px)', opacity: beam * (calm ? 0.35 : 1), mixBlendMode: 'screen'}} />
        <div style={{position: 'absolute', left: CX - 60, top: CY - 30 + Math.sin(f / 10) * 8, opacity: beam, transform: `scale(${lerp(0.5, 1, beam)})`}}>
          <AgentMark size={120} color={A.lime} glow={2} />
          <div style={{position: 'absolute', left: 0, right: 0, top: 30, textAlign: 'center', fontFamily: DISPLAY, fontWeight: 900, fontSize: 40, color: A.lime, opacity: prog(f, 60, 12)}}>?</div>
        </div>

        {chips.map(({tk, x, y, depth, i}) => {
          const p = tk.community ? prog(f, tk.at, 18, expoOut) : prog(f, tk.at + i * 3, 16);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x - 110,
                top: y - 38 - (tk.community ? (1 - p) * 300 : 0),
                width: 220,
                padding: '10px 0',
                borderRadius: 14,
                textAlign: 'center',
                background: tk.community ? 'rgba(216,255,26,0.12)' : 'rgba(12,13,10,0.88)',
                border: `2px ${tk.community ? 'dashed' : 'solid'} ${tk.c}`,
                boxShadow: `0 0 ${(tk.community ? 40 : 18) * depth}px ${tk.community ? 'rgba(216,255,26,0.6)' : 'rgba(255,255,255,0.15)'}`,
                transform: `scale(${0.62 + 0.4 * depth})`,
                opacity: (0.45 + 0.55 * depth) * p,
                filter: depth < 0.3 ? 'blur(1.5px)' : undefined,
              }}
            >
              <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 30, color: tk.community ? A.lime : A.white}}>{tk.n}</div>
              <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 14, letterSpacing: '0.24em', color: tk.community ? A.lime : A.dim}}>{tk.sub}</div>
            </div>
          );
        })}

        {/* front half */}
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          <path d={`M ${CX - R} ${CY} A ${R} ${r} 0 0 0 ${CX + R} ${CY} L ${CX + R} ${CY + H} A ${R} ${r} 0 0 1 ${CX - R} ${CY + H} Z`} fill="url(#wallF)" />
          {arches.filter((a) => a.s > 0.05).map((a) => arch(a, true))}
          <ellipse cx={CX} cy={CY} rx={R} ry={r} fill="none" stroke="#FFFFFF" strokeWidth={22} />
          <ellipse cx={CX} cy={CY} rx={R - 34} ry={r - 16} fill="none" stroke={A.lime} strokeWidth={4} filter="url(#rglow)" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - prog(f, 6, 40, inOut)} />
          <path d={`M ${CX - R - 20} ${CY + H + 16} A ${R + 20} ${r + 16} 0 0 0 ${CX + R + 20} ${CY + H + 16}`} fill="none" stroke={A.lime} strokeWidth={6} filter="url(#rglow)" />
          {new Array(17).fill(0).map((_, k) => {
            const th = Math.PI * (0.06 + (k / 16) * 0.88);
            const x = CX + (R + 20) * Math.cos(th);
            const y = CY + H + 16 + (r + 16) * Math.sin(th);
            return <line key={k} x1={x} y1={y} x2={x + Math.cos(th) * 16} y2={y + 30} stroke={A.lime} strokeWidth={4} filter="url(#rglow)" opacity={0.8} />;
          })}
          {!calm && flashes.map((p, i) => (p.on ? <circle key={i} cx={p.x} cy={p.y} r={5} fill="#fff" style={{filter: 'drop-shadow(0 0 10px #fff)'}} /> : null))}
        </svg>
      </AbsoluteFill>

      <div style={{position: 'absolute', top: 86, left: 0, right: 0}}>
        <KineticLine
          segments={[
            {text: 'BUILD THE NEXT ', color: A.white},
            {text: 'CHALLENGER.', gradient: `linear-gradient(180deg, ${A.limeHot}, ${A.limeDeep})`},
          ]}
          start={20}
          size={100}
          stagger={1.1}
          stretch={100}
        />
      </div>
      <div style={{position: 'absolute', top: 972, width: '100%', textAlign: 'center', fontFamily: UI, fontWeight: 600, fontSize: 20, letterSpacing: '0.2em', color: A.dim, opacity: prog(f, 60, 18)}}>
        SEASON 2 CHANGES THE GAME <span style={{color: A.lime}}>·</span> AI VS COMMUNITY-BUILT AGENTS
      </div>
    </AbsoluteFill>
  );
};
