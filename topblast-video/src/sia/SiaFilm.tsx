import {AbsoluteFill, Audio, Img, Sequence, random, staticFile, useCurrentFrame} from 'remotion';
import {expoIn, expoOut, inOut, lerp, prog} from '../theme';
import tl from './timeline.json';

// SIA — Super Intelligence Agency. Monochrome, classified-dossier world built from the
// seal + banner art: scanlines, grain, HUD reticles, Barlow Condensed + IBM Plex Mono.
const BG = '#050505';
const INK = '#F2F2F2';
const DIM = '#A3A3A3';
const MUTED = '#5E5E5E';
const RULE = 'rgba(255,255,255,0.16)';
const HEAD = '"Barlow Condensed", "Archivo Variable", sans-serif';
const MONO = '"IBM Plex Mono", monospace';
const BODY = '"DM Sans", sans-serif';
const S = tl.scenes;

// ── atmosphere ─────────────────────────────────────────────
const Grain: React.FC<{f: number}> = ({f}) => (
  <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen', opacity: 0.07}}>
    <Img src={staticFile(`sia/grain${f % 6}.png`)} style={{width: 1920, height: 1080, imageRendering: 'pixelated'}} />
  </AbsoluteFill>
);
const Scan: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none', backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 4px)'}} />
);
const Vignette: React.FC = () => <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.75) 100%)'}} />;
const Ground: React.FC<{f: number; grid?: boolean}> = ({f, grid = true}) => (
  <AbsoluteFill style={{background: BG}}>
    {grid && <AbsoluteFill style={{opacity: 0.5, backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '60px 60px', backgroundPosition: `${-f * 0.3}px 0px`}} />}
    <div style={{position: 'absolute', left: 960 - 900, top: 540 - 600, width: 1800, height: 1200, background: 'radial-gradient(closest-side, rgba(255,255,255,0.09), transparent)'}} />
  </AbsoluteFill>
);

const Mono: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{fontFamily: MONO, fontSize: 18, letterSpacing: '0.16em', color: DIM, textTransform: 'uppercase', ...style}}>{children}</div>
);

// typewriter
const Type: React.FC<{text: string; f: number; at: number; cps?: number; style?: React.CSSProperties; cursor?: boolean}> = ({text, f, at, cps = 1.2, style, cursor = true}) => {
  const n = Math.max(0, Math.min(text.length, Math.floor((f - at) * cps)));
  const show = f >= at;
  return (
    <div style={{fontFamily: MONO, letterSpacing: '0.14em', textTransform: 'uppercase', whiteSpace: 'pre', opacity: show ? 1 : 0, ...style}}>
      {text.slice(0, n)}
      {cursor && n < text.length && show && <span style={{opacity: Math.floor(f / 4) % 2 ? 1 : 0.2}}>█</span>}
    </div>
  );
};

// headline: words punch up out of a mask
const Head: React.FC<{text: string; start: number; size: number; color?: string; align?: 'left' | 'center'; stagger?: number; style?: React.CSSProperties}> = ({text, start, size, color = INK, align = 'left', stagger = 3, style}) => {
  const f = useCurrentFrame();
  return (
    <div style={{display: 'flex', justifyContent: align === 'center' ? 'center' : 'flex-start', gap: size * 0.22, fontFamily: HEAD, fontWeight: 800, fontSize: size, lineHeight: 0.95, letterSpacing: '0.01em', textTransform: 'uppercase', color, whiteSpace: 'nowrap', ...style}}>
      {text.split(' ').map((w, i) => {
        const p = prog(f, start + i * stagger, 14, expoOut);
        return (
          <span key={i} style={{display: 'inline-block', overflow: 'hidden', paddingBottom: size * 0.06}}>
            <span style={{display: 'inline-block', transform: `translateY(${(1 - p) * 105}%)`}}>{w}</span>
          </span>
        );
      })}
    </div>
  );
};

const Corners: React.FC<{x: number; y: number; w: number; h: number; s?: number; color?: string; o?: number}> = ({x, y, w, h, s = 22, color = INK, o = 1}) => (
  <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: o}}>
    <g stroke={color} strokeWidth={2} fill="none">
      <path d={`M ${x} ${y + s} V ${y} H ${x + s}`} />
      <path d={`M ${x + w - s} ${y} H ${x + w} V ${y + s}`} />
      <path d={`M ${x} ${y + h - s} V ${y + h} H ${x + s}`} />
      <path d={`M ${x + w - s} ${y + h} H ${x + w} V ${y + h - s}`} />
    </g>
  </svg>
);

