import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, DISPLAY, MONO, inOut, lerp, prog} from '../theme';
import {FadeWords, HAIR, INK, SOFT} from '../premium/ui';

// Creator side: one split, set once. Holder reward funding ↔ creator revenue.
const BAR_W = 980;

export const Creator: React.FC = () => {
  const f = useCurrentFrame();
  const inP = prog(f, 4, 18, inOut);
  const r = lerp(0.4, 0.8, prog(f, 22, 36, inOut));
  const holders = 90 * r;
  const creator = 90 * (1 - r);
  const out = prog(f, 86, 14, inOut);

  return (
    <AbsoluteFill style={{background: INK, opacity: 1 - out}}>
      <div style={{position: 'absolute', left: 960 - 700, top: 200, width: 1400, height: 800, background: 'radial-gradient(ellipse at 50% 40%, rgba(255,106,0,0.08), transparent 60%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 170}}>
        <FadeWords
          segments={[
            {text: 'CREATORS CONTROL THE ', color: C.white},
            {text: 'REWARD SPLIT.', color: '#FFB27A'},
          ]}
          start={2}
          size={52}
          weight={700}
          tracking={0.01}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 960 - 580,
          top: 320,
          width: 1160,
          height: 440,
          borderRadius: 22,
          background: 'linear-gradient(180deg, rgba(20,20,22,0.96), rgba(11,11,13,0.98))',
          border: `1px solid ${HAIR}`,
          boxShadow: '0 40px 100px rgba(0,0,0,0.55)',
          opacity: inP,
          transform: `translateY(${(1 - inP) * 16}px)`,
        }}
      >
        <div style={{position: 'absolute', left: 90, top: 40, fontFamily: MONO, fontSize: 13, letterSpacing: '0.3em', color: SOFT}}>LAUNCH ALLOCATION</div>
        <div style={{position: 'absolute', right: 90, top: 40, fontFamily: MONO, fontSize: 13, letterSpacing: '0.3em', color: SOFT}}>CREATOR SHARE 90%</div>

        {/* two sides */}
        <div style={{position: 'absolute', left: 90, top: 92}}>
          <div style={{fontFamily: DISPLAY, fontWeight: 800, fontStretch: '110%', fontSize: 84, color: '#FFB27A', lineHeight: 1}}>{Math.round(holders)}%</div>
          <div style={{fontFamily: MONO, fontSize: 14, letterSpacing: '0.26em', color: C.white, marginTop: 10}}>HOLDER REWARD FUNDING</div>
        </div>
        <div style={{position: 'absolute', right: 90, top: 92, textAlign: 'right'}}>
          <div style={{fontFamily: DISPLAY, fontWeight: 800, fontStretch: '110%', fontSize: 84, color: C.white, lineHeight: 1}}>{Math.round(creator)}%</div>
          <div style={{fontFamily: MONO, fontSize: 14, letterSpacing: '0.26em', color: C.white, marginTop: 10}}>CREATOR REVENUE</div>
        </div>

        {/* split bar */}
        <div style={{position: 'absolute', left: 90, top: 262, width: BAR_W, height: 18, borderRadius: 9, overflow: 'hidden', display: 'flex', background: 'rgba(255,255,255,0.06)'}}>
          <div style={{width: `${holders}%`, background: `linear-gradient(90deg, ${C.orange}, #FFB27A)`}} />
          <div style={{width: `${creator}%`, background: 'rgba(247,244,238,0.75)'}} />
          <div style={{width: '10%', backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.25) 0 3px, transparent 3px 7px)'}} />
        </div>
        <div style={{position: 'absolute', left: 90 + BAR_W * (holders / 100) - 14, top: 257, width: 28, height: 28, borderRadius: 14, background: C.white, boxShadow: '0 2px 12px rgba(0,0,0,0.6), 0 0 0 5px rgba(255,138,31,0.25)'}} />
        <div style={{position: 'absolute', left: 90 + BAR_W * 0.9, top: 298, width: BAR_W * 0.1, textAlign: 'center', fontFamily: MONO, fontSize: 12, letterSpacing: '0.2em', color: SOFT}}>PROTOCOL 10%</div>

        <div style={{position: 'absolute', left: 90, bottom: 40, fontFamily: MONO, fontSize: 13, letterSpacing: '0.24em', color: C.greenHot, opacity: prog(f, 60, 14, inOut)}}>
          ✓ REWARDS ARE FUNDED ON-CHAIN BEFORE THEY DISTRIBUTE
        </div>
      </div>
    </AbsoluteFill>
  );
};
