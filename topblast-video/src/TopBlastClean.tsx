import {Calm} from './components/calm';
import {TopBlastLaunch} from './TopBlastLaunch';

/** Same film, calmer: simpler transitions, no flashes or shockwaves, softer glow. */
export const TopBlastClean: React.FC = () => (
  <Calm.Provider value>
    <TopBlastLaunch audio="topblast-clean-score.wav" />
  </Calm.Provider>
);
