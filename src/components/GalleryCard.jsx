import { useState, useEffect, useRef } from 'react';

export const GalleryCard = ({ artwork }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const scanLine = cardRef.current?.querySelector('.scan-line');
    if (!scanLine) return;

    const animate = () => {
      scanLine.style.animation = 'scan-line-horizontal 1.5s linear infinite';
    };

    if (isHovered) {
      animate();
    }
  }, [isHovered]);

  return (
    <div
      ref={cardRef}
      style={{
        position: 'relative',
        width: isHovered ? '420px' : '300px',
        height: '85vh',
        transition: 'width 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        border: `1px solid ${isHovered ? 'var(--border-active)' : 'var(--border-color)'}`,
        cursor: 'pointer',
        overflow: 'hidden',
        background: 'var(--bg-card)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image */}
      <img
        src={artwork.image}
        alt={artwork.title}
        loading="lazy"
        decoding="async"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: isHovered
            ? 'grayscale(0%) brightness(1)'
            : 'grayscale(60%) brightness(0.6)',
          transition: 'filter 0.3s ease'
        }}
      />

      {/* Dark Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isHovered ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.75)',
          transition: 'background 0.3s ease'
        }}
      />

      {/* Scan Line Effect */}
      <div
        className="scan-line"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'rgba(204, 0, 0, 0.5)',
          display: isHovered ? 'block' : 'none'
        }}
      />

      {/* Corner Brackets */}
      <div className="corner-bracket corner-tl" />
      <div className="corner-bracket corner-tr" />
      <div className="corner-bracket corner-bl" />
      <div className="corner-bracket corner-br" />

      {/* Content */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '24px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
          color: 'var(--text-primary)'
        }}
      >
        <div style={{ fontSize: '11px', color: 'var(--accent-red)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          {artwork.id}
        </div>
        <div
          style={{
            display: 'inline-block',
            fontSize: '10px',
            background: 'rgba(204, 0, 0, 0.2)',
            border: '1px solid var(--accent-red)',
            color: 'var(--accent-red)',
            padding: '4px 8px',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontFamily: "'Bebas Neue', sans-serif"
          }}
        >
          {artwork.category}
        </div>
        <h3
          style={{
            fontSize: '20px',
            color: 'var(--text-primary)',
            margin: '0 0 12px 0',
            fontFamily: "'Cinzel', serif"
          }}
        >
          {artwork.title}
        </h3>
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0, cursor: 'pointer' }}>
          [ CLICK TO DECLASSIFY ]
        </p>
      </div>
    </div>
  );
};
