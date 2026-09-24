import {Calm} from '../components/calm';
import {StonkArena} from './StonkArena';

/** Same film, calmer: simpler transitions, no flashes or shockwaves, softer glow. */
export const StonkArenaClean: React.FC = () => (
  <Calm.Provider value>
    <StonkArena audio="stonkarena-clean-score.wav" />
  </Calm.Provider>
);
