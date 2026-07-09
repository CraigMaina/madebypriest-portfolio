import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './src/sanity/schemas';

// Embedded Studio config, consumed by src/pages/StudioPage.jsx and served at
// /studio. projectId/dataset come from Vite env (see setup.md). A placeholder
// keeps the build green before credentials exist; the route is env-guarded.
const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'placeholder';
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';

export default defineConfig({
  name: 'made-by-priest',
  title: 'Made by Priest',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
});
