import { pointer } from '../pointerStore';

/**
 * @deprecated for per-frame tracking — reads the shared pointer object (same reference).
 * Does not subscribe to moves; use pointer from '../pointerStore' in rAF instead.
 */
export const useMousePosition = () => pointer;
