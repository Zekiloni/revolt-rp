import Aura from '@primeng/themes/aura';
import { definePreset, palette } from '@primeng/themes';

const RevoltPreset = definePreset(Aura, {
  semantic: {
    primary: palette('#F6C241'),
    colorScheme: {
      dark: {
        surface: palette('#1b1f2b'),
        ground: palette('#0e0f13')
      }
    }
  }
});

export default RevoltPreset;
