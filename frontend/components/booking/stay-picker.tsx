"use client";

import { formatZar } from "@backend/lib/money";
import type { QuotedStay } from "@backend/types/stay";
import { OpenBadge } from "@/components/plan/open-badge";
import { Button } from "@/components/ui/button";

export function StayPicker({
  stays,
  selectedStayId,
  onSelect,
}: {
  stays: QuotedStay[];
  selectedStayId: string | null;
  onSelect: (stayId: string | null) => void;
}) {
  if (stays.length === 0) {
    return (
      <p className="text-sm text-muted">
        No listed stays nearby yet. Try another destination on this trip.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {stays.map((stay) => {
        const chosen = stay.id === selectedStayId;
        return (
          <li
            key={stay.id}
            className={`flex items-start justify-between gap-3 py-3 ${
              chosen ? "bg-background" : ""
            }`}
          >
            <div className="min-w-0">
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium">{stay.name}</p>
                <OpenBadge status={stay.openStatus} />
              </div>
              <p className="mt-1 text-sm text-muted">
                {stay.area} · {stay.kind} · {stay.units}{" "}
                {stay.units === 1 ? "unit" : "units"} · {stay.nights}{" "}
                {stay.nights === 1 ? "night" : "nights"}
              </p>
              <p className="mt-1 text-sm font-medium">
                {formatZar(stay.totalCents)}
              </p>
            </div>
            <Button
              type="button"
              variant={chosen ? "secondary" : "primary"}
              onClick={() => onSelect(chosen ? null : stay.id)}
            >
              {chosen ? "Clear" : "Select"}
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
