import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {FilmFinish} from '../components/Atmosphere';
import {SceneShell} from '../components/SceneShell';
import {Econ} from './scenes/Econ';
import {Fight} from './scenes/Fight';
import {ArenaFinale} from './scenes/Finale';
import {Gates} from './scenes/Gates';
import {ArenaIntro} from './scenes/Intro';
import {Pit} from './scenes/Pit';
import {Ring} from './scenes/Ring';
import {A} from './theme';
import tl from './timeline.json';

const S = tl.scenes;

export const StonkArena: React.FC = () => (
  <AbsoluteFill style={{background: A.bg}}>
    <Sequence from={S.intro.from} durationInFrames={S.intro.dur} name="01 Intro">
      <ArenaIntro />
    </Sequence>
    <Sequence from={S.gates.from} durationInFrames={S.gates.dur} name="02 Gates">
      <SceneShell dur={S.gates.dur} inDur={10} enterScale={1.25} origin="960px 560px" exitScale={4}>
        <Gates />
      </SceneShell>
    </Sequence>
    <Sequence from={S.fight.from} durationInFrames={S.fight.dur} name="03 Four AIs">
      <SceneShell dur={S.fight.dur} origin="960px 600px" exitScale={3}>
        <Fight />
      </SceneShell>
    </Sequence>
    <Sequence from={S.pit.from} durationInFrames={S.pit.dur} name="04 The Pit">
      <SceneShell dur={S.pit.dur} origin="960px 720px" exitScale={3}>
        <Pit />
      </SceneShell>
    </Sequence>
    <Sequence from={S.ring.from} durationInFrames={S.ring.dur} name="05 Challenger">
      <SceneShell dur={S.ring.dur} origin="960px 560px" exitScale={3.4}>
        <Ring />
      </SceneShell>
    </Sequence>
    <Sequence from={S.econ.from} durationInFrames={S.econ.dur} name="06 Economy">
      <SceneShell dur={S.econ.dur} exitMode="collapse" origin="610px 560px" outDur={16}>
        <Econ />
      </SceneShell>
    </Sequence>
    <Sequence from={S.finale.from} durationInFrames={S.finale.dur} name="07 Finale">
      <SceneShell dur={S.finale.dur + 40} inDur={8} enterScale={1.1}>
        <ArenaFinale />
      </SceneShell>
    </Sequence>
    <FilmFinish />
    <Audio src={staticFile('stonkarena-score.wav')} />
  </AbsoluteFill>
);
