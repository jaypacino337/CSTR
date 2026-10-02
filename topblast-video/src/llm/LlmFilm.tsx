import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {expoIn, expoOut, inOut, lerp, prog} from '../theme';
import tl from './timeline.json';

// Local Language Model ($LLM) — HQ film. Site system: near-black ground, graphite
// panels, lime signal green, Space Grotesk caps + mono data. The "L" tile mark.
const BG = '#05070C';
const PANEL = '#0B1222';
const LINE = '#1C2A44';
const INK = '#FFFFFF';
const MUTED = '#9AA6BF';
const DIM = '#55627D';
const LIME = '#8FA8E8'; // accent: light navy for type + lines
const NAVY = '#1E3A8A';
const MINT = '#D4DEF5';
const HEAD = '"Space Grotesk", sans-serif';
const MONO = '"JetBrains Mono", monospace';
const S = tl.scenes;

const Ground: React.FC<{f: number}> = ({f}) => (
  <AbsoluteFill style={{background: BG}}>
    <AbsoluteFill style={{backgroundImage: `linear-gradient(${LINE}55 1px, transparent 1px), linear-gradient(90deg, ${LINE}55 1px, transparent 1px)`, backgroundSize: '80px 80px', backgroundPosition: `0px ${f * 0.4}px`, WebkitMaskImage: 'radial-gradient(ellipse at 50% 40%, #000 30%, transparent 80%)'}} />
    <div style={{position: 'absolute', left: 960 - 800, top: -500, width: 1600, height: 1000, background: 'radial-gradient(closest-side, rgba(40,72,170,0.28), transparent)'}} />
  </AbsoluteFill>
);

const Eyebrow: React.FC<{f: number; at: number; children: React.ReactNode; style?: React.CSSProperties}> = ({f, at, children, style}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 12, fontFamily: MONO, fontWeight: 500, fontSize: 18, letterSpacing: '0.18em', color: LIME, opacity: prog(f, at, 10), ...style}}>
    <span style={{width: 10, height: 10, background: LIME}} />
    {children}
  </div>
);

// caps headline, words slide up out of a mask
const Head: React.FC<{text: string; start: number; size: number; color?: string; align?: 'left' | 'center'; stagger?: number}> = ({text, start, size, color = INK, align = 'left', stagger = 3}) => {
  const f = useCurrentFrame();
  return (
    <div style={{display: 'flex', justifyContent: align === 'center' ? 'center' : 'flex-start', gap: size * 0.24, fontFamily: HEAD, fontWeight: 700, fontSize: size, lineHeight: 0.98, letterSpacing: '-0.03em', textTransform: 'uppercase', color, whiteSpace: 'nowrap'}}>
      {text.split(' ').map((w, i) => {
        const p = prog(f, start + i * stagger, 14, expoOut);
        return (
          <span key={i} style={{display: 'inline-block', overflow: 'hidden', paddingBottom: size * 0.08}}>
            <span style={{display: 'inline-block', transform: `translateY(${(1 - p) * 110}%)`}}>{w}</span>
          </span>
        );
      })}
    </div>
  );
};

