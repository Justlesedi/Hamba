"use client";

import { useMemo } from "react";
import { busyLevelLabel, type BusyDay } from "@backend/lib/calendar/busy";
import { monthGrid } from "@backend/lib/calendar/dates";
import { BusyLegend } from "@/components/calendar/busy-badge";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const LEVEL_CLASS = {
  empty: "bg-[var(--busy-empty)]/20 text-foreground",
  moderate: "bg-[var(--busy-moderate)]/25 text-foreground",
  full: "bg-[var(--busy-full)]/20 text-foreground",
};

function monthLabel(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  return new Intl.DateTimeFormat("en-ZA", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, (monthNumber ?? 1) - 1, 1)));
}

export function BusyCalendar({
  month,
  days,
  rangeStart,
  rangeEnd,
  selected,
  onSelect,
  onMonthChange,
  title,
}: {
  month: string;
  days: BusyDay[];
  rangeStart?: string | null;
  rangeEnd?: string | null;
  selected?: string | null;
  onSelect?: (date: string) => void;
  onMonthChange?: (month: string) => void;
  title?: string;
}) {
  const byDate = useMemo(
    () => new Map(days.map((day) => [day.date, day])),
    [days],
  );
  const grid = monthGrid(`${month}-01`);
  const [year, monthNumber] = month.split("-").map(Number);
  const previous = new Date(Date.UTC(year, (monthNumber ?? 1) - 2, 1))
    .toISOString()
    .slice(0, 7);
  const next = new Date(Date.UTC(year, monthNumber ?? 1, 1))
    .toISOString()
    .slice(0, 7);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-medium">{title ?? "Calendar"}</h2>
          <p className="mt-1 text-sm text-muted">{monthLabel(month)}</p>
        </div>
        {onMonthChange ? (
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-full border border-border px-3 py-1 text-sm text-muted hover:text-foreground"
              onClick={() => onMonthChange(previous)}
            >
              Previous
            </button>
            <button
              type="button"
              className="rounded-full border border-border px-3 py-1 text-sm text-muted hover:text-foreground"
              onClick={() => onMonthChange(next)}
            >
              Next
            </button>
          </div>
        ) : null}
      </div>
      <BusyLegend />
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted">
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
        {Array.from({ length: grid.lead }, (_, index) => (
          <div key={`lead-${index}`} />
        ))}
        {grid.days.map((date) => {
          const day = byDate.get(date);
          const inRange =
            rangeStart &&
            rangeEnd &&
            date >= rangeStart &&
            date <= rangeEnd;
          const isSelected = selected === date;
          const levelClass = day ? LEVEL_CLASS[day.level] : "text-muted";
          const titleText = day
            ? [busyLevelLabel(day.level), ...day.reasons].join(" · ")
            : date;
          const content = (
            <>
              <span>{Number(date.slice(8))}</span>
              {day ? (
                <span
                  className={`mt-1 size-1.5 rounded-full ${
                    day.level === "full"
                      ? "bg-[var(--busy-full)]"
                      : day.level === "moderate"
                        ? "bg-[var(--busy-moderate)]"
                        : "bg-[var(--busy-empty)]"
                  }`}
                />
              ) : null}
            </>
          );

          if (onSelect) {
            return (
              <button
                key={date}
                type="button"
                title={titleText}
                onClick={() => onSelect(date)}
                className={`flex min-h-11 flex-col items-center justify-center rounded-xl text-sm ${levelClass} ${
                  isSelected ? "ring-2 ring-foreground" : ""
                } ${inRange && !isSelected ? "ring-1 ring-accent" : ""}`}
              >
                {content}
              </button>
            );
          }

          return (
            <div
              key={date}
              title={titleText}
              className={`flex min-h-11 flex-col items-center justify-center rounded-xl text-sm ${levelClass} ${
                inRange ? "ring-1 ring-accent" : ""
              }`}
            >
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
