import type { PlaceKind } from "./activity";

export type TransportEstimates = {
  uberCents: number;
  busCents: number;
  fuelCents: number;
};

export type ForecastActivity = {
  id: string;
  name: string;
  area: string;
  kind: PlaceKind;
  estimatedCostCents: number;
  partyCostCents: number;
  recommended: boolean;
};

export type BudgetForecast = {
  budgetCents: number;
  nights: number;
  travelDays: number;
  travellers: number;
  stay: {
    nightlyCents: number;
    rooms: number;
    nights: number;
    totalCents: number;
    note: string;
  };
  transport: TransportEstimates;
  activities: ForecastActivity[];
  recommendedTotalCents: number;
  plannedTotalCents: number;
  remainingCents: number;
};
