import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {FadeWords} from '../premium/ui';
import {expoIn, expoOut, inOut, lerp, prog} from '../theme';
import tl from './zsolana-timeline.json';

// zSOL (zsolana.fun) — "Private SOL. Verifiable origin." Fully custom, built from the
// site's own system: dark hero + proof terminal, light body, square proof nodes,
// Fraunces + IBM Plex, Solana purple→green with a Zcash-gold accent.
const HERO = '#100C18';
const W_INK = '#FFFFFF';
const W_DIM = 'rgba(255,255,255,0.68)';
const W_MUTED = 'rgba(255,255,255,0.45)';
const W_RULE = 'rgba(255,255,255,0.10)';
const GROUND = '#F7F7FB';
const SURF = '#FFFFFF';
const SURF2 = '#F0EEF7';
const INK = '#15111D';
const INK2 = '#514B5F';
const INK3 = '#81798F';
const RULE = '#E4E0EB';
const PURPLE = '#8B43FF';
const PURPLE_INK = '#6F2BD8';
const PURPLE_SOFT = '#EEE4FF';
const GREEN = '#12B97B';
const GREEN_SOFT = '#DCF8EC';
const NEON = '#14F195';
const SOLP = '#9945FF';
const GOLD = '#BA7D0D';
const GOLD_BRIGHT = '#F4B728';
const RED = '#C43D2E';
const RED_SOFT = '#F7DED9';
const GRAD = 'linear-gradient(100deg, #9945FF 0%, #14F195 100%)';
const SHADOW = '0 18px 55px -34px rgba(42,25,74,0.38), 0 2px 6px rgba(42,25,74,0.05)';
const SERIF = '"Fraunces Variable", Georgia, serif';
const SANS = '"IBM Plex Sans", sans-serif';
const MONO = '"IBM Plex Mono", monospace';
const S = tl.scenes;

// ── shared pieces ──────────────────────────────────────────
const DarkGround: React.FC<{f: number}> = ({f}) => (
  <AbsoluteFill style={{background: HERO}}>
    <div style={{position: 'absolute', left: 345 - 900, top: 324 - 560, width: 1800, height: 1120, background: 'radial-gradient(closest-side, rgba(139,67,255,0.26), transparent)', transform: `translate(${Math.sin(f / 90) * 30}px, 0)`}} />
    <div style={{position: 'absolute', left: 1690 - 760, top: 238 - 480, width: 1520, height: 960, background: 'radial-gradient(closest-side, rgba(20,241,149,0.14), transparent)', transform: `translate(${Math.cos(f / 110) * 30}px, 0)`}} />
    <AbsoluteFill style={{opacity: 0.18, backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '52px 52px', backgroundPosition: `${-f * 0.2}px 0px`, WebkitMaskImage: 'linear-gradient(180deg, #000 20%, transparent 95%)'}} />
  </AbsoluteFill>
);

const LightGround: React.FC<{f: number}> = ({f}) => (
  <AbsoluteFill style={{background: GROUND}}>
    <div style={{position: 'absolute', left: -200, top: -520, width: 1500, height: 1000, background: 'radial-gradient(closest-side, rgba(153,69,255,0.13), transparent)', transform: `translate(${Math.sin(f / 90) * 30}px, 0)`}} />
    <div style={{position: 'absolute', right: -300, top: -480, width: 1300, height: 900, background: 'radial-gradient(closest-side, rgba(20,241,149,0.12), transparent)', transform: `translate(${Math.cos(f / 110) * 30}px, 0)`}} />
    <AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(21,17,29,0.07) 1.2px, transparent 1.6px)', backgroundSize: '36px 36px', backgroundPosition: `${-f * 0.15}px 0px`}} />
  </AbsoluteFill>
);

const Mono: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{fontFamily: MONO, fontSize: 18, letterSpacing: '0.12em', color: INK3, ...style}}>{children}</div>
);

const Eyebrow: React.FC<{children: React.ReactNode; f: number; at: number; x: number; y: number; color?: string}> = ({children, f, at, x, y, color = PURPLE_INK}) => (
  <Mono style={{position: 'absolute', left: x, top: y, fontSize: 19, fontWeight: 600, color, textTransform: 'uppercase', opacity: prog(f, at, 12), transform: `translateY(${(1 - prog(f, at, 14, expoOut)) * 8}px)`}}>{children}</Mono>
);

