import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {FilmFinish} from '../components/Atmosphere';
import {Fade, INK} from '../premium/ui';
import {Creator} from './Creator';
import {BUY_F, CROSS_F, Entry, ZONE_TITLE_F} from './Entry';
import {Finale} from './Finale';
import {Hook} from './Hook';
import {Loop} from './Loop';
import {Rewards} from './Rewards';
import {Stack} from './Stack';
import tl from './timeline.json';
import {Tracker} from './Tracker';

const S = tl.scenes;
const TRACK_FROM = S.entry.from + 8;
const TRACK_TO = S.rewards.from + S.rewards.dur - 6;

/**
 * v2: says what TopBlast is in the first 5 seconds, then the holder mechanic
 * (buy → entry line → below entry → Blast Zone → rewards), creator split,
 * architecture, and the $TOPBLAST buyback + burn loop.
 */
export const TopBlastV2: React.FC = () => (
  <AbsoluteFill style={{background: INK}}>
    <Sequence from={S.hook.from} durationInFrames={S.hook.dur} name="01 Hook">
      <Hook />
    </Sequence>
    <Sequence from={S.entry.from} durationInFrames={S.entry.dur} name="02 Entry line → Blast Zone">
      <Fade dur={S.entry.dur} inDur={12} outDur={2}>
        <Entry from={S.entry.from} />
      </Fade>
    </Sequence>
    <Sequence from={S.rewards.from} durationInFrames={S.rewards.dur} name="03 Funded rewards">
      <Rewards from={S.rewards.from} />
    </Sequence>
    <Sequence from={TRACK_FROM} durationInFrames={TRACK_TO - TRACK_FROM} name="Step tracker">
      <Tracker
        dur={TRACK_TO - TRACK_FROM}
        at={[
          S.entry.from + BUY_F - TRACK_FROM,
          S.entry.from + BUY_F + 20 - TRACK_FROM,
          S.entry.from + CROSS_F - TRACK_FROM,
          S.entry.from + ZONE_TITLE_F - TRACK_FROM,
          S.rewards.from + 50 - TRACK_FROM,
        ]}
      />
    </Sequence>
    <Sequence from={S.creator.from} durationInFrames={S.creator.dur} name="04 Creator split">
      <Fade dur={S.creator.dur} inDur={12} outDur={2}>
        <Creator />
      </Fade>
    </Sequence>
    <Sequence from={S.stack.from} durationInFrames={S.stack.dur} name="05 Architecture">
      <Fade dur={S.stack.dur} inDur={12} outDur={2}>
        <Stack />
      </Fade>
    </Sequence>
    <Sequence from={S.loop.from} durationInFrames={S.loop.dur} name="06 $TOPBLAST loop">
      <Fade dur={S.loop.dur} inDur={12} outDur={2}>
        <Loop />
      </Fade>
    </Sequence>
    <Sequence from={S.finale.from} durationInFrames={S.finale.dur} name="07 System → mark">
      <Fade dur={S.finale.dur + 20} inDur={12}>
        <Finale />
      </Fade>
    </Sequence>
    <FilmFinish />
    <Audio src={staticFile('topblast-v2-score.wav')} />
  </AbsoluteFill>
);
