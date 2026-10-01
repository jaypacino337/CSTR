import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {expoIn, expoOut, inOut, lerp, prog} from '../theme';
import tl from './gfms-timeline.json';

// Go Fund Memes (gofundmemes.fun) — HQ film. Site system: mint surface, deep ink,
// emerald accents, Geist; the heart-in-hands mark. Fully custom motion.
const BG = '#F4FBF7';
const SURF = '#FFFFFF';
const SURF2 = '#EDFBF5';
const INK = '#073B2B';
const MUTED = '#62766C';
const RULE = '#D3E9DF';
const EM = '#00C983';
const GREEN = '#008653';
const CONSOLE = '#062E22';
const FLAME = '#FF8A3D';
const SANS = '"Geist Variable", "Geist", sans-serif';
const MONO = '"Geist Mono Variable", "Geist Mono", monospace';
const SHADOW = '0 30px 70px -36px rgba(7,59,43,0.40), 0 2px 8px rgba(7,59,43,0.06)';
const HEART = 'M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5';
const S = tl.scenes;

const back = (t: number) => 1 + 2.4 * Math.pow(t - 1, 3) + 1.4 * Math.pow(t - 1, 2);

const Ground: React.FC<{f: number}> = ({f}) => (
  <AbsoluteFill style={{background: BG}}>
    <div style={{position: 'absolute', left: -300, top: -520, width: 1500, height: 1100, background: 'radial-gradient(closest-side, rgba(0,201,131,0.16), transparent)', transform: `translate(${Math.sin(f / 80) * 40}px, 0)`}} />
    <div style={{position: 'absolute', right: -360, bottom: -560, width: 1500, height: 1100, background: 'radial-gradient(closest-side, rgba(0,134,83,0.10), transparent)', transform: `translate(${Math.cos(f / 90) * 40}px, 0)`}} />
    <AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(7,59,43,0.08) 1.3px, transparent 1.7px)', backgroundSize: '38px 38px', backgroundPosition: `${-f * 0.25}px 0px`}} />
  </AbsoluteFill>
);

const Mono: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{fontFamily: MONO, fontSize: 18, letterSpacing: '0.12em', color: MUTED, ...style}}>{children}</div>
);

const Eyebrow: React.FC<{f: number; at: number; children: React.ReactNode; style?: React.CSSProperties}> = ({f, at, children, style}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 12, fontFamily: MONO, fontWeight: 600, fontSize: 19, letterSpacing: '0.14em', color: GREEN, opacity: prog(f, at, 12), transform: `translateY(${(1 - prog(f, at, 14, expoOut)) * 10}px)`, ...style}}>
    <span style={{width: 9, height: 9, borderRadius: 5, background: EM, boxShadow: `0 0 10px ${EM}`}} />
    {children}
  </div>
);

// word-by-word rise
const Rise: React.FC<{text: string; start: number; size: number; color?: string; align?: 'left' | 'center'; stagger?: number; style?: React.CSSProperties}> = ({text, start, size, color = INK, align = 'left', stagger = 3, style}) => {
  const f = useCurrentFrame();
  return (
    <div style={{display: 'flex', justifyContent: align === 'center' ? 'center' : 'flex-start', gap: size * 0.24, fontFamily: SANS, fontWeight: 800, fontSize: size, letterSpacing: '-0.045em', lineHeight: 1.02, color, whiteSpace: 'nowrap', ...style}}>
      {text.split(' ').map((w, i) => {
        const p = prog(f, start + i * stagger, 16, expoOut);
        return <span key={i} style={{display: 'inline-block', opacity: p, transform: `translateY(${(1 - p) * 40}px)`, filter: p < 1 ? `blur(${(1 - p) * 8}px)` : undefined}}>{w}</span>;
      })}
    </div>
  );
};

const Heart: React.FC<{size: number; color: string; fill?: boolean; style?: React.CSSProperties}> = ({size, color, fill = true, style}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <path d={HEART} fill={fill ? color : 'none'} stroke={color} strokeWidth={2} strokeLinejoin="round" />
  </svg>
);

