import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {C, MONO, UI, inOut, lerp, prog} from '../theme';
import {FadeWords, HAIR, INK, SOFT} from '../premium/ui';

// The $TOPBLAST loop: protocol revenue → buy $TOPBLAST → burn $TOPBLAST.
// Supply is shown as a grid of units that leave circulation — no flames.
const NX = 560;
const NODES = [
  {y: 300, label: 'PROTOCOL REVENUE', at: 16},
  {y: 480, label: 'BUY $TOPBLAST', at: 40},
  {y: 660, label: 'BURN $TOPBLAST', at: 62},
];
const NW = 380;
const NH = 86;
const GX = 1010;
const GY = 250;
const COLS = 18;
const ROWS = 10;
const STEP = 36;
export const BURN_START = 70;
const BURN_RATE = 0.42; // units per frame

const order = new Array(COLS * ROWS)
  .fill(0)
  .map((_, i) => ({i, k: random(`burn${i}`)}))
  .sort((a, b) => a.k - b.k)
  .map((o, rank) => ({...o, rank}))
  .sort((a, b) => a.i - b.i);

export const Loop: React.FC = () => {
  const f = useCurrentFrame();
  const inflow = prog(f, 0, 26, inOut);
  const gridIn = prog(f, 20, 24, inOut);
  const burned = Math.max(0, (f - BURN_START) * BURN_RATE);
  const supply = 1 - burned / (COLS * ROWS);
  const out = prog(f, 158, 12, inOut);

  return (
    <AbsoluteFill style={{background: INK, opacity: 1 - out}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 92, textAlign: 'center', fontFamily: MONO, fontSize: 15, letterSpacing: '0.42em', color: '#FFB27A', opacity: prog(f, 2, 16, inOut)}}>
        PROTOCOL ECONOMICS
      </div>

      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {/* revenue flowing into the system */}
        {[0, 1, 2, 3].map((i) => {
          const d = `M -40 ${210 + i * 40} C 160 ${210 + i * 40}, 220 300, ${NX - NW / 2} 300`;
          return (
            <g key={i}>
              <path d={d} pathLength={1} fill="none" stroke={C.orangeHot} strokeOpacity={0.35} strokeWidth={1.2} strokeDasharray={`${inflow} 1`} />
              <path d={d} pathLength={1} fill="none" stroke="#FFE3CC" strokeWidth={2} strokeLinecap="round" strokeDasharray="0.05 0.95" strokeDashoffset={-((f * 0.02 + i * 0.23) % 1)} opacity={inflow > 0.5 ? 0.9 : 0} />
            </g>
          );
        })}
        {/* chain links with packets */}
        {[0, 1].map((k) => {
          const y1 = NODES[k].y + NH / 2;
          const y2 = NODES[k + 1].y - NH / 2;
          const on = prog(f, NODES[k + 1].at - 8, 12, inOut);
          return (
            <g key={k}>
              <line x1={NX} x2={NX} y1={y1} y2={lerp(y1, y2, on)} stroke={C.orangeHot} strokeWidth={1.5} />
              <path d={`M ${NX - 7} ${y2 - 9} L ${NX} ${y2 - 1} L ${NX + 7} ${y2 - 9}`} fill="none" stroke={C.orangeHot} strokeWidth={1.5} opacity={on} />
              {on >= 1 &&
                [0, 0.5].map((q) => {
                  const t = (f * 0.03 + q) % 1;
                  return <circle key={q} cx={NX} cy={lerp(y1, y2, t)} r={3.5} fill="#FFE3CC" opacity={Math.sin(t * Math.PI)} />;
                })}
            </g>
          );
        })}
        {/* burn sink: rings contracting inward */}
        {[0, 1, 2].map((k) => {
          const t = (f * 0.02 + k / 3) % 1;
          return <circle key={k} cx={NX + NW / 2 + 70} cy={660} r={lerp(34, 6, t)} fill="none" stroke={C.red} strokeOpacity={0.7 * Math.sin(t * Math.PI) * prog(f, 62, 12)} strokeWidth={1.2} />;
        })}
      </svg>

      {NODES.map((n, i) => {
        const on = prog(f, n.at, 14, inOut);
        const burn = i === 2;
        return (
          <div
            key={n.label}
            style={{
              position: 'absolute',
              left: NX - NW / 2,
              top: n.y - NH / 2,
              width: NW,
              height: NH,
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 19,
              letterSpacing: '0.2em',
              color: on > 0.5 ? '#FFE3CC' : SOFT,
              background: on > 0.5 ? `rgba(255,${burn ? 60 : 106},${burn ? 20 : 0},0.12)` : 'rgba(18,18,20,0.95)',
              border: `1px solid ${on > 0.5 ? (burn ? '#FF5A2E' : C.orangeHot) : HAIR}`,
              boxShadow: on > 0.5 ? `0 0 ${26 * on}px rgba(255,90,20,0.3)` : undefined,
              opacity: prog(f, i * 8, 16, inOut),
            }}
          >
            {n.label}
          </div>
        );
      })}

      {/* supply grid */}
      <div style={{position: 'absolute', left: GX, top: GY - 44, fontFamily: MONO, fontSize: 13, letterSpacing: '0.3em', color: SOFT, opacity: gridIn}}>$TOPBLAST SUPPLY</div>
      <svg width={COLS * STEP} height={ROWS * STEP} style={{position: 'absolute', left: GX, top: GY, opacity: gridIn, overflow: 'visible'}}>
        {order.map(({i, rank}) => {
          const x = (i % COLS) * STEP + STEP / 2;
          const y = Math.floor(i / COLS) * STEP + STEP / 2;
          const age = burned - rank; // >0 once this unit starts burning
          if (age > 6) return null;
          const heat = Math.max(0, Math.min(1, age / 2.5));
          const gone = Math.max(0, Math.min(1, (age - 2.5) / 3.5));
          return (
            <rect
              key={i}
              x={x - 6 * (1 - gone) - 1}
              y={y - 6 * (1 - gone) - 1 + gone * 6}
              width={12 * (1 - gone) + 2}
              height={12 * (1 - gone) + 2}
              rx={3}
              fill={heat > 0 ? `rgba(255,${Math.round(lerp(220, 70, heat))},${Math.round(lerp(190, 20, heat))},1)` : 'rgba(247,244,238,0.55)'}
              opacity={1 - gone}
            />
          );
        })}
      </svg>
      <div style={{position: 'absolute', left: GX, top: GY + ROWS * STEP + 30, width: COLS * STEP, opacity: gridIn}}>
        <div style={{height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.08)', overflow: 'hidden'}}>
          <div style={{height: '100%', width: `${supply * 100}%`, background: 'rgba(247,244,238,0.7)'}} />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 10, fontFamily: MONO, fontSize: 12, letterSpacing: '0.26em', color: SOFT}}>
          <span>CIRCULATING</span>
          <span style={{color: burned > 0 ? '#FFB27A' : SOFT}}>SUPPLY ↓</span>
        </div>
      </div>

      <div style={{position: 'absolute', left: 0, right: 0, top: 852}}>
        <FadeWords segments="100% OF PROTOCOL REVENUE" start={92} size={50} font={UI} weight={800} tracking={0.01} style={{color: C.white}} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 918}}>
        <FadeWords segments="BUYS BACK + BURNS $TOPBLAST." start={104} size={50} font={UI} weight={800} tracking={0.01} style={{color: C.orangeHot}} />
      </div>
    </AbsoluteFill>
  );
};
