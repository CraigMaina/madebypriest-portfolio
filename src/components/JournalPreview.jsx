import { Link } from 'react-router-dom';
import { GoArrowRight } from 'react-icons/go';
import { useContent } from '../sanity/content';

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '';

const JournalPreview = () => {
  const posts = useContent('posts').slice(0, 3);
  if (!posts.length) return null;

  return (
    <section id="journal" className="bg-ink-900 px-5 md:px-8 py-16 md:py-24 lg:py-32">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 md:mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-accent text-xs md:text-sm font-semibold uppercase tracking-[0.25em] mb-3">
              Journal
            </p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-fog-100">
              Notes on the craft
            </h2>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-fog-100 font-semibold hover:text-accent transition-colors"
          >
            Read the journal <GoArrowRight aria-hidden="true" />
          </Link>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group block rounded-card overflow-hidden border border-ink-700 bg-ink-800 shadow-card transition duration-300 hover:-translate-y-1 hover:border-accent/50"
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
              <div className="p-5">
                <p className="text-xs uppercase tracking-wider text-fog-500">{formatDate(post.publishedAt)}</p>
                <h3 className="mt-2 text-lg font-semibold text-fog-100 group-hover:text-accent transition-colors">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-fog-300 line-clamp-2">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JournalPreview;
