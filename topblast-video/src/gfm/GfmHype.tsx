import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {expoIn, expoOut, inOut, lerp, prog} from '../theme';
import tl from './timeline.json';

// Go Fund Meme — 10s hype. Fully custom, site palette (mint ground, deep green ink,
// lime highlighter), Geist. Kinetic type on the beat, then coin → fees → cause.
const BG = '#F7F9F6';
const CARD = '#FFFFFF';
const INK = '#183B2B';
const INK2 = '#607067';
const RULE = '#DFE7E0';
const GREEN = '#187C4D';
const GREEN2 = '#1F8B59';
const DEEP = '#123C2B';
const LIME = '#C2F78A';
const MINT = '#DDF8E8';
const RED = '#B42336';
const SANS = '"Geist Variable", "Geist", sans-serif';
const MONO = '"Geist Mono Variable", "Geist Mono", monospace';
const SHADOW = '0 24px 60px -30px rgba(18,60,43,0.35), 0 2px 8px rgba(18,60,43,0.06)';
const S = tl.scenes;

export const back = (t: number) => {
  const c = 1.9;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};

export const Ground: React.FC<{f: number; dark?: boolean}> = ({f, dark}) => (
  <AbsoluteFill style={{background: dark ? DEEP : BG}}>
    <div style={{position: 'absolute', left: -300, top: -500, width: 1600, height: 1100, background: `radial-gradient(closest-side, ${dark ? 'rgba(194,247,138,0.16)' : 'rgba(194,247,138,0.55)'}, transparent)`, transform: `translate(${Math.sin(f / 40) * 40}px, 0)`}} />
    <div style={{position: 'absolute', right: -300, bottom: -500, width: 1400, height: 1000, background: `radial-gradient(closest-side, ${dark ? 'rgba(31,139,89,0.35)' : 'rgba(221,248,232,0.9)'}, transparent)`}} />
    <AbsoluteFill style={{backgroundImage: `radial-gradient(${dark ? 'rgba(255,255,255,0.07)' : 'rgba(24,59,43,0.08)'} 1.4px, transparent 1.8px)`, backgroundSize: '40px 40px', backgroundPosition: `${-f * 0.6}px 0px`}} />
  </AbsoluteFill>
);

