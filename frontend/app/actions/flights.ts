"use server";

import { revalidatePath } from "next/cache";
import { chooseFlightsForTrip } from "@backend/server/flights";
import {
  chooseFlightsSchema,
  type ChooseFlightsFormState,
} from "@backend/lib/validation";
import { verifySession } from "@/lib/dal";

function revalidateTrip(tripId: string) {
  revalidatePath(`/trips/${tripId}`);
  revalidatePath(`/trips/${tripId}/budget`);
  revalidatePath(`/bookings/trip/${tripId}`);
}

export async function chooseFlightsAction(
  _state: ChooseFlightsFormState,
  formData: FormData,
): Promise<ChooseFlightsFormState> {
  const { userId } = await verifySession();
  const parsed = chooseFlightsSchema.safeParse({
    tripId: formData.get("tripId"),
    outboundFlightId: formData.get("outboundFlightId") ?? "",
    returnFlightId: formData.get("returnFlightId") ?? "",
  });

  if (!parsed.success) {
    return { message: "Choose a flight from the list." };
  }

  const outboundFlightId = parsed.data.outboundFlightId || null;
  const returnFlightId = parsed.data.returnFlightId || null;

  try {
    const trip = chooseFlightsForTrip(userId, parsed.data.tripId, {
      outboundFlightId,
      returnFlightId,
    });
    if (!trip) {
      return { message: "Could not save these flights." };
    }
    revalidateTrip(trip.id);
    return {
      outboundFlightId: trip.outboundFlightId,
      returnFlightId: trip.returnFlightId,
    };
  } catch {
    return { message: "Could not save these flights. Please try again." };
  }
}
