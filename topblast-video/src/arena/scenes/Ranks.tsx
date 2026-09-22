import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Glow, Particles, Shockwave} from '../../components/Atmosphere';
import {KineticLine} from '../../components/Type';
import {DISPLAY, MONO, UI, backOut, expoOut, inOut, lerp, prog} from '../../theme';
import {A} from '../theme';
import {AgentMark} from './Fight';

// 12–17s: live leaderboard reshuffles twice; the leader takes the crown.
const AGENTS = [
  {n: 'ALPHA', tk: 'TSLAx', pnl: [9.4, 14.1, 16.8]},
  {n: 'OMEGA', tk: 'NVDAx', pnl: [6.2, 11.7, 21.3]},
  {n: 'TITAN', tk: 'AAPLx', pnl: [11.8, 12.9, 13.5]},
  {n: 'VORTEX', tk: 'AMZNx', pnl: [3.1, 2.4, 1.9]},
  {n: 'SPARTA', tk: 'MSFTx', pnl: [1.7, 4.2, 7.4]},
  {n: 'NOVA', tk: 'GOOGLx', pnl: [7.9, 8.8, 5.6]},
];
const ORDERS = [
  ['TITAN', 'ALPHA', 'NOVA', 'OMEGA', 'VORTEX', 'SPARTA'],
  ['ALPHA', 'TITAN', 'OMEGA', 'NOVA', 'SPARTA', 'VORTEX'],
  ['OMEGA', 'ALPHA', 'TITAN', 'SPARTA', 'NOVA', 'VORTEX'],
];
const SWAPS = [44, 84];
const ROW = 94;
const PX = 960 - 680;
const PY = 110;
const LIST_Y = 110;

const Crown: React.FC<{s: number}> = ({s}) => (
  <svg width={46 * s} height={34 * s} viewBox="0 0 46 34">
    <path d="M3 30 L6 8 L16 18 L23 3 L30 18 L40 8 L43 30 Z" fill={A.lime} style={{filter: `drop-shadow(0 0 8px ${A.lime})`}} />
  </svg>
);

const Spark: React.FC<{seed: number; color: string}> = ({seed, color}) => {
  const pts = new Array(16).fill(0).map((_, i) => `${i * 8},${26 - i * 1.1 - Math.sin(i * 1.4 + seed) * 7}`).join(' ');
  return (
    <svg width={124} height={40} viewBox="0 0 124 40">
      <polyline points={pts} fill="none" stroke={color} strokeWidth={2.5} />
    </svg>
  );
};

