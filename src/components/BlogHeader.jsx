import { Link } from 'react-router-dom';

// Minimal persistent header for the journal pages (the home page has its own nav).
function BlogHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink-700 bg-ink-900/80 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
        <Link to="/" className="font-heading font-bold text-fog-100 hover:text-accent transition-colors">
          Made by Priest
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link to="/blog" className="text-fog-300 hover:text-fog-100 transition-colors">
            Journal
          </Link>
          <Link
            to="/#contact"
            className="px-4 py-2 rounded-full bg-accent text-ink-900 font-semibold hover:bg-accent-hover transition-colors"
          >
            Start a Project
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default BlogHeader;
