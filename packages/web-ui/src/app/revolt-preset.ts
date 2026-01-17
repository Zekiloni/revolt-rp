import Aura from '@primeng/themes/aura';
import { definePreset, palette } from '@primeng/themes';

const RevoltPreset = definePreset(Aura, {
  semantic: {
    primary: palette('#F6C241'),
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
        surface: palette('#1b1f2b'),
        ground: palette('#0e0f13')
      }
    }
  }
});

export default RevoltPreset;
