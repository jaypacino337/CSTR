import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Glow, Particles, Shockwave} from '../components/Atmosphere';
import {KineticLine} from '../components/Type';
import {C, DISPLAY, MONO, UI, backOut, expoOut, inOut, keys, lerp, prog} from '../theme';

// 7–12s: verified entry at 100 locks a line; price slides to 70 → BLAST ZONE.
const PW = 1560;
const PH = 740;
const CX = 70; // chart area inside panel
const CY = 170;
const CW = 1300;
const CH = 470;
const PMIN = 55;
const PMAX = 125;
const ENTRY = 100;
const BUY_T = 0.3;

const KP: [number, number][] = [
  [0, 68], [0.07, 75], [0.13, 71], [0.2, 86], [0.25, 82], [0.3, 100], [0.36, 103.5],
  [0.45, 92], [0.52, 95.5], [0.62, 81], [0.69, 84.5], [0.8, 72], [0.86, 75], [0.92, 70], [1, 70],
];

const smooth = (t: number) => t * t * (3 - 2 * t);
const price = (t: number) => {
  for (let i = 0; i < KP.length - 1; i++) {
    const [t0, p0] = KP[i];
    const [t1, p1] = KP[i + 1];
    if (t >= t0 && t <= t1) {
      const u = (t - t0) / (t1 - t0);
      const wig = Math.sin(t * 190) * 0.9 + Math.sin(t * 73) * 0.7;
      const edge = Math.min(u, 1 - u) * 2; // keep keypoints exact
      return lerp(p0, p1, smooth(u)) + wig * edge;
    }
  }
  return 70;
};
const X = (t: number) => CX + t * CW;
const Y = (p: number) => CY + (1 - (p - PMIN) / (PMAX - PMIN)) * CH;

