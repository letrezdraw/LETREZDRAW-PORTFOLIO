import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const tiers = [
  {
    name: 'TIER_01',
    title: 'BASIC FILE',
    price: '$50',
    features: ['Single Character', 'B&W', '1 Revision', '7d turnaround']
  },
  {
    name: 'TIER_02',
    title: 'STANDARD DOSSIER',
    price: '$150',
    features: ['Character or scene', 'Full color', '2 revisions', '14d', 'Print res']
  },
  {
    name: 'TIER_03',
    title: 'PREMIUM ARCHIVE',
    price: '$300+',
    features: ['Custom concept', 'Large format', 'Priority', 'Commercial rights']
  }
];

export const ClearanceHub = () => {
  const rootRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'CHARACTER_DESIGN',
    message: ''
  });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const ctx = gsap.context(() => {
      root.querySelectorAll('.hub-reveal').forEach((el, i) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true
          },
          delay: i * 0.04
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Transmission queued (connect to Formspree / backend when ready).');
    setFormData({
      name: '',
      email: '',
      projectType: 'CHARACTER_DESIGN',
      message: ''
    });
  };

  return (
    <section
      id="clearance"
      ref={rootRef}
      className="clearance-hub"
      style={{
        position: 'relative',
        zIndex: 100,
        padding: '72px 48px 96px',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 52%, var(--bg-primary) 100%)',
        borderTop: '1px solid var(--border-color)'
      }}
    >
      <div className="hub-inner">
      <div
        className="section-stamp hub-reveal"
        style={{
          fontSize: '12px',
          color: 'var(--text-primary)',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          marginBottom: '40px',
          opacity: 0,
          transform: 'translateY(16px)'
        }}
      >
        // <span style={{ color: 'var(--accent-red)' }}>CLEARANCE</span> ·{' '}
        <span style={{ color: 'var(--text-secondary)' }}>TRANSMISSION</span> ◈ SINGLE_SECURE_NODE ◈{' '}
        <span style={{ color: 'var(--accent-red)' }}>OPEN</span>
      </div>

      <div
        className="hub-reveal hub-dual-banner"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2px',
          marginBottom: '40px',
          maxWidth: '1100px',
          marginLeft: 'auto',
          marginRight: 'auto',
          opacity: 0,
          transform: 'translateY(16px)'
        }}
      >
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--accent-red)',
              boxShadow: '0 0 12px var(--accent-red)',
              animation: 'pulse-blink 1.2s infinite'
            }}
          />
          <div>
            <div style={{ fontSize: '10px', color: 'var(--accent-red)', letterSpacing: '2px' }}>CLEARANCE_DESK</div>
            <div style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '4px' }}>Commissions · remote worldwide</div>
          </div>
        </div>
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            padding: '20px 24px'
          }}
        >
          <div style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '2px' }}>TRANSMISSION_LINE</div>
          <div style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '4px' }}>Encrypted inquiry · response within 48h</div>
        </div>
      </div>

      <div className="hub-split">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="hub-reveal hub-tier-wrap"
              style={{
                opacity: 0,
                transform: 'translateY(20px)'
              }}
            >
              <div className="hub-tier-card">
              <div className="corner-bracket corner-tl" style={{ top: 6, left: 6 }} />
              <div className="corner-bracket corner-br" style={{ bottom: 6, right: 6 }} />
              <div style={{ fontSize: '10px', color: 'var(--accent-red)', letterSpacing: '2px', marginBottom: '6px' }}>{tier.name}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px' }}>
                <h3 style={{ fontSize: '17px', fontFamily: "'Cinzel', serif", color: 'var(--text-primary)', margin: 0 }}>{tier.title}</h3>
                <span style={{ fontSize: '22px', fontWeight: 700, color: 'var(--accent-red)', fontFamily: "'Cinzel', serif" }}>{tier.price}</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '14px 0 0', fontSize: '10px', color: 'var(--text-secondary)', lineHeight: '1.85' }}>
                {tier.features.map((f) => (
                  <li key={f}>
                    <span style={{ color: 'var(--accent-red)' }}>▸</span> {f}
                  </li>
                ))}
              </ul>
              </div>
            </div>
          ))}
        </div>

        <div
          className="hub-reveal hub-transmit-wrap"
          style={{
            opacity: 0,
            transform: 'translateY(20px)'
          }}
        >
          <div className="hub-transmit-panel">
          <div style={{ fontSize: '10px', color: 'var(--accent-red)', letterSpacing: '3px', marginBottom: '16px' }}>// SECURE_UPLINK</div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.9', marginBottom: '22px', fontFamily: "'Share Tech Mono', monospace" }}>
            <div style={{ color: 'var(--accent-red)' }}>&gt; AES-256 CHANNEL</div>
            <div>&gt; ROUTE: LETREZDRAW_INBOX</div>
            <div>&gt; AWAITING_PAYLOAD…</div>
          </div>

          <form onSubmit={handleSubmit} className="hub-form">
            <input
              type="text"
              placeholder="// NAME"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="hub-input"
            />
            <input
              type="email"
              placeholder="// EMAIL"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="hub-input"
            />
            <select
              value={formData.projectType}
              onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
              className="hub-input"
            >
              <option value="CHARACTER_DESIGN">CHARACTER_DESIGN</option>
              <option value="CONCEPT_ART">CONCEPT_ART</option>
              <option value="ENVIRONMENT_ART">ENVIRONMENT_ART</option>
              <option value="CUSTOM">CUSTOM</option>
            </select>
            <textarea
              placeholder="// PROJECT BRIEF"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              rows={5}
              className="hub-input hub-textarea"
            />
            <button type="submit" className="button-red" style={{ width: '100%', padding: '14px', fontSize: '11px', letterSpacing: '2px' }}>
              [ TRANSMIT CLEARANCE REQUEST ]
            </button>
          </form>
          </div>
        </div>
      </div>

      <div
        className="hub-reveal"
        style={{
          marginTop: '48px',
          paddingTop: '28px',
          borderTop: '1px solid var(--border-color)',
          fontSize: '10px',
          color: 'var(--text-muted)',
          textAlign: 'center',
          letterSpacing: '1px',
          opacity: 0,
          transform: 'translateY(12px)'
        }}
      >
        © 2026 LETREZDRAW · HUMAN_MADE · NO_AI
      </div>
      </div>
    </section>
  );
};
