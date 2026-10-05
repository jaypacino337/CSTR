import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {expoIn, expoOut, inOut, lerp, prog} from '../theme';
import {Ground, Slam, back} from './GfmHype';
import tl from './frog-timeline.json';

// Go Fund Meme — 8s mascot cut. The frog drops in, pitches the loop, then a heart
// wipe lands on the full logo lockup. Site palette + Geist.
const INK = '#183B2B';
const INK2 = '#607067';
const RULE = '#DFE7E0';
const GREEN = '#187C4D';
const DEEP = '#123C2B';
const LIME = '#C2F78A';
const MINT = '#EAF6EC';
const PINK = '#F2698A';
const GOLD = '#F2C230';
const SANS = '"Geist Variable", "Geist", sans-serif';
const MONO = '"Geist Mono Variable", "Geist Mono", monospace';
const S = tl.scenes;
const FROG_W = 788;
const FROG_H = 665;
const HEART = 'M45 18c-5-3-10 0-13 4-3-4-8-7-13-4-8 5-6 14 0 20l13 12 13-12c6-6 8-15 0-20Z';

const Heart: React.FC<{size: number; color: string; style?: React.CSSProperties}> = ({size, color, style}) => (
  <svg width={size} height={size} viewBox="4 10 56 46" style={style}>
    <path d={HEART} fill={color} />
  </svg>
);

// frog with drop, squash-and-stretch and idle bob
const Frog: React.FC<{f: number; h: number; drop?: number}> = ({f, h, drop = 0}) => {
  const land = drop + 10;
  const fall = prog(f, drop, 10, expoIn);
  const sq = f >= land ? Math.exp(-(f - land) / 5) * Math.cos((f - land) / 2.2) : 0;
  const bob = f > land + 14 ? Math.sin((f - land) / 7) * 6 : 0;
  const w = (h * FROG_W) / FROG_H;
  return (
    <div style={{width: w, height: h, transformOrigin: '50% 100%', transform: `translateY(${(1 - fall) * -900 + bob}px) scale(${1 + sq * 0.14}, ${1 - sq * 0.16})`}}>
      <Img src={staticFile('gfm/frog.png')} style={{width: w, height: h}} />
    </div>
  );
};

const Burst: React.FC<{f: number; at: number; x: number; y: number; n?: number; r?: number}> = ({f, at, x, y, n = 10, r = 420}) => {
  const p = prog(f, at, 26, expoOut);
  if (p <= 0 || p >= 1) return null;
  return (
    <>
      <div style={{position: 'absolute', left: x - r * p, top: y - r * p, width: r * 2 * p, height: r * 2 * p, borderRadius: '50%', border: `${10 * (1 - p)}px solid ${LIME}`, opacity: 1 - p}} />
      {new Array(n).fill(0).map((_, i) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2 + 0.3;
        const d = r * 0.9 * p;
        return <Heart key={i} size={lerp(26, 54, (i * 7) % 3 / 2)} color={i % 3 === 0 ? PINK : i % 3 === 1 ? '#7BD44A' : LIME} style={{position: 'absolute', left: x + Math.cos(a) * d - 20, top: y + Math.sin(a) * d - 20, opacity: 1 - p * p, transform: `scale(${lerp(0.4, 1.1, p)}) rotate(${(i % 2 ? 1 : -1) * 20 * p}deg)`}} />;
      })}
    </>
  );
};

