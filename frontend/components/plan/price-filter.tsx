"use client";

import type { PriceBand } from "@backend/lib/price-band";
import { PRICE_BANDS } from "@backend/lib/price-band";

export function PriceFilter({
  value,
  onChange,
  label,
}: {
  value: PriceBand;
  onChange: (band: PriceBand) => void;
  label: string;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
      {PRICE_BANDS.map((band) => {
        const selected = band.id === value;
        return (
          <button
            key={band.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(band.id)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              selected
                ? "bg-accent text-white"
                : "border border-border bg-background text-muted hover:text-foreground"
            }`}
          >
            {band.label}
          </button>
        );
      })}
    </div>
  );
}
