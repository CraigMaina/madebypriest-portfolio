import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { BookingProvider } from './components/BookingProvider';
import { MotionProvider } from './motion';
import CustomCursor from './components/CustomCursor';
import ScrollToTop from './components/ScrollToTop';
import PageTransition from './components/PageTransition';
import { PageSkeleton } from './components/Skeleton';
import HomePage from './pages/HomePage';

// Journal + Studio routes are code-split so the home landing stays lean
// (the whole Sanity Studio ships in its own chunk).
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const StudioPage = lazy(() => import('./pages/StudioPage'));

function App() {
  return (
    <MotionProvider>
      <CustomCursor />
      <ScrollToTop />
      <BookingProvider>
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/blog"
          element={
            <Suspense fallback={<PageSkeleton />}>
              <PageTransition>
                <BlogPage />
              </PageTransition>
            </Suspense>
          }
        />
        <Route
          path="/blog/:slug"
          element={
            <Suspense fallback={<PageSkeleton />}>
              <PageTransition>
                <BlogPostPage />
              </PageTransition>
            </Suspense>
          }
        />
        <Route
          path="/studio/*"
          element={
            <Suspense fallback={<PageSkeleton />}>
              <StudioPage />
            </Suspense>
          }
        />
        </Routes>
      </BookingProvider>
    </MotionProvider>
  );
}

export default App;
