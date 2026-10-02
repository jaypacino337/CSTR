import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {expoIn, expoOut, inOut, lerp, prog} from '../theme';
import {useCalm} from './calm';

/**
 * Camera-style scene transitions: a scene arrives from depth (small, blurred)
 * and leaves by flying *through* the lens (scale up, blur), so consecutive
 * scenes read as one continuous camera move rather than slides.
 */
export const SceneShell: React.FC<{
  dur: number;
  inDur?: number;
  outDur?: number;
  origin?: string;
  exitScale?: number;
  enterScale?: number;
  exitMode?: 'through' | 'collapse';
  children: React.ReactNode;
}> = ({
  dur,
  inDur = 14,
  outDur = 14,
  origin = '50% 50%',
  exitScale = 2.6,
  enterScale = 0.72,
  exitMode = 'through',
  children,
}) => {
  const frame = useCurrentFrame();
  const calm = useCalm();
  if (calm) {
    // Gentle cross-fade with a slow push: no fly-through, no heavy blur.
    const ci = prog(frame, 0, 14, inOut);
    const co = prog(frame, dur - 14, 14, inOut);
    return (
      <AbsoluteFill
        style={{
          transform: `scale(${lerp(1.03, 1, ci) * lerp(1, 0.985, co)})`,
          transformOrigin: '50% 50%',
          filter: co > 0.01 || ci < 0.99 ? `blur(${(1 - ci) * 4 + co * 4}px)` : undefined,
          opacity: ci * (1 - co),
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }
  const i = prog(frame, 0, inDur, expoOut);
  const o = prog(frame, dur - outDur, outDur, expoIn);
  const scale =
    lerp(enterScale, 1, i) * (exitMode === 'through' ? lerp(1, exitScale, o) : lerp(1, 0.02, o));
  const blur = (1 - i) * 18 + o * (exitMode === 'through' ? 26 : 8);
  const opacity = Math.min(i * 1.4, 1) * (1 - Math.pow(o, 1.6));
  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale})`,
        transformOrigin: origin,
        filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
        opacity,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
