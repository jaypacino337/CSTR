import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {C, DISPLAY, MONO, UI, expoOut, inOut, lerp, prog} from '../theme';
import {FadeWords, INK, SOFT} from './ui';

// 22.9–28s. Blue data (StonkFun) and green data (Pump.fun) converge beneath the
// mark; the mark then illuminates bottom-to-top. One controlled impact. Hold.
const LX = 960;
const LY = 290;
const LS = 300;
const NODE_Y = 500;
export const LIGHT_F = 34;
export const IMPACT_F = 64;

export const Final: React.FC = () => {
  const f = useCurrentFrame();
  const draw = prog(f, 0, 30, inOut);
  const streamOut = prog(f, 56, 24, inOut);
  const node = prog(f, 24, 14, inOut);
  const stem = prog(f, 28, 10, inOut);
  const light = prog(f, LIGHT_F, IMPACT_F - LIGHT_F, inOut);
  const bloom = prog(f, IMPACT_F, 30, expoOut);
  const dimIn = prog(f, 2, 26, inOut);

  const path = (side: -1 | 1, i: number) => {
    const y0 = 380 + i * 60;
    const x0 = side < 0 ? -40 : 1960;
    return `M ${x0} ${y0} C ${LX + side * 700} ${y0}, ${LX + side * 260} ${NODE_Y + (i - 2) * 6}, ${LX + side * 8} ${NODE_Y}`;
  };

  return (
    <AbsoluteFill style={{background: INK}}>
      <div style={{position: 'absolute', left: LX - 500, top: LY - 400, width: 1000, height: 900, background: 'radial-gradient(circle, rgba(255,106,0,0.22), transparent 60%)', opacity: 0.3 + bloom * 0.7 - bloom * bloom * 0.25}} />

      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: 1 - streamOut}}>
        {([-1, 1] as const).map((side) =>
          [0, 1, 2, 3, 4].map((i) => {
            const col = side < 0 ? C.blueHot : C.greenHot;
            return (
              <g key={`${side}${i}`}>
                <path d={path(side, i)} pathLength={1} fill="none" stroke={col} strokeOpacity={0.3} strokeWidth={1.2} strokeDasharray={`${draw} 1`} />
                <path d={path(side, i)} pathLength={1} fill="none" stroke={col} strokeWidth={2} strokeLinecap="round" strokeDasharray="0.06 0.94" strokeDashoffset={-((f * 0.02 + i * 0.19) % 1)} opacity={draw > 0.2 ? 0.9 : 0} />
              </g>
            );
          }),
        )}
        <circle cx={LX} cy={NODE_Y} r={4 + node * 3} fill="#FFE3CC" opacity={node} />
        <circle cx={LX} cy={NODE_Y} r={10 + node * 40} fill="none" stroke={C.orangeHot} strokeOpacity={0.5 * node * (1 - node)} />
        <line x1={LX} x2={LX} y1={NODE_Y} y2={lerp(NODE_Y, LY + LS / 2 - 10, stem)} stroke={C.orangeHot} strokeWidth={1.5} style={{filter: 'drop-shadow(0 0 6px rgba(255,106,0,0.9))'}} />
      </svg>

      {/* mark: dim → illuminated from the bottom up */}
      <div style={{position: 'absolute', left: LX - LS / 2, top: LY - LS / 2, width: LS, height: LS}}>
        <Img src={staticFile('logo.png')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: dimIn * 0.5, filter: 'grayscale(0.7) brightness(0.45)'}} />
        <Img
          src={staticFile('logo.png')}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            clipPath: `inset(${(1 - light) * 100}% 0 0 0)`,
            filter: `drop-shadow(0 0 1.5px rgba(255,200,160,0.9)) drop-shadow(0 0 ${14 + bloom * 16}px rgba(255,106,0,${0.35 + 0.25 * bloom}))`,
          }}
        />
        {light > 0 && light < 1 && (
          <div style={{position: 'absolute', left: -30, right: -30, top: (1 - light) * LS - 1, height: 1.5, background: '#FFD2A8', boxShadow: `0 0 12px ${C.orange}`, opacity: Math.sin(light * Math.PI)}} />
        )}
      </div>

      <div style={{position: 'absolute', left: 0, right: 0, top: 500}}>
        <FadeWords
          segments={[
            {text: 'TOP', gradient: 'linear-gradient(180deg, #FFFFFF 0%, #E9E4DC 60%, #B7B1A8 100%)'},
            {text: 'BLAST', gradient: `linear-gradient(180deg, #FFB067 0%, ${C.orange} 55%, ${C.red} 100%)`},
          ]}
          start={IMPACT_F + 2}
          dur={30}
          size={150}
          font={DISPLAY}
          weight={900}
          stretch={125}
          tracking={0.01}
          stagger={3}
        />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 700}}>
        <FadeWords segments="LAUNCH ANYWHERE." start={IMPACT_F + 16} size={38} font={UI} weight={700} tracking={0.24} stagger={4} style={{color: C.white}} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 758}}>
        <FadeWords segments="REWARD THE BLAST ZONE." start={IMPACT_F + 24} size={38} font={UI} weight={700} tracking={0.24} stagger={4} style={{color: C.orangeHot}} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 860, textAlign: 'center', fontFamily: MONO, fontSize: 18, letterSpacing: '0.4em', color: SOFT, opacity: prog(f, IMPACT_F + 38, 20, inOut)}}>
        YOUR ENTRY SETS THE LINE.
      </div>
    </AbsoluteFill>
  );
};