const Cut: React.FC<{dur: number; last?: boolean; children: React.ReactNode}> = ({dur, last, children}) => {
  const f = useCurrentFrame();
  const i = prog(f, 0, 14, expoOut);
  const o = last ? 0 : prog(f, dur - 12, 12, expoIn);
  const jitter = f < 4 ? (random(`j${f}`) - 0.5) * 30 : 0;
  return (
    <AbsoluteFill style={{opacity: Math.min(1, i * 1.4) * (1 - o), transform: `translateX(${jitter}px) scale(${lerp(1.04, 1, i) * lerp(1, 0.96, o)})`, filter: i < 1 || o > 0 ? `blur(${(1 - i) * 8 + o * 10}px)` : undefined}}>
      {children}
    </AbsoluteFill>
  );
};

// ── 1. seal ────────────────────────────────────────────────
const Seal: React.FC = () => {
  const f = useCurrentFrame();
  const inn = prog(f, 8, 30, expoOut);
  const flare = prog(f, 8, 16) * (1 - prog(f, 24, 30));
  const SZ = 560;
  return (
    <AbsoluteFill>
      <Ground f={f} />
      {/* floor rings, like the banner */}
      {[0, 1, 2, 3].map((k) => {
        const t = ((f + k * 22) % 88) / 88;
        return <div key={k} style={{position: 'absolute', left: 960 - 900 * t, top: 860 - 120 * t, width: 1800 * t, height: 240 * t, borderRadius: '50%', border: `2px solid rgba(255,255,255,${0.35 * (1 - t)})`}} />;
      })}
      <div style={{position: 'absolute', left: 960 - 520, top: 470 - 520, width: 1040, height: 1040, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(255,255,255,0.28), transparent)', opacity: inn}} />
      {/* rotating tick ring */}
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: inn}}>
        <g transform={`rotate(${f * 0.4} 960 470)`}>
          <circle cx={960} cy={470} r={SZ / 2 + 36} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={2} strokeDasharray="2 14" />
        </g>
        <g transform={`rotate(${-f * 0.25} 960 470)`}>
          <circle cx={960} cy={470} r={SZ / 2 + 60} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={1.5} strokeDasharray="60 30 6 30" />
        </g>
      </svg>
      <div style={{position: 'absolute', left: 960 - SZ / 2, top: 470 - SZ / 2, width: SZ, height: SZ, borderRadius: '50%', boxShadow: `0 0 0 6px ${BG}, 0 0 0 9px rgba(255,255,255,0.9), 0 0 ${80 + 60 * flare}px rgba(255,255,255,${0.35 + 0.4 * flare})`, opacity: Math.min(1, inn * 1.3), transform: `scale(${lerp(1.25, 1, inn)})`, filter: inn < 1 ? `blur(${(1 - inn) * 14}px)` : undefined}}>
        <Img src={staticFile('sia/seal.png')} style={{width: SZ, height: SZ, borderRadius: '50%'}} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 70 + 0, display: 'flex', justifyContent: 'space-between', padding: '0 80px'}}>
        <Type text="SIA / INTELLIGENCE DIVISION" f={f} at={2} cps={1.6} style={{fontSize: 18, color: DIM}} />
        <Type text="SOLANA / PUBLIC ACCESS" f={f} at={10} cps={1.6} style={{fontSize: 18, color: DIM}} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 820, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40}}>
        <div style={{width: 240 * prog(f, 40, 20, expoOut), height: 2, background: INK}} />
        <Type text="SUPER INTELLIGENCE AGENCY" f={f} at={36} cps={1.4} cursor={false} style={{fontFamily: HEAD, fontWeight: 600, fontSize: 64, letterSpacing: '0.32em', color: INK}} />
        <div style={{width: 240 * prog(f, 40, 20, expoOut), height: 2, background: INK}} />
      </div>
      <Type text="DECENTRALIZED INTELLIGENCE / SOLANA" f={f} at={64} cps={1.8} style={{position: 'absolute', left: 0, right: 0, top: 930, textAlign: 'center', fontSize: 18, color: MUTED}} />
    </AbsoluteFill>
  );
};

