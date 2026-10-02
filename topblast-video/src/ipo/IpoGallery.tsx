import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {expoOut, inOut, lerp, prog} from '../theme';
import {Finale, Pumpios} from './IpoHype';
import tl from './gallery-timeline.json';

// IPO — one continuous camera move through a 3D gallery of the six IPO frames.
// Each panel: the camera settles square-on (slow push + light sweep), then pulls
// back, travels to the next angled panel and settles again. No slide cuts.
const LIME = '#7CF21A';
const W = 1920;
const H = 1080;
const N = tl.panels;
const HOLD = tl.hold;
const MOVE = tl.move;
const STEP = HOLD + MOVE;
const S = tl.scenes;

const PANELS = new Array(N).fill(0).map((_, i) => ({
  x: i * 2500,
  z: i % 2 ? -700 : 0,
  r: i % 2 ? -22 : 22,
  src: `ipo-g${i + 1}.jpg`,
}));

/** Camera state (panel index as a float) → world transform. */
const cameraAt = (f: number) => {
  const seg = Math.min(N - 1, Math.floor(f / STEP));
  const local = f - seg * STEP;
  const moving = seg < N - 1 && local > HOLD;
  const u = moving ? inOut((local - HOLD) / MOVE) : 0;
  const a = PANELS[seg];
  const b = PANELS[Math.min(N - 1, seg + 1)];
  const hold = moving ? 1 : local / HOLD;
  return {
    x: lerp(a.x, b.x, u),
    z: lerp(a.z, b.z, u),
    r: lerp(a.r, b.r, u),
    pull: Math.sin(Math.PI * u) * 2600 + (moving ? 0 : lerp(260, 0, inOut(Math.min(1, hold)))),
    seg,
    local,
    moving,
  };
};

export const Gallery: React.FC = () => {
  const f = useCurrentFrame();
  const cam = cameraAt(f);
  const intro = prog(f, 0, 30, expoOut);
  const exit = prog(f, S.gallery.dur - 24, 24, inOut);
  const world = `translateZ(${-cam.pull - (1 - intro) * 1600 - exit * 900}px) rotateY(${-cam.r}deg) translate3d(${-cam.x}px, 0px, ${-cam.z}px)`;

  return (
    <AbsoluteFill style={{background: '#F4F4F1', overflow: 'hidden', opacity: 1 - exit}}>
      <AbsoluteFill style={{perspective: 1500, perspectiveOrigin: '50% 50%'}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transformStyle: 'preserve-3d', transformOrigin: '50% 50%', transform: world}}>
          {/* grid floor */}
          <div
            style={{
              position: 'absolute',
              left: -4000,
              top: H / 2 + 620,
              width: 20000,
              height: 8000,
              transformOrigin: 'top center',
              transform: 'rotateX(90deg)',
              backgroundImage: 'linear-gradient(rgba(0,0,0,0.07) 2px, transparent 2px), linear-gradient(90deg, rgba(0,0,0,0.07) 2px, transparent 2px)',
              backgroundSize: '240px 240px',
            }}
          />
          {PANELS.map((p, i) => {
            const focus = i === cam.seg && !cam.moving;
            const sweep = focus ? prog(cam.local, 10, 36, inOut) : 0;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: W,
                  height: H,
                  transform: `translate3d(${p.x}px, 0px, ${p.z}px) rotateY(${p.r}deg)`,
                  boxShadow: '0 60px 140px rgba(0,0,0,0.22)',
                  borderRadius: 6,
                  overflow: 'hidden',
                  background: '#fff',
                }}
              >
                <Img src={staticFile(p.src)} style={{width: '100%', height: '100%', display: 'block'}} />
                {sweep > 0 && sweep < 1 && (
                  <div style={{position: 'absolute', top: -300, left: lerp(-600, 2300, sweep), width: 360, height: 1700, transform: 'rotate(22deg)', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)', mixBlendMode: 'screen'}} />
                )}
                <div style={{position: 'absolute', inset: 0, border: `3px solid ${LIME}`, opacity: cam.moving ? 0.9 : 0, boxShadow: `inset 0 0 40px rgba(124,242,26,0.35)`}} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const IpoGallery: React.FC<{withAudio?: boolean}> = ({withAudio = true}) => (
  <AbsoluteFill style={{background: '#F4F4F1'}}>
    <Sequence from={S.gallery.from} durationInFrames={S.gallery.dur} name="01 Gallery — six frames">
      <Gallery />
    </Sequence>
    <Sequence from={S.pumpios.from} durationInFrames={S.pumpios.dur} name="02 Pumpios">
      <FadeZoom dur={S.pumpios.dur}>
        <Pumpios />
      </FadeZoom>
    </Sequence>
    <Sequence from={S.finale.from} durationInFrames={S.finale.dur} name="03 Closer">
      <FadeZoom dur={S.finale.dur} last>
        <Finale />
      </FadeZoom>
    </Sequence>
    {withAudio && <Audio src={staticFile('ipo-gallery-score.wav')} />}
  </AbsoluteFill>
);

const FadeZoom: React.FC<{dur: number; last?: boolean; children: React.ReactNode}> = ({dur, last, children}) => {
  const f = useCurrentFrame();
  const i = prog(f, 0, 16, inOut);
  const o = last ? 0 : prog(f, dur - 12, 12, inOut);
  return <AbsoluteFill style={{opacity: Math.min(i, 1 - o), transform: `scale(${lerp(1.06, 1, i) * lerp(1, 0.96, o)})`}}>{children}</AbsoluteFill>;
};
