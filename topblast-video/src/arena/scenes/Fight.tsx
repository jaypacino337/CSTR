import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Glow, Particles, Shockwave} from '../../components/Atmosphere';
import {KineticLine} from '../../components/Type';
import {DISPLAY, MONO, UI, backOut, expoOut, inOut, keys, lerp, prog} from '../../theme';
import {A} from '../theme';

// 7–12s: two agents, one market. VS slam, then their P&L lines race.

export const AgentMark: React.FC<{size: number; color: string; glow?: number}> = ({size, color, glow = 1}) => (
  <svg width={size} height={size * 1.1} viewBox="0 0 100 110">
    <path d="M50 4 L88 22 L84 70 L50 106 L16 70 L12 22 Z" fill="#0C0D0A" stroke={color} strokeWidth={4} />
    <path d="M24 44 L50 58 L76 44" fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" style={{filter: `drop-shadow(0 0 ${6 * glow}px ${color})`}} />
    <path d="M50 58 L50 84" stroke={color} strokeWidth={5} strokeLinecap="round" style={{filter: `drop-shadow(0 0 ${6 * glow}px ${color})`}} />
    <circle cx={70} cy={24} r={4} fill="none" stroke={color} strokeWidth={2.5} />
  </svg>
);

const pnlA = (t: number) => 14 * t + Math.sin(t * 17) * 2.6 + Math.sin(t * 5.3) * 3.4 - 1;
const pnlB = (t: number) => 17 * t * t + Math.sin(t * 13 + 1) * 2.2 - Math.sin(t * 4) * 2.4;

const CX = 250;
const CY = 430;
const CW = 1420;
const CH = 360;
const X = (t: number) => CX + t * CW;
const Y = (v: number) => CY + CH / 2 - (v / 22) * (CH / 2);

const Fighter: React.FC<{name: string; color: string; pnl: number; lead: boolean; x: number; p: number; align: 'left' | 'right'}> = ({name, color, pnl, lead, x, p, align}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: 150,
      width: 600,
      height: 190,
      borderRadius: 26,
      display: 'flex',
      flexDirection: align === 'left' ? 'row' : 'row-reverse',
      alignItems: 'center',
      gap: 28,
      padding: '0 34px',
      background: 'linear-gradient(160deg, rgba(30,32,26,0.85), rgba(10,10,9,0.95))',
      border: `1.5px solid ${lead ? color : 'rgba(255,255,255,0.12)'}`,
      boxShadow: lead ? `0 0 50px ${color}55` : undefined,
      opacity: p,
      transform: `translateX(${(1 - p) * (align === 'left' ? -120 : 120)}px)`,
    }}
  >
    <AgentMark size={120} color={color} glow={lead ? 1.6 : 0.8} />
    <div style={{flex: 1, textAlign: align}}>
      <div style={{fontFamily: MONO, fontSize: 16, letterSpacing: '0.3em', color: A.dim}}>{lead ? '● LEADING' : 'AI AGENT'}</div>
      <div style={{fontFamily: DISPLAY, fontWeight: 900, fontStretch: '115%', fontSize: 40, color: A.white, marginTop: 6, whiteSpace: 'nowrap'}}>{name}</div>
      <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 36, color: pnl >= 0 ? color : A.down, marginTop: 4}}>
        {pnl >= 0 ? '+' : ''}
        {pnl.toFixed(2)}%
      </div>
    </div>
  </div>
);

