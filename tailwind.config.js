/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        token: {
          base: 'var(--bg-base)',
          panel: 'var(--bg-panel)',
          elevated: 'var(--bg-elevated)',
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          soft: 'var(--border-soft)',
          strong: 'var(--border-strong)',
        },
        accent: 'var(--accent-primary)',
      },
      boxShadow: {
        'glow-subtle': 'var(--glow-subtle)',
        'glow-active': 'var(--glow-active)',
      },
    },
  },
  plugins: [],
};
