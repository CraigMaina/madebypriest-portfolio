// Public surface of the motion module.
export { DURATION, EASE, CSS_EASE, STAGGER } from './tokens';
export { gsap, ScrollTrigger, Flip, initGsap } from './gsap';
export { prefersReducedMotion, useReducedMotion } from './reducedMotion';
export { default as MotionProvider } from './MotionProvider';
export { useReveal } from './useReveal';
export { useParallax } from './useParallax';
export { useMagnetic } from './useMagnetic';
export { lockScroll, unlockScroll, scrollToTop } from './scrollLock';