export const Chart: React.FC = () => {
  const f = useCurrentFrame();
  const head = keys(f, [6, 30, 44, 56, 70, 86], [0.001, BUY_T, BUY_T, 0.45, 0.62, 0.92], inOut);
  const cur = price(head);
  const below = Math.max(0, Math.min(1, (ENTRY - cur) / 30));
  const panelIn = prog(f, 0, 20);
  const lock = prog(f, 30, 14, expoOut);
  const buyPop = prog(f, 28, 16, backOut);
  const slam = prog(f, 90, 16, expoOut);
  const shake = f >= 90 && f < 104 ? (1 - (f - 90) / 14) * 16 : 0;
  const sx = Math.sin(f * 7.3) * shake;
  const sy = Math.cos(f * 9.1) * shake;

  // Price path up to head
  const N = 240;
  const pts: [number, number][] = [];
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * head;
    pts.push([X(t), Y(price(t))]);
  }
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const ey = Y(ENTRY);
  const zonePts = pts.filter(([x]) => x >= X(BUY_T));
  const zone =
    zonePts.length > 1
      ? `M${zonePts[0][0]},${ey} ` +
        zonePts.map(([x, y]) => `L${x.toFixed(1)},${Math.max(y, ey).toFixed(1)}`).join(' ') +
        ` L${zonePts[zonePts.length - 1][0]},${ey} Z`
      : '';
  const [hx, hy] = pts[pts.length - 1];
  const inZone = cur < ENTRY - 0.2 && head > BUY_T + 0.01;

  return (
    <AbsoluteFill style={{background: C.bg, overflow: 'hidden'}}>
      <Glow x={960} y={700} size={2000} color="rgba(255,60,10,0.55)" opacity={below * 0.9 + slam * 0.3} />
      <Particles count={120} seed="chart" color={C.orangeHot} speed={1 + below * 2.5} opacity={0.25 + below * 0.7} maxSize={2.6} />

      <AbsoluteFill style={{transform: `translate(${sx}px, ${sy}px)`, perspective: 2200}}>
        <div
          style={{
            position: 'absolute',
            left: 960 - PW / 2,
            top: 70,
            width: PW,
            height: PH,
            borderRadius: 28,
            background: 'linear-gradient(160deg, rgba(28,28,34,0.82), rgba(10,10,13,0.92))',
            border: '1px solid rgba(255,255,255,0.09)',
            boxShadow: `0 40px 120px rgba(0,0,0,0.7), 0 0 ${80 * below}px rgba(255,80,0,${0.35 * below}), inset 0 1px 0 rgba(255,255,255,0.08)`,
            transform: `rotateX(${lerp(14, 5, panelIn)}deg) rotateY(${lerp(-10, 3, prog(f, 0, 160, inOut))}deg) translateY(${(1 - panelIn) * 80}px)`,
            opacity: panelIn,
            overflow: 'hidden',
          }}
        >
          {/* header */}
          <div style={{position: 'absolute', left: 70, top: 44, display: 'flex', alignItems: 'center', gap: 18}}>
            <div style={{width: 12, height: 12, borderRadius: 6, background: C.greenHot, boxShadow: `0 0 12px ${C.green}`, opacity: 0.5 + 0.5 * Math.sin(f / 4)}} />
            <div style={{fontFamily: MONO, fontSize: 18, letterSpacing: '0.25em', color: C.dim}}>TOPBLAST · LIVE POSITION</div>
          </div>
          <div style={{position: 'absolute', left: 70, top: 82, fontFamily: DISPLAY, fontWeight: 800, fontStretch: '112%', fontSize: 44, color: C.white}}>
            $TOKEN
            <span style={{fontFamily: MONO, fontWeight: 500, fontSize: 18, color: C.blueHot, marginLeft: 20, letterSpacing: '0.2em', border: `1px solid ${C.blue}66`, padding: '6px 12px', borderRadius: 8, verticalAlign: 'middle'}}>
              VENUE · STONKFUN
            </span>
          </div>
          <div style={{position: 'absolute', right: 70, top: 40, textAlign: 'right'}}>
            <div style={{fontFamily: MONO, fontSize: 16, letterSpacing: '0.25em', color: C.dim}}>MARKET VALUE</div>
            <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 76, color: inZone ? C.orangeHot : C.white, textShadow: inZone ? `0 0 30px ${C.orange}` : undefined, lineHeight: 1.05}}>
              {cur.toFixed(2)}
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              right: 360,
              top: 62,
              fontFamily: MONO,
              fontSize: 17,
              letterSpacing: '0.2em',
              padding: '10px 18px',
              borderRadius: 999,
              color: inZone ? '#170700' : C.dim,
              background: inZone ? `linear-gradient(90deg, ${C.orangeHot}, ${C.red})` : 'rgba(255,255,255,0.06)',
              boxShadow: inZone ? `0 0 30px ${C.orange}` : undefined,
              fontWeight: 700,
            }}
          >
            {head <= BUY_T + 0.001 ? 'AWAITING ENTRY' : inZone ? `IN BLAST ZONE  ${(((cur - ENTRY) / ENTRY) * 100).toFixed(1)}%` : 'ABOVE ENTRY'}
          </div>

          <svg width={PW} height={PH} style={{position: 'absolute', inset: 0}}>
            <defs>
              <linearGradient id="zoneG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={C.orangeHot} stopOpacity={0.85} />
                <stop offset="0.6" stopColor={C.red} stopOpacity={0.55} />
                <stop offset="1" stopColor={C.red} stopOpacity={0.15} />
              </linearGradient>
              <filter id="glow2" x="-10%" y="-30%" width="120%" height="160%">
                <feGaussianBlur stdDeviation="8" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {[60, 80, 100, 120].map((p) => (
              <g key={p}>
                <line x1={CX} x2={CX + CW} y1={Y(p)} y2={Y(p)} stroke="rgba(255,255,255,0.06)" />
                <text x={CX + CW + 26} y={Y(p) + 6} fill="rgba(255,255,255,0.35)" fontFamily="JetBrains Mono" fontSize={17}>
                  {p}
                </text>
              </g>
            ))}
            {zone && <path d={zone} fill="url(#zoneG)" filter="url(#glow2)" opacity={0.9 + 0.1 * Math.sin(f / 3)} />}
            {/* entry line locking in from the buy point */}
            <line
              x1={lerp(X(BUY_T), CX, lock)}
              x2={lerp(X(BUY_T), CX + CW, lock)}
              y1={ey}
              y2={ey}
              stroke="#FFF3E6"
              strokeWidth={3}
              filter="url(#glow2)"
              opacity={lock}
            />
            <path d={line} fill="none" stroke={inZone ? '#FFD9B8' : C.white} strokeWidth={3.5} strokeLinejoin="round" filter="url(#glow2)" />
            <circle cx={hx} cy={hy} r={9} fill={inZone ? C.orangeHot : C.white} filter="url(#glow2)" />
            <circle cx={hx} cy={hy} r={9 + ((f * 1.2) % 24)} fill="none" stroke={inZone ? C.orangeHot : C.white} opacity={1 - ((f * 1.2) % 24) / 24} />
            {/* buy marker */}
            {buyPop > 0 && (
              <g transform={`translate(${X(BUY_T)} ${ey})`}>
                <circle r={14 * buyPop} fill={C.bg} stroke={C.green} strokeWidth={4} />
                <path d="M-6 0 L-2 5 L7 -6" stroke={C.greenHot} strokeWidth={3.5} fill="none" opacity={buyPop} />
              </g>
            )}
          </svg>

          {/* entry labels */}
          <div
            style={{
              position: 'absolute',
              left: X(BUY_T) - 150,
              top: ey - 96,
              width: 300,
              textAlign: 'center',
              transform: `scale(${buyPop}) translateY(${(1 - buyPop) * 30}px)`,
              opacity: buyPop,
            }}
          >
            <div style={{display: 'inline-block', padding: '10px 18px', borderRadius: 12, background: 'rgba(25,195,125,0.12)', border: `1px solid ${C.green}`, boxShadow: `0 0 24px ${C.green}55`}}>
              <div style={{fontFamily: MONO, fontSize: 15, letterSpacing: '0.28em', color: C.greenHot}}>✓ VERIFIED ENTRY</div>
              <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 30, color: C.white}}>100.00</div>
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              left: CX + CW - 250,
              top: ey - 44,
              fontFamily: MONO,
              fontSize: 15,
              letterSpacing: '0.24em',
              color: '#FFF3E6',
              opacity: prog(f, 40, 10),
            }}
          >
            ▸ YOUR LINE · LOCKED
          </div>
        </div>

        {/* BLAST ZONE slam */}
        {slam > 0 && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 480,
              whiteSpace: 'nowrap',
              display: 'flex',
              justifyContent: 'center',
              transform: `scale(${lerp(1.9, 1, slam)})`,
              opacity: Math.min(1, slam * 2),
              filter: `blur(${(1 - slam) * 12}px)`,
            }}
          >
            {[
              {c: C.red, dx: -8 * (1 - slam) - 3, o: 0.8},
              {c: C.yellow, dx: 8 * (1 - slam) + 3, o: 0.5},
            ].map((l, i) => (
              <div key={i} style={{position: 'absolute', transform: `translateX(${l.dx}px)`, fontFamily: DISPLAY, fontWeight: 900, fontStretch: '125%', fontSize: 196, color: l.c, opacity: l.o, mixBlendMode: 'screen', lineHeight: 1, whiteSpace: 'nowrap'}}>
                BLAST ZONE
              </div>
            ))}
            <div
              style={{
                position: 'relative',
                fontFamily: DISPLAY,
                fontWeight: 900,
                fontStretch: '125%',
                fontSize: 196,
                lineHeight: 1,
                whiteSpace: 'nowrap',
                backgroundImage: `linear-gradient(180deg, #FFF6EC 0%, #FFD0A0 40%, ${C.orange} 70%, ${C.red} 100%)`,
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                filter: `drop-shadow(0 0 40px rgba(255,80,0,0.8))`,
              }}
            >
              BLAST ZONE
            </div>
          </div>
        )}
        <Shockwave x={960} y={585} t={prog(f, 90, 30, expoOut)} maxR={1300} />
      </AbsoluteFill>

      <div style={{position: 'absolute', top: 868, left: 0, right: 0}}>
        <KineticLine
          segments={[
            {text: 'YOUR ENTRY SETS ', color: C.white},
            {text: 'THE LINE.', gradient: `linear-gradient(90deg, ${C.orangeHot}, ${C.red})`},
          ]}
          start={110}
          size={78}
          stagger={1}
          stretch={118}
        />
      </div>
      <div style={{position: 'absolute', top: 978, width: '100%', textAlign: 'center', fontFamily: UI, fontSize: 20, letterSpacing: '0.32em', color: C.dim, opacity: prog(f, 124, 16)}}>
        EVERY VERIFIED BUYER GETS THEIR OWN LINE
      </div>
    </AbsoluteFill>
  );
};
