// Motion tokens — the single source of truth for durations and easings.
// Durations are in SECONDS (GSAP units): 150 / 300 / 600 / 900 ms.
export const DURATION = {
  fast: 0.15,
  base: 0.3,
  slow: 0.6,
  entrance: 0.9, // hard cap for entrance choreography
};

// GSAP easing strings.
export const EASE = {
  entrance: 'expo.out', // choreographed entrances / reveals
  move: 'power2.inOut', // position / layout moves (FLIP, sweeps)
  out: 'power3.out', // general ease-out
};

// CSS cubic-bezier equivalents — mirrored in tailwind.config.js as
// `ease-entrance` / `ease-move` so CSS transitions match the GSAP feel.
export const CSS_EASE = {
  entrance: 'cubic-bezier(0.16, 1, 0.3, 1)', // ~= expo.out
  move: 'cubic-bezier(0.65, 0, 0.35, 1)', // ~= power2.inOut
};

// Default stagger step (seconds) for grouped reveals. Kept small so groups read
// as one quick wave, not a slow trickle.
export const STAGGER = 0.06;
