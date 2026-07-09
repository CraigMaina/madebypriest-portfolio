import { Suspense, lazy, useEffect, useState } from 'react';

// The Three.js hero is the heaviest module in the app. Lazy-import it so it is
// code-split into its own chunk and only fetched when we actually decide to run
// the shader (capable desktop, motion allowed).
const Dither = lazy(() => import('./Dither'));

// Cinematic static fallback that echoes the shader's dark, dithered look — used
// on mobile/touch, small viewports, and when prefers-reduced-motion is set.
// The Three.js chunk is never downloaded in this path.
const StaticHero = () => (
  <div className="w-full h-full bg-ink-900 bg-[radial-gradient(120%_120%_at_50%_0%,theme(colors.ink.600)_0%,theme(colors.ink.900)_55%)]" />
);

export default function HeroBackground(props) {
  const [enableShader, setEnableShader] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const isSmall = window.innerWidth < 768;

    // Only spin up WebGL on a capable, motion-tolerant, pointer-driven device.
    if (!prefersReducedMotion && !isTouch && !isSmall) {
      setEnableShader(true);
    }
  }, []);

  if (!enableShader) return <StaticHero />;

  return (
    <Suspense fallback={<StaticHero />}>
      <Dither {...props} />
    </Suspense>
  );
}
