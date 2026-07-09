import { useState, useEffect, useRef, useMemo } from 'react';
import { GoX, GoArrowUpRight } from 'react-icons/go';
import { FaPlay } from 'react-icons/fa';
import { useContent } from '../sanity/content';
import { useBooking } from './BookingProvider';
import { FALLBACK_THUMB } from '../data/placeholders';

const aspectClass = (orientation) =>
  orientation === 'portrait' ? 'aspect-[9/16]' : orientation === 'square' ? 'aspect-square' : 'aspect-video';

// A reel is only playable when it points at a real hosted file. The demo/fallback
// entries use placeholder local paths that don't exist, so we show a "coming soon"
// state instead of a broken native player (which would throw load errors).
const isPlayable = (url) => /^https?:\/\//i.test(url || '');

const FILTERS = [
  { label: 'All', match: () => true },
  { label: 'Reels', match: (p) => p.type === 'Reel' },
  { label: 'Widescreen', match: (p) => p.type === 'Widescreen' },
];

// --- Main Section ---
const WorkSection = ({ setReferralProject }) => {
  const projects = useContent('projects');
  const { hasBooking, openBooking } = useBooking();
  const [selectedProject, setSelectedProject] = useState(null);
  const [filter, setFilter] = useState('All');

  const visible = useMemo(() => {
    const f = FILTERS.find((x) => x.label === filter) || FILTERS[0];
    return projects.filter(f.match);
  }, [projects, filter]);

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
        <header className="mb-8 md:mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
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

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 shrink-0" role="tablist" aria-label="Filter work">
            {FILTERS.map((f) => {
              const active = filter === f.label;
              return (
                <button
                  key={f.label}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(f.label)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                    active
                      ? 'bg-accent text-ink-900'
                      : 'border border-ink-600 text-fog-300 hover:border-fog-500 hover:text-fog-100'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </header>

        {/* Masonry: portrait + landscape interleave via CSS columns */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 md:gap-6">
          {visible.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} onOpen={openModal} />
          ))}
        </div>
      </div>

      {selectedProject && (
        <VideoModal project={selectedProject} onClose={closeModal} onStartProject={startProject} />
      )}
    </section>
  );
};

// --- ProjectCard ---
const ProjectCard = ({ project, index, onOpen }) => {
  return (
    <button
      type="button"
      onClick={() => onOpen(project)}
      aria-label={`Preview ${project.title} — ${project.category}`}
      className="group relative block w-full mb-5 md:mb-6 break-inside-avoid overflow-hidden rounded-card border border-ink-700 bg-ink-800 text-left transition duration-500 ease-out hover:-translate-y-1.5 hover:border-accent/60 hover:shadow-[0_24px_50px_-20px_rgba(0,0,0,0.85)]"
    >
      <div className={`relative w-full ${aspectClass(project.orientation)}`}>
        <img
          src={project.thumbnail}
          alt={`${project.title} — ${project.category}`}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
          onError={(e) => { e.target.src = FALLBACK_THUMB; }}
        />

        {/* Constant bottom scrim + hover-deepened wash */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/25 to-transparent" />
        <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/5 transition-colors duration-500" />

        {/* Top row: type badge + index */}
        <span className="absolute top-3 left-3 z-10 text-[11px] font-semibold uppercase tracking-wider bg-ink-900/70 text-fog-100 px-2.5 py-1 rounded-full backdrop-blur-sm">
          {project.type}
        </span>
        <span className="absolute top-3 right-4 z-10 font-heading font-bold text-sm text-fog-100/70 tabular-nums">
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Play affordance */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <span className="flex items-center justify-center w-14 h-14 rounded-full bg-accent text-ink-900 shadow-card">
            <FaPlay className="ml-0.5" aria-hidden="true" />
          </span>
        </div>

        {/* Title / category + arrow */}
        <div className="absolute inset-x-0 bottom-0 p-4 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base md:text-lg font-semibold text-fog-100 truncate">{project.title}</h3>
            <p className="text-xs md:text-sm text-fog-300 truncate">{project.category}</p>
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
  const closeBtnRef = useRef(null);

  const isPortrait = project.orientation === 'portrait';

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    closeBtnRef.current?.focus();

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
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
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

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
        onClick={onClose}
        className="absolute top-4 right-4 text-fog-100 hover:text-accent text-3xl z-[1001]"
        aria-label="Close preview"
      >
        <GoX />
      </button>

      <div className={`relative z-[1000] w-full ${isPortrait ? 'max-w-sm' : 'max-w-4xl'}`}>
        <div className="fixed inset-0 -z-10" onClick={onClose} aria-hidden="true" />

        <div className={`relative w-full ${aspectClass(project.orientation)} max-h-[72vh] mx-auto overflow-hidden rounded-card bg-black border border-ink-700`}>
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
