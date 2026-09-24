import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {FadeWords} from '../premium/ui';
import {DISPLAY, MONO, UI, expoOut, inOut, lerp, prog} from '../theme';
import tl from './hype-timeline.json';

// IPO hype — white brand world. Slideshow of designed frames with slow push,
// light parallax and clean slide/fade changes.
const BG = '#F6F6F4';
const INK = '#0B0B0B';
const GRAY = '#6F6F6A';
const LIME = '#7CF21A';
const LIME_D = '#4DB80A';
const S = tl.scenes;

const Grid: React.FC<{f: number}> = ({f}) => (
  <AbsoluteFill
    style={{
      backgroundImage: 'linear-gradient(rgba(0,0,0,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.055) 1px, transparent 1px)',
      backgroundSize: '140px 140px',
      backgroundPosition: `${-f * 0.15}px 0px`,
    }}
  />
);

/** Slide change: in from the right, out to the left, with a fade. */
const Slide: React.FC<{dur: number; children: React.ReactNode; last?: boolean}> = ({dur, children, last}) => {
  const f = useCurrentFrame();
  const i = prog(f, 0, 14, inOut);
  const o = last ? 0 : prog(f, dur - 12, 12, inOut);
  return <AbsoluteFill style={{opacity: Math.min(i, 1 - o), transform: `translateX(${(1 - i) * 70 - o * 70}px)`}}>{children}</AbsoluteFill>;
};

