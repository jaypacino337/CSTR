import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, DISPLAY, MONO, UI, expoOut, inOut, keys, lerp, prog} from '../theme';
import {FadeWords, HAIR, INK, SOFT, ZoneField} from '../premium/ui';

// 4.7–14.7s. Terminal → verified buy, entry $100 → entry line locks → $112 → $105 → $98 → $82.
// Crossing the line flips the UI below it into the zone state; the camera then
// pulls back to show that the whole region under the line is the Blast Zone.

// Panel geometry (screen space at scale 1)
const PX = 160;
const PY = 110;
const PW = 1600;
const PH = 800;
// chart area in panel space
const CX = 60;
const CW = 1420;
const CT = 190;
const CB = 650;
const PMIN = 75;
const PMAX = 120;
const ENTRY = 100;
const Y = (p: number) => CT + ((PMAX - p) / (PMAX - PMIN)) * (CB - CT);
const X = (t: number) => CX + t * CW;
export const ENTRY_SCREEN_Y = PY + Y(ENTRY); // 530
export const ZONE_LINE_Y = 380;

const KP: [number, number][] = [
  [0, 88], [0.07, 90.5], [0.13, 89.2], [0.21, 94.6], [0.3, 100], [0.36, 106], [0.42, 104.5], [0.5, 112],
  [0.56, 108.6], [0.62, 105], [0.67, 106.2], [0.74, 98], [0.8, 99.4], [0.9, 82], [0.95, 83.6], [1, 82.8],
];
const ease = (t: number) => t * t * (3 - 2 * t);
export const priceAt = (t: number) => {
  for (let i = 0; i < KP.length - 1; i++) {
    const [t0, p0] = KP[i];
    const [t1, p1] = KP[i + 1];
    if (t <= t1) {
      const u = Math.max(0, (t - t0) / (t1 - t0));
      const wig = (Math.sin(t * 210) * 0.35 + Math.sin(t * 97) * 0.3) * Math.sin(u * Math.PI);
      return lerp(p0, p1, ease(u)) + wig;
    }
  }
  return KP[KP.length - 1][1];
};
export const BUY_F = 40;
export const CROSS_F = 124;
export const PULL_F = 176;
export const headAt = (f: number) => keys(f, [16, BUY_F, 64, 90, 110, 130, 162, 290], [0.001, 0.3, 0.3, 0.5, 0.62, 0.74, 0.9, 0.97], inOut);
export const ZONE_TITLE_F = 206;
export const REWARDS_FROM = 430;

const TYPED = 'BELOW YOUR ENTRY?';

