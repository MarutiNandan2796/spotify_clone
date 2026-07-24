/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spotify: {
          green: '#8b5cf6', // Aura Wave Violet
          hoverGreen: '#a78bfa', // Lighter violet for hover
          dark: '#0d0b1a', // Translucent deep violet-black
          black: '#05030b', // Deep outer space black
          card: '#151324', // Glassy card base background
          cardHover: '#221f3b', // Hover card background
          lightGray: '#9ca3af', // Warm grey
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
