import React from 'react';
// 1. Import the new component
import { ImgComparisonSlider } from '@img-comparison-slider/react';

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
    <div id="craft" className="py-16 md:py-24 bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-8">
        
        {/* --- Section Header --- */}
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-7xl font-bold">
            The Craft
          </h2>
          <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto">
            It's not just about the shot, it's about the final grade.
            Slide to see the transformation.
          </p>
        </div>

        {/* --- Slider Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sliders.map((slider) => (
            <div key={slider.title}>
              <h3 className="text-2xl font-semibold mb-4 text-center">
                {slider.title}
              </h3>
              <div className="rounded-lg overflow-hidden shadow-lg border border-gray-700">
                
                {/* 2. Use the new component syntax */}
                <ImgComparisonSlider>
                  <img
                    slot="first"
                    src={slider.before}
                    alt="Before"
                    onError={(e) => { e.target.src = 'https://placehold.co/800x450/000/fff?text=Before'; }}
                  />
                  <img
                    slot="second"
                    src={slider.after}
                    alt="After"
                    onError={(e) => { e.target.src = 'https://placehold.co/800x450/333/fff?text=After'; }}
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