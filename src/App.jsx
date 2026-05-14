import { useState, useEffect } from 'react';
import { initPointerStore } from './pointerStore';
import { useIsMobile } from './hooks/useIsMobile';
// Desktop components
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Gallery } from './components/Gallery';
import { Marquee } from './components/Marquee';
import { About } from './components/About';
import { ClearanceHub } from './components/ClearanceHub';
import { Network } from './components/Network';
// Mobile components
import { NavbarMobile } from './components/NavbarMobile';
import { HeroMobile } from './components/HeroMobile';
import { MarqueeMobile } from './components/MarqueeMobile';
import { GalleryMobile } from './components/GalleryMobile';
import { AboutMobile } from './components/AboutMobile';
import { ClearanceHubMobile } from './components/ClearanceHubMobile';
import { NetworkMobile } from './components/NetworkMobile';
import { FooterMobile } from './components/FooterMobile';
// Shared components
import { RedString } from './components/RedString';
import { CustomCursor } from './components/CustomCursor';
// Data
import { artworks as allArtworks } from './data/artworks';
import { hydrateArtwork } from './utils/artworkUrls';
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
  const isMobile = useIsMobile();

  useEffect(() => {
    return initPointerStore();
  }, []);

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

  // Mobile View
  if (isMobile) {
    const hydratedArtworks = allArtworks.map(hydrateArtwork);
    return (
      <div className="app-root app-root-mobile">
        <CustomCursor />
        <NavbarMobile />
        <main className="app-main-mobile" style={{ marginTop: '48px' }}>
          <HeroMobile />
          <MarqueeMobile
            text="◈ CHARACTER DESIGN ◈ CONCEPT ART ◈ COMMISSIONS OPEN ◈"
            direction="left"
            speed="slow"
          />
          <GalleryMobile artworks={hydratedArtworks} />
          <AboutMobile />
          <ClearanceHubMobile />
          <NetworkMobile />
          <FooterMobile />
        </main>
      </div>
    );
  }

  // Desktop View
  return (
    <div className="app-root">
      {/* Custom Cursor and Red String Effects */}
      <CustomCursor />
      <RedString />

      {/* Sidebar */}
      <Sidebar />

      {/* Navbar */}
      <Navbar scrolled={scrolled} />

      {/* Main Content */}
      <main className="app-main">
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

        {/* Clearance + transmission (commissions & contact) */}
        <ClearanceHub />

        {/* Social network */}
        <Network />
      </main>
    </div>
  );
}

export default App;
