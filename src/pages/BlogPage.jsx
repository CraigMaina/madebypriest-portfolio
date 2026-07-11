import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import BlogHeader from '../components/BlogHeader';
import { useContent } from '../sanity/content';

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '';

function BlogPage() {
  const posts = useContent('posts');

  return (
    <div className="min-h-screen bg-ink-900 text-fog-100">
      <SEO
        title="Journal — Made by Priest"
        description="Notes on cinematic editing, color grading, and making video that stops the scroll."
        path="/blog"
      />
      <BlogHeader />

      <main className="max-w-5xl mx-auto px-5 md:px-8 py-12 md:py-20">
        <header className="mb-10 md:mb-14">
          <h1 className="text-4xl md:text-6xl font-heading font-bold">Journal</h1>
          <p className="mt-3 text-base md:text-lg text-fog-300 max-w-2xl">
            Craft notes on editing, color, and making video people remember.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group block rounded-card overflow-hidden border border-ink-700 bg-ink-800 shadow-card transition duration-300 hover:-translate-y-1 hover:border-accent/50 active:scale-[0.98]"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.coverImage}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
              <div className="p-5 md:p-6">
                <p className="text-xs uppercase tracking-wider text-fog-500">{formatDate(post.publishedAt)}</p>
                <h2 className="mt-2 text-lg md:text-xl font-semibold text-fog-100 group-hover:text-accent transition-colors">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm md:text-base text-fog-300 line-clamp-3">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

export default BlogPage;
