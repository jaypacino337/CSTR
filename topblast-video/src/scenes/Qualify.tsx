import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Glow, Particles, Shockwave} from '../components/Atmosphere';
import {KineticLine} from '../components/Type';
import {C, DISPLAY, MONO, UI, backOut, expoOut, inOut, lerp, prog} from '../theme';

// 12–17s: qualification chain → funded pool splits to eligible wallets.
const STEPS = [
  {t: 'VERIFIED BUY', s: 'entry recorded on-chain'},
  {t: 'BELOW ENTRY', s: 'price under your line'},
  {t: 'STILL HOLDING', s: 'no sells or transfers out this epoch'},
  {t: 'BLAST ZONE', s: 'eligible at snapshot'},
];
const STEP_AT = [8, 24, 40, 56];
const NX = 150;
const NY = 150;
const NH = 130;
const GAP = 40;

const PX = 1330;
const PY = 470;
const WALLETS = [-90, -38, 10, 58, 122, 170, 218].map((deg, i) => {
  const a = (deg * Math.PI) / 180;
  return {x: PX + Math.cos(a) * 400, y: PY + Math.sin(a) * 290, i};
});
const ADDR = ['7xKq…3fA', 'Bn4r…Q8p', 'F1zd…u2M', '9hWc…LtE', 'Qe7m…x0R', 'Dk2v…9sN', 'Hp5a…cY1'];

const Check: React.FC<{on: number; hot?: boolean}> = ({on, hot}) => (
  <div
    style={{
      width: 58,
      height: 58,
      borderRadius: 29,
      border: `2px solid ${on > 0.5 ? (hot ? C.orangeHot : C.green) : 'rgba(255,255,255,0.18)'}`,
      background: on > 0.5 ? (hot ? `linear-gradient(135deg, ${C.orangeHot}, ${C.red})` : 'rgba(25,195,125,0.15)') : 'transparent',
      boxShadow: on > 0.5 ? `0 0 26px ${hot ? C.orange : C.green}` : undefined,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transform: `scale(${0.7 + 0.3 * on})`,
      flexShrink: 0,
    }}
  >
    <svg width={28} height={28} viewBox="0 0 28 28">
      <path d="M5 14 L11 20 L23 7" stroke={hot ? '#1A0800' : C.greenHot} strokeWidth={4} fill="none" strokeLinecap="round" strokeDasharray={30} strokeDashoffset={30 * (1 - on)} />
    </svg>
  </div>
);

const WalletIcon: React.FC<{lit: number}> = ({lit}) => (
  <svg width={46} height={40} viewBox="0 0 46 40">
    <rect x={2} y={6} width={42} height={32} rx={7} fill="none" stroke={lit > 0.5 ? C.orangeHot : 'rgba(255,255,255,0.5)'} strokeWidth={3} />
    <path d="M8 6 L32 1 L34 6" fill="none" stroke={lit > 0.5 ? C.orangeHot : 'rgba(255,255,255,0.5)'} strokeWidth={3} />
    <rect x={28} y={17} width={16} height={10} rx={4} fill={lit > 0.5 ? C.orangeHot : 'rgba(255,255,255,0.5)'} />
  </svg>
);

