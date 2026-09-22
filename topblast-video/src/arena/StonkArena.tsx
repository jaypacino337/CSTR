import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {FilmFinish} from '../components/Atmosphere';
import {SceneShell} from '../components/SceneShell';
import {Fight} from './scenes/Fight';
import {ArenaFinale} from './scenes/Finale';
import {Gates} from './scenes/Gates';
import {ArenaIntro} from './scenes/Intro';
import {Ranks} from './scenes/Ranks';
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
    <Sequence from={S.fight.from} durationInFrames={S.fight.dur} name="03 Fight">
      <SceneShell dur={S.fight.dur} origin="960px 600px" exitScale={3}>
        <Fight />
      </SceneShell>
    </Sequence>
    <Sequence from={S.ranks.from} durationInFrames={S.ranks.dur} name="04 Leaderboard">
      <SceneShell dur={S.ranks.dur} origin="960px 270px" exitScale={3}>
        <Ranks />
      </SceneShell>
    </Sequence>
    <Sequence from={S.ring.from} durationInFrames={S.ring.dur} name="05 Arena">
      <SceneShell dur={S.ring.dur} exitMode="collapse" origin="960px 560px" outDur={16}>
        <Ring />
      </SceneShell>
    </Sequence>
    <Sequence from={S.finale.from} durationInFrames={S.finale.dur} name="06 Finale">
      <SceneShell dur={S.finale.dur + 40} inDur={8} enterScale={1.1}>
        <ArenaFinale />
      </SceneShell>
    </Sequence>
    <FilmFinish />
    <Audio src={staticFile('stonkarena-score.wav')} />
  </AbsoluteFill>
);
