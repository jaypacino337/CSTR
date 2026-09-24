import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {C, DISPLAY, MONO, inOut, lerp, prog} from '../theme';
import {LAYER_Y} from './Opening';
import {FadeWords, INK, SOFT} from './ui';

// 2.9–7.4s. Two independent launch networks stream up into one orange layer.
const NET_Y = 760;
const L_X = 560;
const R_X = 1360;
const BAND_L = 360;
const BAND_R = 1560;
// chart geometry the layer line hands off to (see Entry.tsx)
export const CHART_L = 220;
export const CHART_R = 1640;

const nodes = (seed: string) =>
  new Array(9).fill(0).map((_, i) => ({
    x: -190 + (i % 5) * 95 + (Math.floor(i / 5) ? 47 : 0) + (random(`${seed}x${i}`) - 0.5) * 20,
    y: -30 + Math.floor(i / 5) * 62 + (random(`${seed}y${i}`) - 0.5) * 14,
  }));

const Network: React.FC<{cx: number; color: string; hot: string; a: string; b: string; p: number; f: number; seed: string}> = ({cx, color, hot, a, b, p, f, seed}) => {
  const ns = nodes(seed);
  return (
    <div style={{position: 'absolute', left: cx - 240, top: NET_Y - 70, width: 480, height: 240, opacity: p}}>
      <svg width={480} height={140} viewBox="-240 -70 480 140" style={{position: 'absolute', top: 0, left: 0, overflow: 'visible'}}>
        {ns.map((n, i) =>
          ns.slice(i + 1).map((m, j) =>
            Math.hypot(n.x - m.x, n.y - m.y) < 110 ? <line key={`${i}-${j}`} x1={n.x} y1={n.y} x2={m.x} y2={m.y} stroke={color} strokeOpacity={0.35} strokeWidth={1} /> : null,
          ),
        )}
        {ns.map((n, i) => {
          const pulse = 0.5 + 0.5 * Math.sin(f / 9 + i * 1.7);
          return (
            <g key={i}>
              <circle cx={n.x} cy={n.y} r={9} fill="none" stroke={color} strokeOpacity={0.25 + 0.3 * pulse} />
              <circle cx={n.x} cy={n.y} r={3.2} fill={hot} />
            </g>
          );
        })}
      </svg>
      <div style={{position: 'absolute', top: 142, width: '100%', textAlign: 'center'}}>
        <div style={{fontFamily: DISPLAY, fontWeight: 800, fontStretch: '115%', fontSize: 34, letterSpacing: '0.04em'}}>
          <span style={{color: C.white}}>{a}</span>
          <span style={{color: hot}}>{b}</span>
        </div>
        <div style={{fontFamily: MONO, fontSize: 13, letterSpacing: '0.34em', color: SOFT, marginTop: 6}}>LAUNCH NETWORK</div>
      </div>
    </div>
  );
};

