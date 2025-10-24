const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');
import PrimeUI from 'tailwindcss-primeui';


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname)
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          0: 'rgba(var(--p-surface-0-rgb), <alpha-value>)',
          50: 'rgba(var(--p-surface-50-rgb), <alpha-value>)',
          100: 'rgba(var(--p-surface-100-rgb), <alpha-value>)',
          200: 'rgba(var(--p-surface-200-rgb), <alpha-value>)',
          300: 'rgba(var(--p-surface-300-rgb), <alpha-value>)',
          400: 'rgba(var(--p-surface-400-rgb), <alpha-value>)',
          500: 'rgba(var(--p-surface-500-rgb), <alpha-value>)',
          600: 'rgba(var(--p-surface-600-rgb), <alpha-value>)',
          700: 'rgba(var(--p-surface-700-rgb), <alpha-value>)',
          800: 'rgba(var(--p-surface-800-rgb), <alpha-value>)',
          900: 'rgba(var(--p-surface-900-rgb), <alpha-value>)',
          950: 'rgba(var(--p-surface-950-rgb), <alpha-value>)',
        }
      }
    }
  },
  darkMode: ['selector', '[class~="app-dark"]'],
  plugins: [
    PrimeUI
  ]
};
