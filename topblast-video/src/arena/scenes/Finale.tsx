import {AbsoluteFill, Img, random, staticFile, useCurrentFrame} from 'remotion';
import {Flash, Glow, GridFloor, Particles, Shockwave} from '../../components/Atmosphere';
import {KineticLine} from '../../components/Type';
import {DISPLAY, MONO, expoOut, inOut, keys, lerp, prog} from '../../theme';
import {A} from '../theme';

// 22–28s: the helmet rises out of the arena; white + lime energy converge; lime erupts.
const LX = 960;
const LY = 300;
const LS = 470;
const IMPACT = 40;

export const ArenaFinale: React.FC = () => {
  const f = useCurrentFrame();
  const rise = keys(f, [2, IMPACT], [1, 0], inOut);
  const ly = LY + rise * 1000 + (f > IMPACT ? Math.sin((f - IMPACT) / 14) * 5 : 0);
  const beams = prog(f, 12, 26, inOut);
  const impact = prog(f, IMPACT, 30, expoOut);
  const hit = f >= IMPACT;
  const flash = hit ? Math.max(0, 1 - (f - IMPACT) / 14) : 0;
  const flashIn = Math.max(0, 1 - f / 10);
  const settle = prog(f, IMPACT, 60, expoOut);
  const beamPath = (side: -1 | 1) => `M ${LX + side * 1100} 900 C ${LX + side * 700} 880, ${LX + side * 380} 620, ${LX + side * 80} ${LY + 60}`;

  return (
    <AbsoluteFill style={{background: A.bg, overflow: 'hidden'}}>
      <Glow x={120} y={620} size={1400} color="rgba(255,255,255,0.12)" opacity={0.4 + beams * 0.6} />
      <Glow x={1800} y={620} size={1400} color="rgba(216,255,26,0.22)" opacity={0.4 + beams * 0.6} />
      <GridFloor color="rgba(216,255,26,0.24)" speed={lerp(20, 3, settle)} horizon={740} />
      <Particles count={150} seed="afin" color={A.limeHot} speed={lerp(5, 1.2, settle)} opacity={0.65} maxSize={2.6} />
      <div style={{position: 'absolute', left: LX - 170, width: 340, top: -100, height: ly + 200, background: 'linear-gradient(to top, rgba(216,255,26,0.4), rgba(216,255,26,0))', filter: 'blur(40px)', opacity: 0.4 + impact * 0.6, mixBlendMode: 'screen'}} />

      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {([-1, 1] as const).map((side) => {
          const col = side === -1 ? '#FFFFFF' : A.lime;
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
                  opacity={(1 - impact * 0.85) * (k === 1 ? 1 : 0.6)}
                />
              ))}
            </g>
          );
        })}
        {hit &&
          new Array(26).fill(0).map((_, i) => {
            const a = -Math.PI / 2 + (random(`ara${i}`) - 0.5) * 2.4;
            const len = (500 + random(`arl${i}`) * 900) * impact;
            return (
              <line
                key={i}
                x1={LX + Math.cos(a) * 140}
                y1={LY + Math.sin(a) * 140}
                x2={LX + Math.cos(a) * (140 + len)}
                y2={LY + Math.sin(a) * (140 + len)}
                stroke={i % 3 === 0 ? '#FFFFFF' : A.lime}
                strokeWidth={2 + random(`arw${i}`) * 6}
                strokeLinecap="round"
                opacity={(1 - impact) * 0.9}
                style={{filter: `drop-shadow(0 0 8px ${A.lime})`}}
              />
            );
          })}
      </svg>

      {rise > 0.02 && (
        <div style={{position: 'absolute', left: LX - 100, top: ly + LS * 0.3, width: 200, height: 900, background: `linear-gradient(to bottom, #FBFFE6, ${A.lime} 12%, ${A.limeDeep} 40%, transparent 85%)`, filter: 'blur(22px)', opacity: Math.min(1, rise * 3), mixBlendMode: 'screen'}} />
      )}
      <Glow x={LX} y={ly} size={950} color="rgba(216,255,26,0.45)" opacity={0.6 + 0.4 * Math.sin(f / 8) * settle} />
      <div style={{position: 'absolute', left: LX - LS / 2, top: ly - LS / 2, width: LS, height: LS, transform: `scale(${hit ? lerp(1.18, 1, impact) : 0.9})`}}>
        <Img
          src={staticFile('arena-logo.png')}
          style={{width: '100%', height: '100%', filter: `drop-shadow(0 0 ${10 + flash * 30}px rgba(216,255,26,${0.5 + flash * 0.5})) drop-shadow(0 0 60px rgba(216,255,26,0.25))`}}
        />
      </div>
      <Shockwave x={LX} y={LY} t={impact} maxR={1500} width={8} color={A.lime} />
      <Shockwave x={LX} y={LY} t={prog(f, 120, 40, expoOut)} maxR={1100} width={3} color={A.limeHot} />

      <div style={{position: 'absolute', top: 566, left: 0, right: 0}}>
        <KineticLine
          segments={[
            {text: 'STONK ', gradient: 'linear-gradient(180deg, #FFFFFF 0%, #E8EAE2 55%, #A5A89E 100%)'},
            {text: 'ARENA', gradient: `linear-gradient(180deg, ${A.limeHot} 0%, ${A.lime} 50%, ${A.limeDeep} 100%)`},
          ]}
          start={IMPACT + 6}
          size={170}
          stagger={1.8}
          stretch={100}
          dur={26}
          tracking={0.01}
          style={{filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.8))'}}
        />
      </div>
      <div style={{position: 'absolute', top: 790, left: 0, right: 0}}>
        <KineticLine
          segments={[
            {text: 'WATCH. PREDICT. ', color: A.white},
            {text: 'BUILD. COMPETE.', color: A.lime},
          ]}
          start={IMPACT + 32}
          size={46}
          stagger={0.55}
          stretch={100}
          weight={800}
          tracking={0.16}
          rise={0.8}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 876,
          width: '100%',
          textAlign: 'center',
          fontFamily: MONO,
          fontWeight: 500,
          fontSize: 23,
          letterSpacing: '0.3em',
          color: 'rgba(246,247,242,0.62)',
          opacity: prog(f, IMPACT + 56, 18),
          transform: `translateY(${(1 - prog(f, IMPACT + 56, 18)) * 16}px)`,
        }}
      >
        AUTONOMOUS STOCK-PERP LEAGUE <span style={{color: A.lime}}>·</span> BUILT ON @PONSDOTFAMILY
      </div>
      <div style={{position: 'absolute', top: 948, width: '100%', display: 'flex', justifyContent: 'center', gap: 22, opacity: prog(f, IMPACT + 74, 18), transform: `translateY(${(1 - prog(f, IMPACT + 74, 18)) * 20}px)`}}>
        <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 26, letterSpacing: '0.04em', color: '#101400', padding: '16px 38px', borderRadius: 14, background: A.lime, boxShadow: `0 0 40px ${A.lime}88`}}>
          ENTER TRADING PIT
        </div>
        <div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 26, letterSpacing: '0.08em', color: A.white, padding: '16px 34px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.05)'}}>
          STONKARENA.XYZ
        </div>
      </div>
      <Flash amount={flash * 0.8} color="#F6FFD6" />
      <Flash amount={flashIn * 0.7} color={A.limeDeep} />
    </AbsoluteFill>
  );
};
