import {AbsoluteFill, Img, random, staticFile, useCurrentFrame} from 'remotion';
import {FilmFinish} from '../components/Atmosphere';
import {DISPLAY, UI, expoOut, inOut, lerp, prog} from '../theme';

// 0DTE — cinematic, silent, ~12s. Letterboxed. Slow.
// The stat → "We brought it on-chain." → the mark emerges from darkness.
const G = '#39FF4A';
const BAR = 138; // 2.39:1 letterbox
export const CINE_DUR = 360;

const Haze: React.FC<{f: number; o: number}> = ({f, o}) => (
  <>
    {new Array(36).fill(0).map((_, i) => {
      const x = random(`hx${i}`) * 1920;
      const y = BAR + ((random(`hy${i}`) * 800 - f * (0.15 + random(`hv${i}`) * 0.35)) % 800 + 800) % 800;
      return <div key={i} style={{position: 'absolute', left: x, top: y, width: 2, height: 2, borderRadius: 1, background: G, opacity: o * (0.15 + random(`ho${i}`) * 0.35)}} />;
    })}
  </>
);

export const OdteCinematic: React.FC = () => {
  const f = useCurrentFrame();
  // act 1: the stat
  const lead = prog(f, 18, 40, inOut);
  const num = prog(f, 40, 50, inOut);
  const count = Math.round(25 * prog(f, 44, 70, expoOut));
  const tail = prog(f, 86, 40, inOut);
  const act1Out = prog(f, 150, 28, inOut);
  // act 2: the line
  const onchain = prog(f, 182, 36, inOut);
  const act2Out = prog(f, 232, 24, inOut);
  // act 3: the mark
  const blade = prog(f, 236, 34, inOut);
  const bladeOut = prog(f, 268, 24, inOut);
  const mark = prog(f, 252, 60, inOut);
  const url = prog(f, 300, 30, inOut);
  const sweep = prog(f, 314, 36, inOut);
  const breathe = 0.85 + 0.15 * Math.sin(f / 16);
  const LS = 600;
  const LY = 500;

  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${1 + f * 0.00012})`}}>
        <Haze f={f} o={1} />

        {/* act 1 */}
        <AbsoluteFill style={{opacity: 1 - act1Out}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', fontFamily: UI, fontWeight: 600, fontSize: 28, letterSpacing: '0.42em', color: 'rgba(255,255,255,0.75)', opacity: lead}}>
            0DTE OPTIONS ACCOUNT FOR
          </div>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 356,
              textAlign: 'center',
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontStretch: '112%',
              fontSize: 260,
              lineHeight: 1,
              color: G,
              textShadow: `0 0 50px rgba(57,255,74,0.35)`,
              opacity: num,
              transform: `scale(${lerp(1.05, 1, num)})`,
              filter: num < 1 ? `blur(${(1 - num) * 10}px)` : undefined,
            }}
          >
            ~{count}%
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 660, textAlign: 'center', fontFamily: UI, fontWeight: 600, fontSize: 28, letterSpacing: '0.42em', color: 'rgba(255,255,255,0.75)', opacity: tail}}>
            OF ALL LISTED OPTIONS VOLUME.
          </div>
        </AbsoluteFill>

        {/* act 2 */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 490,
            textAlign: 'center',
            fontFamily: DISPLAY,
            fontWeight: 800,
            fontStretch: '115%',
            fontSize: 72,
            letterSpacing: '0.08em',
            color: '#fff',
            opacity: onchain * (1 - act2Out),
            filter: onchain < 1 ? `blur(${(1 - onchain) * 8}px)` : act2Out > 0 ? `blur(${act2Out * 8}px)` : undefined,
          }}
        >
          WE BROUGHT IT <span style={{color: G}}>ON-CHAIN.</span>
        </div>

        {/* act 3 */}
        <div
          style={{
            position: 'absolute',
            left: 960 - 900,
            top: LY - 700,
            width: 1800,
            height: 1400,
            background: 'radial-gradient(circle, rgba(57,255,74,0.22), transparent 55%)',
            opacity: mark * breathe,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 960 - 380,
            top: LY - 2,
            width: 760,
            height: 4,
            transformOrigin: 'center',
            transform: `rotate(-50deg) scaleX(${blade})`,
            background: `linear-gradient(90deg, transparent, ${G} 15%, #EFFFEF 50%, ${G} 85%, transparent)`,
            boxShadow: `0 0 18px ${G}`,
            opacity: 1 - bladeOut,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 960 - LS / 2,
            top: LY - LS / 2,
            width: LS,
            height: LS,
            opacity: mark,
            transform: `scale(${lerp(0.96, 1, mark)})`,
            filter: mark < 1 ? `blur(${(1 - mark) * 6}px)` : undefined,
            mixBlendMode: 'screen',
            maskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, black 62%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, black 62%, transparent 100%)',
          }}
        >
          <Img src={staticFile('odte-logo.png')} style={{width: '100%', height: '100%'}} />
          {sweep > 0 && sweep < 1 && (
            <div style={{position: 'absolute', inset: 0, overflow: 'hidden', mixBlendMode: 'screen'}}>
              <div style={{position: 'absolute', top: -200, left: lerp(-300, LS + 150, sweep), width: 120, height: LS + 400, transform: 'rotate(40deg)', background: 'linear-gradient(90deg, transparent, rgba(220,255,220,0.22), transparent)'}} />
            </div>
          )}
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 850, textAlign: 'center', fontFamily: DISPLAY, fontWeight: 700, fontStretch: '115%', fontSize: 26, letterSpacing: '0.5em', color: 'rgba(255,255,255,0.8)', opacity: url}}>
          0DTE.SITE
        </div>
      </AbsoluteFill>

      {/* letterbox */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: BAR, background: '#000'}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: BAR, background: '#000'}} />
      <FilmFinish />
      <AbsoluteFill style={{background: '#000', opacity: 1 - prog(f, 0, 18, inOut)}} />
    </AbsoluteFill>
  );
};
