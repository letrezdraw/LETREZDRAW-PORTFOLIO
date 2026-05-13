/**
 * Single passive mousemove listener + shared coordinates.
 * Avoids React state updates on every pointer move (major source of jank).
 */
export const pointer = { x: 0, y: 0 };

let initialized = false;

export function initPointerStore() {
  if (initialized || typeof window === 'undefined') return () => {};
  initialized = true;

  pointer.x = window.innerWidth / 2;
  pointer.y = window.innerHeight / 2;

  const onMove = (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
  };

  window.addEventListener('mousemove', onMove, { passive: true });

  return () => {
    window.removeEventListener('mousemove', onMove);
    initialized = false;
  };
}
