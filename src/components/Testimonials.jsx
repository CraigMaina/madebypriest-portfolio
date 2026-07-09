import { FaQuoteLeft } from 'react-icons/fa';

// CMS-ready shape (mirrors the future Sanity `testimonial` schema).
const testimonials = [
  { name: 'Aura Records', project: 'Music Video', quote: "Priest didn't just film a video, he created a world. The final color grade was beyond anything we expected." },
  { name: 'Jane & Mike', project: 'Wedding Film', quote: 'We cry every time we watch it. He captured the magic of our day perfectly. Truly a professional.' },
  { name: 'Nomad Coffee Co.', project: 'Brand Commercial', quote: 'Fast turnaround, incredible eye for detail, and a pleasure to work with. Will be hiring again 100%.' },
  { name: 'Studio XYZ', project: 'VFX Collaboration', quote: 'A master of his craft. The technical skill and artistic vision are unmatched. Made our project 10x better.' },
];

const initials = (name) =>
  name
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

const TestimonialCard = ({ item }) => (
  <div className="flex h-full flex-col justify-between rounded-card border border-ink-700 bg-ink-800 p-6 md:p-7 shadow-card">
    <div>
      <FaQuoteLeft className="text-accent/80 text-2xl mb-4" aria-hidden="true" />
      <p className="text-base md:text-lg text-fog-100 leading-relaxed">{item.quote}</p>
    </div>
    <div className="mt-6 flex items-center gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent font-bold text-sm ring-1 ring-accent/30">
        {initials(item.name)}
      </span>
      <div className="min-w-0">
        <p className="text-fog-100 font-semibold truncate">{item.name}</p>
        <p className="text-fog-500 text-sm truncate">{item.project}</p>
      </div>
    </div>
  </div>
);

// Duplicate for a seamless marquee loop.
const marqueeItems = [...testimonials, ...testimonials];

const Testimonials = () => {
  return (
    <section id="trusted" className="py-16 md:py-24 lg:py-32 bg-ink-900 overflow-hidden">
      <h2 className="text-center text-xl md:text-2xl text-fog-500 mb-10 md:mb-14">
        Trusted By Brands &amp; Artists
      </h2>

      {/* Edge fades for a premium marquee. */}
      <div className="relative w-full">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 md:w-32 bg-gradient-to-r from-ink-900 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 md:w-32 bg-gradient-to-l from-ink-900 to-transparent" />

        <div className="flex w-max">
          {[0, 1].map((track) => (
            <ul
              key={track}
              className="flex items-stretch [&_li]:mx-3 animate-scroll-x"
              aria-hidden={track === 1 ? 'true' : undefined}
            >
              {marqueeItems.map((item, index) => (
                <li key={`${track}-${index}`} className="flex w-80 md:w-96 shrink-0">
                  <TestimonialCard item={item} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
