/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      // --- Design system tokens (docs/DESIGN-SYSTEM.md) ---
      colors: {
        ink: {
          900: '#0A0A0B', // page background (near-black, softer than #000)
          800: '#111113', // raised surfaces / cards
          700: '#1A1A1D', // nav card 1 / borders-on-dark
          600: '#26262B', // nav card 2 / hover surfaces
          500: '#33333A', // nav card 3 / dividers
        },
        fog: {
          100: '#F5F5F7', // primary text on dark
          300: '#C7C7CC', // secondary / body text
          500: '#8A8A90', // muted / captions
        },
        accent: {
          DEFAULT: '#E6B450', // signature amber — CTAs, highlights, focus
          hover: '#F0C46B',
          muted: '#7A6636',
        },
      },
      borderRadius: {
        // standardized card radius token
        card: '1rem', // == rounded-2xl
      },
      boxShadow: {
        // single elevation token for cards/surfaces
        card: '0 10px 30px -12px rgba(0, 0, 0, 0.7)',
      },
    },
  },
  plugins: [],
}
