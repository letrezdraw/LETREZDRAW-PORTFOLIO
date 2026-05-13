import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export const Lightbox = ({ artwork, currentIndex, totalFiles, onClose, onNext, onPrev }) => {
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timeline = gsap.timeline();

    // Open animation
    timeline.to(overlayRef.current, {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out'
    });

    timeline.to(
      panelRef.current,
      {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out'
      },
      0
    );

    // Keyboard shortcuts
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, onNext, onPrev]);

  const handleClose = () => {
    const timeline = gsap.timeline();

    timeline.to(panelRef.current, {
      y: 40,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in'
    });

    timeline.to(
      overlayRef.current,
      {
        opacity: 0,
        duration: 0.2
      },
      0
    );

    timeline.eventCallback('onComplete', onClose);
  };

  const handleNavigation = (callback) => {
    if (isLoading) return;
    setIsLoading(true);
    
    // Fade out content
    gsap.to(panelRef.current, {
      opacity: 0.4,
      duration: 0.15,
      ease: 'power2.in'
    });

    // Call the navigation callback after a brief delay
    setTimeout(() => {
      callback();
      // Fade back in after artwork changes
      setTimeout(() => {
        gsap.to(panelRef.current, {
          opacity: 1,
          duration: 0.15,
          ease: 'power2.out'
        });
        setIsLoading(false);
      }, 100);
    }, 200);
  };

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={handleClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          opacity: 0,
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'var(--bg-primary)',
          borderTop: '1px solid var(--border-color)',
          maxHeight: '90vh',
          overflowY: 'auto',
          zIndex: 1001,
          y: 40,
          opacity: 0
        }}
      >
        <div style={{ padding: '48px', maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '32px',
              paddingBottom: '16px',
              borderBottom: '1px solid var(--border-color)'
            }}
          >
            <div style={{ fontSize: '12px', color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              TOP SECRET // DECLASSIFIED
            </div>
            <button
              onClick={handleClose}
              style={{
                fontSize: '11px',
                color: 'var(--text-secondary)',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
              onMouseEnter={(e) => (e.target.style.color = 'var(--accent-red)')}
              onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
            >
              [CLOSE FILE ESC]
            </button>
          </div>

          {/* File Info - Top Section */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '48px',
              marginBottom: '64px',
              alignItems: 'start'
            }}
          >
            {/* Left - Main Image */}
            <div>
              <div style={{ position: 'relative' }}>
                <img
                  src={artwork.image}
                  alt={artwork.title}
                  style={{
                    width: '100%',
                    maxWidth: '100%',
                    height: '400px',
                    border: '1px solid var(--border-color)',
                    objectFit: 'cover'
                  }}
                />
                <div className="corner-bracket corner-tl" style={{ top: 8, left: 8 }} />
                <div className="corner-bracket corner-tr" style={{ top: 8, right: 8 }} />
                <div className="corner-bracket corner-bl" style={{ bottom: 8, left: 8 }} />
                <div className="corner-bracket corner-br" style={{ bottom: 8, right: 8 }} />
              </div>
            </div>

            {/* Right - Metadata */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {/* File Info Header */}
              <div>
                <div style={{ fontSize: '11px', color: 'var(--accent-red)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {artwork.id}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  TYPE: {artwork.category}
                </div>
              </div>

              {/* Metadata */}
              <div>
                <h4 style={{ fontSize: '11px', color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                  // METADATA
                </h4>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  <div>YEAR: {artwork.year}</div>
                  <div>MEDIUM: {artwork.medium}</div>
                  <div>CATEGORY: {artwork.category}</div>
                  <div>TAGS: {artwork.tags?.join(', ')}</div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 style={{ fontSize: '11px', color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                  // ARTWORK_BRIEF
                </h4>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.8', margin: 0 }}>
                  {artwork.description}
                </p>
              </div>

              {/* Tools */}
              <div>
                <h4 style={{ fontSize: '11px', color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                  // TOOLS_USED
                </h4>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  {artwork.tools?.join(' · ')}
                </div>
              </div>

              {/* Commission Status */}
              <div>
                <h4 style={{ fontSize: '11px', color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                  // COMMISSION_STATUS
                </h4>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  ◉ {artwork.commissionStatus} — Request Available
                </div>
              </div>
            </div>
          </div>

          {/* Evidence Grid Section */}
          {artwork.imageSecondary && (
            <>
              <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '12px', color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
                  // EVIDENCE_FILES & RELATED_ASSETS
                </h3>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                  gap: '24px',
                  marginBottom: '48px'
                }}
              >
                {/* Detail/Secondary Image */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <img
                    src={artwork.imageSecondary}
                    alt="Detail - Process"
                    style={{
                      width: '100%',
                      height: '200px',
                      border: '1px solid var(--border-color)',
                      objectFit: 'cover',
                      marginBottom: '12px'
                    }}
                  />
                  <div style={{ fontSize: '11px', color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                    DETAIL_VIEW
                  </div>
                  <p style={{ fontSize: '10px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                    Close-up detail and process documentation of key elements.
                  </p>
                </div>

                {/* Sketch/Concept Variant */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <img
                    src={artwork.image}
                    alt="Sketch - Initial Concept"
                    style={{
                      width: '100%',
                      height: '200px',
                      border: '1px solid var(--border-color)',
                      objectFit: 'cover',
                      marginBottom: '12px',
                      filter: 'saturate(0.7)'
                    }}
                  />
                  <div style={{ fontSize: '11px', color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                    SKETCH_CONCEPT
                  </div>
                  <p style={{ fontSize: '10px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                    Initial concept sketches and design variations.
                  </p>
                </div>

                {/* Color Study Variant */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <img
                    src={artwork.image}
                    alt="Color - Study"
                    style={{
                      width: '100%',
                      height: '200px',
                      border: '1px solid var(--border-color)',
                      objectFit: 'cover',
                      marginBottom: '12px',
                      filter: 'hue-rotate(45deg)'
                    }}
                  />
                  <div style={{ fontSize: '11px', color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                    COLOR_STUDY
                  </div>
                  <p style={{ fontSize: '10px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                    Alternative color palettes and lighting studies.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Navigation */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-color)'
            }}
          >
            <button
              onClick={() => handleNavigation(onPrev)}
              disabled={isLoading || currentIndex === 0}
              className="button-terminal"
              style={{ 
                opacity: isLoading || currentIndex === 0 ? 0.5 : 1, 
                pointerEvents: isLoading || currentIndex === 0 ? 'none' : 'auto',
                cursor: isLoading || currentIndex === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              [← PREV FILE]
            </button>

            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {isLoading ? (
                <span style={{ animation: 'pulse-blink 1.5s infinite', display: 'inline-block' }}>
                  LOADING...
                </span>
              ) : (
                `File ${(currentIndex ?? 0) + 1} of ${totalFiles ?? 8}`
              )}
            </div>

            <button 
              onClick={() => handleNavigation(onNext)} 
              disabled={isLoading || currentIndex === (totalFiles ?? 8) - 1}
              className="button-terminal" 
              style={{ 
                opacity: isLoading || currentIndex === (totalFiles ?? 8) - 1 ? 0.5 : 1, 
                pointerEvents: isLoading || currentIndex === (totalFiles ?? 8) - 1 ? 'none' : 'auto',
                cursor: isLoading || currentIndex === (totalFiles ?? 8) - 1 ? 'not-allowed' : 'pointer'
              }}
            >
              [NEXT FILE →]
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