const Logo: React.FC<{size: number; glow?: number; sheen?: number}> = ({size, glow = 1, sheen = 0}) => (
  <div style={{position: 'relative', width: size, height: size}}>
    <div style={{position: 'absolute', inset: -size * 0.3, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(0,201,131,0.32), transparent)', opacity: glow}} />
    <div style={{position: 'absolute', inset: 0, borderRadius: size * 0.2, boxShadow: `0 ${size * 0.08}px ${size * 0.18}px -${size * 0.06}px rgba(7,59,43,0.45)`, overflow: 'hidden'}}>
      <Img src={staticFile('gfms/logo-tile.png')} style={{width: size, height: size, display: 'block'}} />
      {sheen > 0 && sheen < 1 && (
        <div style={{position: 'absolute', top: -size * 0.5, left: lerp(-size, size * 1.3, sheen), width: size * 0.3, height: size * 2, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)', transform: 'rotate(22deg)'}} />
      )}
    </div>
  </div>
);

const Push: React.FC<{dur: number; last?: boolean; children: React.ReactNode}> = ({dur, last, children}) => {
  const f = useCurrentFrame();
  const i = prog(f, 0, 16, expoOut);
  const o = last ? 0 : prog(f, dur - 12, 12, expoIn);
  return (
    <AbsoluteFill style={{opacity: Math.min(1, i * 1.3) * (1 - o), transform: `scale(${lerp(0.95, 1, i) * lerp(1, 1.12, o)})`, filter: i < 1 || o > 0 ? `blur(${(1 - i) * 10 + o * 12}px)` : undefined}}>
      {children}
    </AbsoluteFill>
  );
};

// ── 1. hook ────────────────────────────────────────────────
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const inn = prog(f, 0, 22, expoOut);
  const m = prog(f, 26, 20, inOut);
  const size = lerp(420, 230, m);
  const cy = lerp(540, 215, m);
  const pulse = 0.85 + 0.15 * Math.sin(f / 6);
  return (
    <AbsoluteFill>
      <Ground f={f} />
      <div style={{position: 'absolute', left: 960 - size / 2, top: cy - size / 2, opacity: Math.min(1, inn * 1.5), transform: `scale(${lerp(0.6, 1, back(inn))})`, filter: inn < 1 ? `blur(${(1 - inn) * 12}px)` : undefined}}>
        <Logo size={size} glow={pulse} sheen={prog(f, 10, 22, inOut)} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 380, display: 'flex', justifyContent: 'center'}}>
        <Eyebrow f={f} at={40}>THE COIN IS A MEME. THE CAUSE IS REAL.</Eyebrow>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 440}}>
        <Rise text="Make memes" start={44} size={150} align="center" />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 600}}>
        <Rise text="that matter." start={54} size={150} color={GREEN} align="center" />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 820, textAlign: 'center', fontFamily: SANS, fontSize: 36, color: MUTED, opacity: prog(f, 74, 16), transform: `translateY(${(1 - prog(f, 74, 18, expoOut)) * 14}px)`}}>
        A launchpad for internet coins that <span style={{color: INK, fontWeight: 600}}>give back.</span>
      </div>
    </AbsoluteFill>
  );
};

