import Aura from '@primeng/themes/aura';
import { definePreset } from '@primeng/themes';

const RevoltPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{amber.50}',
      100: '{amber.100}',
      200: '{amber.200}',
      300: '{amber.300}',
      400: '{amber.400}',
      500: '{amber.500}',
      600: '{amber.600}',
      700: '{amber.700}',
      800: '{amber.800}',
      900: '{amber.900}',
      950: '{amber.950}'
    },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '{zinc.50}',
          100: '{zinc.100}',
          200: '{zinc.200}',
          300: '{zinc.300}',
          400: '{zinc.400}',
          500: '{zinc.500}',
          600: '{zinc.600}',
          700: '{zinc.700}',
          800: '{zinc.800}',
          900: '{zinc.900}',
          950: '{zinc.950}'
        }
      },
      dark: {
        surface: {
          0: '#ffffff',
          50: '#f3f4f6',
          100: '#e5e7eb',
          200: '#d1d5db',
          300: '#9ca3af',
          400: '#6b7280',
          500: '#4b5161',
          600: '#333849',
          700: '#252937',
          800: '#1b1f2b',
          900: '#121620',
          950: '#0b0d13'
        },
        ground: {
          0: '#f4f5f7',      // very light background (like slate.50)
          50: '#e7e9ee',     // light neutral tone
          100: '#cfd4dc',    // subtle gray
          200: '#a8b0be',    // cool slate-gray
          300: '#7a8497',    // mid slate tone
          400: '#555d6f',    // balanced mid-dark
          500: '#383e50',    // dark neutral gray
          600: '#0e0f13',    // your chosen dark base
          700: '#0d0e11',    // slightly deeper
          800: '#0b0c0f',    // near-black
          900: '#0a0b0d',    // ultra-dark
          950: '#08090b'     // almost true black
        }
      }
    }
  }
});

export default RevoltPreset;
