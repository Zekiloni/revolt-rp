const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');
import PrimeUI from 'tailwindcss-primeui';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          0: 'rgb(from var(--p-surface-0) r g b / <alpha-value>)',
          50: 'rgb(from var(--p-surface-50) r g b / <alpha-value>)',
          100: 'rgb(from var(--p-surface-100) r g b / <alpha-value>)',
          200: 'rgb(from var(--p-surface-200) r g b / <alpha-value>)',
          300: 'rgb(from var(--p-surface-300) r g b / <alpha-value>)',
          400: 'rgb(from var(--p-surface-400) r g b / <alpha-value>)',
          500: 'rgb(from var(--p-surface-500) r g b / <alpha-value>)',
          600: 'rgb(from var(--p-surface-600) r g b / <alpha-value>)',
          700: 'rgb(from var(--p-surface-700) r g b / <alpha-value>)',
          800: 'rgb(from var(--p-surface-800) r g b / <alpha-value>)',
          900: 'rgb(from var(--p-surface-900) r g b / <alpha-value>)',
          950: 'rgb(from var(--p-surface-950) r g b / <alpha-value>)',
        },
      }
    }
  },
  darkMode: ['selector', '[class~="app-dark"]'],
  plugins: [PrimeUI],
};