// ── 2. give it a destination ───────────────────────────────
const Launch: React.FC = () => {
  const f = useCurrentFrame();
  const fund = prog(f, 14, 18, expoOut);
  const coin = prog(f, 26, 18, expoOut);
  const link = prog(f, 50, 26, inOut);
  const linked = prog(f, 76, 12, expoOut);
  const FXc = 520;
  const CXc = 1400;
  const Y = 610;
  return (
    <AbsoluteFill>
      <Ground f={f + 140} />
      <div style={{position: 'absolute', left: 150, top: 110}}>
        <Eyebrow f={f} at={2}>01 · GIVE IT A DESTINATION</Eyebrow>
      </div>
      <div style={{position: 'absolute', left: 150, top: 160}}>
        <Rise text="Pick a GoFundMe." start={4} size={88} />
      </div>
      <div style={{position: 'absolute', left: 150, top: 256}}>
        <Rise text="Launch a coin for it." start={12} size={88} color={GREEN} />
      </div>
      {/* fundraiser */}
      <div style={{position: 'absolute', left: FXc - 250, top: Y - 150, width: 500, borderRadius: 26, background: SURF, border: `1px solid ${RULE}`, boxShadow: SHADOW, overflow: 'hidden', opacity: fund, transform: `translateY(${(1 - fund) * 40}px)`}}>
        <div style={{height: 150, background: 'linear-gradient(135deg, #DDF7EA, #BFEFD8)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Heart size={80} color={GREEN} />
        </div>
        <div style={{padding: '22px 28px 26px'}}>
          <Mono style={{fontSize: 15, color: GREEN, fontWeight: 600}}>GOFUNDME FUNDRAISER · ANIMALS</Mono>
          <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 34, letterSpacing: '-0.02em', color: INK, marginTop: 8}}>Help rebuild the shelter</div>
          <div style={{marginTop: 18, height: 12, borderRadius: 999, background: SURF2, overflow: 'hidden'}}>
            <div style={{width: '46%', height: '100%', background: `linear-gradient(90deg, ${GREEN}, ${EM})`}} />
          </div>
          <div style={{marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, background: SURF2, border: `1px solid ${RULE}`, fontFamily: MONO, fontSize: 17, color: INK}}>
            🔗 gofundme.com/f/…
          </div>
        </div>
      </div>
      {/* connector */}
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <path d={`M ${FXc + 250} ${Y + 40} C ${FXc + 450} ${Y + 40}, ${CXc - 470} ${Y + 40}, ${CXc - 250} ${Y + 40}`} fill="none" stroke={EM} strokeWidth={4} strokeDasharray="10 10" strokeDashoffset={-f * 2} opacity={link > 0 ? 0.9 : 0} pathLength={1} style={{strokeDasharray: `${link} 1`}} />
      </svg>
      {link > 0 && link < 1 && (
        <div style={{position: 'absolute', left: lerp(FXc + 250, CXc - 250, link) - 70, top: Y + 18, padding: '8px 12px', borderRadius: 10, background: INK, color: EM, fontFamily: MONO, fontSize: 15, fontWeight: 600, whiteSpace: 'nowrap'}}>🔗 LINK</div>
      )}
      {/* coin */}
      <div style={{position: 'absolute', left: CXc - 250, top: Y - 150, width: 500, borderRadius: 26, background: SURF, border: `1.5px solid ${linked > 0.5 ? EM : RULE}`, boxShadow: linked > 0.5 ? `${SHADOW}, 0 0 0 ${8 * linked}px rgba(0,201,131,0.18)` : SHADOW, padding: '30px 30px', boxSizing: 'border-box', opacity: coin, transform: `translateY(${(1 - coin) * 40}px)`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
          <div style={{width: 110, height: 110, borderRadius: 55, background: 'radial-gradient(circle at 35% 30%, #7FF0C2, #00C983 55%, #008653)', border: `4px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `rotate(${(1 - coin) * -200}deg)`}}>
            <Heart size={52} color="#fff" />
          </div>
          <div>
            <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 52, letterSpacing: '-0.03em', color: INK}}>$SHELTER</div>
            <Mono style={{fontSize: 15, marginTop: 2}}>EXAMPLE COIN · SOLANA</Mono>
          </div>
        </div>
        <div style={{marginTop: 26, padding: '16px 18px', borderRadius: 14, background: linked > 0.5 ? '#DDF7EA' : SURF2, border: `1px solid ${linked > 0.5 ? `${EM}88` : RULE}`, display: 'flex', alignItems: 'center', gap: 12}}>
          <span style={{width: 30, height: 30, borderRadius: 15, background: linked > 0.5 ? GREEN : RULE, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, transform: `scale(${1 + 0.2 * Math.sin(linked * Math.PI)})`}}>{linked > 0.5 ? '✓' : ''}</span>
          <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 24, color: linked > 0.5 ? GREEN : MUTED}}>{linked > 0.5 ? 'Cause linked · visible on the coin page' : 'Waiting for a destination…'}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── 3. the creator-fee route ───────────────────────────────
const SRC = {x: 1010, y: 600};
const TGT = {x: 1560, y: 600};
const Route: React.FC = () => {
  const f = useCurrentFrame();
  const con = prog(f, 10, 20, expoOut);
  const n100 = Math.round(100 * prog(f, 30, 30, expoOut));
  const flow = prog(f, 56, 14);
  const cyc = 50;
  const sweep = f > 56 ? ((f - 56) % cyc) / cyc : 0;
  const claims = f > 56 ? Math.floor((f - 56) / cyc) : 0;
  const flash = f > 56 + cyc ? Math.max(0, 1 - ((f - 56) % cyc) / 10) : 0;
  const raised = Math.round(800 * claims + 800 * sweep * flow);
  return (
    <AbsoluteFill>
      <Ground f={f + 280} />
      <div style={{position: 'absolute', left: 150, top: 104}}>
        <Eyebrow f={f} at={2}>02 · KNOW THE ROUTE</Eyebrow>
      </div>
      <div style={{position: 'absolute', left: 150, top: 150}}>
        <div style={{display: 'flex', gap: 22}}>
          <Rise text="100% to the cause." start={4} size={84} />
          <Rise text="Every project fee." start={16} size={84} color={GREEN} />
        </div>
      </div>
      {/* console */}
      <div style={{position: 'absolute', left: 150, top: 300, width: 700, height: 620, borderRadius: 28, background: CONSOLE, boxShadow: '0 40px 90px -40px rgba(6,46,34,0.8)', padding: '30px 36px', boxSizing: 'border-box', opacity: con, transform: `translateY(${(1 - con) * 40}px)`, color: '#fff'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <Mono style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 16, color: 'rgba(255,255,255,0.7)'}}>
            <span style={{width: 10, height: 10, borderRadius: 5, background: EM, boxShadow: `0 0 12px ${EM}`, opacity: 0.5 + 0.5 * Math.sin(f / 4)}} /> PROJECT COIN FEE ROUTE
          </Mono>
          <Mono style={{fontSize: 15, color: EM}}>SOLANA</Mono>
        </div>
        <div style={{marginTop: 30, padding: '26px 28px', borderRadius: 18, background: 'rgba(0,201,131,0.10)', border: '1px solid rgba(0,201,131,0.35)', opacity: prog(f, 22, 14)}}>
          <Mono style={{fontSize: 16, color: 'rgba(255,255,255,0.65)'}}>01 / FUND THE CAUSE</Mono>
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 150, lineHeight: 1, letterSpacing: '-0.05em', color: EM, fontVariantNumeric: 'tabular-nums', marginTop: 8}}>{n100}<span style={{fontSize: 70}}>%</span></div>
          <div style={{fontFamily: SANS, fontSize: 27, lineHeight: 1.35, color: 'rgba(255,255,255,0.88)', marginTop: 10}}>of each coin’s creator fees go to its GoFundMe</div>
        </div>
        <div style={{marginTop: 20, padding: '18px 28px', borderRadius: 18, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', display: 'flex', alignItems: 'center', gap: 20, opacity: prog(f, 36, 14)}}>
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 56, letterSpacing: '-0.04em', color: '#9DF5D2'}}>0%</div>
          <div style={{fontFamily: SANS, fontSize: 24, color: 'rgba(255,255,255,0.8)'}}>platform cut from project fees</div>
        </div>
        <div style={{marginTop: 26, display: 'flex', alignItems: 'center', gap: 16, opacity: prog(f, 46, 12)}}>
          <svg width={44} height={44} viewBox="0 0 44 44">
            <circle cx={22} cy={22} r={18} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={4} />
            <circle cx={22} cy={22} r={18} fill="none" stroke={EM} strokeWidth={4} strokeLinecap="round" strokeDasharray={`${sweep * 113} 113`} transform="rotate(-90 22 22)" />
          </svg>
          <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 26}}>Claims every 15 minutes</div>
          <span style={{marginLeft: 'auto', fontFamily: MONO, fontSize: 15, fontWeight: 600, color: CONSOLE, background: EM, padding: '6px 10px', borderRadius: 8, opacity: flash}}>CLAIMED ✓</span>
        </div>
      </div>
      {/* flow: one straight route, all of it to the cause */}
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: flow}}>
        <line x1={SRC.x} y1={SRC.y} x2={TGT.x - 20} y2={TGT.y} stroke="rgba(0,201,131,0.25)" strokeWidth={30} strokeLinecap="round" />
      </svg>
      {flow > 0 && new Array(36).fill(0).map((_, i) => {
        const T = 30;
        if (f < 56 + (i * 3.7) % T) return null;
        const t = ((f - 56 + i * 3.7) % T) / T;
        const x = lerp(SRC.x + 70, TGT.x - 20, t);
        const y = SRC.y + Math.sin(t * Math.PI * 2 + i) * 9;
        return <div key={i} style={{position: 'absolute', left: x - 9, top: y - 9, width: 18, height: 18, borderRadius: 9, background: EM, boxShadow: `0 0 12px ${EM}`}} />;
      })}
      {/* source */}
      <div style={{position: 'absolute', left: SRC.x - 80, top: SRC.y - 80, width: 160, height: 160, borderRadius: 80, background: SURF, border: `1px solid ${RULE}`, boxShadow: SHADOW, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: flow, transform: `scale(${lerp(0.8, 1, flow)})`}}>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 34, color: INK}}>Fees</div>
        <Mono style={{fontSize: 13}}>COIN CREATOR</Mono>
      </div>
      {/* target */}
      <div style={{position: 'absolute', left: TGT.x - 40, top: TGT.y - 110, width: 330, height: 220, borderRadius: 24, background: SURF, border: `1.5px solid ${EM}`, boxShadow: `${SHADOW}, 0 0 0 ${8 * flash}px rgba(0,201,131,0.25)`, padding: '24px 26px', boxSizing: 'border-box', opacity: prog(f, 60, 14)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <Heart size={36} color={EM} />
          <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 30, color: INK}}>Its GoFundMe</div>
        </div>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 62, letterSpacing: '-0.03em', color: GREEN, marginTop: 14, fontVariantNumeric: 'tabular-nums'}}>${raised.toLocaleString('en-US')}</div>
        <Mono style={{fontSize: 13, marginTop: 4}}>EXAMPLE · 100% OF FEES</Mono>
      </div>
    </AbsoluteFill>
  );
};

// ── 4. $MEMES creator fees: 50% burn / 50% boost ───────────
const BOARD = [
  {t: '$SHELTER', c: 'Animal shelter rebuild', v: 0.72},
  {t: '$CURE', c: "Kids' hospital fund", v: 0.6},
  {t: '$PARK', c: 'Community garden', v: 0.48},
  {t: '$MEALS', c: 'Neighborhood pantry', v: 0.3},
];
const Boost: React.FC = () => {
  const f = useCurrentFrame();
  const pour = prog(f, 56, 40, inOut);
  const chip = (k: number) => prog(f, 30 + k * 10, 16, expoOut);
  return (
    <AbsoluteFill>
      <Ground f={f + 480} />
      <div style={{position: 'absolute', left: 150, top: 150}}>
        <div style={{display: 'inline-flex', padding: '10px 18px', borderRadius: 999, background: INK, color: EM, fontFamily: MONO, fontWeight: 600, fontSize: 19, letterSpacing: '0.14em', opacity: prog(f, 2, 12), transform: `scale(${lerp(0.8, 1, back(prog(f, 2, 14)))})`}}>$MEMES CREATOR FEES</div>
      </div>
      <div style={{position: 'absolute', left: 150, top: 230}}>
        <Rise text="50% buyback & burn." start={6} size={76} />
      </div>
      <div style={{position: 'absolute', left: 150, top: 326}}>
        <Rise text="50% to top causes." start={16} size={76} color={GREEN} />
      </div>
      <div style={{position: 'absolute', left: 150, top: 450, width: 720, fontFamily: SANS, fontSize: 32, lineHeight: 1.4, color: MUTED, opacity: prog(f, 26, 16)}}>
        Our own fees back the <span style={{color: INK, fontWeight: 700}}>top coins’ fundraisers.</span>
      </div>
      {/* split chips */}
      <div style={{position: 'absolute', left: 150, top: 590, width: 350, height: 230, borderRadius: 24, background: SURF, border: `1px solid ${RULE}`, boxShadow: SHADOW, padding: '24px 26px', boxSizing: 'border-box', overflow: 'hidden', opacity: chip(0), transform: `translateY(${(1 - chip(0)) * 30}px)`}}>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 84, lineHeight: 1, letterSpacing: '-0.05em', color: INK}}>50%</div>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 28, color: INK, marginTop: 14}}>Buyback <span style={{color: FLAME}}>& burn</span></div>
        <Mono style={{fontSize: 14, marginTop: 6}}>$MEMES SUPPLY ↓</Mono>
        {new Array(12).fill(0).map((_, i) => {
          const t = ((f + i * 6) % 30) / 30;
          return <div key={i} style={{position: 'absolute', left: 240 + ((i * 19) % 80), top: 200 - t * 170, width: 9, height: 9, borderRadius: 5, background: i % 2 ? FLAME : '#FFC24A', opacity: (1 - t) * chip(0), transform: `scale(${1 - t * 0.6})`}} />;
        })}
      </div>
      <div style={{position: 'absolute', left: 530, top: 590, width: 350, height: 230, borderRadius: 24, background: CONSOLE, boxShadow: `0 30px 70px -30px rgba(6,46,34,0.8), 0 0 ${24 + 16 * Math.sin(f / 5)}px rgba(0,201,131,${0.35 * pour})`, padding: '24px 26px', boxSizing: 'border-box', opacity: chip(1), transform: `translateY(${(1 - chip(1)) * 30}px)`}}>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 84, lineHeight: 1, letterSpacing: '-0.05em', color: EM}}>50%</div>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 28, color: '#fff', marginTop: 14}}>Boost top causes</div>
        <Mono style={{fontSize: 14, marginTop: 6, color: 'rgba(255,255,255,0.6)'}}>→ TOP COINS’ GOFUNDMES</Mono>
      </div>
      {/* leaderboard */}
      <div style={{position: 'absolute', left: 960, top: 180, width: 810, borderRadius: 28, background: SURF, border: `1px solid ${RULE}`, boxShadow: SHADOW, padding: '28px 32px 20px', boxSizing: 'border-box', opacity: prog(f, 10, 16), transform: `translateY(${(1 - prog(f, 10, 18, expoOut)) * 40}px)`}}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <Mono style={{fontSize: 16, fontWeight: 600, color: GREEN}}>TOP COINS ON GO FUND MEMES</Mono>
          <Mono style={{fontSize: 14}}>EXAMPLE</Mono>
        </div>
        {BOARD.map((b, k) => {
          const top = k < 3;
          const boost = top ? pour * (0.2 - k * 0.04) : 0;
          return (
            <div key={b.t} style={{display: 'flex', alignItems: 'center', gap: 20, padding: '20px 0', borderTop: k ? `1px solid ${RULE}` : undefined, marginTop: k ? 0 : 14, opacity: prog(f, 16 + k * 6, 14)}}>
              <div style={{width: 44, fontFamily: MONO, fontWeight: 600, fontSize: 22, color: top ? GREEN : MUTED}}>#{k + 1}</div>
              <div style={{width: 250}}>
                <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 30, color: INK, letterSpacing: '-0.02em'}}>{b.t}</div>
                <div style={{fontFamily: SANS, fontSize: 19, color: MUTED}}>{b.c}</div>
              </div>
              <div style={{flex: 1, position: 'relative', height: 18, borderRadius: 999, background: SURF2}}>
                <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${b.v * 100 * prog(f, 20 + k * 6, 20, expoOut)}%`, borderRadius: 999, background: `linear-gradient(90deg, ${GREEN}, ${EM})`}} />
                {top && boost > 0 && <div style={{position: 'absolute', left: `${b.v * 100}%`, top: 0, bottom: 0, width: `${boost * 100}%`, borderRadius: 999, background: 'linear-gradient(90deg, #9DF5D2, #5FF0B5)', boxShadow: '0 0 16px rgba(0,201,131,0.8)'}} />}
              </div>
              <div style={{width: 110, textAlign: 'right', fontFamily: MONO, fontWeight: 600, fontSize: 17, color: EM, opacity: top ? prog(f, 70 + k * 6, 10) : 0}}>+BOOST</div>
            </div>
          );
        })}
      </div>
      {/* pour from the 50% boost chip into the top 3 */}
      {pour > 0 && pour < 1 && new Array(18).fill(0).map((_, i) => {
        const t = ((f - 56 + i * 2.2) % 20) / 20;
        const k = i % 3;
        const x0 = 840;
        const y0 = 640;
        const x1 = 1500;
        const y1 = 300 + k * 108;
        const x = lerp(x0, x1, t);
        const y = lerp(y0, y1, t) - Math.sin(t * Math.PI) * 120;
        return <div key={i} style={{position: 'absolute', left: x - 7, top: y - 7, width: 14, height: 14, borderRadius: 7, background: EM, boxShadow: `0 0 12px ${EM}`, opacity: 0.9}} />;
      })}
    </AbsoluteFill>
  );
};

