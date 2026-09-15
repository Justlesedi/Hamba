export type Activity = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  company: string;
  operatingHours: string;
  area: string;
};

export type NearbyActivity = Activity & {
  distanceKm: number;
};
