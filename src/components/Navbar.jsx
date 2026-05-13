import { useState, useEffect } from 'react';

export const Navbar = ({ scrolled }) => {
  const [time, setTime] = useState(new Date());
  const [blinkState, setBlinkState] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlinkState((prev) => !prev);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '48px',
      background: 'rgba(10, 10, 10, 0.95)',
      backdropFilter: 'blur(8px)',
      borderBottom: scrolled ? '1px solid var(--border-active)' : '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: '48px',
      paddingRight: '24px',
      zIndex: 950,
      transition: 'border-color 0.3s ease'
    }}>
      {/* Left - Archive ID */}
      <div style={{
        fontSize: '11px',
        color: 'var(--text-primary)',
        fontWeight: 'bold',
        letterSpacing: '1px',
        textTransform: 'uppercase'
      }}>
        [<span style={{ color: 'var(--accent-red)' }}>ARCHIVE_LTZ</span>]
      </div>

      {/* Center - Nav Links */}
      <div style={{
        display: 'flex',
        gap: '32px',
        alignItems: 'center'
      }}>
        {['FILES', 'PROFILE', 'CLEARANCE', 'TRANSMISSION'].map((link) => (
          <button
            key={link}
            className="red-underline"
            style={{
              fontSize: '11px',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              cursor: 'pointer'
            }}
            onClick={(e) => {
              e.preventDefault();
              const sectionMap = {
                'FILES': 'gallery',
                'PROFILE': 'about',
                'CLEARANCE': 'commissions',
                'TRANSMISSION': 'contact'
              };
              const el = document.getElementById(sectionMap[link]);
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {link}
          </button>
        ))}
      </div>

      {/* Right - Signal and Time */}
      <div style={{
        display: 'flex',
        gap: '24px',
        alignItems: 'center',
        fontSize: '11px',
        color: 'var(--text-secondary)',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#00ff00',
            boxShadow: '0 0 6px #00ff00'
          }} />
          SIGNAL_STRONG
        </div>
        <div>{formatTime(time)}</div>
      </div>
    </nav>
  );
};
