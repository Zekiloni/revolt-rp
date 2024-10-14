import i18next from 'i18next';
import { logger } from './logger.config';
import * as enUS from '@bc-rp-rage/shared/lib/locales/en-US.json';

export const translationConfig = {
	lng: 'en-US',
	resources: {
		'en-US': {
			translation: enUS
		}
	},
	interpolation: {
		prefix: '{',
		suffix: '}'
	}
};

i18next.init(translationConfig)
	.then(() => logger('localization loaded'));
