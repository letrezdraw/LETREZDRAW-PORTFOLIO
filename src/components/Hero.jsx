import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useMousePosition } from '../hooks/useMousePosition';
import { useDeviceCapability } from '../hooks/useDeviceCapability';
import PixelBlast from './PixelBlast';

export const Hero = () => {
  const [bootComplete, setBootComplete] = useState(false);
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
  const [showGlitch, setShowGlitch] = useState(false);
  const mousePos = useMousePosition();
  const device = useDeviceCapability();
  const containerRef = useRef(null);
  const spotlightRef = useRef(null);
  const spotlightLerpRef = useRef({ x: 0, y: 0 });

  // Update mouse coordinates display
  useEffect(() => {
    setMouseCoords({ x: mousePos.x, y: mousePos.y });
  }, [mousePos]);

  // Boot sequence animation
  useEffect(() => {
    if (bootComplete) return;

    const bootLines = [
      { text: 'INITIALIZING ARCHIVE SYSTEM...', delay: 0 },
      { text: 'CLEARANCE LEVEL: UNRESTRICTED', delay: 0.6 },
      { text: 'ACCESSING FILE: LETREZDRAW_ART_VAULT', delay: 1.2 },
      { text: 'ENCRYPTION: BYPASSED', delay: 1.8 },
      { text: 'STATUS: [████████████] 100% LOADED', delay: 2.2 },
      { text: 'WARNING: CLASSIFIED CONTENT AHEAD', delay: 2.8, isRed: true },
      { text: 'PRESS ANY KEY TO DECLASSIFY...', delay: 3.2, isBlinking: true }
    ];

    const timeline = gsap.timeline();

    bootLines.forEach((line, idx) => {
      const elementId = `boot-line-${idx}`;
      // Type in the text character by character
      timeline.to(
        `#${elementId}`,
        {
          duration: line.text.length * 0.02,
          onStart: () => {
            const el = document.getElementById(elementId);
            if (el) {
              let displayText = '';
              const chars = line.text.split('');
              let charIdx = 0;

              const typeInterval = setInterval(() => {
                if (charIdx < chars.length) {
                  displayText += chars[charIdx];
                  el.textContent = displayText;
                  charIdx++;
                } else {
                  clearInterval(typeInterval);
                }
              }, 20);
            }
          }
        },
        line.delay
      );
    });

    // After boot sequence, wait for key press or auto-complete
    timeline.set({}, {}, '+=1');

    // Listen for key press to skip boot
    const handleKeyPress = () => {
      timeline.progress(1);
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('click', handleKeyPress);
    };

    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('click', handleKeyPress);

    // Complete boot after timeline finishes
    timeline.eventCallback('onComplete', () => {
      setBootComplete(true);
    });

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('click', handleKeyPress);
    };
  }, [bootComplete]);

  // Glitch effect on main title
  useEffect(() => {
    if (!bootComplete) return;

    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setShowGlitch(true);
        setTimeout(() => setShowGlitch(false), 150);
      }
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(glitchInterval);
  }, [bootComplete]);

  // Spotlight effect animation
  useEffect(() => {
    if (!bootComplete || !spotlightRef.current || !containerRef.current) return;

    const animate = () => {
      spotlightLerpRef.current.x += (mousePos.x - spotlightLerpRef.current.x) * 0.1;
      spotlightLerpRef.current.y += (mousePos.y - spotlightLerpRef.current.y) * 0.1;

      const spotlight = spotlightRef.current;
      const container = containerRef.current;
      
      if (spotlight && container) {
        // Get container position relative to viewport
        const rect = container.getBoundingClientRect();
        
        // Calculate spotlight position relative to container
        const relativeX = spotlightLerpRef.current.x - rect.left;
        const relativeY = spotlightLerpRef.current.y - rect.top;
        
        // Update CSS variables with percentages relative to container
        // Allow values beyond 0-100 to let spotlight extend slightly beyond edges
        const xPercent = (relativeX / rect.width) * 100;
        const yPercent = (relativeY / rect.height) * 100;
        
        spotlight.style.setProperty('--spotlight-x', `${xPercent}%`);
        spotlight.style.setProperty('--spotlight-y', `${yPercent}%`);
      }

      requestAnimationFrame(animate);
    };

    const frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [bootComplete, mousePos]);

  return (
    <section
      ref={containerRef}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'var(--bg-primary)',
        padding: '48px 48px 0 48px',
        position: 'relative',
        overflow: 'hidden',
        marginTop: '48px'
      }}
    >
      {/* Spotlight Effect - Limited to Hero Section Only */}
      {bootComplete && (
        <div
          ref={spotlightRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(5, 5, 5, 0.98)',
            pointerEvents: 'none',
            zIndex: 1000,
            mask: `radial-gradient(circle 700px at var(--spotlight-x, 50%) var(--spotlight-y, 50%), transparent 0%, transparent 20%, black 80%)`,
            WebkitMask: `radial-gradient(circle 700px at var(--spotlight-x, 50%) var(--spotlight-y, 50%), transparent 0%, transparent 20%, black 80%)`,
            transition: 'mask 0ms linear, -webkit-mask 0ms linear'
          }}
        />
      )}
      {/* Pixel Blast Background Effect - Blended with Dark Areas (Desktop Only) */}
      {bootComplete && !device.isMobile && device.supportsWebGL2 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 5,
            opacity: 0.15
          }}
        >
          <PixelBlast
            variant="square"
            pixelSize={4}
            color="#6D5D8F"
            patternScale={2}
            patternDensity={0.8}
            pixelSizeJitter={0}
            enableRipples={false}
            liquid={false}
            speed={0.3}
            edgeFade={0.3}
            transparent
          />
        </div>
      )}
      {/* Boot Sequence */}
      {!bootComplete && (
        <div style={{
          width: '100%',
          maxWidth: '600px',
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '14px',
          lineHeight: '2',
          color: 'var(--text-primary)',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all'
        }}>
          {[...Array(7)].map((_, i) => (
            <div key={i} id={`boot-line-${i}`} style={{ minHeight: '24px' }} />
          ))}
        </div>
      )}

      {/* Hero Content */}
      {bootComplete && (
        <div
          style={{
            opacity: 0,
            animation: 'fade-in 0.8s ease-in-out forwards',
            position: 'relative',
            zIndex: 10
          }}
        >
          {/* Top Left - File ID */}
          <div
            style={{
              position: 'absolute',
              top: '0',
              left: '64px',
              fontSize: '11px',
              color: 'var(--text-primary)',
              letterSpacing: '1px'
            }}
          >
            <span style={{ color: 'var(--accent-red)' }}>FILE_ID:</span> LTZ-PORTFOLIO-2026
          </div>

          {/* Top Right - Camera Feed */}
          <div
            style={{
              position: 'absolute',
              top: '0',
              right: '64px',
              fontSize: '11px',
              color: 'var(--accent-red)',
              letterSpacing: '1px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-red)' }} />
            FEED_ACTIVE ISO 1600 {String(new Date().getHours()).padStart(2, '0')}:{String(new Date().getMinutes()).padStart(2, '0')}:{String(new Date().getSeconds()).padStart(2, '0')}
          </div>

          {/* Center Content */}
          <div style={{ textAlign: 'center' }}>
            <h1
              style={{
                fontSize: '120px',
                fontFamily: "'Cinzel', serif",
                color: 'var(--text-primary)',
                margin: '0 0 16px 0',
                animation: showGlitch ? 'rgb-split 0.15s ease' : 'none',
                textShadow: showGlitch
                  ? `-2px 0 #ff1111, 2px 0 #00ffff`
                  : 'none'
              }}
            >
              LETREZDRAW
            </h1>

            <p
              style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                margin: '0 0 32px 0'
              }}
            >
              DIGITAL ILLUSTRATOR · CHARACTER DESIGN · CONCEPT ART · ENVIRONMENTS
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '64px' }}>
              <button
                className="button-terminal"
                onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
              >
                [ACCESS_FILES →]
              </button>
              <button
                className="button-terminal"
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              >
                [VIEW_PROFILE →]
              </button>
            </div>

            {/* Scroll Indicator */}
            <div
              style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
                animation: 'bounce-subtle 2s infinite',
                marginBottom: '32px'
              }}
            >
              ▼ SCROLL TO DECLASSIFY ▼
            </div>
          </div>

          {/* Bottom Left - Coordinates */}
          <div
            style={{
              position: 'absolute',
              bottom: '32px',
              left: '64px',
              fontSize: '11px',
              color: 'var(--accent-red)',
              letterSpacing: '1px',
              lineHeight: '1.8'
            }}
          >
            LAT: 18.5204 N<br />
            LON: 73.8567 E
          </div>

          {/* Bottom Right - Mouse Position */}
          <div
            style={{
              position: 'absolute',
              bottom: '32px',
              right: '64px',
              fontSize: '11px',
              color: 'var(--accent-red)',
              letterSpacing: '1px'
            }}
          >
            MOUSE: X:{String(mouseCoords.x).padStart(3, '0')} Y:{String(mouseCoords.y).padStart(3, '0')}
          </div>
        </div>
      )}
    </section>
  );
};
