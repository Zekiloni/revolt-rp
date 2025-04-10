import { default as dayjsModule } from 'dayjs';
import 'dayjs/locale/sr';
import relativeTime from 'dayjs/plugin/relativeTime';
import localeData from 'dayjs/plugin/localeData';
import duration from 'dayjs/plugin/duration';

dayjsModule.extend(relativeTime);
dayjsModule.extend(localeData);
dayjsModule.extend(duration);

export const dayjs = dayjsModule;

