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
    {/* Lit base so the hero clearly reads as a backdrop, not black. */}
    <div className="absolute inset-0 bg-[radial-gradient(140%_120%_at_50%_-15%,theme(colors.ink.500)_0%,theme(colors.ink.700)_35%,theme(colors.ink.900)_72%)]" />

    {/* Independently drifting colour mesh (transform-only, GPU-composited). */}
    <div
      className="hero-mesh hero-mesh-1 absolute -left-[15%] -top-[20%] h-[80%] w-[80%]"
      style={{ background: 'radial-gradient(circle at center, rgba(230,180,80,0.42) 0%, transparent 60%)' }}
    />
    <div
      className="hero-mesh hero-mesh-2 absolute -right-[15%] -bottom-[20%] h-[85%] w-[85%]"
      style={{ background: 'radial-gradient(circle at center, rgba(110,140,225,0.32) 0%, transparent 62%)' }}
    />
    <div
      className="hero-mesh hero-mesh-3 absolute right-[5%] top-[8%] h-[60%] w-[60%]"
      style={{ background: 'radial-gradient(circle at center, rgba(205,90,135,0.26) 0%, transparent 60%)' }}
    />

    {/* Dither dot grid + film grain — the signature textured/dithered look. */}
    <div className="hero-dither absolute inset-0" aria-hidden="true" />
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
