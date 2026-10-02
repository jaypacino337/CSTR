import {AbsoluteFill, Audio, Sequence, random, staticFile, useCurrentFrame} from 'remotion';
import {FadeWords} from '../premium/ui';
import {expoIn, expoOut, inOut, keys, lerp, prog} from '../theme';
import tl from './timeline.json';

// zSOL — shielded SOL with proof of clean origin. Fully custom, site palette
// (dark ground, Solana purple→green, Zcash gold), Fraunces + IBM Plex.
const BG = '#0C0A14';
const SURF = '#14111E';
const INK = '#F0EBFA';
const DIM = '#B4AAC8';
const MUTED = '#7E7591';
const RULE = '#2A2340';
const PURPLE = '#B57BFF';
const PURPLE2 = '#9945FF';
const GREEN = '#14F195';
const GOLD = '#F4B728';
const RED = '#E5796B';
const GRAD = 'linear-gradient(100deg, #9945FF 0%, #14F195 100%)';
const GRAD_HERITAGE = 'linear-gradient(100deg, #F4B728 0%, #9945FF 55%, #14F195 100%)';
const SERIF = '"Fraunces Variable", Georgia, serif';
const SANS = '"IBM Plex Sans", sans-serif';
const MONO = '"IBM Plex Mono", monospace';
const S = tl.scenes;

const Ground: React.FC<{f: number}> = ({f}) => (
  <AbsoluteFill style={{background: BG}}>
    <div style={{position: 'absolute', left: -300, top: -400, width: 1400, height: 1200, background: 'radial-gradient(circle, rgba(153,69,255,0.16), transparent 60%)', transform: `translate(${Math.sin(f / 90) * 30}px, 0)`}} />
    <div style={{position: 'absolute', right: -300, bottom: -500, width: 1400, height: 1200, background: 'radial-gradient(circle, rgba(20,241,149,0.10), transparent 60%)', transform: `translate(${Math.cos(f / 110) * 30}px, 0)`}} />
    <AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(180,170,200,0.10) 1.2px, transparent 1.6px)', backgroundSize: '36px 36px', backgroundPosition: `${-f * 0.15}px 0px`}} />
  </AbsoluteFill>
);

const Mono: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{fontFamily: MONO, fontSize: 18, letterSpacing: '0.14em', color: DIM, ...style}}>{children}</div>
);

const Wordmark: React.FC<{size: number; style?: React.CSSProperties}> = ({size, style}) => (
  <div style={{fontFamily: SERIF, fontWeight: 600, fontSize: size, lineHeight: 1, letterSpacing: '-0.02em', ...style}}>
    <span style={{backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent'}}>z</span>
    <span style={{color: INK}}>SOL</span>
  </div>
);

const Push: React.FC<{dur: number; last?: boolean; origin?: string; children: React.ReactNode}> = ({dur, last, origin = '50% 50%', children}) => {
  const f = useCurrentFrame();
  const i = prog(f, 0, 16, expoOut);
  const o = last ? 0 : prog(f, dur - 12, 12, expoIn);
  return (
    <AbsoluteFill style={{opacity: Math.min(1, i * 1.3) * (1 - o), transform: `scale(${lerp(0.92, 1, i) * lerp(1, 1.3, o)})`, transformOrigin: origin, filter: i < 1 || o > 0 ? `blur(${(1 - i) * 10 + o * 12}px)` : undefined}}>
      {children}
    </AbsoluteFill>
  );
};

// ── 1. hook ───────────────────────────────────────────
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Ground f={f} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 170, display: 'flex', justifyContent: 'center', gap: 14, fontFamily: MONO, fontSize: 22, letterSpacing: '0.16em'}}>
        <span style={{color: GOLD, opacity: prog(f, 4, 14)}}>ZCASH</span>
        <span style={{color: DIM, opacity: prog(f, 10, 14)}}>PROVED PRIVATE MONEY WORKS</span>
        <span style={{color: MUTED, opacity: prog(f, 24, 10)}}>·</span>
        <span style={{color: GREEN, opacity: prog(f, 28, 14)}}>NOW ON SOLANA</span>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 300}}>
        <FadeWords segments="Prove where your money" start={40} size={104} font={SERIF} weight={600} tracking={-0.02} stagger={4} style={{color: INK}} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 420}}>
        <div style={{textAlign: 'center', fontFamily: SERIF, fontStyle: 'italic', fontWeight: 600, fontSize: 176, lineHeight: 1.05, letterSpacing: '-0.02em', backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent', opacity: prog(f, 60, 22, inOut), transform: `translateY(${(1 - prog(f, 60, 22, expoOut)) * 30}px)`, filter: `blur(${(1 - prog(f, 60, 22)) * 8}px)`}}>
          didn't
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 628}}>
        <FadeWords segments="come from." start={78} size={104} font={SERIF} weight={600} tracking={-0.02} stagger={4} style={{color: INK}} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 820}}>
        <FadeWords segments="Shielded SOL on Solana. Private, and provably clean." start={98} size={34} font={SANS} weight={400} stagger={2} style={{color: DIM}} />
      </div>
    </AbsoluteFill>
  );
};

