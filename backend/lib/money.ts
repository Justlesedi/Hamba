const zar = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 0,
});

export function formatZar(cents: number) {
  return zar.format(cents / 100);
}

export function zarToCents(amount: number) {
  return Math.round(amount * 100);
}

export function formatZarFromCents(cents: number | null | undefined) {
  if (cents == null) {
    return "No budget set";
  }

  return zar.format(cents / 100);
}