// the server-cube logo
const Cube: React.FC<{size: number; glow?: number}> = ({size, glow = 0}) => (
  <div style={{position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    {glow > 0 && <div style={{position: 'absolute', inset: -size * 0.35, borderRadius: '50%', background: `radial-gradient(closest-side, rgba(170,205,255,${0.28 * glow}), rgba(30,58,138,${0.25 * glow}) 55%, transparent)`}} />}
    <Img src={staticFile('llm/cube.png')} style={{position: 'relative', height: size, width: (size * 1070) / 1207, filter: glow ? `drop-shadow(0 0 ${size * 0.06}px rgba(160,200,255,${0.6 * glow}))` : undefined}} />
  </div>
);

const Cut: React.FC<{dur: number; last?: boolean; children: React.ReactNode}> = ({dur, last, children}) => {
  const f = useCurrentFrame();
  const i = prog(f, 0, 14, expoOut);
  const o = last ? 0 : prog(f, dur - 12, 12, expoIn);
  return (
    <AbsoluteFill style={{opacity: Math.min(1, i * 1.4) * (1 - o), transform: `translateY(${(1 - i) * 30 - o * 30}px)`}}>
      {children}
    </AbsoluteFill>
  );
};

// ── 1. hook ────────────────────────────────────────────────
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const m = prog(f, 0, 18, expoOut);
  const lift = prog(f, 22, 16, inOut);
  const cmd = 'llm --run local';
  const typed = cmd.slice(0, Math.max(0, Math.floor((f - 58) * 0.9)));
  return (
    <AbsoluteFill>
      <Ground f={f} />
      <div style={{position: 'absolute', left: 960 - 160, top: lerp(380, 60, lift), transform: `scale(${lerp(0.5, 1, m) * lerp(1, 0.62, lift)})`, opacity: m}}>
        <Cube size={320} glow={1} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 400}}>
        <Head text="Your AI" start={26} size={170} align="center" />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 570}}>
        <Head text="should be local." start={32} size={170} color={LIME} align="center" />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 820, display: 'flex', justifyContent: 'center', opacity: prog(f, 54, 8)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '16px 26px', border: `1px solid ${LINE}`, background: PANEL, fontFamily: MONO, fontSize: 28, color: INK}}>
          <span style={{color: LIME}}>$</span>
          {typed}
          <span style={{width: 14, height: 30, background: LIME, opacity: Math.floor(f / 6) % 2 ? 1 : 0.2}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── 2. dedicated hardware ──────────────────────────────────
const Fan: React.FC<{size: number; spin: number}> = ({size, spin}) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100">
    <circle r={48} fill="#0A0B0D" stroke={LINE} strokeWidth={2} />
    <g transform={`rotate(${spin})`}>
      {[0, 1, 2, 3, 4, 5, 6].map((k) => (
        <path key={k} d="M0 -8 C 14 -14, 30 -26, 40 -16 C 30 -10, 16 -4, 6 0 Z" fill="#2A2E35" transform={`rotate(${(k * 360) / 7})`} />
      ))}
      <circle r={9} fill="#1D2026" stroke={LINE} />
    </g>
  </svg>
);
const Hardware: React.FC = () => {
  const f = useCurrentFrame();
  const total = Math.round(128 * prog(f, 40, 50, inOut));
  return (
    <AbsoluteFill>
      <Ground f={f + 130} />
      <div style={{position: 'absolute', left: 140, top: 100}}>
        <Eyebrow f={f} at={2}>DEDICATED GPU INFRASTRUCTURE</Eyebrow>
      </div>
      <div style={{position: 'absolute', left: 140, top: 146, display: 'flex', gap: 30}}>
        <Head text="Our hardware." start={4} size={96} />
        <Head text="Your workspace." start={12} size={96} color={LIME} />
      </div>
      {/* GPU rack */}
      {[0, 1, 2, 3].map((k) => {
        const p = prog(f, 16 + k * 6, 16, expoOut);
        const vram = prog(f, 36 + k * 5, 30, inOut);
        const spin = f * (14 + k * 2) * Math.min(1, p * 1.2);
        return (
          <div key={k} style={{position: 'absolute', left: 140, top: 330 + k * 150, width: 1060, height: 128, background: PANEL, border: `1px solid ${LINE}`, display: 'flex', alignItems: 'center', gap: 28, padding: '0 28px', boxSizing: 'border-box', opacity: p, transform: `translateX(${(1 - p) * -120}px)`}}>
            <Fan size={92} spin={spin} />
            <Fan size={92} spin={spin * 1.1} />
            <div style={{flex: 1}}>
              <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 20, color: INK, letterSpacing: '0.06em'}}>
                <span>GPU {k} · NVIDIA RTX 5090</span>
                <span style={{color: LIME}}>{Math.round(32 * vram)}GB</span>
              </div>
              <div style={{marginTop: 14, height: 14, background: '#0A0B0D', border: `1px solid ${LINE}`}}>
                <div style={{width: `${vram * 100}%`, height: '100%', background: `repeating-linear-gradient(90deg, ${NAVY} 0 10px, #2C4FB0 10px 12px)`}} />
              </div>
            </div>
            <div style={{width: 12, height: 12, borderRadius: 6, background: LIME, boxShadow: `0 0 12px ${LIME}`, opacity: 0.4 + 0.6 * (Math.sin(f / 3 + k) > 0 ? 1 : 0.3)}} />
          </div>
        );
      })}
      {/* totals */}
      <div style={{position: 'absolute', left: 1260, top: 330, width: 520, opacity: prog(f, 30, 14), transform: `translateY(${(1 - prog(f, 30, 16, expoOut)) * 30}px)`}}>
        <div style={{fontFamily: MONO, fontSize: 18, letterSpacing: '0.16em', color: MUTED}}>AGGREGATE VRAM</div>
        <div style={{fontFamily: HEAD, fontWeight: 700, fontSize: 210, lineHeight: 0.9, letterSpacing: '-0.05em', color: INK, marginTop: 10, fontVariantNumeric: 'tabular-nums'}}>
          {total}
          <span style={{fontSize: 90, color: LIME}}>GB</span>
        </div>
        <div style={{fontFamily: MONO, fontSize: 20, color: MUTED, marginTop: 10}}>4× RTX 5090 · 32GB EACH</div>
        <div style={{marginTop: 50, padding: '26px 28px', background: PANEL, border: `1px solid ${LINE}`, opacity: prog(f, 70, 14)}}>
          <div style={{fontFamily: MONO, fontSize: 16, letterSpacing: '0.16em', color: MUTED}}>HOST</div>
          <div style={{fontFamily: HEAD, fontWeight: 700, fontSize: 40, color: INK, marginTop: 8, letterSpacing: '-0.01em'}}>THREADRIPPER PRO</div>
          <div style={{fontFamily: MONO, fontSize: 20, color: LIME, marginTop: 6}}>256GB ECC MEMORY</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── 3. tokens → compute ────────────────────────────────────
