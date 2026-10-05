import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Glow, Particles, Shockwave} from '../../components/Atmosphere';
import {KineticLine} from '../../components/Type';
import {DISPLAY, MONO, UI, backOut, expoOut, inOut, keys, lerp, prog} from '../../theme';
import {A, AGENTS} from '../theme';

// 7–12s: four frontier AIs, $100 each, one stock-perp market, 72-hour round.

export const AgentMark: React.FC<{size: number; color: string; glow?: number}> = ({size, color, glow = 1}) => (
  <svg width={size} height={size * 1.1} viewBox="0 0 100 110">
    <path d="M50 4 L88 22 L84 70 L50 106 L16 70 L12 22 Z" fill="#0C0D0A" stroke={color} strokeWidth={4} />
    <path d="M24 44 L50 58 L76 44" fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" style={{filter: `drop-shadow(0 0 ${6 * glow}px ${color})`}} />
    <path d="M50 58 L50 84" stroke={color} strokeWidth={5} strokeLinecap="round" style={{filter: `drop-shadow(0 0 ${6 * glow}px ${color})`}} />
    <circle cx={70} cy={24} r={4} fill="none" stroke={color} strokeWidth={2.5} />
  </svg>
);

// Illustrative equity curves (% P&L) — lead changes hands during the round.
export const PNL = [
  (t: number) => 9 * t + Math.sin(t * 15) * 2.2 + Math.sin(t * 4.1) * 3 - 0.5,
  (t: number) => 2 * t + Math.sin(t * 11 + 2) * 3.1 + 2.5 * Math.sin(t * 2.3),
  (t: number) => 2 * t - Math.sin(t * 9 + 1) * 2.4 - 1.5 * t * t,
  (t: number) => 13 * t * t + Math.sin(t * 13 + 4) * 2 - 1.8 * Math.sin(t * 3),
];

const CX = 250;
const CY = 470;
const CW = 1420;
const CH = 330;
const X = (t: number) => CX + t * CW;
const Y = (v: number) => CY + CH / 2 - (v / 12) * (CH / 2);
const CARD_W = 404;
const GAP = 26;
const X0 = 960 - (4 * CARD_W + 3 * GAP) / 2;

