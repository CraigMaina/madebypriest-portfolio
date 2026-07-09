import React, { useState, useRef, useEffect } from 'react';

// Dark cinematic poster shown before the background video loads (and as the
// permanent backdrop under prefers-reduced-motion). Self-contained, no request.
const VIDEO_POSTER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="9"><defs><radialGradient id="g" cx="50%" cy="0%" r="120%"><stop offset="0" stop-color="#26262B"/><stop offset="0.6" stop-color="#0A0A0B"/></radialGradient></defs><rect width="16" height="9" fill="url(#g)"/></svg>`
  );

// Formspree endpoint is configured via env (see .env.example). Never hard-code
// the real ID. If it is unset the form fails gracefully with a clear message
// instead of silently POSTing to a dead placeholder endpoint.
const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID;
const FORMSPREE_ENDPOINT = FORMSPREE_ID ? `https://formspree.io/f/${FORMSPREE_ID}` : null;

// Intentional, self-contained profile placeholder (no external network call)
// until a real /images/profile.jpg is supplied.
const PROFILE_FALLBACK =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#1A1A1D"/><text x="50%" y="50%" fill="#E6B450" font-family="sans-serif" font-size="64" font-weight="700" text-anchor="middle" dominant-baseline="middle">MP</text></svg>`
  );

const ContactForm = ({ referralProject }) => {
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('');

  // Only load/decode the full-screen background video on capable, motion-tolerant
  // devices, and only once the section is near the viewport (IntersectionObserver).
  const sectionRef = useRef(null);
  const [loadVideo, setLoadVideo] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const rm = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (rm) {
      setReducedMotion(true);
      return; // never fetch the video
    }
    const el = sectionRef.current;
    if (!el || !('IntersectionObserver' in window)) {
      setLoadVideo(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setLoadVideo(true);
          obs.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!FORMSPREE_ENDPOINT) {
      setStatus('error');
      setErrorMsg('The contact form isn’t connected yet. Please email hello@madebypriest.com directly.');
      return;
    }

    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        setStatus('success');
        form.reset();
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus('error');
        setErrorMsg(data?.errors?.[0]?.message || 'Something went wrong sending your message. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Network error — please check your connection and try again.');
    }
  };

  const isSubmitting = status === 'submitting';

  return (
    <div ref={sectionRef} id="contact" className="relative w-full min-h-screen overflow-hidden flex items-center justify-center p-8 md:p-16">

      {/* --- 1. Video Background (lazy; static poster under reduced-motion) --- */}
      {reducedMotion ? (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
          style={{ backgroundImage: `url("${VIDEO_POSTER}")` }}
        />
      ) : (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          poster={VIDEO_POSTER}
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          {loadVideo && <source src="/contact-bg.webm" type="video/webm" />}
          Your browser does not support the video tag.
        </video>
      )}

      {/* --- 2. Dark Overlay --- */}
      <div className="absolute inset-0 bg-ink-900/80 z-10" />

      <div className="relative z-20 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">

        {/* --- COLUMN 1: The "About" Copy --- */}
        <div className="text-white space-y-6">
          <img
            src="/images/profile.jpg"
            alt="Portrait of Priest, cinematic video editor"
            width="128"
            height="128"
            loading="lazy"
            decoding="async"
            className="w-32 h-32 rounded-full object-cover border-2 border-white/20 mb-4"
            onError={(e) => { e.target.src = PROFILE_FALLBACK; }}
          />

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold font-heading leading-tight">
            Don't just look good.<br/>
            <span className="text-fog-500">Connect.</span>
          </h2>

          <p className="text-base md:text-lg text-fog-300 leading-relaxed">
            My specialty is cinematic, high-end editing that makes your brand feel bigger, sharper, and more magnetic. From campaign reels to full-length films, I shape every frame to tell a story people actually want to watch — and remember.
          </p>

          <p className="text-base md:text-lg text-fog-300 leading-relaxed font-medium border-l-2 border-accent pl-4">
            Fast, collaborative, premium editing that feels effortless for you — and unforgettable for your audience.
          </p>
        </div>

        {/* --- COLUMN 2: Contact Form --- */}
        <div className="w-full bg-white/5 p-8 rounded-card backdrop-blur-sm border border-white/10">
          {status === 'success' ? (
            <div className="text-center py-8" role="status" aria-live="polite">
              <h3 className="text-2xl font-bold text-fog-100 mb-2">Message sent.</h3>
              <p className="text-fog-300">
                Thanks{referralProject ? ` for the note about ${referralProject}` : ''} — I’ll be in touch within one business day.
              </p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="mt-6 px-6 py-3 bg-accent text-ink-900 font-bold rounded-full hover:bg-accent-hover transition-colors"
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <input
                type="hidden"
                name="Interested In Project"
                value={referralProject || 'General Inquiry'}
              />

              {referralProject && (
                <div className="text-accent text-sm font-medium">
                  Inquiring about: {referralProject}
                </div>
              )}

              <div>
                <label htmlFor="name" className="sr-only">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Your name"
                  required
                  disabled={isSubmitting}
                  className="w-full p-4 bg-transparent border-b border-ink-500 text-fog-100 placeholder-fog-500 focus:border-accent transition-colors disabled:opacity-50"
                />
              </div>

              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="you@brand.com"
                  required
                  disabled={isSubmitting}
                  className="w-full p-4 bg-transparent border-b border-ink-500 text-fog-100 placeholder-fog-500 focus:border-accent transition-colors disabled:opacity-50"
                />
              </div>

              <div>
                <label htmlFor="message" className="sr-only">Message</label>
                <textarea
                  name="message"
                  id="message"
                  rows="4"
                  placeholder={referralProject ? `I loved your work on ${referralProject} — here's what I have in mind…` : "Tell me about your project…"}
                  required
                  disabled={isSubmitting}
                  className="w-full p-4 bg-transparent border-b border-ink-500 text-fog-100 placeholder-fog-500 focus:border-accent transition-colors disabled:opacity-50"
                />
              </div>

              {status === 'error' && (
                <p className="text-red-400 text-sm" role="alert">
                  {errorMsg}
                </p>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-4 bg-accent text-ink-900 font-bold rounded-full hover:bg-accent-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending…' : 'Send Message'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
