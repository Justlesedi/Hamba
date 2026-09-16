export type OpenStatus = {
  state: "open" | "closed" | "unknown";
  label: string;
};

const TIMEZONE = "Africa/Johannesburg";

const WEEKDAY_INDEX: Record<string, number> = {
  sun: 0,
  sunday: 0,
  mon: 1,
  monday: 1,
  tue: 2,
  tues: 2,
  tuesday: 2,
  wed: 3,
  wednesday: 3,
  thu: 4,
  thur: 4,
  thursday: 4,
  fri: 5,
  friday: 5,
  sat: 6,
  saturday: 6,
};

function sastParts(now: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const weekday = parts.find((part) => part.type === "weekday")?.value ?? "Mon";
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? 0);

  return {
    weekday: WEEKDAY_INDEX[weekday.toLowerCase()] ?? 1,
    minutes: hour * 60 + minute,
  };
}

function toMinutes(hour: string, minute: string) {
  const hours = Number(hour);
  const mins = Number(minute);
  if (hours === 24 && mins === 0) {
    return 24 * 60;
  }
  return hours * 60 + mins;
}

function inWindow(now: number, start: number, end: number) {
  if (end > start) {
    return now >= start && now < end;
  }
  return now >= start || now < end;
}

function daySet(from: string, to: string) {
  const start = WEEKDAY_INDEX[from];
  const end = WEEKDAY_INDEX[to];
  if (start == null || end == null) {
    return null;
  }

  const days = new Set<number>();
  let cursor = start;
  days.add(cursor);
  while (cursor !== end) {
    cursor = (cursor + 1) % 7;
    days.add(cursor);
  }
  return days;
}

function parseDayNames(text: string) {
  const range = text.match(
    /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\s*[–\-to]+\s*(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/,
  );
  if (range) {
    return daySet(range[1], range[2]);
  }
  return null;
}

function closedDays(text: string) {
  const days = new Set<number>();
  const matches = text.matchAll(
    /closed\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/g,
  );
  for (const match of matches) {
    const index = WEEKDAY_INDEX[match[1]];
    if (index != null) {
      days.add(index);
    }
  }
  return days;
}

export function openStatusFromHours(
  hours: string,
  now = new Date(),
): OpenStatus {
  const text = hours.toLowerCase().replace(/[’']/g, "");
  const { weekday, minutes } = sastParts(now);

  if (
    /open 24|24 hours|reception 24|00:00\s*[–\-]\s*24:00/.test(text)
  ) {
    return { state: "open", label: "Open now" };
  }

  const closed = closedDays(text);
  if (closed.has(weekday)) {
    return { state: "closed", label: "Closed now" };
  }

  const allowedDays = parseDayNames(text);
  if (allowedDays && !allowedDays.has(weekday)) {
    return { state: "closed", label: "Closed now" };
  }

  const windows: { start: number; end: number }[] = [];

  if (/sunrise to sunset|sunrise–sunset/.test(text)) {
    windows.push({ start: 6 * 60, end: 18 * 60 });
  }

  for (const match of text.matchAll(
    /(\d{1,2}):(\d{2})\s*[–\-]\s*(\d{1,2}):(\d{2})/g,
  )) {
    windows.push({
      start: toMinutes(match[1], match[2]),
      end: toMinutes(match[3], match[4]),
    });
  }

  if (windows.length === 0) {
    return { state: "unknown", label: hours };
  }

  const open = windows.some((window) =>
    inWindow(minutes, window.start, window.end),
  );

  return open
    ? { state: "open", label: "Open now" }
    : { state: "closed", label: "Closed now" };
}
