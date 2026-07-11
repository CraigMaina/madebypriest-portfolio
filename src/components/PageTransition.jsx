import { useLayoutEffect, useRef } from 'react';
import { gsap, prefersReducedMotion, DURATION, EASE } from '../motion';

// Wraps a routed page and eases it in on mount (fade + slight rise). Because it
// mounts fresh on each navigation, the enter plays on every route change.
// Reduced-motion renders the page immediately with no transform.
export default function PageTransition({ children }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const tween = gsap.fromTo(
      ref.current,
      { opacity: 0, y: 16 },
      {
        opacity: 1,
        y: 0,
        duration: DURATION.slow,
        ease: EASE.entrance,
        // Drop the inline transform once done so it doesn't create a containing
        // block for the sticky BlogHeader inside.
        clearProps: 'transform',
      }
    );
    return () => tween.kill();
  }, []);
  return <div ref={ref}>{children}</div>;
}
