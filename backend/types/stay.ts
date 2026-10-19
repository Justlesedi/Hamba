import type { OpenStatus } from "../lib/hours";

export type StayKind =
  | "hotel"
  | "house"
  | "guesthouse"
  | "lodge"
  | "camp"
  | "apartment"
  | "resort";

export const STAY_KIND_FILTERS: Array<{
  id: StayKind | "all";
  label: string;
}> = [
  { id: "all", label: "All stays" },
  { id: "hotel", label: "Hotels" },
  { id: "resort", label: "Resorts" },
  { id: "guesthouse", label: "Guesthouses" },
  { id: "house", label: "Houses" },
  { id: "apartment", label: "Apartments" },
  { id: "lodge", label: "Lodges" },
  { id: "camp", label: "Camps" },
];

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
  if (kind === "resort") {
    return "Resort";
  }
  return "Hotel";
}

export function stayUnitNoun(
  kind: StayKind | null | undefined,
  count = 1,
) {
  if (kind === "house") {
    return count === 1 ? "house" : "houses";
  }
  if (kind === "resort") {
    return count === 1 ? "chalet" : "chalets";
  }
  return count === 1 ? "room" : "rooms";
}

export function stayUnitHeading(kind: StayKind | null | undefined) {
  if (kind === "house") {
    return "Houses";
  }
  if (kind === "resort") {
    return "Chalets";
  }
  return "Rooms";
}

export function stayCapacity(kind: StayKind, sleeps: number) {
  const beds = Math.max(1, sleeps);
  const rooms =
    kind === "house" || kind === "resort"
      ? Math.max(1, Math.round(sleeps / 2))
      : 1;
  return { beds, rooms };
}

export function stayLayoutLabel(stay: {
  kind: StayKind;
  beds: number;
  rooms: number;
  sleeps?: number;
}) {
  if (stay.kind === "house") {
    return stay.rooms === 1 ? "1 room" : `${stay.rooms} rooms`;
  }
  if (stay.kind === "resort") {
    const sleeps = stay.sleeps ?? stay.beds;
    const bedrooms = stay.rooms === 1 ? "1 bedroom" : `${stay.rooms} bedrooms`;
    return `Self-catering chalet · sleeps ${sleeps} · ${bedrooms}`;
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
