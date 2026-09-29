import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {FadeWords} from '../premium/ui';
import {expoIn, expoOut, inOut, lerp, prog} from '../theme';
import tl from './zsolana-timeline.json';
import {LOGO_GRAD, ZsolMark} from './Logo';

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
      <div style={{position: 'absolute', inset: 0, borderRadius: r, border: '1.5px solid rgba(77,120,255,0.45)', boxShadow: 'inset 0 0 70px rgba(77,120,255,0.18), 0 0 70px rgba(0,213,255,0.10)'}} />
      <div style={{position: 'absolute', inset: 30, borderRadius: r, border: '1px solid rgba(255,255,255,0.09)'}} />
      <div style={{position: 'absolute', inset: 66, borderRadius: r, border: '1px solid rgba(255,255,255,0.09)'}} />
      <ZsolMark size={112} glow={0.8} id="orb" style={{position: 'absolute', left: r - 56, top: r - 56}} />
      {dots.map((d, k) => {
        const a = d.a + f * d.sp;
        return <div key={k} style={{position: 'absolute', left: r + Math.cos(a) * d.rr - 8, top: r + Math.sin(a) * d.rr - 8, width: 16, height: 16, borderRadius: 8, background: d.c, border: `2px solid ${HERO}`, boxShadow: `0 0 20px ${d.c}`}} />;
      })}
    </div>
  );
};

