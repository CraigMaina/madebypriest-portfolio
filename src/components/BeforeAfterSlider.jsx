import { useLayoutEffect, useRef } from 'react';
import { ImgComparisonSlider } from '@img-comparison-slider/react';
import { GoArrowSwitch } from 'react-icons/go';
import { useContent } from '../sanity/content';
import { useReveal, gsap, ScrollTrigger, prefersReducedMotion, DURATION, EASE } from '../motion';
import { BEFORE_FALLBACK, AFTER_FALLBACK } from '../data/placeholders';

// --- NLE timeline decoration data ---
const STATS = [
  { to: 300, suffix: '+', label: 'Projects shipped' },
  { to: 80, suffix: 'M+', label: 'Views generated' },
  { to: 40, suffix: '+', label: 'Brands & artists' },
];

// Clip segments (flex-grow proportions) for the mock editor track.
const CLIPS = [
  { grow: 22, label: 'INTRO', accent: true },
  { grow: 14, label: 'B-ROLL' },
  { grow: 30, label: 'HOOK', accent: true },
  { grow: 18, label: 'GRADE' },
  { grow: 16, label: 'OUTRO' },
];

// Deterministic pseudo-waveform (20–100% heights) so the audio track looks real.
const WAVE = Array.from({ length: 56 }, (_, i) => {
  const n = Math.abs(Math.sin(i * 0.5) * 0.6 + Math.sin(i * 0.17) * 0.4);
  return 20 + Math.round(n * 80);
});

// Number that counts up from 0 when scrolled into view (static under reduced-motion).
const CountUp = ({ to, suffix = '' }) => {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.textContent = `${to}${suffix}`;
      return;
    }
    const obj = { v: 0 };
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () =>
        gsap.to(obj, {
          v: to,
          duration: 1.2,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = `${Math.round(obj.v)}${suffix}`;
          },
        }),
    });
    return () => st.kill();
  }, [to, suffix]);
  return (
    <span ref={ref} className="tabular-nums">
      0{suffix}
    </span>
  );
};

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
  const sliders = useContent('gradings');
  const headingRef = useReveal({ y: 24 });
  const gridRef = useReveal({ children: ':scope > *', y: 36, start: 'top 80%' });
  const timelineRef = useRef(null);

  // "Cut" reveal: clips scale in from their edit point, the waveform rises, and
  // a playhead sweeps across — all once, on scroll-in. Reduced-motion leaves the
  // timeline fully drawn and static.
  useLayoutEffect(() => {
    const el = timelineRef.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const track = el.querySelector('[data-track]');
      const playhead = el.querySelector('[data-playhead]');
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top 78%', once: true },
      });
      // Explicit fromTo so a StrictMode double-invoke can't leave clips/bars
      // stranded collapsed (scale 0).
      tl.fromTo(
        el.querySelectorAll('[data-clip]'),
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: 'left center',
          stagger: 0.06,
          duration: DURATION.base,
          ease: EASE.entrance,
        }
      )
        .fromTo(
          el.querySelectorAll('[data-wavebar]'),
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: 'bottom',
            stagger: 0.008,
            duration: DURATION.base,
            ease: EASE.entrance,
          },
          0.1
        )
        .fromTo(
          playhead,
          { x: 0, autoAlpha: 0 },
          {
            x: track ? track.clientWidth * 0.68 : 0,
            autoAlpha: 1,
            duration: DURATION.entrance,
            ease: EASE.move,
          },
          0.05
        );
      return () => tl.scrollTrigger?.kill();
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="craft" className="py-16 md:py-24 lg:py-32 bg-ink-900 text-fog-100">
      <div className="max-w-6xl mx-auto px-5 md:px-8">

        <div ref={headingRef} className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold">
            The Craft
          </h2>
          <p className="text-base md:text-lg text-fog-300 mt-4 max-w-2xl mx-auto leading-relaxed">
            The shot is only half the story. The grade is where it becomes cinema.
            Drag to see the difference.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
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

        {/* --- NLE timeline: stats + mock editor track --- */}
        <div
          ref={timelineRef}
          className="relative mt-12 md:mt-16 overflow-hidden rounded-card border border-ink-700 bg-ink-800/50 p-5 md:p-7"
        >
          {/* Count-up stats */}
          <div className="grid grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8">
            {STATS.map((s) => (
              <div key={s.label} className="text-center md:text-left">
                <p className="font-heading text-3xl md:text-5xl font-bold text-fog-100">
                  <CountUp to={s.to} suffix={s.suffix} />
                </p>
                <p className="mt-1 text-xs md:text-sm text-fog-500">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Editor track */}
          <div data-track className="relative">
            {/* Ruler */}
            <div className="flex justify-between font-mono text-[10px] text-fog-500 mb-2">
              <span>00:00</span>
              <span>00:45</span>
              <span>01:30</span>
              <span>02:15</span>
            </div>

            {/* Video track — clips */}
            <div className="flex gap-1 h-9 md:h-11">
              {CLIPS.map((c) => (
                <div
                  key={c.label}
                  data-clip
                  style={{ flexGrow: c.grow }}
                  className={`flex items-center px-2 rounded overflow-hidden text-[10px] font-semibold uppercase tracking-wider ${
                    c.accent
                      ? 'bg-accent/25 text-accent border border-accent/40'
                      : 'bg-ink-600 text-fog-300 border border-ink-500'
                  }`}
                >
                  <span className="truncate">{c.label}</span>
                </div>
              ))}
            </div>

            {/* Audio track — waveform */}
            <div className="mt-1.5 flex items-end gap-[2px] h-10 md:h-14 rounded bg-ink-900/50 px-2 py-1">
              {WAVE.map((h, i) => (
                <div
                  key={i}
                  data-wavebar
                  style={{ height: `${h}%` }}
                  className="flex-1 rounded-[1px] bg-fog-500/40"
                />
              ))}
            </div>

            {/* Playhead */}
            <div
              data-playhead
              aria-hidden="true"
              className="pointer-events-none absolute top-0 bottom-0 left-0 w-px bg-accent"
            >
              <span className="absolute -top-1 -left-[3px] h-2 w-2 rotate-45 bg-accent" />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default BeforeAfterSlider;
