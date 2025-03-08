import { default as dayjsModule } from 'dayjs';
import 'dayjs/locale/sr';
import relativeTime from 'dayjs/plugin/relativeTime';
import localeData from 'dayjs/plugin/localeData';

dayjsModule.extend(relativeTime);
dayjsModule.extend(localeData);

export const dayjs = dayjsModule;

