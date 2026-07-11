import { useState, useEffect, useLayoutEffect, useRef } from 'react';

import { gsap, DURATION, EASE, useParallax, useMagnetic } from '../motion';
import CardNav from '../components/CardNav';
import { useBooking } from '../components/BookingProvider';
import HeroBackground from '../components/HeroBackground';
import CurvedLoop from '../components/CurvedLoop';
import WorkSection from '../components/WorkSection';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import Testimonials from '../components/Testimonials';
import JournalPreview from '../components/JournalPreview';
import ContactForm from '../components/ContactForm';
import Preloader from '../components/Preloader';
import SEO from '../components/SEO';

// Card background/text colors mirror the design-system tokens (ink-700/600/500,
// fog-100). They live here because CardNav applies them as inline styles.
const navItems = [
  {
    label: 'Work',
    bgColor: '#1A1A1D', // ink-700
    textColor: '#F5F5F7', // fog-100
    links: [
      { label: 'Selected Work', href: '#work', ariaLabel: 'See selected work' },
      { label: 'The Craft', href: '#craft', ariaLabel: 'See The Craft' },
    ],
  },
  {
    label: 'Studio',
    bgColor: '#26262B', // ink-600
    textColor: '#F5F5F7', // fog-100
    links: [
      { label: 'Testimonials', href: '#trusted', ariaLabel: 'See Testimonials' },
      { label: 'Journal', href: '/blog', ariaLabel: 'Read the journal' },
    ],
  },
  {
    label: 'Contact',
    bgColor: '#33333A', // ink-500
    textColor: '#F5F5F7', // fog-100
    links: [
      { label: 'Inquire now', href: 'mailto:hello@madebypriest.com', ariaLabel: 'Email me' },
      { label: 'Start Project', href: '#contact', ariaLabel: 'Start a project' },
    ],
  },
];

function HomePage() {
  const { hasBooking, openBooking } = useBooking();
  const [referralProject, setReferralProject] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSiteVisible, setIsSiteVisible] = useState(false);
  const heroRef = useRef(null);
  // Hero background drifts slower than the page as you scroll away (overscanned
  // + clipped so the shader never exposes an edge). No-op under reduced-motion.
  const heroBgRef = useParallax({ amount: 8, start: 'top top', end: 'bottom top' });
  const ctaMagnetRef = useMagnetic({ strength: 0.4 });

  useEffect(() => {
    let unmountTimer;
    let settled = false;

    // Asset-driven: reveal once fonts are ready (the hero visual loads async on
    // its own). A short minimum avoids a splash flash; a hard cap guarantees we
    // never hang on a stalled asset.
    const reveal = () => {
      if (settled) return;
      settled = true;
      setIsLoading(false);
      // Keep the preloader mounted through the curtain lift (~0.85s) before
      // dropping it from the DOM.
      unmountTimer = setTimeout(() => setIsSiteVisible(true), 1000);
    };

    const minSplash = 400;
    const started = performance.now();
    const revealAfterMin = () => {
      const elapsed = performance.now() - started;
      setTimeout(reveal, Math.max(0, minSplash - elapsed));
    };

    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    Promise.race([
      fontsReady,
      new Promise((res) => setTimeout(res, 3000)), // safety cap
    ]).then(revealAfterMin);

    return () => clearTimeout(unmountTimer);
  }, []);

  // Hero entrance: headline -> subhead -> CTA stagger up as the curtain lifts.
  // Registered under no-preference only, so reduced-motion leaves the hero fully
  // visible with nothing to reveal.
  useLayoutEffect(() => {
    if (isLoading) return; // stage the reveal the moment the curtain begins lifting
    const el = heroRef.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Explicit fromTo so the visible end state can't be lost to a StrictMode
      // double-invoke (would otherwise strand the CTA at opacity 0).
      const tween = gsap.fromTo(
        el.querySelectorAll('[data-entrance]'),
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: DURATION.slow,
          ease: EASE.entrance,
          stagger: 0.12,
          delay: 0.2,
        }
      );
      return () => tween.kill();
    });
    return () => mm.revert();
  }, [isLoading]);

  return (
    <>
      <SEO />
      {!isSiteVisible && <Preloader isLoading={isLoading} />}

      {/* No opacity gate here — the Preloader curtain owns the reveal so the
          hero can be staged beneath it and staggered in as it lifts. */}
      <div className="bg-ink-900 text-fog-100 min-h-screen">
        <CardNav items={navItems} ready={!isLoading} />

        {/* Hero */}
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
          <div ref={heroBgRef} className="absolute -top-[12%] -bottom-[12%] inset-x-0 z-0">
            <HeroBackground
              waveColor={[1.0, 1.0, 1.0]}
              disableAnimation={false}
              enableMouseInteraction={true}
              mouseRadius={0.3}
              colorNum={30}
              waveAmplitude={0.3}
              waveFrequency={2.4}
              waveSpeed={0.05}
            />
          </div>
          <div ref={heroRef} className="relative z-10 text-center px-5 md:px-8 max-w-5xl mx-auto">
            <h1 data-entrance className="text-4xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tighter font-heading leading-tight">
              Videos That Feel Like{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fog-100 to-fog-500">
                Blockbusters.
              </span>
            </h1>

            <p data-entrance className="text-lg md:text-2xl text-fog-300 mt-6 font-light">
              Cinematic editing that turns brands into icons and viewers into fans.
            </p>

            <span ref={ctaMagnetRef} data-entrance className="inline-block mt-8">
              {hasBooking ? (
                <button
                  type="button"
                  onClick={openBooking}
                  className="inline-block px-8 py-4 bg-accent text-ink-900 font-bold rounded-full hover:bg-accent-hover hover:scale-105 active:scale-95 transition duration-300 ease-out tracking-wide"
                >
                  Start a Project
                </button>
              ) : (
                <a
                  href="#contact"
                  className="inline-block px-8 py-4 bg-accent text-ink-900 font-bold rounded-full hover:bg-accent-hover hover:scale-105 active:scale-95 transition duration-300 ease-out tracking-wide"
                >
                  Start a Project
                </a>
              )}
            </span>
          </div>
        </div>

        {/* Curved dual-row marquee (scroll-velocity reactive) */}
        <CurvedLoop
          marqueeText="Helping ✦ Brands ✦ Tell ✦ Stories ✦ That ✦ Sell ✦"
          secondaryText="Cinematic ✦ Edits ✦ That ✦ Turn ✦ Attention ✦ Into ✦ Fans ✦"
          speed={3}
          curveAmount={16}
          direction="left"
          interactive={true}
        />

        <WorkSection setReferralProject={setReferralProject} />
        <BeforeAfterSlider />
        <Testimonials />
        <JournalPreview />
        <ContactForm referralProject={referralProject} />
      </div>
    </>
  );
}

export default HomePage;