const HeroBody: React.FC = () => {
  const f = useCurrentFrame();
  const card = prog(f, 34, 26, expoOut);
  const step = (k: number) => prog(f, 70 + k * 18, 12);
  const verdict = prog(f, 124, 16, expoOut);
  const route = [
    {n: '01', t: 'Deposit', v: '1 SOL'},
    {n: '02', t: 'Shield', v: 'Private note'},
    {n: '03', t: 'Exit', v: 'Fresh address'},
  ];
  const trust = ['Private note ≠ zSOL', '0.1% proposed swap fee', 'APY from real fees only'];
  return (
    <AbsoluteFill>
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


// logo reveal → settles as the brand mark, then the hero builds around it
const INTRO = 30;
const Hero: React.FC = () => {
  const f = useCurrentFrame();
  const inn = prog(f, 0, 20, expoOut);
  const sheen = prog(f, 8, 22, inOut);
  const m = prog(f, INTRO, 20, inOut);
  const BIG = 320;
  const cx = lerp(960, 140 + 32, m);
  const cy = lerp(540, 104 + 32, m);
  const sc = lerp(lerp(0.72, 1, inn), 64 / BIG, m);
  return (
    <AbsoluteFill>
      <DarkGround f={f} />
      <Sequence from={INTRO + 14} layout="none">
        <HeroBody />
      </Sequence>
      <div style={{position: 'absolute', left: 960 - 700, top: 540 - 450, width: 1400, height: 900, background: 'radial-gradient(closest-side, rgba(45,99,255,0.35), rgba(230,28,255,0.10) 60%, transparent)', opacity: inn * (1 - m)}} />
      <div style={{position: 'absolute', left: cx - BIG / 2, top: cy - BIG / 2, width: BIG, height: BIG, transform: `scale(${sc})`, opacity: Math.min(1, inn * 1.4), filter: inn < 1 ? `blur(${(1 - inn) * 14}px)` : undefined}}>
        <ZsolMark size={BIG} glow={lerp(1.3, 0.6, m)} sheen={sheen} id="intro" />
      </div>
      <div style={{position: 'absolute', left: 140 + 70, top: 104 + 6, fontFamily: SERIF, fontWeight: 600, fontSize: 48, lineHeight: 1, letterSpacing: '-0.02em', color: W_INK, opacity: prog(f, INTRO + 14, 14), transform: `translateX(${(1 - prog(f, INTRO + 14, 16, expoOut)) * -12}px)`}}>
        zSOL
      </div>
    </AbsoluteFill>
  );
};

// ── 2. the problem: Solana is a public ledger ────────────────
const SAT = [
  {x: 470, y: 400, t: '+42 SOL', d: 'salary', c: NEON},
  {x: 1450, y: 390, t: '−12 SOL', d: 'rent', c: '#FF8A7A'},
  {x: 1500, y: 590, t: '−3 SOL', d: 'swap → $BONK', c: '#FF8A7A'},
  {x: 420, y: 610, t: '+8 SOL', d: 'NFT sale', c: NEON},
  {x: 560, y: 810, t: '−1 SOL', d: 'to a friend', c: '#FF8A7A'},
];
const YX = 960;
const YY = 590;
const Problem: React.FC = () => {
  const f = useCurrentFrame();
  const you = prog(f, 22, 18, expoOut);
  const bal = prog(f, 96, 16, expoOut);
  const nw = prog(f, 128, 18, expoOut);
  const link = prog(f, 138, 20, inOut);
  const NX = 1390;
  const NY = 810;
  return (
    <AbsoluteFill>
      <DarkGround f={f + 170} />
      <Eyebrow f={f} at={2} x={150} y={118} color="#FF8A7A">The problem</Eyebrow>
      <div style={{position: 'absolute', left: 150, top: 160}}>
        <FadeWords segments={[{text: 'On Solana, every transfer is ', color: W_INK}, {text: 'public.', color: '#FF8A7A'}]} start={4} size={76} font={SERIF} weight={600} tracking={-0.02} stagger={3} align="left" />
      </div>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {SAT.map((s, k) => {
          const p = prog(f, 36 + k * 9, 16, inOut);
          return <line key={k} x1={YX} y1={YY} x2={lerp(YX, s.x, p)} y2={lerp(YY, s.y, p)} stroke="rgba(255,255,255,0.28)" strokeWidth={2} strokeDasharray="3 7" />;
        })}
        {link > 0 && <line x1={YX} y1={YY} x2={lerp(YX, NX, link)} y2={lerp(YY, NY, link)} stroke="#FF8A7A" strokeWidth={3} strokeDasharray="10 8" />}
      </svg>
      {SAT.map((s, k) => {
        const p = prog(f, 44 + k * 9, 14, expoOut);
        return (
          <div key={k} style={{position: 'absolute', left: s.x - 150, top: s.y - 34, width: 300, height: 68, borderRadius: 16, background: 'rgba(255,255,255,0.06)', border: `1px solid ${W_RULE}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, opacity: p, transform: `scale(${lerp(0.85, 1, p)})`}}>
            <span style={{fontFamily: MONO, fontWeight: 600, fontSize: 24, color: s.c}}>{s.t}</span>
            <span style={{fontFamily: SANS, fontSize: 22, color: W_DIM}}>{s.d}</span>
          </div>
        );
      })}
      {/* you */}
      <div style={{position: 'absolute', left: YX - 160, top: YY - 70, width: 320, height: 140, borderRadius: 22, background: '#1B1528', border: `1.5px solid ${bal > 0.5 ? '#FF8A7A' : 'rgba(181,123,255,0.6)'}`, boxShadow: bal > 0.5 ? '0 0 50px rgba(255,138,122,0.3)' : '0 0 50px rgba(139,67,255,0.3)', opacity: you, transform: `scale(${lerp(0.9, 1, you)})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontFamily: SERIF, fontWeight: 600, fontSize: 46, color: W_INK}}>You</div>
        <Mono style={{fontSize: 18, color: W_MUTED, marginTop: 4}}>7xKq…3fA</Mono>
        {/* scanner sweep */}
        {f > 84 && f < 112 && <div style={{position: 'absolute', left: 0, right: 0, top: lerp(0, 140, prog(f, 84, 26)), height: 3, background: '#FF8A7A', boxShadow: '0 0 18px #FF8A7A'}} />}
      </div>
      <div style={{position: 'absolute', left: YX - 300, top: YY - 150, width: 600, display: 'flex', justifyContent: 'center', opacity: bal, transform: `translateY(${(1 - bal) * 10}px)`}}>
        <div style={{fontFamily: MONO, fontWeight: 600, fontSize: 19, letterSpacing: '0.08em', color: HERO, background: '#FF8A7A', padding: '9px 16px', borderRadius: 9}}>BALANCE 184.2 SOL · VISIBLE TO ANYONE</div>
      </div>
      {/* fresh wallet — still linked */}
      <div style={{position: 'absolute', left: NX - 150, top: NY - 50, width: 300, height: 100, borderRadius: 18, background: '#1B1528', border: '1.5px solid rgba(255,255,255,0.18)', opacity: nw, transform: `scale(${lerp(0.9, 1, nw)})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 26, color: W_INK}}>New wallet</div>
        <Mono style={{fontSize: 16, color: W_MUTED, marginTop: 2}}>Hn2w…9QeT</Mono>
      </div>
      <Mono style={{position: 'absolute', left: lerp(YX, NX, 0.55) + 10, top: lerp(YY, NY, 0.55) - 40, width: 120, textAlign: 'center', fontSize: 17, fontWeight: 600, color: '#FF8A7A', opacity: prog(f, 150, 10)}}>LINKED</Mono>
      <div style={{position: 'absolute', left: 0, right: 0, top: 940}}>
        <FadeWords segments={[{text: 'Your balance, your history, everyone you pay. ', color: W_DIM}, {text: 'A new wallet doesn’t fix it.', color: W_INK}]} start={112} size={32} font={SANS} weight={400} stagger={1.5} />
      </div>
    </AbsoluteFill>
  );
};

// ── 3. the fix: a shared crowd breaks the link ──────────────
const DEP = ['Wallet A', 'Wallet B', 'You', 'Wallet D', 'Wallet E', 'Wallet F'];
const PX = 960;
const PY = 610;
const Fix: React.FC = () => {
  const f = useCurrentFrame();
  const DX = 330;
  const FX = 1600;
  const dy = (k: number) => 390 + k * 88;
  const out = prog(f, 104, 30, inOut);
  const ask = prog(f, 138, 16, expoOut);
  const cut = prog(f, 150, 18, expoOut);
  return (
    <AbsoluteFill>
      <LightGround f={f + 360} />
      <Eyebrow f={f} at={2} x={150} y={118}>How zSOL helps</Eyebrow>
      <div style={{position: 'absolute', left: 150, top: 160}}>
        <FadeWords segments={[{text: 'zSOL ', color: INK}, {text: 'breaks the link.', gradient: GRAD}]} start={4} size={76} font={SERIF} weight={600} tracking={-0.02} stagger={4} align="left" style={{paddingRight: 20}} />
      </div>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {DEP.map((_, k) => (
          <line key={k} x1={DX + 130} y1={dy(k)} x2={PX - 200} y2={PY} stroke={k === 2 ? PURPLE : RULE} strokeWidth={k === 2 ? 2.5 : 2} strokeDasharray="4 8" opacity={prog(f, 22 + k * 4, 12)} />
        ))}
        <line x1={PX + 200} y1={PY} x2={FX - 150} y2={PY} stroke={RULE} strokeWidth={2} strokeDasharray="4 8" opacity={prog(f, 96, 12)} />
        {/* the link that used to exist */}
        <path d={`M ${DX + 130} ${dy(2)} Q ${PX} 160 ${FX - 150} ${PY - 40}`} fill="none" stroke={RED} strokeWidth={2.5} strokeDasharray="8 8" opacity={0.7 * prog(f, 150, 12) * (1 - 0.6 * cut)} />
      </svg>
      {/* depositors */}
      {DEP.map((d, k) => {
        const p = prog(f, 14 + k * 4, 14, expoOut);
        const me = k === 2;
        return (
          <div key={d} style={{position: 'absolute', left: DX - 130, top: dy(k) - 32, width: 260, height: 64, borderRadius: 14, background: me ? PURPLE_SOFT : SURF, border: `1.5px solid ${me ? PURPLE : RULE}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', boxSizing: 'border-box', opacity: p, transform: `translateX(${(1 - p) * -20}px)`}}>
            <span style={{fontFamily: SANS, fontWeight: 600, fontSize: 22, color: me ? PURPLE_INK : INK}}>{d}</span>
            <span style={{fontFamily: MONO, fontWeight: 600, fontSize: 20, color: INK2}}>1 SOL</span>
          </div>
        );
      })}
      {/* coins flowing in */}
      {DEP.map((_, k) => {
        const t = prog(f, 34 + k * 7, 26, inOut);
        if (t <= 0 || t >= 1) return null;
        return <div key={k} style={{position: 'absolute', left: lerp(DX + 130, PX - 150, t) - 10, top: lerp(dy(k), PY, t) - 10, width: 20, height: 20, borderRadius: 10, background: k === 2 ? PURPLE : '#B9A8E0', boxShadow: k === 2 ? `0 0 16px ${PURPLE}` : undefined}} />;
      })}
      {/* shared pool */}
      <div style={{position: 'absolute', left: PX - 190, top: PY - 190, width: 380, height: 380, borderRadius: 190, background: 'radial-gradient(circle, #FFFFFF, #F1EAFE 70%)', border: `1.5px solid ${PURPLE}55`, boxShadow: '0 30px 80px -30px rgba(139,67,255,0.45)', opacity: prog(f, 18, 16), transform: `scale(${lerp(0.9, 1, prog(f, 18, 20, expoOut))})`}}>
        {new Array(46).fill(0).map((_, i) => {
          const a = i * 2.39996 + f * 0.006;
          const r = 22 * Math.sqrt(i + 0.5);
          const filled = i < 6 + Math.floor(prog(f, 34, 70) * 40);
          return <div key={i} style={{position: 'absolute', left: 190 + Math.cos(a) * r - 8, top: 190 + Math.sin(a) * r - 8, width: 16, height: 16, borderRadius: 5, background: filled ? GREEN_SOFT : SURF2, border: `1.5px solid ${filled ? GREEN : RULE}`}} />;
        })}
      </div>
      <Mono style={{position: 'absolute', left: PX - 250, top: PY + 210, width: 500, textAlign: 'center', fontSize: 17, fontWeight: 600, color: PURPLE_INK, opacity: prog(f, 24, 14)}}>ONE SHARED POOL · SAME-SIZE DEPOSITS</Mono>
      {/* withdrawal */}
      {out > 0 && out < 1 && <div style={{position: 'absolute', left: lerp(PX + 150, FX - 150, out) - 12, top: PY - 12, width: 24, height: 24, borderRadius: 12, background: GREEN, boxShadow: `0 0 18px ${NEON}`}} />}
      <div style={{position: 'absolute', left: FX - 150, top: PY - 70, width: 300, height: 140, borderRadius: 20, background: SURF, border: `1.5px solid ${out >= 1 ? GREEN : RULE}`, boxShadow: SHADOW, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: prog(f, 90, 14)}}>
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 26, color: INK}}>Fresh address</div>
        <Mono style={{fontSize: 16, marginTop: 4}}>Hn2w…9QeT</Mono>
        <div style={{fontFamily: MONO, fontWeight: 600, fontSize: 20, color: GREEN, marginTop: 8, opacity: prog(f, 130, 10)}}>+1 SOL · ZK proof ✓</div>
      </div>
      <div style={{position: 'absolute', left: FX - 190, top: PY + 96, width: 380, textAlign: 'center', opacity: ask, transform: `translateY(${(1 - ask) * 10}px)`}}>
        <Mono style={{fontSize: 16, fontWeight: 600, color: INK2}}>WHICH DEPOSIT PAID THIS?</Mono>
        <div style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 600, fontSize: 36, color: PURPLE_INK, marginTop: 6}}>Could be any of them.</div>
      </div>
      {/* cut mark on the old link */}
      <div style={{position: 'absolute', left: PX - 110, top: 336, width: 220, display: 'flex', justifyContent: 'center', opacity: cut, transform: `scale(${lerp(0.7, 1, cut)})`}}>
        <div style={{fontFamily: MONO, fontWeight: 600, fontSize: 17, letterSpacing: '0.1em', color: '#fff', background: RED, padding: '9px 14px', borderRadius: 9, whiteSpace: 'nowrap'}}>✕ NO ONCHAIN LINK</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 960}}>
        <FadeWords segments="Same amount in. One shared crowd. A zero-knowledge proof out." start={150} size={30} font={SANS} weight={400} stagger={1.5} style={{color: INK2}} />
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
      <Eyebrow f={f} at={2} x={160} y={180}>Private — and provably clean</Eyebrow>
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


