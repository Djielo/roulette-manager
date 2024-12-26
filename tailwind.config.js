/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'roulette-navy': '#1a1f3c',
        'roulette-gold': '#ffd700',
        'roulette-roi': '#191e28',
        'roulette-green': '#14532d',
        'roulette-red': '#7f1d1d',
        'roulette-black': '#0f172a',
        'roulette-text-green': '#14532d',      
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
    require('@tailwindcss/forms'),
  ],
}