const STEPS = ['HOLD $LLM', 'RECEIVE DAILY CREDITS', 'RUN LOCAL LLM', 'CREDITS CONSUMED'];
const Credits: React.FC = () => {
  const f = useCurrentFrame();
  const X0 = 140;
  const W = 1640;
  const SW = (W - 3 * 40) / 4;
  const run = prog(f, 40, 70, inOut);
  const at = (k: number) => 40 + k * 23;
  const credits = f < at(1) ? 0 : f < at(3) ? Math.round(1000 * prog(f, at(1), 16, expoOut)) : Math.round(1000 - 380 * prog(f, at(3), 20, inOut));
  return (
    <AbsoluteFill>
      <Ground f={f + 300} />
      <div style={{position: 'absolute', left: X0, top: 120}}>
        <Eyebrow f={f} at={2}>01 / COMPUTE ACCOUNT</Eyebrow>
      </div>
      <div style={{position: 'absolute', left: X0, top: 166}}>
        <Head text="Your tokens." start={4} size={150} />
      </div>
      <div style={{position: 'absolute', left: X0, top: 316}}>
        <Head text="Your compute." start={12} size={150} color={LIME} />
      </div>
      {/* pipeline */}
      <div style={{position: 'absolute', left: X0, top: 600, width: W, height: 4, background: LINE}}>
        <div style={{width: `${run * 100}%`, height: '100%', background: LIME, boxShadow: `0 0 16px ${LIME}`}} />
      </div>
      {STEPS.map((s, k) => {
        const on = f >= at(k);
        const p = prog(f, at(k) - 2, 12, expoOut);
        return (
          <div key={s} style={{position: 'absolute', left: X0 + k * (SW + 40), top: 640, width: SW, height: 190, padding: '26px 26px', boxSizing: 'border-box', background: on ? '#0F1E40' : PANEL, border: `1px solid ${on ? LIME : LINE}`, opacity: 0.35 + 0.65 * prog(f, 20 + k * 4, 12), transform: `translateY(${(1 - p) * 10}px)`}}>
            <div style={{fontFamily: MONO, fontSize: 18, color: on ? LIME : DIM, letterSpacing: '0.12em'}}>{`0${k + 1}`}</div>
            <div style={{fontFamily: HEAD, fontWeight: 700, fontSize: 40, lineHeight: 1.05, color: on ? INK : MUTED, marginTop: 14, letterSpacing: '-0.01em'}}>{s}</div>
          </div>
        );
      })}
      {/* balance */}
      <div style={{position: 'absolute', right: 140, top: 190, textAlign: 'right', opacity: prog(f, at(1), 10)}}>
        <div style={{fontFamily: MONO, fontSize: 18, letterSpacing: '0.16em', color: MUTED}}>DAILY CREDITS · EXAMPLE</div>
        <div style={{fontFamily: HEAD, fontWeight: 700, fontSize: 120, lineHeight: 1, color: INK, fontVariantNumeric: 'tabular-nums', marginTop: 8}}>{credits.toLocaleString('en-US')}</div>
      </div>
      <div style={{position: 'absolute', left: X0, top: 880, fontFamily: HEAD, fontWeight: 500, fontSize: 34, color: MUTED, opacity: prog(f, 110, 14)}}>
        Eligible holders claim a share of a <span style={{color: INK}}>funded daily pool.</span>
      </div>
    </AbsoluteFill>
  );
};

