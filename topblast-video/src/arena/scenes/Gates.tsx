import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Flash, Glow, GridFloor, Particles} from '../../components/Atmosphere';
import {KineticLine} from '../../components/Type';
import {DISPLAY, MONO, UI, backOut, expoOut, inOut, lerp, prog} from '../../theme';
import {A, TICKERS} from '../theme';

// 3–7s: the colosseum façade; each gate lifts to reveal a tokenized stock.
const AW = 236;
const AH = 330;
const GAP = 44;
const X0 = 960 - (6 * AW + 5 * GAP) / 2;
const TOP = 380;

export const Gates: React.FC = () => {
  const f = useCurrentFrame();
  const build = prog(f, 0, 20);
  const push = prog(f, 0, 132, inOut);
  const flashIn = Math.max(0, 1 - f / 12);

  return (
    <AbsoluteFill style={{background: A.bg, overflow: 'hidden'}}>
      <Glow x={960} y={820} size={2000} color="rgba(216,255,26,0.18)" />
      <GridFloor color="rgba(216,255,26,0.2)" speed={4 + push * 8} horizon={800} />
      <Particles count={90} seed="gates" color={A.limeHot} speed={1} opacity={0.45} maxSize={1.8} />

      <AbsoluteFill style={{transform: `scale(${lerp(0.98, 1.1, push)}) translateY(${(1 - build) * 60}px)`, transformOrigin: '960px 560px', opacity: build}}>
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <defs>
            <linearGradient id="stone" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FFFFFF" />
              <stop offset="1" stopColor="#CFD2C8" />
            </linearGradient>
            <filter id="limeGlow" x="-20%" y="-50%" width="140%" height="200%">
              <feGaussianBlur stdDeviation="7" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* top ring band, echoing the logo */}
          <path d={`M ${X0 - 60} ${TOP - 20} Q 960 ${TOP - 190} ${1920 - X0 + 60} ${TOP - 20}`} stroke="url(#stone)" strokeWidth={46} fill="none" strokeLinecap="round" />
          <path d={`M ${X0 + 20} ${TOP - 62} Q 960 ${TOP - 200} ${1920 - X0 - 20} ${TOP - 62}`} stroke={A.lime} strokeWidth={5} fill="none" filter="url(#limeGlow)" strokeDasharray="1" pathLength={1} strokeDashoffset={1 - prog(f, 10, 30, inOut)} />
          {/* façade */}
          <rect x={X0 - 60} y={TOP} width={6 * AW + 5 * GAP + 120} height={AH + 50} rx={10} fill="url(#stone)" />
          {TICKERS.map((_, i) => {
            const x = X0 + i * (AW + GAP);
            const r = AW / 2;
            return <path key={i} d={`M ${x} ${TOP + AH + 50} L ${x} ${TOP + 30 + r} A ${r} ${r} 0 0 1 ${x + AW} ${TOP + 30 + r} L ${x + AW} ${TOP + AH + 50} Z`} fill="#070708" />;
          })}
          {/* base glow rail with ticks, like the logo */}
          <line x1={X0 - 80} x2={1920 - X0 + 80} y1={TOP + AH + 64} y2={TOP + AH + 64} stroke={A.lime} strokeWidth={6} filter="url(#limeGlow)" />
          {new Array(15).fill(0).map((_, i) => {
            const x = X0 - 40 + i * ((6 * AW + 5 * GAP + 80) / 14);
            return <line key={i} x1={x} x2={x - 16} y1={TOP + AH + 64} y2={TOP + AH + 96} stroke={A.lime} strokeWidth={4} filter="url(#limeGlow)" opacity={0.8} />;
          })}
        </svg>

        {TICKERS.map((tk, i) => {
          const x = X0 + i * (AW + GAP);
          const open = prog(f, 22 + i * 7, 20, inOut);
          const show = prog(f, 28 + i * 7, 18, backOut);
          const tickUp = Math.sin(f / 6 + i) * 0.4;
          const pct = tk.c + tickUp * 0.3;
          const up = pct >= 0;
          return (
            <div key={tk.t} style={{position: 'absolute', left: x, top: TOP + 30, width: AW, height: AH + 20, overflow: 'hidden', borderRadius: `${AW / 2}px ${AW / 2}px 0 0`}}>
              <div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 100%, rgba(216,255,26,${0.35 * open}), transparent 70%)`}} />
              <div style={{position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', opacity: show, transform: `scale(${0.7 + 0.3 * show})`}}>
                <div style={{fontFamily: DISPLAY, fontWeight: 900, fontStretch: '115%', fontSize: 40, color: A.white}}>{tk.t}</div>
                <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 24, color: A.white, marginTop: 10}}>${(tk.p * (1 + pct / 100)).toFixed(2)}</div>
                <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 22, color: up ? A.lime : A.down, marginTop: 6, textShadow: up ? `0 0 12px ${A.lime}` : undefined}}>
                  {up ? '▲' : '▼'} {Math.abs(pct).toFixed(2)}%
                </div>
              </div>
              {/* portcullis */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: -open * (AH + 40),
                  height: AH + 20,
                  backgroundImage: `repeating-linear-gradient(90deg, #2A2C24 0 10px, transparent 10px 34px), repeating-linear-gradient(0deg, #2A2C24 0 8px, transparent 8px 44px)`,
                  borderBottom: `4px solid ${A.lime}`,
                  boxShadow: `0 6px 20px ${A.lime}66`,
                }}
              />
            </div>
          );
        })}
      </AbsoluteFill>

      <div style={{position: 'absolute', top: 96, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 36}}>
        <KineticLine segments="REAL STOCKS." start={22} size={54} stretch={112} weight={800} style={{color: A.dim}} />
        <KineticLine segments="TOKENIZED." start={36} size={54} stretch={112} weight={800} style={{color: A.dim}} />
      </div>
      <div style={{position: 'absolute', top: 868, left: 0, right: 0}}>
        <KineticLine
          segments={[
            {text: 'ONE ', color: A.white},
            {text: 'ARENA.', gradient: `linear-gradient(180deg, ${A.limeHot}, ${A.limeDeep})`},
          ]}
          start={66}
          size={140}
          stagger={1.6}
        />
      </div>
      <div style={{position: 'absolute', top: 1022, width: '100%', textAlign: 'center', fontFamily: UI, fontSize: 18, letterSpacing: '0.36em', color: A.dim, opacity: prog(f, 84, 20, expoOut) * 0.85}}>
        AAPLx · TSLAx · NVDAx · AMZNx · MSFTx · GOOGLx
      </div>
      <Flash amount={flashIn * 0.8} color={A.limeDeep} />
    </AbsoluteFill>
  );
};
