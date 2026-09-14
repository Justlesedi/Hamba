const ZAR = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
});

export function formatZar(cents: number) {
  return ZAR.format(cents / 100);
}

export function remainingBudget(plannedCents: number, spentCents: number) {
  return plannedCents - spentCents;
}