// ── 5. what it's for ─────────────────────────────────────────
const USES = [
  {g: '◎', t: 'Get paid privately', d: 'Receive a salary or invoices without exposing your whole balance and history.'},
  {g: '⇄', t: 'Trade unwatched', d: 'Wallet trackers can’t copy or front-run a wallet they can’t link to you.'},
  {g: '↗', t: 'Start fresh', d: 'Move funds to a new wallet with no public trail back to the old one.'},
  {g: '✓', t: 'Stay provably clean', d: 'Prove your SOL isn’t from flagged deposits — without revealing which deposit is yours.'},
];
const Uses: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <LightGround f={f + 900} />
      <Eyebrow f={f} at={2} x={160} y={150}>What it’s for</Eyebrow>
      <div style={{position: 'absolute', left: 160, top: 196}}>
        <FadeWords segments={[{text: 'Privacy you can ', color: INK}, {text: 'actually use.', gradient: GRAD}]} start={4} size={84} font={SERIF} weight={600} tracking={-0.02} stagger={4} align="left" style={{paddingRight: 20}} />
      </div>
      {USES.map((u, k) => {
        const on = prog(f, 26 + k * 12, 18, expoOut);
        const last = k === 3;
        return (
          <div key={u.t} style={{position: 'absolute', left: 160 + k * 408, top: 400, width: 384, height: 400, padding: '34px 32px', boxSizing: 'border-box', borderRadius: 24, background: SURF, border: `1px solid ${last ? `${GREEN}66` : RULE}`, boxShadow: SHADOW, opacity: on, transform: `translateY(${(1 - on) * 28}px)`}}>
            <div style={{width: 76, height: 76, borderRadius: 22, background: last ? GRAD : PURPLE_SOFT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 600, fontSize: 38, color: last ? '#fff' : PURPLE_INK}}>{u.g}</div>
            <div style={{fontFamily: SERIF, fontWeight: 600, fontSize: 40, lineHeight: 1.1, color: INK, marginTop: 30, letterSpacing: '-0.01em'}}>{u.t}</div>
            <div style={{fontFamily: SANS, fontSize: 24, lineHeight: 1.5, color: INK2, marginTop: 14}}>{u.d}</div>
          </div>
        );
      })}
      <Mono style={{position: 'absolute', left: 160, top: 860, fontSize: 17, letterSpacing: '0.08em', color: INK3, opacity: prog(f, 80, 16)}}>
        WHAT THE SHIELDED VAULT IS DESIGNED FOR · PROTOCOL IN DEVELOPMENT
      </Mono>
    </AbsoluteFill>
  );
};