// ── 2. flow: 1 SOL → 1 zSOL → 1 SOL, fresh address + proof ─────
const X3 = [360, 960, 1560];
const FY = 520;
const Pool: React.FC<{f: number; r: number; x: number; y: number; glow?: number}> = ({f, r, x, y, glow = 1}) => (
  <>
    <div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: r, border: `1.5px solid ${RULE}`, background: 'radial-gradient(circle, rgba(153,69,255,0.16), rgba(20,17,30,0.6) 70%)', boxShadow: `0 0 ${60 * glow}px rgba(153,69,255,${0.25 * glow})`}} />
    {new Array(40).fill(0).map((_, i) => {
      const a = random(`pa${i}`) * Math.PI * 2 + f * 0.004 * (random(`ps${i}`) > 0.5 ? 1 : -1);
      const d = r * (0.2 + random(`pd${i}`) * 0.7);
      return <div key={i} style={{position: 'absolute', left: x + Math.cos(a) * d - 4, top: y + Math.sin(a) * d - 4, width: 8, height: 8, borderRadius: 4, background: PURPLE, opacity: 0.35 + random(`po${i}`) * 0.4}} />;
    })}
  </>
);
const SolCoin: React.FC<{label: string; z?: boolean; size?: number}> = ({label, z, size = 120}) => (
  <div style={{width: size, height: size, borderRadius: size / 2, background: z ? BG : 'radial-gradient(circle at 35% 30%, #C89BFF, #9945FF 60%, #5A1FB0)', border: z ? '4px solid transparent' : `2px solid ${PURPLE}`, backgroundImage: z ? `linear-gradient(${BG}, ${BG}), ${GRAD}` : undefined, backgroundOrigin: 'border-box', backgroundClip: z ? 'padding-box, border-box' : undefined, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 30px ${z ? 'rgba(20,241,149,0.35)' : 'rgba(153,69,255,0.5)'}`, fontFamily: z ? SERIF : MONO, fontWeight: 600, fontSize: size * 0.22, color: INK, textAlign: 'center', lineHeight: 1.1}}>
    {label}
  </div>
);
const Flow: React.FC = () => {
  const f = useCurrentFrame();
  const st = prog(f, 6, 20, inOut);
  const t1 = prog(f, 28, 30, inOut); // wallet → pool
  const t2 = prog(f, 94, 30, inOut); // pool → fresh address
  const inPool = f >= 58 && f < 94;
  const x = t2 > 0 ? lerp(X3[1], X3[2], t2) : lerp(X3[0], X3[1], t1);
  const y = FY + (t2 > 0 ? -Math.sin(t2 * Math.PI) * 90 : -Math.sin(t1 * Math.PI) * 90);
  const proof = prog(f, 126, 16, expoOut);
  const eq = [
    {t: '1 SOL', at: 20, c: PURPLE},
    {t: '→', at: 40, c: MUTED},
    {t: '1 zSOL', at: 64, c: GREEN},
    {t: '→', at: 92, c: MUTED},
    {t: '1 SOL, fresh address + proof', at: 126, c: INK},
  ];
  const card = (i: number, title: string, sub: string, lit: boolean) => (
    <div style={{position: 'absolute', left: X3[i] - 150, top: FY + 150, width: 300, textAlign: 'center', opacity: st}}>
      <Mono style={{color: lit ? GREEN : MUTED, fontSize: 16}}>{`0${i + 1} · ${title}`}</Mono>
      <div style={{fontFamily: SANS, fontSize: 22, color: lit ? INK : MUTED, marginTop: 8}}>{sub}</div>
    </div>
  );
  return (
    <AbsoluteFill>
      <Ground f={f + 150} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 104}}>
        <FadeWords
          segments={[
            {text: 'Private, and ', color: INK},
            {text: 'provably clean.', color: GREEN},
          ]}
          start={4}
          size={76}
          font={SERIF}
          weight={600}
          tracking={-0.02}
          stagger={4}
        />
      </div>
      {/* rails */}
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: st}}>
        <line x1={X3[0]} x2={X3[2]} y1={FY} y2={FY} stroke={RULE} strokeWidth={2} strokeDasharray="4 10" />
        <line x1={X3[0]} x2={x} y1={FY} y2={FY} stroke="url(#fl)" strokeWidth={3} />
        <defs>
          <linearGradient id="fl" x1="0" x2="1">
            <stop offset="0" stopColor={PURPLE2} />
            <stop offset="1" stopColor={GREEN} />
          </linearGradient>
        </defs>
      </svg>
      {/* wallet */}
      <div style={{position: 'absolute', left: X3[0] - 120, top: FY - 90, width: 240, height: 180, borderRadius: 18, background: SURF, border: `1px solid ${RULE}`, opacity: st}}>
        <Mono style={{position: 'absolute', left: 20, top: 16, fontSize: 14}}>YOUR WALLET</Mono>
        <Mono style={{position: 'absolute', left: 20, bottom: 16, fontSize: 14, color: MUTED}}>7xKq…3fA</Mono>
      </div>
      {/* pool */}
      <div style={{opacity: st}}>
        <Pool f={f} r={170} x={X3[1]} y={FY} glow={inPool ? 1.6 : 1} />
        <Mono style={{position: 'absolute', left: X3[1] - 150, top: FY - 220, width: 300, textAlign: 'center', fontSize: 15, color: PURPLE}}>SHIELDED POOL</Mono>
        {f >= 58 && (
          <Mono style={{position: 'absolute', left: X3[1] - 200, top: FY - 256, width: 400, textAlign: 'center', fontSize: 14, color: GREEN, opacity: prog(f, 58, 8) * (1 - prog(f, 90, 8))}}>
            COMMITMENT PUBLISHED · 0x9f3c…a71e
          </Mono>
        )}
      </div>
      {/* fresh address */}
      <div style={{position: 'absolute', left: X3[2] - 120, top: FY - 90, width: 240, height: 180, borderRadius: 18, background: SURF, border: `1px solid ${proof > 0.5 ? GREEN : RULE}`, boxShadow: proof > 0.5 ? '0 0 30px rgba(20,241,149,0.25)' : undefined, opacity: st}}>
        <Mono style={{position: 'absolute', left: 20, top: 16, fontSize: 14}}>FRESH ADDRESS</Mono>
        <Mono style={{position: 'absolute', left: 20, bottom: 16, fontSize: 14, color: MUTED}}>Hn2w…9QeT</Mono>
      </div>
      {/* the coin */}
      <div style={{position: 'absolute', left: x - 60, top: y - 60, opacity: st}}>
        <SolCoin label={inPool ? '1 zSOL' : '◎ 1'} z={inPool} />
      </div>
      {/* proof badge */}
      <div style={{position: 'absolute', left: X3[2] - 150, top: FY - 160, width: 300, display: 'flex', justifyContent: 'center', opacity: proof, transform: `translateY(${(1 - proof) * 14}px) scale(${lerp(0.9, 1, proof)})`}}>
        <div style={{fontFamily: MONO, fontWeight: 600, fontSize: 16, letterSpacing: '0.12em', color: BG, background: GREEN, padding: '10px 16px', borderRadius: 10, boxShadow: `0 0 26px rgba(20,241,149,0.5)`}}>ZK PROOF ✓ NOT FLAGGED</div>
      </div>
      {card(0, 'DEPOSIT', 'Send SOL, publish a commitment', f >= 20)}
      {card(1, 'SHIELD', 'Mint zSOL inside the pool', f >= 58)}
      {card(2, 'WITHDRAW + PROOF', 'Fresh address, clean origin', f >= 126)}
      <div style={{position: 'absolute', left: 0, right: 0, top: 920, display: 'flex', justifyContent: 'center', gap: 22, fontFamily: MONO, fontWeight: 600, fontSize: 34}}>
        {eq.map((e) => (
          <span key={e.t + e.at} style={{color: e.c, opacity: prog(f, e.at, 12), transform: `translateY(${(1 - prog(f, e.at, 12, expoOut)) * 10}px)`, display: 'inline-block'}}>
            {e.t}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ── 3. association set + nullifier ─────────────────────────
const COLS = 14;
const ROWS = 9;
const FLAGGED = new Set([5, 19, 33, 47, 58, 71, 88, 101, 114]);
const MINE = 64;
const SetScene: React.FC = () => {
  const f = useCurrentFrame();
  const GX = 820;
  const GY = 250;
  const STEP = 70;
  const wave = (i: number) => prog(f, 36 + ((i % COLS) + Math.floor(i / COLS)) * 1.6, 12, inOut);
  const mine = Math.min(prog(f, 84, 10), 1 - prog(f, 112, 14));
  const hl1 = 1 - prog(f, 104, 12);
  const nul = prog(f, 140, 16, expoOut);
  return (
    <AbsoluteFill>
      <Ground f={f + 300} />
      {/* headline swaps */}
      <div style={{position: 'absolute', left: 120, top: 250, width: 640, opacity: hl1}}>
        <div style={{fontFamily: SERIF, fontWeight: 600, fontSize: 72, lineHeight: 1.05, color: INK, opacity: prog(f, 6, 16), letterSpacing: '-0.02em'}}>
          Choose your
          <br />
          <span style={{fontStyle: 'italic', backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent'}}>association set.</span>
        </div>
        <Mono style={{marginTop: 26, fontSize: 17, lineHeight: 1.6, opacity: prog(f, 20, 14)}}>A PUBLISHED LIST OF DEPOSITS SOMEBODY VOUCHES FOR.</Mono>
      </div>
      <div style={{position: 'absolute', left: 120, top: 250, width: 640, opacity: prog(f, 108, 14) * (1 - prog(f, 136, 10))}}>
        <div style={{fontFamily: SERIF, fontWeight: 600, fontSize: 72, lineHeight: 1.05, color: INK, letterSpacing: '-0.02em'}}>
          Prove you're in it.
          <br />
          <span style={{fontStyle: 'italic', color: GREEN}}>Not which one.</span>
        </div>
      </div>
      <div style={{position: 'absolute', left: 120, top: 250, width: 640, opacity: prog(f, 140, 14)}}>
        <div style={{fontFamily: SERIF, fontWeight: 600, fontSize: 72, lineHeight: 1.05, color: INK, letterSpacing: '-0.02em'}}>
          The nullifier
          <br />
          <span style={{fontStyle: 'italic', color: GOLD}}>closes it.</span>
        </div>
      </div>
      {/* legend */}
      <div style={{position: 'absolute', left: 120, top: 560, display: 'flex', flexDirection: 'column', gap: 16, opacity: prog(f, 56, 14) * (1 - prog(f, 136, 10))}}>
        <Mono style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <span style={{width: 16, height: 16, borderRadius: 8, background: PURPLE, boxShadow: `0 0 10px ${PURPLE}`}} /> IN YOUR ASSOCIATION SET
        </Mono>
        <Mono style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <span style={{width: 16, height: 16, borderRadius: 8, border: `2px solid ${RED}`}} /> FLAGGED DEPOSIT — OUTSIDE YOUR SET
        </Mono>
        <Mono style={{display: 'flex', alignItems: 'center', gap: 14, opacity: mine > 0 ? 1 : 0.4}}>
          <span style={{width: 16, height: 16, borderRadius: 8, background: GOLD}} /> YOUR DEPOSIT — PRIVATE
        </Mono>
      </div>
      {/* nullifier card */}
      <div style={{position: 'absolute', left: 120, top: 520, width: 620, padding: '26px 30px', borderRadius: 18, background: SURF, border: `1px solid ${GOLD}55`, opacity: nul, transform: `translateY(${(1 - nul) * 16}px)`}}>
        <Mono style={{fontSize: 15, color: GOLD}}>NULLIFIER REVEALED</Mono>
        <div style={{fontFamily: MONO, fontWeight: 600, fontSize: 30, color: INK, marginTop: 10}}>0x3a7d…e1c9</div>
        <Mono style={{marginTop: 16, fontSize: 16, lineHeight: 1.6}}>
          NEVER WITHDRAWN BEFORE ✓
          <br />
          <span style={{color: MUTED}}>NO DOUBLE SPENDS. NO LINK TO WHICH DEPOSIT.</span>
        </Mono>
      </div>
      <Mono style={{position: 'absolute', left: GX, top: GY - 60, fontSize: 15, color: PURPLE, opacity: prog(f, 4, 12)}}>DEPOSIT POOL · 126 COMMITMENTS</Mono>
      {new Array(COLS * ROWS).fill(0).map((_, i) => {
        const cx = GX + (i % COLS) * STEP + (Math.floor(i / COLS) % 2 ? STEP / 2 : 0);
        const cy = GY + Math.floor(i / COLS) * STEP;
        const inP = prog(f, 2 + (i % 17) * 0.8, 12);
        const flagged = FLAGGED.has(i);
        const w = wave(i);
        const isMine = i === MINE;
        const spent = isMine && nul > 0.5;
        return (
          <div key={i} style={{position: 'absolute', left: cx - 11, top: cy - 11, width: 22, height: 22, borderRadius: 11, opacity: inP * (flagged ? 1 : 0.35 + 0.65 * w), background: flagged ? 'transparent' : isMine && mine > 0 ? GOLD : w > 0.5 ? PURPLE : '#3A3350', border: flagged ? `2px solid ${w > 0.5 ? RED : '#5A5270'}` : 'none', boxShadow: isMine && mine > 0 ? `0 0 ${24 * mine}px ${GOLD}` : w > 0.5 && !flagged ? `0 0 8px rgba(181,123,255,0.5)` : undefined, transform: `scale(${flagged && w > 0.5 ? 0.85 : 1})`}}>
            {spent && <div style={{position: 'absolute', inset: -10, borderRadius: 21, border: `2px solid ${GOLD}`, opacity: nul}} />}
          </div>
        );
      })}
      {mine > 0 && (
        <Mono style={{position: 'absolute', left: GX + (MINE % COLS) * STEP + (Math.floor(MINE / COLS) % 2 ? STEP / 2 : 0) - 80, top: GY + Math.floor(MINE / COLS) * STEP - 50, width: 160, textAlign: 'center', fontSize: 14, color: GOLD, opacity: mine}}>YOUR DEPOSIT</Mono>
      )}
    </AbsoluteFill>
  );
};

// ── 4. not a mixer ─────────────────────────────────────────
const ROWS_CMP = [
  {k: 'Hides your transaction graph', m: 'Yes', z: 'Yes', mOk: true},
  {k: "Proves funds aren't from a hack", m: 'No — impossible by design', z: 'Yes, in zero knowledge', mOk: false},
  {k: 'An exchange can accept the withdrawal', m: 'Typically refused', z: 'The proof is the evidence', mOk: false},
  {k: 'Value to someone laundering a hack', m: "High — that's the problem", z: "None. They can't produce the proof", mOk: false},
];
const Mixer: React.FC = () => {
  const f = useCurrentFrame();
  const X0 = 120;
  const W = 1680;
  return (
    <AbsoluteFill>
      <Ground f={f + 480} />
      <div style={{position: 'absolute', left: X0, top: 110}}>
        <FadeWords
          segments={[
            {text: 'Why zSOL ', color: INK},
            {text: "isn't a mixer.", color: PURPLE},
          ]}
          start={2}
          size={84}
          font={SERIF}
          weight={600}
          tracking={-0.02}
          align="left"
          stagger={4}
        />
      </div>
      <div style={{position: 'absolute', left: X0, top: 270, width: W, display: 'flex', fontFamily: MONO, fontSize: 18, letterSpacing: '0.14em', opacity: prog(f, 12, 12)}}>
        <div style={{flex: 1.4}} />
        <div style={{flex: 1, color: MUTED}}>MIXER</div>
        <div style={{flex: 1.25, color: GREEN}}>zSOL</div>
      </div>
      {ROWS_CMP.map((r, i) => {
        const p = prog(f, 20 + i * 14, 16, expoOut);
        return (
          <div key={r.k} style={{position: 'absolute', left: X0, top: 320 + i * 120, width: W, height: 104, display: 'flex', alignItems: 'center', borderTop: `1px solid ${RULE}`, opacity: p, transform: `translateY(${(1 - p) * 20}px)`}}>
            <div style={{flex: 1.4, fontFamily: SANS, fontWeight: 600, fontSize: 30, color: INK}}>{r.k}</div>
            <div style={{flex: 1, fontFamily: SANS, fontSize: 28, color: r.mOk ? DIM : RED}}>{r.m}</div>
            <div style={{flex: 1.25, fontFamily: SANS, fontWeight: 600, fontSize: 28, color: GREEN, display: 'flex', alignItems: 'center', gap: 12}}>
              <span style={{flexShrink: 0, width: 26, height: 26, borderRadius: 13, background: 'rgba(20,241,149,0.15)', border: `1.5px solid ${GREEN}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 16}}>✓</span>
              {r.z}
            </div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: X0, top: 830, width: W, borderTop: `1px solid ${RULE}`}} />
      <div style={{position: 'absolute', left: X0, top: 870}}>
        <FadeWords segments="A thief can deposit. They can never withdraw with a proof anyone accepts." start={86} size={32} font={SANS} weight={400} align="left" stagger={1.5} style={{color: DIM}} />
      </div>
    </AbsoluteFill>
  );
};

