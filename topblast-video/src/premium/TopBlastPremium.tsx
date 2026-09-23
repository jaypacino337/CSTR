import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {FilmFinish} from '../components/Atmosphere';
import {Entry} from './Entry';
import {Final} from './Final';
import {Opening} from './Opening';
import {Rewards} from './Rewards';
import {Stack} from './Stack';
import tl from './timeline.json';
import {Fade, INK} from './ui';
import {Venue} from './Venue';

const S = tl.scenes;

/**
 * Premium cut: one continuous explanation.
 * line → layer → chart → entry line → Blast Zone → reward network → stack → mark.
 */
export const TopBlastPremium: React.FC = () => (
  <AbsoluteFill style={{background: INK}}>
    <Sequence from={S.intro.from} durationInFrames={S.intro.dur} name="01 Opening">
      <Opening />
    </Sequence>
    <Sequence from={S.venue.from} durationInFrames={S.venue.dur} name="02 Venues → Layer">
      <Fade dur={S.venue.dur} inDur={8} outDur={4}>
        <Venue />
      </Fade>
    </Sequence>
    <Sequence from={S.entry.from} durationInFrames={S.entry.dur} name="03 Entry line → Blast Zone">
      <Fade dur={S.entry.dur} inDur={12} outDur={2}>
        <Entry from={S.entry.from} />
      </Fade>
    </Sequence>
    <Sequence from={S.rewards.from} durationInFrames={S.rewards.dur} name="04 Reward engine">
      <Rewards from={S.rewards.from} />
    </Sequence>
    <Sequence from={S.stack.from} durationInFrames={S.stack.dur} name="05 Architecture">
      <Fade dur={S.stack.dur} inDur={12} outDur={2}>
        <Stack />
      </Fade>
    </Sequence>
    <Sequence from={S.finale.from} durationInFrames={S.finale.dur} name="06 Mark">
      <Fade dur={S.finale.dur + 20} inDur={10}>
        <Final />
      </Fade>
    </Sequence>
    <FilmFinish />
    <Audio src={staticFile('topblast-premium-score.wav')} />
  </AbsoluteFill>
);
