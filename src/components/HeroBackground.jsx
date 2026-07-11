import { Suspense, lazy, useEffect, useState } from 'react';

// The Three.js hero is the heaviest module in the app. Lazy-import it so it is
// code-split into its own chunk and only fetched when we actually decide to run
// the shader (capable desktop, motion allowed).
const Dither = lazy(() => import('./Dither'));

// Cinematic static fallback that echoes the shader's dark, dithered look — used
// on mobile/touch, small viewports, and when prefers-reduced-motion is set.
// The Three.js chunk is never downloaded in this path.
//
// Not actually flat: a base radial, a slowly drifting amber/cool aurora
// (GPU transform), and a film-grain overlay give the mobile hero real depth.
// The drift is disabled under prefers-reduced-motion (see index.css).
const StaticHero = () => (
  <div className="relative w-full h-full overflow-hidden bg-ink-900">
    {/* Brighter base so the hero clearly reads as a lit backdrop, not black. */}
    <div className="absolute inset-0 bg-[radial-gradient(135%_120%_at_50%_-10%,theme(colors.ink.500)_0%,theme(colors.ink.700)_38%,theme(colors.ink.900)_70%)]" />
    <div
      className="hero-aurora absolute -inset-1/4"
      style={{
        background:
          'radial-gradient(42% 42% at 26% 28%, rgba(230,180,80,0.30), transparent 68%), radial-gradient(46% 46% at 74% 66%, rgba(150,160,190,0.20), transparent 70%)',
      }}
    />
    {/* Dithered noise overlay — echoes the desktop shader's texture. */}
    <div className="hero-grain absolute inset-0" aria-hidden="true" />
  </div>
);

export default function HeroBackground(props) {
  const [enableShader, setEnableShader] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    // Only spin up WebGL on a capable, motion-tolerant, pointer-driven device —
    // and re-evaluate when any of those conditions change (e.g. a tablet
    // rotating across the md breakpoint) instead of only reading once at mount.
    const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqCoarse = window.matchMedia('(pointer: coarse)');
    const mqWide = window.matchMedia('(min-width: 768px)');

    const evaluate = () => setEnableShader(!mqReduce.matches && !mqCoarse.matches && mqWide.matches);
    evaluate();

    mqReduce.addEventListener?.('change', evaluate);
    mqCoarse.addEventListener?.('change', evaluate);
    mqWide.addEventListener?.('change', evaluate);
    return () => {
      mqReduce.removeEventListener?.('change', evaluate);
      mqCoarse.removeEventListener?.('change', evaluate);
      mqWide.removeEventListener?.('change', evaluate);
    };
  }, []);

  if (!enableShader) return <StaticHero />;

  return (
    <Suspense fallback={<StaticHero />}>
      <Dither {...props} />
    </Suspense>
  );
}