// ── 5. close ───────────────────────────────────────────────
const Finale: React.FC = () => {
  const f = useCurrentFrame();
  const mark = prog(f, 6, 30, expoOut);
  return (
    <AbsoluteFill>
      <Ground f={f + 620} />
      <div style={{position: 'absolute', left: 960 - 520, top: 180, width: 1040, height: 520, background: 'radial-gradient(ellipse, rgba(153,69,255,0.22), transparent 60%)', opacity: mark}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 230, display: 'flex', justifyContent: 'center', opacity: mark, transform: `translateY(${(1 - mark) * 30}px)`, filter: mark < 1 ? `blur(${(1 - mark) * 10}px)` : undefined}}>
        <Wordmark size={250} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 520}}>
        <FadeWords segments="Privacy, brought home." start={30} size={76} font={SERIF} weight={600} tracking={-0.01} stagger={5} style={{color: INK, fontStyle: 'italic'}} />
      </div>
      <Mono style={{position: 'absolute', left: 0, right: 0, top: 640, textAlign: 'center', fontSize: 20, letterSpacing: '0.24em', opacity: prog(f, 52, 16)}}>
        SHIELDED SOL <span style={{color: PURPLE}}>·</span> ASSOCIATION-SET PRIVACY <span style={{color: PURPLE}}>·</span> PROOF OF CLEAN ORIGIN
      </Mono>
      <div style={{position: 'absolute', left: 0, right: 0, top: 730, display: 'flex', justifyContent: 'center', opacity: prog(f, 66, 16, expoOut), transform: `translateY(${(1 - prog(f, 66, 16, expoOut)) * 14}px)`}}>
        <div style={{padding: 3, borderRadius: 999, backgroundImage: GRAD_HERITAGE}}>
          <div style={{padding: '16px 44px', borderRadius: 999, background: BG, fontFamily: MONO, fontWeight: 600, fontSize: 32, letterSpacing: '0.14em', color: INK}}>ZSOL.FUN</div>
        </div>
      </div>
      <Mono style={{position: 'absolute', left: 0, right: 0, top: 900, textAlign: 'center', fontSize: 15, color: MUTED, opacity: prog(f, 84, 16)}}>
        PROTOCOL DESIGN · NOT YET DEPLOYED OR AUDITED · POWERED BY <span style={{color: DIM}}>STONK</span>
      </Mono>
    </AbsoluteFill>
  );
};

