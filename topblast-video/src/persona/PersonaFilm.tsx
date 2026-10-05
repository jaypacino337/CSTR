import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {expoIn, expoOut, inOut, lerp, prog} from '../theme';
import tl from './timeline.json';

// Persona (personapump.fun) — HQ film. Site system: deep ink, violet → flame → pink
// glow, Unbounded display + DM Sans + JetBrains Mono. Sona, the purple flame, hosts.
const INK = '#09060F';
const INK2 = '#120B1F';
const INK3 = '#1C1230';
const LINE = '#31224D';
const CREAM = '#FBF6FF';
const MUTE = '#B3A6CF';
const DIM = '#6E6290';
const VIOLET = '#8B3DFF';
const FLAME = '#D23CFF';
const PINK = '#FF4FB8';
const FLARE = '#FF8AE0';
const MINT = '#4CF2C2';
const LILAC = '#B9A1FF';
const GRAD = 'linear-gradient(100deg, #8B3DFF 0%, #D23CFF 50%, #FF4FB8 100%)';
const DISPLAY = '"Unbounded Variable", sans-serif';
const SANS = '"DM Sans", sans-serif';
const MONO = '"JetBrains Mono", monospace';
const S = tl.scenes;

// ── Sona ───────────────────────────────────────────────────
const Sona: React.FC<{size: number; f: number; id: string; talk?: boolean; glow?: number}> = ({size, f, id, talk = false, glow = 1}) => {
  const blink = f % 96 > 90 ? 0.12 : 1;
  const flick = 1 + Math.sin(f / 4.3) * 0.018 + Math.sin(f / 2.7) * 0.01;
  const sway = Math.sin(f / 11) * 2.2;
  const mouth = talk ? 4 + Math.abs(Math.sin(f / 2.2)) * 9 : 0;
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 200 240" style={{overflow: 'visible'}}>
      <defs>
        <linearGradient id={`${id}o`} x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#5b1fd6" /><stop offset=".55" stopColor="#8b3dff" /><stop offset="1" stopColor="#d23cff" /></linearGradient>
        <linearGradient id={`${id}m`} x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#a64dff" /><stop offset=".6" stopColor="#d23cff" /><stop offset="1" stopColor="#ff4fb8" /></linearGradient>
        <radialGradient id={`${id}c`} cx=".5" cy=".7" r=".7"><stop offset="0" stopColor="#ffe6fb" /><stop offset=".55" stopColor="#ff9be6" /><stop offset="1" stopColor="#ff4fb8" /></radialGradient>
        <filter id={`${id}g`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="12" /></filter>
      </defs>
      <g transform={`translate(100 230) rotate(${sway * 0.4}) scale(${1 / flick}, ${flick}) translate(-100 -230)`}>
        <path d="M100 230C50 230 22 194 26 152C29 116 56 100 60 64C74 86 84 94 92 80C99 60 92 34 104 10C117 44 141 60 150 88C158 78 161 66 160 54C183 86 181 122 176 152C181 194 152 230 100 230Z" fill="#8b3dff" opacity={0.6 * glow} filter={`url(#${id}g)`} />
        <path d="M100 230C50 230 22 194 26 152C29 116 56 100 60 64C74 86 84 94 92 80C99 60 92 34 104 10C117 44 141 60 150 88C158 78 161 66 160 54C183 86 181 122 176 152C181 194 152 230 100 230Z" fill={`url(#${id}o)`} />
        <g transform={`translate(100 226) scale(1, ${1 + Math.sin(f / 3.1) * 0.025}) translate(-100 -226)`}>
          <path d="M100 226C62 226 42 198 45 166C48 138 68 124 74 98C84 116 94 118 100 102C106 84 104 64 112 46C122 74 140 90 146 114C152 104 154 96 154 88C166 112 164 140 160 164C162 200 138 226 100 226Z" fill={`url(#${id}m)`} />
        </g>
        <path d="M100 222C72 222 58 200 61 176C64 156 80 146 88 126C97 142 108 138 114 122C130 144 141 160 139 182C139 206 125 222 100 222Z" fill={`url(#${id}c)`} />
        <g transform={`translate(0 ${170}) scale(1 ${blink}) translate(0 -170)`}>
          <ellipse cx="87" cy="170" rx="8.5" ry="11" fill="#fff" />
          <ellipse cx="89" cy="172" rx="4" ry="5.5" fill="#2a0b3f" />
          <circle cx="91" cy="168" r="1.6" fill="#fff" />
          <ellipse cx="113" cy="170" rx="8.5" ry="11" fill="#fff" />
          <ellipse cx="115" cy="172" rx="4" ry="5.5" fill="#2a0b3f" />
          <circle cx="117" cy="168" r="1.6" fill="#fff" />
        </g>
        {talk ? <ellipse cx="100" cy={192 + mouth / 4} rx="8" ry={mouth / 2} fill="#2a0b3f" /> : <path d="M90 190q10 9 20 0" stroke="#2a0b3f" strokeWidth="4" strokeLinecap="round" fill="none" />}
        <ellipse cx="74" cy="186" rx="6" ry="3.5" fill="#ff8ae0" opacity=".55" />
        <ellipse cx="126" cy="186" rx="6" ry="3.5" fill="#ff8ae0" opacity=".55" />
      </g>
      {[[56, 70, 4], [150, 44, 3.2], [126, 22, 2.6], [40, 120, 2.4], [166, 120, 3]].map(([x, y, r], k) => (
        <circle key={k} cx={x} cy={y - ((f * 0.6 + k * 17) % 40)} r={r} fill="#ffd1f4" opacity={1 - ((f * 0.6 + k * 17) % 40) / 40} />
      ))}
    </svg>
  );
};

