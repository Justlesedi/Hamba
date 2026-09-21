export const CALENDAR_TIMEZONE = "Africa/Johannesburg";

const dateKeyFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: CALENDAR_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function dateKey(value: Date | string) {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }
  return dateKeyFormat.format(new Date(value));
}

export function parseDateKey(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(Date.UTC(year, (month ?? 1) - 1, day ?? 1));
}

export function addDays(key: string, days: number) {
  const date = parseDateKey(key);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function weekdayIndex(key: string) {
  return parseDateKey(key).getUTCDay();
}

export function monthStart(key: string) {
  return `${key.slice(0, 7)}-01`;
}

export function monthEnd(key: string) {
  const date = parseDateKey(`${key.slice(0, 7)}-01`);
  date.setUTCMonth(date.getUTCMonth() + 1);
  date.setUTCDate(0);
  return date.toISOString().slice(0, 10);
}

export function eachDate(start: string, end: string) {
  const days: string[] = [];
  let cursor = start;
  while (cursor <= end) {
    days.push(cursor);
    cursor = addDays(cursor, 1);
  }
  return days;
}

export function monthGrid(month: string) {
  const start = monthStart(`${month}-01`);
  const end = monthEnd(start);
  const days = eachDate(start, end);
  const lead = (weekdayIndex(start) + 6) % 7;
  return { start, end, lead, days };
}