// ── 5. receipts ────────────────────────────────────────────
const STEPS3 = [
  {t: 'Claim', s: 'Creator fees claimed on-chain'},
  {t: 'Donation completed', s: 'Settled funds reach the fundraiser'},
  {t: 'Receipt recorded', s: 'Linked to its cause, on the ledger'},
];
const Receipts: React.FC = () => {
  const f = useCurrentFrame();
  const slide = prog(f, 70, 30, expoOut);
  return (
    <AbsoluteFill>
      <Ground f={f + 620} />
      <div style={{position: 'absolute', left: 150, top: 110}}>
        <Eyebrow f={f} at={2}>03 · COUNT THE RECEIPTS</Eyebrow>
      </div>
      <div style={{position: 'absolute', left: 150, top: 160}}>
        <Rise text="Every cause has a story." start={4} size={80} />
      </div>
      <div style={{position: 'absolute', left: 150, top: 250}}>
        <Rise text="Every donation has a receipt." start={14} size={80} color={GREEN} />
      </div>
      {/* tracker */}
      <div style={{position: 'absolute', left: 150, top: 420}}>
        {STEPS3.map((s, k) => {
          const on = prog(f, 26 + k * 16, 12, expoOut);
          return (
            <div key={s.t} style={{display: 'flex', alignItems: 'flex-start', gap: 24, height: 150}}>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <div style={{width: 60, height: 60, borderRadius: 30, background: on > 0.5 ? GREEN : SURF, border: `2px solid ${on > 0.5 ? GREEN : RULE}`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 28, transform: `scale(${1 + 0.18 * Math.sin(on * Math.PI)})`}}>{on > 0.5 ? '✓' : ''}</div>
                {k < 2 && <div style={{width: 3, height: 88, background: RULE, position: 'relative'}}><div style={{position: 'absolute', left: 0, top: 0, width: 3, height: `${prog(f, 32 + k * 16, 12) * 100}%`, background: GREEN}} /></div>}
              </div>
              <div style={{paddingTop: 6, opacity: 0.35 + 0.65 * on}}>
                <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 38, color: INK, letterSpacing: '-0.02em'}}>{s.t}</div>
                <div style={{fontFamily: SANS, fontSize: 24, color: MUTED, marginTop: 4}}>{s.s}</div>
              </div>
            </div>
          );
        })}
      </div>
      {/* receipt printer */}
      <div style={{position: 'absolute', left: 1080, top: 380, width: 640, height: 40, borderRadius: 20, background: CONSOLE, boxShadow: '0 20px 40px -20px rgba(6,46,34,0.7)', opacity: prog(f, 20, 12)}} />
      <div style={{position: 'absolute', left: 1120, top: 400, width: 560, height: 560, overflow: 'hidden'}}>
        <div style={{width: 560, padding: '36px 40px 44px', boxSizing: 'border-box', background: SURF, boxShadow: SHADOW, transform: `translateY(${lerp(-560, 0, slide)}px)`, fontFamily: MONO, color: INK, clipPath: 'polygon(0 0, 100% 0, 100% 96%, 95% 100%, 90% 96%, 85% 100%, 80% 96%, 75% 100%, 70% 96%, 65% 100%, 60% 96%, 55% 100%, 50% 96%, 45% 100%, 40% 96%, 35% 100%, 30% 96%, 25% 100%, 20% 96%, 15% 100%, 10% 96%, 5% 100%, 0 96%)'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: '-0.02em'}}>go fund memes<span style={{color: EM}}>.</span></div>
            <Heart size={34} color={EM} />
          </div>
          <div style={{fontSize: 15, letterSpacing: '0.12em', color: MUTED, marginTop: 8}}>DONATION RECEIPT · EXAMPLE</div>
          <div style={{borderTop: `2px dashed ${RULE}`, margin: '22px 0'}} />
          {[
            ['COIN', '$SHELTER'],
            ['CAUSE', 'Shelter rebuild'],
            ['CLAIM', 'on-chain ✓'],
            ['AMOUNT', '$1,240.00'],
          ].map(([a, b]) => (
            <div key={a} style={{display: 'flex', justifyContent: 'space-between', fontSize: 22, padding: '8px 0'}}>
              <span style={{color: MUTED}}>{a}</span>
              <span style={{fontWeight: 600}}>{b}</span>
            </div>
          ))}
          <div style={{borderTop: `2px dashed ${RULE}`, margin: '22px 0 20px'}} />
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '14px', borderRadius: 12, background: '#DDF7EA', color: GREEN, fontWeight: 600, fontSize: 22, letterSpacing: '0.08em', transform: `scale(${lerp(1.3, 1, back(prog(f, 100, 10)))})`, opacity: prog(f, 100, 6)}}>RECORDED ✓</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── 6. finale ──────────────────────────────────────────────
const Finale: React.FC = () => {
  const f = useCurrentFrame();
  const logo = prog(f, 4, 24, expoOut);
  return (
    <AbsoluteFill>
      <Ground f={f + 760} />
      <div style={{position: 'absolute', left: 960 - 160, top: 120, opacity: Math.min(1, logo * 1.4), transform: `scale(${lerp(0.6, 1, back(logo))})`}}>
        <Logo size={320} glow={0.9 + 0.1 * Math.sin(f / 6)} sheen={prog(f, 22, 24, inOut)} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 480, display: 'flex', justifyContent: 'center', alignItems: 'baseline', fontFamily: SANS, fontWeight: 800, fontSize: 150, letterSpacing: '-0.055em', lineHeight: 1, color: INK}}>
        {['go', 'fund', 'memes'].map((w, i) => {
          const p = prog(f, 20 + i * 4, 16, expoOut);
          return <span key={w} style={{display: 'inline-block', marginRight: i < 2 ? 36 : 0, opacity: p, transform: `translateY(${(1 - p) * 40}px)`, filter: p < 1 ? `blur(${(1 - p) * 8}px)` : undefined}}>{w}</span>;
        })}
        <span style={{display: 'inline-block', color: EM, opacity: prog(f, 36, 8), transform: `scale(${back(prog(f, 36, 10))})`}}>.</span>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 660, textAlign: 'center', fontFamily: SANS, fontWeight: 600, fontSize: 48, letterSpacing: '-0.02em', color: MUTED, opacity: prog(f, 44, 14)}}>
        Launch it. <span style={{color: GREEN}}>Make it matter.</span>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 770, display: 'flex', justifyContent: 'center', gap: 20, opacity: prog(f, 56, 12), transform: `translateY(${(1 - prog(f, 56, 14, expoOut)) * 16}px)`}}>
        <div style={{padding: '22px 44px', borderRadius: 999, background: INK, color: EM, fontFamily: MONO, fontWeight: 600, fontSize: 36, letterSpacing: '0.08em', boxShadow: '0 24px 60px -24px rgba(7,59,43,0.7)'}}>GOFUNDMEMES.FUN</div>
        <div style={{padding: '22px 30px', borderRadius: 999, background: SURF, border: `1.5px solid ${RULE}`, color: INK, fontFamily: MONO, fontWeight: 600, fontSize: 28, letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 12}}>
          <span style={{color: GREEN}}>$MEMES</span> <span style={{color: MUTED, fontSize: 22}}>CA FGrn…pump</span>
        </div>
      </div>
      <Mono style={{position: 'absolute', left: 0, right: 0, top: 990, textAlign: 'center', fontSize: 15, letterSpacing: '0.1em', opacity: prog(f, 70, 12)}}>
        INDEPENDENT PROJECT · NOT AFFILIATED WITH GOFUNDME, KAST, OR PUMP.FUN · NOT FINANCIAL ADVICE
      </Mono>
    </AbsoluteFill>
  );
};

