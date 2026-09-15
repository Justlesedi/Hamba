"use server";

import { redirect } from "next/navigation";
import { createTrip } from "@backend/server/trips";
import {
  createTripSchema,
  type CreateTripFormState,
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