// the site's brand mark: rounded square + green core
const Mark: React.FC<{size: number; stroke?: string}> = ({size, stroke = '#fff'}) => (
  <svg width={size} height={size} viewBox="0 0 36 36">
    <rect x="9.25" y="9.25" width="17.5" height="17.5" rx="5.6" fill="none" stroke={stroke} strokeWidth="2.4" />
    <circle cx="18" cy="18" r="4.15" fill={NEON} stroke={stroke} strokeWidth="1.55" />
    <circle cx="18" cy="18" r="1.15" fill={stroke} />
  </svg>
);

const Push: React.FC<{dur: number; last?: boolean; origin?: string; children: React.ReactNode}> = ({dur, last, origin = '50% 50%', children}) => {
  const f = useCurrentFrame();
  const i = prog(f, 0, 16, expoOut);
  const o = last ? 0 : prog(f, dur - 12, 12, expoIn);
  return (
    <AbsoluteFill style={{opacity: Math.min(1, i * 1.3) * (1 - o), transform: `scale(${lerp(0.94, 1, i) * lerp(1, 1.18, o)})`, transformOrigin: origin, filter: i < 1 || o > 0 ? `blur(${(1 - i) * 10 + o * 12}px)` : undefined}}>
      {children}
    </AbsoluteFill>
  );
};

