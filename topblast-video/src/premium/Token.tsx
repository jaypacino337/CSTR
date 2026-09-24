import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, DISPLAY, MONO, UI, expoOut, inOut, lerp, prog} from '../theme';
import {HAIR, INK, SOFT} from './ui';

// Native token beat: 100% of launchpad revenue → buybacks; its own Blast Zone
// is paid in xSOL on a 15-minute cycle.
const CARD_T = 250;
const CARD_H = 560;
export const CYCLE_START = 26;
export const CYCLE_END = 78;

const card = (x: number, w: number, p: number): React.CSSProperties => ({
  position: 'absolute',
  left: x,
  top: CARD_T,
  width: w,
  height: CARD_H,
  borderRadius: 22,
  background: 'linear-gradient(180deg, rgba(20,20,22,0.96), rgba(11,11,13,0.98))',
  border: `1px solid ${HAIR}`,
  boxShadow: '0 40px 100px rgba(0,0,0,0.55)',
  opacity: p,
  transform: `translateY(${(1 - p) * 18}px)`,
  overflow: 'hidden',
});

export const Token: React.FC = () => {
  const f = useCurrentFrame();
  const inL = prog(f, 2, 20, inOut);
  const inR = prog(f, 8, 20, inOut);
  const pct = Math.round(100 * prog(f, 8, 34, expoOut));
  const flow = prog(f, 20, 20, inOut);
  const cycle = prog(f, CYCLE_START, CYCLE_END - CYCLE_START, inOut);
  const paid = prog(f, CYCLE_END, 24, inOut);
  const secs = Math.round(900 * (1 - cycle));
  const R = 118;
  const circ = 2 * Math.PI * R;
  const RX = 1370;
  const RY = CARD_T + 190;

  return (
    <AbsoluteFill style={{background: INK}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 140, textAlign: 'center', fontFamily: MONO, fontSize: 16, letterSpacing: '0.4em', color: '#FFB27A', opacity: prog(f, 0, 16)}}>
        NATIVE TOKEN
      </div>

      {/* 100% of launchpad revenue → buybacks */}
      <div style={card(200, 700, inL)}>
        <div style={{position: 'absolute', left: 48, top: 44, fontFamily: DISPLAY, fontWeight: 800, fontStretch: '112%', fontSize: 150, lineHeight: 1, color: C.white}}>
          {pct}
          <span style={{color: C.orangeHot}}>%</span>
        </div>
        <div style={{position: 'absolute', left: 52, top: 214, fontFamily: UI, fontWeight: 700, fontSize: 34, color: C.white, lineHeight: 1.2}}>
          of launchpad revenue
          <br />
          <span style={{color: '#FFB27A'}}>fuels buybacks.</span>
        </div>
        <svg width={700} height={CARD_H} style={{position: 'absolute', inset: 0}}>
          <line x1={250} x2={450} y1={440} y2={440} stroke="rgba(255,255,255,0.14)" strokeWidth={1.5} />
          <line x1={250} x2={lerp(250, 450, flow)} y1={440} y2={440} stroke={C.orangeHot} strokeWidth={1.5} />
          {flow >= 1 &&
            [0, 0.33, 0.66].map((k) => {
              const t = (f * 0.03 + k) % 1;
              return <circle key={k} cx={250 + 200 * t} cy={440} r={3.5} fill="#FFE3CC" opacity={Math.sin(t * Math.PI)} />;
            })}
          <path d="M 440 432 L 452 440 L 440 448" fill="none" stroke={C.orangeHot} strokeWidth={1.5} opacity={flow} />
        </svg>
        <div style={{position: 'absolute', left: 48, top: 408, width: 200, height: 64, borderRadius: 12, border: '1px solid rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 14, letterSpacing: '0.18em', color: C.white, textAlign: 'center', lineHeight: 1.3}}>
          LAUNCHPAD
          <br />
          REVENUE
        </div>
        <div style={{position: 'absolute', left: 460, top: 408, width: 200, height: 64, borderRadius: 12, border: `1px solid ${C.orangeHot}`, background: `rgba(255,106,0,${0.08 + 0.1 * flow})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 15, letterSpacing: '0.24em', color: '#FFE3CC', opacity: 0.4 + 0.6 * flow}}>
          BUYBACKS
        </div>
      </div>

      {/* xSOL to the Blast Zone every 15 minutes */}
      <div style={card(1020, 700, inR)}>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 150, background: 'linear-gradient(180deg, rgba(255,96,20,0.0), rgba(255,96,20,0.18))', borderTop: `1px solid rgba(255,138,31,${0.35 + 0.4 * paid})`}} />
        <div style={{position: 'absolute', left: 32, bottom: 112, fontFamily: MONO, fontSize: 12, letterSpacing: '0.3em', color: '#FFB27A'}}>BLAST ZONE</div>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const lit = prog(f, CYCLE_END + 4 + i * 3, 10, inOut);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 150 + i * 80,
                bottom: 52,
                width: 26,
                height: 26,
                borderRadius: 13,
                border: `1.5px solid ${lit > 0.5 ? C.orangeHot : 'rgba(255,255,255,0.3)'}`,
                background: lit > 0.5 ? 'rgba(255,106,0,0.25)' : 'transparent',
                boxShadow: lit > 0.5 ? `0 0 16px rgba(255,106,0,${0.6 * lit})` : undefined,
              }}
            />
          );
        })}
      </div>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: inR}}>
        <circle cx={RX} cy={RY} r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={4} />
        <circle
          cx={RX}
          cy={RY}
          r={R}
          fill="none"
          stroke={C.orangeHot}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={`${circ * cycle} ${circ}`}
          transform={`rotate(-90 ${RX} ${RY})`}
          style={{filter: 'drop-shadow(0 0 6px rgba(255,106,0,0.7))'}}
        />
        {new Array(60).fill(0).map((_, i) => {
          const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
          return <line key={i} x1={RX + Math.cos(a) * (R + 14)} y1={RY + Math.sin(a) * (R + 14)} x2={RX + Math.cos(a) * (R + (i % 5 ? 18 : 24))} y2={RY + Math.sin(a) * (R + (i % 5 ? 18 : 24))} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />;
        })}
        {/* payout routes from the cycle to the zone */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const tx = 1020 + 163 + i * 80;
          const ty = CARD_T + CARD_H - 65;
          const d = `M ${RX} ${RY + R} V ${RY + R + 40} H ${tx} V ${ty}`;
          return (
            <path
              key={i}
              d={d}
              pathLength={1}
              fill="none"
              stroke={C.orangeHot}
              strokeOpacity={0.5}
              strokeWidth={1.2}
              strokeDasharray={`${paid} 1`}
            />
          );
        })}
      </svg>
      <div style={{position: 'absolute', left: RX - 110, top: RY - 46, width: 220, textAlign: 'center', opacity: inR}}>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 44, color: paid > 0 ? '#FFE3CC' : C.white}}>
          {paid > 0 ? 'xSOL' : `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`}
        </div>
        <div style={{fontFamily: MONO, fontSize: 12, letterSpacing: '0.3em', color: paid > 0 ? C.greenHot : SOFT, marginTop: 8}}>{paid > 0 ? '✓ DISTRIBUTED' : 'NEXT PAYOUT'}</div>
      </div>
      <div style={{position: 'absolute', left: 1020, width: 700, top: CARD_T + CARD_H + 36, textAlign: 'center', fontFamily: UI, fontWeight: 700, fontSize: 30, color: C.white, opacity: prog(f, 30, 18, inOut)}}>
        <span style={{color: '#FFB27A'}}>xSOL</span> to the Blast Zone, every 15 minutes.
      </div>
    </AbsoluteFill>
  );
};
