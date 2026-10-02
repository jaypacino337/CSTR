import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {expoOut, inOut, lerp, prog} from '../theme';
import tl from './timeline.json';

// Local Language Model ($LLM) — cinematic explainer. Opens and closes on the
// project banner (icy city, moon, server cube); chapters sit on a frosted, dimmed
// version of it. Navy / black / white / ice. Michroma labels, Space Grotesk heads.
const BG = '#05080F';
const PANEL = 'rgba(9,16,32,0.82)';
const LINE = 'rgba(165,195,245,0.18)';
const INK = '#FFFFFF';
const MUTED = '#A3B0C8';
const DIM = '#5D6A85';
const ICE = '#B9CDF2';
const NAVY = '#1E3A8A';
const NAVY2 = '#2C4FB0';
const HEAD = '"Space Grotesk", sans-serif';
const WIDE = '"Michroma", sans-serif';
const MONO = '"JetBrains Mono", monospace';
const BW = 2172;
const BH = 724;
const S = tl.scenes;

// ── shared ─────────────────────────────────────────────────
const Frost: React.FC = () => (
  <AbsoluteFill style={{background: BG}}>
    <Img src={staticFile('llm/frost.jpg')} style={{width: 1920, height: 1080}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 0%, rgba(150,185,240,0.10), transparent 60%)'}} />
  </AbsoluteFill>
);

const CHAPTERS = ['Infrastructure', 'Access', 'Workspace', 'Revenue loop', 'Burns'];
const Chapter: React.FC<{f: number; n: number}> = ({f, n}) => (
  <div style={{position: 'absolute', left: 140, right: 140, top: 70, display: 'flex', alignItems: 'center', gap: 22, opacity: prog(f, 0, 12)}}>
    <div style={{fontFamily: WIDE, fontSize: 15, letterSpacing: '0.28em', color: ICE, whiteSpace: 'nowrap'}}>{`0${n} — ${CHAPTERS[n - 1].toUpperCase()}`}</div>
    <div style={{flex: 1, display: 'flex', gap: 8}}>
      {CHAPTERS.map((_, k) => (
        <div key={k} style={{flex: 1, height: 2, background: k < n - 1 ? ICE : k === n - 1 ? `linear-gradient(90deg, ${ICE} ${prog(f, 6, 40, inOut) * 100}%, ${LINE} 0)` : LINE}} />
      ))}
    </div>
  </div>
);

const Head: React.FC<{text: string; start: number; size: number; color?: string; align?: 'left' | 'center'; stagger?: number}> = ({text, start, size, color = INK, align = 'left', stagger = 3}) => {
  const f = useCurrentFrame();
  return (
    <div style={{display: 'flex', justifyContent: align === 'center' ? 'center' : 'flex-start', gap: size * 0.26, fontFamily: HEAD, fontWeight: 600, fontSize: size, lineHeight: 1.04, letterSpacing: '-0.025em', color, whiteSpace: 'nowrap'}}>
      {text.split(' ').map((w, i) => {
        const p = prog(f, start + i * stagger, 18, expoOut);
        return (
          <span key={i} style={{display: 'inline-block', overflow: 'hidden', paddingBottom: size * 0.1}}>
            <span style={{display: 'inline-block', transform: `translateY(${(1 - p) * 110}%)`}}>{w}</span>
          </span>
        );
      })}
    </div>
  );
};

const Body: React.FC<{f: number; at: number; children: React.ReactNode; style?: React.CSSProperties}> = ({f, at, children, style}) => (
  <div style={{fontFamily: HEAD, fontWeight: 400, fontSize: 30, lineHeight: 1.45, color: MUTED, opacity: prog(f, at, 16), transform: `translateY(${(1 - prog(f, at, 20, expoOut)) * 12}px)`, ...style}}>{children}</div>
);

const Label: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{fontFamily: WIDE, fontSize: 13, letterSpacing: '0.24em', color: MUTED, textTransform: 'uppercase', ...style}}>{children}</div>
);

