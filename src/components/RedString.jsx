import { useEffect, useRef } from 'react';
import { pointer } from '../pointerStore';

export const RedString = () => {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const layout = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    layout();

    const anchors = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isMobile = w < 768;
      if (isMobile) {
        return [
          { x: 20, y: 20, baseX: 20, baseY: 20 },
          { x: w - 20, y: h - 20, baseX: w - 20, baseY: h - 20 }
        ];
      }
      return [
        { x: 20, y: 20, baseX: 20, baseY: 20 },
        { x: w - 20, y: 20, baseX: w - 20, baseY: 20 },
        { x: 20, y: h - 20, baseX: 20, baseY: h - 20 },
        { x: w - 20, y: h - 20, baseX: w - 20, baseY: h - 20 },
        { x: w / 2, y: 20, baseX: w / 2, baseY: 20 },
        { x: w / 2, y: h - 20, baseX: w / 2, baseY: h - 20 }
      ];
    };

    let points = anchors();
    let time = 0;

    const handleResize = () => {
      layout();
      points = anchors();
    };

    window.addEventListener('resize', handleResize, { passive: true });

    const tick = () => {
      time += 0.012;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      points.forEach((point) => {
        point.x = point.baseX + Math.sin(time) * 3;
        point.y = point.baseY + Math.cos(time * 0.7) * 3;
      });

      ctx.strokeStyle = 'rgba(204, 0, 0, 0.28)';
      ctx.lineWidth = 1;

      points.forEach((point) => {
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(pointer.x, pointer.y);
        ctx.stroke();
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', top: 0, left: 0, zIndex: 0, pointerEvents: 'none' }}
      aria-hidden
    />
  );
};
