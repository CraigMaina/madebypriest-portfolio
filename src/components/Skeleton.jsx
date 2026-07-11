// Shimmer primitive. Compose with size/rounding utilities.
export const Skeleton = ({ className = '' }) => (
  <div className={`skeleton rounded-md ${className}`} aria-hidden="true" />
);

// Suspense fallback for the lazy routes (journal / post / studio). Mirrors the
// blog list layout so the swap-in doesn't jump.
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-ink-900" aria-busy="true" aria-label="Loading">
      <div className="h-16 border-b border-ink-700/60" />
      <div className="max-w-5xl mx-auto px-5 md:px-8 py-12 md:py-20">
        <Skeleton className="h-10 w-56 md:h-14 md:w-72" />
        <Skeleton className="mt-4 h-4 w-80 max-w-full" />
        <div className="mt-10 md:mt-14 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-card overflow-hidden border border-ink-700 bg-ink-800">
              <Skeleton className="aspect-video w-full rounded-none" />
              <div className="p-5 md:p-6">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="mt-3 h-5 w-3/4" />
                <Skeleton className="mt-3 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Loading state for a single journal post.
export function PostSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-5 md:px-8 py-12 md:py-16" aria-busy="true" aria-label="Loading post">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="mt-4 h-9 w-11/12 md:h-12" />
      <Skeleton className="mt-3 h-9 w-2/3 md:h-12" />
      <Skeleton className="mt-5 h-3 w-28" />
      <Skeleton className="mt-8 aspect-video w-full rounded-card" />
      <div className="mt-8 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className={`h-4 ${i % 3 === 2 ? 'w-2/3' : 'w-full'}`} />
        ))}
      </div>
    </div>
  );
}
