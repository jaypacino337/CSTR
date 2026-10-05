import {useCurrentFrame} from 'remotion';
import {C, MONO, inOut, prog} from '../theme';

// A quiet progress rail across the top: BUY → ENTRY LINE → BELOW ENTRY → BLAST ZONE → REWARDS.
// `at` values are frames relative to this Sequence's start.
export const Tracker: React.FC<{at: number[]; dur: number}> = ({at, dur}) => {
  const f = useCurrentFrame();
  const steps = ['BUY', 'ENTRY LINE', 'BELOW ENTRY', 'BLAST ZONE', 'REWARDS'];
  const vis = Math.min(prog(f, 0, 14, inOut), 1 - prog(f, dur - 14, 14, inOut));
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 34, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, opacity: vis, fontFamily: MONO, fontSize: 13, letterSpacing: '0.24em'}}>
      {steps.map((s, i) => {
        const on = prog(f, at[i], 10, inOut);
        const current = on > 0.5 && (i === steps.length - 1 || f < at[i + 1]);
        return (
          <div key={s} style={{display: 'flex', alignItems: 'center', gap: 18}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 9, color: on > 0.5 ? (current ? '#FFE3CC' : 'rgba(255,178,122,0.8)') : 'rgba(247,244,238,0.28)'}}>
              <div style={{width: 7, height: 7, borderRadius: 4, background: on > 0.5 ? C.orangeHot : 'rgba(247,244,238,0.2)', boxShadow: current ? `0 0 10px ${C.orange}` : undefined}} />
              {s}
            </div>
            {i < steps.length - 1 && <div style={{width: 34, height: 1, background: on > 0.5 && f > at[i + 1] ? 'rgba(255,138,31,0.7)' : 'rgba(247,244,238,0.15)'}} />}
          </div>
        );
      })}
    </div>
  );
};
