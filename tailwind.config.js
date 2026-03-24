/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bench: {
          950: '#090d14',
          900: '#101826',
          800: '#182537',
          700: '#22344b',
        },
      },
    },
  },
  plugins: [],
};
