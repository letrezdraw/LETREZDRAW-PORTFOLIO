import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Commissions = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const sectionStamp = containerRef.current?.querySelector('.section-stamp');
    const banner = containerRef.current?.querySelector('.commission-banner');
    const cards = containerRef.current?.querySelectorAll('.tier-card');

    if (sectionStamp) {
      gsap.to(sectionStamp, {
        opacity: 1,
        y: 0,
        scrollTrigger: {
          trigger: sectionStamp,
          start: 'top 80%',
          once: true
        }
      });
    }

    if (banner) {
      gsap.to(banner, {
        opacity: 1,
        y: 0,
        scrollTrigger: {
          trigger: banner,
          start: 'top 80%',
          once: true
        }
      });
    }

    cards?.forEach((card, idx) => {
      gsap.to(card, {
        opacity: 1,
        y: 0,
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          once: true
        },
        delay: idx * 0.12
      });
    });
  }, []);

  const tiers = [
    {
      name: 'TIER_01',
      title: 'BASIC FILE',
      price: '$50',
      features: [
        'Single Character Design',
        'Black & White',
        'Small Format',
        '1 Revision',
        '7 Day Turnaround'
      ]
    },
    {
      name: 'TIER_02',
      title: 'STANDARD DOSSIER',
      price: '$150',
      features: [
        'Character or Scene',
        'Full Color',
        'Medium Format',
        '2 Revisions',
        '14 Day Turnaround',
        'High Resolution'
      ]
    },
    {
      name: 'TIER_03',
      title: 'PREMIUM ARCHIVE',
      price: '$300+',
      features: [
        'Custom Concept',
        'Full Color',
        'Large Format',
        'Unlimited Revisions',
        ' Priority',
        'Commercial Rights'
      ]
    }
  ];

  return (
    <section
      id="commissions"
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
          transform: 'translateY(20px)'
        }}
      >
        // <span style={{ color: 'var(--accent-red)' }}>CLEARANCE_REQUEST</span> ◈ COMMISSION_PORTAL ◈ STATUS: <span style={{ color: 'var(--accent-red)' }}>ACCEPTING</span>
      </div>

      {/* Banner */}
      <div
        className="commission-banner"
        style={{
          fontSize: '13px',
          color: 'var(--accent-red)',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          textAlign: 'center',
          marginBottom: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          opacity: 0,
          transform: 'translateY(20px)'
        }}
      >
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'var(--accent-red)',
            animation: 'pulse-blink 1s infinite'
          }}
        />
        CURRENTLY ACCEPTING COMMISSIONS — REMOTE WORLDWIDE
      </div>

      {/* Tier Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        {tiers.map((tier, idx) => (
          <div
            key={tier.name}
            className="tier-card"
            style={{
              border: '1px solid var(--border-color)',
              padding: '32px 24px',
              background: 'var(--bg-card)',
              position: 'relative',
              opacity: 0,
              transform: 'translateY(30px)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.border = '1px solid var(--border-active)';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(204, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.border = '1px solid var(--border-color)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Corner Brackets */}
            <div className="corner-bracket corner-tl" style={{ top: 4, left: 4 }} />
            <div className="corner-bracket corner-tr" style={{ top: 4, right: 4 }} />
            <div className="corner-bracket corner-bl" style={{ bottom: 4, left: 4 }} />
            <div className="corner-bracket corner-br" style={{ bottom: 4, right: 4 }} />

            {/* Content */}
            <div style={{ fontSize: '11px', color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
              {tier.name}
            </div>

            <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', fontFamily: "'Cinzel', serif", margin: '0 0 8px 0' }}>
              {tier.title}
            </h3>

            <div style={{ fontSize: '24px', color: 'var(--accent-red)', fontFamily: "'Cinzel', serif", marginBottom: '24px', fontWeight: 'bold' }}>
              {tier.price}
            </div>

            {/* Features */}
            <ul style={{ listStyle: 'none', padding: 0, margin: '24px 0', fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '2' }}>
              {tier.features.map((feature, fidx) => (
                <li key={fidx} style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <span style={{ color: 'var(--accent-red)' }}>[✓]</span> {feature}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <button
              className="button-red"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginTop: '24px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.boxShadow = '0 0 16px rgba(255, 17, 17, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = 'none';
              }}
            >
              [REQUEST CLEARANCE →]
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
