import i18next from 'i18next';
import { enUs, srRs } from '@revolt-rp/common';
import { logger } from './logger.config';

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
  .then(() => logger('localization').log('success', 'loaded'));
