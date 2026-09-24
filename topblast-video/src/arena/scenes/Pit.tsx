import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Glow, Particles} from '../../components/Atmosphere';
import {KineticLine} from '../../components/Type';
import {DISPLAY, MONO, expoOut, inOut, lerp, prog} from '../../theme';
import {A, AGENTS} from '../theme';
import {AgentMark} from './Fight';

// 12–17s: ENTER THE PIT — timing tower, verified fills + decision summaries, predict the winner.
const ORDERS = [
  ['GROK', 'CLAUDE', 'QWEN', 'CHATGPT'],
  ['QWEN', 'GROK', 'CLAUDE', 'CHATGPT'],
  ['QWEN', 'GROK', 'CHATGPT', 'CLAUDE'],
];
const GAPS = [
  ['LEADER', '-0.84', '-1.52', '-2.10'],
  ['LEADER', '-0.31', '-1.77', '-2.46'],
  ['LEADER', '-1.12', '-1.40', '-1.95'],
];
const SWAPS = [42, 86];
const FEED = [
  {a: 'GROK', txt: 'LONG NVDA · 3x', tag: 'FILLED'},
  {a: 'CLAUDE', txt: 'SHORT META · 2x', tag: 'FILLED'},
  {a: 'QWEN', txt: '“Breakout confirmed — adding size.”', tag: 'DECISION'},
  {a: 'CHATGPT', txt: 'CLOSE HOOD · +1.8%', tag: 'FILLED'},
  {a: 'QWEN', txt: 'LONG TSLA · 4x', tag: 'FILLED'},
  {a: 'GROK', txt: '“Momentum intact. Holding.”', tag: 'DECISION'},
];
const ODDS = [
  [34, 22, 26, 18],
  [29, 20, 21, 30],
  [27, 19, 17, 37],
];
const color = (n: string) => AGENTS.find((x) => x.n === n)!.c;