// ── 2. world map: follows the money ────────────────────────
const TARGETS = [
  {x: 470, y: 330, w: '7xKq…3fA', at: 30},
  {x: 1240, y: 300, w: 'Hn2w…9QeT', at: 44},
  {x: 760, y: 560, w: 'Bf8r…11Zc', at: 58},
  {x: 1480, y: 520, w: 'Qm4d…x7Lp', at: 72},
];
const MapScene: React.FC = () => {
  const f = useCurrentFrame();
  const K = lerp(1.92, 2.08, prog(f, 0, 160, (t) => t));
  const left = lerp(500, 400, prog(f, 0, 160, inOut));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: BG}}>
        <Img src={staticFile('sia/banner.jpg')} style={{position: 'absolute', left: left - 250 * (K - 1.92), top: 540 - 300 * K, height: 724 * K, width: 2172 * K, filter: 'brightness(0.75) contrast(1.15)'}} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(5,5,5,1) 0%, rgba(5,5,5,0.9) 42%, rgba(5,5,5,0.2) 70%, rgba(5,5,5,0.35) 100%)'}} />
      {/* reticles */}
      {TARGETS.map((t, k) => {
        const p = prog(f, t.at, 10, expoOut);
        if (p <= 0) return null;
        const s = lerp(120, 56, p);
        return (
          <div key={k} style={{position: 'absolute', left: 820 + t.x * 0.55 - s / 2, top: t.y + 120 - s / 2, width: s, height: s, opacity: Math.min(1, p * 2)}}>
            <Corners x={0} y={0} w={s} h={s} s={14} />
            <div style={{position: 'absolute', left: s / 2 - 4, top: s / 2 - 4, width: 8, height: 8, borderRadius: 4, background: INK, boxShadow: '0 0 14px #fff'}} />
            <Mono style={{position: 'absolute', left: s + 10, top: 4, fontSize: 14, color: INK, whiteSpace: 'nowrap', letterSpacing: '0.1em'}}>{t.w}</Mono>
            <Mono style={{position: 'absolute', left: s + 10, top: 26, fontSize: 12, color: DIM, whiteSpace: 'nowrap', letterSpacing: '0.12em', opacity: prog(f, t.at + 8, 6)}}>TRACKED ●</Mono>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 120, top: 120}}>
        <Type text="SIA / FIELD OPERATIONS" f={f} at={4} cps={1.6} style={{fontSize: 18, color: DIM}} />
      </div>
      <div style={{position: 'absolute', left: 120, top: 330}}>
        <Head text="Intelligence" start={8} size={150} />
      </div>
      <div style={{position: 'absolute', left: 120, top: 470}}>
        <Head text="that follows" start={14} size={150} />
      </div>
      <div style={{position: 'absolute', left: 120, top: 610}}>
        <Head text="the money." start={20} size={150} color="#FFFFFF" style={{textShadow: '0 0 40px rgba(255,255,255,0.45)'}} />
      </div>
      <div style={{position: 'absolute', left: 120, top: 820, width: 760, fontFamily: BODY, fontSize: 30, lineHeight: 1.45, color: DIM, opacity: prog(f, 40, 16), transform: `translateY(${(1 - prog(f, 40, 18, expoOut)) * 14}px)`}}>
        AI agents analyze <span style={{color: INK, fontWeight: 600}}>$SIA holders</span>, compare trading performance and rank wallets for rewards.
      </div>
    </AbsoluteFill>
  );
};