export const Ranks: React.FC = () => {
  const f = useCurrentFrame();
  const panel = prog(f, 0, 20);
  const s1 = prog(f, SWAPS[0], 18, inOut);
  const s2 = prog(f, SWAPS[1], 18, inOut);
  const phase = f < SWAPS[0] + 9 ? 0 : f < SWAPS[1] + 9 ? 1 : 2;
  const crown = prog(f, 104, 16, backOut);

  return (
    <AbsoluteFill style={{background: A.bg, overflow: 'hidden'}}>
      <Glow x={960} y={250} size={1500} color="rgba(216,255,26,0.2)" opacity={0.5 + crown * 0.5} />
      <Particles count={100} seed="ranks" color={A.limeHot} speed={1.2} opacity={0.4} maxSize={2} />
      <div
        style={{
          position: 'absolute',
          left: PX,
          top: PY,
          width: 1360,
          height: 690,
          borderRadius: 28,
          background: 'linear-gradient(170deg, rgba(26,27,22,0.85), rgba(8,8,7,0.94))',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 40px 120px rgba(0,0,0,0.7)',
          opacity: panel,
          transform: `perspective(2000px) rotateX(${lerp(12, 4, panel)}deg) translateY(${(1 - panel) * 60}px)`,
        }}
      >
        <div style={{position: 'absolute', left: 44, top: 30, right: 44, display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 16, letterSpacing: '0.28em', color: A.dim}}>
          <span>
            <span style={{color: A.lime}}>●</span> LIVE LEADERBOARD
          </span>
          <span>RANK · AGENT · MARKET · P&amp;L</span>
        </div>
        {AGENTS.map((ag, idx) => {
          const r0 = ORDERS[0].indexOf(ag.n);
          const r1 = ORDERS[1].indexOf(ag.n);
          const r2 = ORDERS[2].indexOf(ag.n);
          const rank = lerp(lerp(r0, r1, s1), r2, s2);
          const shownRank = ORDERS[phase].indexOf(ag.n);
          const pnl = lerp(lerp(ag.pnl[0], ag.pnl[1], s1), ag.pnl[2], s2);
          const top = shownRank === 0 && phase === 2;
          const rowIn = prog(f, 6 + idx * 3, 16);
          const moving = Math.abs(rank - Math.round(rank)) > 0.02;
          return (
            <div
              key={ag.n}
              style={{
                position: 'absolute',
                left: 30,
                right: 30,
                top: LIST_Y + rank * ROW,
                height: ROW - 12,
                borderRadius: 18,
                display: 'flex',
                alignItems: 'center',
                padding: '0 26px',
                gap: 26,
                background: top ? `linear-gradient(90deg, rgba(216,255,26,${0.22 * crown + 0.06}), rgba(216,255,26,0.02))` : 'rgba(255,255,255,0.035)',
                border: `1px solid ${top ? A.lime : 'rgba(255,255,255,0.06)'}`,
                boxShadow: top ? `0 0 ${50 * crown}px rgba(216,255,26,0.35)` : moving ? '0 20px 40px rgba(0,0,0,0.6)' : undefined,
                zIndex: moving ? 5 : 1,
                opacity: rowIn,
                transform: `translateX(${(1 - rowIn) * 40}px) scale(${moving ? 1.02 : 1})`,
              }}
            >
              <div style={{width: 64, fontFamily: DISPLAY, fontWeight: 900, fontStretch: '120%', fontSize: 40, color: top ? A.lime : A.dim}}>
                {String(shownRank + 1).padStart(2, '0')}
              </div>
              <AgentMark size={52} color={top ? A.lime : A.white} glow={top ? 1.5 : 0.5} />
              <div style={{width: 330, fontFamily: DISPLAY, fontWeight: 900, fontStretch: '115%', fontSize: 38, color: A.white, display: 'flex', alignItems: 'center', gap: 16}}>
                {ag.n}
                {top && crown > 0 && (
                  <span style={{transform: `scale(${crown})`, display: 'inline-flex'}}>
                    <Crown s={1} />
                  </span>
                )}
              </div>
              <div style={{width: 170, fontFamily: MONO, fontSize: 22, color: A.dim}}>{ag.tk}</div>
              <Spark seed={idx} color={top ? A.lime : 'rgba(255,255,255,0.5)'} />
              <div style={{flex: 1, textAlign: 'right', fontFamily: MONO, fontWeight: 700, fontSize: 34, color: top ? A.lime : A.white, textShadow: top ? `0 0 16px ${A.lime}` : undefined}}>
                +{pnl.toFixed(2)}%
              </div>
              {top && crown > 0.5 && (
                <div style={{position: 'absolute', right: 26, top: -16, fontFamily: MONO, fontWeight: 700, fontSize: 13, letterSpacing: '0.3em', padding: '5px 12px', borderRadius: 999, background: A.lime, color: '#101400'}}>
                  CHAMPION
                </div>
              )}
            </div>
          );
        })}
      </div>
      <Shockwave x={960} y={PY + LIST_Y + 40} t={prog(f, 104, 30, expoOut)} maxR={900} color={A.lime} />

      <div style={{position: 'absolute', top: 870, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 40}}>
        <KineticLine segments="CLIMB THE RANKS." start={100} size={80} stretch={116} style={{color: A.white}} />
        <KineticLine segments={[{text: 'TAKE THE CROWN.', gradient: `linear-gradient(180deg, ${A.limeHot}, ${A.limeDeep})`}]} start={114} size={80} stretch={116} />
      </div>
      <div style={{position: 'absolute', top: 994, width: '100%', textAlign: 'center', fontFamily: UI, fontSize: 19, letterSpacing: '0.34em', color: A.dim, opacity: prog(f, 128, 16)}}>
        EVERY TRADE SCORED. EVERY RANK EARNED.
      </div>
    </AbsoluteFill>
  );
};
