import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {C, DISPLAY, MONO, UI, expoOut, inOut, lerp, prog} from '../theme';
import {FadeWords, INK, SOFT} from '../premium/ui';

// Whole system → collapse into the mark → final lines, held.
const LX = 960;
const LY = 250;
const LS = 230;
const ROWS = [
  {y: 770, title: 'PUMP.FUN + STONKFUN', sub: 'LAUNCH INFRASTRUCTURE', line: `linear-gradient(90deg, ${C.blueHot}, ${C.greenHot})`, tc: C.white},
  {y: 610, title: 'TOPBLAST', sub: 'REWARD INFRASTRUCTURE', line: C.orangeHot, tc: '#FFB27A'},
  {y: 450, title: 'HOLDERS', sub: 'BLAST ZONE REWARDS', line: '#FFB27A', tc: C.white},
  {y: 290, title: '$TOPBLAST', sub: 'BUYBACK + BURN LOOP', line: '#FF5A2E', tc: '#FFB27A'},
];
export const COLLAPSE_F = 72;
export const LIGHT_F = 92;
export const IMPACT_F = 120;

export const Finale: React.FC = () => {
  const f = useCurrentFrame();
  const cam = prog(f, 0, 44, inOut);
  const collapse = prog(f, COLLAPSE_F, 26, inOut);
  const dim = prog(f, COLLAPSE_F + 12, 18, inOut);
  const light = prog(f, LIGHT_F, IMPACT_F - LIGHT_F, inOut);
  const bloom = prog(f, IMPACT_F, 30, expoOut);

  return (
    <AbsoluteFill style={{background: INK}}>
      <div style={{position: 'absolute', left: LX - 520, top: LY - 420, width: 1040, height: 900, background: 'radial-gradient(circle, rgba(255,106,0,0.2), transparent 60%)', opacity: 0.25 + bloom * 0.6}} />

      {/* system map */}
      <AbsoluteFill style={{transform: `scale(${lerp(1.18, 1, cam)})`, transformOrigin: '960px 540px', opacity: 1 - collapse}}>
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <line x1={LX} x2={LX} y1={ROWS[0].y} y2={lerp(ROWS[0].y, ROWS[3].y, prog(f, 6, 40, inOut))} stroke="rgba(255,255,255,0.16)" />
          <line x1={LX} x2={LX} y1={ROWS[0].y} y2={ROWS[3].y} stroke={C.orangeHot} strokeWidth={2} strokeDasharray="8 90" strokeDashoffset={f * 3} opacity={prog(f, 40, 10)} />
        </svg>
        {ROWS.map((r, i) => {
          const p = prog(f, 4 + i * 10, 18, inOut);
          const cy = lerp(r.y, LY, collapse);
          const w = lerp(760, 40, collapse);
          return (
            <div key={r.title} style={{position: 'absolute', left: LX - w / 2, top: cy, width: w, opacity: p}}>
              <div style={{height: 2, background: r.line, boxShadow: '0 0 12px rgba(255,106,0,0.35)'}} />
              <div style={{position: 'absolute', left: 0, top: -46, fontFamily: DISPLAY, fontWeight: 800, fontStretch: '112%', fontSize: 28, color: r.tc, whiteSpace: 'nowrap', opacity: 1 - collapse * 2}}>{r.title}</div>
              <div style={{position: 'absolute', right: 0, top: -38, fontFamily: MONO, fontSize: 13, letterSpacing: '0.28em', color: SOFT, whiteSpace: 'nowrap', opacity: 1 - collapse * 2}}>{r.sub}</div>
            </div>
          );
        })}
      </AbsoluteFill>

      {/* the mark: dim → lit from the bottom up */}
      <div style={{position: 'absolute', left: LX - LS / 2, top: LY - LS / 2, width: LS, height: LS}}>
        <Img src={staticFile('logo.png')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: dim * 0.5, filter: 'grayscale(0.7) brightness(0.45)'}} />
        <Img
          src={staticFile('logo.png')}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            clipPath: `inset(${(1 - light) * 100}% 0 0 0)`,
            filter: `drop-shadow(0 0 1.5px rgba(255,200,160,0.9)) drop-shadow(0 0 ${14 + bloom * 14}px rgba(255,106,0,${0.35 + 0.2 * bloom}))`,
          }}
        />
        {light > 0 && light < 1 && (
          <div style={{position: 'absolute', left: -30, right: -30, top: (1 - light) * LS - 1, height: 1.5, background: '#FFD2A8', boxShadow: `0 0 12px ${C.orange}`, opacity: Math.sin(light * Math.PI)}} />
        )}
      </div>

      <div style={{position: 'absolute', left: 0, right: 0, top: 420}}>
        <FadeWords
          segments={[
            {text: 'TOP', gradient: 'linear-gradient(180deg, #FFFFFF 0%, #E9E4DC 60%, #B7B1A8 100%)'},
            {text: 'BLAST', gradient: `linear-gradient(180deg, #FFB067 0%, ${C.orange} 55%, ${C.red} 100%)`},
          ]}
          start={IMPACT_F + 2}
          dur={30}
          size={140}
          font={DISPLAY}
          weight={900}
          stretch={125}
          tracking={0.01}
          stagger={3}
        />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 612}}>
        <FadeWords segments="LAUNCH WITH TOPBLAST." start={IMPACT_F + 14} size={38} font={UI} weight={700} tracking={0.2} stagger={4} style={{color: C.white}} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 666}}>
        <FadeWords segments="REWARD THE BLAST ZONE." start={IMPACT_F + 22} size={38} font={UI} weight={700} tracking={0.2} stagger={4} style={{color: C.orangeHot}} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 758, textAlign: 'center', fontFamily: MONO, fontSize: 18, letterSpacing: '0.4em', color: SOFT, opacity: prog(f, IMPACT_F + 36, 18, inOut)}}>
        YOUR ENTRY SETS THE LINE.
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 850, display: 'flex', justifyContent: 'center', opacity: prog(f, IMPACT_F + 50, 18, inOut)}}>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 18, letterSpacing: '0.26em', color: '#FFE3CC', padding: '14px 28px', borderRadius: 12, border: '1px solid rgba(255,138,31,0.5)', background: 'rgba(255,106,0,0.07)'}}>
          100% OF PROTOCOL REVENUE <span style={{color: C.orangeHot}}>→</span> BUYBACK + BURN
        </div>
      </div>
    </AbsoluteFill>
  );
};
