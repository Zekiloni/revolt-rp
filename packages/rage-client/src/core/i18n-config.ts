import i18next from 'i18next';
import { enUs, srRs } from '@revolt-rp/common';

export const translationConfig = {
  lng: 'sr-RS',
  resources: {
    'en-US': {
      translation: enUs
    },
    'sr-RS': {
      translation: srRs
    }
  },
  interpolation: {
    prefix: '{{',
    suffix: '}}'
  }
};

i18next.init(translationConfig)
  .then(() => mp.console.logInfo('loaded i18n config'));
