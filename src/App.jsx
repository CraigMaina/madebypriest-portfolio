import React, { useState, useEffect } from 'react';

// --- Import All Components ---
import CardNav from './components/CardNav';
import Dither from './components/Dither';
import LogoLoop from './components/LogoLoop';
import WorkSection from './components/WorkSection';
import BeforeAfterSlider from './components/BeforeAfterSlider';
import Testimonials from './components/Testimonials';
import ContactForm from './components/ContactForm';
import Preloader from './components/Preloader'; // <-- IMPORT PRELOADER

// --- Import Icons ---
import {
  SiAdobeaftereffects,
  SiAdobepremierepro,
  SiDavinciresolve,
  SiBlender,
  SiAdobephotoshop,
  SiAdobelightroom
} from 'react-icons/si';

// --- Component Data ---
const navItems = [
  {
    label: "Work",
    bgColor: "#1A1A1A",
    textColor: "#fff",
    links: [
      { label: "Main Portfolio", href: "#work", ariaLabel: "See Main Portfolio" },
      { label: "The Craft", href: "#craft", ariaLabel: "See The Craft" }
    ]
  },
  {
    label: "About",
    bgColor: "#2B2B2B",
    textColor: "#fff",
    links: [
      { label: "Testimonials", href: "#trusted", ariaLabel: "See Testimonials" },
      { label: "My Mission", href: "#contact", ariaLabel: "Read my mission" }
    ]
  },
  {
    label: "Contact",
    bgColor: "#3C3C3C",
    textColor: "#fff",
    links: [
      { label: "Email Me", href: "mailto:hello@madebypriest.com", ariaLabel: "Email me" },
      { label: "Start Project", href: "#contact", ariaLabel: "Start a project" }
    ]
  }
];

const softwareLogos = [
  { node: <SiAdobepremierepro />, title: "Premiere Pro" },
  { node: <SiAdobeaftereffects />, title: "After Effects" },
  { node: <SiDavinciresolve />, title: "DaVinci Resolve" },
  { node: <SiBlender />, title: "Blender" },
  { node: <SiAdobephotoshop />, title: "Photoshop" },
  { node: <SiAdobelightroom />, title: "Lightroom" },
];

// --- The Main App Component ---
function App() {
  // 1. STATE: Referral Logic (Tracks which project they clicked)
  const [referralProject, setReferralProject] = useState('');

  // 2. STATE: Preloader Logic
  const [isLoading, setIsLoading] = useState(true);
  const [isSiteVisible, setIsSiteVisible] = useState(false);

  useEffect(() => {
    // Phase 1: Show Preloader for 2 seconds
    const loadTimer = setTimeout(() => {
      setIsLoading(false); // Triggers fade-out animation
    }, 2000);

    // Phase 2: Remove Preloader from DOM and Fade In Site
    const unmountTimer = setTimeout(() => {
      setIsSiteVisible(true); 
    }, 2800); // slightly longer than 2000ms + fade duration

    return () => {
      clearTimeout(loadTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  return (
    <>
      {/* --- PRELOADER OVERLAY --- */}
      {!isSiteVisible && <Preloader isLoading={isLoading} />}

      {/* --- MAIN SITE CONTENT --- */}
      {/* The opacity class creates the smooth fade-in effect */}
      <div 
        className={`
          bg-black text-white min-h-screen
          transition-opacity duration-1000 ease-in-out
          ${isLoading ? 'opacity-0' : 'opacity-100'}
        `}
      >
        
        {/* --- 1. Navigation --- */}
        <CardNav
          items={navItems}
          baseColor="#000"
          menuColor="#fff"
          buttonBgColor="#fff"
          buttonTextColor="#000"
        />

        {/* --- 2. Hero Section --- */}
        <div className="relative min-h-screen flex flex-col items-center justify-center">
          <div className="absolute inset-0 z-0">
            <Dither
              waveColor={[1.0, 1.0, 1.0]}
              disableAnimation={false}
              enableMouseInteraction={true}
              mouseRadius={0.3}
              colorNum={3} 
              waveAmplitude={0.3}
              waveFrequency={3}
              waveSpeed={0.05}
            />
          </div>
          <div className="relative z-10 text-center px-4">
            <h1 className="text-6xl md:text-9xl font-bold uppercase tracking-tighter font-heading">
              MadeByPriest
            </h1>
            <p className="text-xl md:text-3xl text-gray-300 mt-4">
              Generative & Cinematic Visuals
            </p>
            <a
              href="#contact"
              className="inline-block mt-8 px-8 py-3 bg-white text-black font-semibold rounded-full hover:scale-105 transition-transform"
            >
              Book a Call
            </a>
          </div>
        </div>

        {/* --- 3. Software Ticker --- */}
        <div className="py-16 md:py-24">
          <h2 className="text-center text-2xl text-gray-400 mb-10">
            Tools of the Trade
          </h2>
          <LogoLoop
            logos={softwareLogos}
            speed={100}
            direction="left"
            logoHeight={40}
            gap={60}
            pauseOnHover
            fadeOut
            fadeOutColor="#000000"
          />
        </div>

        {/* --- 4. Work Section --- */}
        <WorkSection setReferralProject={setReferralProject} />

        {/* --- 5. "The Craft" Slider Section --- */}
        <BeforeAfterSlider />

        {/* --- 6. Testimonials Section --- */}
        <Testimonials />
        
        {/* --- 7. Contact Section --- */}
        <ContactForm referralProject={referralProject} />

      </div>
    </>
  );
}

export default App;