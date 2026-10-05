import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {Flash, Glow, GridFloor, Particles, Shockwave} from '../components/Atmosphere';
import {Logo} from '../components/Logo';
import {useCalm} from '../components/calm';
import {KineticLine} from '../components/Type';
import {C, DISPLAY, MONO, expoOut, inOut, keys, lerp, prog} from '../theme';

// 22–28s: everything converges; the mark launches; blue + green feed in; orange erupts.
const LX = 960;
const LY = 318;
const LS = 380;
const IMPACT = 40;

export const Finale: React.FC = () => {
  const f = useCurrentFrame();
  const calm = useCalm();
  const rise = keys(f, [2, IMPACT], [1, 0], inOut);
  const ly = LY + rise * (calm ? 60 : 1000) + (f > IMPACT ? Math.sin((f - IMPACT) / 14) * 5 : 0);
  const beams = prog(f, 12, 26, inOut);
  const impact = prog(f, IMPACT, 30, expoOut);
  const hit = f >= IMPACT;
  const flash = hit ? Math.max(0, 1 - (f - IMPACT) / 14) : 0;
  const flashIn = Math.max(0, 1 - f / 10);
  const settle = prog(f, IMPACT, 60, expoOut);

  const beamPath = (side: -1 | 1) =>
    `M ${LX + side * 1100} ${880} C ${LX + side * 700} ${860}, ${LX + side * 380} ${600}, ${LX + side * 60} ${LY + 40}`;

  return (
    <AbsoluteFill style={{background: C.bg, overflow: 'hidden'}}>
      <Glow x={120} y={620} size={1400} color="rgba(44,123,255,0.35)" opacity={0.4 + beams * 0.6} />
      <Glow x={1800} y={620} size={1400} color="rgba(25,195,125,0.30)" opacity={0.4 + beams * 0.6} />
      <GridFloor color="rgba(255,106,0,0.28)" speed={lerp(20, 3, settle)} horizon={720} />
      <Particles count={150} seed="fin" color={C.orangeHot} speed={lerp(5, 1.2, settle)} opacity={0.7} maxSize={2.6} />

      {/* light column behind the mark */}
      <div
        style={{
          position: 'absolute',
          left: LX - 160,
          width: 320,
          top: -100,
          height: ly + 200,
          background: `linear-gradient(to top, rgba(255,106,0,0.55), rgba(255,106,0,0.0))`,
          filter: 'blur(40px)',
          opacity: 0.4 + impact * 0.6,
          mixBlendMode: 'screen',
        }}
      />

      {/* venue energy converging */}
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, display: calm ? 'none' : undefined}}>
        {([-1, 1] as const).map((side) => {
          const col = side === -1 ? C.blueHot : C.greenHot;
          return (
            <g key={side} style={{filter: `drop-shadow(0 0 12px ${col}) drop-shadow(0 0 30px ${col})`}}>
              {[0, 1, 2].map((k) => (
                <path
                  key={k}
                  d={beamPath(side)}
                  pathLength={1}
                  transform={`translate(0 ${k * 22 - 22})`}
                  fill="none"
                  stroke={col}
                  strokeWidth={k === 1 ? 6 : 2.5}
                  strokeLinecap="round"
                  strokeDasharray={`${beams} 1`}
                  opacity={(1 - impact * 0.82) * (k === 1 ? 1 : 0.6)}
                />
              ))}
              {beams >= 1 && !hit &&
                [0, 0.5].map((k) => (
                  <path
                    key={k}
                    d={beamPath(side)}
                    pathLength={1}
                    fill="none"
                    stroke="#fff"
                    strokeWidth={5}
                    strokeLinecap="round"
                    strokeDasharray="0.06 0.94"
                    strokeDashoffset={-(((f * 0.025) + k) % 1)}
                  />
                ))}
            </g>
          );
        })}
        {/* orange eruption — rays fanning upward from the mark */}
        {hit &&
          new Array(26).fill(0).map((_, i) => {
            const a = -Math.PI / 2 + (random(`ra${i}`) - 0.5) * 2.4;
            const len = (500 + random(`rl${i}`) * 900) * impact;
            const x1 = LX + Math.cos(a) * 120;
            const y1 = LY + Math.sin(a) * 120;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={LX + Math.cos(a) * (120 + len)}
                y2={LY + Math.sin(a) * (120 + len)}
                stroke={i % 3 === 0 ? C.yellow : C.orangeHot}
                strokeWidth={2 + random(`rw${i}`) * 6}
                strokeLinecap="round"
                opacity={(1 - impact) * 0.9}
                style={{filter: `drop-shadow(0 0 8px ${C.orange})`}}
              />
            );
          })}
      </svg>

      {/* exhaust while rising */}
      {!calm && rise > 0.02 && (
        <div
          style={{
            position: 'absolute',
            left: LX - 90,
            top: ly + LS * 0.35,
            width: 180,
            height: 900,
            background: `linear-gradient(to bottom, #FFF1D6, ${C.orangeHot} 12%, ${C.red} 40%, transparent 85%)`,
            filter: 'blur(22px)',
            opacity: Math.min(1, rise * 3),
            mixBlendMode: 'screen',
          }}
        />
      )}
      <Glow x={LX} y={ly} size={900} color="rgba(255,106,0,0.7)" opacity={0.6 + 0.4 * Math.sin(f / 8) * settle} />
      <div style={{position: 'absolute', left: LX - LS / 2, top: ly - LS / 2, opacity: calm ? prog(f, 0, 34, inOut) : 1, transform: `scale(${calm ? lerp(0.96, 1, prog(f, 0, 60, expoOut)) : hit ? lerp(1.18, 1, impact) : 0.9})`}}>
        <Logo size={LS} glow={calm ? 0.45 : 1.1 + flash} />
      </div>
      <Shockwave x={LX} y={LY} t={impact} maxR={1500} width={8} />
      <Shockwave x={LX} y={LY} t={prog(f, 120, 40, expoOut)} maxR={1100} width={3} color="#FFB27A" />

      {/* Wordmark + lines */}
      <div style={{position: 'absolute', top: 552, left: 0, right: 0}}>
        <KineticLine
          segments={[
            {text: 'TOP', gradient: 'linear-gradient(180deg, #FFFFFF 0%, #E9E4DC 55%, #A9A39A 100%)'},
            {text: 'BLAST', gradient: `linear-gradient(180deg, #FFB067 0%, ${C.orange} 45%, ${C.red} 100%)`},
          ]}
          start={calm ? 26 : IMPACT + 6}
          size={200}
          stagger={2}
          dur={26}
          tracking={0.01}
          style={{filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.8))'}}
        />
      </div>
      <div style={{position: 'absolute', top: 800, left: 0, right: 0}}>
        <KineticLine
          segments={[
            {text: 'LAUNCH ANYWHERE. ', color: C.white},
            {text: 'REWARD THE BLAST ZONE.', color: C.orangeHot},
          ]}
          start={calm ? 50 : IMPACT + 32}
          size={44}
          stagger={0.55}
          stretch={112}
          weight={700}
          tracking={0.22}
          rise={0.8}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 882,
          width: '100%',
          textAlign: 'center',
          fontFamily: MONO,
          fontWeight: 500,
          fontSize: 23,
          letterSpacing: '0.3em',
          color: 'rgba(247,244,238,0.62)',
          opacity: prog(f, calm ? 72 : IMPACT + 56, 18),
          transform: `translateY(${(1 - prog(f, calm ? 72 : IMPACT + 56, 18)) * 16}px)`,
        }}
      >
        <span style={{color: C.blueHot}}>STONKFUN</span> + <span style={{color: C.greenHot}}>PUMP.FUN</span> UNDERNEATH. <span style={{color: C.orangeHot}}>TOPBLAST</span> ON TOP.
      </div>
      <div
        style={{
          position: 'absolute',
          top: 964,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          opacity: prog(f, calm ? 88 : IMPACT + 74, 18),
        }}
      >
        <div
          style={{
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontStretch: '110%',
            fontSize: 24,
            letterSpacing: '0.18em',
            color: C.white,
            padding: '12px 30px',
            borderRadius: 999,
            border: `1px solid ${C.orange}88`,
            background: 'rgba(255,106,0,0.08)',
            boxShadow: `0 0 30px rgba(255,106,0,0.25)`,
          }}
        >
          TOPBLASTLAUNCH.XYZ
        </div>
      </div>

      <Flash amount={flash * 0.8} />
      <Flash amount={flashIn * 0.8} color="#FF7A1A" />
    </AbsoluteFill>
  );
};
