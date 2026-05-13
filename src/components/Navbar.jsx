import { useState, useEffect } from 'react';
import { scrollToSection } from '../utils/scrollToSection';
import { useRenderTheme } from '../context/RenderThemeContext';

export const Navbar = ({ scrolled }) => {
  const [time, setTime] = useState(new Date());
  const [blinkState, setBlinkState] = useState(true);
  const { cycleTheme, displayStyle } = useRenderTheme();

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
    <nav
      className="top-nav"
      style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      minHeight: '56px',
      height: 'auto',
      paddingTop: '12px',
      paddingBottom: '12px',
      background: 'var(--nav-chrome)',
      backdropFilter: 'blur(8px)',
      borderBottom: scrolled ? '1px solid var(--border-active)' : '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      rowGap: '12px',
      paddingLeft: '56px',
      paddingRight: '32px',
      zIndex: 1100,
      transition: 'border-color 0.3s ease'
    }}>
      {/* Left - Archive ID */}
      <div style={{
        fontSize: '13px',
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
        gap: '40px',
        alignItems: 'center',
        justifyContent: 'center',
        flex: '1 1 auto',
        minWidth: 0
      }}>
        {['FILES', 'PROFILE', 'CLEARANCE', 'NETWORK'].map((link) => (
          <button
            key={link}
            className="red-underline"
            style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              cursor: 'pointer'
            }}
            onClick={(e) => {
              e.preventDefault();
              const sectionMap = {
                FILES: 'gallery',
                PROFILE: 'about',
                CLEARANCE: 'clearance',
                NETWORK: 'network'
              };
              scrollToSection(sectionMap[link]);
            }}
          >
            {link}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="navbar-theme-btn"
        onClick={cycleTheme}
        title="Cycle render theme"
      >
        RENDER STYLE {displayStyle}
      </button>

      {/* Right - Signal and Time */}
      <div style={{
        display: 'flex',
        gap: '32px',
        alignItems: 'center',
        fontSize: '13px',
        color: 'var(--text-secondary)',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: blinkState ? '#00ff00' : 'rgba(0,255,0,0.35)',
            boxShadow: blinkState ? '0 0 6px #00ff00' : 'none',
          }} />
          SIGNAL_STRONG
        </div>
        <div>{formatTime(time)}</div>
      </div>
    </nav>
  );
};
