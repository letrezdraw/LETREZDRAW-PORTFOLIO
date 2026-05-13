import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { artworks } from '../data/artworks';
import { GalleryCard } from './GalleryCard';
import { Lightbox } from './Lightbox';

gsap.registerPlugin(ScrollTrigger);

export const Gallery = () => {
  const [viewMode, setViewMode] = useState('slider'); // 'slider' or 'list'
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const sliderRef = useRef(null);

  // Navigate slider
  const scrollToCard = (index) => {
    if (sliderRef.current && index >= 0 && index < artworks.length) {
      const cardWidth = 320; // 300px card + 16px gap + 4px buffer
      sliderRef.current.scrollTo({
        left: cardWidth * index,
        behavior: 'smooth'
      });
      setCurrentIndex(index);
    }
  };

  const handlePrev = () => {
    const newIndex = Math.max(0, currentIndex - 1);
    scrollToCard(newIndex);
  };

  const handleNext = () => {
    const newIndex = Math.min(artworks.length - 1, currentIndex + 1);
    scrollToCard(newIndex);
  };

  // Scroll-triggered reveals (cleaned up on unmount / view change)
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return undefined;

    const ctx = gsap.context(() => {
      const sectionStamp = root.querySelector('.section-stamp');
      const cards = root.querySelectorAll('.gallery-card-item');

      if (sectionStamp) {
        gsap.to(sectionStamp, {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: sectionStamp,
            start: 'top 85%',
            once: true
          }
        });
      }

      cards.forEach((card, idx) => {
        gsap.to(card, {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            once: true
          },
          delay: idx * 0.05
        });
      });
    }, root);

    return () => ctx.revert();
  }, [viewMode]);

  return (
    <section
      id="gallery"
      ref={containerRef}
      style={{
        padding: '64px 48px',
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        borderTop: '1px solid var(--border-color)'
      }}
    >
      {/* Section Header */}
      <div
        className="section-stamp"
        style={{
          fontSize: '12px',
          color: 'var(--text-primary)',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          marginBottom: '48px',
          opacity: 0,
          transform: 'translateY(20px)',
          transition: 'all 0.6s ease'
        }}
      >
        // <span style={{ color: 'var(--accent-red)' }}>CLASSIFIED_ARCHIVE</span> ◈ EVIDENCE BOARD ◈ {artworks.length} <span style={{ color: 'var(--accent-red)' }}>FILES FOUND</span>
      </div>

      {/* View Toggle */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'flex-end',
          marginBottom: '32px'
        }}
      >
        {['slider', 'list'].map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            style={{
              fontSize: '12px',
              color: viewMode === mode ? 'var(--accent-red)' : 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              background: 'none',
              border: 'none',
              borderBottom: viewMode === mode ? '2px solid var(--accent-red)' : 'none',
              paddingBottom: '4px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            [{mode.toUpperCase()}]
          </button>
        ))}
      </div>

      {/* Slider View with Arrow Navigation */}
      {viewMode === 'slider' && (
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            style={{
              position: 'relative',
              fontSize: '24px',
              background: 'none',
              border: '1px solid var(--border-color)',
              color: currentIndex === 0 ? 'var(--text-muted)' : 'var(--accent-red)',
              padding: '12px 16px',
              cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              opacity: currentIndex === 0 ? 0.4 : 1
            }}
            onMouseEnter={(e) => {
              if (currentIndex > 0) {
                e.target.style.borderColor = 'var(--accent-red)';
                e.target.style.boxShadow = 'inset 0 0 8px rgba(204, 0, 0, 0.2)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = 'var(--border-color)';
              e.target.style.boxShadow = 'none';
            }}
          >
            [←]
          </button>

          {/* Slider Container */}
          <div
            ref={sliderRef}
            style={{
              display: 'flex',
              gap: '16px',
              flex: 1,
              overflowX: 'auto',
              overflowY: 'hidden',
              paddingBottom: '16px',
              scrollBehavior: 'smooth',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {artworks.map((artwork) => (
              <div
                key={artwork.id}
                className="gallery-card-item"
                style={{
                  minWidth: '300px',
                  opacity: 0,
                  transform: 'translateY(30px)'
                }}
                onClick={() => setSelectedArtwork(artwork)}
              >
                <GalleryCard artwork={artwork} />
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            disabled={currentIndex === artworks.length - 1}
            style={{
              position: 'relative',
              fontSize: '24px',
              background: 'none',
              border: '1px solid var(--border-color)',
              color: currentIndex === artworks.length - 1 ? 'var(--text-muted)' : 'var(--accent-red)',
              padding: '12px 16px',
              cursor: currentIndex === artworks.length - 1 ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              opacity: currentIndex === artworks.length - 1 ? 0.4 : 1
            }}
            onMouseEnter={(e) => {
              if (currentIndex < artworks.length - 1) {
                e.target.style.borderColor = 'var(--accent-red)';
                e.target.style.boxShadow = 'inset 0 0 8px rgba(204, 0, 0, 0.2)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = 'var(--border-color)';
              e.target.style.boxShadow = 'none';
            }}
          >
            [→]
          </button>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          {artworks.map((artwork) => (
            <div
              key={artwork.id}
              className="gallery-card-item"
              style={{
                display: 'grid',
                gridTemplateColumns: '160px 1fr auto',
                gap: '24px',
                alignItems: 'center',
                padding: '16px',
                borderBottom: '1px solid var(--border-color)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                opacity: 0,
                transform: 'translateY(30px)',
                ':hover': {
                  borderLeft: '4px solid var(--accent-red)'
                }
              }}
              onClick={() => setSelectedArtwork(artwork)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(204, 0, 0, 0.05)';
                e.currentTarget.style.borderLeft = '4px solid var(--accent-red)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none';
                e.currentTarget.style.borderLeft = 'none';
              }}
            >
              {/* Thumbnail */}
              <img
                src={artwork.image}
                alt={artwork.title}
                loading="lazy"
                decoding="async"
                style={{
                  width: '160px',
                  height: '100px',
                  objectFit: 'cover',
                  filter: 'grayscale(60%) brightness(0.6)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.filter = 'grayscale(0%) brightness(1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.filter = 'grayscale(60%) brightness(0.6)';
                }}
              />

              {/* Info */}
              <div>
                <div style={{ fontSize: '11px', color: 'var(--accent-red)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {artwork.id}
                </div>
                <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '4px', fontFamily: "'Cinzel', serif" }}>
                  {artwork.title}
                </h3>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {artwork.category}
                </div>
              </div>

              {/* CTA */}
              <button
                style={{
                  fontSize: '11px',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                  padding: '8px 12px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  background: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = 'var(--accent-red)';
                  e.target.style.color = 'var(--accent-red)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = 'var(--border-color)';
                  e.target.style.color = 'var(--text-secondary)';
                }}
              >
                [DECLASSIFY →]
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {selectedArtwork && (
        <Lightbox
          artwork={selectedArtwork}
          currentIndex={artworks.findIndex((a) => a.id === selectedArtwork.id)}
          totalFiles={artworks.length}
          onClose={() => setSelectedArtwork(null)}
          onNext={() => {
            const currentIdx = artworks.findIndex((a) => a.id === selectedArtwork.id);
            if (currentIdx < artworks.length - 1) {
              setSelectedArtwork(artworks[currentIdx + 1]);
            }
          }}
          onPrev={() => {
            const currentIdx = artworks.findIndex((a) => a.id === selectedArtwork.id);
            if (currentIdx > 0) {
              setSelectedArtwork(artworks[currentIdx - 1]);
            }
          }}
        />
      )}
    </section>
  );
};
