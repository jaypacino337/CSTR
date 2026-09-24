import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, DISPLAY, MONO, inOut, lerp, prog} from '../theme';
import {FadeWords, INK, SOFT} from '../premium/ui';

// Architecture: the venues stay underneath; TopBlast is the layer you launch WITH.
const W = 900;
const PLATES = [
  {key: 'venues', y: 600, title: 'PUMP.FUN + STONKFUN', sub: 'LAUNCH RAILS', edge: 'rgba(160,210,255,0.8)', face: 'linear-gradient(90deg, rgba(44,123,255,0.28), rgba(20,22,30,0.5) 50%, rgba(25,195,125,0.28))', dots: 'rgba(200,230,255,0.25)'},
  {key: 'topblast', y: 390, title: 'TOPBLAST', sub: 'REWARD INFRASTRUCTURE', edge: C.orangeHot, face: 'linear-gradient(180deg, rgba(255,138,31,0.26), rgba(255,90,20,0.08))', dots: 'rgba(255,190,140,0.5)'},
];

export const Stack: React.FC = () => {
  const f = useCurrentFrame();
  const venues = prog(f, 2, 24, inOut);
  const top = prog(f, 20, 28, inOut);
  const links = prog(f, 42, 16, inOut);
  const out = prog(f, 92, 12, inOut);

  return (
    <AbsoluteFill style={{background: INK, opacity: 1 - out}}>
      <div style={{position: 'absolute', left: 160, top: 140, width: 1600, height: 700, background: 'radial-gradient(ellipse at 50% 45%, rgba(255,106,0,0.09), transparent 60%)'}} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: links}}>
        {[760, 960, 1160].map((x) => (
          <g key={x}>
            <line x1={x} x2={x} y1={570} y2={420} stroke="rgba(255,255,255,0.14)" />
            <line x1={x} x2={x} y1={570} y2={420} stroke={C.orangeHot} strokeWidth={2} strokeDasharray="10 140" strokeDashoffset={f * 3 + x} />
          </g>
        ))}
      </svg>
      {PLATES.map((p) => {
        const inP = p.key === 'venues' ? venues : top;
        const dy = p.key === 'venues' ? (1 - inP) * 40 : (1 - inP) * -120;
        return (
          <div key={p.key} style={{position: 'absolute', left: 960 - W / 2, top: p.y - 140, width: W, height: 280, perspective: 1600, opacity: inP, transform: `translateY(${dy}px)`}}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                transform: 'rotateX(64deg)',
                borderRadius: 18,
                border: `1.5px solid ${p.edge}`,
                backgroundImage: `radial-gradient(${p.dots} 1.2px, transparent 1.6px), ${p.face}`,
                backgroundSize: '28px 28px, 100% 100%',
                boxShadow: p.key === 'topblast' ? `0 0 ${40 * top}px rgba(255,106,0,0.25)` : undefined,
              }}
            />
          </div>
        );
      })}
      {PLATES.map((p, i) => {
        const l = prog(f, 30 + i * 10, 16, inOut);
        return (
          <div key={p.key} style={{position: 'absolute', left: 960 + W / 2 - 30, top: p.y - 26, opacity: l, display: 'flex', alignItems: 'center', gap: 16}}>
            <div style={{width: 60 * l, height: 1, background: 'rgba(255,255,255,0.35)'}} />
            <div>
              <div style={{fontFamily: DISPLAY, fontWeight: 800, fontStretch: '112%', fontSize: 26, color: p.key === 'topblast' ? '#FFB27A' : C.white, whiteSpace: 'nowrap'}}>{p.title}</div>
              <div style={{fontFamily: MONO, fontSize: 12, letterSpacing: '0.3em', color: SOFT, marginTop: 4, whiteSpace: 'nowrap'}}>{p.sub}</div>
            </div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 960 - W / 2 - 250, top: 374, width: 220, textAlign: 'right', fontFamily: MONO, fontSize: 12, letterSpacing: '0.26em', color: '#FFB27A', opacity: prog(f, 46, 14, inOut)}}>
        YOU LAUNCH WITH
      </div>
      <div style={{position: 'absolute', left: 960 - W / 2 - 250, top: 584, width: 220, textAlign: 'right', fontFamily: MONO, fontSize: 12, letterSpacing: '0.26em', color: SOFT, opacity: prog(f, 46, 14, inOut)}}>
        STAYS UNDERNEATH
      </div>

      <div style={{position: 'absolute', left: 0, right: 0, top: 800}}>
        <FadeWords segments="EXISTING LIQUIDITY." start={52} size={46} weight={700} tracking={0.02} style={{color: C.white}} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 862}}>
        <FadeWords segments="NEW HOLDER MECHANICS." start={64} size={46} weight={700} tracking={0.02} style={{color: '#FFB27A'}} />
      </div>
    </AbsoluteFill>
  );
};