// ── 3. the five agents ─────────────────────────────────────
const AGENTS = [
  {k: 'scout', n: 'SCOUT', r: 'Holder eligibility', d: 'Finds the contenders. Checks $SIA balances at both snapshots.'},
  {k: 'ledger', n: 'LEDGER', r: 'Trade analysis', d: 'Reconstructs buys, sells, fees and P&L. Transfers aren’t profit.'},
  {k: 'signal', n: 'SIGNAL', r: 'Risk assessment', d: 'Weighs returns, drawdown and consistency against the field.'},
  {k: 'auditor', n: 'AUDITOR', r: 'Suspicious activity', d: 'Flags manipulation before any wallet can rank.'},
  {k: 'director', n: 'DIRECTOR', r: 'Final ranking brief', d: 'Delivers the daily briefing behind every rank.'},
];
const Agents: React.FC = () => {
  const f = useCurrentFrame();
  const CW = 330;
  const GAP = 24;
  const X0 = (1920 - (CW * 5 + GAP * 4)) / 2;
  return (
    <AbsoluteFill>
      <Ground f={f + 260} />
      <div style={{position: 'absolute', left: X0, top: 90}}>
        <Type text="INSIDE THE SWARM / AGENT ROSTER" f={f} at={2} cps={1.8} style={{fontSize: 18, color: DIM}} />
      </div>
      <div style={{position: 'absolute', left: X0, top: 130, display: 'flex', gap: 26}}>
        <Head text="Five agents." start={4} size={110} />
        <Head text="Eyes on the field." start={12} size={110} color={DIM} />
      </div>
      {AGENTS.map((a, i) => {
        const at = 20 + i * 9;
        const p = prog(f, at, 16, expoOut);
        const scan = prog(f, at + 6, 18, inOut);
        const x = X0 + i * (CW + GAP);
        return (
          <div key={a.k} style={{position: 'absolute', left: x, top: 320, width: CW, height: 620, border: `1px solid ${RULE}`, background: 'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))', opacity: p, transform: `translateY(${(1 - p) * 60}px)`}}>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '14px 16px', borderBottom: `1px solid ${RULE}`}}>
              <Mono style={{fontSize: 14, color: INK}}>{`AGENT 0${i + 1}`}</Mono>
              <Mono style={{fontSize: 14, color: DIM}}>ACTIVE ●</Mono>
            </div>
            <div style={{position: 'relative', margin: '16px 16px 0', height: 296, overflow: 'hidden', border: `1px solid ${RULE}`}}>
              <Img src={staticFile(`sia/agent-${a.k}.png`)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: `contrast(1.15) brightness(${lerp(0.4, 1, scan)})`, transform: `scale(${lerp(1.15, 1, p)})`}} />
              {scan < 1 && <div style={{position: 'absolute', left: 0, right: 0, top: `${scan * 100}%`, height: 3, background: '#fff', boxShadow: '0 0 20px #fff'}} />}
              <Corners x={8} y={8} w={CW - 32 - 16} h={296 - 16} s={16} o={0.8} />
            </div>
            <div style={{padding: '18px 18px 0'}}>
              <div style={{fontFamily: HEAD, fontWeight: 800, fontSize: 60, lineHeight: 1, letterSpacing: '0.04em', color: INK}}>{a.n}</div>
              <Mono style={{fontSize: 14, marginTop: 8, color: INK, letterSpacing: '0.12em'}}>{a.r}</Mono>
              <div style={{fontFamily: BODY, fontSize: 19, lineHeight: 1.45, color: DIM, marginTop: 12}}>{a.d}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ── 4. holder vs holder ────────────────────────────────────
const WALLETS = ['7xKq…3fA', 'Hn2w…9QeT', 'Bf8r…11Zc', 'Qm4d…x7Lp', 'Ce9P…r2Wk', 'Zt1a…Hh6M', 'Lp0x…vB4n', 'Rw7y…k3Ds', 'Ux2m…Gq8e', 'Ya5c…tN1j', 'Kd3s…pP9w', 'Mv6t…bE2r'];
const ORDER_A = [3, 0, 7, 1, 10, 4, 2, 11, 5, 8, 6, 9];
const ORDER_B = [0, 1, 3, 2, 4, 7, 5, 6, 10, 8, 11, 9];
const PvP: React.FC = () => {
  const f = useCurrentFrame();
  const shuffle = prog(f, 76, 14, inOut);
  const ROW = 50;
  const TY = 250;
  const rankOf = (order: number[], w: number) => order.indexOf(w);
  return (
    <AbsoluteFill>
      <Ground f={f + 470} />
      <div style={{position: 'absolute', left: 120, top: 110}}>
        <Type text="THE HOLDER BENEFIT / PLANNED" f={f} at={2} cps={1.8} style={{fontSize: 18, color: DIM}} />
      </div>
      <div style={{position: 'absolute', left: 120, top: 160}}>
        <Head text="Holder" start={4} size={140} />
      </div>
      <div style={{position: 'absolute', left: 120, top: 290}}>
        <Head text="vs holder." start={10} size={140} color={DIM} />
      </div>
      {[
        ['01', 'Hold 1M+ $SIA', 'At the opening and closing snapshots.'],
        ['02', 'The swarm follows your moves', 'Every trade, fee and drawdown — on the record.'],
        ['03', 'Top 10. Daily SI airdrops.', 'From the day’s funded pool.'],
      ].map(([n, t, d], k) => {
        const p = prog(f, 26 + k * 12, 14, expoOut);
        return (
          <div key={n} style={{position: 'absolute', left: 120, top: 490 + k * 140, width: 760, display: 'flex', gap: 24, opacity: p, transform: `translateX(${(1 - p) * -30}px)`}}>
            <div style={{width: 64, height: 64, border: `1.5px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontWeight: 600, fontSize: 22, color: INK, flexShrink: 0, background: k === 2 ? INK : 'transparent', ...(k === 2 ? {color: BG} : {})}}>{n}</div>
            <div>
              <div style={{fontFamily: HEAD, fontWeight: 700, fontSize: 50, lineHeight: 1, textTransform: 'uppercase', color: INK, letterSpacing: '0.02em'}}>{t}</div>
              <div style={{fontFamily: BODY, fontSize: 24, color: DIM, marginTop: 8}}>{d}</div>
            </div>
          </div>
        );
      })}
      {/* leaderboard terminal */}
      <div style={{position: 'absolute', left: 1000, top: 150, width: 800, height: 830, border: `1px solid ${RULE}`, background: 'rgba(255,255,255,0.03)', opacity: prog(f, 12, 16), transform: `translateY(${(1 - prog(f, 12, 18, expoOut)) * 40}px)`}}>
        <div style={{display: 'flex', justifyContent: 'space-between', padding: '18px 24px', borderBottom: `1px solid ${RULE}`}}>
          <Mono style={{fontSize: 16, color: INK}}>HOLDER LEADERBOARD · DAILY ROUND</Mono>
          <Mono style={{fontSize: 14}}>DEMO · FICTIONAL WALLETS</Mono>
        </div>
        <div style={{display: 'flex', padding: '12px 24px', fontFamily: MONO, fontSize: 14, letterSpacing: '0.14em', color: MUTED}}>
          <span style={{width: 70}}>RANK</span>
          <span style={{width: 300}}>WALLET</span>
          <span style={{width: 200}}>SCORE / 100</span>
          <span>REWARD</span>
        </div>
        {WALLETS.map((w, i) => {
          const ra = rankOf(ORDER_A, i);
          const rb = rankOf(ORDER_B, i);
          const r = lerp(ra, rb, shuffle);
          const rank = Math.round(r);
          const top = rank < 10;
          const score = Math.round(lerp(96 - ra * 4.3, 97 - rb * 4.1, shuffle) * prog(f, 20, 30, expoOut));
          const appear = prog(f, 18 + i * 2, 10);
          return (
            <div key={w} style={{position: 'absolute', left: 24, right: 24, top: TY - 150 + r * ROW + (rank >= 10 ? 44 : 0), height: ROW - 6, display: 'flex', alignItems: 'center', fontFamily: MONO, fontSize: 20, color: top ? INK : MUTED, borderBottom: `1px solid rgba(255,255,255,0.06)`, opacity: appear * (ra !== rb ? 1 - 0.75 * Math.sin(Math.PI * shuffle) : 1 - 0.3 * Math.sin(Math.PI * shuffle)), filter: ra !== rb && shuffle > 0 && shuffle < 1 ? `blur(${2.5 * Math.sin(Math.PI * shuffle)}px)` : undefined, background: rank === 0 && shuffle > 0.9 ? 'rgba(255,255,255,0.08)' : undefined}}>
              <span style={{width: 70, fontWeight: 600}}>{String(rank + 1).padStart(2, '0')}</span>
              <span style={{width: 300}}>{w}</span>
              <span style={{width: 200, position: 'relative'}}>
                <span style={{display: 'inline-block', width: 120, height: 6, background: 'rgba(255,255,255,0.1)', marginRight: 12, verticalAlign: 'middle'}}>
                  <span style={{display: 'block', width: `${score}%`, height: '100%', background: top ? INK : MUTED}} />
                </span>
                {score}
              </span>
              <span style={{fontWeight: 600, opacity: top ? prog(f, 104 + rank * 2, 8) : 0, border: `1px solid ${INK}`, padding: '2px 10px', fontSize: 16}}>SI ✦</span>
            </div>
          );
        })}
        <div style={{position: 'absolute', left: 24, right: 24, top: TY - 150 + 10 * ROW + 6, display: 'flex', alignItems: 'center', gap: 14, opacity: prog(f, 96, 10)}}>
          <div style={{flex: 1, height: 1, background: INK}} />
          <Mono style={{fontSize: 14, color: INK}}>TOP 10 CUTOFF</Mono>
          <div style={{flex: 1, height: 1, background: INK}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── 5. scoring ─────────────────────────────────────────────
const WEIGHTS = [
  {p: 35, t: 'Capital-adjusted return', c: '#FFFFFF'},
  {p: 25, t: 'Realized return', c: '#C8C8C8'},
  {p: 25, t: 'Drawdown resilience', c: '#8E8E8E'},
  {p: 15, t: 'Active-day consistency', c: '#5A5A5A'},
];
const Score: React.FC = () => {
  const f = useCurrentFrame();
  const CX = 1400;
  const CY = 560;
  const R = 250;
  const C = 2 * Math.PI * R;
  let acc = 0;
  return (
    <AbsoluteFill>
      <Ground f={f + 640} />
      <div style={{position: 'absolute', left: 120, top: 110}}>
        <Type text="HOW SCORING WORKS / PUBLISHED RULES" f={f} at={2} cps={1.8} style={{fontSize: 18, color: DIM}} />
      </div>
      <div style={{position: 'absolute', left: 120, top: 160}}>
        <Head text="Every rank" start={4} size={130} />
      </div>
      <div style={{position: 'absolute', left: 120, top: 280}}>
        <Head text="needs evidence." start={10} size={130} color={DIM} />
      </div>
      {WEIGHTS.map((w, k) => {
        const p = prog(f, 24 + k * 10, 14, expoOut);
        return (
          <div key={w.t} style={{position: 'absolute', left: 120, top: 470 + k * 92, width: 760, display: 'flex', alignItems: 'center', gap: 22, opacity: p, transform: `translateX(${(1 - p) * -30}px)`, borderBottom: `1px solid ${RULE}`, paddingBottom: 18}}>
            <div style={{width: 18, height: 18, background: w.c}} />
            <div style={{width: 130, fontFamily: HEAD, fontWeight: 800, fontSize: 64, lineHeight: 1, color: INK}}>{Math.round(w.p * p)}%</div>
            <div style={{fontFamily: BODY, fontSize: 30, color: INK}}>{w.t}</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 120, top: 860, width: 760, fontFamily: BODY, fontSize: 28, lineHeight: 1.45, color: DIM, opacity: prog(f, 70, 14)}}>
        Raw profit alone <span style={{color: INK, fontWeight: 600}}>doesn’t decide who wins.</span> A bigger wallet can’t buy a better rank.
      </div>
      {/* donut */}
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={70} />
        {WEIGHTS.map((w, k) => {
          const start = acc;
          acc += w.p;
          const p = prog(f, 24 + k * 10, 20, inOut);
          const len = (w.p / 100) * C * p - 6;
          return <circle key={w.t} cx={CX} cy={CY} r={R} fill="none" stroke={w.c} strokeWidth={70} strokeDasharray={`${Math.max(0, len)} ${C}`} strokeDashoffset={-(start / 100) * C} transform={`rotate(-90 ${CX} ${CY})`} />;
        })}
        <circle cx={CX} cy={CY} r={R + 70} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={1.5} strokeDasharray="2 10" transform={`rotate(${f * 0.3} ${CX} ${CY})`} />
      </svg>
      <div style={{position: 'absolute', left: CX - 180, top: CY - 90, width: 360, textAlign: 'center', opacity: prog(f, 60, 14)}}>
        <div style={{fontFamily: HEAD, fontWeight: 800, fontSize: 110, lineHeight: 1, color: INK}}>100</div>
        <Mono style={{fontSize: 16, marginTop: 6}}>SCORE · EVIDENCE-WEIGHTED</Mono>
      </div>
      <div style={{position: 'absolute', left: CX - 330, top: 900, width: 660, display: 'flex', justifyContent: 'center', opacity: prog(f, 84, 12)}}>
        <div style={{border: `1.5px solid ${INK}`, padding: '12px 22px', fontFamily: MONO, fontSize: 18, letterSpacing: '0.12em', color: INK}}>3% PROPOSED FEE → PLANNED DAILY PRIZE POOL</div>
      </div>
    </AbsoluteFill>
  );
};

// ── 6. finale: banner reveal ───────────────────────────────
const Finale: React.FC = () => {
  const f = useCurrentFrame();
  const z = prog(f, 0, 60, expoOut);
  const sc = lerp(1.9, 0.8, z);
  const H = 1080 * sc;
  const W = (H * 2172) / 724;
  const sweep = prog(f, 40, 30, inOut);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: BG}} />
      <div style={{position: 'absolute', left: 960 - W / 2, top: lerp(420, 410, z) - H / 2 + 60 * z, width: W, height: H, opacity: Math.min(1, prog(f, 0, 10) * 1.2), overflow: 'hidden'}}>
        <Img src={staticFile('sia/banner.jpg')} style={{width: W, height: H, filter: `brightness(${lerp(1.3, 1, z)})`}} />
        {sweep > 0 && sweep < 1 && <div style={{position: 'absolute', top: -H * 0.2, left: lerp(-W * 0.1, W * 1.05, sweep) - 150, width: 300, height: H * 1.4, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)', transform: 'rotate(18deg)'}} />}
      </div>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, transparent 70%, rgba(5,5,5,0.95) 86%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 920, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22, opacity: prog(f, 54, 12), transform: `translateY(${(1 - prog(f, 54, 14, expoOut)) * 16}px)`}}>
        <div style={{padding: '14px 26px', background: INK, color: BG, fontFamily: HEAD, fontWeight: 800, fontSize: 44, letterSpacing: '0.06em', lineHeight: 1}}>$SIA</div>
        <div style={{padding: '14px 30px', border: `1.5px solid ${INK}`, color: INK, fontFamily: MONO, fontWeight: 600, fontSize: 30, letterSpacing: '0.1em'}}>SUPERINTELLIGENCEAGENCY.FUN</div>
        <div style={{padding: '14px 22px', border: `1px solid ${RULE}`, color: DIM, fontFamily: MONO, fontSize: 20, letterSpacing: '0.12em'}}>CA TO BE ANNOUNCED</div>
      </div>
      <Mono style={{position: 'absolute', left: 0, right: 0, top: 1030, textAlign: 'center', fontSize: 13, color: MUTED, letterSpacing: '0.14em', opacity: prog(f, 66, 12)}}>
        REWARDS PLANNED · LIVE SCORING NOT YET ACTIVE · NOT AFFILIATED WITH ANY GOVERNMENT AGENCY · NOT FINANCIAL ADVICE
      </Mono>
    </AbsoluteFill>
  );
};

export const SiaFilm: React.FC<{withAudio?: boolean}> = ({withAudio = true}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: BG}}>
      <Sequence from={S.seal.from} durationInFrames={S.seal.dur} name="01 Seal">
        <Cut dur={S.seal.dur}>
          <Seal />
        </Cut>
      </Sequence>
      <Sequence from={S.map.from} durationInFrames={S.map.dur} name="02 Intelligence that follows the money">
        <Cut dur={S.map.dur}>
          <MapScene />
        </Cut>
      </Sequence>
      <Sequence from={S.agents.from} durationInFrames={S.agents.dur} name="03 Five agents">
        <Cut dur={S.agents.dur}>
          <Agents />
        </Cut>
      </Sequence>
      <Sequence from={S.pvp.from} durationInFrames={S.pvp.dur} name="04 Holder vs holder">
        <Cut dur={S.pvp.dur}>
          <PvP />
        </Cut>
      </Sequence>
      <Sequence from={S.score.from} durationInFrames={S.score.dur} name="05 Every rank needs evidence">
        <Cut dur={S.score.dur}>
          <Score />
        </Cut>
      </Sequence>
      <Sequence from={S.finale.from} durationInFrames={S.finale.dur} name="06 Banner reveal">
        <Cut dur={S.finale.dur} last>
          <Finale />
        </Cut>
      </Sequence>
      <Scan />
      <Grain f={f} />
      <Vignette />
      {withAudio && <Audio src={staticFile('sia-score.wav')} />}
    </AbsoluteFill>
  );
};
