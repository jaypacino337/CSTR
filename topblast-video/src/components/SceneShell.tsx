import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {expoIn, expoOut, lerp, prog} from '../theme';

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
