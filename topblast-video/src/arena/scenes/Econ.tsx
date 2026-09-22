import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {Glow, Particles} from '../../components/Atmosphere';
import {KineticLine} from '../../components/Type';
import {DISPLAY, MONO, expoOut, inOut, prog} from '../../theme';
import {A} from '../theme';

// 21.6–26.6s: League economy — the 60 / 20 / 10 / 10 fee plan from stonkarena.xyz.
const SPLIT = [
  {v: 60, k: 'SEASONS + CHAMPIONSHIPS', d: 'funds the league', c: A.lime},
  {v: 20, k: 'OUTCOME-MARKET PARTICIPANTS', d: 'rewards predictors', c: A.white},
  {v: 10, k: 'OUTCOME-MARKET LIQUIDITY', d: 'deepens the markets', c: '#8FB800'},
  {v: 10, k: 'BUYBACK + BURN $ARENA', d: 'supply out of circulation', c: '#FF7A45'},
];
const DX = 610;
const DY = 560;
const R = 230;
const SW = 74;
const CIRC = 2 * Math.PI * R;

export const Econ: React.FC = () => {
  const f = useCurrentFrame();
  const inP = prog(f, 0, 18);
  let acc = 0;

  return (
    <AbsoluteFill style={{background: A.bg, overflow: 'hidden'}}>
      <Glow x={DX} y={DY} size={1200} color="rgba(216,255,26,0.2)" />
      <Particles count={80} seed="econ" color={A.limeHot} speed={1} opacity={0.35} maxSize={2} />

      <div style={{position: 'absolute', left: 0, right: 0, top: 70}}>
        <div style={{textAlign: 'center', fontFamily: MONO, fontSize: 18, letterSpacing: '0.34em', color: A.lime, opacity: inP}}>LEAGUE ECONOMY</div>
        <KineticLine
          segments={[
            {text: '60 / 20 / 10 / 10 ', color: A.white},
            {text: 'FEE PLAN', gradient: `linear-gradient(180deg, ${A.limeHot}, ${A.limeDeep})`},
          ]}
          start={4}
          size={92}
          stagger={0.9}
          stretch={100}
          style={{marginTop: 16}}
        />
      </div>

      {/* fees streaming into the donut */}
      {new Array(40).fill(0).map((_, i) => {
        const t = ((f * 0.02 + random(`ef${i}`)) % 1);
        const a = random(`ea${i}`) * Math.PI * 2;
        const d = 700 * (1 - t);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: DX + Math.cos(a) * d,
              top: DY + Math.sin(a) * d * 0.7,
              width: 6,
              height: 6,
              borderRadius: 3,
              background: A.lime,
              boxShadow: `0 0 10px ${A.lime}`,
              opacity: t * prog(f, 10, 20) * (t > 0.9 ? (1 - t) * 10 : 1),
            }}
          />
        );
      })}

      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <circle cx={DX} cy={DY} r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={SW} />
        {SPLIT.map((s, i) => {
          const start = acc;
          acc += s.v;
          const p = prog(f, 16 + i * 12, 22, inOut);
          const len = (s.v / 100) * CIRC * p;
          return (
            <circle
              key={s.k}
              cx={DX}
              cy={DY}
              r={R}
              fill="none"
              stroke={s.c}
              strokeWidth={SW}
              strokeDasharray={`${Math.max(0, len - 6)} ${CIRC}`}
              strokeDashoffset={-(start / 100) * CIRC}
              transform={`rotate(-90 ${DX} ${DY})`}
              style={{filter: i === 0 ? `drop-shadow(0 0 18px ${A.lime})` : undefined}}
            />
          );
        })}
      </svg>
      <div style={{position: 'absolute', left: DX - 150, top: DY - 64, width: 300, textAlign: 'center', opacity: prog(f, 20, 16)}}>
        <div style={{fontFamily: MONO, fontSize: 15, letterSpacing: '0.3em', color: A.dim}}>ARENA</div>
        <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 64, color: A.white, lineHeight: 1.05}}>FEES</div>
        <div style={{fontFamily: MONO, fontSize: 15, letterSpacing: '0.3em', color: A.lime}}>ROUTED</div>
      </div>

      <div style={{position: 'absolute', left: 1000, top: 290, width: 820}}>
        {SPLIT.map((s, i) => {
          const p = prog(f, 20 + i * 12, 18, expoOut);
          return (
            <div key={s.k} style={{display: 'flex', alignItems: 'center', gap: 30, height: 128, borderBottom: '1px solid rgba(255,255,255,0.08)', opacity: p, transform: `translateX(${(1 - p) * 60}px)`}}>
              <div style={{width: 190, fontFamily: DISPLAY, fontWeight: 900, fontSize: 92, color: s.c, textShadow: i === 0 ? `0 0 30px ${A.lime}88` : undefined}}>{s.v}%</div>
              <div>
                <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 32, color: A.white}}>{s.k}</div>
                <div style={{fontFamily: MONO, fontSize: 18, color: A.dim, marginTop: 6, letterSpacing: '0.08em'}}>{s.d}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', top: 960, width: '100%', textAlign: 'center', fontFamily: MONO, fontSize: 17, letterSpacing: '0.3em', color: A.dim, opacity: prog(f, 80, 16)}}>
        ONCE VERIFIED FEE ROUTING IS ACTIVE
      </div>
    </AbsoluteFill>
  );
};
