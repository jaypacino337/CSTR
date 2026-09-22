import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {Flash, Glow, Particles} from '../../components/Atmosphere';
import {KineticLine} from '../../components/Type';
import {expoOut, inOut, lerp, prog} from '../../theme';
import {A} from '../theme';

// 0–3s: headline compresses into a blade of light; the helmet crest slashes up through it.
const LINE_Y = 560;
const COMPRESS = 50;
const LAUNCH = 61;
const HIT = 72;

export const Crest: React.FC<{h: number}> = ({h}) => (
  <svg width={h * 0.42} height={h} viewBox="0 0 84 200">
    <path d="M4 0 L40 0 L40 200 L22 200 Z" fill={A.white} />
    <path d="M44 0 L80 0 L62 200 L44 200 Z" fill={A.lime} />
  </svg>
);

export const ArenaIntro: React.FC = () => {
  const f = useCurrentFrame();
  const compress = prog(f, COMPRESS, 12, inOut);
  const lineOn = prog(f, COMPRESS + 6, 10, expoOut);
  const lineOut = prog(f, HIT + 6, 16, expoOut);
  const p = prog(f, LAUNCH, 22, (t) => t * t);
  const y = lerp(1250, -1500, p);
  const hit = prog(f, HIT, 18, expoOut);
  const flash = f < HIT ? 0 : Math.max(0, 1 - (f - HIT) / 12) * 0.7;
  const endFlash = prog(f, 84, 14, expoOut);
  const halfW = lerp(700, 1300, lineOn) + lineOut * 400;

  return (
    <AbsoluteFill style={{background: A.bg, overflow: 'hidden'}}>
      <Particles count={110} seed="aintro" color={A.limeHot} speed={0.6 + p * 6} opacity={0.7} maxSize={2.2} />
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
            {text: 'THE MARKET HAS A NEW ', color: A.white},
            {text: 'ARENA.', gradient: `linear-gradient(180deg, ${A.limeHot}, ${A.limeDeep})`},
          ]}
          start={6}
          size={76}
          stagger={1}
          tracking={0.04}
        />
      </AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 960 - halfW,
          width: halfW * 2,
          top: LINE_Y - 2,
          height: 4,
          background: `linear-gradient(90deg, transparent, ${A.lime} 20%, #FBFFE0 50%, ${A.lime} 80%, transparent)`,
          boxShadow: `0 0 24px ${A.lime}, 0 0 80px ${A.lime}`,
          opacity: lineOn * (1 - lineOut * 0.85),
        }}
      />
      {p > 0 && p < 1 && (
        <>
          <div style={{position: 'absolute', left: 960 - 60, width: 120, top: y + 300, height: 1600, background: `linear-gradient(to bottom, ${A.limeHot}, rgba(216,255,26,0.3) 30%, transparent 80%)`, filter: 'blur(18px)', mixBlendMode: 'screen'}} />
          <div style={{position: 'absolute', left: 960 - 84, top: y, filter: `drop-shadow(0 0 40px ${A.lime})`}}>
            <Crest h={400} />
          </div>
        </>
      )}
      {hit > 0 &&
        new Array(70).fill(0).map((_, i) => {
          const a = -Math.PI * (0.05 + random(`asa${i}`) * 0.9);
          const d = (200 + random(`asd${i}`) * 900) * hit;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 960 + Math.cos(a) * d * (random(`asx${i}`) > 0.5 ? 1 : -1),
                top: LINE_Y + Math.sin(a) * d * 0.6 + 600 * hit * hit,
                width: 3 + random(`asw${i}`) * 5,
                height: 3 + random(`asw${i}`) * 5,
                borderRadius: 3,
                background: i % 3 ? A.lime : A.white,
                boxShadow: `0 0 10px ${A.lime}`,
                opacity: 1 - hit,
              }}
            />
          );
        })}
      <Glow x={960} y={LINE_Y} size={1400 * (0.3 + hit)} color="rgba(216,255,26,0.55)" opacity={lineOn * (1 - hit) * 0.8} />
      <Flash amount={flash} color="#F4FFD0" />
      <Flash amount={endFlash * 0.7} color={A.limeDeep} />
    </AbsoluteFill>
  );
};