// ── shared ─────────────────────────────────────────────────
const Ground: React.FC<{f: number}> = ({f}) => (
  <AbsoluteFill style={{background: INK}}>
    <div style={{position: 'absolute', left: -400, top: -500, width: 1700, height: 1200, background: 'radial-gradient(closest-side, rgba(139,61,255,0.30), transparent)', transform: `translate(${Math.sin(f / 70) * 40}px, 0)`}} />
    <div style={{position: 'absolute', right: -400, bottom: -600, width: 1600, height: 1200, background: 'radial-gradient(closest-side, rgba(255,79,184,0.20), transparent)', transform: `translate(${Math.cos(f / 80) * 40}px, 0)`}} />
    <AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(185,161,255,0.10) 1.2px, transparent 1.6px)', backgroundSize: '34px 34px', backgroundPosition: `${-f * 0.2}px 0px`}} />
  </AbsoluteFill>
);

const Kicker: React.FC<{f: number; at: number; children: React.ReactNode; style?: React.CSSProperties}> = ({f, at, children, style}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 16px', borderRadius: 999, border: `1px solid ${LINE}`, background: 'rgba(28,18,48,0.6)', fontFamily: MONO, fontSize: 17, letterSpacing: '0.14em', color: LILAC, textTransform: 'uppercase', opacity: prog(f, at, 12), transform: `translateY(${(1 - prog(f, at, 14, expoOut)) * 10}px)`, ...style}}>
    <span style={{color: FLARE}}>✦</span>
    {children}
  </div>
);

