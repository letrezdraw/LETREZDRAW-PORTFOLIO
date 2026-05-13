import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const About = () => {
  const containerRef = useRef(null);
  const [recActive, setRecActive] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setRecActive((prev) => !prev);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const sectionStamp = containerRef.current?.querySelector('.section-stamp');
    const leftCard = containerRef.current?.querySelector('.identity-card');
    const rightContent = containerRef.current?.querySelector('.right-content');

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

    if (leftCard) {
      gsap.to(leftCard, {
        opacity: 1,
        x: 0,
        scrollTrigger: {
          trigger: leftCard,
          start: 'top 80%',
          once: true
        }
      });
    }

    if (rightContent) {
      gsap.to(rightContent, {
        opacity: 1,
        x: 0,
        scrollTrigger: {
          trigger: rightContent,
          start: 'top 80%',
          once: true
        }
      });
    }
  }, []);

  return (
    <section
      id="about"
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
        // <span style={{ color: 'var(--accent-red)' }}>SUBJECT_PROFILE</span> ◈ CASE_FILE: LTZ-03 ◈ STATUS: <span style={{ color: 'var(--accent-red)' }}>ACTIVE</span>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '48px' }}>
        {/* Left - Identity Card */}
        <div
          className="identity-card"
          style={{
            opacity: 0,
            transform: 'translateX(-30px)'
          }}
        >
          {/* Profile Image */}
          <div
            style={{
              position: 'relative',
              marginBottom: '24px',
              width: '200px',
              height: '266px',
              overflow: 'hidden',
              border: '1px solid var(--border-color)',
              margin: '0 auto'
            }}
          >
            <img
              src="/artwork/profile.jpg"
              alt="Profile"
              loading="lazy"
              decoding="async"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'grayscale(40%)'
              }}
            />

            {/* Corner Brackets */}
            <div className="corner-bracket corner-tl" />
            <div className="corner-bracket corner-tr" />
            <div className="corner-bracket corner-bl" />
            <div className="corner-bracket corner-br" />

            {/* REC Label */}
            <div
              style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                fontSize: '10px',
                color: recActive ? 'var(--accent-red)' : 'rgba(204, 0, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                transition: 'color 0.3s ease'
              }}
            >
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: recActive ? 'var(--accent-red)' : 'rgba(204, 0, 0, 0.3)',
                  animation: recActive ? 'pulse-blink 1s infinite' : 'none'
                }}
              />
              REC_ACTIVE
            </div>

            {/* Scan Line */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'rgba(204, 0, 0, 0.5)',
                animation: 'scan-line-horizontal 3s linear infinite'
              }}
            />

            {/* Face ID */}
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                fontSize: '10px',
                color: 'var(--accent-red)',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              FACE_ID: VERIFIED
            </div>
          </div>

          {/* Identity Info */}
          <div style={{ fontSize: '11px', lineHeight: '2', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            <div><span style={{ color: 'var(--accent-red)' }}>CODENAME:</span> <span style={{ color: 'var(--text-primary)' }}>LETREZDRAW</span></div>
            <div><span style={{ color: 'var(--accent-red)' }}>CLASS:</span> <span style={{ color: 'var(--text-primary)' }}>DIGITAL_ILLUSTRATOR</span></div>
            <div><span style={{ color: 'var(--accent-red)' }}>CLEARANCE:</span> <span style={{ color: 'var(--text-primary)' }}>LEVEL_5</span></div>
            <div><span style={{ color: 'var(--accent-red)' }}>LOCATION:</span> <span style={{ color: 'var(--text-primary)' }}>PUNE, INDIA</span></div>
            <div><span style={{ color: 'var(--accent-red)' }}>STATUS:</span> <span style={{ color: 'var(--text-primary)' }}>OPEN_FOR_CONTRACTS</span></div>
            <div><span style={{ color: 'var(--accent-red)' }}>REMOTE:</span> <span style={{ color: 'var(--text-primary)' }}>ENABLED</span></div>
          </div>
        </div>

        {/* Right - Profile Content */}
        <div
          className="right-content"
          style={{
            opacity: 0,
            transform: 'translateX(30px)'
          }}
        >
          {/* Operative Brief */}
          <div style={{ marginBottom: '48px' }}>
            <h4 style={{ fontSize: '11px', color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
              // OPERATIVE_BRIEF
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.8', margin: 0 }}>
              A digital illustrator specializing in character design, concept art, and environment illustration. Passionate about creating immersive worlds and compelling characters. Human-made, no AI. Available for remote commissions and freelance work globally.
            </p>
          </div>

          {/* Skill Inventory */}
          <div style={{ marginBottom: '48px' }}>
            <h4 style={{ fontSize: '11px', color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
              // SKILL_INVENTORY
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {[
                'CHARACTER DESIGN',
                'CONCEPT ART',
                'ENVIRONMENT ART',
                'BACKGROUND ART',
                'PHOTOSHOP',
                'ADOBE SUITE',
                'DIGITAL PAINTING',
                'COMMISSION WORK'
              ].map((skill) => (
                <div
                  key={skill}
                  style={{
                    fontSize: '11px',
                    border: '1px solid var(--accent-red)',
                    color: 'var(--accent-red)',
                    padding: '6px 12px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'var(--accent-red)';
                    e.target.style.color = '#000';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'none';
                    e.target.style.color = 'var(--accent-red)';
                  }}
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>

          {/* Field Operations (Timeline) */}
          <div style={{ marginBottom: '48px' }}>
            <h4 style={{ fontSize: '11px', color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
              // FIELD_OPERATIONS
            </h4>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '2', position: 'relative', paddingLeft: '24px' }}>
              <div style={{ position: 'absolute', left: '8px', top: 0, bottom: 0, width: '2px', background: 'var(--accent-red)' }} />
              <div>
                <div style={{ color: 'var(--accent-red)', marginBottom: '4px' }}>2023 — First digital commission</div>
              </div>
              <div>
                <div style={{ color: 'var(--accent-red)', marginBottom: '4px' }}>2024 — Expanded portfolio</div>
              </div>
              <div>
                <div style={{ color: 'var(--accent-red)', marginBottom: '4px' }}>2025 — Full-time illustrator</div>
              </div>
              <div>
                <div style={{ color: 'var(--accent-red)', marginBottom: '4px' }}>2026 — Present day</div>
              </div>
            </div>
          </div>

          {/* Specialization Report */}
          <div>
            <h4 style={{ fontSize: '11px', color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
              // SPECIALIZATION_REPORT
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '11px' }}>
              {[
                { name: 'CHARACTER DESIGN', value: 90 },
                { name: 'CONCEPT ART', value: 85 },
                { name: 'ENVIRONMENT ART', value: 80 }
              ].map((skill) => (
                <div key={skill.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                    <span>{skill.name}</span>
                    <span>{skill.value}%</span>
                  </div>
                  <div style={{ background: 'rgba(204, 0, 0, 0.1)', height: '6px', borderRadius: '2px', overflow: 'hidden' }}>
                    <div
                      style={{
                        background: 'var(--accent-red)',
                        height: '100%',
                        width: `${skill.value}%`,
                        transition: 'width 1.5s ease'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
