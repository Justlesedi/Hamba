"use server";

import { revalidatePath } from "next/cache";
import { chooseStayForTrip } from "@backend/server/stays";
import {
  addTripPlaces,
  removeTripPlaces,
  toggleTripPlace,
} from "@backend/server/plan";
import {
  chooseStaySchema,
  togglePlaceSchema,
  updatePlacesSchema,
  type ChooseStayFormState,
  type TogglePlaceFormState,
} from "@backend/lib/validation";
import { verifySession } from "@/lib/dal";

function revalidateTrip(tripId: string) {
  revalidatePath(`/trips/${tripId}`);
  revalidatePath(`/trips/${tripId}/itinerary`);
  revalidatePath(`/trips/${tripId}/budget`);
  revalidatePath(`/bookings/trip/${tripId}`);
}

export async function chooseStayAction(
  _state: ChooseStayFormState,
  formData: FormData,
): Promise<ChooseStayFormState> {
  const { userId } = await verifySession();
  const parsed = chooseStaySchema.safeParse({
    tripId: formData.get("tripId"),
    stayId: formData.get("stayId"),
  });

  if (!parsed.success) {
    return { message: "Choose a stay from the list." };
  }

  const stayId = parsed.data.stayId.length > 0 ? parsed.data.stayId : null;

  try {
    const trip = await chooseStayForTrip(userId, parsed.data.tripId, stayId);
    if (!trip) {
      return { message: "Could not save this stay." };
    }
    revalidateTrip(trip.id);
    return { selectedStayId: trip.stayId };
  } catch {
    return { message: "Could not save this stay. Please try again." };
  }
}

export async function togglePlaceAction(
  _state: TogglePlaceFormState,
  formData: FormData,
): Promise<TogglePlaceFormState> {
  const { userId } = await verifySession();
  const parsed = togglePlaceSchema.safeParse({
    tripId: formData.get("tripId"),
    activityId: formData.get("activityId"),
  });

  if (!parsed.success) {
    return { message: "Choose a place from the list." };
  }

  try {
    const selectedActivityIds = await toggleTripPlace(
      userId,
      parsed.data.tripId,
      parsed.data.activityId,
    );
    if (!selectedActivityIds) {
      return { message: "Could not update this place." };
    }
    revalidateTrip(parsed.data.tripId);
    return { selectedActivityIds };
  } catch {
    return { message: "Could not update this place. Please try again." };
  }
}

export async function updatePlacesAction(
  _state: TogglePlaceFormState,
  formData: FormData,
): Promise<TogglePlaceFormState> {
  const { userId } = await verifySession();
  const parsed = updatePlacesSchema.safeParse({
    tripId: formData.get("tripId"),
    intent: formData.get("intent"),
    activityIds: formData.getAll("activityId"),
  });

  if (!parsed.success) {
    return { message: "Choose at least one place." };
  }

  try {
    const selectedActivityIds =
      parsed.data.intent === "remove"
        ? await removeTripPlaces(
            userId,
            parsed.data.tripId,
            parsed.data.activityIds,
          )
        : await addTripPlaces(
            userId,
            parsed.data.tripId,
            parsed.data.activityIds,
          );
    if (!selectedActivityIds) {
      return { message: "Could not update these places." };
    }
    revalidateTrip(parsed.data.tripId);
    return { selectedActivityIds };
  } catch {
    return { message: "Could not update these places. Please try again." };
  }
}
