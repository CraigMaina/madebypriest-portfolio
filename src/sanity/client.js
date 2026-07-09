import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2024-01-01';

// Only create a live client when a project is configured. Everything degrades
// to local fallback content when this is null.
export const sanityClient = projectId
  ? createClient({ projectId, dataset, apiVersion, useCdn: true })
  : null;

export const isSanityConfigured = Boolean(sanityClient);

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null;

// Returns a URL string for a Sanity image ref, or null if not resolvable.
export const imageUrl = (source, width) => {
  if (!builder || !source) return null;
  let b = builder.image(source).auto('format');
  if (width) b = b.width(width);
  return b.url();
};
