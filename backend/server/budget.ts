import { activityCostCents } from "../lib/activities/costs";
import {
  estimateTransportCents,
  nightlyStayCents,
  stayRooms,
  tripNights,
} from "../lib/budget/estimates";
import { zarToCents } from "../lib/money";
import { searchNearbyActivities } from "./activities";
import { getTripForUser } from "./trips";
import type { BudgetForecast, ForecastActivity } from "../types/budget";

function recommendFitting(
  items: ForecastActivity[],
  remainingCents: number,
  limit?: number,
) {
  const recommendedIds = new Set<string>();
  let remaining = remainingCents;

  for (const item of items) {
    if (limit != null && recommendedIds.size >= limit) {
      break;
    }
    if (item.partyCostCents <= remaining) {
      recommendedIds.add(item.id);
      remaining -= item.partyCostCents;
    }
  }

  return { recommendedIds, remaining };
}

export function forecastTripBudget(
  userId: string,
  tripId: string,
  input: { budgetZar: number },
  center: { lat: number; lng: number },
): BudgetForecast | null {
  const trip = getTripForUser(userId, tripId);
  if (!trip) {
    return null;
  }

  const budgetCents = zarToCents(input.budgetZar);
  const nights = tripNights(trip.startDate, trip.endDate);
  const rooms = stayRooms(trip.travellers);
  const stayNights = nights;
  const nightlyCents = nightlyStayCents(trip.destination);
  const stayTotal = nightlyCents * rooms * stayNights;
  const transport = estimateTransportCents({
    nights,
    travellers: trip.travellers,
  });

  const nearby = searchNearbyActivities(center.lat, center.lng);
  const priced = nearby
    .map((place) => {
      const estimatedCostCents =
        place.estimatedCostCents > 0
          ? place.estimatedCostCents
          : activityCostCents(place.id);
      return {
        id: place.id,
        name: place.name,
        area: place.area,
        kind: place.kind === "food" || place.id.startsWith("food_") ? "food" : "activity",
        estimatedCostCents,
        partyCostCents: estimatedCostCents * trip.travellers,
        recommended: false,
      };
    })
    .sort((a, b) => a.partyCostCents - b.partyCostCents);

  const food = priced.filter((place) => place.kind === "food");
  const activities = priced.filter((place) => place.kind !== "food");
  const maxFood = 8;

  const foodPick = recommendFitting(food, budgetCents - stayTotal, maxFood);
  const activityPick = recommendFitting(activities, foodPick.remaining);
  const recommendedIds = new Set([
    ...foodPick.recommendedIds,
    ...activityPick.recommendedIds,
  ]);

  const listed = priced.map((place) => ({
    ...place,
    recommended: recommendedIds.has(place.id),
  }));

  const recommendedTotalCents = listed
    .filter((place) => place.recommended)
    .reduce((sum, place) => sum + place.partyCostCents, 0);

  const plannedTotalCents = stayTotal + recommendedTotalCents;

  return {
    budgetCents,
    nights: stayNights,
    travelDays: transport.travelDays,
    travellers: trip.travellers,
    stay: {
      nightlyCents,
      rooms,
      nights: stayNights,
      totalCents: stayTotal,
      note: "Rough mid-range stay estimate. Exact stays will come in the next step.",
    },
    transport: {
      uberCents: transport.uberCents,
      busCents: transport.busCents,
      fuelCents: transport.fuelCents,
    },
    activities: listed,
    recommendedTotalCents,
    plannedTotalCents,
    remainingCents: budgetCents - plannedTotalCents,
  };
}
