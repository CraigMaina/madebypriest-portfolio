// Self-contained, intentional placeholders (no external network calls) used
// until real assets / CMS images are supplied.

const svg = (markup) => 'data:image/svg+xml;utf8,' + encodeURIComponent(markup);

export const FALLBACK_THUMB = svg(
  `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800"><rect width="600" height="800" fill="#111113"/><text x="50%" y="50%" fill="#8A8A90" font-family="sans-serif" font-size="24" text-anchor="middle" dominant-baseline="middle">Made by Priest</text></svg>`
);

export const PROFILE_FALLBACK = svg(
  `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#1A1A1D"/><text x="50%" y="50%" fill="#E6B450" font-family="sans-serif" font-size="64" font-weight="700" text-anchor="middle" dominant-baseline="middle">MP</text></svg>`
);

export const VIDEO_POSTER = svg(
  `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="9"><defs><radialGradient id="g" cx="50%" cy="0%" r="120%"><stop offset="0" stop-color="#26262B"/><stop offset="0.6" stop-color="#0A0A0B"/></radialGradient></defs><rect width="16" height="9" fill="url(#g)"/></svg>`
);

const gradingSvg = (label, from, to) =>
  svg(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="800" height="450" fill="url(#g)"/><text x="50%" y="50%" fill="#F5F5F7" font-family="sans-serif" font-size="28" font-weight="700" letter-spacing="4" text-anchor="middle" dominant-baseline="middle">${label}</text></svg>`
  );

export const BEFORE_FALLBACK = gradingSvg('BEFORE', '#3a3a3d', '#101012');
export const AFTER_FALLBACK = gradingSvg('AFTER', '#E6B450', '#1A1A1D');

export const COVER_FALLBACK = svg(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1A1A1D"/><stop offset="1" stop-color="#0A0A0B"/></linearGradient></defs><rect width="1200" height="675" fill="url(#g)"/><text x="50%" y="50%" fill="#E6B450" font-family="sans-serif" font-size="42" font-weight="700" letter-spacing="2" text-anchor="middle" dominant-baseline="middle">Made by Priest</text></svg>`
);
