import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { DURATION, EASE } from './tokens';

let initialized = false;

// Register plugins exactly once and apply token-based GSAP defaults. Every module
// imports gsap/ScrollTrigger/Flip from here so there is a single registration
// site and a single source of default timing. (ScrollTrigger + Flip ship with
// the free gsap package — no extra dependency.)
export function initGsap() {
  if (initialized || typeof window === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger, Flip);
  gsap.defaults({ ease: EASE.entrance, duration: DURATION.slow });
  initialized = true;
}

// Self-initialize at module load (client only). React runs child effects before
// parent effects, so relying on MotionProvider's effect alone would let a child's
// useReveal/ScrollTrigger run before the plugin is registered. Importing this
// module happens before any render, so this guarantees registration first.
initGsap();

export { gsap, ScrollTrigger, Flip };
