// Local fallback content. Shapes mirror the Sanity schemas exactly, so the CMS
// can drop in without touching component code. Used when Sanity is unconfigured
// or a given collection is empty.

export const fallbackProjects = [
  { title: 'Plasma', category: 'Music Video', type: 'Reel', orientation: 'portrait', thumbnail: '/images/thumb_plasma.jpg', videoUrl: '/videos/plasma.webm' },
  { title: 'Cosmic Bloom', category: 'Generative Art', type: 'Widescreen', orientation: 'landscape', thumbnail: '/images/thumb_cosmic_bloom.jpg', videoUrl: '/videos/cosmic_bloom.webm' },
  { title: 'Grid Wave', category: 'Social Ad', type: 'Reel', orientation: 'portrait', thumbnail: '/images/thumb_grid_wave.jpg', videoUrl: '/videos/grid_wave.webm' },
  { title: 'Fire', category: 'Commercial', type: 'Widescreen', orientation: 'landscape', thumbnail: '/images/thumb_fire.jpg', videoUrl: '/videos/fire.webm' },
  { title: 'Chromatic', category: 'Reel', type: 'Reel', orientation: 'portrait', thumbnail: '/images/thumb_chromatic.jpg', videoUrl: '/videos/chromatic.webm' },
  { title: 'Speed Meteor', category: 'VFX', type: 'Widescreen', orientation: 'landscape', thumbnail: '/images/thumb_speed_meteor.jpg', videoUrl: '/videos/speed_meteor.webm' },
  { title: 'Aura', category: 'Music Video', type: 'Reel', orientation: 'portrait', thumbnail: '/images/thumb_aura.jpg', videoUrl: '/videos/aura.webm' },
  { title: 'Smoke', category: 'Brand Story', type: 'Widescreen', orientation: 'landscape', thumbnail: '/images/thumb_smoke.jpg', videoUrl: '/videos/smoke.webm' },
];

export const fallbackGradings = [
  { title: 'Music Video', category: 'Color Grade', before: '/images/grading-before-1.jpg', after: '/images/grading-after-1.jpg' },
  { title: 'Commercial', category: 'Color Grade', before: '/images/grading-before-2.jpg', after: '/images/grading-after-2.jpg' },
];

export const fallbackTestimonials = [
  { name: 'Aura Records', project: 'Music Video', quote: "Priest didn't just film a video, he created a world. The final color grade was beyond anything we expected." },
  { name: 'Jane & Mike', project: 'Wedding Film', quote: 'We cry every time we watch it. He captured the magic of our day perfectly. Truly a professional.' },
  { name: 'Nomad Coffee Co.', project: 'Brand Commercial', quote: 'Fast turnaround, incredible eye for detail, and a pleasure to work with. Will be hiring again 100%.' },
  { name: 'Studio XYZ', project: 'VFX Collaboration', quote: 'A master of his craft. The technical skill and artistic vision are unmatched. Made our project 10x better.' },
];

// Portable-text helpers so fallback posts render through the same <PortableText>
// path as Sanity content.
let k = 0;
const key = () => `fk${k++}`;
const block = (text, style = 'normal') => ({
  _type: 'block',
  _key: key(),
  style,
  markDefs: [],
  children: [{ _type: 'span', _key: key(), text, marks: [] }],
});

export const fallbackPosts = [
  {
    title: 'Why Vertical Video Wins Attention',
    slug: 'vertical-video-wins-attention',
    excerpt: 'Portrait isn’t a compromise — it’s the format your audience already lives in. Here’s how to edit for the scroll.',
    coverImage: null,
    publishedAt: '2026-05-02',
    body: [
      block('Why Vertical Video Wins Attention', 'h2'),
      block('Most feeds are vertical, thumb-driven, and merciless. A film cut for a cinema won’t hold there. Editing for the scroll means front-loading the hook, cutting on motion, and letting the first second do the selling.'),
      block('Pacing for the thumb', 'h2'),
      block('The first frame is the thumbnail; the first second is the trailer. If the story isn’t moving by then, the viewer already is. Build the edit backwards from the payoff.'),
    ],
  },
  {
    title: 'The Grade Is the Story',
    slug: 'the-grade-is-the-story',
    excerpt: 'Color grading is not a filter you add at the end — it’s the emotional grammar of the whole piece.',
    coverImage: null,
    publishedAt: '2026-06-18',
    body: [
      block('The Grade Is the Story', 'h2'),
      block('Two identical cuts can feel like different films after the grade. Temperature, contrast, and skin tones tell the audience how to feel before a single word lands.'),
      block('Consistency over flash', 'h2'),
      block('A memorable look is a consistent one. Pick a palette, commit to it across every shot, and let restraint do the heavy lifting.'),
    ],
  },
];
