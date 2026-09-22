import {
  busyLevelLabel,
  type BusyLevel,
} from "@backend/lib/calendar/busy";

const DOT: Record<BusyLevel, string> = {
  empty: "bg-[var(--busy-empty)]",
  moderate: "bg-[var(--busy-moderate)]",
  full: "bg-[var(--busy-full)]",
};

export function BusyBadge({ level }: { level: BusyLevel }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium">
      <span className={`size-2 rounded-full ${DOT[level]}`} aria-hidden />
      {busyLevelLabel(level)}
    </span>
  );
}

const LEGEND_LEVELS: BusyLevel[] = ["empty", "moderate", "full"];

export function BusyLegend() {
  return (
    <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
      {LEGEND_LEVELS.map((level) => (
        <span key={level} className="inline-flex items-center gap-1.5">
          <span className={`size-2.5 rounded-full ${DOT[level]}`} aria-hidden />
          {busyLevelLabel(level)}
        </span>
      ))}
    </p>
  );
}
