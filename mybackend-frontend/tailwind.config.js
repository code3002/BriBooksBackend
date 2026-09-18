/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: 'var(--color-primary)', hover: 'var(--color-primary-hover)' },
        secondary: { DEFAULT: 'var(--color-coral)', hover: 'var(--color-coral)' },
        accent: { DEFAULT: 'var(--color-pear)', hover: 'var(--color-pear)' },
        background: 'var(--color-paper)',
        ink: 'var(--color-ink)',
      },
      fontFamily: { sans: ['var(--font-body)'], display: ['var(--font-display)'], mono: ['var(--font-mono)'] },
    },
  },
  plugins: [],
};
