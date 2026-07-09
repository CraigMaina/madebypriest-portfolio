import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'category', type: 'string', description: 'e.g. Music Video, Commercial, Social Ad' }),
    defineField({
      name: 'type',
      type: 'string',
      options: { list: ['Reel', 'Film', 'Other'], layout: 'radio' },
      initialValue: 'Film',
    }),
    defineField({
      name: 'orientation',
      type: 'string',
      description: 'Portrait 9:16 for reels, Landscape 16:9 for films.',
      options: { list: ['portrait', 'landscape', 'square'], layout: 'radio' },
      initialValue: 'landscape',
    }),
    defineField({ name: 'thumbnail', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'videoUrl', title: 'Video URL', type: 'url', description: 'Hosted reel link (CDN / Vimeo direct / Bunny / Cloudflare Stream).' }),
    defineField({ name: 'order', type: 'number', description: 'Lower numbers show first.' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'category', media: 'thumbnail' },
  },
});