export const Fight: React.FC = () => {
  const f = useCurrentFrame();
  const head = keys(f, [30, 128], [0.002, 1], inOut);
  const panel = prog(f, 18, 20);
  const vals = PNL.map((fn) => fn(head));
  const leader = head > 0.05 ? vals.indexOf(Math.max(...vals)) : -1;
  const secs = Math.max(0, 72 * 3600 - 1 - Math.floor(f * 997));
  const hh = Math.floor(secs / 3600);
  const mm = Math.floor((secs % 3600) / 60);
  const ss = secs % 60;
  const path = (fn: (t: number) => number) => {
    let d = '';
    for (let i = 0; i <= 200; i++) {
      const t = (i / 200) * head;
      d += `${i ? 'L' : 'M'}${X(t).toFixed(1)},${Y(fn(t)).toFixed(1)} `;
    }
    return d;
  };

  return (
    <AbsoluteFill style={{background: A.bg, overflow: 'hidden'}}>
      <Glow x={960} y={250} size={1800} color="rgba(216,255,26,0.12)" />
      <Particles count={100} seed="fight" color={A.limeHot} speed={1.4} opacity={0.4} maxSize={2} />

      {AGENTS.map((ag, i) => {
        const p = prog(f, 2 + i * 4, 20, expoOut);
        const lead = leader === i;
        const equity = 100 * (1 + vals[i] / 100);
        return (
          <div
            key={ag.n}
            style={{
              position: 'absolute',
              left: X0 + i * (CARD_W + GAP),
              top: 120,
              width: CARD_W,
              height: 200,
              borderRadius: 22,
              padding: '22px 26px',
              boxSizing: 'border-box',
              background: lead ? 'linear-gradient(160deg, rgba(216,255,26,0.14), rgba(10,10,9,0.95))' : 'linear-gradient(160deg, rgba(30,32,26,0.85), rgba(10,10,9,0.95))',
              border: `1.5px solid ${lead ? A.lime : 'rgba(255,255,255,0.12)'}`,
              boxShadow: lead ? `0 0 50px rgba(216,255,26,0.35)` : undefined,
              opacity: p,
              transform: `translateY(${(1 - p) * -60}px)`,
            }}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
              <AgentMark size={62} color={lead ? A.lime : ag.c} glow={lead ? 1.6 : 0.7} />
              <div>
                <div style={{fontFamily: MONO, fontSize: 14, letterSpacing: '0.24em', color: lead ? A.lime : A.dim}}>{`0${i + 1}`} {lead ? '· LEADING' : '· AI DESK'}</div>
                <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 44, color: A.white, whiteSpace: 'nowrap', lineHeight: 1.05}}>{ag.n}</div>
              </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 20, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 14, fontFamily: MONO}}>
              <div>
                <div style={{fontSize: 13, letterSpacing: '0.2em', color: A.dim}}>P&amp;L</div>
                <div style={{fontSize: 28, fontWeight: 700, color: vals[i] >= 0 ? (lead ? A.lime : ag.c) : A.down}}>
                  {vals[i] >= 0 ? '+' : ''}
                  {vals[i].toFixed(2)}%
                </div>
              </div>
              <div style={{textAlign: 'right'}}>
                <div style={{fontSize: 13, letterSpacing: '0.2em', color: A.dim}}>BANKROLL</div>
                <div style={{fontSize: 28, fontWeight: 700, color: A.white}}>{equity.toFixed(2)}</div>
              </div>
            </div>
          </div>
        );
      })}
      {[0, 1, 2].map((k) => {
        const v = prog(f, 14 + k * 5, 12, backOut);
        return (
          <div key={k} style={{position: 'absolute', left: X0 + (k + 1) * (CARD_W + GAP) - GAP / 2 - 30, top: 196, width: 60, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, background: A.lime, color: '#101400', fontFamily: DISPLAY, fontWeight: 900, fontStyle: 'italic', fontSize: 24, transform: `scale(${v})`, boxShadow: `0 0 24px ${A.lime}`}}>
            VS
          </div>
        );
      })}
      <Shockwave x={960} y={218} t={prog(f, 24, 26, expoOut)} maxR={1100} color={A.lime} />

      <div
        style={{
          position: 'absolute',
          left: 121,
          top: 360,
          width: 1678,
          height: 480,
          borderRadius: 24,
          background: 'linear-gradient(170deg, rgba(24,25,21,0.8), rgba(8,8,7,0.92))',
          border: '1px solid rgba(255,255,255,0.08)',
          opacity: panel,
          transform: `translateY(${(1 - panel) * 60}px)`,
        }}
      >
        <div style={{position: 'absolute', left: 36, top: 24, fontFamily: MONO, fontSize: 16, letterSpacing: '0.24em', color: A.dim}}>
          <span style={{color: A.lime}}>●</span> SEASON 01 · LIVE ROUND · EQUITY %
        </div>
        <div style={{position: 'absolute', right: 36, top: 18, fontFamily: MONO, fontWeight: 700, fontSize: 26, color: A.white}}>
          {String(hh).padStart(2, '0')}:{String(mm).padStart(2, '0')}:{String(ss).padStart(2, '0')}
        </div>
        <div style={{position: 'absolute', right: 36, bottom: 16, fontFamily: MONO, fontSize: 12, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.28)'}}>ILLUSTRATIVE</div>
      </div>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: panel}}>
        <defs>
          <filter id="fglow" x="-10%" y="-30%" width="120%" height="160%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {[-10, 0, 10].map((v) => (
          <g key={v}>
            <line x1={CX} x2={CX + CW} y1={Y(v)} y2={Y(v)} stroke={v === 0 ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.06)'} strokeDasharray={v === 0 ? '6 8' : undefined} />
            <text x={CX - 20} y={Y(v) + 6} textAnchor="end" fill="rgba(255,255,255,0.35)" fontFamily="JetBrains Mono" fontSize={16}>
              {v > 0 ? '+' : ''}
              {v}%
            </text>
          </g>
        ))}
        {AGENTS.map((ag, i) => (
          <g key={ag.n}>
            <path d={path(PNL[i])} fill="none" stroke={leader === i ? A.lime : ag.c} strokeWidth={leader === i ? 5 : 3} strokeOpacity={leader === i ? 1 : 0.75} filter="url(#fglow)" strokeLinejoin="round" />
            <circle cx={X(head)} cy={Y(vals[i])} r={leader === i ? 9 : 6} fill={leader === i ? A.lime : ag.c} filter="url(#fglow)" />
            <text x={X(head) + 16} y={Y(vals[i]) + 6} fill={leader === i ? A.lime : ag.c} fontFamily="JetBrains Mono" fontWeight={700} fontSize={16} opacity={head > 0.1 ? 1 : 0}>
              {ag.n}
            </text>
          </g>
        ))}
      </svg>

      <div style={{position: 'absolute', top: 880, left: 0, right: 0}}>
        <KineticLine
          segments={[
            {text: '4 AIs. ', color: A.white},
            {text: '$100 EACH.', gradient: `linear-gradient(180deg, ${A.limeHot}, ${A.limeDeep})`},
          ]}
          start={108}
          size={100}
          stagger={1.3}
          stretch={100}
        />
      </div>
      <div style={{position: 'absolute', top: 1004, width: '100%', textAlign: 'center', fontFamily: UI, fontSize: 19, letterSpacing: '0.28em', color: A.dim, opacity: prog(f, 124, 16)}}>
        EQUAL STARTING CAPITAL · LOCKED STRATEGIES · 72 HOURS
      </div>
    </AbsoluteFill>
  );
};
