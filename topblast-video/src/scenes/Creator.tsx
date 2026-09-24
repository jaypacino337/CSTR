import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Flash, Glow, GridFloor, Particles, Shockwave} from '../components/Atmosphere';
import {C, DISPLAY, MONO, UI, backOut, expoIn, expoOut, inOut, lerp, prog} from '../theme';

// 17–22s: creator dials the reward allocation; energy drops into the pool;
// camera pulls back to reveal the stack: TopBlast ABOVE the venues.

const CreatorPanel: React.FC<{f: number}> = ({f}) => {
  const r = lerp(0.3, 0.8, prog(f, 12, 36, inOut));
  const rewards = 90 * r;
  const creator = 90 * (1 - r);
  const press = prog(f, 50, 8, backOut);
  const funded = f >= 56;
  const TW = 1000;
  return (
    <div
      style={{
        width: 1180,
        padding: '52px 90px 56px',
        borderRadius: 34,
        background: `linear-gradient(170deg, ${C.offWhite}, #E9E2D6)`,
        boxShadow: '0 60px 140px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.4) inset',
        color: C.ink,
        fontFamily: UI,
      }}
    >
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{fontFamily: MONO, fontSize: 17, letterSpacing: '0.3em', color: '#7A7166'}}>CREATOR CONTROLS</div>
        <div style={{fontFamily: MONO, fontSize: 15, letterSpacing: '0.2em', color: '#7A7166'}}>LAUNCH-SCOPED</div>
      </div>
      <div style={{fontFamily: DISPLAY, fontWeight: 800, fontStretch: '112%', fontSize: 58, marginTop: 14, letterSpacing: '-0.01em'}}>Reward allocation</div>
      <div style={{fontSize: 22, color: '#5C554C', marginTop: 8}}>Split your 90% creator share between holder rewards and creator revenue.</div>

      {/* slider */}
      <div style={{position: 'relative', marginTop: 70, width: TW, height: 14, borderRadius: 7, background: '#D6CEC1'}}>
        <div style={{position: 'absolute', left: 0, top: 0, height: 14, width: TW * r, borderRadius: 7, background: `linear-gradient(90deg, ${C.orangeHot}, ${C.red})`, boxShadow: `0 0 20px ${C.orange}88`}} />
        <div
          style={{
            position: 'absolute',
            left: TW * r - 24,
            top: -17,
            width: 48,
            height: 48,
            borderRadius: 24,
            background: '#fff',
            boxShadow: `0 6px 20px rgba(0,0,0,0.25), 0 0 0 6px ${C.orange}33`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: TW * r - 90,
            top: -76,
            width: 180,
            textAlign: 'center',
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 22,
            color: C.orange,
          }}
        >
          {Math.round(r * 100)}% → REWARDS
        </div>
      </div>

      {/* split readouts */}
      <div style={{display: 'flex', marginTop: 46, gap: 0}}>
        {[
          {k: 'HOLDER REWARDS', v: rewards, c: C.orange},
          {k: 'CREATOR', v: creator, c: C.ink},
          {k: 'PROTOCOL', v: 10, c: '#8A8175'},
        ].map((x) => (
          <div key={x.k} style={{flex: 1}}>
            <div style={{fontFamily: MONO, fontSize: 15, letterSpacing: '0.24em', color: '#7A7166'}}>{x.k}</div>
            <div style={{fontFamily: DISPLAY, fontWeight: 900, fontStretch: '115%', fontSize: 72, color: x.c, lineHeight: 1.05}}>
              {Math.round(x.v)}%
            </div>
          </div>
        ))}
      </div>
      <div style={{display: 'flex', height: 12, borderRadius: 6, overflow: 'hidden', marginTop: 16, width: TW}}>
        <div style={{width: `${rewards}%`, background: `linear-gradient(90deg, ${C.orangeHot}, ${C.red})`}} />
        <div style={{width: `${creator}%`, background: '#2A2724'}} />
        <div style={{width: '10%', background: '#B9B0A3'}} />
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 34}}>
        <div style={{fontFamily: MONO, fontSize: 16, color: '#7A7166', letterSpacing: '0.08em'}}>% of gross funding · deposited via verified launch-scoped tx</div>
        <div
          style={{
            padding: '18px 30px',
            borderRadius: 14,
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 19,
            letterSpacing: '0.16em',
            color: funded ? '#fff' : C.white,
            background: funded ? `linear-gradient(90deg, ${C.orangeHot}, ${C.red})` : C.ink,
            boxShadow: funded ? `0 0 40px ${C.orange}` : undefined,
            transform: `scale(${f >= 50 && f < 58 ? 1 - 0.06 * Math.sin(press * Math.PI) : 1})`,
          }}
        >
          {funded ? 'FUNDED ✓' : 'DEPOSIT & FUND POOL'}
        </div>
      </div>
    </div>
  );
};

