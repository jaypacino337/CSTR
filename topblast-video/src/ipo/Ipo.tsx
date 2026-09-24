import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Fade, FadeWords} from '../premium/ui';
import {MONO, UI, expoOut, inOut, lerp, prog} from '../theme';
import tl from './timeline.json';

// IPO — Initial Pump Offering (iposolana.xyz). Site palette: ink, lime, cream.
const INK = '#0A0C0A';
const LIME = '#A3F03A';
const LIME_D = '#5A9E14';
const CREAM = '#F2EFE6';
const S = tl.scenes;

const Grid: React.FC<{light?: boolean}> = ({light}) => (
  <AbsoluteFill
    style={{
      backgroundImage: `linear-gradient(${light ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.035)'} 1px, transparent 1px), linear-gradient(90deg, ${light ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.035)'} 1px, transparent 1px)`,
      backgroundSize: '120px 120px',
    }}
  />
);

const Chip: React.FC<{text: string; color?: string; style?: React.CSSProperties}> = ({text, color = LIME, style}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 16, fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: '0.08em', color, ...style}}>
    <div style={{width: 22, height: 22, background: color}} />
    {text}
  </div>
);

// banner-style rising line; `p` draws it
const RISE = [
  [0, 0], [0.1, 0], [0.24, -0.34], [0.38, -0.2], [0.55, -0.58], [0.69, -0.52], [0.83, -0.86], [0.93, -0.86], [1, -1],
];
const RiseLine: React.FC<{x: number; y: number; w: number; h: number; p: number; f: number}> = ({x, y, w, h, p, f}) => {
  const pts = RISE.map(([u, v]) => [x + u * w, y + v * h]);
  const d = pts.map(([px, py], i) => `${i ? 'L' : 'M'}${px},${py}`).join(' ');
  const len = 1;
  const end = pts[pts.length - 1];
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
      <defs>
        <linearGradient id="riseFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={LIME} stopOpacity={0.22} />
          <stop offset="1" stopColor={LIME} stopOpacity={0} />
        </linearGradient>
        <clipPath id="riseClip">
          <rect x={x} y={y - h - 40} width={w * p} height={h + 80} />
        </clipPath>
      </defs>
      <path d={`${d} L ${end[0]} ${y} L ${x} ${y} Z`} fill="url(#riseFill)" clipPath="url(#riseClip)" />
      <path d={d} pathLength={len} fill="none" stroke={LIME} strokeWidth={4} strokeLinejoin="round" strokeDasharray={`${p} 1`} style={{filter: `drop-shadow(0 0 8px ${LIME})`}} />
      {p > 0.98 && (
        <>
          <circle cx={end[0]} cy={end[1]} r={14} fill={LIME} />
          <circle cx={end[0]} cy={end[1]} r={14 + ((f * 0.8) % 30)} fill="none" stroke={LIME} opacity={1 - ((f * 0.8) % 30) / 30} />
        </>
      )}
    </svg>
  );
};

