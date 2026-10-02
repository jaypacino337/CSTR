import {createContext, useContext} from 'react';

/**
 * Calm mode: the same film with the spectacle dialled down —
 * no flashes/shockwaves, fewer particles, softer glow, gentle cross-fade
 * transitions. Toggle per composition with <Calm.Provider value>.
 */
export const Calm = createContext(false);
export const useCalm = () => useContext(Calm);
