import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {FilmFinish} from './components/Atmosphere';
import {SceneShell} from './components/SceneShell';
import {Chart} from './scenes/Chart';
import {Creator} from './scenes/Creator';
import {Finale} from './scenes/Finale';
import {Intro} from './scenes/Intro';
import {Qualify} from './scenes/Qualify';
import {Rails} from './scenes/Rails';
import {C} from './theme';
import tl from './timeline.json';

const S = tl.scenes;

export const TopBlastLaunch: React.FC = () => (
  <AbsoluteFill style={{background: C.bg}}>
    <Sequence from={S.intro.from} durationInFrames={S.intro.dur} name="01 Intro">
      <Intro />
    </Sequence>
    <Sequence from={S.rails.from} durationInFrames={S.rails.dur} name="02 Rails">
      <SceneShell dur={S.rails.dur} inDur={10} enterScale={1.25} origin="960px 450px" exitScale={5}>
        <Rails />
      </SceneShell>
    </Sequence>
    <Sequence from={S.chart.from} durationInFrames={S.chart.dur} name="03 Blast Zone">
      <SceneShell dur={S.chart.dur} origin="960px 585px" exitScale={3.2}>
        <Chart />
      </SceneShell>
    </Sequence>
    <Sequence from={S.qualify.from} durationInFrames={S.qualify.dur} name="04 Qualify + Pool">
      <SceneShell dur={S.qualify.dur} origin="1330px 470px" exitScale={3}>
        <Qualify />
      </SceneShell>
    </Sequence>
    <Sequence from={S.creator.from} durationInFrames={S.creator.dur} name="05 Creator + Stack">
      <SceneShell dur={S.creator.dur} exitMode="collapse" origin="960px 330px" outDur={16}>
        <Creator />
      </SceneShell>
    </Sequence>
    <Sequence from={S.finale.from} durationInFrames={S.finale.dur} name="06 Finale">
      <SceneShell dur={S.finale.dur + 40} inDur={8} enterScale={1.1}>
        <Finale />
      </SceneShell>
    </Sequence>
    <FilmFinish />
    <Audio src={staticFile('topblast-score.wav')} />
  </AbsoluteFill>
);
