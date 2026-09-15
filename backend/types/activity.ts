export type PlaceKind = "activity" | "food";

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
};
