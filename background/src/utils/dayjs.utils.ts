import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isLeapYear from "dayjs/plugin/isLeapYear";
import relativeTime from "dayjs/plugin/relativeTime.js";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/zh-cn";

dayjs.extend(customParseFormat);
dayjs.extend(isLeapYear);
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.locale(`zh-cn`);

export const getDateTimeFormat = (date = new Date(), format = `YYYY-MM-DD`): string => {
  return dayjs(date).format(format);
};

export const getDaysDiff = (start: string, end: string): number => {
  const startDay = dayjs(start);
  const endDay = dayjs(end);
  const daysDiff: number = Math.abs(endDay.diff(startDay, `day`));
  return daysDiff;
};

export default dayjs;