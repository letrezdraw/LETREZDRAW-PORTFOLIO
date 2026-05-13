import { useState, useEffect, Suspense } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Gallery } from './components/Gallery';
import { Marquee } from './components/Marquee';
import { About } from './components/About';
import { Commissions } from './components/Commissions';
import { Contact } from './components/Contact';
import { RedString } from './components/RedString';
import { CustomCursor } from './components/CustomCursor';
import './index.css';

// Page visibility detection for performance optimization
const usePageVisibility = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return isVisible;
};

function App() {
  const [scrolled, setScrolled] = useState(false);
  const isPageVisible = usePageVisibility();

  useEffect(() => {
    // Screen flicker effect - disable when page not visible
    if (!isPageVisible) return;
    
    const flickerInterval = setInterval(() => {
      if (Math.random() > 0.92) {
        document.body.style.animation = 'flicker-screen 0.08s ease';
        setTimeout(() => {
          document.body.style.animation = 'none';
        }, 80);
      }
    }, 5000 + Math.random() * 10000);

    return () => clearInterval(flickerInterval);
  }, [isPageVisible]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 48);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ background: 'var(--bg-primary)', position: 'relative', zIndex: 1 }}>
      {/* Custom Cursor and Red String Effects */}
      <CustomCursor />
      <RedString />

      {/* Sidebar */}
      <Sidebar />

      {/* Navbar */}
      <Navbar scrolled={scrolled} />

      {/* Main Content */}
      <main style={{ marginLeft: '0' }}>
        {/* Hero Section */}
        <Hero />

        {/* Marquee 1 */}
        <Marquee
          text="◈ CHARACTER DESIGN ◈ CONCEPT ART ◈ ENVIRONMENT ART ◈ DIGITAL ILLUSTRATION ◈ COMMISSION OPEN ◈"
          direction="left"
          speed="slow"
        />

        {/* Gallery */}
        <Gallery />

        {/* Marquee 2 */}
        <Marquee
          text="// CLASSIFIED // DECLASSIFIED // RESTRICTED // AUTHORIZED // TOP SECRET // ART FILES //"
          direction="right"
          speed="medium"
        />

        {/* About */}
        <About />

        {/* Marquee 3 */}
        <Marquee
          text="◈ HUMAN MADE ◈ NO AI ◈ PUNE INDIA ◈ REMOTE WORLDWIDE ◈ OPEN FOR WORK ◈"
          direction="left"
          speed="slow"
        />

        {/* Commissions */}
        <Commissions />

        {/* Contact */}
        <Contact />
      </main>
    </div>
  );
}

export default App;
