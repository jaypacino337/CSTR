import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, MONO, expoIn, expoOut, inOut, lerp, prog} from '../theme';
import {ZONE_LINE_Y} from './Entry';
import {FadeWords, HAIR, SOFT, ZoneField} from './ui';

// 15–20s. Inside the zone: wallet nodes. Above the line: a funded reservoir.
// Precise routes carry rewards only to eligible wallets. Creator sets the split.
const POOL_X = 960;
const POOL_Y = 236;
const POOL_W = 560;
const POOL_H = 84;
const WALLETS = [
  {x: 560, y: 540, s: 0.78, ok: true, id: '7xKq…3fA'},
  {x: 960, y: 540, s: 0.78, ok: false, id: 'Bn4r…Q8p'},
  {x: 1360, y: 540, s: 0.78, ok: true, id: 'F1zd…u2M'},
  {x: 380, y: 740, s: 1, ok: true, id: '9hWc…LtE'},
  {x: 760, y: 740, s: 1, ok: true, id: 'Qe7m…x0R'},
  {x: 1160, y: 740, s: 1, ok: true, id: 'Dk2v…9sN'},
  {x: 1540, y: 740, s: 1, ok: false, id: 'Hp5a…cY1'},
];
const eligible = WALLETS.filter((w) => w.ok);

