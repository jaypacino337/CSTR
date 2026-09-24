import {AbsoluteFill, Audio, Img, random, staticFile, useCurrentFrame} from 'remotion';
import {FilmFinish, Flash, Glow, GridFloor, Particles, Shockwave} from '../components/Atmosphere';
import {DISPLAY, MONO, expoIn, expoOut, inOut, lerp, prog} from '../theme';

// 0DTE — 5s hype. Countdown races to 00:00:00 over surging candles → blade slash
// → logo slams in → hold on the mark with tagline + URL.
const G = '#39FF4A';
const G_HOT = '#B6FFB9';
const G_DEEP = '#0FA82A';
export const SLASH_F = 30;
export const SLAM_F = 40;

const Candles: React.FC<{f: number}> = ({f}) => {
  const n = 34;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
      {new Array(n).fill(0).map((_, i) => {
        const appear = prog(f, i * 0.8, 6, expoOut);
        const x = 60 + i * 54;
        const trend = 860 - i * 19 - Math.sin(i * 1.3) * 26;
        const body = 40 + random(`cb${i}`) * 70;
        const down = random(`cd${i}`) > 0.78;
        const y = trend - body;
        const col = down ? '#1C6B26' : G;
        return (
          <g key={i} opacity={appear} transform={`translate(0 ${(1 - appear) * 40})`}>
            <line x1={x} x2={x} y1={y - 26} y2={y + body + 22} stroke={col} strokeWidth={3} />
            <rect x={x - 13} y={y} width={26} height={body} fill={col} rx={2} style={{filter: down ? undefined : `drop-shadow(0 0 8px ${G})`}} />
          </g>
        );
      })}
    </svg>
  );
};

export const Odte: React.FC = () => {
  const f = useCurrentFrame();
  const pre = 1 - prog(f, SLASH_F, 10, inOut);
  // countdown 23:59:59 → 00:00:00, accelerating
  const cd = Math.max(0, Math.round(86399 * (1 - prog(f, 0, SLASH_F, expoIn))));
  const hh = String(Math.floor(cd / 3600)).padStart(2, '0');
  const mm = String(Math.floor((cd % 3600) / 60)).padStart(2, '0');
  const ss = String(cd % 60).padStart(2, '0');

  const slash = prog(f, SLASH_F - 4, 10, expoOut);
  const slashFade = 1 - prog(f, SLASH_F + 6, 14);
  const flash = f >= SLASH_F ? Math.max(0, 1 - (f - SLASH_F) / 10) * 0.75 : 0;
  const slam = prog(f, SLAM_F, 16, expoOut);
  const shake = f >= SLAM_F && f < SLAM_F + 10 ? (1 - (f - SLAM_F) / 10) * 12 : 0;
  const sweep = prog(f, 104, 22, inOut);
  const breathe = 0.85 + 0.15 * Math.sin(f / 7);
  const LS = 660;

  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <GridFloor color="rgba(57,255,74,0.22)" speed={lerp(26, 3, prog(f, SLAM_F, 40))} horizon={760} />
      <Particles count={120} seed="odte" color={G} speed={lerp(7, 1.2, prog(f, SLAM_F, 40))} opacity={0.7} maxSize={2.4} />

      {/* act 1: the clock runs out over surging candles */}
      <AbsoluteFill style={{opacity: pre, transform: `scale(${1 + f * 0.004})`}}>
        <Candles f={f} />
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
          <div style={{fontFamily: MONO, fontSize: 18, letterSpacing: '0.5em', color: G_HOT, opacity: 0.8, marginBottom: 12}}>TIME TO EXPIRY</div>
          <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 190, color: '#fff', textShadow: `0 0 30px ${G}, 0 0 80px ${G_DEEP}`, letterSpacing: '0.02em'}}>
            {hh}:{mm}:{ss}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* the blade */}
      {slash > 0 && (
        <div
          style={{
            position: 'absolute',
            left: 960 - 1400,
            top: 540 - 5,
            width: 2800,
            height: 10,
            transformOrigin: 'center',
            transform: `rotate(-52deg) scaleX(${slash})`,
            background: `linear-gradient(90deg, transparent, ${G} 20%, #F2FFF2 50%, ${G} 80%, transparent)`,
            boxShadow: `0 0 30px ${G}, 0 0 80px ${G}`,
            opacity: slashFade,
          }}
        />
      )}

      {/* the mark */}
      <AbsoluteFill style={{transform: `translate(${Math.sin(f * 7.1) * shake}px, ${Math.cos(f * 8.7) * shake}px)`}}>
        <Glow x={960} y={430} size={1300} color="rgba(57,255,74,0.45)" opacity={slam * breathe} />
        <div
          style={{
            position: 'absolute',
            left: 960 - LS / 2,
            top: 430 - LS / 2,
            width: LS,
            height: LS,
            opacity: Math.min(1, slam * 1.6),
            transform: `scale(${lerp(1.7, 1, slam) + f * 0.0004})`,
            filter: `blur(${(1 - slam) * 16}px) brightness(${1 + (1 - slam) * 1.2})`,
            mixBlendMode: 'screen',
          }}
        >
          <Img src={staticFile('odte-logo.png')} style={{width: '100%', height: '100%'}} />
          {/* specular sweep along the blade angle */}
          {sweep > 0 && sweep < 1 && (
            <div style={{position: 'absolute', inset: 0, overflow: 'hidden', mixBlendMode: 'screen'}}>
              <div
                style={{
                  position: 'absolute',
                  top: -200,
                  left: lerp(-400, LS + 200, sweep),
                  width: 120,
                  height: LS + 400,
                  transform: 'rotate(38deg)',
                  background: 'linear-gradient(90deg, transparent, rgba(220,255,220,0.35), transparent)',
                }}
              />
            </div>
          )}
        </div>
        <Shockwave x={960} y={430} t={prog(f, SLAM_F, 26, expoOut)} maxR={1300} color={G} width={7} />
      </AbsoluteFill>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 800,
          textAlign: 'center',
          fontFamily: DISPLAY,
          fontWeight: 900,
          fontStretch: '125%',
          fontSize: 62,
          letterSpacing: '0.12em',
          color: '#fff',
          textShadow: `0 0 24px ${G}`,
          opacity: prog(f, 76, 14, expoOut),
          transform: `translateY(${(1 - prog(f, 76, 14, expoOut)) * 24}px)`,
        }}
      >
        ZERO DAYS <span style={{color: G}}>TO EXPIRY.</span>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 910, display: 'flex', justifyContent: 'center', opacity: prog(f, 92, 14, expoOut)}}>
        <div style={{fontFamily: DISPLAY, fontWeight: 800, fontStretch: '115%', fontSize: 34, letterSpacing: '0.2em', color: '#041a06', background: G, padding: '12px 36px', borderRadius: 12, boxShadow: `0 0 40px ${G}`}}>
          0DTE.SITE
        </div>
      </div>

      <Flash amount={flash} color="#DFFFE0" />
      <FilmFinish />
      <Audio src={staticFile('odte-score.wav')} />
    </AbsoluteFill>
  );
};
