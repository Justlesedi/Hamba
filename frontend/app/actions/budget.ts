"use server";

import { forecastTripBudget } from "@backend/server/budget";
import { getTripForUser, updateTripBudget } from "@backend/server/trips";
import { resolveDestinationCenter } from "@backend/lib/geocode";
import {
  budgetForecastSchema,
  type BudgetForecastFormState,
} from "@backend/lib/validation";
import { verifySession } from "@/lib/dal";

export async function forecastBudgetAction(
  _state: BudgetForecastFormState,
  formData: FormData,
): Promise<BudgetForecastFormState> {
  const { userId } = await verifySession();
  const tripId = String(formData.get("tripId") ?? "");
  const parsed = budgetForecastSchema.safeParse({
    budgetZar: formData.get("budgetZar"),
  });

  if (!tripId) {
    return { message: "Trip is missing." };
  }

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const trip = await getTripForUser(userId, tripId);
  if (!trip) {
    return { message: "Trip not found." };
  }

  const center = await resolveDestinationCenter(trip.destination);
  if (!center) {
    return { message: "Could not place this destination on the map." };
  }

  try {
    await updateTripBudget(userId, tripId, parsed.data.budgetZar);
    const forecast = forecastTripBudget(userId, tripId, parsed.data, center);
    if (!forecast) {
      return { message: "Trip not found." };
    }
    return { forecast };
  } catch {
    return { message: "Could not forecast this budget. Please try again." };
  }
}