export const GfmsFilm: React.FC<{withAudio?: boolean}> = ({withAudio = true}) => (
  <AbsoluteFill style={{background: BG}}>
    <Sequence from={S.hook.from} durationInFrames={S.hook.dur} name="01 Make memes that matter.">
      <Push dur={S.hook.dur}>
        <Hook />
      </Push>
    </Sequence>
    <Sequence from={S.launch.from} durationInFrames={S.launch.dur} name="02 Give it a destination">
      <Push dur={S.launch.dur}>
        <Launch />
      </Push>
    </Sequence>
    <Sequence from={S.route.from} durationInFrames={S.route.dur} name="03 100% of project fees to the cause">
      <Push dur={S.route.dur}>
        <Route />
      </Push>
    </Sequence>
    <Sequence from={S.boost.from} durationInFrames={S.boost.dur} name="04 $MEMES fees: 50% burn / 50% boost">
      <Push dur={S.boost.dur}>
        <Boost />
      </Push>
    </Sequence>
    <Sequence from={S.receipts.from} durationInFrames={S.receipts.dur} name="05 Receipts">
      <Push dur={S.receipts.dur}>
        <Receipts />
      </Push>
    </Sequence>
    <Sequence from={S.finale.from} durationInFrames={S.finale.dur} name="06 go fund memes.">
      <Push dur={S.finale.dur} last>
        <Finale />
      </Push>
    </Sequence>
    {withAudio && <Audio src={staticFile('gfms-score.wav')} />}
  </AbsoluteFill>
);
