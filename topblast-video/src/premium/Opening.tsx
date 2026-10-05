import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {C, DISPLAY, inOut, lerp, prog} from '../theme';
import {FadeWords, INK} from './ui';

// 0–3.3s. Black → headline fades in → razor line draws → icon boots above →
// the line extends edge to edge and rises to become the TopBlast layer.
export const LAYER_Y = 300;
const TEXT_Y = 520;
const LINE_Y = 612;

export const Opening: React.FC = () => {
  const f = useCurrentFrame();
  const textOut = prog(f, 76, 14, inOut);
  const draw = prog(f, 34, 30, inOut);
  const boot = prog(f, 54, 26, inOut);
  const extend = prog(f, 78, 20, inOut);
  const lineW = lerp(lerp(0, 560, draw), 2000, extend);
  const lineY = lerp(LINE_Y, LAYER_Y, extend);
  const lineFade = 1 - prog(f, 92, 8);

  return (
    <AbsoluteFill style={{background: INK}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: TEXT_Y, opacity: 1 - textOut}}>
        <FadeWords
          segments={[
            {text: 'TOKEN LAUNCHING ', color: C.white},
            {text: 'EVOLVED.', color: C.orangeHot},
          ]}
          start={8}
          dur={34}
          stagger={7}
          size={66}
          font={DISPLAY}
          weight={800}
          stretch={112}
          tracking={0.08}
        />
      </div>

      {/* icon "booting": a scan edge rises through it, revealing it line by line */}
      <div style={{position: 'absolute', left: 960 - 80, top: 300, width: 160, height: 160, opacity: 1 - textOut}}>
        <Img
          src={staticFile('logo.png')}
          style={{
            width: '100%',
            height: '100%',
            clipPath: `inset(${(1 - boot) * 100}% 0 0 0)`,
            filter: `drop-shadow(0 0 1px rgba(255,190,140,0.8)) drop-shadow(0 0 14px rgba(255,106,0,${0.35 * boot}))`,
            opacity: 0.35 + 0.65 * boot,
          }}
        />
        {boot > 0 && boot < 1 && (
          <div style={{position: 'absolute', left: -20, right: -20, top: (1 - boot) * 160 - 1, height: 1.5, background: C.orangeHot, boxShadow: `0 0 10px ${C.orange}`, opacity: Math.sin(boot * Math.PI)}} />
        )}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 960 - lineW / 2,
          width: lineW,
          top: lineY - 0.75,
          height: 1.5,
          background: extend > 0 ? `linear-gradient(90deg, transparent, ${C.orangeHot} 8%, ${C.orangeHot} 92%, transparent)` : C.orangeHot,
          boxShadow: `0 0 ${6 + boot * 6}px rgba(255,106,0,0.7)`,
          opacity: lineFade,
        }}
      />
    </AbsoluteFill>
  );
};
