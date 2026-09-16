import {
  activityCostCents,
  activityPricing,
  placePartyCostCents,
} from "../lib/activities/costs";
import { estimateLegCents, tripNights } from "../lib/budget/estimates";
import { haversineKm } from "../lib/geo";
import { zarToCents } from "../lib/money";
import { getNearbyActivityById } from "./activities";
import { listTripPlaceIds } from "./plan";
import { getStayById, quoteStay } from "./stays";
import { getTripForUser } from "./trips";
import type { BudgetForecast, ForecastActivity, TransportLeg } from "../types/budget";

export function forecastTripBudget(
  userId: string,
  tripId: string,
  input: { budgetZar?: number } = {},
): BudgetForecast | null {
  const trip = getTripForUser(userId, tripId);
  if (!trip) {
    return null;
  }

  const budgetCents =
    input.budgetZar != null
      ? zarToCents(input.budgetZar)
      : trip.budgetCents;
  const nights = tripNights(trip.startDate, trip.endDate);
  const chosenStay = trip.stayId ? getStayById(trip.stayId) : null;
  const stay = chosenStay
    ? quoteStay(chosenStay, {
        travellers: trip.travellers,
        nights,
      })
    : null;

  const selectedIds = listTripPlaceIds(tripId);
  const origin = stay
    ? { lat: stay.latitude, lng: stay.longitude }
    : null;

  const activities: ForecastActivity[] = [];
  const legs: TransportLeg[] = [];

  for (const activityId of selectedIds) {
    const place = getNearbyActivityById(
      activityId,
      origin ?? undefined,
    );
    if (!place) {
      continue;
    }

    const unitCents =
      place.estimatedCostCents > 0
        ? place.estimatedCostCents
        : activityCostCents(place.id);
    const pricing = activityPricing(place.id, place.kind);

    activities.push({
      id: place.id,
      name: place.name,
      area: place.area,
      kind: place.kind,
      company: place.company,
      operatingHours: place.operatingHours,
      openStatus: place.openStatus,
      priceUnit: pricing.priceUnit,
      typicalHours: pricing.typicalHours,
      estimatedCostCents: unitCents,
      partyCostCents: placePartyCostCents(unitCents, trip.travellers, pricing),
    });

    if (origin) {
      const distanceKm = haversineKm(
        origin.lat,
        origin.lng,
        place.latitude,
        place.longitude,
      );
      const roundTripKm = Math.round(distanceKm * 2 * 10) / 10;
      const leg = estimateLegCents(roundTripKm, trip.travellers);
      legs.push({
        toId: place.id,
        toName: place.name,
        ...leg,
      });
    }
  }

  const stayTotal = stay?.totalCents ?? 0;
  const placesTotal = activities.reduce(
    (sum, place) => sum + place.partyCostCents,
    0,
  );
  const plannedTotalCents = stayTotal + placesTotal;
  const transport = legs.reduce(
    (sum, leg) => ({
      uberCents: sum.uberCents + leg.uberCents,
      busCents: sum.busCents + leg.busCents,
      fuelCents: sum.fuelCents + leg.fuelCents,
    }),
    { uberCents: 0, busCents: 0, fuelCents: 0 },
  );

  return {
    budgetCents,
    nights,
    travellers: trip.travellers,
    stay: stay
      ? {
          listingId: stay.id,
          name: stay.name,
          area: stay.area,
          kind: stay.kind,
          nightlyCents: stay.nightlyCents,
          rooms: stay.units,
          nights,
          totalCents: stay.totalCents,
        }
      : null,
    activities,
    legs,
    transport,
    plannedTotalCents,
    remainingCents:
      budgetCents == null ? null : budgetCents - plannedTotalCents,
  };
}
