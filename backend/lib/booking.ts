import type { BookingStatus, TransportMode } from "../types/booking";
import type { TransportEstimates } from "../types/budget";

const TRANSPORT_MODES = new Set<TransportMode>([
  "uber",
  "bus",
  "fuel",
  "none",
]);

export function isTransportMode(value: string): value is TransportMode {
  return TRANSPORT_MODES.has(value as TransportMode);
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
