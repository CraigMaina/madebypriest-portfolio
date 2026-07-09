import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    dedupe: ['react', 'react-dom'],
  },

  build: {
    // Don't inject <link rel="modulepreload"> for the heavy async vendor chunks —
    // otherwise the browser would prefetch three.js on initial load (incl. mobile),
    // defeating the code-split. They load only when the Dither hero is imported.
    modulePreload: false,
    rollupOptions: {
      output: {
        // Split heavy vendors into their own chunks. three / r3f / postprocessing
        // are only pulled in by the lazily-imported Dither hero, so these chunks
        // stay out of the initial payload and load on demand (desktop only).
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/postprocessing', 'postprocessing'],
          gsap: ['gsap'],
        },
      },
    },
  },
})