export const Rewards: React.FC<{from: number}> = ({from}) => {
  const f = useCurrentFrame();
  const g = from + f;
  const pool = prog(f, 4, 22, inOut);
  const r = lerp(0.4, 0.8, prog(f, 98, 30, inOut));
  const fill = lerp(0, 0.5, prog(f, 8, 26, inOut)) + (r - 0.4) * 0.9;
  const creator = prog(f, 90, 20, inOut);
  const exit = prog(f, 128, 22, expoIn);

  return (
    <AbsoluteFill style={{transform: `translateY(${exit * -60}px) scale(${lerp(1, 0.42, exit)})`, transformOrigin: '960px 330px', opacity: 1 - exit}}>
      <ZoneField g={g} reveal={1} lineY={ZONE_LINE_Y} />

      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {eligible.map((w, i) => {
          const port = POOL_X + (w.x - POOL_X) * 0.32;
          const d = `M ${port} ${POOL_Y + POOL_H / 2} V ${ZONE_LINE_Y + 40 + (w.y < 600 ? 0 : 30)} H ${w.x} V ${w.y - 28 * w.s}`;
          const draw = prog(f, 34 + i * 5, 26, inOut);
          return (
            <g key={w.id}>
              <path d={d} pathLength={1} fill="none" stroke={C.orangeHot} strokeOpacity={0.45} strokeWidth={1.3} strokeDasharray={`${draw} 1`} strokeLinejoin="round" />
              {draw >= 1 &&
                [0, 0.34, 0.67].map((k) => (
                  <path
                    key={k}
                    d={d}
                    pathLength={1}
                    fill="none"
                    stroke="#FFE3CC"
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeDasharray="0.025 0.975"
                    strokeDashoffset={-((f * 0.014 + k) % 1)}
                    style={{filter: 'drop-shadow(0 0 4px rgba(255,106,0,0.9))'}}
                  />
                ))}
            </g>
          );
        })}
      </svg>

      {WALLETS.map((w, i) => {
        const inP = prog(f, 12 + i * 3, 18, inOut);
        const ei = eligible.indexOf(w);
        const lit = w.ok ? prog(f, 60 + ei * 5, 14, inOut) : 0;
        const size = 46 * w.s;
        return (
          <div key={w.id} style={{position: 'absolute', left: w.x - 90, top: w.y - size / 2, width: 180, textAlign: 'center', opacity: inP * (w.ok ? 1 : 0.45)}}>
            <div
              style={{
                margin: '0 auto',
                width: size,
                height: size,
                borderRadius: size / 2,
                border: `1.5px solid ${lit > 0.5 ? C.orangeHot : 'rgba(255,255,255,0.35)'}`,
                background: lit > 0.5 ? 'rgba(255,106,0,0.18)' : 'rgba(10,10,12,0.8)',
                boxShadow: lit > 0.5 ? `0 0 ${24 * lit}px rgba(255,106,0,0.55)` : undefined,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{width: size * 0.3, height: size * 0.3, borderRadius: size, background: lit > 0.5 ? '#FFE3CC' : 'rgba(255,255,255,0.4)'}} />
            </div>
            <div style={{fontFamily: MONO, fontSize: 13 * w.s + 2, letterSpacing: '0.12em', color: lit > 0.5 ? '#FFB27A' : SOFT, marginTop: 10}}>{w.ok ? (lit > 0.5 ? '+ REWARD' : w.id) : 'NOT ELIGIBLE'}</div>
          </div>
        );
      })}

      {/* reservoir */}
      <div
        style={{
          position: 'absolute',
          left: POOL_X - POOL_W / 2,
          top: POOL_Y - POOL_H / 2,
          width: POOL_W,
          height: POOL_H,
          borderRadius: 16,
          border: `1px solid rgba(255,138,31,0.6)`,
          background: 'rgba(14,12,12,0.9)',
          boxShadow: '0 0 40px rgba(255,106,0,0.18)',
          overflow: 'hidden',
          opacity: pool,
          transform: `translateY(${(1 - pool) * 14}px)`,
        }}
      >
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${Math.min(1, fill) * 100}%`, background: 'linear-gradient(90deg, rgba(255,106,0,0.55), rgba(255,160,70,0.35))'}} />
        <div style={{position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0 1px, transparent 1px 28px)'}} />
        <div style={{position: 'absolute', left: 24, top: 18, fontFamily: MONO, fontSize: 13, letterSpacing: '0.3em', color: '#FFE3CC'}}>REWARD POOL</div>
        <div style={{position: 'absolute', left: 24, bottom: 16, fontFamily: MONO, fontWeight: 700, fontSize: 22, color: C.white}}>{Math.round(Math.min(1, fill) * 100)}% FUNDED</div>
        <div style={{position: 'absolute', right: 24, top: 30, fontFamily: MONO, fontSize: 13, letterSpacing: '0.26em', color: C.greenHot, opacity: prog(f, 30, 10)}}>✓ DEPOSITED ON-CHAIN</div>
      </div>

      {/* creator split */}
      <div
        style={{
          position: 'absolute',
          left: 1330,
          top: 118,
          width: 480,
          padding: '24px 28px',
          borderRadius: 16,
          background: 'rgba(18,18,20,0.95)',
          border: `1px solid ${HAIR}`,
          boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
          opacity: creator,
          transform: `translateX(${(1 - creator) * 30}px)`,
          boxSizing: 'border-box',
        }}
      >
        <div style={{fontFamily: MONO, fontSize: 12, letterSpacing: '0.3em', color: SOFT}}>CREATOR ALLOCATION</div>
        <div style={{position: 'relative', height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.1)', marginTop: 26}}>
          <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${r * 100}%`, borderRadius: 3, background: C.orangeHot}} />
          <div style={{position: 'absolute', left: `calc(${r * 100}% - 9px)`, top: -6, width: 18, height: 18, borderRadius: 9, background: C.white, boxShadow: '0 2px 10px rgba(0,0,0,0.5)'}} />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 22, fontFamily: MONO}}>
          {[
            {k: 'HOLDERS', v: 90 * r, c: '#FFB27A'},
            {k: 'CREATOR', v: 90 * (1 - r), c: C.white},
            {k: 'PROTOCOL', v: 10, c: SOFT},
          ].map((x) => (
            <div key={x.k}>
              <div style={{fontSize: 11, letterSpacing: '0.24em', color: SOFT}}>{x.k}</div>
              <div style={{fontSize: 28, fontWeight: 700, color: x.c, marginTop: 4}}>{Math.round(x.v)}%</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{position: 'absolute', left: 0, right: 0, top: 84}}>
        <div style={{position: 'absolute', left: 0, right: 0}}>
          <FadeWords
            segments={[
              {text: 'FUNDED ', color: '#FFB27A'},
              {text: 'HOLDER REWARDS', color: C.white},
            ]}
            start={16}
            size={44}
            weight={700}
            tracking={0.02}
            exitAt={82}
          />
        </div>
        <div style={{position: 'absolute', left: 0, right: 0}}>
          <FadeWords
            segments={[
              {text: 'CREATORS ', color: C.white},
              {text: 'SET THE SPLIT.', color: '#FFB27A'},
            ]}
            start={96}
            size={44}
            weight={700}
            tracking={0.02}
          />
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 960, textAlign: 'center', fontFamily: MONO, fontSize: 14, letterSpacing: '0.3em', color: SOFT, opacity: prog(f, 60, 16) * (1 - prog(f, 120, 10))}}>
        ELIGIBLE AT SNAPSHOT · SELLS OR TRANSFERS OUT EXCLUDE THE WALLET
      </div>
    </AbsoluteFill>
  );
};
