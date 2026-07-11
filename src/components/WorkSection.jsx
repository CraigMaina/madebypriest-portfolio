import { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo } from 'react';
import { GoX, GoArrowUpRight } from 'react-icons/go';
import { FaPlay } from 'react-icons/fa';
import { useContent } from '../sanity/content';
import { useBooking } from './BookingProvider';
import { FALLBACK_THUMB } from '../data/placeholders';
import {
  lockScroll,
  unlockScroll,
  useReveal,
  gsap,
  prefersReducedMotion,
  DURATION,
  EASE,
} from '../motion';

const aspectClass = (orientation) =>
  orientation === 'portrait' ? 'aspect-[9/16]' : orientation === 'square' ? 'aspect-square' : 'aspect-video';

// A reel is only playable when it points at a real hosted file. The demo/fallback
// entries use placeholder local paths that don't exist, so we show a "coming soon"
// state instead of a broken native player (which would throw load errors).
const isPlayable = (url) => /^https?:\/\//i.test(url || '');

// Audience-first filters. Projects carry an `audience` field (Sanity + fallback);
// 'All' shows everything.
const AUDIENCES = ['All', 'Ads & Commercial', 'Lifestyle & Social', 'Music Videos', 'Brand Films'];
const matchesAudience = (project, filter) => filter === 'All' || project.audience === filter;

