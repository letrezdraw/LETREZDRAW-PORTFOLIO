import { useEffect, useRef, useState } from 'react';
import { useMousePosition } from '../hooks/useMousePosition';

export const CustomCursor = () => {
  const mousePos = useMousePosition();
  const cursorRef = useRef(null);
  const coordsRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [cursorContext, setCursorContext] = useState('');
  const lerpPosRef = useRef({ x: 0, y: 0 });
  const coordsLerpRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const cursor = cursorRef.current;
    const coords = coordsRef.current;
    if (!cursor) return;

    const updateCursor = () => {
      // Smooth lerp for cursor position
      lerpPosRef.current.x += (mousePos.x - lerpPosRef.current.x) * 0.18;
      lerpPosRef.current.y += (mousePos.y - lerpPosRef.current.y) * 0.18;

      const size = isExpanded ? 32 : 8;
      const offset = size / 2;

      cursor.style.left = `${lerpPosRef.current.x - offset}px`;
      cursor.style.top = `${lerpPosRef.current.y - offset}px`;
      cursor.style.width = `${size}px`;
      cursor.style.height = `${size}px`;

      // Update coordinates display with smooth lerp
      coordsLerpRef.current.x += (mousePos.x - coordsLerpRef.current.x) * 0.25;
      coordsLerpRef.current.y += (mousePos.y - coordsLerpRef.current.y) * 0.25;

      if (coords) {
        coords.style.left = `${coordsLerpRef.current.x + 16}px`;
        coords.style.top = `${coordsLerpRef.current.y + 16}px`;
      }

      requestAnimationFrame(updateCursor);
    };

    const frameId = requestAnimationFrame(updateCursor);

    // Detect hover over interactive elements and determine context
    const handleMouseMove = (e) => {
      const target = e.target;
      let expanded = false;
      let context = '';

      if (target.tagName === 'BUTTON' || target.closest('button')) {
        expanded = true;
        context = 'OPEN_FILE';
      } else if (target.tagName === 'A' || target.closest('a')) {
        expanded = true;
        context = 'LINK_OPEN';
      } else if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('select')
      ) {
        expanded = true;
        context = 'TXT_INPUT';
      } else if (target.classList.contains('interactive')) {
        expanded = true;
        context = 'INTERACT';
      }

      setIsExpanded(expanded);
      setCursorContext(context);
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, [mousePos, isExpanded]);

  return (
    <>
      {/* Main Cursor */}
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          width: '8px',
          height: '8px',
          background: isExpanded ? 'transparent' : 'var(--accent-red)',
          border: isExpanded ? '2px solid var(--accent-red)' : 'none',
          boxSizing: 'border-box',
          pointerEvents: 'none',
          zIndex: 9997,
          transition: 'background 0.2s ease-out, border 0.2s ease-out'
        }}
      />

      {/* Coordinate Display */}
      <div
        ref={coordsRef}
        style={{
          position: 'fixed',
          fontSize: '10px',
          color: 'var(--accent-red)',
          fontFamily: "'Share Tech Mono', monospace",
          pointerEvents: 'none',
          zIndex: 9996,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          whiteSpace: 'nowrap',
          textShadow: '0 0 8px rgba(0, 0, 0, 0.8)'
        }}
      >
        <div>X:{String(Math.round(mousePos.x)).padStart(3, '0')} Y:{String(Math.round(mousePos.y)).padStart(3, '0')}</div>
        {cursorContext && (
          <div style={{ fontSize: '9px', marginTop: '2px' }}>{cursorContext}</div>
        )}
      </div>
    </>
  );
};
