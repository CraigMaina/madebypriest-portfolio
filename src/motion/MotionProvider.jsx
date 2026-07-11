import { useEffect } from 'react';
import Lenis from 'lenis';
import { initGsap, ScrollTrigger } from './gsap';
import { prefersReducedMotion } from './reducedMotion';
import { _bindLenis } from './scrollLock';

// App-root motion bootstrap. Registers ScrollTrigger once, runs Lenis smooth
// scroll (unless reduced-motion), keeps ScrollTrigger in sync with Lenis via the
// GSAP ticker, and upgrades in-page anchor links to a smooth Lenis scroll.
//
// Under prefers-reduced-motion this mounts nothing: native scroll stays, no
// Lenis, and every reveal/parallax hook leaves content fully visible.
export default function MotionProvider({ children }) {
  useEffect(() => {
    initGsap();

    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      lerp: 0.12, // tighter than the old duration:1.1 easing — less floaty/laggy
      smoothWheel: true,
      wheelMultiplier: 1,
      autoRaf: false, // we drive the RAF ourselves (below)
    });
    _bindLenis(lenis);

    // Keep ScrollTrigger in sync with Lenis' scroll, and run Lenis on its own
    // RAF. We deliberately do NOT couple gsap.ticker to Lenis: doing so lets the
    // gsap ticker fall asleep at idle and stops advancing scroll-independent
    // tweens (e.g. the Work filter transition). Left alone, gsap.ticker manages
    // its own wake/sleep and always ticks active tweens.
    lenis.on('scroll', ScrollTrigger.update);
    let rafId = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    });

    // Smooth same-page anchor navigation ("#work", "/#contact" on home, ...).
    const onAnchorClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const link = e.target.closest?.('a[href*="#"]');
      if (!link) return;
      const href = link.getAttribute('href') || '';
      const hashIndex = href.indexOf('#');
      if (hashIndex < 0) return;
      const id = href.slice(hashIndex);
      if (id.length < 2) return;
      // Only handle anchors targeting the current page.
      const path = href.slice(0, hashIndex);
      if (path && path !== '/' && path !== window.location.pathname) return;
      const target = document.querySelector(id);
      if (!target) return; // let the router / browser handle cross-page hashes
      e.preventDefault();
      // Clear the fixed nav by its actual current height (condensed vs expanded,
      // and different across breakpoints) rather than a hard-coded guess.
      const nav = document.querySelector('.card-nav');
      const offset = nav ? nav.getBoundingClientRect().bottom + 16 : 80;
      lenis.scrollTo(target, { offset: -offset });
    };
    document.addEventListener('click', onAnchorClick);

    return () => {
      document.removeEventListener('click', onAnchorClick);
      cancelAnimationFrame(rafId);
      _bindLenis(null);
      lenis.destroy();
    };
  }, []);

  return children;
}