// word slam: each word punches in from 1.35x with a little overshoot
export const Slam: React.FC<{text: string; start: number; size: number; color?: string; stagger?: number; weight?: number}> = ({text, start, size, color = INK, stagger = 4, weight = 800}) => {
  const f = useCurrentFrame();
  return (
    <div style={{display: 'flex', justifyContent: 'center', gap: size * 0.26, fontFamily: SANS, fontWeight: weight, fontSize: size, letterSpacing: '-0.045em', lineHeight: 1, color}}>
      {text.split(' ').map((w, i) => {
        const p = prog(f, start + i * stagger, 9);
        return (
          <span key={i} style={{display: 'inline-block', opacity: Math.min(1, p * 2.5), transform: `scale(${lerp(1.45, 1, back(p))})`, filter: p < 1 ? `blur(${(1 - p) * 8}px)` : undefined}}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

const Cut: React.FC<{dur: number; last?: boolean; children: React.ReactNode}> = ({dur, last, children}) => {
  const f = useCurrentFrame();
  const i = prog(f, 0, 8, expoOut);
  const o = last ? 0 : prog(f, dur - 6, 6, expoIn);
  return <AbsoluteFill style={{opacity: Math.min(1, i * 2) * (1 - o), transform: `scale(${lerp(1.08, 1, i) * lerp(1, 0.94, o)})`}}>{children}</AbsoluteFill>;
};

// ── 1. hook ────────────────────────────────────────────────
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const mark = prog(f, 40, 10, inOut);
  const shake = f >= 30 && f < 36 ? Math.sin(f * 3) * (36 - f) * 1.4 : 0;
  return (
    <AbsoluteFill>
      <Ground f={f} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 330, transform: `translateY(${-prog(f, 28, 10, expoOut) * 40}px)`}}>
        <Slam text="The internet is funny." start={0} size={132} stagger={4} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 540, transform: `translateX(${shake}px)`}}>
        <div style={{display: 'flex', justifyContent: 'center', gap: 34, fontFamily: SANS, fontWeight: 800, fontSize: 132, letterSpacing: '-0.045em', lineHeight: 1, color: GREEN}}>
          {["Let's", 'make', 'it'].map((w, i) => {
            const p = prog(f, 30 + i * 3, 9);
            return <span key={w} style={{display: 'inline-block', opacity: Math.min(1, p * 2.5), transform: `scale(${lerp(1.45, 1, back(p))})`}}>{w}</span>;
          })}
          <span style={{position: 'relative', display: 'inline-block', opacity: Math.min(1, prog(f, 39, 9) * 2.5), transform: `scale(${lerp(1.45, 1, back(prog(f, 39, 9)))})`}}>
            <span style={{position: 'absolute', left: -16, right: -16, top: 18, bottom: 6, background: LIME, borderRadius: 14, transformOrigin: 'left', transform: `scaleX(${mark}) rotate(-1.5deg)`}} />
            <span style={{position: 'relative', color: INK}}>kind.</span>
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── icons ──────────────────────────────────────────────────
const Icon: React.FC<{kind: 'paw' | 'med' | 'heart'; size: number; color: string}> = ({kind, size, color}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    {kind === 'paw' && (
      <g fill={color}>
        <ellipse cx="50" cy="66" rx="22" ry="18" />
        <ellipse cx="24" cy="42" rx="9" ry="12" />
        <ellipse cx="40" cy="26" rx="9" ry="12" />
        <ellipse cx="60" cy="26" rx="9" ry="12" />
        <ellipse cx="76" cy="42" rx="9" ry="12" />
      </g>
    )}
    {kind === 'med' && <path d="M38 14h24v24h24v24H62v24H38V62H14V38h24z" fill={color} strokeLinejoin="round" stroke={color} strokeWidth="6" />}
    {kind === 'heart' && <path d="M50 86 C20 64 10 48 10 34 C10 20 21 12 32 12 C41 12 47 17 50 24 C53 17 59 12 68 12 C79 12 90 20 90 34 C90 48 80 64 50 86 Z" fill={color} />}
  </svg>
);

const CAUSES = [
  {k: 'ANIMALS', t: 'Rescue shelter meals', icon: 'paw' as const, bg: MINT, c: GREEN, p: 0.62},
  {k: 'MEDICAL', t: "Kids' hospital fund", icon: 'med' as const, bg: '#FBE7EA', c: RED, p: 0.41},
  {k: 'COMMUNITY', t: 'Park cleanup crew', icon: 'heart' as const, bg: '#EEF8D9', c: '#5E8F1F', p: 0.78},
];
const CauseCard: React.FC<{c: (typeof CAUSES)[number]; fill?: number; picked?: number; w?: number}> = ({c, fill, picked = 0, w = 380}) => (
  <div style={{width: w, borderRadius: 28, background: CARD, border: `1.5px solid ${picked > 0.5 ? GREEN : RULE}`, boxShadow: picked > 0.5 ? `${SHADOW}, 0 0 0 ${8 * picked}px ${LIME}` : SHADOW, overflow: 'hidden'}}>
    <div style={{height: w * 0.5, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <Icon kind={c.icon} size={w * 0.3} color={c.c} />
    </div>
    <div style={{padding: '22px 26px 26px'}}>
      <div style={{fontFamily: MONO, fontWeight: 500, fontSize: 16, letterSpacing: '0.12em', color: c.c}}>{c.k}</div>
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 32, letterSpacing: '-0.02em', color: INK, marginTop: 8}}>{c.t}</div>
      <div style={{marginTop: 18, height: 12, borderRadius: 999, background: '#EDF2EE', overflow: 'hidden'}}>
        <div style={{width: `${(fill ?? c.p) * 100}%`, height: '100%', borderRadius: 999, background: `linear-gradient(90deg, ${GREEN2}, #7BD44A)`}} />
      </div>
    </div>
  </div>
);

// ── 2. pick a fundraiser ───────────────────────────────────
const Pick: React.FC = () => {
  const f = useCurrentFrame();
  const pick = prog(f, 30, 8, expoOut);
  return (
    <AbsoluteFill>
      <Ground f={f + 66} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 120}}>
        <Slam text="Pick a fundraiser." start={0} size={104} stagger={3} />
      </div>
      {CAUSES.map((c, k) => {
        const p = prog(f, 6 + k * 4, 12, expoOut);
        const rot = [-5, 0, 5][k];
        const x = 960 + (k - 1) * 440;
        const on = k === 0 ? pick : 0;
        const dim = k !== 0 ? 1 - 0.45 * pick : 1;
        return (
          <div key={c.k} style={{position: 'absolute', left: x - 190, top: 330, opacity: p * dim, transform: `translateY(${(1 - p) * 180}px) rotate(${rot * (1 - on)}deg) scale(${lerp(0.9, 1, p) * (1 + on * 0.06)})`, zIndex: k === 0 ? 2 : 1}}>
            <CauseCard c={c} picked={on} />
            {k === 0 && (
              <div style={{position: 'absolute', right: -20, top: -20, width: 64, height: 64, borderRadius: 32, background: GREEN, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 34, transform: `scale(${back(pick)})`, opacity: pick}}>✓</div>
            )}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ── 3+4. launch a coin → creator fees fund the cause ───────
const CX = 560;
const KX = 1380;
const MY = 600;
const Coin: React.FC<{f: number}> = ({f}) => {
  const p = prog(f, 4, 16);
  const spin = lerp(540, 0, expoOut(p));
  return (
    <div style={{width: 320, height: 320, perspective: 1200}}>
      <div style={{width: 320, height: 320, borderRadius: 160, transform: `rotateY(${spin}deg) scale(${lerp(0.3, 1, back(Math.min(1, p * 1.2)))})`, background: 'radial-gradient(circle at 35% 30%, #E3FFC4, #9BE35A 45%, #3FA85A 80%)', border: `6px solid ${DEEP}`, boxShadow: `0 30px 70px -20px rgba(18,60,43,0.55), inset 0 -10px 30px rgba(18,60,43,0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: Math.min(1, p * 3)}}>
        <div style={{width: 250, height: 250, borderRadius: 125, border: `3px dashed rgba(18,60,43,0.35)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <Icon kind="paw" size={70} color={DEEP} />
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 54, letterSpacing: '-0.03em', color: DEEP, marginTop: 4}}>$PAWS</div>
        </div>
      </div>
    </div>
  );
};
const Stage: React.FC = () => {
  const f = useCurrentFrame();
  const t1out = prog(f, 44, 8, expoIn);
  const card = prog(f, 0, 14, expoOut);
  const launched = prog(f, 22, 10, expoOut);
  const flowStart = 50;
  const total = 4820 * prog(f, flowStart + 8, 50, inOut);
  const fill = 0.18 + 0.7 * prog(f, flowStart + 8, 50, inOut);
  const toasts = [
    {at: 66, v: '+$1,240'},
    {at: 80, v: '+$860'},
    {at: 94, v: '+$2,015'},
  ];
  return (
    <AbsoluteFill>
      <Ground f={f + 120} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 110, opacity: 1 - t1out, transform: `translateY(${-t1out * 20}px)`}}>
        <Slam text="Launch a coin." start={0} size={104} stagger={3} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 110}}>
        {f >= 46 && (
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <div style={{position: 'relative'}}>
              <span style={{position: 'absolute', left: -18, right: -18, top: 22, bottom: 4, background: LIME, borderRadius: 14, transformOrigin: 'left', transform: `scaleX(${prog(f, 58, 10, inOut)}) rotate(-1deg)`}} />
              <div style={{position: 'relative'}}>
                <Slam text="Creator fees fund the cause." start={46} size={96} stagger={3} />
              </div>
            </div>
          </div>
        )}
      </div>
      {/* fee rail */}
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <path d={`M ${CX + 150} ${MY} Q ${(CX + KX) / 2} ${MY - 230} ${KX - 200} ${MY - 20}`} fill="none" stroke={GREEN} strokeOpacity={0.35 * prog(f, flowStart, 8)} strokeWidth={4} strokeDasharray="6 12" strokeDashoffset={-f * 3} />
      </svg>
      {/* coin */}
      <div style={{position: 'absolute', left: CX - 160, top: MY - 160}}>
        <Coin f={f} />
      </div>
      <div style={{position: 'absolute', left: CX - 200, top: MY + 190, width: 400, display: 'flex', justifyContent: 'center', opacity: launched, transform: `translateY(${(1 - launched) * 12}px)`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', borderRadius: 999, background: DEEP, color: LIME, fontFamily: MONO, fontWeight: 500, fontSize: 19, letterSpacing: '0.08em'}}>
          <span style={{width: 10, height: 10, borderRadius: 5, background: LIME, opacity: 0.5 + 0.5 * Math.sin(f / 3)}} /> LAUNCHED ON PUMP.FUN
        </div>
      </div>
      <div style={{position: 'absolute', left: CX - 200, top: MY + 256, width: 400, textAlign: 'center', fontFamily: MONO, fontSize: 15, letterSpacing: '0.12em', color: INK2, opacity: launched}}>EXAMPLE COIN</div>
      {/* fee particles */}
      {new Array(16).fill(0).map((_, i) => {
        const t = prog(f, flowStart + i * 3.2, 18, inOut);
        if (t <= 0 || t >= 1) return null;
        const x0 = CX + 150;
        const y0 = MY;
        const x1 = KX - 200;
        const y1 = MY - 20;
        const qx = (CX + KX) / 2;
        const qy = MY - 230;
        const x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * qx + t * t * x1;
        const y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * qy + t * t * y1;
        return (
          <div key={i} style={{position: 'absolute', left: x - 22, top: y - 22, width: 44, height: 44, borderRadius: 22, background: LIME, border: `3px solid ${DEEP}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 24, color: DEEP, transform: `scale(${Math.sin(t * Math.PI) * 0.4 + 0.8}) rotate(${t * 360}deg)`}}>$</div>
        );
      })}
      {/* cause */}
      <div style={{position: 'absolute', left: KX - 200, top: MY - 250, opacity: card, transform: `translateX(${(1 - card) * 200}px)`}}>
        <CauseCard c={CAUSES[0]} fill={fill} w={400} picked={1} />
        <div style={{marginTop: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', width: 400}}>
          <div style={{fontFamily: MONO, fontSize: 15, letterSpacing: '0.1em', color: INK2}}>RECORDED · EXAMPLE</div>
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 48, letterSpacing: '-0.03em', color: GREEN, fontVariantNumeric: 'tabular-nums'}}>${Math.round(total).toLocaleString('en-US')}</div>
        </div>
      </div>
      {/* receipts */}
      {toasts.map((r, k) => {
        const p = prog(f, r.at, 8, expoOut);
        const out = prog(f, r.at + 22, 8);
        if (p <= 0 || out >= 1) return null;
        return (
          <div key={k} style={{position: 'absolute', left: KX + 230, top: MY - 200 + k * 76, opacity: p * (1 - out), transform: `translateX(${(1 - p) * 40}px) scale(${back(p) * 0.2 + 0.8})`, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderRadius: 14, background: CARD, border: `1px solid ${RULE}`, boxShadow: SHADOW, whiteSpace: 'nowrap'}}>
            <span style={{width: 28, height: 28, borderRadius: 14, background: GREEN, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16}}>✓</span>
            <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 24, color: INK}}>{r.v}</span>
            <span style={{fontFamily: MONO, fontSize: 14, color: INK2, letterSpacing: '0.06em'}}>RECEIPT</span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ── 5. finale ──────────────────────────────────────────────
const Finale: React.FC = () => {
  const f = useCurrentFrame();
  const wipe = prog(f, 0, 14, expoOut);
  const dot = prog(f, 22, 10);
  return (
    <AbsoluteFill>
      <Ground f={f + 230} />
      <AbsoluteFill style={{clipPath: `circle(${wipe * 130}% at ${KX}px ${MY}px)`}}>
        <Ground f={f + 230} dark />
        <div style={{position: 'absolute', left: 0, right: 0, top: 300}}>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'baseline', fontFamily: SANS, fontWeight: 800, fontSize: 200, letterSpacing: '-0.06em', lineHeight: 1, color: '#fff'}}>
            {['go', 'fund', 'meme'].map((w, i) => {
              const p = prog(f, 6 + i * 4, 9);
              return <span key={w} style={{display: 'inline-block', marginRight: i < 2 ? 46 : 0, opacity: Math.min(1, p * 2.5), transform: `scale(${lerp(1.5, 1, back(p))})`}}>{w}</span>;
            })}
            <span style={{display: 'inline-block', color: LIME, transform: `scale(${back(dot)})`, opacity: dot}}>.</span>
          </div>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center', fontFamily: SANS, fontWeight: 600, fontSize: 56, letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.86)', opacity: prog(f, 26, 10), transform: `translateY(${(1 - prog(f, 26, 12, expoOut)) * 16}px)`}}>
          Give your meme a <span style={{color: LIME}}>mission.</span>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 690, display: 'flex', justifyContent: 'center', opacity: prog(f, 36, 8), transform: `scale(${lerp(0.8, 1, back(prog(f, 36, 10)))})`}}>
          <div style={{padding: '22px 48px', borderRadius: 999, background: LIME, fontFamily: MONO, fontWeight: 600, fontSize: 40, letterSpacing: '0.08em', color: DEEP, boxShadow: '0 20px 60px -20px rgba(194,247,138,0.7)'}}>GOFUNDMEME.FUN</div>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 940, textAlign: 'center', fontFamily: MONO, fontSize: 16, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.45)', opacity: prog(f, 44, 10)}}>
          INDEPENDENT PROJECT · NOT AFFILIATED WITH GOFUNDME OR PUMP.FUN
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const GfmHype: React.FC<{withAudio?: boolean}> = ({withAudio = true}) => (
  <AbsoluteFill style={{background: BG}}>
    <Sequence from={S.hook.from} durationInFrames={S.hook.dur} name="01 The internet is funny">
      <Cut dur={S.hook.dur}>
        <Hook />
      </Cut>
    </Sequence>
    <Sequence from={S.pick.from} durationInFrames={S.pick.dur} name="02 Pick a fundraiser">
      <Cut dur={S.pick.dur}>
        <Pick />
      </Cut>
    </Sequence>
    <Sequence from={S.stage.from} durationInFrames={S.stage.dur} name="03 Launch a coin → fees fund the cause">
      <Cut dur={S.stage.dur}>
        <Stage />
      </Cut>
    </Sequence>
    <Sequence from={S.finale.from} durationInFrames={S.finale.dur} name="04 go fund meme.">
      <Finale />
    </Sequence>
    {withAudio && <Audio src={staticFile('gfm-score.wav')} />}
  </AbsoluteFill>
);
