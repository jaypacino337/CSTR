import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {C, DISPLAY, MONO, UI, inOut, lerp, prog} from '../theme';
import {FadeWords, INK, SOFT} from '../premium/ui';

// 0–5s. Say what it is, immediately: launch WITH TopBlast, holders rewarded in
// the Blast Zone, via StonkFun or Pump.fun, with a $TOPBLAST revenue loop.
const ENGINE_Y = 640;
const RAIL_Y = 760;
export const CHART_TOP_Y = 300;
export const CHART_L = 220;
export const CHART_R = 1640;

export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const logo = prog(f, 4, 24, inOut);
  const rails = prog(f, 64, 26, inOut);
  const engine = prog(f, 72, 24, inOut);
  const flow = prog(f, 80, 20, inOut);
  const exit = prog(f, 128, 22, inOut);
  const rest = 1 - prog(f, 124, 14, inOut);

  const engL = exit > 0 ? lerp(560, CHART_L, exit) : lerp(960, 560, engine);
  const engR = exit > 0 ? lerp(1360, CHART_R, exit) : lerp(960, 1360, engine);
  const engY = lerp(ENGINE_Y, CHART_TOP_Y, exit);

  const rail = (x: number, color: string, hot: string, a: string, b: string) => (
    <div style={{position: 'absolute', left: x - 170, top: RAIL_Y, width: 340, textAlign: 'center', opacity: rails, transform: `translateY(${(1 - rails) * 14}px)`}}>
      <div style={{height: 1.5, background: `linear-gradient(90deg, transparent, ${color}, transparent)`, marginBottom: 16}} />
      <div style={{fontFamily: DISPLAY, fontWeight: 800, fontStretch: '115%', fontSize: 30, letterSpacing: '0.04em'}}>
        <span style={{color: C.white}}>{a}</span>
        <span style={{color: hot}}>{b}</span>
      </div>
      <div style={{fontFamily: MONO, fontSize: 12, letterSpacing: '0.34em', color: SOFT, marginTop: 6}}>LAUNCH RAIL</div>
    </div>
  );

  return (
    <AbsoluteFill style={{background: INK}}>
      <div style={{position: 'absolute', inset: 0, opacity: rest}}>
        <div style={{position: 'absolute', left: 960 - 75, top: 120, width: 150, height: 150, opacity: logo, transform: `scale(${lerp(0.96, 1, logo)})`}}>
          <Img src={staticFile('logo.png')} style={{width: '100%', height: '100%', filter: 'drop-shadow(0 0 1.5px rgba(255,200,160,0.8)) drop-shadow(0 0 18px rgba(255,106,0,0.3))'}} />
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 318}}>
          <FadeWords
            segments={[
              {text: 'LAUNCH WITH ', color: C.white},
              {text: 'TOPBLAST.', color: C.orangeHot},
            ]}
            start={12}
            dur={24}
            stagger={4}
            size={92}
            font={UI}
            weight={800}
            tracking={-0.01}
          />
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 440}}>
          <FadeWords
            segments={[
              {text: 'REWARD HOLDERS THROUGH THE ', color: C.white},
              {text: 'BLAST ZONE.', color: '#FFB27A'},
            ]}
            start={28}
            dur={22}
            stagger={3}
            size={42}
            font={UI}
            weight={700}
            tracking={0.01}
          />
        </div>

        {/* rails feeding up into the reward engine */}
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          {[
            {x: 620, c: C.blueHot, tx: 820},
            {x: 1300, c: C.greenHot, tx: 1100},
          ].map((r) => {
            const d = `M ${r.x} ${RAIL_Y} C ${r.x} ${RAIL_Y - 70}, ${r.tx} ${ENGINE_Y + 70}, ${r.tx} ${ENGINE_Y + 2}`;
            return (
              <g key={r.x}>
                <path d={d} pathLength={1} fill="none" stroke={r.c} strokeOpacity={0.45} strokeWidth={1.3} strokeDasharray={`${flow} 1`} />
                {flow >= 1 &&
                  [0, 0.5].map((k) => (
                    <path key={k} d={d} pathLength={1} fill="none" stroke={r.c} strokeWidth={2.2} strokeLinecap="round" strokeDasharray="0.07 0.93" strokeDashoffset={-((f * 0.022 + k) % 1)} />
                  ))}
              </g>
            );
          })}
        </svg>
        {rail(620, C.blue, C.blueHot, 'STONK', 'FUN')}
        {rail(1300, C.green, C.greenHot, 'PUMP.', 'FUN')}
        <div style={{position: 'absolute', left: 0, right: 0, top: ENGINE_Y - 38, textAlign: 'center', fontFamily: MONO, fontSize: 13, letterSpacing: '0.4em', color: '#FFB27A', opacity: engine}}>
          TOPBLAST REWARD ENGINE
        </div>

        <div style={{position: 'absolute', left: 0, right: 0, top: 880}}>
          <FadeWords segments="CHOOSE YOUR LAUNCH RAIL." start={74} size={34} font={UI} weight={700} tracking={0.04} style={{color: C.white}} />
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 928}}>
          <FadeWords
            segments={[
              {text: 'TOPBLAST ', color: C.orangeHot},
              {text: 'ADDS THE REWARD ENGINE.', color: C.white},
            ]}
            start={88}
            size={34}
            font={UI}
            weight={700}
            tracking={0.04}
          />
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 1006, textAlign: 'center', fontFamily: MONO, fontSize: 14, letterSpacing: '0.3em', color: SOFT, opacity: prog(f, 104, 16, inOut)}}>
          + PROTOCOL REVENUE → <span style={{color: '#FFB27A'}}>$TOPBLAST</span> BUYBACK + BURN
        </div>
      </div>

      {/* the reward-engine line; at the end it becomes the chart's top gridline */}
      <div
        style={{
          position: 'absolute',
          left: engL,
          width: engR - engL,
          top: engY - 0.75,
          height: 1.5,
          background: exit > 0.6 ? 'rgba(255,255,255,0.12)' : C.orangeHot,
          boxShadow: exit > 0.6 ? undefined : '0 0 10px rgba(255,106,0,0.7)',
          opacity: engine,
        }}
      />
    </AbsoluteFill>
  );
};
