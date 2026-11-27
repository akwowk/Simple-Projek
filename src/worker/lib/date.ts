export const TIMEZONE = "Asia/Jakarta";

export function nowISO() {
  return new Date().toISOString();
}

export function getTodayWIB(
  date = new Date()
): number {
  const weekday = new Intl.DateTimeFormat(
    "en-US",
    {
      weekday: "short",
      timeZone: TIMEZONE,
    }
  ).format(date);

  return [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ].indexOf(weekday);
}

export function getDateWIB(
  date = new Date()
): string {
  const parts = new Intl.DateTimeFormat(
    "en-GB",
    {
      timeZone: TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
  ).formatToParts(date);

  const get = (type: string) =>
    parts.find(
      (part) => part.type === type
    )?.value;

  return `${get("year")}-${get("month")}-${get("day")}`;
}