const Logo: React.FC<{w: number; reveal?: number; style?: React.CSSProperties}> = ({w, reveal = 1, style}) => (
  <Img src={staticFile('ipo-logo.png')} style={{width: w, height: w * (444 / 954), clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)`, ...style}} />
);

// ── 1. hook ─────────────────────────────────────────────
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const line = prog(f, 4, 40, inOut);
  const logo = prog(f, 16, 26, inOut);
  const up = prog(f, 62, 26, inOut);
  const out = prog(f, 142, 16, inOut);
  return (
    <AbsoluteFill style={{background: INK, opacity: 1 - out}}>
      <Grid />
      <div style={{opacity: 1 - up * 0.75}}>
        <RiseLine x={200} y={900} w={1520} h={520} p={line} f={f} />
      </div>
      <div style={{position: 'absolute', left: lerp(960 - 380, 960 - 190, up), top: lerp(300, 118, up)}}>
        <Logo w={lerp(760, 380, up)} reveal={logo} style={{filter: `drop-shadow(0 0 ${30 * (1 - up)}px rgba(163,240,58,0.35))`}} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 360, display: 'flex', justifyContent: 'center', opacity: prog(f, 78, 14, inOut)}}>
        <Chip text="INITIAL PUMP OFFERING / SOLANA" />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 420}}>
        <FadeWords segments="INITIAL PUMP" start={84} size={150} font={UI} weight={800} tracking={-0.02} stagger={5} style={{color: CREAM}} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 572}}>
        <FadeWords segments="OFFERING." start={94} size={150} font={UI} weight={800} tracking={-0.02} style={{color: LIME}} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 790}}>
        <FadeWords segments="Fair launches and structured presales on Solana." start={110} size={38} font={UI} weight={400} stagger={2} style={{color: 'rgba(242,239,230,0.85)'}} />
      </div>
    </AbsoluteFill>
  );
};

// ── 2. two ways (cream, like the site) ─────────────────
const Rocket = () => (
  <svg width={64} height={64} viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);
const Bank = () => (
  <svg width={64} height={64} viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round">
    <path d="M3 9l9-5 9 5" />
    <path d="M4 9h16" />
    <path d="M6 10v7M10 10v7M14 10v7M18 10v7" />
    <path d="M3 20h18" />
  </svg>
);
const Ways: React.FC = () => {
  const f = useCurrentFrame();
  const cards = [
    {icon: <Rocket />, tag: 'INSTANT', title: 'FAIR LAUNCH', body: 'Prepare a token, reward route, and launch record for supported Pump infrastructure.', at: 30, hl: [70, 128]},
    {icon: <Bank />, tag: 'CURATED', title: 'STRUCTURED PRESALE', body: 'A reviewed presale with public terms and a clear status before anyone deposits.', at: 42, hl: [128, 186]},
  ];
  return (
    <AbsoluteFill style={{background: CREAM}}>
      <Grid light />
      <div style={{position: 'absolute', left: 140, top: 96, fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: '0.06em', color: LIME_D, opacity: prog(f, 4, 14)}}>01 / MARKETPLACE</div>
      <div style={{position: 'absolute', left: 140, top: 140}}>
        <FadeWords segments="TWO WAYS TO OPEN THE MARKET." start={8} size={88} font={UI} weight={800} tracking={-0.02} align="left" stagger={3} style={{color: INK}} />
      </div>
      {cards.map((c, i) => {
        const p = prog(f, c.at, 20, inOut);
        const hl = Math.min(prog(f, c.hl[0], 12, inOut), 1 - prog(f, c.hl[1], 12, inOut));
        return (
          <div
            key={c.title}
            style={{
              position: 'absolute',
              left: 140 + i * 830,
              top: 300,
              width: 810,
              height: 470,
              border: `2px solid ${INK}`,
              background: hl > 0 ? `rgba(163,240,58,${0.16 * hl})` : 'transparent',
              padding: '46px 54px',
              boxSizing: 'border-box',
              opacity: p,
              transform: `translateY(${(1 - p) * 30 - hl * 6}px)`,
              boxShadow: `${10 * hl}px ${10 * hl}px 0 ${INK}`,
            }}
          >
            <div style={{position: 'absolute', left: 0, top: 0, height: 8, width: `${hl * 100}%`, background: LIME}} />
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              {c.icon}
              <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: '0.08em', color: INK}}>{c.tag}</div>
            </div>
            <div style={{fontFamily: UI, fontWeight: 600, fontSize: 64, color: INK, marginTop: 90, letterSpacing: '-0.01em'}}>{c.title}</div>
            <div style={{fontFamily: UI, fontSize: 28, lineHeight: 1.45, color: '#5d5d57', marginTop: 16, maxWidth: 660}}>{c.body}</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 140, right: 140, top: 830, height: 2, background: INK, opacity: prog(f, 186, 16), transformOrigin: 'left', transform: `scaleX(${prog(f, 186, 24, inOut)})`}} />
      <div style={{position: 'absolute', left: 140, top: 862}}>
        <FadeWords
          segments={[
            {text: 'BOTH PATHS SHOW ', color: INK},
            {text: 'STATUS AND TERMS', color: LIME_D},
            {text: ' BEFORE ASKING FOR A SIGNATURE.', color: INK},
          ]}
          start={192}
          size={40}
          font={UI}
          weight={800}
          align="left"
          stagger={2}
        />
      </div>
    </AbsoluteFill>
  );
};

// ── 3. the terms ───────────────────────────────────────
const Terms: React.FC = () => {
  const f = useCurrentFrame();
  const lines = [
    {t: 'PUBLIC TERMS.', at: 14},
    {t: 'CREATOR-OWNED REVENUE.', at: 46},
    {t: 'VERIFIABLE SETTLEMENT.', at: 78},
  ];
  const rows = [
    {k: 'TERMS', v: 'PUBLIC', at: 20},
    {k: 'CREATOR REVENUE', v: 'CREATOR-OWNED', at: 52},
    {k: 'SETTLEMENT', v: 'VERIFIABLE', at: 84},
  ];
  const steps = ['BUILD', 'LAUNCH', 'GROW'];
  const step = prog(f, 118, 70, inOut) * 3;
  const card = prog(f, 4, 20, inOut);
  const sign = prog(f, 190, 14, expoOut);
  return (
    <AbsoluteFill style={{background: INK}}>
      <Grid />
      {lines.map((l, i) => {
        const p = prog(f, l.at, 18, expoOut);
        return (
          <div key={l.t} style={{position: 'absolute', left: 140, top: 290 + i * 130, display: 'flex', alignItems: 'center', gap: 28, opacity: p, transform: `translateX(${(1 - p) * -30}px)`}}>
            <div style={{width: 54, height: 54, background: LIME, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <svg width={30} height={30} viewBox="0 0 16 16">
                <path d="M3 8.5 L6.5 12 L13 4.5" stroke={INK} strokeWidth={2.6} fill="none" strokeLinecap="round" />
              </svg>
            </div>
            <div style={{fontFamily: UI, fontWeight: 800, fontSize: 56, letterSpacing: '-0.02em', color: i === 1 ? LIME : CREAM, whiteSpace: 'nowrap'}}>{l.t}</div>
          </div>
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: 1140,
          top: 190,
          width: 640,
          height: 700,
          border: '1px solid rgba(242,239,230,0.18)',
          background: '#0F120F',
          padding: '40px 44px',
          boxSizing: 'border-box',
          opacity: card,
          transform: `translateY(${(1 - card) * 24}px)`,
        }}
      >
        <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontWeight: 700, fontSize: 18, letterSpacing: '0.08em'}}>
          <span style={{color: CREAM}}>OFFERING · $TOKEN</span>
          <span style={{color: LIME}}>STRUCTURED PRESALE</span>
        </div>
        <div style={{height: 1, background: 'rgba(242,239,230,0.14)', margin: '26px 0 12px'}} />
        {rows.map((r) => {
          const on = prog(f, r.at, 14, inOut);
          return (
            <div key={r.k} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 0', borderBottom: '1px solid rgba(242,239,230,0.08)', fontFamily: MONO, fontSize: 20}}>
              <span style={{color: 'rgba(242,239,230,0.55)', letterSpacing: '0.08em'}}>{r.k}</span>
              <span style={{color: on > 0.5 ? LIME : 'rgba(242,239,230,0.25)', fontWeight: 700, letterSpacing: '0.06em'}}>{on > 0.5 ? `${r.v} ✓` : 'PENDING'}</span>
            </div>
          );
        })}
        <div style={{fontFamily: MONO, fontSize: 16, letterSpacing: '0.12em', color: 'rgba(242,239,230,0.55)', marginTop: 34}}>STATUS</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 16}}>
          {steps.map((s, i) => {
            const on = step > i + 0.2;
            return (
              <div key={s} style={{display: 'flex', alignItems: 'center', gap: 14}}>
                <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: '0.06em', padding: '10px 16px', border: `1px solid ${on ? LIME : 'rgba(242,239,230,0.2)'}`, color: on ? INK : 'rgba(242,239,230,0.4)', background: on ? LIME : 'transparent'}}>{s}</div>
                {i < 2 && <span style={{fontFamily: MONO, fontSize: 22, color: step > i + 1 ? LIME : 'rgba(242,239,230,0.3)'}}>›</span>}
              </div>
            );
          })}
        </div>
        <div style={{position: 'absolute', left: 44, right: 44, bottom: 40, height: 76, background: LIME, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: '0.06em', color: INK, opacity: 0.25 + 0.75 * sign, transform: `scale(${1 + 0.03 * Math.sin(sign * Math.PI)})`}}>
          REVIEW TERMS · SIGN →
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── 4. Pumpios ─────────────────────────────────────────
const Pumpios: React.FC = () => {
  const f = useCurrentFrame();
  const ids = ['#0421', '#0187', '#0333'];
  const mint = prog(f, 70, 18, expoOut);
  return (
    <AbsoluteFill style={{background: INK}}>
      <Grid />
      <div style={{position: 'absolute', left: 0, right: 0, top: 90, display: 'flex', justifyContent: 'center', opacity: prog(f, 2, 14)}}>
        <Chip text="PUMPIOS / FEATURED PORTRAITS" />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 140}}>
        <FadeWords
          segments={[
            {text: 'MEET THE ', color: CREAM},
            {text: 'PUMPIOS.', color: LIME},
          ]}
          start={6}
          size={92}
          font={UI}
          weight={800}
          tracking={-0.02}
        />
      </div>
      {ids.map((id, i) => {
        const p = prog(f, 14 + i * 7, 24, expoOut);
        return (
          <div key={id} style={{position: 'absolute', left: 960 - 3 * 225 - 30 + i * 470, top: 290 + (1 - p) * 80, width: 440, border: '1px solid rgba(242,239,230,0.2)', background: '#0F120F', opacity: p}}>
            <Img src={staticFile(`pumpio-${i}.png`)} style={{width: 440, height: 438, display: 'block', transform: `scale(${1 + f * 0.0006})`}} />
            <div style={{padding: '14px 18px', fontFamily: MONO, fontWeight: 700, fontSize: 20, color: LIME}}>{id}</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 960 - 440, top: 880, width: 880, height: 92, background: LIME, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, fontFamily: MONO, fontWeight: 700, fontSize: 30, letterSpacing: '0.06em', color: INK, opacity: mint, transform: `translateY(${(1 - mint) * 16}px)`}}>
        MINT A PUMPIO · 0.05 SOL →
      </div>
    </AbsoluteFill>
  );
};

// ── 5. end — the banner, assembled ──────────────────────
const End: React.FC = () => {
  const f = useCurrentFrame();
  const line = prog(f, 10, 50, inOut);
  const logo = prog(f, 24, 26, inOut);
  const foot = prog(f, 70, 20, inOut);
  return (
    <AbsoluteFill style={{background: INK}}>
      <Grid />
      <RiseLine x={1150} y={760} w={640} h={340} p={line} f={f} />
      <div style={{position: 'absolute', left: 1180, top: 300}}>
        <Logo w={560} reveal={logo} />
      </div>
      <div style={{position: 'absolute', right: 130, top: 90, fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: '0.08em', color: LIME, opacity: prog(f, 40, 16)}}>
        BUILD &nbsp;›&nbsp; LAUNCH &nbsp;›&nbsp; GROW
      </div>
      <div style={{position: 'absolute', left: 130, top: 250, opacity: prog(f, 4, 14)}}>
        <Chip text="SOLANA LAUNCHPAD" />
      </div>
      <div style={{position: 'absolute', left: 130, top: 300}}>
        <FadeWords segments="INITIAL PUMP" start={8} size={126} font={UI} weight={800} tracking={-0.02} align="left" style={{color: CREAM}} />
      </div>
      <div style={{position: 'absolute', left: 130, top: 428}}>
        <FadeWords segments="OFFERING." start={16} size={126} font={UI} weight={800} tracking={-0.02} align="left" style={{color: LIME}} />
      </div>
      <div style={{position: 'absolute', left: 130, top: 590}}>
        <FadeWords segments="Fair launches and structured presales on Solana." start={30} size={36} font={UI} weight={400} align="left" stagger={2} style={{color: 'rgba(242,239,230,0.85)'}} />
      </div>
      <div style={{position: 'absolute', left: 130, right: 130, top: 900, display: 'flex', alignItems: 'center', gap: 30, fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: '0.08em', color: 'rgba(242,239,230,0.5)', opacity: foot}}>
        <span>SOLANA &nbsp;/&nbsp; CREATORS &nbsp;/&nbsp; COMMUNITY &nbsp;/&nbsp; LONG TERM</span>
        <div style={{flex: 1, height: 1, background: 'rgba(242,239,230,0.2)'}} />
        <span style={{color: LIME}}>IPOSOLANA.XYZ ↗</span>
      </div>
    </AbsoluteFill>
  );
};

export const IpoExplainer: React.FC<{withAudio?: boolean}> = ({withAudio = true}) => (
  <AbsoluteFill style={{background: INK}}>
    <Sequence from={S.hook.from} durationInFrames={S.hook.dur} name="01 Initial Pump Offering">
      <Hook />
    </Sequence>
    <Sequence from={S.ways.from} durationInFrames={S.ways.dur} name="02 Two ways">
      <Fade dur={S.ways.dur} inDur={12} outDur={12}>
        <Ways />
      </Fade>
    </Sequence>
    <Sequence from={S.terms.from} durationInFrames={S.terms.dur} name="03 Terms">
      <Fade dur={S.terms.dur} inDur={12} outDur={12}>
        <Terms />
      </Fade>
    </Sequence>
    <Sequence from={S.pumpios.from} durationInFrames={S.pumpios.dur} name="04 Pumpios">
      <Fade dur={S.pumpios.dur} inDur={12} outDur={12}>
        <Pumpios />
      </Fade>
    </Sequence>
    <Sequence from={S.finale.from} durationInFrames={S.finale.dur} name="05 End">
      <Fade dur={S.finale.dur + 20} inDur={12}>
        <End />
      </Fade>
    </Sequence>
    {withAudio && <Audio src={staticFile('ipo-score.wav')} />}
  </AbsoluteFill>
);