export const Entry: React.FC<{from: number}> = ({from}) => {
  const f = useCurrentFrame();
  const g = from + f;
  const panelIn = prog(f, 0, 16);
  const grid = (i: number) => prog(f, i * 4, 16, inOut);
  const head = headAt(f);
  const cur = priceAt(head);
  const buy = prog(f, BUY_F, 14, expoOut);
  const lock = prog(f, BUY_F + 4, 20, inOut);
  const state = prog(f, CROSS_F, 26, inOut);
  const below = cur < ENTRY && head > 0.31;
  const typedN = Math.max(0, Math.min(TYPED.length, Math.floor((f - 136) * 0.9)));
  const typedOut = prog(f, PULL_F, 16);

  // camera pull-back
  const pull = prog(f, PULL_F, 86, inOut);
  const lineY = lerp(ENTRY_SCREEN_Y, ZONE_LINE_Y, pull);
  const scale = lerp(1, 0.6, pull);
  const panelOut = prog(f, 280, 18, inOut);
  const zoneTitle = prog(f, ZONE_TITLE_F, 34, expoOut);
  const titleOut = prog(f, 280, 16, inOut);

  const N = 220;
  const pts: [number, number][] = [];
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * head;
    pts.push([X(t), Y(priceAt(t))]);
  }
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const [hx, hy] = pts[pts.length - 1];
  const ey = Y(ENTRY);
  const buyX = X(0.3);
  const stamp = (n: number) => String(Math.floor(n)).padStart(2, '0');
  const snap = Math.max(0, 8049 - Math.floor(f * 1.7));

  return (
    <AbsoluteFill style={{background: INK}}>
      {g < REWARDS_FROM && <ZoneField g={g} reveal={prog(f, PULL_F + 6, 50, inOut)} lineY={lineY} />}

      <div
        style={{
          position: 'absolute',
          left: PX,
          top: PY,
          width: PW,
          height: PH,
          transformOrigin: `${960 - PX}px ${ENTRY_SCREEN_Y - PY}px`,
          transform: `translateY(${lineY - ENTRY_SCREEN_Y}px) scale(${scale})`,
          opacity: 1 - panelOut,
        }}
      >
        {/* panel body */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 20,
            background: 'linear-gradient(180deg, rgba(18,18,20,0.96), rgba(10,10,12,0.98))',
            border: `1px solid ${HAIR}`,
            boxShadow: '0 50px 120px rgba(0,0,0,0.6)',
            opacity: panelIn,
            overflow: 'hidden',
          }}
        >
          {/* system state below the line */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: ey,
              bottom: 0,
              background: 'linear-gradient(180deg, rgba(255,96,20,0.22) 0%, rgba(170,34,6,0.20) 55%, rgba(60,10,2,0.25) 100%)',
              opacity: state,
            }}
          />
        </div>

        {/* header */}
        <div style={{position: 'absolute', left: 48, right: 48, top: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: panelIn}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, fontFamily: MONO, fontSize: 15, letterSpacing: '0.24em', color: SOFT}}>
            <div style={{width: 7, height: 7, borderRadius: 4, background: C.greenHot, opacity: 0.6 + 0.4 * Math.sin(f / 6)}} />
            TOPBLAST TERMINAL
          </div>
          <div style={{display: 'flex', gap: 48, fontFamily: MONO, fontSize: 14, letterSpacing: '0.18em', color: 'rgba(247,244,238,0.4)'}}>
            <span>
              VENUE <span style={{color: C.blueHot}}>STONKFUN</span>
            </span>
            <span>
              EPOCH <span style={{color: C.white}}>14</span>
            </span>
            <span>
              SNAPSHOT <span style={{color: C.white}}>{`${stamp(snap / 3600)}:${stamp((snap % 3600) / 60)}:${stamp(snap % 60)}`}</span>
            </span>
          </div>
        </div>
        <div style={{position: 'absolute', left: 48, top: 76, opacity: panelIn, display: 'flex', alignItems: 'baseline', gap: 18}}>
          <div style={{fontFamily: UI, fontWeight: 800, fontSize: 40, color: C.white, letterSpacing: '-0.01em'}}>$TOKEN</div>
          <div style={{fontFamily: MONO, fontSize: 16, color: SOFT}}>/ SOL</div>
        </div>
        <div style={{position: 'absolute', right: 48, top: 64, textAlign: 'right', opacity: panelIn}}>
          <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 60, lineHeight: 1, color: below ? '#FFB27A' : C.white}}>${cur.toFixed(2)}</div>
          <div style={{fontFamily: MONO, fontSize: 14, letterSpacing: '0.2em', marginTop: 8, color: head < 0.3 ? SOFT : below ? C.orangeHot : C.greenHot}}>
            {head < 0.3 ? 'NO POSITION' : `${cur >= ENTRY ? '+' : ''}${(cur - ENTRY).toFixed(2)} VS ENTRY`}
          </div>
        </div>

        <svg width={PW} height={PH} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          <defs>
            <clipPath id="above">
              <rect x={0} y={0} width={PW} height={ey} />
            </clipPath>
            <clipPath id="belowC">
              <rect x={X(0.3)} y={ey} width={PW} height={PH} />
            </clipPath>
            <clipPath id="preBuy">
              <rect x={0} y={ey} width={X(0.3)} height={PH} />
            </clipPath>
          </defs>
          {[120, 110, 100, 90, 80].map((p, i) => (
            <g key={p} opacity={i === 0 ? 1 : grid(i)}>
              <line x1={CX} x2={CX + CW * (i === 0 ? 1 : grid(i))} y1={Y(p)} y2={Y(p)} stroke="rgba(255,255,255,0.1)" />
              <text x={CX + CW + 22} y={Y(p) + 5} fill="rgba(247,244,238,0.35)" fontFamily="JetBrains Mono" fontSize={14}>
                ${p}
              </text>
            </g>
          ))}
          {[0.25, 0.5, 0.75].map((t) => (
            <line key={t} x1={X(t)} x2={X(t)} y1={CT} y2={CB} stroke="rgba(255,255,255,0.04)" opacity={prog(f, 10, 20)} />
          ))}
          <path d={d} fill="none" stroke={C.white} strokeWidth={2.2} strokeLinejoin="round" clipPath="url(#above)" />
          <path d={d} fill="none" stroke="#FFB27A" strokeWidth={2.2} strokeLinejoin="round" clipPath="url(#belowC)" />
          <path d={d} fill="none" stroke="rgba(247,244,238,0.55)" strokeWidth={2.2} strokeLinejoin="round" clipPath="url(#preBuy)" />
          {/* entry line */}
          <line x1={lerp(buyX, CX, lock)} x2={lerp(buyX, CX + CW, lock)} y1={ey} y2={ey} stroke={C.orangeHot} strokeWidth={1.5} opacity={lock > 0 ? 1 : 0} style={{filter: 'drop-shadow(0 0 6px rgba(255,106,0,0.8))'}} />
          {lock > 0.98 && (
            <>
              <line x1={CX} x2={CX} y1={ey - 7} y2={ey + 7} stroke={C.orangeHot} strokeWidth={1.5} />
              <line x1={CX + CW} x2={CX + CW} y1={ey - 7} y2={ey + 7} stroke={C.orangeHot} strokeWidth={1.5} />
            </>
          )}
          <circle cx={hx} cy={hy} r={5} fill={below ? C.orangeHot : C.white} />
          <circle cx={hx} cy={hy} r={5 + ((f * 0.8) % 16)} fill="none" stroke={below ? C.orangeHot : C.white} opacity={0.5 * (1 - ((f * 0.8) % 16) / 16)} />
          {buy > 0 && <circle cx={buyX} cy={ey} r={6} fill={INK} stroke={C.white} strokeWidth={2} opacity={buy} />}
        </svg>

        {/* verified buy tag */}
        <div
          style={{
            position: 'absolute',
            left: buyX - 100,
            top: ey - 96,
            width: 200,
            padding: '12px 0',
            textAlign: 'center',
            borderRadius: 12,
            background: 'rgba(28,28,32,0.92)',
            border: `1px solid rgba(255,255,255,0.14)`,
            opacity: buy,
            transform: `translateY(${(1 - buy) * 10}px)`,
          }}
        >
          <div style={{fontFamily: MONO, fontSize: 12, letterSpacing: '0.26em', color: C.greenHot}}>✓ VERIFIED BUY</div>
          <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 26, color: C.white, marginTop: 6}}>ENTRY: $100</div>
        </div>
        <div style={{position: 'absolute', left: CX + CW - 360, top: ey - 34, width: 360, textAlign: 'right', fontFamily: MONO, fontSize: 14, letterSpacing: '0.26em', color: '#FFB27A', opacity: prog(f, BUY_F + 20, 14)}}>
          YOUR ENTRY LINE · $100.00
        </div>
        <div style={{position: 'absolute', left: 48, bottom: 36, fontFamily: MONO, fontSize: 14, letterSpacing: '0.2em', color: state > 0.5 ? '#FFB27A' : SOFT, opacity: panelIn}}>
          STATUS · {head < 0.3 ? 'AWAITING ENTRY' : state > 0.5 ? 'BELOW ENTRY — HOLDING' : 'ABOVE ENTRY'}
        </div>

        {/* system output */}
        {typedN > 0 && (
          <div style={{position: 'absolute', left: CX + 600, top: ey + 112, fontFamily: MONO, fontWeight: 700, fontSize: 46, letterSpacing: '0.04em', color: '#FFE3CC', opacity: 1 - typedOut, textShadow: '0 0 18px rgba(255,106,0,0.35)'}}>
            <span style={{color: C.orangeHot}}>› </span>
            {TYPED.slice(0, typedN)}
            <span style={{display: 'inline-block', width: 22, height: 40, marginLeft: 6, verticalAlign: -4, background: '#FFB27A', opacity: Math.floor(f / 8) % 2 ? 0.9 : 0.2}} />
          </div>
        )}
      </div>

      {/* caption under the terminal */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 944, opacity: 1 - prog(f, PULL_F - 6, 14)}}>
        <FadeWords
          segments={[
            {text: 'EVERY BUY CREATES AN ', color: C.white},
            {text: 'ENTRY LINE.', color: '#FFB27A'},
          ]}
          start={BUY_F + 14}
          size={40}
          weight={700}
          tracking={0.02}
        />
      </div>

      {/* BLAST ZONE */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 660, opacity: zoneTitle * (1 - titleOut), transform: `translateY(${(1 - zoneTitle) * 40}px)`, filter: zoneTitle < 1 ? `blur(${(1 - zoneTitle) * 8}px)` : undefined}}>
        <div
          style={{
            textAlign: 'center',
            fontFamily: DISPLAY,
            fontWeight: 800,
            fontStretch: '118%',
            fontSize: 150,
            letterSpacing: '0.06em',
            lineHeight: 1,
            backgroundImage: 'linear-gradient(180deg, #FFF4EA 0%, #FFC592 45%, #FF7A1F 100%)',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            filter: 'drop-shadow(0 0 30px rgba(255,90,20,0.28))',
          }}
        >
          BLAST ZONE
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 840, opacity: 1 - titleOut}}>
        <FadeWords
          segments={[
            {text: 'STAY ELIGIBLE.   ', color: C.white},
            {text: 'ENTER THE BLAST ZONE.', color: '#FFB27A'},
          ]}
          start={ZONE_TITLE_F + 22}
          size={28}
          weight={600}
          tracking={0.34}
          stagger={5}
        />
      </div>
    </AbsoluteFill>
  );
};
