import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Contact = () => {
  const containerRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'CHARACTER_DESIGN',
    message: ''
  });

  useEffect(() => {
    const sectionStamp = containerRef.current?.querySelector('.section-stamp');
    const leftTerminal = containerRef.current?.querySelector('.terminal-prompt');
    const form = containerRef.current?.querySelector('.contact-form');

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

    if (leftTerminal) {
      gsap.to(leftTerminal, {
        opacity: 1,
        x: 0,
        scrollTrigger: {
          trigger: leftTerminal,
          start: 'top 80%',
          once: true
        }
      });
    }

    if (form) {
      gsap.to(form, {
        opacity: 1,
        x: 0,
        scrollTrigger: {
          trigger: form,
          start: 'top 80%',
          once: true
        }
      });
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Transmission sent. Awaiting response...');
    setFormData({
      name: '',
      email: '',
      projectType: 'CHARACTER_DESIGN',
      message: ''
    });
  };

  return (
    <section
      id="contact"
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
        // <span style={{ color: 'var(--accent-red)' }}>OPEN_CHANNEL</span> ◈ INITIATE_TRANSMISSION ◈ <span style={{ color: 'var(--accent-red)' }}>ENCRYPTED</span>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '48px', maxWidth: '1000px', margin: '0 auto' }}>
        {/* Left - Terminal */}
        <div
          className="terminal-prompt"
          style={{
            fontSize: '11px',
            color: 'var(--text-secondary)',
            fontFamily: "'Share Tech Mono', monospace",
            lineHeight: '1.8',
            opacity: 0,
            transform: 'translateX(-30px)'
          }}
        >
          <div style={{ color: 'var(--accent-red)' }}>&gt; ESTABLISHING SECURE CONNECTION...</div>
          <div>&gt; ENCRYPTION: AES-256</div>
          <div>&gt; CHANNEL: OPEN</div>
          <div>&gt; TARGET: LETREZDRAW</div>
          <div>&gt; AWAITING INPUT...</div>
        </div>

        {/* Right - Form */}
        <form
          className="contact-form"
          onSubmit={handleSubmit}
          style={{
            opacity: 0,
            transform: 'translateX(30px)'
          }}
        >
          {/* Name */}
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="// ENTER_YOUR_NAME"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '11px',
                fontFamily: "'Share Tech Mono', monospace",
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent-red)';
                e.target.style.boxShadow = 'inset 0 0 8px rgba(204, 0, 0, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-color)';
                e.target.style.boxShadow = 'none';
              }}
              required
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: '20px' }}>
            <input
              type="email"
              placeholder="// ENTER_EMAIL_ADDRESS"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '11px',
                fontFamily: "'Share Tech Mono', monospace",
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent-red)';
                e.target.style.boxShadow = 'inset 0 0 8px rgba(204, 0, 0, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-color)';
                e.target.style.boxShadow = 'none';
              }}
              required
            />
          </div>

          {/* Project Type */}
          <div style={{ marginBottom: '20px' }}>
            <select
              value={formData.projectType}
              onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '11px',
                fontFamily: "'Share Tech Mono', monospace",
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent-red)';
                e.target.style.boxShadow = 'inset 0 0 8px rgba(204, 0, 0, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-color)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="CHARACTER_DESIGN">// CHARACTER DESIGN</option>
              <option value="CONCEPT_ART">// CONCEPT ART</option>
              <option value="ENVIRONMENT_ART">// ENVIRONMENT ART</option>
              <option value="CUSTOM">// CUSTOM PROJECT</option>
            </select>
          </div>

          {/* Message */}
          <div style={{ marginBottom: '20px' }}>
            <textarea
              placeholder="// DESCRIBE YOUR PROJECT"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '11px',
                fontFamily: "'Share Tech Mono', monospace",
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                minHeight: '120px',
                resize: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent-red)';
                e.target.style.boxShadow = 'inset 0 0 8px rgba(204, 0, 0, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-color)';
                e.target.style.boxShadow = 'none';
              }}
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="button-red"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.boxShadow = '0 0 16px rgba(255, 17, 17, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.boxShadow = 'none';
            }}
          >
            [TRANSMIT →]
          </button>
        </form>
      </div>

      {/* Social Links */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          marginTop: '64px',
          fontSize: '11px'
        }}
      >
        {['INSTAGRAM', 'ARTSTATION', 'DEVIANTART'].map((social) => (
          <button
            key={social}
            className="button-terminal"
            style={{
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
            onClick={() => console.log(`Opening ${social}`)}
          >
            [{social}]
          </button>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: '64px',
          paddingTop: '32px',
          borderTop: '1px solid var(--border-color)',
          fontSize: '10px',
          color: 'var(--text-secondary)',
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          lineHeight: '2'
        }}
      >
        <div>SECURE_LINE_ESTABLISHED · © 2026 LETREZDRAW · PUNE, INDIA</div>
        <div>ALL_ARTWORKS_HUMAN_MADE · NO_AI · CLEARANCE_LEVEL: PUBLIC</div>
      </div>
    </section>
  );
};