// ── utility: two layers, separate receipts ───────────────────
const LAYERS = [
  {tag: '01 · PRIVATE LAYER', t: 'Shield pool', d: 'Deposit a standard SOL amount. Your device keeps a secret note; only its commitment goes onchain.', kv: [['INPUT', 'Fixed SOL'], ['YOU HOLD', 'Private note'], ['PURPOSE', 'Prove and withdraw'], ['PUBLIC TOKEN', 'Not required']], c: PURPLE_INK, soft: PURPLE_SOFT},
  {tag: '02 · PUBLIC LAYER', t: 'zSOL / SOL market', d: 'Supply both assets to deepen public trading. LP returns come from real swaps, not the shield vault.', kv: [['INPUT', 'zSOL + SOL'], ['YOU HOLD', 'Public LP position'], ['SWAP FEE', '0.1%'], ['APY', 'Variable · volume ÷ TVL']], c: '#0B8A5B', soft: GREEN_SOFT},
];
const LOOP = [
  ['Trade', 'public zSOL/SOL swaps'],
  ['Earn', 'LPs share the 0.1% swap fee'],
  ['Reinforce', '40% of creator fees deepens liquidity'],
];
const Utility: React.FC = () => {
  const f = useCurrentFrame();
  const sep = prog(f, 54, 16, expoOut);
  return (
    <AbsoluteFill>
      <LightGround f={f + 980} />
      <Eyebrow f={f} at={2} x={150} y={104}>zSOL utility</Eyebrow>
      <div style={{position: 'absolute', left: 150, top: 146}}>
        <FadeWords segments="One ecosystem." start={4} size={72} font={SERIF} weight={600} tracking={-0.02} stagger={4} align="left" style={{color: INK}} />
      </div>
      <div style={{position: 'absolute', left: 150, top: 226}}>
        <FadeWords segments={[{text: 'Two very different pools.', gradient: GRAD}]} start={14} size={72} font={SERIF} weight={600} tracking={-0.02} stagger={4} align="left" style={{fontStyle: 'italic', paddingRight: 20}} />
      </div>
      {LAYERS.map((l, k) => {
        const on = prog(f, 26 + k * 16, 18, expoOut);
        return (
          <div key={l.t} style={{position: 'absolute', left: k ? 1070 : 150, top: 360, width: 700, height: 440, padding: '30px 34px', boxSizing: 'border-box', borderRadius: 24, background: SURF, border: `1px solid ${RULE}`, boxShadow: SHADOW, opacity: on, transform: `translateY(${(1 - on) * 26}px)`}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <Mono style={{fontSize: 17, fontWeight: 600, color: l.c}}>{l.tag}</Mono>
              <span style={{fontFamily: MONO, fontSize: 14, letterSpacing: '0.1em', color: INK3, border: `1px solid ${RULE}`, borderRadius: 8, padding: '5px 10px'}}>PROPOSED</span>
            </div>
            <div style={{fontFamily: SERIF, fontWeight: 600, fontSize: 46, color: INK, marginTop: 14, letterSpacing: '-0.01em'}}>{l.t}</div>
            <div style={{fontFamily: SANS, fontSize: 22, lineHeight: 1.5, color: INK2, marginTop: 8}}>{l.d}</div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 22}}>
              {l.kv.map(([a, b], j) => (
                <div key={a} style={{padding: '12px 16px', borderRadius: 12, background: j === 2 && k === 1 ? l.soft : SURF2, opacity: prog(f, 40 + k * 16 + j * 4, 12)}}>
                  <Mono style={{fontSize: 13}}>{a}</Mono>
                  <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 23, color: INK, marginTop: 4}}>{b}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 960 - 80, top: 520, width: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: sep, transform: `scale(${lerp(0.8, 1, sep)})`}}>
        <div style={{width: 84, height: 84, borderRadius: 42, background: SURF, border: `1.5px solid ${RULE}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 600, fontSize: 44, color: INK}}>≠</div>
        <Mono style={{fontSize: 14, fontWeight: 600, textAlign: 'center', marginTop: 12, lineHeight: 1.5, color: INK2}}>SEPARATE<br />RECEIPTS</Mono>
      </div>
      <div style={{position: 'absolute', left: 150, top: 850, width: 1620, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        {LOOP.map(([a, b], k) => (
          <div key={a} style={{display: 'contents'}}>
            <div style={{display: 'flex', alignItems: 'baseline', gap: 12, padding: '16px 24px', borderRadius: 14, background: SURF, border: `1px solid ${RULE}`, opacity: prog(f, 84 + k * 12, 14), transform: `translateY(${(1 - prog(f, 84 + k * 12, 16, expoOut)) * 10}px)`}}>
              <Mono style={{fontSize: 15, fontWeight: 600, color: PURPLE_INK}}>{`0${k + 1}`}</Mono>
              <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 24, color: INK}}>{a}</div>
              <div style={{fontFamily: SANS, fontSize: 21, color: INK2}}>{b}</div>
            </div>
            {k < 2 && <span style={{fontFamily: SANS, fontSize: 28, color: INK3, opacity: prog(f, 90 + k * 12, 10)}}>→</span>}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ── holders: 25,000+ zSOL minimum for the queue bonus ────────
const MIN_HOLD = 25000;
const WAYS = [
  ['Standard shield', 'Deposit fixed SOL, keep the note, prove a one-time withdrawal.'],
  ['Time-weighted', 'Hold the note through a minimum window so more commitments can gather.'],
  ['Liquidity LP', 'Provide zSOL + SOL and earn a share of the 0.1% swap fee.'],
  ['Hybrid', 'A private note and a public LP position, side by side.'],
];
const Holders: React.FC = () => {
  const f = useCurrentFrame();
  const MAX = 40000;
  const v = 31400 * prog(f, 40, 56, inOut);
  const ok = v >= MIN_HOLD;
  const okP = prog(f, 40 + 56 * 0.72, 12, expoOut) * (ok ? 1 : 0);
  const BW = 640;
  return (
    <AbsoluteFill>
      <LightGround f={f + 1160} />
      <Eyebrow f={f} at={2} x={150} y={104}>Holder bonus</Eyebrow>
      <div style={{position: 'absolute', left: 150, top: 146}}>
        <FadeWords segments={[{text: 'Hold ', color: INK}, {text: '25,000+', gradient: GRAD}, {text: ' zSOL.', color: INK}]} start={4} size={80} font={SERIF} weight={600} tracking={-0.02} stagger={4} align="left" style={{paddingRight: 20}} />
      </div>
      <div style={{position: 'absolute', left: 150, top: 238}}>
        <FadeWords segments="Qualify for the bonus in the queue." start={16} size={44} font={SERIF} weight={600} tracking={-0.01} stagger={3} align="left" style={{color: INK2, fontStyle: 'italic'}} />
      </div>
      {/* meter */}
      <div style={{position: 'absolute', left: 150, top: 360, width: 740, height: 460, padding: '34px 40px', boxSizing: 'border-box', borderRadius: 26, background: SURF, border: `1px solid ${ok ? `${GREEN}88` : RULE}`, boxShadow: ok ? `${SHADOW}, 0 0 0 6px ${GREEN_SOFT}` : SHADOW, opacity: prog(f, 22, 16), transform: `translateY(${(1 - prog(f, 22, 18, expoOut)) * 24}px)`}}>
        <Mono style={{fontSize: 16, fontWeight: 600}}>EXAMPLE WALLET · zSOL BALANCE</Mono>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 14}}>
          <ZsolMark size={70} glow={0.5} id="hold" style={{alignSelf: 'center'}} />
          <div style={{fontFamily: SERIF, fontWeight: 600, fontSize: 112, lineHeight: 1, color: INK, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums'}}>{Math.round(v).toLocaleString('en-US')}</div>
          <div style={{fontFamily: MONO, fontWeight: 600, fontSize: 28, color: INK3}}>zSOL</div>
        </div>
        <div style={{position: 'relative', marginTop: 44, width: BW, height: 20, borderRadius: 999, background: SURF2, boxShadow: `inset 0 0 0 1px ${RULE}`}}>
          <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: (v / MAX) * BW, borderRadius: 999, background: ok ? 'linear-gradient(90deg,#14B87A,#14F195)' : 'linear-gradient(90deg,#9945FF,#B66CFF)'}} />
          <div style={{position: 'absolute', left: (MIN_HOLD / MAX) * BW - 1.5, top: -16, width: 3, height: 52, background: INK, borderRadius: 2}} />
          <Mono style={{position: 'absolute', left: (MIN_HOLD / MAX) * BW - 100, top: 44, width: 200, textAlign: 'center', fontSize: 15, fontWeight: 600, color: INK}}>MIN 25,000</Mono>
        </div>
        <div style={{marginTop: 84, display: 'flex', alignItems: 'center', gap: 14, padding: '18px 22px', borderRadius: 16, background: ok ? GREEN_SOFT : SURF2, border: `1px solid ${ok ? `${GREEN}66` : RULE}`}}>
          <span style={{width: 34, height: 34, borderRadius: 17, background: ok ? GREEN : RULE, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, transform: `scale(${lerp(1, 1.15, okP * (1 - prog(f, 110, 10)))})`}}>{ok ? '✓' : ''}</span>
          <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 28, color: ok ? '#0B7A51' : INK3}}>{ok ? 'Eligible · queue bonus unlocked' : 'Below minimum'}</div>
        </div>
      </div>
      {/* four ways */}
      <Mono style={{position: 'absolute', left: 1000, top: 372, fontSize: 16, fontWeight: 600, color: PURPLE_INK, opacity: prog(f, 30, 14)}}>FOUR WAYS THROUGH THE DESIGN</Mono>
      {WAYS.map(([a, b], k) => {
        const on = prog(f, 40 + k * 12, 16, expoOut);
        return (
          <div key={a} style={{position: 'absolute', left: 1000, top: 414 + k * 104, width: 770, height: 90, padding: '0 26px', boxSizing: 'border-box', borderRadius: 18, background: SURF, border: `1px solid ${RULE}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', gap: 22, opacity: on, transform: `translateX(${(1 - on) * 24}px)`}}>
            <Mono style={{fontSize: 17, fontWeight: 600, color: PURPLE_INK}}>{`0${k + 1}`}</Mono>
            <div style={{width: 200, fontFamily: SANS, fontWeight: 600, fontSize: 24, color: INK, flexShrink: 0}}>{a}</div>
            <div style={{fontFamily: SANS, fontSize: 19, lineHeight: 1.4, color: INK2}}>{b}</div>
          </div>
        );
      })}
      <Mono style={{position: 'absolute', left: 150, top: 880, fontSize: 16, letterSpacing: '0.06em', color: INK3, opacity: prog(f, 100, 14)}}>
        APY IS NEVER FIXED OR GUARANTEED · IT COMES ONLY FROM LIVE SWAP-FEE REVENUE · CA PENDING
      </Mono>
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
      <div style={{position: 'absolute', left: 960 - 560, top: 150, width: 1120, height: 560, background: 'radial-gradient(closest-side, rgba(45,99,255,0.32), rgba(230,28,255,0.10) 60%, transparent)', opacity: mark}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 250, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, opacity: mark, transform: `translateY(${(1 - mark) * 30}px) scale(${lerp(0.94, 1, mark)})`, filter: mark < 1 ? `blur(${(1 - mark) * 10}px)` : undefined}}>
        <ZsolMark size={250} glow={1.2} id="fin" />
        <div style={{fontFamily: SERIF, fontWeight: 600, fontSize: 220, lineHeight: 1, letterSpacing: '-0.03em', paddingBottom: 20}}>
          <span style={{color: W_INK}}>zSOL</span>
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 540}}>
        <FadeWords segments={[{text: 'Private SOL. ', color: W_INK}, {text: 'Verifiable origin.', gradient: GRAD}]} start={104} size={66} font={SERIF} weight={600} tracking={-0.01} stagger={4} style={{paddingRight: 20}} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 690, display: 'flex', justifyContent: 'center', opacity: prog(f, 122, 16, expoOut), transform: `translateY(${(1 - prog(f, 122, 16, expoOut)) * 14}px)`}}>
        <div style={{padding: '22px 46px', borderRadius: 16, backgroundImage: LOGO_GRAD.replace('45deg', '90deg'), fontFamily: MONO, fontWeight: 600, fontSize: 34, letterSpacing: '0.1em', color: '#fff', boxShadow: '0 20px 60px -20px rgba(139,67,255,0.7)'}}>ZSOLANA.FUN</div>
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
    <Sequence from={S.problem.from} durationInFrames={S.problem.dur} name="02 The problem: every transfer is public">
      <Push dur={S.problem.dur}>
        <Problem />
      </Push>
    </Sequence>
    <Sequence from={S.fix.from} durationInFrames={S.fix.dur} name="03 zSOL breaks the link">
      <Push dur={S.fix.dur}>
        <Fix />
      </Push>
    </Sequence>
    <Sequence from={S.how.from} durationInFrames={S.how.dur} name="04 How it works">
      <Push dur={S.how.dur}>
        <How />
      </Push>
    </Sequence>
    <Sequence from={S.proof.from} durationInFrames={S.proof.dur} name="05 Proof model">
      <Push dur={S.proof.dur} origin="1400px 500px">
        <Proof />
      </Push>
    </Sequence>
    <Sequence from={S.uses.from} durationInFrames={S.uses.dur} name="06 What it is for">
      <Push dur={S.uses.dur}>
        <Uses />
      </Push>
    </Sequence>
    <Sequence from={S.utility.from} durationInFrames={S.utility.dur} name="06b zSOL utility: two pools">
      <Push dur={S.utility.dur}>
        <Utility />
      </Push>
    </Sequence>
    <Sequence from={S.holders.from} durationInFrames={S.holders.dur} name="06c Holder bonus: 25,000+ zSOL">
      <Push dur={S.holders.dur}>
        <Holders />
      </Push>
    </Sequence>
    <Sequence from={S.econ.from} durationInFrames={S.econ.dur} name="07 Proposed economics">
      <Push dur={S.econ.dur}>
        <Econ />
      </Push>
    </Sequence>
    <Sequence from={S.status.from} durationInFrames={S.status.dur} name="08 Build status">
      <Push dur={S.status.dur}>
        <Status />
      </Push>
    </Sequence>
    <Sequence from={S.finale.from} durationInFrames={S.finale.dur} name="09 zSOL">
      <Push dur={S.finale.dur} last>
        <Finale />
      </Push>
    </Sequence>
    {withAudio && <Audio src={staticFile('zsolana-score.wav')} />}
  </AbsoluteFill>
);
