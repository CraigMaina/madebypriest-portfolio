import { useLayoutEffect, useRef } from 'react';
import { gsap, DURATION, EASE } from '../motion';

// Full-screen cover that lifts like a curtain to reveal the hero.
//
// Motion (no-preference): logo settles out, then the opaque panel slides up,
// uncovering the staged hero beneath it.
// Reduced-motion / JS-fails: the CSS opacity transition below fades the panel
// out instead — and HomePage unmounts this after a fixed timer regardless, so
// the site is always revealed even if GSAP never runs.
const Preloader = ({ isLoading }) => {
  const rootRef = useRef(null);
  const logoRef = useRef(null);

  useLayoutEffect(() => {
    if (isLoading) return; // only choreograph the exit
    const el = rootRef.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Stay opaque (override the CSS fade) so this reads as a curtain, not a
      // crossfade — content is revealed by the panel travelling up.
      gsap.set(el, { opacity: 1 });
      const tl = gsap.timeline();
      tl.to(logoRef.current, {
        autoAlpha: 0,
        y: -10,
        duration: DURATION.base,
        ease: EASE.entrance,
      }).to(
        el,
        { yPercent: -100, duration: DURATION.slow, ease: EASE.entrance },
        '-=0.05'
      );
      return () => tl.kill();
    });
    return () => mm.revert();
  }, [isLoading]);

  return (
    <div
      ref={rootRef}
      className={`
        fixed inset-0 bg-ink-900 z-[9999]
        flex justify-center items-center
        transition-opacity duration-700 ease-out
        ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
    >
      <img
        ref={logoRef}
        src="/logo.png"
        alt="Made by Priest logo"
        className="w-40 h-40 md:w-56 md:h-56 animate-pulse object-contain"
      />
    </div>
  );
};

export default Preloader;
