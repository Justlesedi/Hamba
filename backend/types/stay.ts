import type { OpenStatus } from "../lib/hours";

export type StayKind =
  | "hotel"
  | "house"
  | "guesthouse"
  | "lodge"
  | "camp"
  | "apartment";

export function stayKindLabel(kind: StayKind) {
  if (kind === "house") {
    return "House";
  }
  if (kind === "guesthouse") {
    return "Guesthouse";
  }
  if (kind === "lodge") {
    return "Lodge";
  }
  if (kind === "camp") {
    return "Rest camp";
  }
  if (kind === "apartment") {
    return "Apartment";
  }
  return "Hotel";
}

export function stayCapacity(kind: StayKind, sleeps: number) {
  const beds = Math.max(1, sleeps);
  const rooms =
    kind === "house" ? Math.max(1, Math.round(sleeps / 2)) : 1;
  return { beds, rooms };
}

export function stayLayoutLabel(stay: {
  kind: StayKind;
  beds: number;
  rooms: number;
}) {
  if (stay.kind === "house") {
    return stay.rooms === 1 ? "1 room" : `${stay.rooms} rooms`;
  }
  return stay.beds === 1 ? "1 bed per room" : `${stay.beds} beds per room`;
}

export type Stay = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  company: string;
  area: string;
  kind: StayKind;
  sleeps: number;
  beds: number;
  rooms: number;
  nightlyCents: number;
  note: string;
  operatingHours: string;
};

export type QuotedStay = Stay & {
  distanceKm: number;
  units: number;
  nights: number;
  totalCents: number;
  openStatus: OpenStatus;
};
