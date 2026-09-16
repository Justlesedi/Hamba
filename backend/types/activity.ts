export type PlaceKind = "activity" | "food";
export type PriceUnit = "visit" | "hour";

export type Activity = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  company: string;
  operatingHours: string;
  area: string;
  kind: PlaceKind;
  estimatedCostCents: number;
};

export type NearbyActivity = Activity & {
  distanceKm: number;
  priceUnit: PriceUnit;
  typicalHours: number;
  openStatus: import("../lib/hours").OpenStatus;
  requiresBooking: boolean;
};
