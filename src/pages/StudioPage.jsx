import { Studio } from 'sanity';
import config from '../../sanity.config';

// Embedded Sanity Studio. The whole `sanity` package lives in this lazily-loaded
// chunk so it never touches the main site bundle.
export default function StudioPage() {
  if (!import.meta.env.VITE_SANITY_PROJECT_ID) {
    return (
      <div className="min-h-screen bg-ink-900 text-fog-300 flex items-center justify-center p-8 text-center">
        <div className="max-w-md">
          <h1 className="text-2xl font-heading font-bold text-fog-100 mb-3">Studio not configured</h1>
          <p>
            Set <code className="text-accent">VITE_SANITY_PROJECT_ID</code> (and{' '}
            <code className="text-accent">VITE_SANITY_DATASET</code>) in your environment to enable the
            content Studio. See <code>setup.md</code>.
          </p>
        </div>
      </div>
    );
  }
  return <Studio config={config} />;
}