// ── 1. hero: Private SOL. Verifiable origin. ─────────────────
const Orbit: React.FC<{f: number; size: number}> = ({f, size}) => {
  const r = size / 2;
  const dots = [
    {c: NEON, a: -2.2, rr: r - 1, sp: 0.018},
    {c: SOLP, a: 0.35, rr: r - 1, sp: -0.014},
    {c: GOLD_BRIGHT, a: 2.3, rr: r - 25, sp: 0.022},
  ];
  return (
    <div style={{position: 'relative', width: size, height: size}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: r, border: '1.5px solid rgba(153,69,255,0.4)', boxShadow: 'inset 0 0 70px rgba(153,69,255,0.16), 0 0 70px rgba(20,241,149,0.10)'}} />
      <div style={{position: 'absolute', inset: 30, borderRadius: r, border: '1px solid rgba(255,255,255,0.09)'}} />
      <div style={{position: 'absolute', inset: 66, borderRadius: r, border: '1px solid rgba(255,255,255,0.09)'}} />
      <div style={{position: 'absolute', left: r - 44, top: r - 44, width: 88, height: 88, borderRadius: 28, background: 'linear-gradient(145deg, #8B43FF, #14C987)', border: '1px solid rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SERIF, fontWeight: 600, fontSize: 60, color: '#fff', paddingBottom: 10}}>
        z
      </div>
      {dots.map((d, k) => {
        const a = d.a + f * d.sp;
        return <div key={k} style={{position: 'absolute', left: r + Math.cos(a) * d.rr - 8, top: r + Math.sin(a) * d.rr - 8, width: 16, height: 16, borderRadius: 8, background: d.c, border: `2px solid ${HERO}`, boxShadow: `0 0 20px ${d.c}`}} />;
      })}
    </div>
  );
};

const Hero: React.FC = () => {
  const f = useCurrentFrame();
  const card = prog(f, 34, 26, expoOut);
  const step = (k: number) => prog(f, 70 + k * 18, 12);
  const verdict = prog(f, 124, 16, expoOut);
  const route = [
    {n: '01', t: 'Deposit', v: '1 SOL'},
    {n: '02', t: 'Shield', v: 'Private note'},
    {n: '03', t: 'Exit', v: 'Fresh address'},
  ];
  const trust = ['No account', 'No custodian', 'Your note stays client-side'];
  return (
    <AbsoluteFill>
      <DarkGround f={f} />
      {/* heritage pill */}
      <div style={{position: 'absolute', left: 140, top: 190, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 22px', borderRadius: 999, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)', fontFamily: MONO, fontSize: 19, letterSpacing: '0.04em', opacity: prog(f, 2, 12), transform: `translateY(${(1 - prog(f, 2, 16, expoOut)) * 10}px)`}}>
        <b style={{color: GOLD_BRIGHT, fontWeight: 600}}>Zcash</b>
        <span style={{color: W_MUTED}}>privacy primitives</span>
        <span style={{color: W_MUTED}}>·</span>
        <span style={{fontWeight: 600, backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent'}}>designed for Solana</span>
      </div>
      <Mono style={{position: 'absolute', left: 140, top: 282, fontSize: 18, fontWeight: 600, color: '#C89BFF', opacity: prog(f, 10, 12)}}>SHIELDED SOL · ASSOCIATION-SET PROOFS</Mono>
      <div style={{position: 'absolute', left: 140, top: 326}}>
        <FadeWords segments="Private SOL." start={8} size={140} font={SERIF} weight={600} tracking={-0.03} stagger={5} align="left" style={{color: W_INK}} />
      </div>
      <div style={{position: 'absolute', left: 134, top: 470, fontFamily: SERIF, fontStyle: 'italic', fontWeight: 600, fontSize: 140, lineHeight: 1.05, letterSpacing: '-0.03em', paddingRight: 30, backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent', opacity: prog(f, 22, 20, inOut), transform: `translateY(${(1 - prog(f, 22, 22, expoOut)) * 26}px)`, filter: `blur(${(1 - prog(f, 22, 20)) * 8}px)`}}>
        Verifiable origin.
      </div>
      <div style={{position: 'absolute', left: 140, top: 660, width: 820, fontFamily: SANS, fontSize: 31, lineHeight: 1.55, color: W_DIM, opacity: prog(f, 48, 18), transform: `translateY(${(1 - prog(f, 48, 20, expoOut)) * 12}px)`}}>
        Pool a fixed deposit, withdraw to a fresh address, and prove your note belongs to an accepted set — <span style={{color: W_INK}}>without revealing which deposit was yours.</span>
      </div>
      <div style={{position: 'absolute', left: 140, top: 880, display: 'flex', gap: 34}}>
        {trust.map((t, k) => (
          <Mono key={t} style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 17, letterSpacing: '0.06em', color: W_MUTED, opacity: prog(f, 84 + k * 6, 12)}}>
            <span style={{width: 8, height: 8, borderRadius: 4, background: NEON, boxShadow: `0 0 10px ${NEON}`}} /> {t}
          </Mono>
        ))}
      </div>
      {/* proof terminal */}
      <div style={{position: 'absolute', left: 1130, top: 170, width: 660, height: 760, borderRadius: 26, background: 'rgba(20,16,30,0.82)', border: `1px solid ${W_RULE}`, boxShadow: '0 40px 120px -40px rgba(0,0,0,0.8), 0 0 80px -30px rgba(139,67,255,0.4)', opacity: card, transform: `translateY(${(1 - card) * 40}px) scale(${lerp(0.96, 1, card)})`, overflow: 'hidden'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 26px', borderBottom: `1px solid ${W_RULE}`}}>
          <div style={{display: 'flex', gap: 9}}>
            {[SOLP, NEON, GOLD_BRIGHT].map((c) => (
              <span key={c} style={{width: 12, height: 12, borderRadius: 6, background: c}} />
            ))}
          </div>
          <Mono style={{fontSize: 15, color: 'rgba(255,255,255,0.45)'}}>ILLUSTRATIVE PROOF MODEL</Mono>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 40}}>
          <Orbit f={f} size={260} />
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, margin: '44px 34px 0'}}>
          {route.map((r, k) => (
            <div key={r.n} style={{display: 'contents'}}>
              <div style={{flex: 1, padding: '16px 14px', borderRadius: 14, background: step(k) > 0.5 ? 'rgba(139,67,255,0.14)' : 'rgba(255,255,255,0.04)', border: `1px solid ${step(k) > 0.5 ? 'rgba(181,123,255,0.55)' : W_RULE}`, opacity: 0.4 + 0.6 * step(k)}}>
                <Mono style={{fontSize: 14, color: step(k) > 0.5 ? '#C89BFF' : W_MUTED}}>{r.n}</Mono>
                <div style={{fontFamily: SANS, fontSize: 18, color: W_DIM, marginTop: 6}}>{r.t}</div>
                <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 20, color: W_INK, marginTop: 2, whiteSpace: 'nowrap'}}>{r.v}</div>
              </div>
              {k < 2 && <span style={{color: 'rgba(255,255,255,0.3)', fontSize: 22, opacity: step(k + 1)}}>→</span>}
            </div>
          ))}
        </div>
        <div style={{margin: '30px 34px 0', paddingTop: 24, borderTop: `1px solid ${W_RULE}`, opacity: verdict, transform: `translateY(${(1 - verdict) * 10}px)`}}>
          <Mono style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: W_MUTED}}>
            <span style={{width: 9, height: 9, borderRadius: 5, background: NEON, boxShadow: `0 0 12px ${NEON}`, opacity: 0.5 + 0.5 * Math.sin(f / 5)}} /> MODEL VERDICT
          </Mono>
          <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 30, color: NEON, marginTop: 10}}>Membership proven. Deposit hidden.</div>
          <Mono style={{fontSize: 13, marginTop: 10, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.08em'}}>CONCEPT ONLY · NO LIVE PRIVACY POOL</Mono>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── 2. how it works: four steps on one rail ─────────────────
const SX = [330, 750, 1170, 1590];
const RY = 480;
const STEPS = [
  {icon: '↓', t: 'Deposit SOL', d: 'A fixed denomination enters the vault and publishes a secret-derived commitment.'},
  {icon: '◌', t: 'Keep the note', d: 'Your private note stays on your device. It is the withdrawal credential.'},
  {icon: '✓', t: 'Choose a set', d: 'Pick a published association set whose policy fits the proof you need.'},
  {icon: '↗', t: 'Prove and exit', d: 'A zero-knowledge proof pays a fresh address. A nullifier blocks double-spends.'},
];
const How: React.FC = () => {
  const f = useCurrentFrame();
  const arrive = (k: number) => 44 + k * 28;
  const run = prog(f, arrive(0), arrive(3) - arrive(0), (t) => t);
  const px = lerp(SX[0], SX[3], inOut(run));
  return (
    <AbsoluteFill>
      <LightGround f={f + 160} />
      <Eyebrow f={f} at={2} x={160} y={104}>How it works</Eyebrow>
      <div style={{position: 'absolute', left: 160, top: 150}}>
        <FadeWords segments="The crowd hides the deposit." start={4} size={70} font={SERIF} weight={600} tracking={-0.02} stagger={3} align="left" style={{color: INK}} />
      </div>
      <div style={{position: 'absolute', left: 160, top: 232}}>
        <FadeWords segments={[{text: 'The proof clears the exit.', gradient: GRAD}]} start={18} size={70} font={SERIF} weight={600} tracking={-0.02} stagger={3} align="left" style={{fontStyle: 'italic', paddingRight: 20}} />
      </div>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <defs>
          <linearGradient id="rail" x1="0" x2="1">
            <stop offset="0" stopColor={SOLP} />
            <stop offset="1" stopColor={NEON} />
          </linearGradient>
        </defs>
        <line x1={SX[0]} x2={SX[3]} y1={RY} y2={RY} stroke={RULE} strokeWidth={2} strokeDasharray="4 10" opacity={prog(f, 30, 14)} />
        {run > 0 && <line x1={SX[0]} x2={px} y1={RY} y2={RY} stroke="url(#rail)" strokeWidth={4} strokeLinecap="round" />}
      </svg>
      {run > 0 && run < 1 && <div style={{position: 'absolute', left: px - 11, top: RY - 11, width: 22, height: 22, borderRadius: 11, background: '#fff', border: `3px solid ${PURPLE}`, boxShadow: `0 0 24px ${PURPLE}`}} />}
      {STEPS.map((s, k) => {
        const on = prog(f, arrive(k) - 4, 16, expoOut);
        const lit = f >= arrive(k);
        const last = k === 3;
        return (
          <div key={s.t}>
            <div style={{position: 'absolute', left: SX[k] - 48, top: RY - 48, width: 96, height: 96, borderRadius: 30, background: lit ? (last ? GRAD : SURF) : SURF2, border: `1.5px solid ${lit ? (last ? 'transparent' : PURPLE) : RULE}`, boxShadow: lit ? `0 14px 40px -14px rgba(139,67,255,0.55)` : undefined, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 600, fontSize: 42, color: lit ? (last ? '#fff' : PURPLE_INK) : INK3, transform: `scale(${lerp(0.85, 1, on)})`, opacity: 0.35 + 0.65 * prog(f, 26, 14)}}>
              {s.icon}
            </div>
            <div style={{position: 'absolute', left: SX[k] - 185, top: RY + 88, width: 370, height: 290, padding: '28px 30px', boxSizing: 'border-box', borderRadius: 22, background: SURF, border: `1px solid ${RULE}`, boxShadow: SHADOW, opacity: on, transform: `translateY(${(1 - on) * 26}px)`}}>
              <Mono style={{fontSize: 17, fontWeight: 600, color: last ? GREEN : PURPLE_INK}}>{`0${k + 1}`}</Mono>
              <div style={{fontFamily: SERIF, fontWeight: 600, fontSize: 40, color: INK, marginTop: 10, letterSpacing: '-0.01em'}}>{s.t}</div>
              <div style={{fontFamily: SANS, fontSize: 23, lineHeight: 1.5, color: INK2, marginTop: 12}}>{s.d}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ── 3. proof model: 132 sample commitments ──────────────────
// Exact pattern from the site's node grid: i = in set, x = flagged, m = mine, . = outside.
const NODES = '..i.i.xi.iiii.x.ix..i.i.x...ixi.iiii....x..iii.m..ii.xiii.ii..i.ii....iiii.ix.ii...ii..ix.x..i..ii.i.iiiixi..xi..ii.i...i.i..x.i.xii';
const NC = 12;
const Proof: React.FC = () => {
  const f = useCurrentFrame();
  const GX = 1080;
  const GY = 200;
  const STEP = 54;
  const SZ = 42;
  const toggle = prog(f, 58, 16, inOut);
  const rows = [
    {k: 'ASSOCIATION SET', v: '58 of 132 illustrative deposits', c: INK, at: 78},
    {k: 'FLAGGED INSIDE', v: '0 — excluded by this model', c: RED, at: 92},
    {k: 'PROOF DESIGN', v: 'membership ∧ ¬flagged, in zero knowledge', c: INK, at: 106},
  ];
  const verdict = prog(f, 126, 18, expoOut);
  return (
    <AbsoluteFill>
      <LightGround f={f + 340} />
      <Eyebrow f={f} at={2} x={160} y={180}>Interactive proof model</Eyebrow>
      <div style={{position: 'absolute', left: 160, top: 226, width: 820, fontFamily: SERIF, fontWeight: 600, fontSize: 76, lineHeight: 1.05, letterSpacing: '-0.02em', color: INK}}>
        <FadeWords segments="See what the" start={4} size={76} font={SERIF} weight={600} tracking={-0.02} stagger={3} align="left" />
        <FadeWords segments={[{text: 'verifier', color: INK}, {text: ' would learn.', gradient: GRAD}]} start={14} size={76} font={SERIF} weight={600} tracking={-0.02} stagger={3} align="left" style={{paddingRight: 20}} />
      </div>
      {/* toggle */}
      <div style={{position: 'absolute', left: 160, top: 440, display: 'flex', padding: 5, borderRadius: 14, background: SURF2, border: `1px solid ${RULE}`, opacity: prog(f, 22, 14), fontFamily: MONO, fontSize: 18, fontWeight: 600}}>
        <div style={{position: 'absolute', top: 5, left: 5 + toggle * 190, width: 190, height: 50, borderRadius: 10, background: SURF, boxShadow: '0 2px 10px rgba(42,25,74,0.12)'}} />
        {['Whole pool', 'Proof set'].map((t, k) => (
          <div key={t} style={{position: 'relative', width: 190, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', color: (k === 1 ? toggle : 1 - toggle) > 0.5 ? INK : INK3}}>{t}</div>
        ))}
      </div>
      {/* readout */}
      <div style={{position: 'absolute', left: 160, top: 540, width: 800}}>
        {rows.map((r) => (
          <div key={r.k} style={{display: 'flex', alignItems: 'baseline', gap: 24, padding: '18px 0', borderTop: `1px solid ${RULE}`, opacity: prog(f, r.at, 14), transform: `translateX(${(1 - prog(f, r.at, 16, expoOut)) * -16}px)`}}>
            <Mono style={{width: 230, fontSize: 16, flexShrink: 0}}>{r.k}</Mono>
            <div style={{fontFamily: SANS, fontSize: 26, color: r.c, fontWeight: 500}}>{r.v}</div>
          </div>
        ))}
        <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 14, padding: '20px 24px', borderRadius: 16, background: GREEN_SOFT, border: `1px solid ${GREEN}55`, opacity: verdict, transform: `translateY(${(1 - verdict) * 12}px)`}}>
          <span style={{width: 34, height: 34, borderRadius: 17, background: GREEN, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, flexShrink: 0}}>✓</span>
          <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 30, color: '#0B7A51'}}>Membership proven. Deposit hidden.</div>
        </div>
      </div>
      {/* grid card */}
      <div style={{position: 'absolute', left: GX - 36, top: GY - 76, width: NC * STEP - (STEP - SZ) + 72, height: 11 * STEP - (STEP - SZ) + 180, borderRadius: 26, background: SURF, border: `1px solid ${RULE}`, boxShadow: SHADOW, opacity: prog(f, 4, 14)}}>
        <Mono style={{position: 'absolute', left: 36, top: 26, fontSize: 16, fontWeight: 600, color: PURPLE_INK}}>132 SAMPLE COMMITMENTS</Mono>
        <Mono style={{position: 'absolute', right: 36, top: 26, fontSize: 14, letterSpacing: '0.06em'}}>ILLUSTRATIVE · NO DEPOSITS OR BALANCES</Mono>
        <div style={{position: 'absolute', left: 36, bottom: 30, display: 'flex', gap: 26, opacity: prog(f, 70, 14)}}>
          {[
            {l: 'Your deposit', bg: PURPLE, bd: PURPLE},
            {l: 'In your set', bg: GREEN_SOFT, bd: GREEN},
            {l: 'Flagged', bg: RED_SOFT, bd: RED},
            {l: 'Outside', bg: SURF2, bd: RULE},
          ].map((s) => (
            <Mono key={s.l} style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, letterSpacing: '0.04em', color: INK2}}>
              <span style={{width: 18, height: 18, borderRadius: 5, background: s.bg, border: `1.5px solid ${s.bd}`}} />
              {s.l}
            </Mono>
          ))}
        </div>
      </div>
      {NODES.split('').map((c, i) => {
        const cx = GX + (i % NC) * STEP;
        const cy = GY + Math.floor(i / NC) * STEP;
        const inP = prog(f, 6 + ((i % NC) + Math.floor(i / NC)) * 0.9, 12, expoOut);
        const d = prog(f, 58 + ((i % NC) + Math.floor(i / NC)) * 0.8, 12, inOut);
        const mine = c === 'm';
        const inc = c === 'i';
        const flg = c === 'x';
        const shimmer = 0.5 + 0.5 * Math.sin(f / 7 + i * 1.7);
        const bg = d < 0.5 ? SURF2 : mine ? PURPLE : inc ? GREEN_SOFT : flg ? RED_SOFT : SURF2;
        const bd = d < 0.5 ? (shimmer > 0.85 ? '#CFC6E4' : RULE) : mine ? PURPLE : inc ? GREEN : flg ? RED : RULE;
        const op = d < 0.5 ? 1 : mine || inc || flg ? 1 : lerp(1, 0.25, (d - 0.5) * 2);
        const sc = mine ? lerp(1, 1.2, prog(f, 80, 14, expoOut)) : 1;
        return (
          <div key={i} style={{position: 'absolute', left: cx, top: cy, width: SZ, height: SZ, borderRadius: 9, boxSizing: 'border-box', background: bg, border: `1.5px solid ${bd}`, opacity: inP * op, transform: `scale(${lerp(0.6, 1, inP) * sc})`, boxShadow: mine && d > 0.5 ? `0 0 0 6px ${PURPLE_SOFT}, 0 0 26px rgba(139,67,255,0.5)` : undefined, zIndex: mine ? 2 : 1}} />
        );
      })}
    </AbsoluteFill>
  );
};

// ── 4. proposed economics ───────────────────────────────────
const ALLOC = [
  {p: 30, t: 'Buybacks + burns', d: 'Creator fees would buy zSOL from the market and permanently burn it, under public, rate-limited rules.', g: 'linear-gradient(90deg,#9945FF,#B66CFF)', c: PURPLE_INK},
  {p: 40, t: 'Pool liquidity', d: 'Deepens the zSOL/SOL market so ordinary swaps have lower price impact.', g: 'linear-gradient(90deg,#14B87A,#14F195)', c: '#0B8A5B'},
  {p: 30, t: 'Infra + development', d: 'Provers, RPC, monitoring, audits and protocol development, through a disclosed treasury.', g: 'linear-gradient(90deg,#C88A16,#F5BD4A)', c: GOLD},
];
const Econ: React.FC = () => {
  const f = useCurrentFrame();
  const BX = 160;
  const BW = 1600;
  let acc = 0;
  return (
    <AbsoluteFill>
      <LightGround f={f + 520} />
      <Eyebrow f={f} at={2} x={BX} y={150}>Proposed economics</Eyebrow>
      <div style={{position: 'absolute', left: BX, top: 196}}>
        <FadeWords segments={[{text: 'Fund depth. ', color: INK}, {text: 'Fund security.', gradient: GRAD}]} start={4} size={84} font={SERIF} weight={600} tracking={-0.02} stagger={4} align="left" style={{paddingRight: 20}} />
      </div>
      <div style={{position: 'absolute', left: BX, top: 380, width: BW, height: 26, borderRadius: 999, background: SURF2, boxShadow: `inset 0 0 0 1px ${RULE}`, overflow: 'hidden', display: 'flex'}}>
        {ALLOC.map((a, k) => (
          <div key={a.t} style={{width: `${a.p * prog(f, 26 + k * 14, 18, inOut)}%`, height: '100%', background: a.g}} />
        ))}
      </div>
      {ALLOC.map((a, k) => {
        const x = BX + (acc / 100) * BW;
        acc += a.p;
        const on = prog(f, 34 + k * 14, 18, expoOut);
        return (
          <div key={a.t} style={{position: 'absolute', left: x + (k ? 20 : 0), top: 450, width: (a.p / 100) * BW - 20, height: 330, padding: '30px 32px', boxSizing: 'border-box', borderRadius: 22, background: SURF, border: `1px solid ${RULE}`, boxShadow: SHADOW, opacity: on, transform: `translateY(${(1 - on) * 24}px)`}}>
            <div style={{fontFamily: SERIF, fontWeight: 600, fontSize: 88, lineHeight: 1, color: a.c, letterSpacing: '-0.02em'}}>
              {Math.round(a.p * prog(f, 34 + k * 14, 22, expoOut))}%
            </div>
            <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 32, color: INK, marginTop: 18}}>{a.t}</div>
            <div style={{fontFamily: SANS, fontSize: 23, lineHeight: 1.5, color: INK2, marginTop: 10}}>{a.d}</div>
          </div>
        );
      })}
      <Mono style={{position: 'absolute', left: BX, top: 830, fontSize: 18, letterSpacing: '0.06em', color: INK2, opacity: prog(f, 80, 16)}}>
        CREATOR-FEE ROUTING ACTIVATES ONLY AFTER VERIFIED WALLETS AND TREASURY CONTROLS EXIST.
      </Mono>
    </AbsoluteFill>
  );
};

// ── 5. build status ─────────────────────────────────────────
const STAT = [
  {tag: 'WORKING', tc: GREEN, tb: GREEN_SOFT, t: 'Solana Devnet wallet layer', d: 'Connect, read balances, simulate, sign, confirm, explorer receipts.'},
  {tag: 'NEXT', tc: PURPLE_INK, tb: PURPLE_SOFT, t: 'Reference circuits + devnet vault', d: 'Commitment and nullifier circuits, test vectors, an onchain verifier.'},
  {tag: 'BEFORE MAINNET', tc: GOLD, tb: '#FFF3D6', t: 'Audit + trusted setup', d: 'Independent review of circuits and program, plus a public setup ceremony.'},
];
const Status: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <LightGround f={f + 660} />
      <Eyebrow f={f} at={2} x={160} y={150}>Build status</Eyebrow>
      <div style={{position: 'absolute', left: 160, top: 196}}>
        <FadeWords segments="Ship the cryptography" start={4} size={84} font={SERIF} weight={600} tracking={-0.02} stagger={4} align="left" style={{color: INK}} />
      </div>
      <div style={{position: 'absolute', left: 160, top: 290}}>
        <FadeWords segments={[{text: 'before the claim.', gradient: GRAD}]} start={16} size={84} font={SERIF} weight={600} tracking={-0.02} stagger={4} align="left" style={{fontStyle: 'italic', paddingRight: 20}} />
      </div>
      {STAT.map((s, k) => {
        const on = prog(f, 30 + k * 12, 18, expoOut);
        return (
          <div key={s.t} style={{position: 'absolute', left: 160 + k * 544, top: 470, width: 512, height: 290, padding: '30px 32px', boxSizing: 'border-box', borderRadius: 22, background: SURF, border: `1px solid ${k === 0 ? `${GREEN}66` : RULE}`, boxShadow: SHADOW, opacity: on, transform: `translateY(${(1 - on) * 24}px)`}}>
            <span style={{display: 'inline-flex', alignItems: 'center', gap: 9, padding: '8px 14px', borderRadius: 8, background: s.tb, color: s.tc, fontFamily: MONO, fontWeight: 600, fontSize: 16, letterSpacing: '0.1em'}}>
              {k === 0 && <span style={{width: 9, height: 9, borderRadius: 5, background: GREEN, opacity: 0.5 + 0.5 * Math.sin(f / 5)}} />}
              {s.tag}
            </span>
            <div style={{fontFamily: SERIF, fontWeight: 600, fontSize: 36, lineHeight: 1.15, color: INK, marginTop: 22, letterSpacing: '-0.01em'}}>{s.t}</div>
            <div style={{fontFamily: SANS, fontSize: 22, lineHeight: 1.5, color: INK2, marginTop: 12}}>{s.d}</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 160, top: 810, display: 'flex', gap: 20}}>
        {[
          ['Public mint', 'Not launched'],
          ['Public market', 'Not published'],
          ['Privacy program', 'Not deployed'],
        ].map(([a, b], k) => (
          <div key={a} style={{display: 'flex', gap: 14, alignItems: 'baseline', padding: '14px 22px', borderRadius: 12, background: SURF2, border: `1px solid ${RULE}`, opacity: prog(f, 72 + k * 8, 14)}}>
            <Mono style={{fontSize: 15}}>{a.toUpperCase()}</Mono>
            <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 21, color: INK}}>{b}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ── 6. close ────────────────────────────────────────────────
const Finale: React.FC = () => {
  const f = useCurrentFrame();
  const lineOut = prog(f, 72, 16, expoIn);
  const mark = prog(f, 86, 30, expoOut);
  return (
    <AbsoluteFill>
      <DarkGround f={f + 800} />
      <Mono style={{position: 'absolute', left: 0, right: 0, top: 320, textAlign: 'center', fontSize: 19, color: W_MUTED, opacity: prog(f, 2, 12) * (1 - lineOut)}}>
        <span style={{color: GOLD_BRIGHT}}>ZCASH HERITAGE</span> · <span style={{color: NEON}}>SOLANA EXECUTION</span>
      </Mono>
      <div style={{position: 'absolute', left: 0, right: 0, top: 380, opacity: 1 - lineOut, transform: `translateY(${-lineOut * 30}px)`, filter: lineOut > 0 ? `blur(${lineOut * 8}px)` : undefined}}>
        <FadeWords segments="Privacy should hide the user." start={6} size={104} font={SERIF} weight={600} tracking={-0.02} stagger={4} style={{color: W_INK}} />
        <div style={{height: 14}} />
        <FadeWords segments={[{text: 'Not the standard.', gradient: GRAD}]} start={30} size={104} font={SERIF} weight={600} tracking={-0.02} stagger={5} style={{fontStyle: 'italic', paddingRight: 20}} />
      </div>
      {/* lockup */}
      <div style={{position: 'absolute', left: 960 - 560, top: 150, width: 1120, height: 560, background: 'radial-gradient(closest-side, rgba(139,67,255,0.30), transparent)', opacity: mark}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 250, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 34, opacity: mark, transform: `translateY(${(1 - mark) * 30}px) scale(${lerp(0.94, 1, mark)})`, filter: mark < 1 ? `blur(${(1 - mark) * 10}px)` : undefined}}>
        <Mark size={220} />
        <div style={{fontFamily: SERIF, fontWeight: 600, fontSize: 220, lineHeight: 1, letterSpacing: '-0.03em', paddingBottom: 20}}>
          <span style={{backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent'}}>z</span>
          <span style={{color: W_INK}}>SOL</span>
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 540}}>
        <FadeWords segments={[{text: 'Private SOL. ', color: W_INK}, {text: 'Verifiable origin.', gradient: GRAD}]} start={104} size={66} font={SERIF} weight={600} tracking={-0.01} stagger={4} style={{paddingRight: 20}} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 690, display: 'flex', justifyContent: 'center', opacity: prog(f, 122, 16, expoOut), transform: `translateY(${(1 - prog(f, 122, 16, expoOut)) * 14}px)`}}>
        <div style={{padding: '22px 46px', borderRadius: 16, backgroundImage: GRAD, fontFamily: MONO, fontWeight: 600, fontSize: 34, letterSpacing: '0.1em', color: '#fff', boxShadow: '0 20px 60px -20px rgba(139,67,255,0.7)'}}>ZSOLANA.FUN</div>
      </div>
      <Mono style={{position: 'absolute', left: 0, right: 0, top: 900, textAlign: 'center', fontSize: 15, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', opacity: prog(f, 136, 16)}}>
        PRIVACY PROTOCOL NOT DEPLOYED OR AUDITED · INDEPENDENT PROJECT, NOT AFFILIATED WITH ZCASH OR ECC
      </Mono>
    </AbsoluteFill>
  );
};

export const ZsolanaFilm: React.FC<{withAudio?: boolean}> = ({withAudio = true}) => (
  <AbsoluteFill style={{background: HERO}}>
    <Sequence from={S.hero.from} durationInFrames={S.hero.dur} name="01 Private SOL. Verifiable origin.">
      <Push dur={S.hero.dur}>
        <Hero />
      </Push>
    </Sequence>
    <Sequence from={S.how.from} durationInFrames={S.how.dur} name="02 How it works">
      <Push dur={S.how.dur}>
        <How />
      </Push>
    </Sequence>
    <Sequence from={S.proof.from} durationInFrames={S.proof.dur} name="03 Proof model">
      <Push dur={S.proof.dur} origin="1400px 500px">
        <Proof />
      </Push>
    </Sequence>
    <Sequence from={S.econ.from} durationInFrames={S.econ.dur} name="04 Proposed economics">
      <Push dur={S.econ.dur}>
        <Econ />
      </Push>
    </Sequence>
    <Sequence from={S.status.from} durationInFrames={S.status.dur} name="05 Build status">
      <Push dur={S.status.dur}>
        <Status />
      </Push>
    </Sequence>
    <Sequence from={S.finale.from} durationInFrames={S.finale.dur} name="06 zSOL">
      <Push dur={S.finale.dur} last>
        <Finale />
      </Push>
    </Sequence>
    {withAudio && <Audio src={staticFile('zsolana-score.wav')} />}
  </AbsoluteFill>
);
