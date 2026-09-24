import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {inOut, lerp, prog} from '../theme';
import {Finale, Pumpios} from './IpoHype';
import tl from './slides-timeline.json';

// IPO slideshow: the six designed IPO graphics as full frames (slow push /
// pan + a soft light sweep), clean left→right wipes with a thin lime edge,
// then the animated Pumpios scene and the branded closer.
const LIME = '#7CF21A';
const S = tl.scenes;

type Move = {s0: number; s1: number; x0: number; x1: number; y0: number; y1: number; ox: string};
const MOVES: Move[] = [
  {s0: 1.0, s1: 1.05, x0: 0, x1: 0, y0: 0, y1: 0, ox: '45% 50%'}, // gentle push
  {s0: 1.05, s1: 1.0, x0: 0, x1: 0, y0: 0, y1: 0, ox: '50% 60%'}, // pull back to reveal the steps
  {s0: 1.03, s1: 1.05, x0: 10, x1: -10, y0: 0, y1: 0, ox: '50% 50%'}, // slow pan along the conveyor
  {s0: 1.0, s1: 1.05, x0: 0, x1: 0, y0: 0, y1: -6, ox: '55% 45%'}, // push toward the coin
  {s0: 1.0, s1: 1.05, x0: 0, x1: 0, y0: 0, y1: 0, ox: '60% 50%'}, // push toward the presale display
  {s0: 1.0, s1: 1.04, x0: 0, x1: 0, y0: 0, y1: -4, ox: '55% 52%'}, // push toward the glowing doorway
];

/** Wipe in from the left with a thin glowing lime edge. */
const Wipe: React.FC<{children: React.ReactNode; first?: boolean}> = ({children, first}) => {
  const f = useCurrentFrame();
  const p = first ? 1 : prog(f, 0, 16, inOut);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`}}>{children}</AbsoluteFill>
      {p > 0 && p < 1 && <div style={{position: 'absolute', top: 0, bottom: 0, left: `${p * 100}%`, width: 3, marginLeft: -1.5, background: LIME, boxShadow: `0 0 18px ${LIME}, 0 0 40px ${LIME}`}} />}
    </AbsoluteFill>
  );
};

const Frame: React.FC<{n: number; dur: number; first?: boolean}> = ({n, dur, first}) => {
  const f = useCurrentFrame();
  const m = MOVES[n - 1];
  const t = prog(f, 0, dur, (x) => x);
  const e = inOut(t);
  const sweep = prog(f, 26, 40, inOut);
  const open = first ? prog(f, 0, 18, inOut) : 1;
  return (
    <Wipe first={first}>
      <AbsoluteFill style={{background: '#F6F6F4', overflow: 'hidden'}}>
        <Img
          src={staticFile(`ipo-g${n}.jpg`)}
          style={{
            width: '100%',
            height: '100%',
            transformOrigin: m.ox,
            transform: `translate(${lerp(m.x0, m.x1, e)}px, ${lerp(m.y0, m.y1, e)}px) scale(${lerp(m.s0, m.s1, e) * lerp(1.04, 1, open)})`,
            opacity: open,
            filter: open < 1 ? `blur(${(1 - open) * 6}px)` : undefined,
          }}
        />
        {/* soft light sweep */}
        {sweep > 0 && sweep < 1 && (
          <div
            style={{
              position: 'absolute',
              top: -300,
              left: lerp(-600, 2300, sweep),
              width: 360,
              height: 1700,
              transform: 'rotate(22deg)',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)',
              mixBlendMode: 'screen',
            }}
          />
        )}
      </AbsoluteFill>
    </Wipe>
  );
};

export const IpoSlides: React.FC<{withAudio?: boolean}> = ({withAudio = true}) => (
  <AbsoluteFill style={{background: '#F6F6F4'}}>
    {(['g1', 'g2', 'g3', 'g4', 'g5', 'g6'] as const).map((k, i) => (
      <Sequence key={k} from={S[k].from} durationInFrames={S[k].dur} name={`0${i + 1} Graphic ${i + 1}`}>
        <Frame n={i + 1} dur={S[k].dur} first={i === 0} />
      </Sequence>
    ))}
    <Sequence from={S.pumpios.from} durationInFrames={S.pumpios.dur} name="06 Pumpios">
      <Wipe>
        <Pumpios />
      </Wipe>
    </Sequence>
    <Sequence from={S.finale.from} durationInFrames={S.finale.dur} name="07 Closer">
      <Wipe>
        <Finale />
      </Wipe>
    </Sequence>
    {withAudio && <Audio src={staticFile('ipo-slides-score.wav')} />}
  </AbsoluteFill>
);
