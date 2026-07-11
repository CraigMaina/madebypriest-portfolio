import { useEffect, useRef } from 'react';
import { gsap } from '../motion';

// A lagging ring that trails the native cursor and swells over interactive
// elements. Additive (the native cursor stays visible) and pointer-fine only, so
// it never interferes on touch or under reduced-motion.
export default function CustomCursor() {
  const ringRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const ring = ringRef.current;
    if (!ring) return;

    gsap.set(ring, { xPercent: -50, yPercent: -50, opacity: 0, scale: 1 });
    const xTo = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' });
    const yTo = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' });

    let shown = false;
    const onMove = (e) => {
      if (!shown) {
        shown = true;
        gsap.to(ring, { opacity: 1, duration: 0.3 });
      }
      xTo(e.clientX);
      yTo(e.clientY);
    };
    const onOver = (e) => {
      const interactive = e.target.closest?.('a, button, [role="tab"], input, textarea, [data-cursor]');
      gsap.to(ring, {
        scale: interactive ? 1.8 : 1,
        borderColor: interactive ? 'rgba(230, 180, 80, 0.9)' : 'rgba(245, 245, 247, 0.5)',
        duration: 0.25,
      });
    };
    const onOut = () => {
      shown = false;
      gsap.to(ring, { opacity: 0, duration: 0.3 });
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerover', onOver);
    document.addEventListener('mouseleave', onOut);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      document.removeEventListener('mouseleave', onOut);
    };
  }, []);

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[10000] hidden h-8 w-8 rounded-full border border-fog-100/50 opacity-0 will-change-transform md:block"
    />
  );
}
