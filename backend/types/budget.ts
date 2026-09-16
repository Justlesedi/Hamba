import type { PlaceKind, PriceUnit } from "./activity";
import type { OpenStatus } from "../lib/hours";
import type { StayKind } from "./stay";
import type { Flight } from "./flight";

export type TransportEstimates = {
  uberCents: number;
  busCents: number;
  fuelCents: number;
};

export type TransportLeg = TransportEstimates & {
  toId: string;
  toName: string;
  distanceKm: number;
};

export type ForecastActivity = {
  id: string;
  name: string;
  area: string;
  kind: PlaceKind;
  company: string;
  operatingHours: string;
  openStatus: OpenStatus;
  priceUnit: PriceUnit;
  typicalHours: number;
  estimatedCostCents: number;
  partyCostCents: number;
};

export type BudgetForecast = {
  budgetCents: number | null;
  nights: number;
  travellers: number;
  stay: {
    listingId: string;
    name: string;
    area: string;
    kind: StayKind;
    nightlyCents: number;
    rooms: number;
    nights: number;
    totalCents: number;
  } | null;
  activities: ForecastActivity[];
  legs: TransportLeg[];
  transport: TransportEstimates;
  flights: {
    outbound: Flight | null;
    inbound: Flight | null;
    totalCents: number;
  };
  plannedTotalCents: number;
  remainingCents: number | null;
};
