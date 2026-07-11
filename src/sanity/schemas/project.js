import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'category', type: 'string', description: 'e.g. Music Video, Commercial, Social Ad' }),
    defineField({
      name: 'audience',
      type: 'string',
      description: 'Which audience filter this project appears under on the site.',
      options: {
        list: ['Ads & Commercial', 'Lifestyle & Social', 'Music Videos', 'Brand Films'],
        layout: 'radio',
      },
      initialValue: 'Brand Films',
    }),
    defineField({
      name: 'type',
      type: 'string',
      description: 'Reel = vertical/social, Widescreen = horizontal 16:9.',
      options: { list: ['Reel', 'Widescreen', 'Other'], layout: 'radio' },
      initialValue: 'Widescreen',
    }),
    defineField({
      name: 'orientation',
      type: 'string',
      description: 'Portrait 9:16 for reels, Landscape 16:9 for films.',
      options: { list: ['portrait', 'landscape', 'square'], layout: 'radio' },
      initialValue: 'landscape',
    }),
    defineField({ name: 'duration', type: 'string', description: 'Clip length as a timecode, e.g. 0:48 — shown as a badge on the card.' }),
    defineField({ name: 'result', type: 'string', description: 'One-line outcome/stat, e.g. "3.1M views in two weeks" — shown on the featured card.' }),
    defineField({ name: 'thumbnail', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'videoUrl', title: 'Video URL', type: 'url', description: 'Hosted reel link (CDN / Vimeo direct / Bunny / Cloudflare Stream).' }),
    defineField({ name: 'order', type: 'number', description: 'Lower numbers show first.' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'category', media: 'thumbnail' },
  },
});