/** Key art on the right, feathered into the white, with a slow push. */
const Art: React.FC<{src: string; f: number; x: number; w: number; top?: number; push?: number}> = ({src, f, x, w, top = 0, push = 0.0009}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top,
      width: w,
      height: 1080 - top,
      overflow: 'hidden',
      maskImage: 'linear-gradient(90deg, transparent 0%, black 22%, black 100%)',
      WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, black 22%, black 100%)',
    }}
  >
    <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.04 + f * push}) translateX(${-f * 0.12}px)`}} />
  </div>
);

const Wordmark: React.FC<{size: number; reveal: number}> = ({size, reveal}) => (
  <div style={{position: 'relative', display: 'inline-block', clipPath: `inset(-20% ${(1 - reveal) * 100}% -20% 0)`}}>
    <div style={{position: 'absolute', left: size * 0.02, top: -size * 0.1, width: size * 0.3, height: size * 0.17, background: LIME, transform: 'skewY(-6deg)'}} />
    <div style={{fontFamily: DISPLAY, fontWeight: 900, fontStretch: '125%', fontSize: size, lineHeight: 0.9, color: INK, letterSpacing: '-0.01em'}}>IPO</div>
  </div>
);

const Header: React.FC<{o: number}> = ({o}) => (
  <div style={{position: 'absolute', left: 120, right: 120, top: 64, display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: o, fontFamily: MONO, fontWeight: 700, fontSize: 18, letterSpacing: '0.16em', color: INK}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
      <span style={{fontFamily: DISPLAY, fontWeight: 900, fontStretch: '125%', fontSize: 34, letterSpacing: 0, color: LIME}}>IPO</span>
      <span style={{width: 1, height: 30, background: INK, opacity: 0.4}} />
      <span>SOLANA LAUNCHPAD</span>
    </div>
    <div style={{display: 'flex', gap: 22}}>
      BUILD <span style={{color: LIME_D}}>›</span> LAUNCH <span style={{color: LIME_D}}>›</span> GROW
    </div>
  </div>
);

// ── 1. opener ─────────────────────────────────────────
const Open: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: BG}}>
      <Grid f={f} />
      <Art src="ipo-art-coin.jpg" f={f} x={1060} w={860} push={0.0012} />
      <Header o={prog(f, 30, 14)} />
      <div style={{position: 'absolute', left: 120, top: 250}}>
        <Wordmark size={250} reveal={prog(f, 2, 18, expoOut)} />
      </div>
      <div style={{position: 'absolute', left: 120, top: 530}}>
        <FadeWords segments="PRESALE LAUNCHPAD" start={16} size={82} font={DISPLAY} weight={900} stretch={115} tracking={-0.01} align="left" stagger={3} style={{color: INK}} />
      </div>
      <div style={{position: 'absolute', left: 120, top: 618}}>
        <FadeWords segments="ON SOLANA." start={22} size={82} font={DISPLAY} weight={900} stretch={115} tracking={-0.01} align="left" style={{color: INK}} />
      </div>
      <div style={{position: 'absolute', left: 120, top: 736}}>
        <FadeWords segments="Raise before launch." start={34} size={52} font={UI} weight={400} align="left" stagger={3} style={{color: GRAY}} />
      </div>
    </AbsoluteFill>
  );
};

// ── 2. what it is ─────────────────────────────────────
const What: React.FC = () => {
  const f = useCurrentFrame();
  const lines = [
    {t: 'SET THE TERMS.', at: 6},
    {t: 'OPEN THE PRESALE.', at: 20},
    {t: 'GO LIVE AFTER.', at: 34},
  ];
  return (
    <AbsoluteFill style={{background: BG}}>
      <Grid f={f + 100} />
      <Art src="ipo-art-machine.jpg" f={f} x={1130} w={790} top={150} />
      <Header o={1} />
      {lines.map((l, i) => {
        const p = prog(f, l.at, 16, expoOut);
        return (
          <div key={l.t} style={{position: 'absolute', left: 120, top: 250 + i * 130, display: 'flex', alignItems: 'center', gap: 28, opacity: p, transform: `translateY(${(1 - p) * 24}px)`}}>
            <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 24, color: LIME_D, width: 50}}>0{i + 1}</div>
            <div style={{fontFamily: UI, fontWeight: 800, fontSize: 84, letterSpacing: '-0.03em', color: i === 2 ? LIME_D : INK, whiteSpace: 'nowrap'}}>{l.t}</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 198, top: 660, width: lerp(0, 560, prog(f, 40, 30, inOut)), height: 4, background: LIME}} />
      <div style={{position: 'absolute', left: 198, top: 700}}>
        <FadeWords segments="A cleaner path from raise to launch." start={48} size={40} font={UI} weight={400} align="left" stagger={2} style={{color: GRAY}} />
      </div>
    </AbsoluteFill>
  );
};

// ── 3. how it works ───────────────────────────────────
const Icon: React.FC<{k: number; on: boolean}> = ({k, on}) => {
  const c = on ? INK : '#9A9A95';
  const p = {fill: 'none', stroke: c, strokeWidth: 1.9, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  return (
    <svg width={62} height={62} viewBox="0 0 24 24">
      {k === 0 && (
        <>
          <rect x={5} y={3} width={14} height={18} rx={2} {...p} />
          <path d="M8.5 8h7M8.5 12h7M8.5 16h4" {...p} />
        </>
      )}
      {k === 1 && (
        <>
          <circle cx={9} cy={8} r={3} {...p} />
          <circle cx={17} cy={9} r={2.4} {...p} />
          <path d="M3.5 19c.8-3.2 3-5 5.5-5s4.7 1.8 5.5 5M14.5 14.5c2.4-.4 5 .8 6 4" {...p} />
        </>
      )}
      {k === 2 && (
        <>
          <circle cx={12} cy={12} r={8.5} {...p} />
          <path d="M12 3.5V12h8.5" {...p} />
        </>
      )}
      {k === 3 && (
        <>
          <path d="M4 17l5-5 4 3 7-8" {...p} />
          <path d="M15 7h5v5" {...p} />
        </>
      )}
    </svg>
  );
};
const How: React.FC = () => {
  const f = useCurrentFrame();
  const steps = ['CREATE AN OFFERING', 'OPEN PARTICIPATION', 'ALLOCATE SUPPLY', 'GO LIVE'];
  const run = prog(f, 26, 70, inOut) * 4;
  const CW = 380;
  const GAP = 40;
  const X0 = (1920 - (4 * CW + 3 * GAP)) / 2;
  return (
    <AbsoluteFill style={{background: BG}}>
      <Grid f={f + 200} />
      <Header o={1} />
      <div style={{position: 'absolute', left: X0, top: 180}}>
        <FadeWords
          segments={[
            {text: 'HOW IT ', color: INK},
            {text: 'WORKS.', color: LIME_D},
          ]}
          start={2}
          size={92}
          font={UI}
          weight={800}
          tracking={-0.03}
          align="left"
        />
      </div>
      <div style={{position: 'absolute', left: X0, top: 540, width: 4 * CW + 3 * GAP, height: 4, background: 'rgba(0,0,0,0.08)'}} />
      <div style={{position: 'absolute', left: X0, top: 540, width: (4 * CW + 3 * GAP) * Math.min(1, run / 4), height: 4, background: LIME, boxShadow: `0 0 12px ${LIME}`}} />
      {steps.map((s, i) => {
        const p = prog(f, 8 + i * 5, 18, expoOut);
        const on = run > i + 0.15;
        return (
          <div
            key={s}
            style={{
              position: 'absolute',
              left: X0 + i * (CW + GAP),
              top: 340,
              width: CW,
              height: 400,
              borderRadius: 28,
              background: on ? 'linear-gradient(160deg, rgba(124,242,26,0.20), rgba(255,255,255,0.85))' : 'rgba(255,255,255,0.8)',
              border: `1.5px solid ${on ? LIME_D : 'rgba(0,0,0,0.1)'}`,
              boxShadow: on ? '0 24px 60px rgba(77,184,10,0.18)' : '0 20px 50px rgba(0,0,0,0.06)',
              padding: '40px 36px',
              boxSizing: 'border-box',
              opacity: p,
              transform: `translateY(${(1 - p) * 40 - (on ? 8 : 0)}px)`,
            }}
          >
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <Icon k={i} on={on} />
              <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 26, color: on ? LIME_D : '#9A9A95'}}>0{i + 1}</div>
            </div>
            <div style={{fontFamily: UI, fontWeight: 800, fontSize: 40, lineHeight: 1.1, letterSpacing: '-0.01em', color: on ? INK : '#8A8A85', marginTop: 150}}>{s}</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: X0, top: 800}}>
        <FadeWords segments="Structured presales. Public terms. Cleaner distribution." start={70} size={38} font={UI} weight={400} align="left" stagger={2} style={{color: GRAY}} />
      </div>
    </AbsoluteFill>
  );
};

// ── 4. why it matters ─────────────────────────────────
const Why: React.FC = () => {
  const f = useCurrentFrame();
  const lines = [
    {t: 'NO FIRST-BLOCK RACE.', at: 6, c: INK},
    {t: 'NO HIDDEN STRUCTURE.', at: 20, c: INK},
    {t: 'ONE CLEAR ENTRY.', at: 36, c: LIME_D},
  ];
  return (
    <AbsoluteFill style={{background: BG}}>
      <Grid f={f + 300} />
      <Art src="ipo-art-green.jpg" f={f} x={1170} w={750} top={150} push={0.0011} />
      <Header o={1} />
      {lines.map((l, i) => {
        const p = prog(f, l.at, 16, expoOut);
        return (
          <div key={l.t} style={{position: 'absolute', left: 120, top: 240 + i * 124, opacity: p, transform: `translateY(${(1 - p) * 24}px)`, fontFamily: UI, fontWeight: 800, fontSize: 80, letterSpacing: '-0.03em', color: l.c, whiteSpace: 'nowrap'}}>
            {l.t}
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 120, top: 640}}>
        <FadeWords segments="Everyone enters through the same presale." start={52} size={42} font={UI} weight={400} align="left" stagger={2} style={{color: GRAY}} />
      </div>
    </AbsoluteFill>
  );
};

// ── 5. Pumpios ───────────────────────────────────────
const Pumpios: React.FC = () => {
  const f = useCurrentFrame();
  const n = Math.round(1200 * prog(f, 10, 40, expoOut));
  const cards = [
    {i: 0, id: '#0421', rot: -9, x: -300, y: 30},
    {i: 1, id: '#0187', rot: 0, x: 0, y: 0},
    {i: 2, id: '#0333', rot: 9, x: 300, y: 30},
  ];
  const fan = prog(f, 14, 30, expoOut);
  return (
    <AbsoluteFill style={{background: BG}}>
      <Grid f={f + 400} />
      <Header o={1} />
      <div style={{position: 'absolute', left: 120, top: 240, fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: '0.16em', color: LIME_D, opacity: prog(f, 2, 12)}}>PUMPIOS · UNDERWRITER COLLECTION</div>
      <div style={{position: 'absolute', left: 120, top: 290, fontFamily: UI, fontWeight: 800, fontSize: 120, letterSpacing: '-0.03em', color: INK, lineHeight: 1, opacity: prog(f, 6, 12)}}>
        {n.toLocaleString('en-US')}
      </div>
      <div style={{position: 'absolute', left: 120, top: 410}}>
        <FadeWords segments="PUMPIOS." start={10} size={120} font={UI} weight={800} tracking={-0.03} align="left" style={{color: INK}} />
      </div>
      <div style={{position: 'absolute', left: 120, top: 560}}>
        <FadeWords
          segments={[
            {text: 'AT THE CENTER OF ', color: INK},
            {text: 'IPO.', color: LIME_D},
          ]}
          start={24}
          size={56}
          font={UI}
          weight={800}
          tracking={-0.01}
          align="left"
        />
      </div>
      <div style={{position: 'absolute', left: 120, top: 660}}>
        <FadeWords segments="The underwriter collection of the platform." start={40} size={36} font={UI} weight={400} align="left" stagger={2} style={{color: GRAY}} />
      </div>
      {cards.map((c) => (
        <div
          key={c.id}
          style={{
            position: 'absolute',
            left: 1340 - 190 + c.x * fan * 0.62,
            top: 250 + c.y * fan,
            width: 380,
            borderRadius: 22,
            background: '#fff',
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 30px 70px rgba(0,0,0,0.14)',
            overflow: 'hidden',
            transform: `rotate(${c.rot * fan}deg) translateY(${(1 - prog(f, 8 + c.i * 4, 22, expoOut)) * 120}px)`,
            opacity: prog(f, 8 + c.i * 4, 14),
            zIndex: c.i === 1 ? 2 : 1,
          }}
        >
          <Img src={staticFile(`pumpio-${c.i}.png`)} style={{width: 380, height: 379, display: 'block'}} />
          <div style={{display: 'flex', justifyContent: 'space-between', padding: '16px 20px', fontFamily: MONO, fontWeight: 700, fontSize: 20}}>
            <span style={{color: INK}}>PUMPIO</span>
            <span style={{color: LIME_D}}>{c.id}</span>
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

// ── 6. closer ────────────────────────────────────────
const LINE: [number, number][] = [
  [0, 0], [0.18, -0.06], [0.34, -0.2], [0.5, -0.28], [0.66, -0.5], [0.8, -0.66], [0.9, -0.86], [1, -1],
];
const Finale: React.FC = () => {
  const f = useCurrentFrame();
  const draw = prog(f, 4, 50, inOut);
  const X = 880;
  const Y = 1000;
  const W = 1040;
  const H = 720;
  const pts = LINE.map(([u, v]) => [X + u * W, Y + v * H]);
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ');
  return (
    <AbsoluteFill style={{background: BG}}>
      <Grid f={f + 540} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <path d={d} pathLength={1} fill="none" stroke={LIME} strokeWidth={4} strokeLinecap="round" strokeDasharray={`${draw} 1`} style={{filter: `drop-shadow(0 0 10px ${LIME})`}} />
        {pts.slice(1).map(([x, y], i) => {
          const on = draw > (i + 1) / (pts.length - 1) - 0.02;
          return on ? <circle key={i} cx={x} cy={y} r={i === pts.length - 2 ? 14 : 9} fill={LIME} style={{filter: `drop-shadow(0 0 10px ${LIME})`}} /> : null;
        })}
      </svg>
      <Header o={prog(f, 50, 16)} />
      <div style={{position: 'absolute', left: 120, top: 230}}>
        <Wordmark size={230} reveal={prog(f, 8, 20, expoOut)} />
      </div>
      <div style={{position: 'absolute', left: 120, top: 500}}>
        <FadeWords
          segments={[
            {text: 'BUILD. ', color: INK},
            {text: 'LAUNCH. ', color: INK},
            {text: 'GROW.', color: LIME_D},
          ]}
          start={26}
          size={96}
          font={DISPLAY}
          weight={900}
          stretch={115}
          tracking={-0.01}
          align="left"
          stagger={6}
        />
      </div>
      <div style={{position: 'absolute', left: 120, top: 626}}>
        <FadeWords segments="Presale launchpad on Solana." start={46} size={44} font={UI} weight={400} align="left" stagger={2} style={{color: GRAY}} />
      </div>
      <div style={{position: 'absolute', left: 120, top: 760, opacity: prog(f, 58, 16, expoOut), transform: `translateY(${(1 - prog(f, 58, 16, expoOut)) * 16}px)`}}>
        <div style={{display: 'inline-flex', alignItems: 'center', gap: 20, fontFamily: MONO, fontWeight: 700, fontSize: 34, letterSpacing: '0.08em', color: INK, background: LIME, padding: '20px 40px', borderRadius: 999, boxShadow: '0 16px 40px rgba(124,242,26,0.35)'}}>
          IPO.SOLANA.XYZ <span>↗</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const IpoHype: React.FC<{withAudio?: boolean}> = ({withAudio = true}) => (
  <AbsoluteFill style={{background: BG}}>
    <Sequence from={S.open.from} durationInFrames={S.open.dur} name="01 Presale launchpad">
      <Slide dur={S.open.dur}>
        <Open />
      </Slide>
    </Sequence>
    <Sequence from={S.what.from} durationInFrames={S.what.dur} name="02 What it is">
      <Slide dur={S.what.dur}>
        <What />
      </Slide>
    </Sequence>
    <Sequence from={S.how.from} durationInFrames={S.how.dur} name="03 How it works">
      <Slide dur={S.how.dur}>
        <How />
      </Slide>
    </Sequence>
    <Sequence from={S.why.from} durationInFrames={S.why.dur} name="04 Why it matters">
      <Slide dur={S.why.dur}>
        <Why />
      </Slide>
    </Sequence>
    <Sequence from={S.pumpios.from} durationInFrames={S.pumpios.dur} name="05 Pumpios">
      <Slide dur={S.pumpios.dur}>
        <Pumpios />
      </Slide>
    </Sequence>
    <Sequence from={S.finale.from} durationInFrames={S.finale.dur} name="06 Closer">
      <Slide dur={S.finale.dur} last>
        <Finale />
      </Slide>
    </Sequence>
    {withAudio && <Audio src={staticFile('ipo-hype-score.wav')} />}
  </AbsoluteFill>
);
