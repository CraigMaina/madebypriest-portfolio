import { FaQuoteLeft } from 'react-icons/fa';
import { useContent } from '../sanity/content';
import { useReveal } from '../motion';

const initials = (name) =>
  name
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

const Avatar = ({ name, size = 'md' }) => (
  <span
    className={`flex shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent font-bold ring-1 ring-accent/30 ${
      size === 'lg' ? 'h-14 w-14 text-base' : 'h-11 w-11 text-sm'
    }`}
  >
    {initials(name)}
  </span>
);

const TestimonialCard = ({ item }) => (
  <div className="flex h-full flex-col justify-between rounded-card border border-ink-700 bg-ink-800 p-6 md:p-7 shadow-card">
    <div>
      <FaQuoteLeft className="text-accent/80 text-2xl mb-4" aria-hidden="true" />
      <p className="text-base md:text-lg text-fog-100 leading-relaxed">{item.quote}</p>
    </div>
    <div className="mt-6 flex items-center gap-3">
      <Avatar name={item.name} />
      <div className="min-w-0">
        <p className="text-fog-100 font-semibold truncate">{item.name}</p>
        <p className="text-fog-500 text-sm truncate">{item.project}</p>
      </div>
    </div>
  </div>
);

// One infinite marquee row. Two identical tracks tile seamlessly; `reverse`
// flips the travel direction. Both tracks freeze under reduced-motion (the
// .animate-scroll-x rule in index.css is disabled there), leaving cards visible.
const MarqueeRow = ({ items, reverse = false }) => {
  const doubled = [...items, ...items];
  return (
    <div className="flex w-max">
      {[0, 1].map((track) => (
        <ul
          key={track}
          className={`flex items-stretch [&_li]:mx-2.5 animate-scroll-x ${
            reverse ? '[animation-direction:reverse]' : ''
          }`}
          aria-hidden={track === 1 ? 'true' : undefined}
        >
          {doubled.map((item, index) => (
            <li key={`${track}-${index}`} className="flex w-80 md:w-96 shrink-0">
              <TestimonialCard item={item} />
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
};

const Testimonials = () => {
  const testimonials = useContent('testimonials');
  const headingRef = useReveal({ y: 20 });
  const spotlightRef = useReveal({ y: 28 });

  const featured = testimonials[0];
  const rest = testimonials.length > 1 ? testimonials.slice(1) : testimonials;
  const rowA = rest;
  const rowB = [...rest].reverse();

  return (
    <section id="trusted" className="py-16 md:py-24 lg:py-32 bg-ink-900 overflow-hidden">
      <h2 ref={headingRef} className="text-center text-xl md:text-2xl text-fog-500 mb-10 md:mb-14">
        Trusted By Brands &amp; Artists
      </h2>

      {/* Spotlight — the lead testimonial, front and centre. */}
      {featured && (
        <div ref={spotlightRef} className="px-5 md:px-8 mb-12 md:mb-16">
          <figure className="relative mx-auto max-w-3xl rounded-card border border-accent/30 bg-ink-800 p-8 md:p-12 text-center shadow-card">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-40 w-40 rounded-full bg-accent/10 blur-[90px]"
            />
            <FaQuoteLeft className="relative mx-auto text-accent text-3xl md:text-4xl mb-5" aria-hidden="true" />
            <blockquote className="relative text-xl md:text-3xl font-heading font-medium leading-snug text-fog-100">
              {featured.quote}
            </blockquote>
            <figcaption className="relative mt-7 flex items-center justify-center gap-3">
              <Avatar name={featured.name} size="lg" />
              <div className="text-left">
                <p className="text-fog-100 font-semibold">{featured.name}</p>
                <p className="text-fog-500 text-sm">{featured.project}</p>
              </div>
            </figcaption>
          </figure>
        </div>
      )}

      {/* Two counter-scrolling rows. */}
      <div className="relative w-full space-y-4 md:space-y-5">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 md:w-32 bg-gradient-to-r from-ink-900 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 md:w-32 bg-gradient-to-l from-ink-900 to-transparent" />

        <MarqueeRow items={rowA} />
        <MarqueeRow items={rowB} reverse />
      </div>
    </section>
  );
};

export default Testimonials;
