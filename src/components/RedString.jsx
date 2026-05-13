import { useEffect, useRef, useState } from 'react';
import { useMousePosition } from '../hooks/useMousePosition';

export const RedString = () => {
  const canvasRef = useRef(null);
  const mousePos = useMousePosition();
  const anchorPointsRef = useRef([]);
  const [hoveredCard, setHoveredCard] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext('2d');

    // Initialize anchor points
    const isMobile = window.innerWidth < 768;
    const initialAnchors = isMobile
      ? [
          { x: 20, y: 20, baseX: 20, baseY: 20 },
          { x: window.innerWidth - 20, y: window.innerHeight - 20, baseX: window.innerWidth - 20, baseY: window.innerHeight - 20 }
        ]
      : [
          { x: 20, y: 20, baseX: 20, baseY: 20 },
          { x: window.innerWidth - 20, y: 20, baseX: window.innerWidth - 20, baseY: 20 },
          { x: 20, y: window.innerHeight - 20, baseX: 20, baseY: window.innerHeight - 20 },
          { x: window.innerWidth - 20, y: window.innerHeight - 20, baseX: window.innerWidth - 20, baseY: window.innerHeight - 20 },
          { x: window.innerWidth / 2, y: 20, baseX: window.innerWidth / 2, baseY: 20 },
          { x: window.innerWidth / 2, y: window.innerHeight - 20, baseX: window.innerWidth / 2, baseY: window.innerHeight - 20 }
        ];

    anchorPointsRef.current = initialAnchors;

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    let animationFrameId;
    let time = 0;

    const animate = () => {
      time += 0.01;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update anchor points with sine wave drift
      anchorPointsRef.current.forEach((point) => {
        point.x = point.baseX + Math.sin(time) * 3;
        point.y = point.baseY + Math.cos(time * 0.7) * 3;
      });

      // Draw lines from anchor points to cursor
      ctx.strokeStyle = 'rgba(204, 0, 0, 0.35)';
      ctx.lineWidth = 1;

      anchorPointsRef.current.forEach((point) => {
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(mousePos.x, mousePos.y);
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePos]);

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: 0, pointerEvents: 'none' }} />;
};