const Cube: React.FC<{size: number; glow?: number}> = ({size, glow = 0}) => (
  <div style={{position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    {glow > 0 && <div style={{position: 'absolute', inset: -size * 0.35, borderRadius: '50%', background: `radial-gradient(closest-side, rgba(185,205,242,${0.3 * glow}), rgba(30,58,138,${0.25 * glow}) 55%, transparent)`}} />}
    <Img src={staticFile('llm/cube.png')} style={{position: 'relative', height: size, width: (size * 1070) / 1207, filter: glow ? `drop-shadow(0 0 ${size * 0.06}px rgba(185,205,242,${0.6 * glow}))` : undefined}} />
  </div>
);

const Cut: React.FC<{dur: number; last?: boolean; children: React.ReactNode}> = ({dur, last, children}) => {
  const f = useCurrentFrame();
  const i = prog(f, 0, 16, inOut);
  const o = last ? 0 : prog(f, dur - 14, 14, inOut);
  return <AbsoluteFill style={{opacity: i * (1 - o), transform: `scale(${lerp(1.015, 1, i) * lerp(1, 0.99, o)})`}}>{children}</AbsoluteFill>;
};

// banner placed so that banner point (fx, fy) lands on screen point (sx, sy) at height H
const Banner: React.FC<{H: number; fx: number; fy: number; sx: number; sy: number; style?: React.CSSProperties}> = ({H, fx, fy, sx, sy, style}) => {
  const k = H / BH;
  return <Img src={staticFile('llm/banner.jpg')} style={{position: 'absolute', left: sx - fx * k, top: sy - fy * k, width: BW * k, height: H, ...style}} />;
};

// ── 1. opening: pull back from the cube to the city ────────
const Open: React.FC = () => {
  const f = useCurrentFrame();
  const z = prog(f, 0, 150, inOut);
  const H = lerp(1080 * 2.5, 1080, z);
  const sy = lerp(470, 373, z);
  const flare = prog(f, 0, 30) * (1 - prog(f, 40, 50));
  return (
    <AbsoluteFill style={{background: '#DDE6F3'}}>
      <Banner H={H} fx={1086} fy={250} sx={960} sy={sy} />
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 42%, rgba(255,255,255,${0.55 * flare}), transparent 45%)`}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, transparent 72%, rgba(5,8,15,0.55) 100%)', opacity: z}} />
      <AbsoluteFill style={{background: '#FFFFFF', opacity: 1 - prog(f, 0, 14)}} />
    </AbsoluteFill>
  );
};

// ── 2. manifesto ───────────────────────────────────────────
const WORDS = ['Faster', 'Cheaper', 'Open source', 'On Solana', 'For everyone'];
const Manifesto: React.FC = () => {
  const f = useCurrentFrame();
  const STEP = 20;
  const stack = prog(f, 104, 24, inOut);
  return (
    <AbsoluteFill>
      <Frost />
      {WORDS.map((w, i) => {
        const a = 6 + i * STEP;
        const p = prog(f, a, 10, expoOut);
        const out = i < WORDS.length ? prog(f, a + STEP - 4, 8) : 0;
        const solo = (1 - out) * p * (1 - stack);
        return (
          <div key={w} style={{position: 'absolute', left: 0, right: 0, top: 470, textAlign: 'center', fontFamily: WIDE, fontSize: 92, letterSpacing: `${lerp(0.5, 0.18, p)}em`, color: INK, textTransform: 'uppercase', opacity: solo, filter: solo < 1 ? `blur(${(1 - solo) * 6}px)` : undefined}}>
            {w}
          </div>
        );
      })}
      {/* stacked like the banner */}
      <div style={{position: 'absolute', left: 260, top: 330, opacity: stack, transform: `translateX(${(1 - stack) * -30}px)`}}>
        {WORDS.map((w, i) => (
          <div key={w} style={{fontFamily: WIDE, fontSize: 34, letterSpacing: '0.2em', color: i === 4 ? ICE : INK, textTransform: 'uppercase', lineHeight: 2, opacity: prog(f, 104 + i * 3, 10)}}>{w}</div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 960 - 160, top: 380, opacity: stack, transform: `scale(${lerp(0.9, 1, stack)})`}}>
        <Cube size={320} glow={1} />
      </div>
      <div style={{position: 'absolute', right: 260, top: 330, textAlign: 'right', opacity: stack, transform: `translateX(${(1 - stack) * 30}px)`}}>
        {['Chat', 'Code', 'Build', 'Run', 'Inference'].map((w, i) => (
          <div key={w} style={{fontFamily: WIDE, fontSize: 34, letterSpacing: '0.2em', color: i === 4 ? ICE : INK, textTransform: 'uppercase', lineHeight: 2, opacity: prog(f, 108 + i * 3, 10)}}>{w}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ── 3. infrastructure ──────────────────────────────────────
const Fan: React.FC<{size: number; spin: number}> = ({size, spin}) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100">
    <circle r={48} fill="#070B14" stroke={LINE} strokeWidth={2} />
    <g transform={`rotate(${spin})`}>
      {[0, 1, 2, 3, 4, 5, 6].map((k) => (
        <path key={k} d="M0 -8 C 14 -14, 30 -26, 40 -16 C 30 -10, 16 -4, 6 0 Z" fill="#26324A" transform={`rotate(${(k * 360) / 7})`} />
      ))}
      <circle r={9} fill="#1A2236" stroke={LINE} />
    </g>
  </svg>
);
const Infra: React.FC = () => {
  const f = useCurrentFrame();
  const total = Math.round(128 * prog(f, 44, 50, inOut));
  return (
    <AbsoluteFill>
      <Frost />
      <Chapter f={f} n={1} />
      <div style={{position: 'absolute', left: 140, top: 140}}>
        <Head text="Dedicated hardware." start={6} size={84} />
      </div>
      <Body f={f} at={18} style={{position: 'absolute', left: 140, top: 250, width: 900}}>
        Four RTX 5090 GPUs on a Threadripper PRO platform, built for Local Language Model.
      </Body>
      {[0, 1, 2, 3].map((k) => {
        const p = prog(f, 22 + k * 6, 18, expoOut);
        const vram = prog(f, 42 + k * 5, 32, inOut);
        const spin = f * (12 + k * 2) * Math.min(1, p * 1.2);
        return (
          <div key={k} style={{position: 'absolute', left: 140, top: 380 + k * 140, width: 1020, height: 116, background: PANEL, border: `1px solid ${LINE}`, display: 'flex', alignItems: 'center', gap: 26, padding: '0 26px', boxSizing: 'border-box', opacity: p, transform: `translateX(${(1 - p) * -80}px)`}}>
            <Fan size={80} spin={spin} />
            <Fan size={80} spin={spin * 1.1} />
            <div style={{flex: 1}}>
              <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 19, color: INK, letterSpacing: '0.06em'}}>
                <span>GPU {k} · NVIDIA RTX 5090</span>
                <span style={{color: ICE}}>{Math.round(32 * vram)} GB</span>
              </div>
              <div style={{marginTop: 14, height: 10, background: '#070B14', border: `1px solid ${LINE}`}}>
                <div style={{width: `${vram * 100}%`, height: '100%', background: `linear-gradient(90deg, ${NAVY}, ${NAVY2}, ${ICE})`}} />
              </div>
            </div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 1260, top: 380, width: 520, opacity: prog(f, 36, 16), transform: `translateY(${(1 - prog(f, 36, 18, expoOut)) * 24}px)`}}>
        <Label>Aggregate VRAM</Label>
        <div style={{fontFamily: HEAD, fontWeight: 600, fontSize: 200, lineHeight: 0.92, letterSpacing: '-0.05em', color: INK, marginTop: 14, fontVariantNumeric: 'tabular-nums'}}>
          {total}
          <span style={{fontSize: 80, color: ICE, marginLeft: 8}}>GB</span>
        </div>
        <div style={{fontFamily: MONO, fontSize: 19, color: MUTED, marginTop: 12}}>4 × 32 GB · RTX 5090</div>
        <div style={{marginTop: 46, padding: '24px 26px', background: PANEL, border: `1px solid ${LINE}`, opacity: prog(f, 76, 14)}}>
          <Label>Host</Label>
          <div style={{fontFamily: HEAD, fontWeight: 600, fontSize: 38, color: INK, marginTop: 10}}>Threadripper PRO</div>
          <div style={{fontFamily: MONO, fontSize: 19, color: ICE, marginTop: 6}}>256 GB ECC memory</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── 4. holder access ───────────────────────────────────────
const ACCESS = [
  ['Hold $LLM', '24-hour qualifying hold'],
  ['Daily pool', 'A proportional share of funded credits'],
  ['Run LocalLM', 'Chat, code and the API'],
  ['Metered', 'One balance, exact accounting'],
];
const Access: React.FC = () => {
  const f = useCurrentFrame();
  const X0 = 140;
  const W = 1640;
  const SW = (W - 3 * 32) / 4;
  const at = (k: number) => 50 + k * 24;
  const run = prog(f, at(0), at(3) - at(0) + 10, inOut);
  return (
    <AbsoluteFill>
      <Frost />
      <Chapter f={f} n={2} />
      <div style={{position: 'absolute', left: X0, top: 160}}>
        <Head text="Hold $LLM." start={6} size={130} />
      </div>
      <div style={{position: 'absolute', left: X0, top: 300}}>
        <Head text="Earn AI." start={14} size={130} color={ICE} />
      </div>
      <Body f={f} at={26} style={{position: 'absolute', left: 1060, top: 210, width: 720}}>
        Your token balance becomes a usage balance. Eligible holders receive a proportional share of each day’s funded compute credits.
      </Body>
      <div style={{position: 'absolute', left: X0, top: 560, width: W, height: 2, background: LINE}}>
        <div style={{width: `${run * 100}%`, height: '100%', background: ICE, boxShadow: `0 0 14px ${ICE}`}} />
      </div>
      {ACCESS.map(([t, d], k) => {
        const on = f >= at(k);
        const p = prog(f, at(k) - 4, 14, expoOut);
        return (
          <div key={t} style={{position: 'absolute', left: X0 + k * (SW + 32), top: 600, width: SW, height: 220, padding: '28px 28px', boxSizing: 'border-box', background: on ? 'rgba(30,58,138,0.35)' : PANEL, border: `1px solid ${on ? ICE : LINE}`, opacity: 0.4 + 0.6 * prog(f, 30 + k * 4, 12), transform: `translateY(${(1 - p) * 10}px)`}}>
            <Label style={{color: on ? ICE : DIM}}>{`Step 0${k + 1}`}</Label>
            <div style={{fontFamily: HEAD, fontWeight: 600, fontSize: 44, color: on ? INK : MUTED, marginTop: 18, letterSpacing: '-0.01em'}}>{t}</div>
            <div style={{fontFamily: HEAD, fontSize: 23, lineHeight: 1.4, color: on ? MUTED : DIM, marginTop: 10}}>{d}</div>
          </div>
        );
      })}
      <Body f={f} at={150} style={{position: 'absolute', left: X0, top: 880, width: 1640, fontSize: 24, color: DIM}}>
        Daily pools are funded by received creator fees, operator funding and operating surplus. Splitting a balance across wallets doesn’t increase the share.
      </Body>
    </AbsoluteFill>
  );
};

// ── 5. workspace ───────────────────────────────────────────
const PROMPT = 'Refactor my API client to stream responses.';
const REPLY = 'Sure. Here’s a streaming client using fetch and a ReadableStream reader. Each chunk is decoded and yielded as it arrives, so your UI can render tokens in real time…';
const Workspace: React.FC = () => {
  const f = useCurrentFrame();
  const p1 = Math.max(0, Math.floor((f - 26) * 1.6));
  const words = REPLY.split(' ');
  const r1 = Math.max(0, Math.floor((f - 66) * 0.75));
  const bal = Math.round(620 - Math.min(words.length, r1) * 1.7);
  return (
    <AbsoluteFill>
      <Frost />
      <Chapter f={f} n={3} />
      <div style={{position: 'absolute', left: 140, top: 160}}>
        <Head text="Chat. Code." start={6} size={110} />
      </div>
      <div style={{position: 'absolute', left: 140, top: 280}}>
        <Head text="Build. Run inference." start={12} size={110} color={ICE} />
      </div>
      <Body f={f} at={24} style={{position: 'absolute', left: 140, top: 450, width: 620}}>
        One workspace and one developer API, drawing from the same metered credit balance.
      </Body>
      <div style={{position: 'absolute', left: 900, top: 450, width: 880, height: 520, background: PANEL, border: `1px solid ${LINE}`, boxShadow: '0 50px 120px -40px rgba(0,0,0,0.8)', opacity: prog(f, 10, 16), transform: `translateY(${(1 - prog(f, 10, 20, expoOut)) * 30}px)`, overflow: 'hidden'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 58, padding: '0 22px', borderBottom: `1px solid ${LINE}`}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <Cube size={34} />
            <Label style={{color: INK}}>Local Language Model</Label>
          </div>
          <div style={{fontFamily: MONO, fontSize: 15, color: MUTED}}>
            CREDITS <span style={{color: ICE, fontVariantNumeric: 'tabular-nums'}}>{bal}</span>
          </div>
        </div>
        <div style={{padding: '22px 28px'}}>
          <div style={{display: 'flex', justifyContent: 'flex-end'}}>
            <div style={{maxWidth: 600, padding: '14px 20px', background: 'rgba(30,58,138,0.35)', border: `1px solid ${LINE}`, fontFamily: HEAD, fontSize: 24, color: INK, minHeight: 30}}>
              {PROMPT.slice(0, p1)}
              {p1 < PROMPT.length && <span style={{display: 'inline-block', width: 3, height: 26, background: ICE, marginLeft: 3, verticalAlign: 'middle'}} />}
            </div>
          </div>
          {f > 54 && (
            <div style={{marginTop: 22, display: 'flex', gap: 16}}>
              <Cube size={42} />
              <div style={{flex: 1, fontFamily: HEAD, fontSize: 23, lineHeight: 1.5, color: INK}}>
                {r1 === 0 ? <span style={{color: MUTED}}>thinking…</span> : words.slice(0, r1).join(' ')}
                {r1 > 0 && r1 < words.length && <span style={{display: 'inline-block', width: 10, height: 22, background: ICE, marginLeft: 6, verticalAlign: 'middle'}} />}
                {r1 > 8 && (
                  <div style={{marginTop: 16, padding: '14px 18px', background: '#060A13', border: `1px solid ${LINE}`, fontFamily: MONO, fontSize: 17, lineHeight: 1.6, color: '#D4DEF5', opacity: prog(f, 78, 10)}}>
                    <div><span style={{color: ICE}}>const</span> reader = res.body.getReader();</div>
                    <div><span style={{color: ICE}}>while</span> (true) {'{'}</div>
                    <div>&nbsp;&nbsp;<span style={{color: ICE}}>const</span> {'{'} done, value {'}'} = <span style={{color: ICE}}>await</span> reader.read();</div>
                    <div>&nbsp;&nbsp;yield decoder.decode(value);</div>
                    <div>{'}'}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Label style={{position: 'absolute', left: 900, top: 990, color: DIM, opacity: prog(f, 30, 12)}}>Preview · model in development</Label>
    </AbsoluteFill>
  );
};

// ── 6. revenue loop ────────────────────────────────────────
const LOOP = ['Paid compute', 'Revenue', '$LLM buyback', 'Burn'];
const PRIORITY = ['Provider costs', 'Purchased-credit obligations', 'Funded daily grants', 'Operating buffer'];
const Loop: React.FC = () => {
  const f = useCurrentFrame();
  const CX = 1360;
  const CY = 580;
  const R = 290;
  const ang = (k: number) => -Math.PI / 2 + (k * Math.PI) / 2;
  const t0 = 40;
  const lap = 90;
  const travel = Math.max(0, f - t0) / lap; // laps
  const a = -Math.PI / 2 + travel * Math.PI * 2;
  const draw = prog(f, 14, 30, inOut);
  const C = 2 * Math.PI * R;
  const lit = (k: number) => f >= t0 && ((travel * 4) % 4 >= k || travel >= 1);
  const burns = Math.floor(Math.max(0, travel - 0.75)) + (travel >= 0.75 ? 1 : 0);
  return (
    <AbsoluteFill>
      <Frost />
      <Chapter f={f} n={4} />
      <div style={{position: 'absolute', left: 140, top: 160}}>
        <Head text="Usage feeds" start={6} size={100} />
      </div>
      <div style={{position: 'absolute', left: 140, top: 270}}>
        <Head text="the token." start={12} size={100} color={ICE} />
      </div>
      <Body f={f} at={22} style={{position: 'absolute', left: 140, top: 410, width: 760}}>
        Paid compute earns revenue. The intended policy uses a disclosed share of available revenue to buy back $LLM and burn it.
      </Body>
      {/* priority waterfall */}
      <div style={{position: 'absolute', left: 140, top: 600, width: 760, opacity: prog(f, 110, 14)}}>
        <Label style={{color: ICE}}>Compute is protected first</Label>
        <div style={{marginTop: 18}}>
          {PRIORITY.map((p, i) => {
            const on = prog(f, 120 + i * 12, 12, expoOut);
            return (
              <div key={p} style={{display: 'flex', alignItems: 'center', gap: 18, padding: '13px 0', borderTop: `1px solid ${LINE}`, opacity: on, transform: `translateX(${(1 - on) * -20}px)`}}>
                <span style={{fontFamily: MONO, fontSize: 16, color: ICE, width: 30}}>{`0${i + 1}`}</span>
                <span style={{fontFamily: HEAD, fontSize: 27, color: INK}}>{p}</span>
                <span style={{marginLeft: 'auto', fontFamily: MONO, fontSize: 15, color: DIM}}>PAID FIRST</span>
              </div>
            );
          })}
          <div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '15px 0', borderTop: `1px solid ${ICE}`, opacity: prog(f, 172, 12)}}>
            <span style={{fontFamily: MONO, fontSize: 16, color: ICE, width: 30}}>→</span>
            <span style={{fontFamily: HEAD, fontWeight: 600, fontSize: 28, color: ICE}}>Then buybacks + burns</span>
          </div>
        </div>
      </div>
      {/* loop ring */}
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <circle cx={CX} cy={CY} r={R} fill="none" stroke={LINE} strokeWidth={2} />
        <circle cx={CX} cy={CY} r={R} fill="none" stroke={ICE} strokeWidth={2} strokeDasharray={`${C * draw} ${C}`} transform={`rotate(-90 ${CX} ${CY})`} opacity={0.65} />
        {f >= t0 && <circle cx={CX + Math.cos(a) * R} cy={CY + Math.sin(a) * R} r={10} fill={INK} style={{filter: `drop-shadow(0 0 12px ${ICE})`}} />}
        {f >= t0 && [1, 2, 3, 4, 5].map((j) => <circle key={j} cx={CX + Math.cos(a - j * 0.06) * R} cy={CY + Math.sin(a - j * 0.06) * R} r={8 - j} fill={ICE} opacity={0.5 - j * 0.08} />)}
      </svg>
      {LOOP.map((l, k) => {
        const x = CX + Math.cos(ang(k)) * R;
        const y = CY + Math.sin(ang(k)) * R;
        const on = lit(k);
        const p = prog(f, 18 + k * 6, 14, expoOut);
        return (
          <div key={l} style={{position: 'absolute', left: x - 130, top: y - 42, width: 260, height: 84, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: on ? NAVY : '#0A1222', border: `1px solid ${on ? ICE : LINE}`, boxShadow: on ? `0 0 30px rgba(120,160,240,0.35)` : undefined, opacity: p, transform: `scale(${lerp(0.85, 1, p)})`}}>
            <Label style={{fontSize: 11, color: on ? ICE : DIM}}>{`0${k + 1}`}</Label>
            <div style={{fontFamily: HEAD, fontWeight: 600, fontSize: 28, color: INK, marginTop: 4}}>{l}</div>
          </div>
        );
      })}
      {/* centre */}
      <div style={{position: 'absolute', left: CX - 150, top: CY - 120, width: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: prog(f, 26, 16)}}>
        <Cube size={130} glow={0.6} />
        <Label style={{marginTop: 18, color: ICE}}>{burns > 0 ? `Verified burns · ${burns}` : '$LLM supply'}</Label>
        <div style={{fontFamily: MONO, fontSize: 15, color: DIM, marginTop: 8, letterSpacing: '0.1em'}}>ILLUSTRATIVE</div>
      </div>
      {/* receipt pops at the burn node */}
      {[0, 1].map((j) => {
        const ta = t0 + (0.75 + j) * lap;
        const p = prog(f, ta, 8, expoOut) * (1 - prog(f, ta + 40, 10));
        if (p <= 0) return null;
        return (
          <div key={j} style={{position: 'absolute', left: CX - R + 40, top: CY + 64, padding: '12px 16px', background: '#060A13', border: `1px solid ${ICE}`, fontFamily: MONO, fontSize: 15, color: INK, letterSpacing: '0.06em', opacity: p, transform: `translateY(${(1 - p) * 10}px)`, whiteSpace: 'nowrap'}}>
            BURN · FINALIZED ✓ · EXPLORER ↗
          </div>
        );
      })}
      <Label style={{position: 'absolute', left: 140, top: 1000, color: DIM, opacity: prog(f, 60, 14)}}>Planned policy · allocation % not yet published · no price support or returns implied</Label>
    </AbsoluteFill>
  );
};

// ── 7. two burns ───────────────────────────────────────────
const Token: React.FC<{f: number; at: number}> = ({f, at}) => {
  const b = prog(f, at, 40, inOut);
  return (
    <div style={{position: 'relative', width: 150, height: 150}}>
      {new Array(14).fill(0).map((_, i) => {
        const t = ((f - at + i * 3) % 30) / 30;
        if (f < at) return null;
        return <div key={i} style={{position: 'absolute', left: 75 + Math.sin(i * 2.1) * 40 * t - 4, top: 75 - t * 110, width: 7, height: 7, borderRadius: 4, background: i % 2 ? ICE : INK, opacity: (1 - t) * 0.9}} />;
      })}
      <div style={{position: 'absolute', left: 75 - 60 * (1 - b * 0.55), top: 75 - 60 * (1 - b * 0.55), width: 120 * (1 - b * 0.55), height: 120 * (1 - b * 0.55), borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, #3A5BC0, ${NAVY} 60%, #0C1A44)`, border: `2px solid ${ICE}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HEAD, fontWeight: 600, fontSize: 28 * (1 - b * 0.5), color: INK, opacity: 1 - b * 0.6}}>$LLM</div>
    </div>
  );
};
const Burns: React.FC = () => {
  const f = useCurrentFrame();
  const cards = [
    {k: '01', t: 'Revenue buyback + burn', d: 'The treasury uses earned revenue to buy $LLM on the market, then burns it. Supply goes down.', tag: 'PLANNED'},
    {k: '02', t: 'Burn for compute', d: 'Holders burn $LLM for additional compute credit through a quoted, reserve-backed redemption.', tag: 'NOT LIVE YET'},
  ];
  return (
    <AbsoluteFill>
      <Frost />
      <Chapter f={f} n={5} />
      <div style={{position: 'absolute', left: 140, top: 160}}>
        <Head text="Two ways $LLM" start={6} size={100} />
      </div>
      <div style={{position: 'absolute', left: 140, top: 270}}>
        <Head text="leaves supply." start={12} size={100} color={ICE} />
      </div>
      {cards.map((c, i) => {
        const p = prog(f, 26 + i * 12, 18, expoOut);
        return (
          <div key={c.k} style={{position: 'absolute', left: 140 + i * 840, top: 460, width: 800, height: 330, padding: '36px 40px', boxSizing: 'border-box', background: PANEL, border: `1px solid ${LINE}`, display: 'flex', gap: 34, opacity: p, transform: `translateY(${(1 - p) * 30}px)`}}>
            <Token f={f} at={56 + i * 20} />
            <div style={{flex: 1}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <Label style={{color: ICE}}>{c.k}</Label>
                <span style={{fontFamily: MONO, fontSize: 13, letterSpacing: '0.14em', color: MUTED, border: `1px solid ${LINE}`, padding: '5px 10px'}}>{c.tag}</span>
              </div>
              <div style={{fontFamily: HEAD, fontWeight: 600, fontSize: 44, lineHeight: 1.1, color: INK, marginTop: 18}}>{c.t}</div>
              <div style={{fontFamily: HEAD, fontSize: 25, lineHeight: 1.45, color: MUTED, marginTop: 16}}>{c.d}</div>
            </div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 140, top: 860, display: 'flex', alignItems: 'center', gap: 18, opacity: prog(f, 90, 14)}}>
        <div style={{width: 46, height: 2, background: ICE}} />
        <div style={{fontFamily: HEAD, fontSize: 28, color: INK}}>Every burn ships with a receipt: finalized transaction, exact amount, explorer link.</div>
      </div>
    </AbsoluteFill>
  );
};

// ── 8. finale on the banner ────────────────────────────────
const Finale: React.FC = () => {
  const f = useCurrentFrame();
  const z = prog(f, 0, 120, inOut);
  const H = lerp(1080 * 1.12, 1080, z);
  const sweep = prog(f, 30, 40, inOut);
  return (
    <AbsoluteFill style={{background: '#DDE6F3'}}>
      <Banner H={H} fx={1086} fy={300} sx={960} sy={lerp(450, 447, z)} />
      {sweep > 0 && sweep < 1 && <div style={{position: 'absolute', top: -300, left: lerp(-400, 2200, sweep), width: 260, height: 1700, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)', transform: 'rotate(18deg)'}} />}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, transparent 66%, rgba(5,8,15,0.88) 92%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 900, display: 'flex', justifyContent: 'center', gap: 18, opacity: prog(f, 50, 16), transform: `translateY(${(1 - prog(f, 50, 18, expoOut)) * 14}px)`}}>
        <div style={{padding: '16px 28px', background: NAVY, border: `1px solid ${ICE}`, fontFamily: WIDE, fontSize: 30, letterSpacing: '0.12em', color: INK}}>$LLM</div>
        <div style={{padding: '16px 32px', border: `1px solid ${INK}`, background: 'rgba(5,8,15,0.5)', fontFamily: WIDE, fontSize: 30, letterSpacing: '0.16em', color: INK}}>LOCALLM.FUN</div>
      </div>
      <Label style={{position: 'absolute', left: 0, right: 0, top: 1028, textAlign: 'center', fontSize: 11, color: MUTED, opacity: prog(f, 66, 14)}}>
        Model in development · buyback policy planned · credits are service usage, not returns · not financial advice
      </Label>
    </AbsoluteFill>
  );
};

export const LlmFilm: React.FC<{withAudio?: boolean}> = ({withAudio = true}) => (
  <AbsoluteFill style={{background: BG}}>
    <Sequence from={S.open.from} durationInFrames={S.open.dur} name="01 Banner pull-back">
      <Cut dur={S.open.dur}>
        <Open />
      </Cut>
    </Sequence>
    <Sequence from={S.manifesto.from} durationInFrames={S.manifesto.dur} name="02 Manifesto">
      <Cut dur={S.manifesto.dur}>
        <Manifesto />
      </Cut>
    </Sequence>
    <Sequence from={S.infra.from} durationInFrames={S.infra.dur} name="03 Infrastructure">
      <Cut dur={S.infra.dur}>
        <Infra />
      </Cut>
    </Sequence>
    <Sequence from={S.access.from} durationInFrames={S.access.dur} name="04 Hold $LLM. Earn AI.">
      <Cut dur={S.access.dur}>
        <Access />
      </Cut>
    </Sequence>
    <Sequence from={S.work.from} durationInFrames={S.work.dur} name="05 Workspace">
      <Cut dur={S.work.dur}>
        <Workspace />
      </Cut>
    </Sequence>
    <Sequence from={S.loop.from} durationInFrames={S.loop.dur} name="06 Revenue loop">
      <Cut dur={S.loop.dur}>
        <Loop />
      </Cut>
    </Sequence>
    <Sequence from={S.burns.from} durationInFrames={S.burns.dur} name="07 Two burns">
      <Cut dur={S.burns.dur}>
        <Burns />
      </Cut>
    </Sequence>
    <Sequence from={S.finale.from} durationInFrames={S.finale.dur} name="08 Banner finale">
      <Cut dur={S.finale.dur} last>
        <Finale />
      </Cut>
    </Sequence>
    {withAudio && <Audio src={staticFile('llm-score.wav')} />}
  </AbsoluteFill>
);

