import type { OpenStatus } from "../lib/hours";

export type StayKind =
  | "hotel"
  | "guesthouse"
  | "lodge"
  | "camp"
  | "apartment";

export type Stay = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  company: string;
  area: string;
  kind: StayKind;
  sleeps: number;
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
