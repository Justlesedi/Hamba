"use client";

import { useEffect, useState } from "react";
import type { BusyDay, BusyPlaceKind } from "@backend/lib/calendar/busy";

export function useBusyDays(options: {
  destination: string;
  start: string;
  end: string;
  name?: string;
  kind?: BusyPlaceKind;
  stayKind?: string;
}) {
  const [days, setDays] = useState<BusyDay[]>([]);

  useEffect(() => {
    if (options.destination.trim().length < 2 || options.end < options.start) {
      setDays([]);
      return;
    }

    const params = new URLSearchParams({
      destination: options.destination.trim(),
      start: options.start,
      end: options.end,
    });
    if (options.name) {
      params.set("name", options.name);
    }
    if (options.kind) {
      params.set("kind", options.kind);
    }
    if (options.stayKind) {
      params.set("stayKind", options.stayKind);
    }

    const handle = window.setTimeout(async () => {
      const response = await fetch(`/api/calendar?${params.toString()}`);
      if (!response.ok) {
        return;
      }
      const data = (await response.json()) as { days: BusyDay[] };
      setDays(data.days);
    }, 200);

    return () => window.clearTimeout(handle);
  }, [
    options.destination,
    options.end,
    options.kind,
    options.name,
    options.start,
    options.stayKind,
  ]);

  return days;
}
