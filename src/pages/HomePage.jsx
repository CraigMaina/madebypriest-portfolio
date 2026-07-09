import { useState, useEffect } from 'react';

import CardNav from '../components/CardNav';
import { useBooking } from '../components/BookingProvider';
import HeroBackground from '../components/HeroBackground';
import CurvedLoop from '../components/CurvedLoop';
import WorkSection from '../components/WorkSection';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import Testimonials from '../components/Testimonials';
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
      unmountTimer = setTimeout(() => setIsSiteVisible(true), 800);
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

  return (
    <>
      <SEO />
      {!isSiteVisible && <Preloader isLoading={isLoading} />}

      <div
        className={`
          bg-ink-900 text-fog-100 min-h-screen
          transition-opacity duration-1000 ease-in-out
          ${isLoading ? 'opacity-0' : 'opacity-100'}
        `}
      >
        <CardNav items={navItems} />

        {/* Hero */}
        <div className="relative min-h-screen flex flex-col items-center justify-center">
          <div className="absolute inset-0 z-0">
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
          <div className="relative z-10 text-center px-5 md:px-8 max-w-5xl mx-auto">
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tighter font-heading leading-tight">
              Videos That Feel Like{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fog-100 to-fog-500">
                Blockbusters.
              </span>
            </h1>

            <p className="text-lg md:text-2xl text-fog-300 mt-6 font-light">
              Cinematic editing that turns brands into icons and viewers into fans.
            </p>

            {hasBooking ? (
              <button
                type="button"
                onClick={openBooking}
                className="inline-block mt-8 px-8 py-4 bg-accent text-ink-900 font-bold rounded-full hover:bg-accent-hover hover:scale-105 transition duration-300 ease-out tracking-wide"
              >
                Start a Project
              </button>
            ) : (
              <a
                href="#contact"
                className="inline-block mt-8 px-8 py-4 bg-accent text-ink-900 font-bold rounded-full hover:bg-accent-hover hover:scale-105 transition duration-300 ease-out tracking-wide"
              >
                Start a Project
              </a>
            )}
          </div>
        </div>

        {/* Curved marquee */}
        <div className="w-full bg-ink-900">
          <CurvedLoop
            marqueeText="Helping ✦ Brands ✦ Tell ✦ Stories ✦ That ✦ Sell ✦"
            speed={3}
            curveAmount={0}
            direction="left"
            interactive={true}
          />
        </div>

        <WorkSection setReferralProject={setReferralProject} />
        <BeforeAfterSlider />
        <Testimonials />
        <ContactForm referralProject={referralProject} />
      </div>
    </>
  );
}

export default HomePage;