// ── 1. drop ────────────────────────────────────────────────
const Drop: React.FC = () => {
  const f = useCurrentFrame();
  const mark = prog(f, 30, 10, inOut);
  return (
    <AbsoluteFill>
      <Ground f={f} />
      <Burst f={f} at={10} x={960} y={720} />
      <div style={{position: 'absolute', left: 960 - (560 * FROG_W) / FROG_H / 2, top: 400}}>
        <Frog f={f} h={560} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 110}}>
        <div style={{display: 'flex', justifyContent: 'center', gap: 30, alignItems: 'baseline'}}>
          <Slam text="Give your meme" start={14} size={118} stagger={3} />
          <span style={{position: 'relative', display: 'inline-block', opacity: Math.min(1, prog(f, 24, 9) * 2.5), transform: `scale(${lerp(1.45, 1, back(prog(f, 24, 9)))})`}}>
            <span style={{position: 'absolute', left: -16, right: -16, top: 26, bottom: 2, background: LIME, borderRadius: 14, transformOrigin: 'left', transform: `scaleX(${mark}) rotate(-1.5deg)`}} />
            <span style={{position: 'relative', fontFamily: SANS, fontWeight: 800, fontSize: 118, letterSpacing: '-0.045em', lineHeight: 1, color: GREEN}}>a mission.</span>
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── 2. the loop ────────────────────────────────────────────
const STEPS = ['Pick a fundraiser.', 'Launch a coin.', 'Creator fees fund it.'];
const How: React.FC = () => {
  const f = useCurrentFrame();
  const FX = 470;
  const FY = 330;
  const FH = 520;
  const meter = prog(f, 50, 40, inOut);
  const coinSrc = {x: 290, y: 760};
  const coinDst = {x: 1000 + 820 * Math.max(0.04, meter), y: 752};
  return (
    <AbsoluteFill>
      <Ground f={f + 54} />
      <div style={{position: 'absolute', left: FX - (FH * FROG_W) / FROG_H / 2, top: FY, transform: `translateX(${(1 - prog(f, 0, 12, expoOut)) * 400}px)`}}>
        <Frog f={f + 40} h={FH} drop={-40} />
      </div>
      {STEPS.map((s, k) => {
        const at = 6 + k * 13;
        const p = prog(f, at, 9);
        return (
          <div key={s} style={{position: 'absolute', left: 1000, top: 190 + k * 160, display: 'flex', alignItems: 'center', gap: 30, opacity: Math.min(1, p * 2.5), transform: `translateX(${(1 - expoOut(p)) * 60}px) scale(${lerp(1.3, 1, back(p))})`, transformOrigin: 'left center'}}>
            <div style={{width: 92, height: 92, borderRadius: 26, background: k === 2 ? LIME : '#fff', border: `2px solid ${k === 2 ? GREEN : RULE}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 16px 40px -20px rgba(18,60,43,0.4)'}}>
              {k === 2 ? <Heart size={56} color={GREEN} /> : <span style={{fontFamily: MONO, fontWeight: 600, fontSize: 32, color: GREEN}}>{`0${k + 1}`}</span>}
            </div>
            <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 76, letterSpacing: '-0.04em', color: INK, whiteSpace: 'nowrap'}}>{s}</div>
          </div>
        );
      })}
      {/* fee meter */}
      <div style={{position: 'absolute', left: 1000, top: 700, width: 820, opacity: prog(f, 44, 8)}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 18, letterSpacing: '0.1em', color: INK2}}>
          <span>EVERY CREATOR-FEE PAYMENT</span>
          <span style={{color: GREEN, fontWeight: 600}}>ON THE RECORD ✓</span>
        </div>
        <div style={{marginTop: 18, height: 34, borderRadius: 999, background: '#fff', boxShadow: `inset 0 0 0 2px ${RULE}`, overflow: 'hidden'}}>
          <div style={{width: `${Math.max(4, meter * 100)}%`, height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, #1F8B59, #7BD44A, #C2F78A)'}} />
        </div>
      </div>
      {/* gold coins fly from the frog's stack to the meter */}
      {new Array(12).fill(0).map((_, i) => {
        const t = prog(f, 44 + i * 3.2, 16, inOut);
        if (t <= 0 || t >= 1) return null;
        const qx = (coinSrc.x + coinDst.x) / 2;
        const qy = 420;
        const x = (1 - t) * (1 - t) * coinSrc.x + 2 * (1 - t) * t * qx + t * t * coinDst.x;
        const y = (1 - t) * (1 - t) * coinSrc.y + 2 * (1 - t) * t * qy + t * t * coinDst.y;
        return (
          <div key={i} style={{position: 'absolute', left: x - 26, top: y - 26, width: 52, height: 52, borderRadius: 26, background: `radial-gradient(circle at 35% 30%, #FFE48A, ${GOLD} 55%, #C9901A)`, border: '3px solid #B8860B', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `rotate(${t * 540}deg) scale(${0.8 + Math.sin(t * Math.PI) * 0.35})`}}>
            <Heart size={24} color="#FFF3C4" />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ── 3. heart wipe → lockup ─────────────────────────────────
const Lockup: React.FC = () => {
  const f = useCurrentFrame();
  const wipe = prog(f, 0, 16, expoIn);
  const word = prog(f, 26, 12, expoOut);
  return (
    <AbsoluteFill>
      {/* heart grows over the previous scene, becomes the new ground */}
      <div style={{position: 'absolute', left: 960, top: 560, transform: `translate(-50%, -50%) scale(${lerp(0.02, 42, wipe)})`}}>
        <svg width={100} height={100} viewBox="4 10 56 46">
          <path d={HEART} fill={LIME} stroke={DEEP} strokeWidth={1.2} strokeLinejoin="round" />
        </svg>
      </div>
      <AbsoluteFill style={{opacity: prog(f, 15, 5)}}>
        <AbsoluteFill style={{background: MINT}} />
        <Ground f={f + 150} />
        {/* floating hearts */}
        {new Array(14).fill(0).map((_, i) => {
          const x = 120 + ((i * 137) % 1680);
          const sp = 3 + (i % 4);
          const y = 1100 - ((f - 10) * sp + (i * 173) % 900);
          return <Heart key={i} size={30 + (i % 3) * 18} color={i % 3 === 0 ? PINK : i % 3 === 1 ? '#9BDC6B' : LIME} style={{position: 'absolute', left: x, top: y, opacity: 0.55, transform: `rotate(${Math.sin((f + i * 9) / 12) * 14}deg)`}} />;
        })}
        <Burst f={f} at={22} x={960} y={610} n={12} r={520} />
        <div style={{position: 'absolute', left: 960 - (480 * FROG_W) / FROG_H / 2, top: 150}}>
          <Frog f={f} h={480} drop={12} />
        </div>
        <div style={{position: 'absolute', left: 960 - 470, top: 680, width: 940, opacity: word, transform: `translateY(${(1 - word) * 30}px) scale(${lerp(0.9, 1, back(word))})`}}>
          <Img src={staticFile('gfm/wordmark.png')} style={{width: 940, height: (940 * 164) / 1050}} />
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 860, display: 'flex', justifyContent: 'center', opacity: prog(f, 38, 8), transform: `scale(${lerp(0.7, 1, back(prog(f, 38, 10)))})`}}>
          <div style={{padding: '20px 46px', borderRadius: 999, background: DEEP, fontFamily: MONO, fontWeight: 600, fontSize: 38, letterSpacing: '0.08em', color: LIME, boxShadow: '0 20px 50px -20px rgba(18,60,43,0.6)'}}>GOFUNDMEME.FUN</div>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 1010, textAlign: 'center', fontFamily: MONO, fontSize: 16, letterSpacing: '0.1em', color: INK2, opacity: prog(f, 48, 10)}}>
          INDEPENDENT PROJECT · NOT AFFILIATED WITH GOFUNDME OR PUMP.FUN
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const GfmFrog: React.FC<{withAudio?: boolean}> = ({withAudio = true}) => (
  <AbsoluteFill style={{background: '#F7F9F6'}}>
    <Sequence from={S.drop.from} durationInFrames={S.drop.dur} name="01 Frog drop · Give your meme a mission">
      <Drop />
    </Sequence>
    <Sequence from={S.how.from} durationInFrames={S.how.dur} name="02 Pick · Launch · Fees fund it">
      <How />
    </Sequence>
    <Sequence from={S.lockup.from} durationInFrames={S.lockup.dur} name="03 Heart wipe → lockup">
      <Lockup />
    </Sequence>
    {withAudio && <Audio src={staticFile('gfm-frog-score.wav')} />}
  </AbsoluteFill>
);
