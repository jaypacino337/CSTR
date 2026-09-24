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

    </AbsoluteFill>
  );
};

// ── 3. how it works — animated version of "Graphic 6" ──
const Field: React.FC<{label: string; value: string; f: number; at: number}> = ({label, value, f, at}) => {
  const n = Math.max(0, Math.min(value.length, Math.floor((f - at) * 0.9)));
  return (
    <div style={{marginBottom: 14}}>
      <div style={{fontFamily: UI, fontSize: 19, color: '#55554F', marginBottom: 6}}>{label}</div>
      <div style={{height: 46, borderRadius: 10, background: '#fff', border: `1px solid ${n > 0 && n < value.length ? LIME_D : 'rgba(0,0,0,0.08)'}`, display: 'flex', alignItems: 'center', padding: '0 14px', fontFamily: UI, fontSize: 20, color: INK}}>
        {value.slice(0, n)}
        {n < value.length && f >= at && <span style={{width: 2, height: 22, background: LIME_D, marginLeft: 2, opacity: Math.floor(f / 6) % 2}} />}
      </div>
    </div>
  );
};
const How: React.FC = () => {
  const f = useCurrentFrame();
  const CW = 400;
  const GAP = 44;
  const X0 = (1920 - (4 * CW + 3 * GAP)) / 2;
  const TOP = 470;
  const CH = 440;
  const steps = ['CREATE', 'OPEN', 'ALLOCATE', 'GO LIVE'];
  const active = [26, 70, 104, 132];
  const raise = prog(f, 72, 34, inOut);
  const sol = Math.round(320 * raise);
  const alloc = [
    {v: '70%', k: 'Community'},
    {v: '20%', k: 'Liquidity'},
    {v: '10%', k: 'Creator'},
  ];
  const candles = [
    [0.18, 0.16], [0.36, 0.22], [0.3, 0.18], [0.48, 0.2], [0.58, 0.16], [0.52, 0.22], [0.7, 0.2], [0.8, 0.18], [0.96, 0.22],
  ];
  return (
    <AbsoluteFill style={{background: BG}}>
      <Grid f={f + 200} />
      <Header o={1} />
      <div style={{position: 'absolute', left: X0, top: 150}}>
        <FadeWords segments="A CLEANER PATH" start={2} size={112} font={DISPLAY} weight={900} stretch={106} tracking={-0.02} align="left" stagger={4} style={{color: INK}} />
      </div>
      <div style={{position: 'absolute', left: X0, top: 276}}>
        <FadeWords segments="FROM RAISE TO LAUNCH." start={10} size={112} font={DISPLAY} weight={900} stretch={106} tracking={-0.02} align="left" stagger={4} style={{color: LIME}} />
      </div>
      {steps.map((s, i) => {
        const p = prog(f, 14 + i * 5, 18, expoOut);
        const on = f >= active[i];
        return (
          <div key={s}>
            <div
              style={{
                position: 'absolute',
                left: X0 + i * (CW + GAP),
                top: TOP,
                width: CW,
                height: CH,
                borderRadius: 22,
                background: 'rgba(255,255,255,0.85)',
                border: `1.5px solid ${on ? 'rgba(77,184,10,0.55)' : 'rgba(0,0,0,0.08)'}`,
                boxShadow: on ? '0 24px 60px rgba(124,242,26,0.16)' : '0 18px 44px rgba(0,0,0,0.05)',
                opacity: p,
                transform: `translateY(${(1 - p) * 40}px)`,
                overflow: 'hidden',
              }}
            >
              <div style={{position: 'absolute', left: 30, top: 26, display: 'flex', alignItems: 'baseline', gap: 26}}>
                <span style={{fontFamily: DISPLAY, fontWeight: 900, fontStretch: '110%', fontSize: 54, color: LIME}}>0{i + 1}</span>
                <span style={{fontFamily: UI, fontWeight: 800, fontSize: 36, color: INK, letterSpacing: '-0.01em'}}>{s}</span>
              </div>
              {i === 0 && (
                <div style={{position: 'absolute', left: 30, right: 30, top: 116, padding: '16px 18px 4px', borderRadius: 14, background: 'rgba(0,0,0,0.035)'}}>
                  <Field label="Token Name" value="Your Token" f={f} at={30} />
                  <Field label="Target Raise" value="500 SOL" f={f} at={44} />
                  <Field label="Presale Terms" value="Public terms" f={f} at={54} />
                </div>
              )}
              {i === 1 && (
                <div style={{position: 'absolute', left: 30, right: 30, top: 130, borderRadius: 16, border: '1px solid rgba(0,0,0,0.08)', background: '#fff'}}>
                  <div style={{padding: '26px 24px 20px'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: 12, fontFamily: UI, fontWeight: 700, fontSize: 26, color: INK}}>
                      <div style={{width: 18, height: 18, borderRadius: 9, background: LIME, boxShadow: `0 0 ${8 + 6 * Math.sin(f / 5)}px ${LIME}`}} />
                      Presale Live
                    </div>
                    <div style={{height: 18, borderRadius: 9, background: 'rgba(0,0,0,0.07)', marginTop: 22, overflow: 'hidden'}}>
                      <div style={{height: '100%', width: `${64 * raise}%`, borderRadius: 9, background: LIME}} />
                    </div>
                    <div style={{fontFamily: UI, fontSize: 22, color: '#55554F', marginTop: 14}}>{sol} SOL / 500 SOL</div>
                  </div>
                  <div style={{borderTop: '1px solid rgba(0,0,0,0.08)', padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 16}}>
                    <div style={{display: 'flex'}}>
                      {[0, 1, 2, 3, 4].map((k) => (
                        <div key={k} style={{width: 34, height: 34, borderRadius: 17, background: '#C9C9C4', border: '2px solid #fff', marginLeft: k ? -10 : 0, opacity: prog(f, 80 + k * 4, 8)}} />
                      ))}
                    </div>
                    <div style={{fontFamily: UI, fontSize: 22, color: INK, opacity: prog(f, 100, 10)}}>1.2K+</div>
                  </div>
                </div>
              )}
              {i === 2 && (
                <>
                  <Img src={staticFile('ipo-stack.png')} style={{position: 'absolute', left: 22, top: 120 + (1 - prog(f, 104, 20, expoOut)) * -60, width: 200, height: 262, mixBlendMode: 'multiply', opacity: prog(f, 104, 12)}} />
                  <div style={{position: 'absolute', left: 250, top: 130, width: 2, height: 250, background: LIME, transformOrigin: 'top', transform: `scaleY(${prog(f, 110, 20, inOut)})`}} />
                  {alloc.map((a, k) => (
                    <div key={a.k} style={{position: 'absolute', left: 242, top: 124 + k * 88, display: 'flex', gap: 14, opacity: prog(f, 112 + k * 6, 10)}}>
                      <div style={{width: 18, height: 18, borderRadius: 9, background: LIME, marginTop: 4}} />
                      <div>
                        <div style={{fontFamily: UI, fontWeight: 700, fontSize: 24, color: INK}}>{a.v}</div>
                        <div style={{fontFamily: UI, fontSize: 20, color: '#55554F'}}>{a.k}</div>
                      </div>
                    </div>
                  ))}
                </>
              )}
              {i === 3 && (
                <svg width={CW} height={CH} style={{position: 'absolute', inset: 0}}>
                  {candles.map(([h, b], k) => {
                    const g = prog(f, 132 + k * 3, 12, expoOut);
                    const x = 40 + k * 38;
                    const yTop = CH - 60 - h * 280;
                    const bh = b * 280 * g;
                    return (
                      <g key={k} opacity={g}>
                        <line x1={x} x2={x} y1={yTop - 22} y2={yTop + b * 280 + 18} stroke={LIME_D} strokeWidth={3} />
                        <rect x={x - 12} y={yTop} width={24} height={bh} rx={3} fill={k % 3 === 2 ? 'rgba(124,242,26,0.35)' : LIME} stroke={LIME_D} strokeWidth={1.5} />
                      </g>
                    );
                  })}
                </svg>
              )}
            </div>
            {i < 3 && (
              <div style={{position: 'absolute', left: X0 + (i + 1) * (CW + GAP) - GAP / 2 - 12, top: TOP + CH / 2 - 20, fontFamily: UI, fontWeight: 800, fontSize: 40, color: f >= active[i + 1] ? LIME_D : 'rgba(0,0,0,0.2)', opacity: p}}>›</div>
            )}
          </div>
        );
      })}
      <div style={{position: 'absolute', left: X0, right: X0, top: 972, display: 'flex', alignItems: 'center', gap: 36, fontFamily: MONO, fontSize: 20, letterSpacing: '0.18em', color: '#55554F', opacity: prog(f, 120, 16)}}>
        <span style={{fontWeight: 700, color: INK}}>IPO.SOLANA.XYZ</span>
        <div style={{flex: 1, height: 1, background: 'rgba(0,0,0,0.25)'}} />
        <span>PRESALES FOR A STRONGER SOLANA.</span>
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
export const Pumpios: React.FC = () => {
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
export const Finale: React.FC = () => {
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
