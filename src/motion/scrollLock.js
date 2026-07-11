// Bridge so modals can pause/resume Lenis without threading context through the
// tree. Counter-based so nested locks (modal opened over another) resolve
// correctly. No-ops when Lenis is inactive (reduced-motion) — in that case the
// modals still lock the page via body overflow.
let lenis = null;
let locks = 0;

export function _bindLenis(instance) {
  lenis = instance;
}

export function lockScroll() {
  locks += 1;
  lenis?.stop();
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks === 0) lenis?.start();
}

// Jump to the top of the page (used on route change). Uses Lenis when active so
// its internal scroll position stays in sync; falls back to native scroll.
export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true });
  else if (typeof window !== 'undefined') window.scrollTo(0, 0);
}
