import { useEffect, useRef } from 'react';
import { gsap } from './gsap';
import { DURATION, EASE, STAGGER } from './tokens';

// Scroll-triggered entrance reveal. Returns a ref to attach to the container.
//
// Registered inside gsap.matchMedia('(prefers-reduced-motion: no-preference)')
// so that under reduced-motion nothing is registered and the element is never
// hidden — content is fully visible with no animation.
//
// Options:
//   y         — px offset to rise from (default 24)
//   opacity   — starting opacity (default 0)
//   duration  — seconds (default DURATION.slow)
//   ease      — GSAP ease (default EASE.entrance)
//   start     — ScrollTrigger start (default 'top 85%')
//   children  — selector; when set, staggers matching children instead of the container
//   stagger   — override stagger step (default STAGGER when children is set)
export function useReveal(options = {}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const {
      y = 24,
      opacity = 0,
      duration = DURATION.slow,
      ease = EASE.entrance,
      start = 'top 85%',
      children: childSelector,
      stagger,
    } = options;

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const targets = childSelector ? el.querySelectorAll(childSelector) : el;
      // Explicit fromTo (not from): the visible end state is hard-coded, so a
      // StrictMode double-invoke can never record the hidden state as the target
      // and leave content stuck invisible.
      const tween = gsap.fromTo(
        targets,
        { opacity, y },
        {
          opacity: 1,
          y: 0,
          duration,
          ease,
          stagger: stagger ?? (childSelector ? STAGGER : 0),
          scrollTrigger: { trigger: el, start, once: true },
        }
      );
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
    // Options are read once on mount; callers pass a stable intent per element.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return ref;
}
