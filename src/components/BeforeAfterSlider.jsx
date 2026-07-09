import React from 'react';
// 1. Import the new component
import { ImgComparisonSlider } from '@img-comparison-slider/react';

// Intentional, self-contained fallbacks (no external placeholder service) until
// real grading stills are supplied. "Before" reads flat/desaturated; "After"
// reads cinematically graded, so the section still communicates the transformation.
const svgFallback = (label, from, to) =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="800" height="450" fill="url(#g)"/><text x="50%" y="50%" fill="#F5F5F7" font-family="sans-serif" font-size="28" font-weight="700" letter-spacing="4" text-anchor="middle" dominant-baseline="middle">${label}</text></svg>`
  );

const BEFORE_FALLBACK = svgFallback('BEFORE', '#3a3a3d', '#101012');
const AFTER_FALLBACK = svgFallback('AFTER', '#E6B450', '#1A1A1D');

// --- 1. Data for Your Sliders ---
// (This data stays the same)
const sliders = [
  {
    title: "Music Video",
    before: "/images/grading-before-1.jpg",
    after: "/images/grading-after-1.jpg",
  },
  {
    title: "Commercial",
    before: "/images/grading-before-2.jpg",
    after: "/images/grading-after-2.jpg",
  },
];

const BeforeAfterSlider = () => {
  return (
    <div id="craft" className="py-16 md:py-24 lg:py-32 bg-ink-900 text-fog-100">
      <div className="max-w-6xl mx-auto px-5 md:px-8">

        {/* --- Section Header --- */}
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold">
            The Craft
          </h2>
          <p className="text-base md:text-lg text-fog-300 mt-4 max-w-2xl mx-auto leading-relaxed">
            It's not just about the shot, it's about the final grade.
            Slide to see the transformation.
          </p>
        </div>

        {/* --- Slider Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {sliders.map((slider) => (
            <div key={slider.title}>
              <h3 className="text-lg md:text-xl font-semibold mb-4 text-center">
                {slider.title}
              </h3>
              <div className="rounded-card overflow-hidden shadow-card border border-ink-600">
                
                {/* 2. Use the new component syntax */}
                <ImgComparisonSlider>
                  <img
                    slot="first"
                    src={slider.before}
                    alt={`${slider.title} — ungraded footage before color grading`}
                    width="800"
                    height="450"
                    onError={(e) => { e.target.src = BEFORE_FALLBACK; }}
                  />
                  <img
                    slot="second"
                    src={slider.after}
                    alt={`${slider.title} — final cinematic color grade`}
                    width="800"
                    height="450"
                    onError={(e) => { e.target.src = AFTER_FALLBACK; }}
                  />
                </ImgComparisonSlider>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default BeforeAfterSlider;