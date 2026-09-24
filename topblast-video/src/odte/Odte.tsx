import {AbsoluteFill, Audio, Img, staticFile, useCurrentFrame} from 'remotion';
import {FilmFinish, Glow, Particles} from '../components/Atmosphere';
import {DISPLAY, expoOut, inOut, lerp, prog} from '../theme';

// 0DTE — 5s. Clean: black → the blade draws → the 0DTE mark lights up around it
// → "WE BROUGHT 0DTE ON-CHAIN." → 0DTE.SITE.
const G = '#39FF4A';
export const LAND_F = 22;
const LS = 640;
const LY = 420;

export const Odte: React.FC = () => {
  const f = useCurrentFrame();
  const blade = prog(f, 2, 16, expoOut);
  const bladeFade = 1 - prog(f, 20, 12, inOut);
  const mark = prog(f, 12, 26, inOut);
  const glow = prog(f, LAND_F, 30, expoOut);
  const sweep = prog(f, 96, 24, inOut);
  const line1 = prog(f, 48, 18, expoOut);
  const url = prog(f, 78, 16, expoOut);

  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <Particles count={60} seed="odte" color={G} speed={0.8} opacity={0.35} maxSize={2} />
      <Glow x={960} y={LY} size={1200} color="rgba(57,255,74,0.32)" opacity={glow * (0.85 + 0.15 * Math.sin(f / 9))} />

      {/* the blade draws first, at the same angle as the logo's slash */}
      <div
        style={{
          position: 'absolute',
          left: 960 - 420,
          top: LY - 3,
          width: 840,
          height: 6,
          transformOrigin: 'center',
          transform: `rotate(-50deg) scaleX(${blade})`,
          background: `linear-gradient(90deg, transparent, ${G} 15%, #EFFFEF 50%, ${G} 85%, transparent)`,
          boxShadow: `0 0 24px ${G}`,
          opacity: bladeFade,
        }}
      />

      {/* the mark */}
      <div
        style={{
          position: 'absolute',
          left: 960 - LS / 2,
          top: LY - LS / 2,
          width: LS,
          height: LS,
          opacity: mark,
          transform: `scale(${lerp(0.94, 1, mark) + f * 0.0002})`,
          mixBlendMode: 'screen',
            maskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, black 62%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, black 62%, transparent 100%)',
        }}
      >
        <Img src={staticFile('odte-logo.png')} style={{width: '100%', height: '100%'}} />
        {sweep > 0 && sweep < 1 && (
          <div style={{position: 'absolute', inset: 0, overflow: 'hidden', mixBlendMode: 'screen'}}>
            <div
              style={{
                position: 'absolute',
                top: -200,
                left: lerp(-300, LS + 150, sweep),
                width: 110,
                height: LS + 400,
                transform: 'rotate(40deg)',
                background: 'linear-gradient(90deg, transparent, rgba(220,255,220,0.3), transparent)',
              }}
            />
          </div>
        )}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 780,
          textAlign: 'center',
          fontFamily: DISPLAY,
          fontWeight: 900,
          fontStretch: '118%',
          fontSize: 64,
          letterSpacing: '0.06em',
          color: '#fff',
          opacity: line1,
          transform: `translateY(${(1 - line1) * 18}px)`,
          filter: line1 < 1 ? `blur(${(1 - line1) * 6}px)` : undefined,
        }}
      >
        WE BROUGHT <span style={{color: G, textShadow: `0 0 22px ${G}`}}>0DTE</span> ON-CHAIN.
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 890, display: 'flex', justifyContent: 'center', opacity: url, transform: `translateY(${(1 - url) * 12}px)`}}>
        <div style={{fontFamily: DISPLAY, fontWeight: 800, fontStretch: '115%', fontSize: 32, letterSpacing: '0.2em', color: '#041a06', background: G, padding: '12px 36px', borderRadius: 12, boxShadow: '0 0 30px rgba(57,255,74,0.5)'}}>
          0DTE.SITE
        </div>
      </div>

      <FilmFinish />
      <Audio src={staticFile('odte-score.wav')} />
    </AbsoluteFill>
  );
};
