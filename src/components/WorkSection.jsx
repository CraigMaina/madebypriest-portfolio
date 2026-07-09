import React, { useState } from 'react';
import { GoArrowRight, GoX } from 'react-icons/go'; // Using icons for the buttons

// --- 1. Project Data ---
// Thumbnails live in /public/images/. Reels (optional) go in /public/videos/;
// until a reel exists the preview modal shows the thumbnail + "coming soon".
// Intentional local fallback if a thumbnail itself is missing (no external calls).
const FALLBACK_THUMB =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="600" height="400" fill="#111113"/><text x="50%" y="50%" fill="#8A8A90" font-family="sans-serif" font-size="20" text-anchor="middle" dominant-baseline="middle">Made by Priest</text></svg>`
  );

const projects = [
  {
    title: 'Cosmic Bloom',
    thumbnail: '/images/thumb_cosmic_bloom.jpg',
    videoUrl: '/videos/cosmic_bloom.webm',
    category: 'Generative Art',
  },
  {
    title: 'Speed Meteor',
    thumbnail: '/images/thumb_speed_meteor.jpg',
    videoUrl: '/videos/speed_meteor.webm',
    category: 'VFX',
  },
  {
    title: 'Plasma',
    thumbnail: '/images/thumb_plasma.jpg',
    videoUrl: '/videos/plasma.webm',
    category: 'Music Video',
  },
  {
    title: 'Fire',
    thumbnail: '/images/thumb_fire.jpg',
    videoUrl: '/videos/fire.webm',
    category: 'Commercial',
  },
  {
    title: 'Grid Wave',
    thumbnail: '/images/thumb_grid_wave.jpg',
    videoUrl: '/videos/grid_wave.webm',
    category: 'VFX',
  },
  {
    title: 'Chromatic',
    thumbnail: '/images/thumb_chromatic.jpg',
    videoUrl: '/videos/chromatic.webm',
    category: 'Generative Art',
  },
  {
    title: 'Smoke',
    thumbnail: '/images/thumb_smoke.jpg',
    videoUrl: '/videos/smoke.webm',
    category: 'Commercial',
  },
  {
    title: 'Aura',
    thumbnail: '/images/thumb_aura.jpg',
    videoUrl: '/videos/aura.webm',
    category: 'Music Video',
  },
];

// --- 2. The Main WorkSection Component ---
const WorkSection = ({ setReferralProject }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const isModalOpen = Boolean(selectedProject);

  const openModal = (project) => {
    setSelectedProject(project);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  // Personalize the contact form with the project the visitor came from.
  const handleBookCall = (title) => {
    setReferralProject?.(title);
  };

  return (
    <div id="work" className="min-h-screen p-8 md:p-16 bg-black">
      <h2 className="text-5xl md:text-7xl font-bold mb-12 text-white">
        Selected Works
      </h2>

      {/* --- Project Grid --- */}
      {/* This grid stacks on mobile (grid-cols-1) and expands on larger screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {projects.map((project) => (
          <ProjectCard
            key={project.title}
            project={project}
            onPreviewClick={openModal}
            onBookCall={handleBookCall}
          />
        ))}
      </div>

      {/* --- Video Modal --- */}
      {isModalOpen && (
        <VideoModal project={selectedProject} onClose={closeModal} />
      )}
    </div>
  );
};

// --- 3. ProjectCard Sub-Component ---
const ProjectCard = ({ project, onPreviewClick, onBookCall }) => {
  return (
    <div className="bg-gray-950 rounded-lg overflow-hidden group">
      {/* Thumbnail */}
      <div className="relative w-full h-48">
        <img
          src={project.thumbnail}
          alt={`${project.title} — ${project.category} project thumbnail`}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = FALLBACK_THUMB; }}
        />
        {/* Play icon overlay */}
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onPreviewClick(project)}
            className="text-white text-5xl"
            aria-label={`Preview ${project.title}`}
          >
            ▶
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 text-white">
        <h3 className="text-xl font-semibold">{project.title}</h3>
        <p className="text-gray-400 text-sm">{project.category}</p>

        {/* Button Container */}
        <div className="flex gap-2 mt-4">
          {/* Preview Button */}
          <button
            onClick={() => onPreviewClick(project)}
            className="flex-1 px-4 py-2 text-sm bg-gray-800 rounded-md hover:bg-gray-700 transition-colors"
          >
            Preview
          </button>

          {/* CTA Button — carries the project title into the contact form */}
          <a
            href="#contact"
            onClick={() => onBookCall?.(project.title)}
            className="flex-1 px-4 py-2 text-sm text-center bg-white text-black font-medium rounded-md hover:scale-105 transition-transform"
          >
            Book a Call
          </a>
        </div>
      </div>
    </div>
  );
};

// --- 4. VideoModal Sub-Component ---
const VideoModal = ({ project, onClose }) => {
  // Reels are supplied later; until the file exists the <video> 404s. Rather
  // than a dead black player we fall back to the thumbnail poster + a clear
  // "coming soon" state. When a real /videos/ file lands, it just plays.
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    // Full-screen overlay
    <div className="fixed inset-0 bg-black/80 z-[999] flex items-center justify-center p-4">

      {/* Close button (top right) */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-3xl z-[1001]"
        aria-label="Close preview"
      >
        <GoX />
      </button>

      {/* Video Player */}
      <div className="relative w-full max-w-4xl">
        {/* Click-away backdrop */}
        <div
          className="absolute inset-0 -m-4"
          onClick={onClose}
        />

        {/* Aspect ratio container for the video */}
        <div className="relative w-full aspect-video z-[1000] overflow-hidden rounded-lg bg-black">
          {videoFailed ? (
            <div
              className="w-full h-full flex flex-col items-center justify-center bg-center bg-cover"
              style={{ backgroundImage: `url(${project.thumbnail})` }}
            >
              <div className="absolute inset-0 bg-black/70" />
              <div className="relative text-center px-6">
                <h3 className="text-2xl md:text-3xl font-bold text-white">{project.title}</h3>
                <p className="mt-2 text-gray-300">Full reel coming soon.</p>
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
      </div>
    </div>
  );
};

export default WorkSection;