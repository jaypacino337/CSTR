import {AbsoluteFill, Img, random, staticFile, useCurrentFrame} from 'remotion';
import {DISPLAY, MONO, UI, expoOut, inOut, lerp, prog} from '../../theme';
import {FadeWords} from '../../premium/ui';
import {G, G_DIM, HAIR, INK, SOFT} from './shared';

const LogoImg: React.FC<{size: number; style?: React.CSSProperties}> = ({size, style}) => (
  <div
    style={{
      width: size,
      height: size,
      mixBlendMode: 'screen',
      maskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, black 62%, transparent 100%)',
      WebkitMaskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, black 62%, transparent 100%)',
      ...style,
    }}
  >
    <Img src={staticFile('odte-logo.png')} style={{width: '100%', height: '100%'}} />
  </div>
);

const Motes: React.FC<{f: number}> = ({f}) => (
  <>
    {new Array(30).fill(0).map((_, i) => {
      const x = random(`mx${i}`) * 1920;
      const y = ((random(`my${i}`) * 1080 - f * (0.2 + random(`mv${i}`) * 0.4)) % 1080 + 1080) % 1080;
      return <div key={i} style={{position: 'absolute', left: x, top: y, width: 2, height: 2, background: G, opacity: 0.15 + random(`mo${i}`) * 0.3}} />;
    })}
  </>
);

// 0–4.3s: the promise.
export const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const blade = prog(f, 4, 18, expoOut);
  const mark = prog(f, 14, 30, inOut);
  const out = prog(f, 112, 18, inOut);
  return (
    <AbsoluteFill style={{background: INK, opacity: 1 - out}}>
      <Motes f={f} />
      <div style={{position: 'absolute', left: 960 - 800, top: 320 - 700, width: 1600, height: 1400, background: 'radial-gradient(circle, rgba(57,255,74,0.18), transparent 55%)', opacity: mark}} />
      <div style={{position: 'absolute', left: 960 - 260, top: 318, width: 520, height: 3, transformOrigin: 'center', transform: `rotate(-50deg) scaleX(${blade})`, background: `linear-gradient(90deg, transparent, ${G}, #EFFFEF, ${G}, transparent)`, boxShadow: `0 0 18px ${G}`, opacity: 1 - prog(f, 26, 14)}} />
      <div style={{position: 'absolute', left: 960 - 210, top: 320 - 210, opacity: mark, transform: `scale(${lerp(0.95, 1, mark)})`}}>
        <LogoImg size={420} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 610}}>
        <FadeWords
          segments={[
            {text: 'PREDICT ', color: '#fff'},
            {text: "SPY'S CLOSE.", color: G},
          ]}
          start={34}
          size={96}
          font={UI}
          weight={800}
          tracking={-0.01}
          stagger={5}
        />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 742}}>
        <FadeWords segments="ONE GUESS. EVERY TRADING DAY. ON-CHAIN." start={56} size={34} font={UI} weight={700} tracking={0.12} stagger={4} style={{color: 'rgba(236,255,238,0.85)'}} />
      </div>
    </AbsoluteFill>
  );
};

