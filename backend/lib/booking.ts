import type { BookingStatus, TransportMode } from "../types/booking";
import type { TransportEstimates } from "../types/budget";

const TRANSPORT_MODES = new Set<TransportMode>([
  "uber",
  "bus",
  "fuel",
  "none",
]);

export const BOOKING_COMMISSION_RATE = 0.03;

export function isTransportMode(value: string): value is TransportMode {
  return TRANSPORT_MODES.has(value as TransportMode);
}

export function bookingCommissionCents(subtotalCents: number) {
  return Math.round(Math.max(0, subtotalCents) * BOOKING_COMMISSION_RATE);
}

export function bookingCommissionLabel() {
  return `Commission (${Math.round(BOOKING_COMMISSION_RATE * 100)}%)`;
}

export function transportCentsForMode(
  mode: TransportMode,
  transport: TransportEstimates,
) {
  if (mode === "uber") {
    return transport.uberCents;
  }
  if (mode === "bus") {
    return transport.busCents;
  }
  if (mode === "fuel") {
    return transport.fuelCents;
  }
  return 0;
}

export function bookingStatusLabel(status: BookingStatus) {
  return status === "confirmed" ? "Confirmed" : "Cancelled";
}

export function transportModeLabel(mode: TransportMode) {
  if (mode === "uber") {
    return "Uber";
  }
  if (mode === "bus") {
    return "Bus / minibus taxi";
  }
  if (mode === "fuel") {
    return "Fuel (private car)";
  }
  return "Arrange transport yourself";
}
