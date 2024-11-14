/**
 * converts and timestamp in MS to a UTC string
 * @param timestamp in MS since the unix epoch
 * @return UTC string in the format: Day, DD Mon YYYY HH:MM:SS GMT. "--" if timestamp invalid
 */
export function timestampToUtcString(timestamp: number) {
  let date;

  if (!isNaN(timestamp)) {
    date = new Date(Number(timestamp));
  } else {
    date = new Date(timestamp);
  }

  if (isNaN(date.getTime())) {
    return '--';
  }

  return date.toUTCString();
}