export const ZsolFilm: React.FC<{withAudio?: boolean}> = ({withAudio = true}) => (
  <AbsoluteFill style={{background: BG}}>
    <Sequence from={S.hook.from} durationInFrames={S.hook.dur} name="01 Prove where your money didn't come from">
      <Push dur={S.hook.dur}>
        <Hook />
      </Push>
    </Sequence>
    <Sequence from={S.flow.from} durationInFrames={S.flow.dur} name="02 1 SOL → 1 zSOL → 1 SOL + proof">
      <Push dur={S.flow.dur} origin={`${X3[1]}px ${FY}px`}>
        <Flow />
      </Push>
    </Sequence>
    <Sequence from={S.set.from} durationInFrames={S.set.dur} name="03 Association set + nullifier">
      <Push dur={S.set.dur}>
        <SetScene />
      </Push>
    </Sequence>
    <Sequence from={S.mixer.from} durationInFrames={S.mixer.dur} name="04 Not a mixer">
      <Push dur={S.mixer.dur}>
        <Mixer />
      </Push>
    </Sequence>
    <Sequence from={S.finale.from} durationInFrames={S.finale.dur} name="05 zSOL">
      <Push dur={S.finale.dur} last>
        <Finale />
      </Push>
    </Sequence>
    {withAudio && <Audio src={staticFile('zsol-score.wav')} />}
  </AbsoluteFill>
);

export {keys};
