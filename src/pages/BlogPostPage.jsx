import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PortableText } from '@portabletext/react';
import SEO from '../components/SEO';
import BlogHeader from '../components/BlogHeader';
import { PostSkeleton } from '../components/Skeleton';
import { fetchPost } from '../sanity/content';

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '';

// Renderers so portable-text matches the site's type scale.
const ptComponents = {
  block: {
    h2: ({ children }) => <h2 className="text-2xl md:text-3xl font-heading font-bold mt-10 mb-3 text-fog-100">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl md:text-2xl font-semibold mt-8 mb-2 text-fog-100">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-accent pl-4 my-6 text-fog-300 italic">{children}</blockquote>
    ),
    normal: ({ children }) => <p className="text-base md:text-lg text-fog-300 leading-relaxed my-4">{children}</p>,
  },
  marks: {
    link: ({ children, value }) => (
      <a href={value?.href} className="text-accent hover:underline" target="_blank" rel="noreferrer">
        {children}
      </a>
    ),
  },
};

function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(undefined); // undefined = loading, null = not found

  useEffect(() => {
    let active = true;
    fetchPost(slug).then((p) => {
      if (active) setPost(p);
    });
    return () => {
      active = false;
    };
  }, [slug]);

  return (
    <div className="min-h-screen bg-ink-900 text-fog-100">
      <BlogHeader />

      {post === undefined ? (
        <PostSkeleton />
      ) : post === null ? (
        <div className="max-w-3xl mx-auto px-5 md:px-8 py-20">
          <SEO title="Not found — Made by Priest" path={`/blog/${slug}`} />
          <h1 className="text-3xl font-heading font-bold">Post not found</h1>
          <Link to="/blog" className="mt-4 inline-block text-accent hover:underline">
            ← Back to the journal
          </Link>
        </div>
      ) : (
        <article className="max-w-3xl mx-auto px-5 md:px-8 py-12 md:py-16">
          <SEO
            title={`${post.title} — Made by Priest`}
            description={post.excerpt}
            image={post.coverImage}
            path={`/blog/${post.slug}`}
            type="article"
          />
          <Link to="/blog" className="text-sm text-fog-500 hover:text-fog-100 transition-colors">
            ← Journal
          </Link>
          <h1 className="mt-4 text-3xl md:text-5xl font-heading font-bold leading-tight">{post.title}</h1>
          <p className="mt-3 text-sm uppercase tracking-wider text-fog-500">{formatDate(post.publishedAt)}</p>

          {post.coverImage && (
            <img
              src={post.coverImage}
              alt=""
              className="mt-8 w-full rounded-card border border-ink-700"
              loading="lazy"
              decoding="async"
            />
          )}

          <div className="mt-8">
            <PortableText value={post.body || []} components={ptComponents} />
          </div>
        </article>
      )}
    </div>
  );
}

export default BlogPostPage;
