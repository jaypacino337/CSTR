import {Composition} from 'remotion';
import {TopBlastLaunch} from './TopBlastLaunch';
import {TopBlastClean} from './TopBlastClean';
import tl from './timeline.json';
import {StonkArena} from './arena/StonkArena';
import {StonkArenaClean} from './arena/StonkArenaClean';
import atl from './arena/timeline.json';
import './fonts';

export const Root: React.FC = () => (
  <>
  <Composition
    id="TopBlastLaunch"
    component={TopBlastLaunch}
    durationInFrames={tl.duration}
    fps={tl.fps}
    width={tl.width}
    height={tl.height}
  />
  <Composition
    id="TopBlastClean"
    component={TopBlastClean}
    durationInFrames={tl.duration}
    fps={tl.fps}
    width={tl.width}
    height={tl.height}
  />
  <Composition
    id="StonkArena"
    component={StonkArena}
    durationInFrames={atl.duration}
    fps={atl.fps}
    width={atl.width}
    height={atl.height}
  />
  <Composition
    id="StonkArenaClean"
    component={StonkArenaClean}
    durationInFrames={atl.duration}
    fps={atl.fps}
    width={atl.width}
    height={atl.height}
  />
  </>
);
