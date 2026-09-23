import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, DISPLAY, MONO, inOut, lerp, prog} from '../theme';
import {FadeWords, INK, SOFT} from './ui';

// 19.7–23.3s. The reward network pulls back into a three-layer stack, then the
// diagram simplifies: plates turn edge-on into lines, leaving one sentence.
const PLATES = [
  {y: 330, top: 'TOPBLAST', sub: 'REWARD LAYER', edge: C.orangeHot, face: 'linear-gradient(180deg, rgba(255,138,31,0.26), rgba(255,90,20,0.08))', dots: 'rgba(255,190,140,0.5)'},
  {y: 545, top: 'PUMP.FUN + STONKFUN', sub: 'LAUNCH INFRASTRUCTURE', edge: 'rgba(160,210,255,0.8)', face: 'linear-gradient(90deg, rgba(44,123,255,0.26), rgba(20,22,30,0.5) 50%, rgba(25,195,125,0.26))', dots: 'rgba(200,230,255,0.25)'},
  {y: 760, top: 'TOKEN + LIQUIDITY', sub: '', edge: 'rgba(255,255,255,0.4)', face: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))', dots: 'rgba(255,255,255,0.15)'},
];
const W = 980;

export const Stack: React.FC = () => {
  const f = useCurrentFrame();
  const cam = prog(f, 0, 40, inOut);
  const collapse = prog(f, 60, 22, inOut);
  const out = prog(f, 96, 12, inOut);

  return (
    <AbsoluteFill style={{background: INK, opacity: 1 - out}}>
      <div style={{position: 'absolute', left: 960 - 900, top: 60, width: 1800, height: 900, background: 'radial-gradient(ellipse at 50% 30%, rgba(255,106,0,0.10), transparent 60%)'}} />
      <AbsoluteFill style={{transform: `scale(${lerp(1.55, 1, cam)})`, transformOrigin: '960px 330px'}}>
        {/* vertical data links between layers */}
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: prog(f, 20, 16) * (1 - collapse)}}>
          {[760, 960, 1160].map((x) =>
            [
              [545, 330],
              [760, 545],
            ].map(([y1, y2], k) => (
              <g key={`${x}${k}`}>
                <line x1={x} x2={x} y1={y1 - 30} y2={y2 + 30} stroke="rgba(255,255,255,0.14)" />
                <line x1={x} x2={x} y1={y1 - 30} y2={y2 + 30} stroke={k ? '#9FC8FF' : C.orangeHot} strokeWidth={2} strokeDasharray="10 150" strokeDashoffset={f * 3 + x} />
              </g>
            )),
          )}
        </svg>
        {PLATES.map((p, i) => {
          const inP = i === 0 ? 1 : prog(f, 10 + i * 8, 24, inOut);
          const gone = i === 2 ? collapse : 0;
          const rot = lerp(62, 89.4, collapse);
          return (
            <div key={p.top} style={{position: 'absolute', left: 960 - W / 2, top: p.y - 150, width: W, height: 300, perspective: 1600, opacity: inP * (1 - gone), transform: `translateY(${(1 - inP) * 40}px)`}}>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  transform: `rotateX(${rot}deg)`,
                  borderRadius: 18,
                  background: p.face,
                  border: `1.5px solid ${p.edge}`,
                  boxShadow: `0 0 40px ${i === 0 ? 'rgba(255,106,0,0.25)' : 'rgba(0,0,0,0)'}`,
                  backgroundImage: `radial-gradient(${p.dots} 1.2px, transparent 1.6px), ${p.face}`,
                  backgroundSize: '28px 28px, 100% 100%',
                }}
              />
            </div>
          );
        })}
      </AbsoluteFill>

      {/* labels with leader lines */}
      {PLATES.map((p, i) => {
        const l = prog(f, 26 + i * 6, 16, inOut) * (1 - collapse);
        return (
          <div key={p.top} style={{position: 'absolute', left: 960 + W / 2 - 40, top: p.y - 26, opacity: l, display: 'flex', alignItems: 'center', gap: 16}}>
            <div style={{width: 60 * l, height: 1, background: 'rgba(255,255,255,0.35)'}} />
            <div>
              <div style={{fontFamily: DISPLAY, fontWeight: 800, fontStretch: '112%', fontSize: 26, color: i === 0 ? '#FFB27A' : C.white, whiteSpace: 'nowrap'}}>{p.top}</div>
              {p.sub && <div style={{fontFamily: MONO, fontSize: 12, letterSpacing: '0.3em', color: SOFT, marginTop: 4, whiteSpace: 'nowrap'}}>{p.sub}</div>}
            </div>
          </div>
        );
      })}

      {/* the sentence that remains */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 590}}>
        <FadeWords
          segments={[
            {text: 'PUMP.FUN', color: C.greenHot},
            {text: ' + ', color: SOFT},
            {text: 'STONKFUN ', color: C.blueHot},
            {text: 'UNDERNEATH.', color: C.white},
          ]}
          start={70}
          size={46}
          weight={700}
          tracking={0.03}
        />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 240}}>
        <FadeWords
          segments={[
            {text: 'TOPBLAST ', color: C.orangeHot},
            {text: 'ON TOP.', color: C.white},
          ]}
          start={80}
          size={46}
          weight={700}
          tracking={0.03}
        />
      </div>
    </AbsoluteFill>
  );
};