export const Pit: React.FC = () => {
  const f = useCurrentFrame();
  const inA = prog(f, 0, 18);
  const inB = prog(f, 6, 18);
  const inC = prog(f, 14, 18);
  const s1 = prog(f, SWAPS[0], 16, inOut);
  const s2 = prog(f, SWAPS[1], 16, inOut);
  const phase = f < SWAPS[0] + 8 ? 0 : f < SWAPS[1] + 8 ? 1 : 2;
  const ROW = 96;

  const panel = (p: number, extra: React.CSSProperties): React.CSSProperties => ({
    position: 'absolute',
    borderRadius: 22,
    background: 'linear-gradient(170deg, rgba(24,25,21,0.86), rgba(8,8,7,0.94))',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 30px 90px rgba(0,0,0,0.6)',
    opacity: p,
    transform: `translateY(${(1 - p) * 50}px)`,
    overflow: 'hidden',
    ...extra,
  });
  const label: React.CSSProperties = {fontFamily: MONO, fontSize: 15, letterSpacing: '0.26em', color: A.dim};

  return (
    <AbsoluteFill style={{background: A.bg, overflow: 'hidden'}}>
      <Glow x={960} y={300} size={1800} color="rgba(216,255,26,0.13)" />
      <Particles count={90} seed="pit" color={A.limeHot} speed={1.2} opacity={0.35} maxSize={2} />

      {/* timing tower */}
      <div style={panel(inA, {left: 110, top: 96, width: 640, height: 500})}>
        <div style={{...label, position: 'absolute', left: 30, top: 24}}>
          <span style={{color: A.lime}}>●</span> TIMING TOWER
        </div>
        {AGENTS.map((ag) => {
          const r = lerp(lerp(ORDERS[0].indexOf(ag.n), ORDERS[1].indexOf(ag.n), s1), ORDERS[2].indexOf(ag.n), s2);
          const shown = ORDERS[phase].indexOf(ag.n);
          const lead = shown === 0;
          const moving = Math.abs(r - Math.round(r)) > 0.02;
          return (
            <div
              key={ag.n}
              style={{
                position: 'absolute',
                left: 22,
                right: 22,
                top: 72 + r * (ROW + 8),
                height: ROW,
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                padding: '0 22px',
                background: lead ? 'linear-gradient(90deg, rgba(216,255,26,0.2), rgba(216,255,26,0.02))' : 'rgba(255,255,255,0.035)',
                border: `1px solid ${lead ? A.lime : 'rgba(255,255,255,0.06)'}`,
                boxShadow: lead ? '0 0 36px rgba(216,255,26,0.3)' : moving ? '0 16px 30px rgba(0,0,0,0.6)' : undefined,
                zIndex: moving ? 5 : 1,
                transform: `scale(${moving ? 1.03 : 1})`,
              }}
            >
              <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 40, width: 40, color: lead ? A.lime : A.dim}}>{shown + 1}</div>
              <AgentMark size={48} color={lead ? A.lime : ag.c} glow={lead ? 1.5 : 0.5} />
              <div style={{flex: 1, fontFamily: DISPLAY, fontWeight: 900, fontSize: 38, color: A.white}}>{ag.n}</div>
              <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 24, color: lead ? A.lime : A.dim}}>{GAPS[phase][shown]}</div>
            </div>
          );
        })}
      </div>

      {/* verified fills + decision summaries */}
      <div style={panel(inB, {left: 780, top: 96, width: 1030, height: 500})}>
        <div style={{...label, position: 'absolute', left: 30, top: 24}}>
          <span style={{color: A.lime}}>●</span> VERIFIED FILLS · DECISION SUMMARIES
        </div>
        {FEED.map((e, i) => {
          const t0 = 12 + i * 15;
          const born = prog(f, t0, 12, expoOut);
          const newer = FEED.filter((_, j) => j > i).reduce((acc, _, k) => acc + prog(f, 12 + (i + 1 + k) * 15, 12, expoOut), 0);
          const y = 72 + newer * 70;
          const isDec = e.tag === 'DECISION';
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 22,
                right: 22,
                top: y,
                height: 60,
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                padding: '0 20px',
                background: 'rgba(255,255,255,0.035)',
                border: `1px solid ${newer < 0.5 && born > 0.5 ? 'rgba(216,255,26,0.45)' : 'rgba(255,255,255,0.06)'}`,
                opacity: born * (y > 430 ? Math.max(0, 1 - (y - 430) / 60) : 1),
                transform: `translateX(${(1 - born) * 60}px)`,
              }}
            >
              <div style={{fontFamily: MONO, fontSize: 15, color: 'rgba(255,255,255,0.35)', width: 80}}>{`14:0${2 + i}:1${i}`}</div>
              <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 24, color: color(e.a), width: 130}}>{e.a}</div>
              <div style={{flex: 1, fontFamily: isDec ? 'Inter, sans-serif' : MONO, fontStyle: isDec ? 'italic' : 'normal', fontWeight: isDec ? 400 : 700, fontSize: 22, color: A.white, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{e.txt}</div>
              <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 13, letterSpacing: '0.2em', padding: '6px 12px', borderRadius: 999, color: isDec ? A.white : '#101400', background: isDec ? 'rgba(255,255,255,0.1)' : A.lime}}>
                {isDec ? 'DECISION' : 'VERIFIED ✓'}
              </div>
            </div>
          );
        })}
      </div>

      {/* predict the winner */}
      <div style={panel(inC, {left: 110, top: 620, width: 1700, height: 210})}>
        <div style={{...label, position: 'absolute', left: 30, top: 22}}>
          <span style={{color: A.lime}}>●</span> OUTCOME-MARKETS · WHO FINISHES ON TOP?
        </div>
        <div style={{position: 'absolute', right: 26, top: 16, padding: '10px 26px', borderRadius: 12, background: A.lime, color: '#101400', fontFamily: DISPLAY, fontWeight: 900, fontSize: 20, letterSpacing: '0.08em', boxShadow: `0 0 26px ${A.lime}88`, transform: `scale(${1 + 0.05 * Math.sin(prog(f, 120, 10) * Math.PI)})`}}>
          PREDICT
        </div>
        <div style={{position: 'absolute', left: 30, right: 30, top: 76, display: 'flex', gap: 26}}>
          {AGENTS.map((ag, i) => {
            const o = lerp(lerp(ODDS[0][i], ODDS[1][i], s1), ODDS[2][i], s2);
            const top = ODDS[phase][i] === Math.max(...ODDS[phase]);
            return (
              <div key={ag.n} style={{flex: 1}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                  <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 28, color: A.white}}>{ag.n}</div>
                  <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 30, color: top ? A.lime : A.white}}>{Math.round(o)}%</div>
                </div>
                <div style={{height: 12, borderRadius: 6, background: 'rgba(255,255,255,0.08)', marginTop: 14, overflow: 'hidden'}}>
                  <div style={{height: '100%', width: `${o * 2.2 * prog(f, 20, 24, expoOut)}%`, borderRadius: 6, background: top ? A.lime : ag.c, boxShadow: top ? `0 0 16px ${A.lime}` : undefined}} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{position: 'absolute', top: 872, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 36}}>
        <KineticLine segments="WATCH AI." start={100} size={96} stretch={100} style={{color: A.white}} />
        <KineticLine segments={[{text: 'PREDICT THE WINNER.', gradient: `linear-gradient(180deg, ${A.limeHot}, ${A.limeDeep})`}]} start={112} size={96} stretch={100} />
      </div>
      <div style={{position: 'absolute', top: 996, width: '100%', textAlign: 'center', fontFamily: MONO, fontSize: 18, letterSpacing: '0.16em', color: A.dim, opacity: prog(f, 128, 14)}}>
        EVERY ORDER, ENTRY, EXIT, POSITION AND P&amp;L MOVE IS PUBLIC
      </div>
    </AbsoluteFill>
  );
};
