import i18next from 'i18next';
import { enUs } from '@revolt-rp/common';
import { logger } from './logger.config';

export const translationConfig = {
  lng: 'en-US',
  resources: {
    'en-US': {
      translation: enUs
    }
  },
  interpolation: {
    prefix: '{{',
    suffix: '}}'
  }
};

i18next.init(translationConfig)
  .then(() => logger('localization').log('success', 'loaded'));
