"use client";

import { useEffect, useState } from "react";
import type { BusyDay } from "@backend/lib/calendar/busy";
import { BusyCalendar } from "@/components/calendar/busy-calendar";

function todayKey() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Johannesburg",
  }).format(new Date());
}

export function TripDatePicker({
  destination,
  startError,
  endError,
}: {
  destination: string;
  startError?: string;
  endError?: string;
}) {
  const today = todayKey();
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [month, setMonth] = useState(today.slice(0, 7));
  const [days, setDays] = useState<BusyDay[]>([]);

  useEffect(() => {
    if (destination.trim().length < 2) {
      setDays([]);
      return;
    }

    const monthDate = `${month}-01`;
    const endDate = new Date(`${month}-01T00:00:00.000Z`);
    endDate.setUTCMonth(endDate.getUTCMonth() + 1);
    endDate.setUTCDate(0);
    const params = new URLSearchParams({
      destination: destination.trim(),
      start: monthDate,
      end: endDate.toISOString().slice(0, 10),
    });
    const handle = window.setTimeout(async () => {
      const response = await fetch(`/api/calendar?${params.toString()}`);
      if (!response.ok) {
        return;
      }
      const data = (await response.json()) as { days: BusyDay[] };
      setDays(data.days);
    }, 250);

    return () => window.clearTimeout(handle);
  }, [destination, month]);

  function pick(date: string) {
    if (!start || (start && end)) {
      setStart(date);
      setEnd("");
      return;
    }
    if (date < start) {
      setStart(date);
      setEnd("");
      return;
    }
    setEnd(date);
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name="startDate" value={start} />
      <input type="hidden" name="endDate" value={end} />
      <BusyCalendar
        month={month}
        days={days}
        rangeStart={start || null}
        rangeEnd={end || start || null}
        selected={end || start || null}
        onSelect={pick}
        onMonthChange={setMonth}
        title="Trip dates"
      />
      <p className="text-sm text-muted">
        {start
          ? end
            ? `Selected ${start} to ${end}.`
            : `Departure ${start}. Pick a return date.`
          : "Pick a departure date, then a return date."}{" "}
        Green is quieter, yellow is moderate, red is full.
      </p>
      {startError ? <p className="text-sm text-accent">{startError}</p> : null}
      {endError ? <p className="text-sm text-accent">{endError}</p> : null}
    </div>
  );
}
