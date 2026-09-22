import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {Arrow} from '../components/Logo';
import {Flash, Glow, Particles} from '../components/Atmosphere';
import {KineticLine} from '../components/Type';
import {C, expoOut, inOut, lerp, prog} from '../theme';

// 0–3s: TOKEN LAUNCHING EVOLVED. → compresses to a line → arrow punches through.
const LINE_Y = 560;
const COMPRESS = 50;
const LAUNCH = 61;
const HIT = 72;

export const Intro: React.FC = () => {
  const f = useCurrentFrame();

  const compress = prog(f, COMPRESS, 12, inOut);
  const lineOn = prog(f, COMPRESS + 6, 10, expoOut);
  const lineOut = prog(f, HIT + 6, 16, expoOut);
  const arrowP = prog(f, LAUNCH, 22, (t) => t * t);
  const arrowY = lerp(1250, -1500, arrowP);
  const hit = prog(f, HIT, 18, expoOut);
  const flash = f < HIT ? 0 : Math.max(0, 1 - (f - HIT) / 12) * 0.7;
  const endFlash = prog(f, 84, 14, expoOut);

  return (
    <AbsoluteFill style={{background: C.bg, overflow: 'hidden'}}>
      <Particles count={110} seed="intro" color="#FFB27A" speed={0.6 + arrowP * 6} opacity={0.8} maxSize={2.2} />

      {/* Headline — squeezes vertically into the line */}
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          top: LINE_Y - 540,
          transform: `scaleY(${lerp(1, 0.02, compress)}) scaleX(${lerp(1 + f * 0.0006, 1.35, compress)})`,
          opacity: 1 - prog(f, COMPRESS + 8, 6),
          filter: `brightness(${1 + compress * 3})`,
        }}
      >
        <KineticLine
          segments={[
            {text: 'TOKEN LAUNCHING ', color: C.white},
            {text: 'EVOLVED.', gradient: `linear-gradient(90deg, ${C.orangeHot}, ${C.red})`},
          ]}
          start={6}
          size={82}
          stagger={1.1}
          tracking={0.04}
        />
      </AbsoluteFill>

      {/* The glowing horizon line */}
      <div
        style={{
          position: 'absolute',
          left: 960 - lerp(700, 1300, lineOn) - lineOut * 400,
          width: (lerp(700, 1300, lineOn) + lineOut * 400) * 2,
          top: LINE_Y - 2 + (hit > 0 ? Math.sin(f * 2.2) * 6 * (1 - hit) : 0),
          height: 4,
          background: `linear-gradient(90deg, transparent, ${C.orangeHot} 20%, #FFF1E0 50%, ${C.orangeHot} 80%, transparent)`,
          boxShadow: `0 0 24px ${C.orange}, 0 0 80px ${C.orange}`,
          opacity: lineOn * (1 - lineOut * 0.85),
        }}
      />

      {/* Arrow launch + exhaust column */}
      {arrowP > 0 && arrowP < 1 && (
        <>
          <div
            style={{
              position: 'absolute',
              left: 960 - 70,
              width: 140,
              top: arrowY + 200,
              height: 1600,
              background: `linear-gradient(to bottom, ${C.orangeHot}, rgba(255,60,0,0.4) 30%, transparent 80%)`,
              filter: 'blur(18px)',
              mixBlendMode: 'screen',
            }}
          />
          <div style={{position: 'absolute', left: 960 - 130, top: arrowY, filter: `drop-shadow(0 0 40px ${C.orange})`}}>
            <Arrow width={260} />
          </div>
        </>
      )}

      {/* Sparks from the impact point */}
      {hit > 0 &&
        new Array(70).fill(0).map((_, i) => {
          const a = -Math.PI * (0.05 + random(`sa${i}`) * 0.9);
          const d = (200 + random(`sd${i}`) * 900) * hit;
          const g = 600 * hit * hit;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 960 + Math.cos(a) * d * (random(`sx${i}`) > 0.5 ? 1 : -1),
                top: LINE_Y + Math.sin(a) * d * 0.6 + g,
                width: 3 + random(`sw${i}`) * 5,
                height: 3 + random(`sw${i}`) * 5,
                borderRadius: 3,
                background: i % 3 ? C.orangeHot : C.yellow,
                boxShadow: `0 0 10px ${C.orange}`,
                opacity: 1 - hit,
              }}
            />
          );
        })}
      <Glow x={960} y={LINE_Y} size={1400 * (0.3 + hit)} color="rgba(255,106,0,0.7)" opacity={lineOn * (1 - hit) * 0.8} />
      <Flash amount={flash} />
      <Flash amount={endFlash * 0.75} color="#FF6A00" />
    </AbsoluteFill>
  );
};
