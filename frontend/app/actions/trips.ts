"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createTrip, deleteTrip } from "@backend/server/trips";
import {
  createTripSchema,
  deleteTripSchema,
  type CreateTripFormState,
  type DeleteTripFormState,
} from "@backend/lib/validation";
import { verifySession } from "@/lib/dal";

export async function createTripAction(
  _state: CreateTripFormState,
  formData: FormData,
): Promise<CreateTripFormState> {
  const { userId } = await verifySession();
  const parsed = createTripSchema.safeParse({
    title: formData.get("title"),
    destination: formData.get("destination"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    travellers: formData.get("travellers"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  let tripId: string;
  try {
    const trip = await createTrip(userId, parsed.data);
    tripId = trip.id;
  } catch {
    return { message: "Could not create this trip. Please try again." };
  }

  redirect(`/trips/${tripId}`);
}

export async function deleteTripAction(
  _state: DeleteTripFormState,
  formData: FormData,
): Promise<DeleteTripFormState> {
  const { userId } = await verifySession();
  const parsed = deleteTripSchema.safeParse({
    tripId: formData.get("tripId"),
  });

  if (!parsed.success) {
    return { message: "Trip is missing." };
  }

  try {
    const trip = deleteTrip(userId, parsed.data.tripId);
    if (!trip) {
      return { message: "Trip not found." };
    }
    revalidatePath("/trips");
    revalidatePath("/bookings");
  } catch {
    return { message: "Could not delete this trip. Please try again." };
  }

  redirect("/trips");
}