// --- Main Section ---
const WorkSection = ({ setReferralProject }) => {
  const projects = useContent('projects');
  const { hasBooking, openBooking } = useBooking();
  const [selectedProject, setSelectedProject] = useState(null);
  const [filter, setFilter] = useState('All');

  const headerRef = useReveal({ y: 24 });
  // Reveal the grid as a whole (its own transform) rather than staggering the
  // cards — the filter transition owns the individual cards, so sharing targets
  // with a child-stagger reveal would let them fight and strand cards hidden.
  const gridRef = useReveal({ y: 24, start: 'top 82%' });
  const didMountRef = useRef(false);

  // Per-audience project counts for the filter rail.
  const counts = useMemo(() => {
    const c = { All: projects.length };
    for (const label of AUDIENCES) {
      if (label !== 'All') c[label] = projects.filter((p) => p.audience === label).length;
    }
    return c;
  }, [projects]);

  // Sliding accent indicator behind the active tab.
  const trackRef = useRef(null);
  const indicatorRef = useRef(null);
  const indicatorInitRef = useRef(false);
  useLayoutEffect(() => {
    const track = trackRef.current;
    const indicator = indicatorRef.current;
    if (!track || !indicator) return;
    const activeEl = [...track.querySelectorAll('[data-tab]')].find((el) => el.dataset.tab === filter);
    if (!activeEl) return;
    const vars = { x: activeEl.offsetLeft, width: activeEl.offsetWidth };
    // First paint (and reduced-motion) snap into place; later changes slide.
    if (!indicatorInitRef.current || prefersReducedMotion()) {
      gsap.set(indicator, vars);
    } else {
      gsap.to(indicator, { ...vars, duration: DURATION.base, ease: EASE.move });
      activeEl.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    }
    indicatorInitRef.current = true;
  }, [filter]);

  const changeFilter = (label) => setFilter(label);

  // Filter transition: stagger the newly-visible cards in. Robust on the CSS
  // masonry (FLIP + columns strands cards) and can't fight the initial reveal —
  // explicit end state + overwrite + clearProps always resolve to fully visible.
  // Skipped on first mount (the scroll reveal owns the entrance) and under
  // reduced-motion (cards swap instantly).
  useLayoutEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    const grid = gridRef.current;
    if (!grid || prefersReducedMotion()) return;
    const visible = [...grid.querySelectorAll('[data-card]')].filter((c) => c.offsetParent !== null);
    if (!visible.length) return;
    // Kill any lingering reveal/prior-filter tweens on these nodes first, then run
    // a fresh staggered entrance. (Avoids `overwrite:true`, which can kill a
    // staggered fromTo's own sub-tweens and strand cards at the hidden start.)
    gsap.killTweensOf(visible);
    gsap.fromTo(
      visible,
      { opacity: 0, y: 14, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: DURATION.base,
        ease: EASE.entrance,
        stagger: 0.05,
        clearProps: 'transform',
        // Guarantee visibility even if interrupted: never leave a card hidden.
        onInterrupt: () => gsap.set(visible, { opacity: 1 }),
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const openModal = (project) => setSelectedProject(project);
  const closeModal = () => setSelectedProject(null);

  // Starting a project from a reel stamps its title into the contact form, then
  // opens the booking scheduler (or scrolls to the form if booking isn't set up).
  const startProject = (title) => {
    setReferralProject?.(title);
    setSelectedProject(null);
    if (hasBooking) {
      openBooking();
    } else {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="work" className="relative bg-ink-900 px-5 md:px-8 py-16 md:py-24 lg:py-32">
      {/* Ambient accent glow for depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-accent/10 blur-[120px]"
      />

      <div className="relative max-w-6xl mx-auto">
        <header ref={headerRef} className="mb-8 md:mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-accent text-xs md:text-sm font-semibold uppercase tracking-[0.25em] mb-3">
              Selected Work
            </p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-fog-100">
              Reels &amp; videos that perform
            </h2>
            <p className="mt-3 text-base md:text-lg text-fog-300 max-w-xl">
              Vertical reels that stop the scroll, widescreen edits that hold the room.
            </p>
          </div>

          {/* Audience filter rail — horizontal, never wraps; a sliding accent
              indicator marks the active tab. Edge fades hint at scrollability. */}
          <div className="relative w-full md:w-auto md:max-w-[60%] md:shrink-0">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-6 bg-gradient-to-r from-ink-900 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-6 bg-gradient-to-l from-ink-900 to-transparent" />
            <div
              className="no-scrollbar overflow-x-auto overscroll-x-contain snap-x scroll-px-4 -mx-1 px-1 py-1"
              role="tablist"
              aria-label="Filter work by audience"
            >
              <div ref={trackRef} className="relative flex w-max gap-2">
                <span
                  ref={indicatorRef}
                  aria-hidden="true"
                  className="absolute left-0 top-0 bottom-0 z-0 w-0 rounded-full bg-accent"
                />
                {AUDIENCES.map((label) => {
                  const active = filter === label;
                  return (
                    <button
                      key={label}
                      data-tab={label}
                      role="tab"
                      aria-selected={active}
                      onClick={() => changeFilter(label)}
                      className={`relative z-10 snap-start whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                        active ? 'text-ink-900' : 'text-fog-300 hover:text-fog-100'
                      }`}
                    >
                      {label}
                      <span
                        className={`ml-1.5 text-xs tabular-nums ${active ? 'text-ink-900/60' : 'text-fog-500'}`}
                      >
                        {counts[label] ?? 0}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </header>

        {/* Masonry: portrait + landscape interleave via CSS columns. All cards
            stay mounted; non-matching ones are hidden so FLIP can animate the
            filter transition. */}
        <div ref={gridRef} className="columns-1 sm:columns-2 lg:columns-3 gap-5 md:gap-6">
          {(() => {
            let visibleIndex = 0;
            return projects.map((project) => {
              const matches = matchesAudience(project, filter);
              const index = matches ? visibleIndex++ : -1;
              return (
                <ProjectCard
                  key={project.title}
                  project={project}
                  index={index}
                  matches={matches}
                  featured={index === 0}
                  onOpen={openModal}
                />
              );
            });
          })()}
        </div>
      </div>

      {selectedProject && (
        <VideoModal project={selectedProject} onClose={closeModal} onStartProject={startProject} />
      )}
    </section>
  );
};

// --- ProjectCard ---
const ProjectCard = ({ project, index, matches, featured = false, onOpen }) => {
  const [preview, setPreview] = useState(false);
  const videoRef = useRef(null);
  const cardRef = useRef(null);
  // Preview only exists for reels with a real hosted URL. The demo entries use
  // placeholder paths, so this stays dormant (thumbnail-only) until real video
  // URLs are supplied. On fine pointers it's hover-driven; on touch it's driven
  // by an in-view observer below.
  const playable = isPlayable(project.videoUrl);
  const finePointer =
    typeof window !== 'undefined' && window.matchMedia?.('(pointer: fine)').matches;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (preview) {
      v.play?.().catch(() => {});
    } else {
      v.pause?.();
      try {
        v.currentTime = 0;
      } catch {
        /* ignore */
      }
    }
  }, [preview]);

  // Touch: auto-preview the card while it sits in the middle band of the
  // viewport. The center-only rootMargin means roughly one card plays at a time,
  // and it pauses (preview=false) as soon as it leaves the band — cheap on
  // battery. No-op on fine pointers (hover handles it) and when not playable.
  useEffect(() => {
    // Reduced-motion users get no auto-playing video (a complete static experience).
    if (!playable || finePointer || prefersReducedMotion()) return;
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
    const el = cardRef.current;
    if (!el || !matches) return;
    const obs = new IntersectionObserver(([entry]) => setPreview(entry.isIntersecting), {
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0,
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [playable, finePointer, matches]);

  return (
    <button
      ref={cardRef}
      type="button"
      data-card
      aria-hidden={!matches}
      tabIndex={matches ? 0 : -1}
      onClick={() => onOpen(project)}
      onPointerEnter={() => playable && finePointer && setPreview(true)}
      onPointerLeave={() => finePointer && setPreview(false)}
      aria-label={`Preview ${project.title} — ${project.category}`}
      className={`group relative w-full mb-5 md:mb-6 overflow-hidden rounded-card border border-ink-700 bg-ink-800 text-left transition duration-500 ease-out hover:-translate-y-1.5 hover:border-accent/60 hover:shadow-[0_24px_50px_-20px_rgba(0,0,0,0.85)] active:scale-[0.98] ${
        featured ? '[column-span:all]' : 'break-inside-avoid'
      } ${matches ? 'block' : 'hidden'}`}
    >
      <div
        className={`relative w-full ${
          featured ? 'aspect-[16/10] sm:aspect-[2.4/1]' : aspectClass(project.orientation)
        }`}
      >
        <img
          src={project.thumbnail}
          alt={`${project.title} — ${project.category}`}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
          onError={(e) => { e.target.src = FALLBACK_THUMB; }}
        />

        {playable && (
          <video
            ref={videoRef}
            src={project.videoUrl}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              preview ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Constant bottom scrim + hover-deepened wash */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/25 to-transparent" />
        <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/5 transition-colors duration-500" />

        {/* Top row: type badge + timecode + index */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider bg-ink-900/70 text-fog-100 px-2.5 py-1 rounded-full backdrop-blur-sm">
            {project.type}
          </span>
          {project.duration && (
            <span className="font-mono text-[11px] tabular-nums bg-ink-900/70 text-fog-100 px-2 py-1 rounded-full backdrop-blur-sm">
              {project.duration}
            </span>
          )}
        </div>
        <span className="absolute top-3 right-4 z-10 font-heading font-bold text-sm text-fog-100/70 tabular-nums">
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Play affordance — reveals on hover (fine pointers) and stays visible
            on touch (no hover), so touch cards read as playable video. */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 [@media(hover:none)]:opacity-100 [@media(hover:none)]:translate-y-0">
          <span className="flex items-center justify-center w-11 h-11 md:w-14 md:h-14 rounded-full bg-accent/90 md:bg-accent text-ink-900 shadow-card backdrop-blur-sm">
            <FaPlay className="ml-0.5 text-sm md:text-base" aria-hidden="true" />
          </span>
        </div>

        {/* Editorial caption: category eyebrow + title (+ result on featured) */}
        <div
          className={`absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 ${
            featured ? 'p-5 md:p-7' : 'p-4 md:p-5'
          }`}
        >
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent/90 mb-1 truncate">
              {featured ? `Featured · ${project.category}` : project.category}
            </p>
            <h3
              className={`font-heading font-bold text-fog-100 truncate ${
                featured ? 'text-2xl md:text-4xl' : 'text-lg md:text-xl'
              }`}
            >
              {project.title}
            </h3>
            {featured && project.result && (
              <p className="mt-1.5 text-sm md:text-base text-fog-300 truncate">{project.result}</p>
            )}
          </div>
          <GoArrowUpRight
            className="shrink-0 text-xl text-fog-100/70 group-hover:text-accent transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </div>
      </div>
    </button>
  );
};

// --- VideoModal ---
const VideoModal = ({ project, onClose, onStartProject }) => {
  const [videoFailed, setVideoFailed] = useState(false);
  const dialogRef = useRef(null);
  const panelRef = useRef(null);
  const closeBtnRef = useRef(null);
  const closingRef = useRef(false);

  const isPortrait = project.orientation === 'portrait';

  // Animated close: play the panel out, then unmount. Reduced-motion closes
  // immediately. Guarded so repeated triggers don't stack timelines.
  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    if (prefersReducedMotion()) {
      onClose();
      return;
    }
    closingRef.current = true;
    gsap
      .timeline({ onComplete: onClose })
      .to(panelRef.current, { opacity: 0, scale: 0.96, y: 8, duration: DURATION.base, ease: EASE.move }, 0)
      .to(dialogRef.current, { opacity: 0, duration: DURATION.base }, 0);
  }, [onClose]);

  // Mount: scroll lock, focus, and the enter animation.
  useLayoutEffect(() => {
    const previouslyFocused = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    lockScroll(); // pause Lenis while the video modal is open
    closeBtnRef.current?.focus();

    let ctx;
    if (!prefersReducedMotion()) {
      ctx = gsap.context(() => {
        gsap
          .timeline()
          .fromTo(dialogRef.current, { opacity: 0 }, { opacity: 1, duration: DURATION.base, ease: EASE.entrance })
          .fromTo(
            panelRef.current,
            { opacity: 0, scale: 0.94, y: 14 },
            { opacity: 1, scale: 1, y: 0, duration: DURATION.slow, ease: EASE.entrance },
            '-=0.1'
          );
      });
    }
    return () => {
      ctx?.revert();
      document.body.style.overflow = prevOverflow;
      unlockScroll();
      previouslyFocused?.focus?.();
    };
  }, []);

  // Keyboard: Esc closes (animated), Tab traps focus within the dialog.
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        requestClose();
        return;
      }
      if (e.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll(
          'button, [href], video, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [requestClose]);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} preview`}
      className="fixed inset-0 bg-ink-900/90 backdrop-blur-sm z-[999] flex items-center justify-center p-4"
    >
      <button
        ref={closeBtnRef}
        onClick={requestClose}
        className="absolute top-4 right-4 text-fog-100 hover:text-accent text-3xl z-[1001]"
        aria-label="Close preview"
      >
        <GoX />
      </button>

      <div ref={panelRef} className={`relative z-[1000] w-full ${isPortrait ? 'max-w-sm' : 'max-w-4xl'}`}>
        <div className="fixed inset-0 -z-10" onClick={requestClose} aria-hidden="true" />

        <div className={`relative w-full ${aspectClass(project.orientation)} max-h-[72svh] mx-auto overflow-hidden rounded-card bg-black border border-ink-700`}>
          {!isPlayable(project.videoUrl) || videoFailed ? (
            <div
              className="w-full h-full flex flex-col items-center justify-center bg-center bg-cover"
              style={{ backgroundImage: `url(${project.thumbnail})` }}
            >
              <div className="absolute inset-0 bg-ink-900/75" />
              <div className="relative text-center px-6">
                <h3 className="text-2xl md:text-3xl font-bold text-fog-100">{project.title}</h3>
                <p className="mt-2 text-fog-300">Full reel coming soon.</p>
              </div>
            </div>
          ) : (
            <video
              src={project.videoUrl}
              poster={project.thumbnail}
              controls
              autoPlay
              loop
              playsInline
              onError={() => setVideoFailed(true)}
              className="w-full h-full bg-black"
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
          <p className="text-fog-300">
            <span className="text-fog-100 font-semibold">{project.title}</span> · {project.category}
          </p>
          <button
            type="button"
            onClick={() => onStartProject(project.title)}
            className="px-6 py-3 bg-accent text-ink-900 font-bold rounded-full hover:bg-accent-hover transition-colors"
          >
            Start a project like this
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkSection;
