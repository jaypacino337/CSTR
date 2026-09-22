import {Composition} from 'remotion';
import {TopBlastLaunch} from './TopBlastLaunch';
import tl from './timeline.json';
import './fonts';

export const Root: React.FC = () => (
  <Composition
    id="TopBlastLaunch"
    component={TopBlastLaunch}
    durationInFrames={tl.duration}
    fps={tl.fps}
    width={tl.width}
    height={tl.height}
  />
);
