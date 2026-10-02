import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {DISPLAY, MONO, UI, expoOut, inOut, lerp, prog} from '../../theme';
import {FadeWords} from '../../premium/ui';
import {CLOSE, CLOSE_F, G, G_DIM, G_SOFT, HAIR, INK, LOCK_F, RED, ROWS, SOFT, WIN_ROW, lowOf, spyAt} from './shared';

// One continuous board: SPY range ladder (left) + a context panel (right)
// that walks through ENTER → CHECKS → LOCK → CLOSE.
const LX = 140;
const LY = 250;
const LW = 760;
const ROW_H = 66;
const ROW0 = LY + 78;
const rowY = (i: number) => ROW0 + i * ROW_H;
const priceY = (p: number) => ROW0 + ((lowOf(0) + 0.25 - p) / 0.25) * ROW_H;
const RX = 980;
const RW = 800;
const WALLETS = ['Rg7a…4fQ', 'Hk2d…9Lm', 'Pz8w…c1V', 'Tn5q…X2e', 'Wq4F…7sD', 'Bc9m…Kt3', 'Mv1s…8Ry', 'Ld6e…Qp4', 'Fx3t…Nb7'];

const Check: React.FC<{on: number; bad?: boolean}> = ({on, bad}) => (
  <div style={{width: 30, height: 30, borderRadius: 15, border: `1.5px solid ${bad ? RED : G}`, background: bad ? 'rgba(255,90,90,0.12)' : 'rgba(57,255,74,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: on, transform: `scale(${0.8 + 0.2 * on})`, flexShrink: 0}}>
    <svg width={16} height={16} viewBox="0 0 16 16">
      {bad ? <path d="M4 4 L12 12 M12 4 L4 12" stroke={RED} strokeWidth={2.4} strokeLinecap="round" /> : <path d="M3 8.5 L6.5 12 L13 4.5" stroke={G} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeDasharray={20} strokeDashoffset={20 * (1 - on)} />}
    </svg>
  </div>
);

const Lock: React.FC<{size?: number; color?: string}> = ({size = 16, color = SOFT}) => (
  <svg width={size} height={size} viewBox="0 0 16 16">
    <rect x={3} y={7} width={10} height={8} rx={1.5} fill="none" stroke={color} strokeWidth={1.5} />
    <path d="M5.5 7 V5 a2.5 2.5 0 0 1 5 0 V7" fill="none" stroke={color} strokeWidth={1.5} />
  </svg>
);

const card = (p: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
  position: 'absolute',
  borderRadius: 20,
  background: 'linear-gradient(180deg, rgba(12,20,13,0.94), rgba(6,10,7,0.97))',
  border: `1px solid ${HAIR}`,
  boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
  opacity: p,
  transform: `translateY(${(1 - p) * 16}px)`,
  ...extra,
});

export const Game: React.FC = () => {
  const f = useCurrentFrame();
  const spy = spyAt(f);
  const locked = f >= LOCK_F;
  const won = prog(f, CLOSE_F + 6, 20, inOut);
  const ladderIn = prog(f, 0, 20, inOut);

  // phase windows for the right panel
  const pQuote = Math.min(prog(f, 6, 18, inOut), 1 - prog(f, 64, 14, inOut));
  const pEnter = Math.min(prog(f, 74, 18, inOut), 1 - prog(f, 196, 14, inOut));
  const pLock = Math.min(prog(f, 206, 18, inOut), 1 - prog(f, 326, 14, inOut));
  const pChart = prog(f, 336, 18, inOut);

  const sent = prog(f, 112, 20, inOut);
  const dupe = prog(f, 214, 18, inOut);
  const dayCursor = lerp(0.33, 0.83, prog(f, 216, 110, inOut)); // fraction of 9:30→16:00
  const LOCK_FRAC = 3.5 / 6.5; // 1:00 PM

  return (
    <AbsoluteFill style={{background: INK}}>
      <div style={{position: 'absolute', left: -200, top: 100, width: 1400, height: 1000, background: 'radial-gradient(circle at 40% 50%, rgba(57,255,74,0.07), transparent 60%)'}} />

      {/* captions */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 96}}>
        {[
          {a: 'EVERY ', b: '$0.25 RANGE', c: ' OF SPY HAS ITS OWN WALLET.', s: 8, e: 66},
          {a: 'SEND ', b: '1 TOKEN', c: ' TO YOUR RANGE.', s: 84, e: 146},
          {a: 'HOLD ', b: '500K', c: '. ONE GUESS PER DAY.', s: 154, e: 204},
          {a: 'ENTRIES ', b: 'LOCK 3 HOURS', c: ' BEFORE CLOSE.', s: 214, e: 328},
          {a: "SPY'S ", b: 'CLOSE', c: ' PICKS THE WINNERS.', s: 340, e: 999},
        ].map((t) => (
          <div key={t.s} style={{position: 'absolute', left: 0, right: 0}}>
            <FadeWords
              segments={[
                {text: t.a, color: '#fff'},
                {text: t.b, color: G},
                {text: t.c, color: '#fff'},
              ]}
              start={t.s}
              size={50}
              font={UI}
              weight={800}
              tracking={0}
              exitAt={t.e}
            />
          </div>
        ))}
      </div>

      {/* ── ladder ── */}
      <div style={card(ladderIn, {left: LX, top: LY, width: LW, height: 700})} />
      <div style={{position: 'absolute', left: LX + 32, top: LY + 26, right: 1920 - LX - LW + 32, display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 14, letterSpacing: '0.24em', color: SOFT, opacity: ladderIn}}>
        <span>
          <span style={{color: G}}>●</span> SPY CLOSE · $0.25 RANGES
        </span>
        <span style={{display: 'flex', alignItems: 'center', gap: 10, color: locked ? G_SOFT : SOFT}}>
          {locked ? (
            <>
              <Lock color={G_SOFT} /> LOCKED
            </>
          ) : (
            'OPEN'
          )}
        </span>
      </div>
      {new Array(ROWS).fill(0).map((_, i) => {
        const inP = prog(f, 4 + i * 2.5, 16, inOut);
        const lo = lowOf(i);
        const mine = i === WIN_ROW && f >= 128;
        const winner = i === WIN_ROW ? won : 0;
        const dim = won > 0 && i !== WIN_ROW ? 1 - 0.6 * won : 1;
        const base = Math.floor(4 + random(`e${i}`) * 38 * (1 - Math.abs(i - 4) / 6));
        const grow = Math.floor(prog(f, 20, LOCK_F - 20) * (6 + random(`g${i}`) * 30));
        const count = base + grow + (mine ? 1 : 0);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: LX + 20,
              width: LW - 40,
              top: rowY(i),
              height: ROW_H - 8,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              padding: '0 22px',
              gap: 22,
              boxSizing: 'border-box',
              background: winner > 0 ? `rgba(57,255,74,${0.08 + 0.14 * winner})` : mine ? 'rgba(57,255,74,0.07)' : 'rgba(255,255,255,0.025)',
              border: `1px solid ${winner > 0.5 ? G : mine ? G_DIM : 'rgba(255,255,255,0.05)'}`,
              boxShadow: winner > 0 ? `0 0 ${40 * winner}px rgba(57,255,74,0.35)` : undefined,
              opacity: inP * dim,
              transform: `translateX(${(1 - inP) * -20}px) scale(${1 + 0.02 * winner})`,
            }}
          >
            <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 24, color: winner > 0.5 ? G : '#fff', width: 250}}>
              {lo.toFixed(2)} – {(lo + 0.25).toFixed(2)}
            </div>
            <div style={{fontFamily: MONO, fontSize: 14, color: SOFT, flex: 1}}>{WALLETS[i]}</div>
            {mine && <div style={{fontFamily: MONO, fontSize: 12, letterSpacing: '0.2em', color: '#041a06', background: G, padding: '4px 10px', borderRadius: 6}}>{winner > 0.5 ? 'WINNING RANGE' : 'YOUR GUESS'}</div>}
            <div style={{fontFamily: MONO, fontSize: 15, color: SOFT, width: 90, textAlign: 'right', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8}}>
              {locked && <Lock size={13} />}
              {count}
            </div>
          </div>
        );
      })}
      {/* live SPY marker */}
      <div style={{position: 'absolute', left: LX - 118, top: priceY(spy) - 16, display: 'flex', alignItems: 'center', opacity: ladderIn}}>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 15, color: '#041a06', background: G, padding: '6px 10px', borderRadius: 6, boxShadow: `0 0 18px ${G}`}}>SPY {spy.toFixed(2)}</div>
        <div style={{width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: `10px solid ${G}`}} />
      </div>
      <div style={{position: 'absolute', left: LX + 10, width: LW - 20, top: priceY(spy) - 0.5, height: 1, background: G, opacity: 0.5 * ladderIn}} />

      {/* ── right panel: quote ── */}
      <div style={card(pQuote, {left: RX, top: LY, width: RW, height: 380, padding: 44, boxSizing: 'border-box'})}>
        <div style={{fontFamily: MONO, fontSize: 14, letterSpacing: '0.3em', color: SOFT}}>SPDR S&amp;P 500 ETF · LIVE</div>
        <div style={{fontFamily: DISPLAY, fontWeight: 800, fontStretch: '112%', fontSize: 64, color: '#fff', marginTop: 18}}>SPY</div>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 92, color: G, lineHeight: 1.1}}>{spy.toFixed(2)}</div>
        <div style={{fontFamily: MONO, fontSize: 16, letterSpacing: '0.26em', color: SOFT, marginTop: 14}}>GUESS WHERE IT CLOSES TODAY.</div>
      </div>

      {/* ── right panel: enter ── */}
      <div style={card(pEnter, {left: RX, top: LY, width: RW, height: 200, padding: '34px 44px', boxSizing: 'border-box'})}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 14, letterSpacing: '0.26em', color: SOFT}}>
          <span>YOUR WALLET</span>
          <span>9xQe…4Lm</span>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 22}}>
          <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 48, color: '#fff'}}>
            {(612400 - (sent >= 1 ? 1 : 0)).toLocaleString('en-US')}
            <span style={{fontSize: 18, color: SOFT, marginLeft: 12}}>TOKENS</span>
          </div>
          <div style={{fontFamily: MONO, fontSize: 14, letterSpacing: '0.2em', color: G}}>≥ 500K ✓</div>
        </div>
      </div>
      <div style={card(pEnter, {left: RX, top: LY + 240, width: RW, height: 300, padding: '34px 44px', boxSizing: 'border-box'})}>
        <div style={{fontFamily: MONO, fontSize: 14, letterSpacing: '0.26em', color: SOFT, marginBottom: 26}}>ELIGIBILITY CHECK</div>
        {[
          {t: 'HOLDS ≥ 500K TOKENS', at: 140},
          {t: 'ONE ENTRY TODAY', at: 156},
          {t: 'GUESS RECORDED · 675.50 – 675.75', at: 172},
        ].map((c) => (
          <div key={c.t} style={{display: 'flex', alignItems: 'center', gap: 18, marginBottom: 20, opacity: 0.3 + 0.7 * prog(f, c.at, 10)}}>
            <Check on={prog(f, c.at, 12, inOut)} />
            <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 20, color: '#fff'}}>{c.t}</div>
          </div>
        ))}
      </div>

      {/* ── right panel: duplicate + lock ── */}
      <div style={card(pLock, {left: RX, top: LY, width: RW, height: 250, padding: '34px 44px', boxSizing: 'border-box'})}>
        <div style={{fontFamily: MONO, fontSize: 14, letterSpacing: '0.26em', color: SOFT}}>TRADING DAY · ET</div>
        <div style={{position: 'relative', marginTop: 60, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.08)'}}>
          <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${dayCursor * 100}%`, borderRadius: 4, background: `linear-gradient(90deg, ${G_DIM}, ${G})`}} />
          <div style={{position: 'absolute', left: `${LOCK_FRAC * 100}%`, top: -22, bottom: -22, width: 2, background: locked ? G : 'rgba(255,255,255,0.4)'}} />
          <div style={{position: 'absolute', left: `calc(${LOCK_FRAC * 100}% - 70px)`, top: -56, width: 140, textAlign: 'center', fontFamily: MONO, fontSize: 13, letterSpacing: '0.2em', color: locked ? G : '#fff', display: 'flex', justifyContent: 'center', gap: 8, alignItems: 'center'}}>
            <Lock size={14} color={locked ? G : '#fff'} /> 1:00 PM
          </div>
          <div style={{position: 'absolute', left: `calc(${dayCursor * 100}% - 7px)`, top: -6, width: 14, height: 20, borderRadius: 4, background: '#fff', boxShadow: `0 0 12px ${G}`}} />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 22, fontFamily: MONO, fontSize: 13, letterSpacing: '0.2em', color: SOFT}}>
          <span>9:30 OPEN</span>
          <span style={{color: locked ? G : SOFT}}>{locked ? 'ENTRIES LOCKED' : 'ENTRIES OPEN'}</span>
          <span>4:00 CLOSE</span>
        </div>
      </div>
      <div style={card(pLock * dupe, {left: RX, top: LY + 290, width: RW, height: 170, padding: '30px 44px', boxSizing: 'border-box', border: `1px solid rgba(255,90,90,${0.4 * prog(f, 236, 10)})`})}>
        <div style={{fontFamily: MONO, fontSize: 14, letterSpacing: '0.26em', color: SOFT}}>9xQe…4Lm · SECOND ENTRY → 676.00 – 676.25</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 24}}>
          <Check on={prog(f, 236, 10, inOut)} bad />
          <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 22, color: RED, opacity: prog(f, 236, 10)}}>DUPLICATE — REJECTED. NO DOUBLE VOTES.</div>
        </div>
      </div>

      {/* ── right panel: close chart ── */}
      {pChart > 0 && (() => {
        const CX0 = RX + 40;
        const CW = RW - 150;
        const CY0 = LY + 90;
        const CH = 520;
        const PY = (p: number) => CY0 + ((676.1 - p) / 1.2) * CH;
        const t = prog(f, 340, CLOSE_F - 340, inOut);
        const N = 120;
        let d = '';
        for (let k = 0; k <= N; k++) {
          const u = (k / N) * t;
          const ff = 340 + u * (CLOSE_F - 340);
          d += `${k ? 'L' : 'M'}${(CX0 + u * CW).toFixed(1)},${PY(spyAt(ff)).toFixed(1)} `;
        }
        const hx = CX0 + t * CW;
        const hy = PY(spyAt(340 + t * (CLOSE_F - 340)));
        const closed = f >= CLOSE_F;
        return (
          <>
            <div style={card(pChart, {left: RX, top: LY, width: RW, height: 700})} />
            <div style={{position: 'absolute', left: RX + 40, top: LY + 28, fontFamily: MONO, fontSize: 14, letterSpacing: '0.26em', color: SOFT, opacity: pChart}}>
              SPY · 1:00 PM → 4:00 PM ET
            </div>
            <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: pChart}}>
              <rect x={CX0} y={PY(675.75)} width={CW} height={PY(675.5) - PY(675.75)} fill="rgba(57,255,74,0.12)" stroke={G_DIM} />
              <text x={CX0 + 12} y={PY(675.75) - 10} fill={G} fontFamily="JetBrains Mono" fontSize={13} letterSpacing={2}>
                YOUR RANGE 675.50 – 675.75
              </text>
              {[675.0, 675.25, 675.5, 675.75, 676.0].map((p) => (
                <g key={p}>
                  <line x1={CX0} x2={CX0 + CW} y1={PY(p)} y2={PY(p)} stroke="rgba(255,255,255,0.06)" />
                  <text x={CX0 + CW + 14} y={PY(p) + 5} fill="rgba(236,255,238,0.4)" fontFamily="JetBrains Mono" fontSize={13}>
                    {p.toFixed(2)}
                  </text>
                </g>
              ))}
              <path d={d} fill="none" stroke="#fff" strokeWidth={2.4} strokeLinejoin="round" />
              <circle cx={hx} cy={hy} r={6} fill={closed ? G : '#fff'} style={{filter: closed ? `drop-shadow(0 0 10px ${G})` : undefined}} />
              {closed && <line x1={hx} x2={hx} y1={CY0} y2={CY0 + CH} stroke={G} strokeDasharray="4 6" opacity={0.6} />}
            </svg>
            <div style={{position: 'absolute', left: RX + 40, top: LY + 630, fontFamily: MONO, fontSize: 13, letterSpacing: '0.2em', color: SOFT, opacity: pChart}}>1:00</div>
            <div style={{position: 'absolute', left: RX + 40 + (RW - 150) - 40, top: LY + 630, fontFamily: MONO, fontSize: 13, letterSpacing: '0.2em', color: SOFT, opacity: pChart}}>4:00</div>
            {closed && (
              <div style={{position: 'absolute', left: hx - 250, top: hy - 70, width: 230, textAlign: 'right', opacity: prog(f, CLOSE_F, 12, expoOut)}}>
                <div style={{display: 'inline-block', fontFamily: MONO, fontWeight: 700, fontSize: 22, color: '#041a06', background: G, padding: '8px 14px', borderRadius: 8, boxShadow: `0 0 24px ${G}`}}>CLOSE {CLOSE.toFixed(2)}</div>
              </div>
            )}
          </>
        );
      })()}

      {/* the entry: 1 token travels from the wallet to the range wallet */}
      {sent > 0 && sent < 1 && (() => {
        const x0 = RX;
        const y0 = LY + 110;
        const x1 = LX + LW - 20;
        const y1 = rowY(WIN_ROW) + (ROW_H - 8) / 2;
        const u = sent;
        const x = (1 - u) * (1 - u) * x0 + 2 * (1 - u) * u * ((x0 + x1) / 2) + u * u * x1;
        const y = (1 - u) * (1 - u) * y0 + 2 * (1 - u) * u * (y0 - 120) + u * u * y1;
        return (
          <>
            <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
              <path d={`M ${x0} ${y0} Q ${(x0 + x1) / 2} ${y0 - 120} ${x1} ${y1}`} fill="none" stroke={G_DIM} strokeDasharray="4 8" />
            </svg>
            <div style={{position: 'absolute', left: x - 34, top: y - 16, fontFamily: MONO, fontWeight: 700, fontSize: 14, color: '#041a06', background: G, padding: '6px 10px', borderRadius: 16, boxShadow: `0 0 20px ${G}`}}>1 TOKEN</div>
          </>
        );
      })()}
      {/* rejected duplicate bounces off the locked row */}
      {dupe > 0 && dupe < 1 && (() => {
        const x0 = RX;
        const y0 = LY + 340;
        const x1 = LX + LW - 20;
        const y1 = rowY(2) + 29;
        const u = dupe < 0.6 ? dupe / 0.6 : 1 - (dupe - 0.6) / 0.4 * 0.3;
        const x = lerp(x0, x1, u);
        const y = lerp(y0, y1, u);
        return <div style={{position: 'absolute', left: x - 34, top: y - 16, fontFamily: MONO, fontWeight: 700, fontSize: 14, color: '#fff', background: dupe > 0.6 ? RED : 'rgba(255,255,255,0.2)', padding: '6px 10px', borderRadius: 16, opacity: 1 - Math.max(0, (dupe - 0.8) / 0.2)}}>1 TOKEN</div>;
      })()}
    </AbsoluteFill>
  );
};
