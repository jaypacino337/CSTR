import {Composition} from 'remotion';
import {TopBlastLaunch} from './TopBlastLaunch';
import {TopBlastClean} from './TopBlastClean';
import {TopBlastPremium} from './premium/TopBlastPremium';
import ptl from './premium/timeline.json';
import {TopBlastV2} from './v2/TopBlastV2';
import {Odte} from './odte/Odte';
import {CINE_DUR, OdteCinematic} from './odte/OdteCinematic';
import otl from './odte/timeline.json';
import v2tl from './v2/timeline.json';
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
    id="OdteCinematic"
    component={OdteCinematic}
    durationInFrames={CINE_DUR}
    fps={30}
    width={1920}
    height={1080}
  />
  <Composition
    id="OdteHype"
    component={Odte}
    durationInFrames={otl.duration}
    fps={otl.fps}
    width={otl.width}
    height={otl.height}
  />
  <Composition
    id="TopBlastV2"
    component={TopBlastV2}
    durationInFrames={v2tl.duration}
    fps={v2tl.fps}
    width={v2tl.width}
    height={v2tl.height}
  />
  <Composition
    id="TopBlastPremium"
    component={TopBlastPremium}
    durationInFrames={ptl.duration}
    fps={ptl.fps}
    width={ptl.width}
    height={ptl.height}
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
