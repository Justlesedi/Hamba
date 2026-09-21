import { db } from "../db";

type HolidayRow = {
  date: string;
  name: string;
};

type LongWeekendRow = {
  startDate: string;
  endDate: string;
};

export type CalendarSignals = {
  holidays: Map<string, string>;
  longWeekends: Set<string>;
};

const CACHE_MS = 7 * 24 * 60 * 60 * 1000;

function readCache(key: string) {
  const row = db
    .prepare(`SELECT body, fetchedAt FROM json_cache WHERE cacheKey = ?`)
    .get(key) as { body: string; fetchedAt: string } | undefined;
  if (!row) {
    return null;
  }
  if (Date.now() - new Date(row.fetchedAt).getTime() > CACHE_MS) {
    return null;
  }
  try {
    return JSON.parse(row.body) as unknown;
  } catch {
    return null;
  }
}

function writeCache(key: string, body: unknown) {
  db.prepare(
    `INSERT OR REPLACE INTO json_cache (cacheKey, body, fetchedAt) VALUES (?, ?, ?)`,
  ).run(key, JSON.stringify(body), new Date().toISOString());
}

async function fetchJson(url: string) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "HambaTravel/0.1 (local itinerary planner)",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  }).catch(() => null);

  if (!response?.ok) {
    return null;
  }
  return response.json();
}

async function holidaysForYear(year: number) {
  const key = `nager:holidays:${year}`;
  const cached = readCache(key);
  if (Array.isArray(cached)) {
    return cached as HolidayRow[];
  }

  const data = (await fetchJson(
    `https://date.nager.at/api/v3/PublicHolidays/${year}/ZA`,
  )) as Array<{ date?: string; name?: string; localName?: string }> | null;

  if (!data) {
    return [];
  }

  const rows = data.flatMap((item) =>
    item.date
      ? [{ date: item.date, name: item.name || item.localName || "Public holiday" }]
      : [],
  );
  writeCache(key, rows);
  return rows;
}

async function longWeekendsForYear(year: number) {
  const key = `nager:weekends:${year}`;
  const cached = readCache(key);
  if (Array.isArray(cached)) {
    return cached as LongWeekendRow[];
  }

  const data = (await fetchJson(
    `https://date.nager.at/api/v3/LongWeekend/${year}/ZA`,
  )) as Array<{ startDate?: string; endDate?: string }> | null;

  if (!data) {
    return [];
  }

  const rows = data.flatMap((item) =>
    item.startDate && item.endDate
      ? [{ startDate: item.startDate, endDate: item.endDate }]
      : [],
  );
  writeCache(key, rows);
  return rows;
}

export async function loadCalendarSignals(years: number[]) {
  const holidays = new Map<string, string>();
  const longWeekends = new Set<string>();

  for (const year of [...new Set(years)]) {
    const [holidayRows, weekendRows] = await Promise.all([
      holidaysForYear(year),
      longWeekendsForYear(year),
    ]);
    for (const holiday of holidayRows) {
      holidays.set(holiday.date, holiday.name);
    }
    for (const weekend of weekendRows) {
      let cursor = weekend.startDate;
      while (cursor <= weekend.endDate) {
        longWeekends.add(cursor);
        const next = new Date(`${cursor}T00:00:00.000Z`);
        next.setUTCDate(next.getUTCDate() + 1);
        cursor = next.toISOString().slice(0, 10);
      }
    }
  }

  return { holidays, longWeekends } satisfies CalendarSignals;
}
