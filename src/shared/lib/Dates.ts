import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

export const FULL_DATE_FORMAT = 'dddd, MMMM DD, YYYY';
export const TIME_FORMAT = 'h:mm A';
export const PICKER_FORMAT = 'YYYY-MM-DD[T]HH:mm:ss';

export const SHORT_DATE = 'YYYY-MM-DD';

export const DATE_FORMAT = 'MM/DD/YY';

export const BASIC_FORMAT = 'YYYY-MM-DD h:mm A';

export const DATE_TIME_FORMAT = 'MM/DD/YY [at] H:mm A';
export const DATE_TIME_WEEKDAY_FORMAT = 'dddd [at] H:mm A';

export const timezoneIdentifier = dayjs.tz.guess();

export const getFullDateFormat = (date?: string) =>
  dayjs(date).format(FULL_DATE_FORMAT);

export const getTimeFormat = (date: string) =>
  dayjs(date).tz(timezoneIdentifier).format(TIME_FORMAT);

export const getDateFormat = (date: string) => {
  return dayjs(date).tz(timezoneIdentifier).format(DATE_FORMAT);
};

export const isAfterCurrentTime = (date: string) =>
  dayjs(date)
    .tz(timezoneIdentifier)
    .isAfter(dayjs().tz(timezoneIdentifier), 'minute');

export const getStringWithTimezone = (date?: string) =>
  dayjs(date).format(PICKER_FORMAT);

export const getShortDate = () => dayjs().format(SHORT_DATE);

export const getBasicDate = (date?: string) => dayjs(date).format(BASIC_FORMAT);

export const getDateTimeFormat = (
  date: string,
  timeZone = timezoneIdentifier,
) => {
  const now = dayjs().tz(timeZone);

  if (now.isSame(date, 'day')) {
    return `Today at ${dayjs(date).tz(timeZone).format(TIME_FORMAT)}`;
  }

  const formatString = now.isSame(date, 'week')
    ? DATE_TIME_WEEKDAY_FORMAT
    : DATE_TIME_FORMAT;

  return dayjs(date).tz(timeZone).format(formatString);
};

export const addDay = (date: string) =>
  dayjs(date).add(1, 'day').format(SHORT_DATE);

export const reduceDay = (date: string) =>
  dayjs(date).subtract(1, 'day').format(SHORT_DATE);

export const isCurrentMonth = (date: string) =>
  dayjs(date).isSame(dayjs(), 'month');

export const isToday = (date: string) => dayjs(date).isSame(dayjs(), 'day');
