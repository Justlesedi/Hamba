export type PriceBand = "all" | "affordable" | "mid" | "premium";

export const PRICE_BANDS: Array<{ id: PriceBand; label: string }> = [
  { id: "all", label: "All" },
  { id: "affordable", label: "Affordable" },
  { id: "mid", label: "Mid-range" },
  { id: "premium", label: "Premium" },
];

export function priceBandOf(
  value: number,
  values: number[],
): Exclude<PriceBand, "all"> {
  const sorted = [...values].sort((left, right) => left - right);
  if (sorted.length === 0) {
    return "mid";
  }
  if (sorted.length === 1) {
    return "affordable";
  }

  const low = sorted[Math.floor((sorted.length - 1) / 3)] ?? sorted[0];
  const high =
    sorted[Math.floor(((sorted.length - 1) * 2) / 3)] ?? sorted[sorted.length - 1];

  if (value <= low) {
    return "affordable";
  }
  if (high > low && value >= high) {
    return "premium";
  }
  return "mid";
}

export function filterByPriceBand<T>(
  items: T[],
  band: PriceBand,
  amountCents: (item: T) => number,
  keep?: (item: T) => boolean,
) {
  if (band === "all") {
    return items;
  }

  const values = items.map(amountCents);
  const inBand = items.filter(
    (item) => priceBandOf(amountCents(item), values) === band,
  );
  const extra = items.filter(
    (item) => (keep?.(item) ?? false) && !inBand.includes(item),
  );
  const sorted = [...inBand].sort(
    (left, right) => amountCents(left) - amountCents(right),
  );

  return [...extra, ...sorted];
}
