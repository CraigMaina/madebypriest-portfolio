import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { BookingProvider } from './components/BookingProvider';
import HomePage from './pages/HomePage';

// Journal routes are code-split so the home landing stays lean.
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));

const RouteFallback = () => (
  <div className="min-h-screen bg-ink-900 text-fog-500 flex items-center justify-center">Loading…</div>
);

function App() {
  return (
    <BookingProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/blog"
          element={
            <Suspense fallback={<RouteFallback />}>
              <BlogPage />
            </Suspense>
          }
        />
        <Route
          path="/blog/:slug"
          element={
            <Suspense fallback={<RouteFallback />}>
              <BlogPostPage />
            </Suspense>
          }
        />
      </Routes>
    </BookingProvider>
  );
}

export default App;
