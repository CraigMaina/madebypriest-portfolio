// --- 1. Data for Your Testimonials ---
const testimonials = [
  {
    name: "Aura Records",
    project: "Music Video",
    quote: "Priest didn't just film a video, he created a world. The final color grade was beyond anything we expected."
  },
  {
    name: "Jane & Mike",
    project: "Wedding Film",
    quote: "We cry every time we watch it. He captured the magic of our day perfectly. Truly a professional."
  },
  {
    name: "Nomad Coffee Co.",
    project: "Brand Commercial",
    quote: "Fast turnaround, incredible eye for detail, and a pleasure to work with. Will be hiring again 100%."
  },
  {
    name: "Studio XYZ",
    project: "VFX Collaboration",
    quote: "A master of his craft. The technical skill and artistic vision are unmatched. Made our project 10x better."
  }
];

// Duplicate the array to create a seamless loop
const allTestimonials = [...testimonials, ...testimonials];

const Testimonials = () => {
  return (
    <div id="trusted" className="py-16 md:py-24 lg:py-32 bg-ink-900 overflow-hidden">
      <h2 className="text-center text-xl md:text-2xl text-fog-500 mb-10 md:mb-12">
        Trusted By Brands & Artists
      </h2>
      
      {/* --- Scrolling Container --- */}
      <div className="w-full inline-flex flex-nowrap">
        {/* We add two lists to create the seamless loop */}
        <ul className="flex items-center justify-center md:justify-start [&_li]:mx-4 animate-scroll-x">
          {allTestimonials.map((item, index) => (
            <li key={index} className="flex-shrink-0 w-80 md:w-96">
              <div className="bg-ink-800 p-6 rounded-card shadow-card border border-ink-700 h-full">
                <p className="text-base md:text-lg text-fog-300 italic leading-relaxed">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <p className="text-fog-100 font-semibold mt-4">
                  {item.name}
                </p>
                <p className="text-fog-500 text-sm">
                  {item.project}
                </p>
              </div>
            </li>
          ))}
        </ul>
        {/* Second list for the seamless loop */}
        <ul className="flex items-center justify-center md:justify-start [&_li]:mx-4 animate-scroll-x" aria-hidden="true">
          {allTestimonials.map((item, index) => (
            <li key={index} className="flex-shrink-0 w-80 md:w-96">
              <div className="bg-ink-800 p-6 rounded-card shadow-card border border-ink-700 h-full">
                <p className="text-base md:text-lg text-fog-300 italic leading-relaxed">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <p className="text-fog-100 font-semibold mt-4">
                  {item.name}
                </p>
                <p className="text-fog-500 text-sm">
                  {item.project}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Testimonials;