export const Venue: React.FC = () => {
  const f = useCurrentFrame();
  const band = prog(f, 6, 26, inOut);
  const nets = prog(f, 18, 26, inOut);
  const streams = prog(f, 32, 30, inOut);
  const arrive = prog(f, 58, 30, inOut);
  const exit = prog(f, 108, 20, inOut);
  const rest = 1 - prog(f, 104, 14, inOut);

  // layer: full-width line → band → (exit) thin grey chart gridline
  const left = exit > 0 ? lerp(BAND_L, CHART_L, exit) : lerp(-40, BAND_L, band);
  const right = exit > 0 ? lerp(BAND_R, CHART_R, exit) : lerp(1960, BAND_R, band);
  const h = lerp(lerp(1.5, 58, band), 1, exit);
  const lineColor = exit > 0.5 ? 'rgba(255,255,255,0.14)' : C.orangeHot;

  const streamPaths = (side: -1 | 1) => {
    const cx = side < 0 ? L_X : R_X;
    return new Array(6).fill(0).map((_, i) => {
      const sx = cx + (i - 2.5) * 34;
      const tx = 960 + side * (60 + i * 70) * 0.9 - side * 30;
      return `M ${sx} ${NET_Y - 44} C ${sx} ${NET_Y - 230}, ${tx} ${LAYER_Y + 220}, ${tx} ${LAYER_Y + 30}`;
    });
  };

  return (
    <AbsoluteFill style={{background: INK}}>
      <div style={{position: 'absolute', inset: 0, opacity: rest}}>
        <div style={{position: 'absolute', left: L_X - 500, top: NET_Y - 400, width: 1000, height: 800, background: 'radial-gradient(circle, rgba(44,123,255,0.10), transparent 60%)', opacity: nets}} />
        <div style={{position: 'absolute', left: R_X - 500, top: NET_Y - 400, width: 1000, height: 800, background: 'radial-gradient(circle, rgba(25,195,125,0.09), transparent 60%)', opacity: nets}} />
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <defs>
            {(['b', 'g'] as const).map((k) => (
              <linearGradient key={k} id={`sg${k}`} gradientUnits="userSpaceOnUse" x1="0" y1={NET_Y} x2="0" y2={LAYER_Y}>
                <stop offset="0" stopColor={k === 'b' ? C.blueHot : C.greenHot} />
                <stop offset="0.7" stopColor={k === 'b' ? C.blueHot : C.greenHot} />
                <stop offset="1" stopColor={C.orangeHot} />
              </linearGradient>
            ))}
          </defs>
          {([-1, 1] as const).map((side) =>
            streamPaths(side).map((d, i) => (
              <g key={`${side}${i}`}>
                <path d={d} pathLength={1} fill="none" stroke={`url(#sg${side < 0 ? 'b' : 'g'})`} strokeOpacity={0.28} strokeWidth={1.2} strokeDasharray={`${streams} 1`} />
                {[0, 0.5].map((k) => (
                  <path
                    key={k}
                    d={d}
                    pathLength={1}
                    fill="none"
                    stroke={`url(#sg${side < 0 ? 'b' : 'g'})`}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeDasharray="0.05 0.95"
                    strokeDashoffset={-((f * 0.012 + k + i * 0.17) % 1)}
                    opacity={streams > 0.98 ? 0.9 : 0}
                  />
                ))}
              </g>
            )),
          )}
        </svg>
        <Network cx={L_X} color={C.blue} hot={C.blueHot} a="STONK" b="FUN" p={nets} f={f} seed="sn" />
        <Network cx={R_X} color={C.green} hot={C.greenHot} a="PUMP." b="FUN" p={nets} f={f} seed="pn" />
      </div>

      {/* the TopBlast layer */}
      <div
        style={{
          position: 'absolute',
          left,
          width: right - left,
          top: LAYER_Y - h / 2,
          height: h,
          borderRadius: h > 4 ? 10 : 0,
          background: h > 4 ? `linear-gradient(180deg, rgba(255,138,31,${0.1 + 0.12 * arrive}), rgba(255,106,0,0.04))` : lineColor,
          border: h > 4 ? `1px solid rgba(255,138,31,${0.55 + 0.35 * arrive})` : undefined,
          boxShadow: h > 4 ? `0 0 ${20 + 30 * arrive}px rgba(255,106,0,${0.18 + 0.2 * arrive}), inset 0 1px 0 rgba(255,220,190,0.25)` : exit < 0.5 ? '0 0 10px rgba(255,106,0,0.7)' : undefined,
        }}
      />
      <div style={{position: 'absolute', left: BAND_L, width: BAND_R - BAND_L, top: LAYER_Y - 12, textAlign: 'center', fontFamily: MONO, fontSize: 18, letterSpacing: '0.42em', color: '#FFE3CC', opacity: prog(f, 22, 18) * rest}}>
        TOPBLAST · REWARD LAYER
      </div>

      <div style={{position: 'absolute', left: 0, right: 0, top: 950, opacity: rest}}>
        <div style={{position: 'absolute', left: 0, right: 0}}>
          <FadeWords segments="LAUNCH WHERE YOU ALREADY LAUNCH." start={24} size={44} weight={700} tracking={0.02} exitAt={64} exitDur={12} style={{color: C.white}} />
        </div>
        <div style={{position: 'absolute', left: 0, right: 0}}>
          <FadeWords
            segments={[
              {text: 'TOPBLAST ', color: C.orangeHot},
              {text: 'ADDS THE LAYER ABOVE.', color: C.white},
            ]}
            start={74}
            size={44}
            weight={700}
            tracking={0.02}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