// ── 4. workspace ───────────────────────────────────────────
const PROMPT = 'Refactor my API client to stream responses.';
const REPLY = 'Sure. Here’s a streaming client using fetch and a ReadableStream reader. Each chunk is decoded and yielded as it arrives, so your UI can render tokens in real time…';
const Workspace: React.FC = () => {
  const f = useCurrentFrame();
  const p1 = Math.max(0, Math.floor((f - 24) * 1.6));
  const words = REPLY.split(' ');
  const r1 = Math.max(0, Math.floor((f - 64) * 0.75));
  const bal = Math.round(620 - Math.min(words.length, r1) * 1.7);
  return (
    <AbsoluteFill>
      <Ground f={f + 470} />
      <div style={{position: 'absolute', left: 140, top: 110}}>
        <Eyebrow f={f} at={2}>03 / LOCAL MODEL WORKSPACE</Eyebrow>
      </div>
      <div style={{position: 'absolute', left: 140, top: 156}}>
        <Head text="Chat. Code." start={4} size={130} />
      </div>
      <div style={{position: 'absolute', left: 140, top: 286}}>
        <Head text="Build." start={10} size={130} color={LIME} />
      </div>
      <div style={{position: 'absolute', left: 140, top: 470, width: 640, fontFamily: HEAD, fontWeight: 500, fontSize: 34, lineHeight: 1.35, color: MUTED, opacity: prog(f, 20, 14)}}>
        One balance for <span style={{color: INK}}>chat and API.</span>
      </div>
      {/* app window */}
      <div style={{position: 'absolute', left: 910, top: 140, width: 870, height: 800, background: PANEL, border: `1px solid ${LINE}`, boxShadow: '0 50px 120px -40px rgba(0,0,0,0.8)', opacity: prog(f, 6, 14), transform: `translateY(${(1 - prog(f, 6, 18, expoOut)) * 40}px)`}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, padding: '0 22px', borderBottom: `1px solid ${LINE}`}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <Cube size={39} />
            <div style={{fontFamily: MONO, fontSize: 16, letterSpacing: '0.12em', color: INK}}>LOCAL LANGUAGE MODEL</div>
          </div>
          <div style={{fontFamily: MONO, fontSize: 16, color: MUTED}}>
            CREDITS <span style={{color: LIME, fontVariantNumeric: 'tabular-nums'}}>{bal}</span>
          </div>
        </div>
        <div style={{padding: '30px 34px'}}>
          <div style={{display: 'flex', justifyContent: 'flex-end'}}>
            <div style={{maxWidth: 620, padding: '18px 22px', background: '#1E2329', border: `1px solid ${LINE}`, fontFamily: HEAD, fontSize: 28, color: INK, minHeight: 34}}>
              {PROMPT.slice(0, p1)}
              {p1 < PROMPT.length && <span style={{display: 'inline-block', width: 3, height: 30, background: LIME, marginLeft: 3, verticalAlign: 'middle'}} />}
            </div>
          </div>
          {f > 52 && (
            <div style={{marginTop: 30, display: 'flex', gap: 18}}>
              <Cube size={50} />
              <div style={{flex: 1, fontFamily: HEAD, fontSize: 27, lineHeight: 1.5, color: INK}}>
                {r1 === 0 ? <span style={{color: MUTED}}>thinking…</span> : words.slice(0, r1).join(' ')}
                {r1 > 0 && r1 < words.length && <span style={{display: 'inline-block', width: 12, height: 26, background: LIME, marginLeft: 6, verticalAlign: 'middle'}} />}
                {r1 > 8 && (
                  <div style={{marginTop: 22, padding: '18px 20px', background: '#0A0B0D', border: `1px solid ${LINE}`, fontFamily: MONO, fontSize: 19, lineHeight: 1.6, color: MINT, opacity: prog(f, 64 + 12, 10)}}>
                    <div><span style={{color: LIME}}>const</span> reader = res.body.getReader();</div>
                    <div><span style={{color: LIME}}>while</span> (true) {'{'}</div>
                    <div>&nbsp;&nbsp;<span style={{color: LIME}}>const</span> {'{'} done, value {'}'} = <span style={{color: LIME}}>await</span> reader.read();</div>
                    <div>&nbsp;&nbsp;<span style={{color: LIME}}>if</span> (done) <span style={{color: LIME}}>break</span>;</div>
                    <div>&nbsp;&nbsp;yield decoder.decode(value);</div>
                    <div>{'}'}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 70, borderTop: `1px solid ${LINE}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 22px', fontFamily: MONO, fontSize: 15, color: DIM, letterSpacing: '0.1em'}}>
          <span>PREVIEW · MODEL IN DEVELOPMENT</span>
          <span>METERED · ONE BALANCE</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── 5. finale ──────────────────────────────────────────────
const Finale: React.FC = () => {
  const f = useCurrentFrame();
  const m = prog(f, 40, 20, expoOut);
  return (
    <AbsoluteFill>
      <Ground f={f + 640} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 150}}>
        <Head text="Compute should come" start={2} size={120} align="center" />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 280}}>
        <Head text="with the token." start={10} size={120} color={LIME} align="center" />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 500, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 34, opacity: m, transform: `translateY(${(1 - m) * 30}px)`}}>
        <Cube size={202} glow={1} />
        <div style={{fontFamily: HEAD, fontWeight: 700, fontSize: 78, lineHeight: 0.95, letterSpacing: '-0.02em', color: INK}}>
          LOCAL LANGUAGE
          <br />
          MODEL
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 740, display: 'flex', justifyContent: 'center', gap: 20, opacity: prog(f, 56, 12), transform: `translateY(${(1 - prog(f, 56, 14, expoOut)) * 16}px)`}}>
        <div style={{padding: '18px 30px', background: NAVY, color: '#FFFFFF', border: `1.5px solid ${LIME}`, fontFamily: HEAD, fontWeight: 700, fontSize: 44, letterSpacing: '0.02em', lineHeight: 1}}>$LLM</div>
        <div style={{padding: '18px 34px', border: `1.5px solid ${INK}`, color: INK, fontFamily: MONO, fontWeight: 500, fontSize: 38, letterSpacing: '0.08em', lineHeight: 1.15}}>LOCALLM.FUN</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 880, textAlign: 'center', fontFamily: HEAD, fontWeight: 500, fontSize: 30, color: MUTED, opacity: prog(f, 66, 12)}}>
        Hold $LLM. Get credits. Run Local Language Model.
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1020, textAlign: 'center', fontFamily: MONO, fontSize: 14, letterSpacing: '0.12em', color: DIM, opacity: prog(f, 76, 12)}}>
        MODEL IN DEVELOPMENT · CREDITS ARE SERVICE USAGE, NOT RETURNS · NOT FINANCIAL ADVICE
      </div>
    </AbsoluteFill>
  );
};

export const LlmFilm: React.FC<{withAudio?: boolean}> = ({withAudio = true}) => (
  <AbsoluteFill style={{background: BG}}>
    <Sequence from={S.hook.from} durationInFrames={S.hook.dur} name="01 Your AI should be local">
      <Cut dur={S.hook.dur}>
        <Hook />
      </Cut>
    </Sequence>
    <Sequence from={S.hw.from} durationInFrames={S.hw.dur} name="02 Dedicated hardware">
      <Cut dur={S.hw.dur}>
        <Hardware />
      </Cut>
    </Sequence>
    <Sequence from={S.credits.from} durationInFrames={S.credits.dur} name="03 Your tokens. Your compute.">
      <Cut dur={S.credits.dur}>
        <Credits />
      </Cut>
    </Sequence>
    <Sequence from={S.work.from} durationInFrames={S.work.dur} name="04 Workspace">
      <Cut dur={S.work.dur}>
        <Workspace />
      </Cut>
    </Sequence>
    <Sequence from={S.finale.from} durationInFrames={S.finale.dur} name="05 Compute should come with the token">
      <Cut dur={S.finale.dur} last>
        <Finale />
      </Cut>
    </Sequence>
    {withAudio && <Audio src={staticFile('llm-score.wav')} />}
  </AbsoluteFill>
);
