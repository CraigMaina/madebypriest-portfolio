import React, { useState, useEffect } from 'react';

// --- Import All Components ---
import CardNav from './components/CardNav';
import Dither from './components/Dither';
// import LogoLoop from './components/LogoLoop'; // REMOVED
import CurvedLoop from './components/CurvedLoop'; // ADDED
import WorkSection from './components/WorkSection';
import BeforeAfterSlider from './components/BeforeAfterSlider';
import Testimonials from './components/Testimonials';
import ContactForm from './components/ContactForm';
import Preloader from './components/Preloader';
import SEO from './components/SEO'; // Import SEO

// --- Component Data ---
const navItems = [
  {
    label: "Films",
    bgColor: "#1A1A1A",
    textColor: "#fff",
    links: [
      { label: "Main Portfolio", href: "#work", ariaLabel: "See Main Portfolio" },
      { label: "The Craft", href: "#craft", ariaLabel: "See The Craft" }
    ]
  },
  {
    label: "Studio",
    bgColor: "#2B2B2B",
    textColor: "#fff",
    links: [
      { label: "Testimonials", href: "#trusted", ariaLabel: "See Testimonials" },
      { label: "Philosophy", href: "#contact", ariaLabel: "Read my philosophy" }
    ]
  },
  {
    label: "Contact",
    bgColor: "#3C3C3C",
    textColor: "#fff",
    links: [
      { label: "Inquire now", href: "mailto:hello@madebypriest.com", ariaLabel: "Email me" },
      { label: "Start Project", href: "#contact", ariaLabel: "Start a project" }
    ]
  }
];

function App() {
  const [referralProject, setReferralProject] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSiteVisible, setIsSiteVisible] = useState(false);

  useEffect(() => {
    const loadTimer = setTimeout(() => {
      setIsLoading(false); 
    }, 2000);

    const unmountTimer = setTimeout(() => {
      setIsSiteVisible(true); 
    }, 2800); 

    return () => {
      clearTimeout(loadTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  return (
    <>
      <SEO />
      {!isSiteVisible && <Preloader isLoading={isLoading} />}

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
              colorNum={30} 
              waveAmplitude={0.3}
              waveFrequency={2.4}
              waveSpeed={0.05}
            />
          </div>
          <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
            {/* NEW HEADLINE [cite: 12] */}
            <h1 className="text-5xl md:text-8xl font-bold uppercase tracking-tighter font-heading leading-tight">
              Videos That Feel Like <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Blockbusters.</span>
            </h1>
            
            {/* NEW SUBHEADLINE [cite: 12] */}
            <p className="text-xl md:text-2xl text-gray-300 mt-6 font-light">
              Editing That Turns Brands Into Icons.
            </p>
            
            {/* NEW CTA [cite: 14] */}
            <a
              href="#contact"
              className="inline-block mt-8 px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform tracking-wide"
            >
              Let's Make Your Story Unforgettable
            </a>
          </div>
        </div>

        {/* --- 3. Curved Text Loop --- */}
        <div className="w-full bg-black">
            <CurvedLoop 
                marqueeText="Helping ✦ Brands ✦ Tell ✦ Stories ✦ That ✦ Sell ✦"
                speed={3}
                curveAmount={0}
                direction="left"
                interactive={true}
            />
        </div>

        {/* --- 4. Work Section --- */}
        <WorkSection setReferralProject={setReferralProject} />

        {/* --- 5. The Craft --- */}
        <BeforeAfterSlider />

        {/* --- 6. Testimonials --- */}
        <Testimonials />
        
        {/* --- 7. Contact Section --- */}
        <ContactForm referralProject={referralProject} />

      </div>
    </>
  );
}

export default App;