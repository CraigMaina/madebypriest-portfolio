import { useState, useEffect, useRef } from 'react';
import { GoX } from 'react-icons/go';
import { FaPlay } from 'react-icons/fa';

// --- 1. Project Data ---
// CMS-ready shape (mirrors the future Sanity `project` schema): title, category,
// type (Reel/Film/...), orientation (portrait/landscape/square), thumbnail, videoUrl.
// Thumbnails live in /public/images/. Reels (optional) go in /public/videos/;
// until a reel exists the preview modal shows the thumbnail + "coming soon".
const FALLBACK_THUMB =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800"><rect width="600" height="800" fill="#111113"/><text x="50%" y="50%" fill="#8A8A90" font-family="sans-serif" font-size="24" text-anchor="middle" dominant-baseline="middle">Made by Priest</text></svg>`
  );

const projects = [
  { title: 'Plasma', category: 'Music Video', type: 'Reel', orientation: 'portrait', thumbnail: '/images/thumb_plasma.jpg', videoUrl: '/videos/plasma.webm' },
  { title: 'Cosmic Bloom', category: 'Generative Art', type: 'Film', orientation: 'landscape', thumbnail: '/images/thumb_cosmic_bloom.jpg', videoUrl: '/videos/cosmic_bloom.webm' },
  { title: 'Grid Wave', category: 'Social Ad', type: 'Reel', orientation: 'portrait', thumbnail: '/images/thumb_grid_wave.jpg', videoUrl: '/videos/grid_wave.webm' },
  { title: 'Fire', category: 'Commercial', type: 'Film', orientation: 'landscape', thumbnail: '/images/thumb_fire.jpg', videoUrl: '/videos/fire.webm' },
  { title: 'Chromatic', category: 'Reel', type: 'Reel', orientation: 'portrait', thumbnail: '/images/thumb_chromatic.jpg', videoUrl: '/videos/chromatic.webm' },
  { title: 'Speed Meteor', category: 'VFX', type: 'Film', orientation: 'landscape', thumbnail: '/images/thumb_speed_meteor.jpg', videoUrl: '/videos/speed_meteor.webm' },
  { title: 'Aura', category: 'Music Video', type: 'Reel', orientation: 'portrait', thumbnail: '/images/thumb_aura.jpg', videoUrl: '/videos/aura.webm' },
  { title: 'Smoke', category: 'Brand Story', type: 'Film', orientation: 'landscape', thumbnail: '/images/thumb_smoke.jpg', videoUrl: '/videos/smoke.webm' },
];

const aspectClass = (orientation) =>
  orientation === 'portrait' ? 'aspect-[9/16]' : orientation === 'square' ? 'aspect-square' : 'aspect-video';

// --- 2. Main Section ---
const WorkSection = ({ setReferralProject }) => {
  const [selectedProject, setSelectedProject] = useState(null);

  const openModal = (project) => setSelectedProject(project);
  const closeModal = () => setSelectedProject(null);

  // Preserve the referral personalization: starting a project from a reel
  // stamps its title into the contact form, then jumps to the form.
  const startProject = (title) => {
    setReferralProject?.(title);
    setSelectedProject(null);
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="work" className="bg-ink-900 px-5 md:px-8 py-16 md:py-24 lg:py-32">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 md:mb-14">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-fog-100">
            Selected Works
          </h2>
          <p className="mt-3 text-base md:text-lg text-fog-300 max-w-2xl">
            Vertical reels that stop the scroll, landscape films that hold the room.
          </p>
        </header>

        {/* Masonry: portrait and landscape tiles interleave naturally via CSS columns. */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 md:gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} onOpen={openModal} />
          ))}
        </div>
      </div>

      {selectedProject && (
        <VideoModal project={selectedProject} onClose={closeModal} onStartProject={startProject} />
      )}
    </section>
  );
};

// --- 3. ProjectCard ---
const ProjectCard = ({ project, onOpen }) => {
  return (
    <button
      type="button"
      onClick={() => onOpen(project)}
      aria-label={`Preview ${project.title} — ${project.category}`}
      className="group relative block w-full mb-5 md:mb-6 break-inside-avoid overflow-hidden rounded-card border border-ink-700 bg-ink-800 text-left"
    >
      <div className={`relative w-full ${aspectClass(project.orientation)}`}>
        <img
          src={project.thumbnail}
          alt={`${project.title} — ${project.category}`}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          onError={(e) => { e.target.src = FALLBACK_THUMB; }}
        />

        {/* Type badge */}
        <span className="absolute top-3 left-3 z-10 text-[11px] font-semibold uppercase tracking-wider bg-ink-900/70 text-fog-100 px-2.5 py-1 rounded-full backdrop-blur-sm">
          {project.type}
        </span>

        {/* Play affordance */}
        <div className="absolute inset-0 flex items-center justify-center bg-ink-900/20 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300">
          <span className="flex items-center justify-center w-14 h-14 rounded-full bg-accent text-ink-900 shadow-card transition-transform duration-300 group-hover:scale-110">
            <FaPlay className="ml-0.5" aria-hidden="true" />
          </span>
        </div>

        {/* Title / category */}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-ink-900 via-ink-900/60 to-transparent">
          <h3 className="text-base md:text-lg font-semibold text-fog-100">{project.title}</h3>
          <p className="text-xs md:text-sm text-fog-300">{project.category}</p>
        </div>
      </div>
    </button>
  );
};

// --- 4. VideoModal ---
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
      className="fixed inset-0 bg-ink-900/90 z-[999] flex items-center justify-center p-4"
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
        {/* Click-away backdrop */}
        <div className="fixed inset-0 -z-10" onClick={onClose} aria-hidden="true" />

        <div className={`relative w-full ${aspectClass(project.orientation)} max-h-[72vh] mx-auto overflow-hidden rounded-card bg-black`}>
          {videoFailed ? (
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

        {/* In-modal conversion — carries the project title into the contact form */}
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
