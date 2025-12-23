import dayjs from "dayjs";
import {
  dateAndTimeFormatTypes,
  DateFormatStyle,
  dateFormatTypes,
} from "../../config/date/format";

export const formatDate = (
  date: Date | string,
  formatStyle: DateFormatStyle = "slash",
  withTime: boolean = false,
) => {
  const format = withTime
    ? dateAndTimeFormatTypes[formatStyle]
    : dateFormatTypes[formatStyle];

  return dayjs(date).format(format);
};
