import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'grading',
  title: 'Grading (Before / After)',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'category', type: 'string', initialValue: 'Color Grade' }),
    defineField({ name: 'before', title: 'Before (ungraded)', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'after', title: 'After (graded)', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'order', type: 'number', description: 'Lower numbers show first.' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'category', media: 'after' },
  },
});
