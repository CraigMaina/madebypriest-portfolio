import { ImgComparisonSlider } from '@img-comparison-slider/react';
import { GoArrowSwitch } from 'react-icons/go';

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

// CMS-ready shape (mirrors the future Sanity `grading` schema).
const sliders = [
  { title: 'Music Video', category: 'Color Grade', before: '/images/grading-before-1.jpg', after: '/images/grading-after-1.jpg' },
  { title: 'Commercial', category: 'Color Grade', before: '/images/grading-before-2.jpg', after: '/images/grading-after-2.jpg' },
];

const Chip = ({ children, tone }) => (
  <span
    className={`pointer-events-none absolute top-3 z-10 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-sm ${
      tone === 'accent'
        ? 'right-3 bg-accent/90 text-ink-900'
        : 'left-3 bg-ink-900/70 text-fog-300'
    }`}
  >
    {children}
  </span>
);

const BeforeAfterSlider = () => {
  return (
    <section id="craft" className="py-16 md:py-24 lg:py-32 bg-ink-900 text-fog-100">
      <div className="max-w-6xl mx-auto px-5 md:px-8">

        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold">
            The Craft
          </h2>
          <p className="text-base md:text-lg text-fog-300 mt-4 max-w-2xl mx-auto leading-relaxed">
            The shot is only half the story. The grade is where it becomes cinema.
            Drag to see the difference.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {sliders.map((slider) => (
            <figure key={slider.title} className="group">
              <div className="relative rounded-card overflow-hidden shadow-card border border-ink-600">
                <Chip tone="muted">Before</Chip>
                <Chip tone="accent">After</Chip>

                <ImgComparisonSlider className="block w-full [--divider-color:theme(colors.accent.DEFAULT)] [--divider-width:2px]">
                  <img
                    slot="first"
                    src={slider.before}
                    alt={`${slider.title} — ungraded footage before color grading`}
                    width="800"
                    height="450"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = BEFORE_FALLBACK; }}
                  />
                  <img
                    slot="second"
                    src={slider.after}
                    alt={`${slider.title} — final cinematic color grade`}
                    width="800"
                    height="450"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = AFTER_FALLBACK; }}
                  />
                </ImgComparisonSlider>

                {/* Drag hint */}
                <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
                  <span className="inline-flex items-center gap-1.5 text-xs text-fog-300 bg-ink-900/70 px-3 py-1 rounded-full backdrop-blur-sm opacity-90 group-hover:opacity-0 transition-opacity">
                    <GoArrowSwitch aria-hidden="true" /> Drag to compare
                  </span>
                </div>
              </div>
              <figcaption className="mt-4 text-center">
                <h3 className="text-lg md:text-xl font-semibold text-fog-100">{slider.title}</h3>
                <p className="text-sm text-fog-500">{slider.category}</p>
              </figcaption>
            </figure>
          ))}
        </div>

      </div>
    </section>
  );
};

export default BeforeAfterSlider;