const Slab: React.FC<{
  y: number;
  p: number;
  face: string;
  edge: string;
  glow: string;
  drop?: number;
  children: React.ReactNode;
}> = ({y, p, face, edge, glow, drop = 60, children}) => (
  <div
    style={{
      position: 'absolute',
      left: 960 - 600,
      top: y - 80 - (1 - p) * drop,
      width: 1200,
      height: 160,
      opacity: Math.min(1, p * 1.6),
    }}
  >
    <div style={{position: 'absolute', inset: 0, perspective: 1400}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: -40,
          width: 1200,
          height: 220,
          transformOrigin: 'center',
          transform: 'rotateX(62deg)',
          borderRadius: 26,
          background: face,
          border: `1.5px solid ${edge}`,
          boxShadow: `0 0 60px ${glow}, inset 0 0 60px rgba(255,255,255,0.05)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 16,
          right: 16,
          top: 118,
          height: 22,
          borderRadius: '0 0 16px 16px',
          background: `linear-gradient(180deg, ${edge}, rgba(0,0,0,0.6))`,
          opacity: 0.6,
        }}
      />
    </div>
    <div style={{position: 'absolute', inset: 0, top: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
  </div>
);

const Chevrons: React.FC<{y: number; f: number; o: number}> = ({y, f, o}) => (
  <div style={{position: 'absolute', left: 960 - 20, top: y - 30, width: 40, height: 60, opacity: o}}>
    {[0, 1, 2].map((i) => {
      const t = ((f / 14 + i / 3) % 1);
      return (
        <svg key={i} width={40} height={20} viewBox="0 0 40 20" style={{position: 'absolute', top: 40 - t * 40, opacity: Math.sin(t * Math.PI)}}>
          <path d="M4 16 L20 4 L36 16" stroke={C.orangeHot} strokeWidth={4} fill="none" strokeLinecap="round" style={{filter: `drop-shadow(0 0 6px ${C.orange})`}} />
        </svg>
      );
    })}
  </div>
);

export const Creator: React.FC = () => {
  const f = useCurrentFrame();
  const cardIn = prog(f, 0, 18);
  const cardOut = prog(f, 64, 22, expoIn);
  const beam = prog(f, 56, 18, expoOut);
  const beamOut = prog(f, 78, 12);

  const tokenIn = prog(f, 84, 18, expoOut);
  const venueIn = prog(f, 94, 18, expoOut);
  const topIn = prog(f, 106, 14, expoIn);
  const landed = f >= 120;
  const land = prog(f, 120, 26, expoOut);
  const camera = prog(f, 80, 84, inOut);

  return (
    <AbsoluteFill style={{background: C.bg, overflow: 'hidden'}}>
      <GridFloor color="rgba(255,255,255,0.08)" speed={2} horizon={700} />
      <Glow x={960} y={560} size={1600} color="rgba(255,106,0,0.28)" opacity={0.5 + land * 0.5} />
      <Particles count={80} seed="cr" color="#FFD2AE" speed={0.8} opacity={0.4} maxSize={1.8} />

      {/* Part A — creator control panel (warm off-white UI) */}
      {f < 96 && (
        <>
          <div
            style={{
              position: 'absolute',
              left: 960 - 55 - 4,
              top: 560,
              width: 118,
              height: 1200 * beam,
              background: `linear-gradient(to bottom, ${C.yellow}, ${C.orange} 40%, rgba(255,45,20,0))`,
              filter: 'blur(14px)',
              opacity: (1 - beamOut) * 0.9,
              mixBlendMode: 'screen',
            }}
          />
          <AbsoluteFill
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              transform: `translateY(${lerp(60, 0, cardIn) - cardOut * 700}px) scale(${lerp(0.94, 1, cardIn) * lerp(1, 0.7, cardOut)}) perspective(1800px) rotateX(${lerp(10, 0, cardIn) + cardOut * 25}deg)`,
              opacity: cardIn * (1 - cardOut),
            }}
          >
            <CreatorPanel f={f} />
          </AbsoluteFill>
        </>
      )}

      {/* Part B — the stack */}
      <AbsoluteFill style={{transform: `scale(${lerp(1.08, 0.96, camera)}) translateY(${lerp(20, 0, camera)}px)`}}>
        <Slab y={800} p={tokenIn} face="linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.03))" edge="rgba(255,255,255,0.35)" glow="rgba(255,255,255,0.06)">
          <div style={{fontFamily: DISPLAY, fontWeight: 900, fontStretch: '120%', fontSize: 46, color: C.white, letterSpacing: '0.12em'}}>TOKEN</div>
        </Slab>
        <Chevrons y={680} f={f} o={venueIn} />
        <Slab
          y={560}
          p={venueIn}
          face={`linear-gradient(90deg, rgba(44,123,255,0.45), rgba(20,22,30,0.9) 50%, rgba(25,195,125,0.45))`}
          edge="rgba(150,200,255,0.6)"
          glow="rgba(44,123,255,0.25)"
        >
          <div style={{fontFamily: DISPLAY, fontWeight: 900, fontStretch: '120%', fontSize: 56}}>
            <span style={{color: C.white}}>STONK</span>
            <span style={{color: C.blueHot}}>FUN</span>
            <span style={{color: C.dim}}> + </span>
            <span style={{color: C.white}}>PUMP.</span>
            <span style={{color: C.greenHot}}>FUN</span>
          </div>
          <div style={{fontFamily: MONO, fontSize: 17, letterSpacing: '0.34em', color: C.dim, marginTop: 8}}>LAUNCH + LIQUIDITY</div>
        </Slab>
        <Chevrons y={440} f={f} o={landed ? 1 : 0} />
        <Slab
          y={300}
          p={topIn}
          drop={520}
          face={`linear-gradient(180deg, rgba(255,120,20,0.75), rgba(255,45,20,0.35))`}
          edge={C.orangeHot}
          glow={`rgba(255,106,0,${0.5 + land * 0.4})`}
        >
          <div
            style={{
              fontFamily: DISPLAY,
              fontWeight: 900,
              fontStretch: '125%',
              fontSize: 76,
              color: '#FFF6EC',
              textShadow: `0 0 30px ${C.orange}`,
              letterSpacing: '0.02em',
            }}
          >
            TOPBLAST
          </div>
          <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 18, letterSpacing: '0.34em', color: '#FFE3C8', marginTop: 6}}>REWARD INFRASTRUCTURE</div>
        </Slab>
        <Shockwave x={960} y={300} t={land} maxR={900} width={5} />
        <div
          style={{
            position: 'absolute',
            left: 1580,
            top: 250,
            fontFamily: MONO,
            fontSize: 16,
            letterSpacing: '0.24em',
            color: C.orangeHot,
            opacity: prog(f, 124, 14),
            lineHeight: 1.7,
          }}
        >
          ← LAYER ABOVE
          <br />
          <span style={{color: C.dim}}>NOT A REPLACEMENT</span>
        </div>
      </AbsoluteFill>

      <div
        style={{
          position: 'absolute',
          top: 58,
          width: '100%',
          textAlign: 'center',
          fontFamily: DISPLAY,
          fontWeight: 900,
          fontStretch: '120%',
          fontSize: 50,
          color: C.white,
          letterSpacing: '0.04em',
          opacity: prog(f, 128, 14),
          transform: `translateY(${(1 - prog(f, 128, 14)) * 20}px)`,
        }}
      >
        A LAYER. <span style={{color: C.orangeHot}}>NOT ANOTHER ISLAND.</span>
      </div>
      <Flash amount={landed ? Math.max(0, 1 - (f - 120) / 10) * 0.5 : 0} color="#FF8A30" />
    </AbsoluteFill>
  );
};