// Payout: creator fees fund the pool → eligible winners paid automatically.
const WINNERS = ['9xQe…4Lm', 'Ab3k…Vt9', 'Qm7r…2Ws', 'Jd5y…Hn1', 'Uc8p…6Ze'];
export const Payout: React.FC = () => {
  const f = useCurrentFrame();
  const pool = prog(f, 6, 22, inOut);
  const fill = lerp(0.15, 1, prog(f, 10, 34, inOut));
  const out = prog(f, 124, 16, inOut);
  const PX = 960;
  const PY = 330;
  return (
    <AbsoluteFill style={{background: INK, opacity: 1 - out}}>
      <Motes f={f} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 96}}>
        <FadeWords
          segments={[
            {text: 'CREATOR FEES ', color: G},
            {text: 'PAY THE WINNERS.', color: '#fff'},
          ]}
          start={4}
          size={54}
          font={UI}
          weight={800}
          exitAt={999}
        />
      </div>
      {/* creator fees flowing in */}
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {[0, 1, 2].map((i) => {
          const d = `M ${-40} ${250 + i * 50} C 300 ${250 + i * 50}, 500 ${PY}, ${PX - 300} ${PY}`;
          return (
            <g key={i}>
              <path d={d} pathLength={1} fill="none" stroke={G_DIM} strokeWidth={1.2} strokeDasharray={`${prog(f, 0, 24, inOut)} 1`} />
              <path d={d} pathLength={1} fill="none" stroke={G} strokeWidth={2.2} strokeLinecap="round" strokeDasharray="0.05 0.95" strokeDashoffset={-((f * 0.02 + i * 0.3) % 1)} opacity={prog(f, 10, 10)} />
            </g>
          );
        })}
        {WINNERS.map((w, i) => {
          const wx = 360 + i * 300;
          const wy = 760;
          const d = `M ${PX + (wx - PX) * 0.3} ${PY + 50} V ${PY + 140} H ${wx} V ${wy - 50}`;
          const draw = prog(f, 44 + i * 5, 22, inOut);
          return (
            <g key={w}>
              <path d={d} pathLength={1} fill="none" stroke={G} strokeOpacity={0.45} strokeWidth={1.4} strokeDasharray={`${draw} 1`} />
              {draw >= 1 &&
                [0, 0.5].map((k) => (
                  <path key={k} d={d} pathLength={1} fill="none" stroke="#EFFFEF" strokeWidth={2.6} strokeLinecap="round" strokeDasharray="0.03 0.97" strokeDashoffset={-((f * 0.016 + k) % 1)} style={{filter: `drop-shadow(0 0 4px ${G})`}} />
                ))}
            </g>
          );
        })}
      </svg>
      <div style={{position: 'absolute', left: PX - 300, top: PY - 50, width: 600, height: 100, borderRadius: 18, border: `1px solid ${G}`, background: 'rgba(8,14,9,0.95)', overflow: 'hidden', boxShadow: '0 0 40px rgba(57,255,74,0.18)', opacity: pool}}>
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${fill * 100}%`, background: 'linear-gradient(90deg, rgba(57,255,74,0.35), rgba(157,255,166,0.2))'}} />
        <div style={{position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 30px)'}} />
        <div style={{position: 'absolute', left: 26, top: 20, fontFamily: MONO, fontSize: 14, letterSpacing: '0.3em', color: '#EFFFEF'}}>PRIZE POOL</div>
        <div style={{position: 'absolute', left: 26, bottom: 18, fontFamily: MONO, fontWeight: 700, fontSize: 20, color: '#fff'}}>FUNDED BY CREATOR FEES</div>
        <div style={{position: 'absolute', right: 26, top: 38, fontFamily: MONO, fontSize: 13, letterSpacing: '0.24em', color: G}}>WINNING RANGE 675.50 – 675.75</div>
      </div>
      {WINNERS.map((w, i) => {
        const inP = prog(f, 20 + i * 3, 16, inOut);
        const paid = prog(f, 70 + i * 5, 12, inOut);
        return (
          <div key={w} style={{position: 'absolute', left: 360 + i * 300 - 110, top: 710, width: 220, textAlign: 'center', opacity: inP}}>
            <div style={{margin: '0 auto', width: 64, height: 64, borderRadius: 32, border: `1.5px solid ${paid > 0.5 ? G : 'rgba(255,255,255,0.3)'}`, background: paid > 0.5 ? 'rgba(57,255,74,0.16)' : 'rgba(8,12,9,0.9)', boxShadow: paid > 0.5 ? `0 0 26px rgba(57,255,74,${0.5 * paid})` : undefined, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 22, color: paid > 0.5 ? G : SOFT}}>
              {paid > 0.5 ? '✓' : '·'}
            </div>
            <div style={{fontFamily: MONO, fontSize: 15, color: paid > 0.5 ? '#EFFFEF' : SOFT, marginTop: 12}}>{w}</div>
            <div style={{fontFamily: MONO, fontSize: 12, letterSpacing: '0.24em', color: G, marginTop: 6, opacity: paid}}>PAID</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 0, right: 0, top: 900, display: 'flex', justifyContent: 'center', gap: 50, fontFamily: MONO, fontSize: 15, letterSpacing: '0.24em', color: SOFT, opacity: prog(f, 60, 16, inOut)}}>
        <span>
          <span style={{color: G}}>✓</span> ELIGIBILITY VERIFIED
        </span>
        <span>
          <span style={{color: G}}>✓</span> NO DOUBLE VOTES
        </span>
        <span>
          <span style={{color: G}}>✓</span> PAID AUTOMATICALLY
        </span>
      </div>
    </AbsoluteFill>
  );
};

// Ending: the mark and the whole idea in two lines.
export const End: React.FC = () => {
  const f = useCurrentFrame();
  const mark = prog(f, 4, 40, inOut);
  const sweep = prog(f, 80, 36, inOut);
  const breathe = 0.85 + 0.15 * Math.sin(f / 16);
  return (
    <AbsoluteFill style={{background: INK}}>
      <Motes f={f} />
      <div style={{position: 'absolute', left: 960 - 800, top: 330 - 700, width: 1600, height: 1400, background: 'radial-gradient(circle, rgba(57,255,74,0.2), transparent 55%)', opacity: mark * breathe}} />
      <div style={{position: 'absolute', left: 960 - 240, top: 330 - 240, opacity: mark, transform: `scale(${lerp(0.96, 1, mark) + f * 0.0002})`}}>
        <LogoImg size={480} />
        {sweep > 0 && sweep < 1 && (
          <div style={{position: 'absolute', inset: 0, overflow: 'hidden', mixBlendMode: 'screen', maskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, black 55%, transparent 90%)', WebkitMaskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, black 55%, transparent 90%)'}}>
            <div style={{position: 'absolute', top: -200, left: lerp(-300, 630, sweep), width: 110, height: 900, transform: 'rotate(40deg)', background: 'linear-gradient(90deg, transparent, rgba(220,255,220,0.25), transparent)'}} />
          </div>
        )}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 640}}>
        <FadeWords
          segments={[
            {text: 'ONE GUESS. ', color: '#fff'},
            {text: 'SPY DECIDES.', color: G},
          ]}
          start={28}
          size={76}
          font={UI}
          weight={800}
          tracking={-0.01}
          stagger={5}
        />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 752, textAlign: 'center', fontFamily: MONO, fontSize: 18, letterSpacing: '0.34em', color: SOFT, opacity: prog(f, 48, 20, inOut)}}>
        HOLD 500K · PICK A $0.25 RANGE · LOCK BY 1 PM ET
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 840, display: 'flex', justifyContent: 'center', opacity: prog(f, 62, 18, expoOut)}}>
        <div style={{fontFamily: DISPLAY, fontWeight: 800, fontStretch: '115%', fontSize: 32, letterSpacing: '0.2em', color: '#041a06', background: G, padding: '12px 36px', borderRadius: 12, boxShadow: '0 0 30px rgba(57,255,74,0.45)'}}>0DTE.SITE</div>
      </div>
    </AbsoluteFill>
  );
};

export {HAIR};
