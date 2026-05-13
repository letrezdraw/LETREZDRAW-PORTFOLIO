import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Smooth-scroll to a section id, account for fixed header, then refresh ScrollTrigger
 * so GSAP reveal animations run after programmatic scroll (no extra nudge needed).
 */
export function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;

  el.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const refresh = () => {
    ScrollTrigger.refresh();
  };

  if (typeof window !== 'undefined' && 'onscrollend' in window) {
    window.addEventListener('scrollend', refresh, { once: true });
  }

  window.setTimeout(refresh, 450);
  window.setTimeout(refresh, 900);
}
