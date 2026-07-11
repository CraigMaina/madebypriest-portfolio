import { useEffect, useState } from 'react';
import { sanityClient, imageUrl } from './client';
import {
  fallbackProjects,
  fallbackGradings,
  fallbackTestimonials,
  fallbackPosts,
} from '../data/content';
import {
  FALLBACK_THUMB,
  BEFORE_FALLBACK,
  AFTER_FALLBACK,
  COVER_FALLBACK,
} from '../data/placeholders';

// GROQ queries + mappers that normalize Sanity docs into the same shape as the
// local fallback content.
const collections = {
  projects: {
    query: `*[_type=="project"]|order(coalesce(order,999) asc){title,category,audience,type,orientation,thumbnail,videoUrl}`,
    map: (rows) =>
      rows.map((r) => ({
        title: r.title,
        category: r.category,
        audience: r.audience || 'Brand Films',
        type: r.type || 'Film',
        orientation: r.orientation || 'landscape',
        thumbnail: imageUrl(r.thumbnail, 800) || FALLBACK_THUMB,
        videoUrl: r.videoUrl || '',
      })),
    fallback: fallbackProjects,
  },
  gradings: {
    query: `*[_type=="grading"]|order(coalesce(order,999) asc){title,category,before,after}`,
    map: (rows) =>
      rows.map((r) => ({
        title: r.title,
        category: r.category || 'Color Grade',
        before: imageUrl(r.before, 800) || BEFORE_FALLBACK,
        after: imageUrl(r.after, 800) || AFTER_FALLBACK,
      })),
    fallback: fallbackGradings,
  },
  testimonials: {
    query: `*[_type=="testimonial"]|order(coalesce(order,999) asc){name,project,quote}`,
    map: (rows) =>
      rows.map((r) => ({ name: r.name, project: r.project, quote: r.quote })),
    fallback: fallbackTestimonials,
  },
  posts: {
    query: `*[_type=="post"]|order(publishedAt desc){title,"slug":slug.current,excerpt,coverImage,publishedAt}`,
    map: (rows) =>
      rows.map((r) => ({
        title: r.title,
        slug: r.slug,
        excerpt: r.excerpt || '',
        coverImage: imageUrl(r.coverImage, 1200) || COVER_FALLBACK,
        publishedAt: r.publishedAt,
      })),
    fallback: fallbackPosts,
  },
};

// Returns fallback immediately, then swaps in live Sanity content if configured.
export function useContent(type) {
  const [data, setData] = useState(collections[type].fallback);

  useEffect(() => {
    if (!sanityClient) return;
    let active = true;
    const { query, map } = collections[type];
    sanityClient
      .fetch(query)
      .then((rows) => {
        if (active && Array.isArray(rows) && rows.length) setData(map(rows));
      })
      .catch(() => {
        /* keep fallback on error */
      });
    return () => {
      active = false;
    };
  }, [type]);

  return data;
}

// Single post by slug (for the post page). Resolves the cover + portable-text body.
export async function fetchPost(slug) {
  if (sanityClient) {
    try {
      const row = await sanityClient.fetch(
        `*[_type=="post" && slug.current==$slug][0]{title,"slug":slug.current,excerpt,coverImage,publishedAt,body}`,
        { slug }
      );
      if (row) {
        return {
          ...row,
          coverImage: imageUrl(row.coverImage, 1600) || COVER_FALLBACK,
        };
      }
    } catch {
      /* fall through to fallback */
    }
  }
  return fallbackPosts.find((p) => p.slug === slug) || null;
}
