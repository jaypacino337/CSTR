import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {FilmFinish} from '../../components/Atmosphere';
import {Fade} from '../../premium/ui';
import {Game} from './Game';
import {End, Intro, Payout} from './Scenes';
import {INK} from './shared';
import tl from './timeline.json';

const S = tl.scenes;

/** 0DTE explainer: predict SPY's close in $0.25 ranges, one guess a day, creator fees pay winners. */
export const OdteExplainer: React.FC<{withAudio?: boolean}> = ({withAudio = true}) => (
  <AbsoluteFill style={{background: INK}}>
    <Sequence from={S.intro.from} durationInFrames={S.intro.dur} name="01 Promise">
      <Intro />
    </Sequence>
    <Sequence from={S.game.from} durationInFrames={S.game.dur} name="02 Game board">
      <Fade dur={S.game.dur} inDur={14} outDur={14}>
        <Game />
      </Fade>
    </Sequence>
    <Sequence from={S.payout.from} durationInFrames={S.payout.dur} name="03 Payout">
      <Fade dur={S.payout.dur} inDur={14} outDur={2}>
        <Payout />
      </Fade>
    </Sequence>
    <Sequence from={S.finale.from} durationInFrames={S.finale.dur} name="04 End">
      <Fade dur={S.finale.dur + 20} inDur={14}>
        <End />
      </Fade>
    </Sequence>
    <FilmFinish />
    {withAudio && <Audio src={staticFile('odte-explainer-score.wav')} />}
  </AbsoluteFill>
);