export const Fight: React.FC = () => {
  const f = useCurrentFrame();
  const cards = prog(f, 0, 20, expoOut);
  const vs = prog(f, 12, 14, expoOut);
  const shake = f >= 12 && f < 26 ? (1 - (f - 12) / 14) * 14 : 0;
  const head = keys(f, [30, 128], [0.002, 1], inOut);
  const panel = prog(f, 18, 20);
  const a = pnlA(head);
  const b = pnlB(head);

  const path = (fn: (t: number) => number) => {
    const n = 200;
    let d = '';
    for (let i = 0; i <= n; i++) {
      const t = (i / n) * head;
      d += `${i ? 'L' : 'M'}${X(t).toFixed(1)},${Y(fn(t)).toFixed(1)} `;
    }
    return d;
  };
  const secs = Math.max(0, 299 - Math.floor(f * 1.9));

  return (
    <AbsoluteFill style={{background: A.bg, overflow: 'hidden'}}>
      <Glow x={300} y={300} size={1100} color="rgba(255,255,255,0.08)" />
      <Glow x={1620} y={300} size={1100} color="rgba(216,255,26,0.16)" />
      <Particles count={100} seed="fight" color={A.limeHot} speed={1.4} opacity={0.4} maxSize={2} />

      <AbsoluteFill style={{transform: `translate(${Math.sin(f * 7.1) * shake}px, ${Math.cos(f * 8.3) * shake}px)`}}>
        <Fighter name="AGENT ALPHA" color={A.white} pnl={a} lead={a > b && head > 0.05} x={130} p={cards} align="left" />
        <Fighter name="AGENT OMEGA" color={A.lime} pnl={b} lead={b >= a && head > 0.05} x={1190} p={cards} align="right" />

        {/* chart */}
        <div
          style={{
            position: 'absolute',
            left: 130,
            top: 380,
            width: 1660,
            height: 460,
            borderRadius: 26,
            background: 'linear-gradient(170deg, rgba(24,25,21,0.8), rgba(8,8,7,0.92))',
            border: '1px solid rgba(255,255,255,0.08)',
            opacity: panel,
            transform: `translateY(${(1 - panel) * 60}px)`,
          }}
        >
          <div style={{position: 'absolute', left: 40, top: 26, fontFamily: MONO, fontSize: 17, letterSpacing: '0.26em', color: A.dim}}>
            <span style={{color: A.lime}}>●</span> LIVE MATCH · NVDAx
          </div>
          <div style={{position: 'absolute', right: 40, top: 22, fontFamily: MONO, fontWeight: 700, fontSize: 24, color: A.white}}>
            {String(Math.floor(secs / 60)).padStart(2, '0')}:{String(secs % 60).padStart(2, '0')}
          </div>
        </div>
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: panel}}>
          <defs>
            <filter id="fglow" x="-10%" y="-30%" width="120%" height="160%">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {[-20, -10, 0, 10, 20].map((v) => (
            <g key={v}>
              <line x1={CX} x2={CX + CW} y1={Y(v)} y2={Y(v)} stroke={v === 0 ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.06)'} strokeDasharray={v === 0 ? '6 8' : undefined} />
              <text x={CX - 20} y={Y(v) + 6} textAnchor="end" fill="rgba(255,255,255,0.35)" fontFamily="JetBrains Mono" fontSize={16}>
                {v > 0 ? '+' : ''}
                {v}%
              </text>
            </g>
          ))}
          <path d={path(pnlA)} fill="none" stroke={A.white} strokeWidth={4} filter="url(#fglow)" strokeLinejoin="round" />
          <path d={path(pnlB)} fill="none" stroke={A.lime} strokeWidth={4.5} filter="url(#fglow)" strokeLinejoin="round" />
          <circle cx={X(head)} cy={Y(a)} r={8} fill={A.white} filter="url(#fglow)" />
          <circle cx={X(head)} cy={Y(b)} r={9} fill={A.lime} filter="url(#fglow)" />
        </svg>

        {/* VS */}
        <div
          style={{
            position: 'absolute',
            left: 860,
            top: 150,
            width: 200,
            height: 190,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: DISPLAY,
            fontWeight: 900,
            fontStretch: '125%',
            fontSize: 118,
            fontStyle: 'italic',
            color: A.lime,
            textShadow: `0 0 40px ${A.lime}, 0 0 90px ${A.limeDeep}`,
            transform: `scale(${lerp(2.6, 1, vs)})`,
            opacity: vs,
          }}
        >
          VS
        </div>
        <Shockwave x={960} y={245} t={prog(f, 12, 26, expoOut)} maxR={1100} color={A.lime} />
      </AbsoluteFill>

      <div style={{position: 'absolute', top: 882, left: 0, right: 0}}>
        <KineticLine
          segments={[
            {text: 'AGENT ', color: A.white},
            {text: 'VS ', gradient: `linear-gradient(180deg, ${A.limeHot}, ${A.limeDeep})`},
            {text: 'AGENT.', color: A.white},
          ]}
          start={112}
          size={96}
          stagger={1.2}
        />
      </div>
      <div style={{position: 'absolute', top: 1004, width: '100%', textAlign: 'center', fontFamily: UI, fontSize: 19, letterSpacing: '0.34em', color: A.dim, opacity: prog(f, 128, 16)}}>
        SAME MARKET. SAME CLOCK. BEST STRATEGY WINS.
      </div>
    </AbsoluteFill>
  );
};
