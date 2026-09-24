import {AbsoluteFill, Audio, Sequence, random, staticFile, useCurrentFrame} from 'remotion';
import {FadeWords} from '../premium/ui';
import {DISPLAY, MONO, UI, expoIn, expoOut, inOut, keys, lerp, prog} from '../theme';
import {Coin3D} from './Coin';
import {How, Pumpios} from './IpoHype';
import tl from './custom-timeline.json';

// IPO — fully custom motion piece (no key-art images). White grid world,
// black type, neon green. Shared objects carry the story between beats.
const BG = '#F6F6F4';
const INK = '#0B0B0B';
const GRAY = '#6F6F6A';
const LIME = '#7CF21A';
const LIME_D = '#4DB80A';
const S = tl.scenes;

const Grid: React.FC<{f: number}> = ({f}) => (
  <AbsoluteFill
    style={{
      backgroundImage: 'linear-gradient(rgba(0,0,0,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.055) 1px, transparent 1px)',
      backgroundSize: '140px 140px',
      backgroundPosition: `${-f * 0.2}px 0px`,
    }}
  />
);

const Header: React.FC<{o: number}> = ({o}) => (
  <div style={{position: 'absolute', left: 120, right: 120, top: 64, display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: o, fontFamily: MONO, fontWeight: 700, fontSize: 18, letterSpacing: '0.16em', color: INK}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
      <span style={{fontFamily: DISPLAY, fontWeight: 900, fontStretch: '125%', fontSize: 34, letterSpacing: 0, color: LIME}}>IPO</span>
      <span style={{width: 1, height: 30, background: INK, opacity: 0.4}} />
      <span>SOLANA LAUNCHPAD</span>
    </div>
    <div style={{display: 'flex', gap: 22}}>
      BUILD <span style={{color: LIME_D}}>›</span> LAUNCH <span style={{color: LIME_D}}>›</span> GROW
    </div>
  </div>
);

const Wordmark: React.FC<{size: number; reveal: number}> = ({size, reveal}) => (
  <div style={{position: 'relative', display: 'inline-block', clipPath: `inset(-20% ${(1 - reveal) * 100}% -20% 0)`}}>
    <div style={{position: 'absolute', left: size * 0.02, top: -size * 0.1, width: size * 0.3, height: size * 0.17, background: LIME, transform: 'skewY(-6deg)'}} />
    <div style={{fontFamily: DISPLAY, fontWeight: 900, fontStretch: '125%', fontSize: size, lineHeight: 0.9, color: INK, letterSpacing: '-0.01em'}}>IPO</div>
  </div>
);

/** Glowing polyline with nodes, drawn by `p`. */
const Line: React.FC<{pts: [number, number][]; p: number; width?: number; nodes?: boolean}> = ({pts, p, width = 4, nodes = true}) => {
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ');
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <path d={d} pathLength={1} fill="none" stroke={LIME} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${p} 1`} style={{filter: `drop-shadow(0 0 10px ${LIME})`}} />
      {nodes &&
        pts.slice(1).map(([x, y], i) => (p > (i + 1) / (pts.length - 1) - 0.02 ? <circle key={i} cx={x} cy={y} r={9} fill={LIME} style={{filter: `drop-shadow(0 0 10px ${LIME})`}} /> : null))}
    </svg>
  );
};

// ── 1+2. opener → flow (one continuous scene; the coin carries it) ──
const RISE: [number, number][] = [
  [860, 980], [1060, 900], [1240, 820], [1380, 700], [1520, 560], [1640, 380], [1780, 120],
];
const FLOW_Y = 620;
const NODES = [300, 960, 1620];
const STEPS = ['SET THE TERMS.', 'OPEN THE PRESALE.', 'GO LIVE AFTER.'];
const STEP_AT = [112, 144, 178];

const Open: React.FC = () => {
  const f = useCurrentFrame();
  // opener
  const coinIn = prog(f, 0, 40, expoOut);
  const spin = lerp(620, 18, coinIn) + Math.sin(f / 20) * 6;
  const line1 = prog(f, 8, 50, inOut);
  const text1Out = prog(f, 86, 14, inOut);
  // the coin shrinks and becomes the traveller on the flow line
  const shrink = prog(f, 90, 20, inOut);
  const nodeIdx = keys(f, [112, 136, 150, 170, 184], [0, 0, 1, 1, 2], inOut);
  const coinX = lerp(1500, lerp(NODES[0], NODES[2], nodeIdx / 2), shrink);
  const coinY = lerp(480, FLOW_Y, shrink);
  const coinSize = lerp(500, 130, shrink);
  const flowIn = prog(f, 98, 22, inOut);
  const exit = prog(f, 192, 14, expoIn);

  return (
    <AbsoluteFill style={{background: BG, overflow: 'hidden'}}>
      <Grid f={f} />
      <AbsoluteFill style={{transform: `scale(${1 + exit * 0.35})`, transformOrigin: `${NODES[2]}px ${FLOW_Y}px`, filter: exit > 0 ? `blur(${exit * 10}px)` : undefined, opacity: 1 - exit}}>
        {/* opener */}
        <div style={{opacity: 1 - text1Out}}>
          <Line pts={RISE} p={line1} />
          <div style={{position: 'absolute', left: 120, top: 250}}>
            <Wordmark size={250} reveal={prog(f, 4, 18, expoOut)} />
          </div>
          <div style={{position: 'absolute', left: 120, top: 530}}>
            <FadeWords segments="PRESALE LAUNCHPAD" start={16} size={82} font={DISPLAY} weight={900} stretch={115} tracking={-0.01} align="left" stagger={3} style={{color: INK}} />
          </div>
          <div style={{position: 'absolute', left: 120, top: 618}}>
            <FadeWords segments="ON SOLANA." start={22} size={82} font={DISPLAY} weight={900} stretch={115} tracking={-0.01} align="left" style={{color: INK}} />
          </div>
          <div style={{position: 'absolute', left: 120, top: 736}}>
            <FadeWords segments="Raise before launch." start={34} size={52} font={UI} weight={400} align="left" stagger={3} style={{color: GRAY}} />
          </div>
        </div>
        <Header o={prog(f, 30, 14)} />

        {/* flow line */}
        <div style={{opacity: flowIn}}>
          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
            <line x1={NODES[0]} x2={NODES[2]} y1={FLOW_Y} y2={FLOW_Y} stroke="rgba(0,0,0,0.1)" strokeWidth={4} />
            <line x1={NODES[0]} x2={lerp(NODES[0], NODES[2], nodeIdx / 2)} y1={FLOW_Y} y2={FLOW_Y} stroke={LIME} strokeWidth={5} style={{filter: `drop-shadow(0 0 10px ${LIME})`}} />
          </svg>
          {NODES.map((x, i) => {
            const on = f >= STEP_AT[i];
            return (
              <div key={x}>
                <div style={{position: 'absolute', left: x - 26, top: FLOW_Y - 26, width: 52, height: 52, borderRadius: 26, border: `3px solid ${on ? LIME_D : 'rgba(0,0,0,0.15)'}`, background: BG, boxShadow: on ? `0 0 24px ${LIME}` : undefined}} />
                <div style={{position: 'absolute', left: x - 200, width: 400, top: FLOW_Y + 110, textAlign: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: '0.16em', color: on ? INK : 'rgba(0,0,0,0.3)'}}>
                  0{i + 1} · {['TERMS', 'PRESALE', 'LIVE'][i]}
                </div>
              </div>
            );
          })}
          {STEPS.map((t, i) => (
            <div key={t} style={{position: 'absolute', left: 0, right: 0, top: 250}}>
              <FadeWords
                segments={[{text: t, color: i === 2 ? LIME_D : INK}]}
                start={STEP_AT[i] - 4}
                size={130}
                font={UI}
                weight={800}
                tracking={-0.03}
                stagger={3}
                exitAt={i < 2 ? STEP_AT[i + 1] - 8 : undefined}
                exitDur={8}
              />
            </div>
          ))}
        </div>

        {/* the coin */}
        <div style={{position: 'absolute', left: coinX - coinSize / 2, top: coinY - coinSize / 2, opacity: Math.min(1, coinIn * 1.5), filter: coinIn < 1 ? `blur(${(1 - coinIn) * 10}px)` : undefined, transform: `scale(${lerp(0.4, 1, coinIn)})`}}>
          <Coin3D size={coinSize} rotY={spin + shrink * 340 + nodeIdx * 180} rotX={lerp(-8, 0, shrink)} glow={1.2} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── 4. why: the first-block race vs one clear entry ─────────────
const Gate: React.FC = () => {
  const f = useCurrentFrame();
  const lines = [
    {t: 'NO FIRST-BLOCK RACE.', at: 6, c: INK},
    {t: 'NO HIDDEN STRUCTURE.', at: 22, c: INK},
    {t: 'ONE CLEAR ENTRY.', at: 40, c: LIME_D},
  ];
  const calm = prog(f, 36, 30, inOut);
  const GX = 1600;
  const GY = 560;
  const n = 34;
  return (
    <AbsoluteFill style={{background: BG, overflow: 'hidden'}}>
      <Grid f={f + 330} />
      <Header o={1} />
      {lines.map((l, i) => {
        const p = prog(f, l.at, 16, expoOut);
        return (
          <div key={l.t} style={{position: 'absolute', left: 120, top: 250 + i * 118, opacity: p, transform: `translateY(${(1 - p) * 24}px)`, fontFamily: UI, fontWeight: 800, fontSize: 80, letterSpacing: '-0.03em', color: l.c, whiteSpace: 'nowrap'}}>
            {l.t}
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 120, top: 630}}>
        <FadeWords segments="Everyone enters through the same presale." start={56} size={40} font={UI} weight={400} align="left" stagger={2} style={{color: GRAY}} />
      </div>
      {/* chaos: "block 0" race line fades out */}
      <div style={{position: 'absolute', left: GX - 30, top: 250, width: 3, height: 620, background: 'rgba(0,0,0,0.25)', opacity: 1 - calm}} />
      <div style={{position: 'absolute', left: GX - 110, top: 214, width: 160, textAlign: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 16, letterSpacing: '0.16em', color: GRAY, opacity: 1 - calm}}>BLOCK 0</div>
      {/* the gate */}
      <div style={{position: 'absolute', left: GX - 40, top: GY - 130, width: 80, height: 260, borderRadius: 40, border: `3px solid ${LIME_D}`, background: 'rgba(124,242,26,0.12)', boxShadow: `0 0 ${40 * calm}px rgba(124,242,26,0.6)`, opacity: calm}} />
      <div style={{position: 'absolute', left: GX - 120, top: GY + 150, width: 240, textAlign: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 18, letterSpacing: '0.14em', color: LIME_D, opacity: calm}}>SAME PRESALE</div>
      {new Array(n).fill(0).map((_, i) => {
        // chaotic sprint positions
        const sx = 1120 + random(`sx${i}`) * 240;
        const sy = 260 + random(`sy${i}`) * 600;
        const jitter = Math.sin(f * (0.5 + random(`j${i}`)) + i) * 14;
        const chaosX = sx + (f * (6 + random(`v${i}`) * 10)) % 420;
        const chaosY = sy + jitter;
        // orderly queue through the gate
        const q = ((f - 36) * 0.9 - i * 3.2);
        const orderX = q < 0 ? lerp(1180, GX, Math.max(0, 1 + q / 60)) : GX + q * 4;
        const orderY = q < 0 ? lerp(sy, GY, Math.max(0, 1 + q / 60)) : GY;
        const x = lerp(chaosX, orderX, calm);
        const y = lerp(chaosY, orderY, calm);
        const vis = x > 1880 ? 0 : 1;
        return <div key={i} style={{position: 'absolute', left: x - 9, top: y - 9, width: 18, height: 18, borderRadius: 9, background: calm > 0.5 ? LIME : '#9A9A95', boxShadow: calm > 0.5 ? `0 0 10px ${LIME}` : undefined, opacity: vis * (0.5 + 0.5 * calm)}} />;
      })}
    </AbsoluteFill>
  );
};

// ── 6. closer: the coin lands at the top of the rising line ─────
const CLOSE_LINE: [number, number][] = [
  [900, 1010], [1080, 960], [1240, 890], [1380, 840], [1500, 740], [1600, 660], [1690, 540],
];
const Closer: React.FC = () => {
  const f = useCurrentFrame();
  const draw = prog(f, 4, 44, inOut);
  const coin = prog(f, 30, 30, expoOut);
  const [ex, ey] = CLOSE_LINE[CLOSE_LINE.length - 1];
  return (
    <AbsoluteFill style={{background: BG, overflow: 'hidden'}}>
      <Grid f={f + 560} />
      <Line pts={CLOSE_LINE} p={draw} />
      <div style={{position: 'absolute', left: ex - 130, top: lerp(-400, ey - 300, coin), opacity: coin}}>
        <Coin3D size={270} rotY={lerp(540, 24, coin) + Math.sin(f / 18) * 8} rotX={-6} glow={1.3} />
      </div>
      <div style={{position: 'absolute', left: ex - 200, top: ey - 20, width: 400, height: 80, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(124,242,26,0.35), transparent 70%)', opacity: coin}} />
      <Header o={prog(f, 50, 16)} />
      <div style={{position: 'absolute', left: 120, top: 230}}>
        <Wordmark size={230} reveal={prog(f, 8, 20, expoOut)} />
      </div>
      <div style={{position: 'absolute', left: 120, top: 500}}>
        <FadeWords
          segments={[
            {text: 'BUILD. ', color: INK},
            {text: 'LAUNCH. ', color: INK},
            {text: 'GROW.', color: LIME_D},
          ]}
          start={26}
          size={96}
          font={DISPLAY}
          weight={900}
          stretch={115}
          tracking={-0.01}
          align="left"
          stagger={6}
        />
      </div>
      <div style={{position: 'absolute', left: 120, top: 626}}>
        <FadeWords segments="Presale launchpad on Solana." start={46} size={44} font={UI} weight={400} align="left" stagger={2} style={{color: GRAY}} />
      </div>
      <div style={{position: 'absolute', left: 120, top: 760, opacity: prog(f, 60, 16, expoOut), transform: `translateY(${(1 - prog(f, 60, 16, expoOut)) * 16}px)`}}>
        <div style={{display: 'inline-flex', alignItems: 'center', gap: 20, fontFamily: MONO, fontWeight: 700, fontSize: 34, letterSpacing: '0.08em', color: INK, background: LIME, padding: '20px 40px', borderRadius: 999, boxShadow: '0 16px 40px rgba(124,242,26,0.35)'}}>
          IPO.SOLANA.XYZ <span>↗</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Camera-push transition: scale + blur in. */
const Push: React.FC<{dur: number; last?: boolean; children: React.ReactNode}> = ({dur, last, children}) => {
  const f = useCurrentFrame();
  const i = prog(f, 0, 16, expoOut);
  const o = last ? 0 : prog(f, dur - 12, 12, expoIn);
  return (
    <AbsoluteFill style={{opacity: Math.min(1, i * 1.3) * (1 - o), transform: `scale(${lerp(0.9, 1, i) * lerp(1, 1.25, o)})`, filter: i < 1 || o > 0 ? `blur(${(1 - i) * 10 + o * 10}px)` : undefined}}>
      {children}
    </AbsoluteFill>
  );
};

export const IpoCustom: React.FC<{withAudio?: boolean}> = ({withAudio = true}) => (
  <AbsoluteFill style={{background: BG}}>
    <Sequence from={S.open.from} durationInFrames={S.open.dur} name="01 Presale launchpad → flow">
      <Open />
    </Sequence>
    <Sequence from={S.how.from} durationInFrames={S.how.dur} name="02 How it works">
      <Push dur={S.how.dur}>
        <How />
      </Push>
    </Sequence>
    <Sequence from={S.gate.from} durationInFrames={S.gate.dur} name="03 One clear entry">
      <Push dur={S.gate.dur}>
        <Gate />
      </Push>
    </Sequence>
    <Sequence from={S.pumpios.from} durationInFrames={S.pumpios.dur} name="04 Pumpios">
      <Push dur={S.pumpios.dur}>
        <Pumpios />
      </Push>
    </Sequence>
    <Sequence from={S.finale.from} durationInFrames={S.finale.dur} name="05 Closer">
      <Push dur={S.finale.dur} last>
        <Closer />
      </Push>
    </Sequence>
    {withAudio && <Audio src={staticFile('ipo-custom-score.wav')} />}
  </AbsoluteFill>
);
