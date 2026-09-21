import {
  busyScore,
  levelFromScore,
  type BusyDay,
  type BusyPlaceKind,
} from "../lib/calendar/busy";
import { eachDate, weekdayIndex } from "../lib/calendar/dates";
import { loadCalendarSignals } from "../lib/calendar/signals";

export async function listBusyDays(options: {
  destination: string;
  start: string;
  end: string;
  name?: string;
  kind?: BusyPlaceKind;
  stayKind?: string;
}): Promise<BusyDay[]> {
  const years = [Number(options.start.slice(0, 4)), Number(options.end.slice(0, 4))];
  const signals = await loadCalendarSignals(years);

  return eachDate(options.start, options.end).map((date) => {
    const scored = busyScore({
      date,
      weekday: weekdayIndex(date),
      destination: options.destination,
      holidayName: signals.holidays.get(date) ?? null,
      longWeekend: signals.longWeekends.has(date),
      name: options.name,
      kind: options.kind,
      stayKind: options.stayKind,
    });

    return {
      date,
      level: levelFromScore(scored.score),
      reasons: scored.reasons,
    };
  });
}
