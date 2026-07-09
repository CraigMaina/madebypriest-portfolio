import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'project', title: 'Project / Role', type: 'string' }),
    defineField({ name: 'quote', type: 'text', rows: 4, validation: (r) => r.required() }),
    defineField({ name: 'order', type: 'number', description: 'Lower numbers show first.' }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'project' },
  },
});
