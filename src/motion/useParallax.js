import { useEffect, useRef } from 'react';
import { gsap } from './gsap';

// Scroll-scrubbed parallax. Returns a ref to attach to the moving element.
//
// Registered inside gsap.matchMedia('(prefers-reduced-motion: no-preference)')
// so under reduced-motion the element stays put with no transform.
//
// Options:
//   amount — yPercent to travel across the scroll range (default -12)
//   start  — ScrollTrigger start (default 'top bottom')
//   end    — ScrollTrigger end (default 'bottom top')
export function useParallax(options = {}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const { amount = -12, start = 'top bottom', end = 'bottom top' } = options;

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tween = gsap.to(el, {
        yPercent: amount,
        ease: 'none',
        scrollTrigger: { trigger: el, start, end, scrub: true },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return ref;
}