const Head: React.FC<{text: string; start: number; size: number; grad?: boolean; color?: string; align?: 'left' | 'center'; stagger?: number}> = ({text, start, size, grad, color = CREAM, align = 'left', stagger = 3}) => {
  const f = useCurrentFrame();
  return (
    <div style={{display: 'flex', justifyContent: align === 'center' ? 'center' : 'flex-start', gap: size * 0.28, fontFamily: DISPLAY, fontWeight: 800, fontSize: size, lineHeight: 1.05, letterSpacing: '-0.03em', whiteSpace: 'nowrap'}}>
      {text.split(' ').map((w, i) => {
        const p = prog(f, start + i * stagger, 18, expoOut);
        return (
          <span key={i} style={{display: 'inline-block', overflow: 'hidden', paddingBottom: size * 0.12, paddingRight: grad ? size * 0.05 : 0}}>
            <span style={{display: 'inline-block', transform: `translateY(${(1 - p) * 110}%)`, ...(grad ? {backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent'} : {color})}}>{w}</span>
          </span>
        );
      })}
    </div>
  );
};

const Body: React.FC<{f: number; at: number; children: React.ReactNode; style?: React.CSSProperties}> = ({f, at, children, style}) => (
  <div style={{fontFamily: SANS, fontSize: 32, lineHeight: 1.45, color: MUTE, opacity: prog(f, at, 16), transform: `translateY(${(1 - prog(f, at, 20, expoOut)) * 12}px)`, ...style}}>{children}</div>
);

const Card: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{background: INK2, border: `1px solid ${LINE}`, borderRadius: 24, boxShadow: '0 40px 90px -40px rgba(0,0,0,0.8)', ...style}}>{children}</div>
);

const Cut: React.FC<{dur: number; last?: boolean; children: React.ReactNode}> = ({dur, last, children}) => {
  const f = useCurrentFrame();
  const i = prog(f, 0, 16, expoOut);
  const o = last ? 0 : prog(f, dur - 12, 12, expoIn);
  return <AbsoluteFill style={{opacity: Math.min(1, i * 1.3) * (1 - o), transform: `scale(${lerp(1.03, 1, i) * lerp(1, 0.97, o)})`, filter: i < 1 || o > 0 ? `blur(${(1 - i) * 8 + o * 8}px)` : undefined}}>{children}</AbsoluteFill>;
};

// a fictional AI influencer portrait (illustrated), used for the sample coins
type Look = {skin: string; hair: string; jacket: string; bg1: string; bg2: string; shades?: boolean; sign?: string};
const LOOKS: Record<string, Look> = {
  Marlo: {skin: '#E2AE88', hair: '#1E1428', jacket: '#3B1F6E', bg1: '#2A0F4F', bg2: '#8B3DFF', shades: true, sign: 'OPEN 24H'},
  Juno: {skin: '#B9805C', hair: '#F4C15A', jacket: '#0F5C63', bg1: '#123A54', bg2: '#25F4EE'},
  Bisou: {skin: '#F1C7A6', hair: '#7A2E3A', jacket: '#B03A72', bg1: '#4A1030', bg2: '#FF4F9A'},
};
const Influencer: React.FC<{name: string; w: number; h: number; f?: number; id: string; radius?: number}> = ({name, w, h, f = 0, id, radius = 18}) => {
  const L = LOOKS[name];
  const bob = Math.sin(f / 18) * 2;
  const blink = f % 110 > 104 ? 0.15 : 1;
  return (
    <svg width={w} height={h} viewBox={w / h > 1.3 ? '-130 50 660 366' : '0 0 400 400'} preserveAspectRatio="xMidYMid slice" style={{borderRadius: radius, display: 'block'}}>
      <defs>
        <radialGradient id={`${id}bg`} cx=".7" cy=".25" r=".95"><stop offset="0" stopColor={L.bg2} stopOpacity=".85" /><stop offset="1" stopColor={L.bg1} /></radialGradient>
        <linearGradient id={`${id}lens`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FF4FB8" /><stop offset="1" stopColor="#8B3DFF" /></linearGradient>
        <linearGradient id={`${id}sk`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={L.skin} /><stop offset="1" stopColor={L.skin} stopOpacity=".88" /></linearGradient>
        <filter id={`${id}glow`}><feGaussianBlur stdDeviation="4" /></filter>
      </defs>
      <rect x="-200" y="0" width="800" height="420" fill={`url(#${id}bg)`} />
      {L.sign && (
        <g opacity=".9">
          <text x="-96" y="120" fontFamily="Unbounded Variable, sans-serif" fontWeight="800" fontSize="30" fill="#FF4FB8" filter={`url(#${id}glow)`}>{L.sign}</text>
          <text x="-96" y="120" fontFamily="Unbounded Variable, sans-serif" fontWeight="800" fontSize="30" fill="#FFD1F4" opacity={0.75 + 0.25 * Math.sin(f / 3)}>{L.sign}</text>
        </g>
      )}
      <circle cx="330" cy="70" r="40" fill="#fff" opacity=".06" />
      <g transform={`translate(0 ${bob})`}>
        {/* shoulders */}
        <path d="M54 410 C62 322 126 292 200 292 C274 292 338 322 346 410 Z" fill={L.jacket} />
        <path d="M168 292 L200 340 L232 292 Z" fill="#000" opacity=".25" />
        <rect x="178" y="248" width="44" height="54" rx="14" fill={`url(#${id}sk)`} />
        {/* head */}
        <ellipse cx="128" cy="196" rx="13" ry="20" fill={L.skin} />
        <ellipse cx="272" cy="196" rx="13" ry="20" fill={L.skin} />
        <ellipse cx="200" cy="186" rx="72" ry="86" fill={`url(#${id}sk)`} />
        {/* hair */}
        <path d="M126 176 C118 104 162 82 200 82 C246 82 286 104 276 176 C262 140 238 124 206 126 C176 128 146 138 126 176 Z" fill={L.hair} />
        <path d="M150 118 C170 96 230 92 258 118" stroke="#fff" strokeOpacity=".12" strokeWidth="6" fill="none" strokeLinecap="round" />
        {/* eyes / shades */}
        {L.shades ? (
          <g>
            <rect x="140" y="170" width="54" height="34" rx="12" fill={`url(#${id}lens)`} />
            <rect x="206" y="170" width="54" height="34" rx="12" fill={`url(#${id}lens)`} />
            <rect x="192" y="182" width="16" height="5" rx="2" fill="#1E1428" />
            <path d="M148 178 L170 178" stroke="#fff" strokeOpacity=".55" strokeWidth="4" strokeLinecap="round" />
            <path d="M214 178 L236 178" stroke="#fff" strokeOpacity=".55" strokeWidth="4" strokeLinecap="round" />
          </g>
        ) : (
          <g transform={`translate(0 186) scale(1 ${blink}) translate(0 -186)`}>
            <ellipse cx="172" cy="186" rx="9" ry="11" fill="#1E1428" />
            <ellipse cx="228" cy="186" rx="9" ry="11" fill="#1E1428" />
            <circle cx="175" cy="182" r="3" fill="#fff" />
            <circle cx="231" cy="182" r="3" fill="#fff" />
            <path d="M156 164 Q172 156 186 164" stroke={L.hair} strokeWidth="6" fill="none" strokeLinecap="round" />
            <path d="M214 164 Q228 156 244 164" stroke={L.hair} strokeWidth="6" fill="none" strokeLinecap="round" />
          </g>
        )}
        <path d="M196 200 Q200 222 194 228" stroke="#000" strokeOpacity=".18" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M176 238 Q200 256 226 236" stroke="#5A2230" strokeWidth="6" fill="none" strokeLinecap="round" />
        <ellipse cx="160" cy="224" rx="12" ry="7" fill="#FF8AE0" opacity=".35" />
        <ellipse cx="240" cy="224" rx="12" ry="7" fill="#FF8AE0" opacity=".35" />
        <circle cx="128" cy="218" r="5" fill="#FFD166" />
      </g>
    </svg>
  );
};

// ── 1. hook ────────────────────────────────────────────────
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const spark = prog(f, 0, 14, expoOut);
  const grow = prog(f, 6, 24, expoOut);
  return (
    <AbsoluteFill>
      <Ground f={f} />
      <div style={{position: 'absolute', left: 960 - 650, top: 540 - 650, width: 1300, height: 1300, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(210,60,255,0.25), transparent)', opacity: grow}} />
      <div style={{position: 'absolute', left: 1400, top: 300, transform: `scale(${lerp(0.05, 1, grow)})`, transformOrigin: '50% 90%', opacity: spark}}>
        <Sona size={380} f={f} id="ah" />
      </div>
      <div style={{position: 'absolute', left: 150, top: 230}}>
        <Kicker f={f} at={16}>Built on Solana · launch, lock, let it post</Kicker>
      </div>
      <div style={{position: 'absolute', left: 150, top: 320}}>
        <Head text="Every token" start={20} size={130} />
      </div>
      <div style={{position: 'absolute', left: 150, top: 470}}>
        <Head text="gets a persona." start={28} size={130} grad />
      </div>
      <Body f={f} at={52} style={{position: 'absolute', left: 150, top: 690, width: 1000}}>
        Launch a memecoin, lock its fee split on-chain, and give it an <span style={{color: CREAM}}>AI influencer with a face, a voice and a budget it can’t overspend.</span>
      </Body>
    </AbsoluteFill>
  );
};

// ── 3. five steps ──────────────────────────────────────────
const STEPS = [
  {t: 'Draft', d: 'Name the coin, pick platforms, choose the split.', s: 'Draft'},
  {t: 'Deploy', d: 'Your wallet launches it on pump.fun and locks the split.', s: 'Live on pump'},
  {t: 'Create influencer', d: 'One sentence becomes a face, voice and style.', s: 'Influencer created'},
  {t: 'Activate', d: 'The influencer’s page goes live.', s: 'Page live'},
  {t: 'Operate', d: 'It auto-posts twice a day, within its spending policy.', s: 'Posting 2× daily'},
];
const Steps: React.FC = () => {
  const f = useCurrentFrame();
  const at = (k: number) => 30 + k * 30;
  const cur = Math.max(0, Math.min(4, Math.floor((f - 30) / 30)));
  const face = prog(f, at(2), 18, expoOut);
  const posting = f >= at(4) + 8;
  return (
    <AbsoluteFill>
      <Ground f={f + 330} />
      <div style={{position: 'absolute', left: 150, top: 110}}>
        <Kicker f={f} at={2}>Token first</Kicker>
      </div>
      <div style={{position: 'absolute', left: 150, top: 180}}>
        <Head text="Five steps," start={4} size={96} />
      </div>
      <div style={{position: 'absolute', left: 150, top: 290}}>
        <Head text="in this order." start={10} size={96} grad />
      </div>
      {STEPS.map((s, k) => {
        const on = f >= at(k);
        const p = prog(f, 14 + k * 5, 14, expoOut);
        return (
          <div key={s.t} style={{position: 'absolute', left: 150, top: 450 + k * 108, width: 900, display: 'flex', alignItems: 'center', gap: 26, opacity: p * (on ? 1 : 0.45), transform: `translateX(${(1 - p) * -30}px)`}}>
            <div style={{width: 64, height: 64, borderRadius: 20, background: on ? GRAD : INK3, border: `1px solid ${on ? 'transparent' : LINE}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontWeight: 600, fontSize: 22, color: '#fff', flexShrink: 0, boxShadow: on && k === cur ? `0 0 30px ${FLAME}` : undefined}}>{`0${k + 1}`}</div>
            <div>
              <div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 36, color: CREAM, letterSpacing: '-0.01em'}}>{s.t}</div>
              <div style={{fontFamily: SANS, fontSize: 23, color: MUTE, marginTop: 4}}>{s.d}</div>
            </div>
          </div>
        );
      })}
      {/* the coin card evolving */}
      <Card style={{position: 'absolute', left: 1150, top: 170, width: 620, height: 780, padding: 40, boxSizing: 'border-box', opacity: prog(f, 10, 14), transform: `translateY(${(1 - prog(f, 10, 18, expoOut)) * 30}px)`}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{fontFamily: MONO, fontSize: 16, letterSpacing: '0.14em', color: DIM}}>SAMPLE COIN</div>
          <div style={{padding: '8px 14px', borderRadius: 999, background: posting ? 'rgba(76,242,194,0.15)' : INK3, border: `1px solid ${posting ? MINT : LINE}`, fontFamily: MONO, fontSize: 15, letterSpacing: '0.08em', color: posting ? MINT : LILAC}}>● {STEPS[cur].s.toUpperCase()}</div>
        </div>
        <div style={{position: 'relative', marginTop: 26, width: 540, height: 300, borderRadius: 18, overflow: 'hidden', border: `1px solid ${LINE}`}}>
          <Influencer name="Marlo" w={540} h={300} f={f} id="mcard" />
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, padding: '40px 22px 16px', background: 'linear-gradient(180deg, transparent, rgba(9,6,15,0.85))', display: 'flex', alignItems: 'baseline', gap: 14}}>
            <div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 44, color: CREAM}}>Marlo</div>
            <div style={{fontFamily: MONO, fontSize: 24, color: FLARE}}>$MARLO</div>
          </div>
          <div style={{position: 'absolute', right: 14, top: 14, padding: '6px 12px', borderRadius: 999, background: 'rgba(9,6,15,0.7)', border: `1px solid ${face > 0.5 ? MINT : LINE}`, fontFamily: MONO, fontSize: 14, letterSpacing: '0.08em', color: face > 0.5 ? MINT : LILAC}}>{face > 0.5 ? 'FACE ✓ VOICE ✓ STYLE ✓' : 'AI INFLUENCER'}</div>
        </div>
        <div style={{marginTop: 20, fontFamily: SANS, fontSize: 23, lineHeight: 1.45, color: MUTE}}>“A night-owl who rates every diner on the strip.”</div>
        <div style={{marginTop: 18, display: 'flex', gap: 10, opacity: prog(f, at(0) + 6, 12)}}>
          {['X', 'TikTok', 'Instagram'].map((p) => (
            <div key={p} style={{padding: '8px 16px', borderRadius: 10, background: INK3, border: `1px solid ${LINE}`, fontFamily: SANS, fontWeight: 600, fontSize: 20, color: CREAM}}>{p}</div>
          ))}
        </div>
        <div style={{position: 'absolute', left: 40, right: 40, bottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', borderRadius: 16, background: INK3, border: `1px solid ${posting ? MINT : LINE}`}}>
          <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 24, color: CREAM}}>Auto-posting <span style={{color: posting ? MINT : DIM, fontWeight: 500}}>· 2× daily</span></div>
          <div style={{width: 74, height: 40, borderRadius: 20, background: posting ? MINT : '#3A2C58', position: 'relative'}}>
            <div style={{position: 'absolute', top: 4, left: posting ? 38 : 4, width: 32, height: 32, borderRadius: 16, background: '#fff'}} />
          </div>
        </div>
      </Card>
    </AbsoluteFill>
  );
};

// ── 4. fee split ───────────────────────────────────────────
const SPLIT = [
  {v: 20, t: 'buys back and burns $PERSONA', n: 'fixed for every coin', c: 'linear-gradient(90deg, #FF4FB8, #FF8AE0)', tc: PINK},
  {v: 70, t: 'funds your AI', n: 'pays for its posts, clips and voice', c: 'linear-gradient(90deg, #8B3DFF, #D23CFF)', tc: LILAC},
  {v: 10, t: 'goes to you', n: 'the rest', c: 'linear-gradient(90deg, #4CF2C2, #9BFFE3)', tc: MINT},
];
const Fees: React.FC = () => {
  const f = useCurrentFrame();
  const BX = 150;
  const BWID = 1620;
  const lock = prog(f, 120, 14, expoOut);
  let acc = 0;
  return (
    <AbsoluteFill>
      <Ground f={f + 520} />
      <div style={{position: 'absolute', left: BX, top: 110}}>
        <Kicker f={f} at={2}>Fee split</Kicker>
      </div>
      <div style={{position: 'absolute', left: BX, top: 180}}>
        <Head text="Every creator fee, split." start={4} size={92} />
      </div>
      <div style={{position: 'absolute', left: BX, top: 360, width: BWID, height: 84, borderRadius: 22, overflow: 'hidden', display: 'flex', background: INK3, border: `1px solid ${LINE}`}}>
        {SPLIT.map((s, k) => (
          <div key={k} style={{width: `${s.v * prog(f, 24 + k * 14, 22, inOut)}%`, height: '100%', background: s.c, borderRight: k < 2 ? `3px solid ${INK}` : undefined}} />
        ))}
      </div>
      {SPLIT.map((s, k) => {
        const x = BX + (acc / 100) * BWID;
        acc += s.v;
        const p = prog(f, 36 + k * 14, 18, expoOut);
        const w = k === 0 ? 520 : k === 1 ? 640 : 380;
        const left = k === 2 ? BX + BWID - w : k === 1 ? BX + 560 : x;
        return (
          <div key={k} style={{position: 'absolute', left, top: 480, width: w, opacity: p, transform: `translateY(${(1 - p) * 20}px)`}}>
            <div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 110, lineHeight: 1, color: s.tc, letterSpacing: '-0.03em', textAlign: k === 2 ? 'right' : 'left'}}>{Math.round(s.v * prog(f, 36 + k * 14, 26, expoOut))}%</div>
            <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 32, color: CREAM, marginTop: 12, textAlign: k === 2 ? 'right' : 'left'}}>{s.t}</div>
            <div style={{fontFamily: SANS, fontSize: 24, color: DIM, marginTop: 6, textAlign: k === 2 ? 'right' : 'left'}}>{s.n}</div>
          </div>
        );
      })}
      <Card style={{position: 'absolute', left: BX, top: 800, width: BWID, padding: '28px 36px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 28, opacity: lock, transform: `translateY(${(1 - lock) * 16}px)`, border: `1px solid ${lock > 0.5 ? FLAME : LINE}`, boxShadow: `0 0 ${50 * lock}px -10px rgba(210,60,255,0.6)`}}>
        <div style={{fontSize: 52, transform: `scale(${lerp(1.6, 1, lock)})`}}>🔒</div>
        <div style={{flex: 1}}>
          <div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 36, color: CREAM}}>Locked forever, by your own wallet.</div>
          <div style={{fontFamily: SANS, fontSize: 24, color: MUTE, marginTop: 8}}>Set with pump.fun fee sharing at launch. Shares written once, admin revoked in the same transaction.</div>
        </div>
        <div style={{padding: '12px 18px', borderRadius: 12, background: 'rgba(76,242,194,0.12)', border: `1px solid ${MINT}`, fontFamily: MONO, fontSize: 18, color: MINT, whiteSpace: 'nowrap', opacity: prog(f, 140, 10)}}>LOCKED ON-CHAIN ✓</div>
      </Card>
    </AbsoluteFill>
  );
};

// ── 5. guardrails ──────────────────────────────────────────
const LOG = ['Observe', 'Plan', 'Authorize', 'Act', 'Reflect'];
const Guard: React.FC = () => {
  const f = useCurrentFrame();
  const used = prog(f, 30, 60, inOut) * 0.72;
  const req = prog(f, 70, 14, expoOut);
  const signed = f >= 112;
  return (
    <AbsoluteFill>
      <Ground f={f + 740} />
      <div style={{position: 'absolute', left: 150, top: 110}}>
        <Kicker f={f} at={2}>Well-governed AI</Kicker>
      </div>
      <div style={{position: 'absolute', left: 150, top: 180}}>
        <Head text="It can’t overspend." start={4} size={86} />
      </div>
      <div style={{position: 'absolute', left: 150, top: 290}}>
        <Head text="It posts twice a day." start={12} size={86} grad />
      </div>
      {/* spending policy */}
      <Card style={{position: 'absolute', left: 150, top: 450, width: 760, padding: '32px 36px', boxSizing: 'border-box', opacity: prog(f, 16, 14)}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 17, letterSpacing: '0.12em', color: LILAC}}>
          <span>📐 SPENDING POLICY</span>
          <span style={{color: DIM}}>DAILY · UTC</span>
        </div>
        <div style={{marginTop: 22, height: 18, borderRadius: 9, background: INK3, overflow: 'hidden'}}>
          <div style={{width: `${used * 100}%`, height: '100%', background: GRAD}} />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 12, fontFamily: SANS, fontSize: 22, color: MUTE}}>
          <span>Used today</span>
          <span style={{color: CREAM}}>{Math.round(used * 100)}% of limit</span>
        </div>
        <div style={{marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12}}>
          {['Per-generation cap', 'Monthly limit', 'Allowed services', 'Approval threshold'].map((t) => (
            <div key={t} style={{padding: '12px 16px', borderRadius: 12, background: INK3, fontFamily: SANS, fontSize: 21, color: CREAM}}>✓ {t}</div>
          ))}
        </div>
      </Card>
      {/* approval */}
      <Card style={{position: 'absolute', left: 980, top: 450, width: 790, padding: '30px 34px', boxSizing: 'border-box', opacity: req, transform: `translateY(${(1 - req) * 24}px)`, border: `1px solid ${signed ? MINT : FLAME}`}}>
        <div style={{fontFamily: MONO, fontSize: 16, letterSpacing: '0.12em', color: signed ? MINT : FLARE}}>{signed ? 'APPROVED · WALLET SIGNED' : 'APPROVAL NEEDED'}</div>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 34, color: CREAM, marginTop: 10}}>15s clip with voice line · $4.20</div>
        <div style={{fontFamily: SANS, fontSize: 22, color: MUTE, marginTop: 6}}>Above your approval threshold. Waiting for a signature.</div>
        <div style={{display: 'flex', gap: 12, marginTop: 20}}>
          <div style={{padding: '12px 24px', borderRadius: 12, background: signed ? MINT : GRAD, fontFamily: SANS, fontWeight: 700, fontSize: 22, color: INK}}>{signed ? 'Signed ✓' : 'Sign'}</div>
          <div style={{padding: '12px 24px', borderRadius: 12, border: `1px solid ${LINE}`, fontFamily: SANS, fontWeight: 600, fontSize: 22, color: MUTE}}>Deny</div>
        </div>
      </Card>
      <Card style={{position: 'absolute', left: 980, top: 718, width: 790, padding: '22px 34px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 22, opacity: prog(f, 120, 14)}}>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 28, color: CREAM, whiteSpace: 'nowrap'}}>⏰ Auto-post</div>
        {['AM post', 'PM post'].map((t, k) => {
          const done = f >= 140 + k * 18;
          return (
            <div key={t} style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', borderRadius: 12, background: INK3, border: `1px solid ${done ? MINT : LINE}`}}>
              <span style={{fontFamily: MONO, fontSize: 20, color: CREAM}}>{t}</span>
              <span style={{fontFamily: MONO, fontSize: 17, color: done ? MINT : DIM}}>{done ? 'POSTED ✓' : 'QUEUED'}</span>
            </div>
          );
        })}
      </Card>
      {/* agent log */}
      <div style={{position: 'absolute', left: 980, top: 858, width: 790, display: 'flex', gap: 10, alignItems: 'center'}}>
        {LOG.map((l, k) => {
          const on = prog(f, 20 + k * 14, 10, expoOut);
          return (
            <div key={l} style={{flex: 1, padding: '16px 0', textAlign: 'center', borderRadius: 14, background: INK3, border: `1px solid ${on > 0.5 ? LILAC : LINE}`, fontFamily: SANS, fontWeight: 600, fontSize: 20, color: on > 0.5 ? CREAM : DIM, opacity: 0.4 + 0.6 * on}}>{l}</div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 980, top: 938, fontFamily: SANS, fontSize: 23, color: DIM, opacity: prog(f, 90, 14)}}>Every step and its reasoning is public in the coin’s Agent log.</div>
      <div style={{position: 'absolute', left: 150, top: 840, width: 760, fontFamily: SANS, fontSize: 26, lineHeight: 1.45, color: MUTE, opacity: prog(f, 100, 14)}}>
        <span style={{color: CREAM, fontWeight: 700}}>⏰ Auto-posts 2× a day.</span> Every day, on schedule, within the spending policy.
      </div>
    </AbsoluteFill>
  );
};

// ── 6. scenes + sample posts ───────────────────────────────
const SCENES = ['🚶 Street walk', '🥊 Fight night', '🤳 Face cam', '🎤 Stage', '🪩 Dance', '✈️ Airport', '🚐 Road trip', '🏋️ Gym', '🎶 Karaoke booth', '🫧 3am laundromat', '🌇 Rooftop golden hour', '🍜 Ramen bar'];
const POSTS = [
  {p: 'X', n: 'Marlo', t: '$MARLO', a: '#8B3DFF', b: '#FF4FB8', c: '3am diner. the neon sign flickers in morse code and I am 80% sure it’s flirting with me.'},
  {p: 'TikTok', n: 'Juno', t: '$JUNO', a: '#25F4EE', b: '#8B3DFF', c: 'sunrise set from the dunes. the coyotes requested the remix.'},
  {p: 'Instagram', n: 'Bisou', t: '$BISOU', a: '#FF4F9A', b: '#FFD166', c: 'rated 14 croissants today. one made me emotional.'},
];
const Scenes: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Ground f={f + 930} />
      <div style={{position: 'absolute', left: 150, top: 110}}>
        <Kicker f={f} at={2}>Scenes</Kicker>
      </div>
      <div style={{position: 'absolute', left: 150, top: 180}}>
        <Head text="If a person can film it," start={4} size={80} />
      </div>
      <div style={{position: 'absolute', left: 150, top: 280}}>
        <Head text="your token can live it." start={12} size={80} grad />
      </div>
      {/* scene chips marquee */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 420, height: 70, overflow: 'hidden', opacity: prog(f, 20, 14)}}>
        <div style={{display: 'flex', gap: 14, transform: `translateX(${-f * 3 + 100}px)`, whiteSpace: 'nowrap'}}>
          {[...SCENES, ...SCENES].map((s, k) => (
            <div key={k} style={{padding: '14px 24px', borderRadius: 999, background: INK3, border: `1px solid ${LINE}`, fontFamily: SANS, fontWeight: 600, fontSize: 26, color: CREAM, flexShrink: 0}}>{s}</div>
          ))}
        </div>
      </div>
      {POSTS.map((p, k) => {
        const pr = prog(f, 36 + k * 12, 18, expoOut);
        return (
          <Card key={p.n} style={{position: 'absolute', left: 150 + k * 556, top: 540, width: 520, height: 380, padding: '28px 30px', boxSizing: 'border-box', opacity: pr, transform: `translateY(${(1 - pr) * 40}px) rotate(${(k - 1) * 1.2 * (1 - pr)}deg)`}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
                <div style={{width: 64, height: 64, borderRadius: 32, overflow: 'hidden', boxShadow: `0 0 0 3px ${INK}, 0 0 0 5px ${LINE}`, flexShrink: 0}}><Influencer name={p.n} w={64} h={64} f={f} id={`av${p.n}`} radius={32} /></div>
                <div>
                  <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 26, color: CREAM}}>{p.n}</div>
                  <div style={{fontFamily: MONO, fontSize: 17, color: FLARE}}>{p.t}</div>
                </div>
              </div>
              <div style={{fontFamily: MONO, fontSize: 15, letterSpacing: '0.1em', color: DIM}}>{p.p.toUpperCase()}</div>
            </div>
            <div style={{fontFamily: SANS, fontSize: 27, lineHeight: 1.45, color: CREAM, marginTop: 24}}>{p.c}</div>
            <div style={{position: 'absolute', left: 30, bottom: 26, display: 'flex', gap: 10}}>
              <span style={{padding: '6px 12px', borderRadius: 8, background: INK3, fontFamily: MONO, fontSize: 14, color: LILAC, letterSpacing: '0.08em'}}>SAMPLE</span>
            </div>
          </Card>
        );
      })}
      <div style={{position: 'absolute', left: 150, top: 960, fontFamily: SANS, fontSize: 24, color: DIM, opacity: prog(f, 80, 14)}}>Same character, new scene every post. Voice lines and clips post with sound on TikTok and Instagram.</div>
    </AbsoluteFill>
  );
};

// ── 7. finale ──────────────────────────────────────────────
const Finale: React.FC = () => {
  const f = useCurrentFrame();
  const m = prog(f, 4, 26, expoOut);
  return (
    <AbsoluteFill>
      <Ground f={f + 1120} />
      <div style={{position: 'absolute', left: 960 - 700, top: 0, width: 1400, height: 1000, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(210,60,255,0.28), transparent)', opacity: m}} />
      <div style={{position: 'absolute', left: 960 - 160, top: 90, opacity: m, transform: `scale(${lerp(0.6, 1, m)})`, transformOrigin: '50% 90%'}}>
        <Sona size={320} f={f} id="af" />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 500, textAlign: 'center', fontFamily: DISPLAY, fontWeight: 800, fontSize: 170, letterSpacing: '-0.04em', lineHeight: 1, opacity: prog(f, 20, 14), transform: `translateY(${(1 - prog(f, 20, 18, expoOut)) * 26}px)`}}>
        <span style={{color: CREAM}}>per</span>
        <span style={{backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent', paddingRight: 8}}>sona</span>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 710, textAlign: 'center', fontFamily: SANS, fontWeight: 600, fontSize: 44, color: MUTE, opacity: prog(f, 36, 14)}}>
        Launch it, lock the split, give it a face. <span style={{color: CREAM}}>Yours next.</span>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 820, display: 'flex', justifyContent: 'center', gap: 18, opacity: prog(f, 50, 12), transform: `translateY(${(1 - prog(f, 50, 14, expoOut)) * 14}px)`}}>
        <div style={{padding: '18px 32px', borderRadius: 999, backgroundImage: GRAD, fontFamily: DISPLAY, fontWeight: 800, fontSize: 36, color: '#fff'}}>$PERSONA</div>
        <div style={{padding: '18px 34px', borderRadius: 999, border: `1.5px solid ${CREAM}`, fontFamily: MONO, fontWeight: 600, fontSize: 34, letterSpacing: '0.06em', color: CREAM}}>PERSONAPUMP.FUN</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1010, textAlign: 'center', fontFamily: MONO, fontSize: 15, letterSpacing: '0.12em', color: DIM, opacity: prog(f, 64, 12)}}>
        CHARACTERS ARE FICTIONAL · AUTO-POSTS 2× DAILY · NOT FINANCIAL ADVICE
      </div>
    </AbsoluteFill>
  );
};

export const PersonaFilm: React.FC<{withAudio?: boolean}> = ({withAudio = true}) => (
  <AbsoluteFill style={{background: INK}}>
    <Sequence from={S.hook.from} durationInFrames={S.hook.dur} name="01 Every token gets a persona">
      <Cut dur={S.hook.dur}>
        <Hook />
      </Cut>
    </Sequence>
    <Sequence from={S.steps.from} durationInFrames={S.steps.dur} name="03 Five steps">
      <Cut dur={S.steps.dur}>
        <Steps />
      </Cut>
    </Sequence>
    <Sequence from={S.fees.from} durationInFrames={S.fees.dur} name="04 Fee split">
      <Cut dur={S.fees.dur}>
        <Fees />
      </Cut>
    </Sequence>
    <Sequence from={S.guard.from} durationInFrames={S.guard.dur} name="05 Guardrails">
      <Cut dur={S.guard.dur}>
        <Guard />
      </Cut>
    </Sequence>
    <Sequence from={S.scenes.from} durationInFrames={S.scenes.dur} name="06 Scenes + sample posts">
      <Cut dur={S.scenes.dur}>
        <Scenes />
      </Cut>
    </Sequence>
    <Sequence from={S.finale.from} durationInFrames={S.finale.dur} name="07 persona">
      <Cut dur={S.finale.dur} last>
        <Finale />
      </Cut>
    </Sequence>
    {withAudio && <Audio src={staticFile('persona-score.wav')} />}
  </AbsoluteFill>
);
