import log4js, { Log4js } from 'log4js';

log4js.configure({
  appenders: {
    file: {
      type: 'file',
      layout: { type: 'basic' },
      filename: `logs/rage.log`
    },
    console: { type: 'console' }
  },
  categories: { default: { appenders: ['file', 'console'], level: 'info' } }
});


export const logger = (category?: string) => log4js.getLogger(category);