export const Qualify: React.FC = () => {
  const f = useCurrentFrame();
  const colIn = prog(f, 0, 18);
  const lineFill = prog(f, STEP_AT[0], STEP_AT[3] - STEP_AT[0] + 6, inOut);
  const poolIn = prog(f, 58, 22, backOut);
  const level = prog(f, 64, 26, inOut);
  const burst = prog(f, 90, 34, inOut);
  const rewardFlash = prog(f, 88, 26, expoOut);

  return (
    <AbsoluteFill style={{background: C.bg, overflow: 'hidden'}}>
      <Glow x={PX} y={PY} size={1300} color="rgba(255,90,0,0.45)" opacity={poolIn} />
      <Glow x={420} y={520} size={1100} color="rgba(255,255,255,0.05)" />
      <Particles count={90} seed="qual" color={C.orangeHot} speed={1.4} opacity={0.45} maxSize={2} />

      {/* qualification chain */}
      <div style={{position: 'absolute', left: NX, top: NY, opacity: colIn, transform: `translateX(${(1 - colIn) * -80}px)`}}>
        <div style={{position: 'absolute', left: 58, top: 60, width: 4, height: 3 * (NH + GAP), background: 'rgba(255,255,255,0.08)', borderRadius: 2}} />
        <div
          style={{
            position: 'absolute',
            left: 58,
            top: 60,
            width: 4,
            height: 3 * (NH + GAP) * lineFill,
            background: `linear-gradient(to bottom, ${C.green}, ${C.orangeHot})`,
            boxShadow: `0 0 16px ${C.orange}`,
            borderRadius: 2,
          }}
        />
        {STEPS.map((s, i) => {
          const on = prog(f, STEP_AT[i], 12, backOut);
          const hot = i === 3;
          return (
            <div
              key={s.t}
              style={{
                position: 'absolute',
                top: i * (NH + GAP),
                left: 0,
                width: 620,
                height: NH,
                borderRadius: 22,
                padding: '0 30px',
                display: 'flex',
                alignItems: 'center',
                gap: 26,
                background: hot && on > 0.5 ? 'linear-gradient(90deg, rgba(255,106,0,0.22), rgba(255,45,20,0.06))' : 'rgba(255,255,255,0.035)',
                border: `1px solid ${hot && on > 0.5 ? C.orange : on > 0.5 ? 'rgba(25,195,125,0.35)' : 'rgba(255,255,255,0.08)'}`,
                boxShadow: hot && on > 0.5 ? `0 0 60px rgba(255,90,0,0.45)` : undefined,
                transform: `translateX(${(1 - Math.min(on, 1)) * 24}px)`,
              }}
            >
              <Check on={Math.min(on, 1)} hot={hot} />
              <div>
                <div style={{fontFamily: DISPLAY, fontWeight: 900, fontStretch: '118%', fontSize: 42, color: hot && on > 0.5 ? C.orangeHot : on > 0.5 ? C.white : 'rgba(255,255,255,0.3)'}}>
                  {s.t}
                </div>
                <div style={{fontFamily: MONO, fontSize: 17, letterSpacing: '0.12em', color: C.dim, marginTop: 6, opacity: on}}>{s.s}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* reward pool */}
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <defs>
          <linearGradient id="liq" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={C.yellow} />
            <stop offset="0.45" stopColor={C.orange} />
            <stop offset="1" stopColor={C.red} />
          </linearGradient>
          <clipPath id="poolClip">
            <circle cx={PX} cy={PY} r={128} />
          </clipPath>
        </defs>
        {WALLETS.map((w) => {
          // streams from pool to each wallet
          const cx = (PX + w.x) / 2 + (w.y - PY) * 0.25;
          const cy = (PY + w.y) / 2 - (w.x - PX) * 0.25;
          const d = `M${PX},${PY} Q${cx},${cy} ${w.x},${w.y}`;
          return (
            <g key={w.i} opacity={burst > 0 ? 1 : 0}>
              <path d={d} pathLength={1} fill="none" stroke={C.orange} strokeOpacity={0.3} strokeWidth={2} strokeDasharray={`${burst} 1`} />
              {[0, 0.2, 0.4].map((k) => (
                <path
                  key={k}
                  d={d}
                  pathLength={1}
                  fill="none"
                  stroke={C.yellow}
                  strokeWidth={5}
                  strokeLinecap="round"
                  strokeDasharray="0.07 0.93"
                  strokeDashoffset={-Math.min(0.93, Math.max(0, burst * 1.5 - k - w.i * 0.03))}
                  style={{filter: `drop-shadow(0 0 6px ${C.orange})`}}
                  opacity={burst * 1.5 - k - w.i * 0.03 > 0 && burst * 1.5 - k - w.i * 0.03 < 0.95 ? 1 : 0}
                />
              ))}
            </g>
          );
        })}
        <g transform={`translate(${PX} ${PY}) scale(${poolIn}) translate(${-PX} ${-PY})`}>
          <circle cx={PX} cy={PY} r={150} fill="rgba(10,10,12,0.9)" stroke={C.orange} strokeWidth={3} style={{filter: `drop-shadow(0 0 20px ${C.orange})`}} />
          <circle cx={PX} cy={PY} r={170} fill="none" stroke="#FFB27A" strokeOpacity={0.4} strokeDasharray="3 9" transform={`rotate(${f * 1.5} ${PX} ${PY})`} />
          <g clipPath="url(#poolClip)">
            <path
              d={`M${PX - 140},${PY + 128 - level * 200 + Math.sin(f / 4) * 6} Q${PX - 70},${PY + 128 - level * 200 - 16} ${PX},${PY + 128 - level * 200 + Math.sin(f / 5) * 5} T${PX + 140},${PY + 128 - level * 200} L${PX + 140},${PY + 140} L${PX - 140},${PY + 140} Z`}
              fill="url(#liq)"
              opacity={0.95}
            />
          </g>
        </g>
      </svg>
      <div style={{position: 'absolute', left: PX - 150, top: PY - 44, width: 300, textAlign: 'center', opacity: poolIn}}>
        <div style={{fontFamily: MONO, fontSize: 16, letterSpacing: '0.3em', color: C.white, textShadow: '0 2px 10px #000'}}>REWARD POOL</div>
        <div style={{fontFamily: DISPLAY, fontWeight: 900, fontStretch: '118%', fontSize: 38, color: C.white, textShadow: '0 2px 16px #000', marginTop: 4, opacity: prog(f, 80, 10)}}>
          FUNDED ✓
        </div>
      </div>
      <Shockwave x={PX} y={PY} t={rewardFlash} maxR={520} color={C.yellow} />

      {WALLETS.map((w) => {
        const lit = prog(f, 96 + w.i * 3, 14, backOut);
        const wIn = prog(f, 66 + w.i * 2, 16);
        return (
          <div key={w.i} style={{position: 'absolute', left: w.x - 60, top: w.y - 48, width: 120, textAlign: 'center', opacity: wIn, transform: `scale(${0.7 + 0.3 * wIn + (lit > 0 && lit < 1 ? 0.12 * Math.sin(lit * Math.PI) : 0)})`}}>
            <div
              style={{
                margin: '0 auto',
                width: 74,
                height: 74,
                borderRadius: 18,
                background: lit > 0.5 ? 'rgba(255,106,0,0.16)' : 'rgba(255,255,255,0.05)',
                border: `1.5px solid ${lit > 0.5 ? C.orangeHot : 'rgba(255,255,255,0.18)'}`,
                boxShadow: lit > 0.5 ? `0 0 28px ${C.orange}` : undefined,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <WalletIcon lit={lit} />
            </div>
            <div style={{fontFamily: MONO, fontSize: 14, color: lit > 0.5 ? C.orangeHot : C.dim, marginTop: 8}}>{lit > 0.5 ? '+ REWARD' : ADDR[w.i]}</div>
          </div>
        );
      })}

      <div style={{position: 'absolute', top: 880, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 44}}>
        <KineticLine segments="FUNDED FIRST." start={100} size={78} stretch={116} style={{color: C.white}} />
        <KineticLine segments={[{text: 'REWARDED SECOND.', gradient: `linear-gradient(180deg, ${C.orangeHot}, ${C.red})`}]} start={114} size={78} stretch={116} />
      </div>
      <div style={{position: 'absolute', top: 1002, width: '100%', textAlign: 'center', fontFamily: UI, fontSize: 18, letterSpacing: '0.34em', color: C.dim, opacity: prog(f, 128, 16) * 0.8}}>
        A PERCENTAGE ON A SCREEN ISN'T A REWARD. DEPOSITED FUNDS ARE.
      </div>
    </AbsoluteFill>
  );
};
