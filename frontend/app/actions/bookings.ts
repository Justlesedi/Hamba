"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  BookingError,
  cancelBooking,
  createBooking,
  deleteBooking,
  getBookingForUser,
} from "@backend/server/bookings";
import {
  cancelBookingSchema,
  createBookingSchema,
  deleteBookingSchema,
  type CancelBookingFormState,
  type CreateBookingFormState,
  type DeleteBookingFormState,
} from "@backend/lib/validation";
import { verifySession } from "@/lib/dal";

function revalidateBooking(tripId: string, bookingId?: string) {
  revalidatePath("/bookings");
  revalidatePath(`/bookings/trip/${tripId}`);
  revalidatePath(`/trips/${tripId}`);
  revalidatePath(`/trips/${tripId}/budget`);
  revalidatePath(`/trips/${tripId}/itinerary`);
  if (bookingId) {
    revalidatePath(`/bookings/${bookingId}`);
  }
}

export async function createBookingAction(
  _state: CreateBookingFormState,
  formData: FormData,
): Promise<CreateBookingFormState> {
  const { userId } = await verifySession();
  const parsed = createBookingSchema.safeParse({
    tripId: formData.get("tripId"),
    stayId: formData.get("stayId"),
    activityIds: formData.getAll("activityId"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Choose a stay to book.",
    };
  }

  let booking;
  try {
    booking = createBooking(userId, parsed.data.tripId, {
      stayId: parsed.data.stayId,
      activityIds: parsed.data.activityIds,
    });
    if (!booking) {
      return { message: "Trip not found." };
    }
  } catch (error) {
    if (error instanceof BookingError) {
      return { message: error.message };
    }
    return { message: "Could not book this trip. Please try again." };
  }

  revalidateBooking(booking.tripId, booking.id);
  redirect(`/bookings/${booking.id}`);
}

export async function cancelBookingAction(
  _state: CancelBookingFormState,
  formData: FormData,
): Promise<CancelBookingFormState> {
  const { userId } = await verifySession();
  const parsed = cancelBookingSchema.safeParse({
    bookingId: formData.get("bookingId"),
  });

  if (!parsed.success) {
    return { message: "Booking is missing." };
  }

  const existing = getBookingForUser(userId, parsed.data.bookingId);
  if (!existing) {
    return { message: "Booking not found." };
  }

  try {
    const booking = cancelBooking(userId, parsed.data.bookingId);
    if (!booking) {
      return { message: "Booking not found." };
    }
    revalidateBooking(booking.tripId, booking.id);
  } catch {
    return { message: "Could not cancel this booking. Please try again." };
  }

  redirect(`/bookings/${existing.id}`);
}

export async function deleteBookingAction(
  _state: DeleteBookingFormState,
  formData: FormData,
): Promise<DeleteBookingFormState> {
  const { userId } = await verifySession();
  const parsed = deleteBookingSchema.safeParse({
    bookingId: formData.get("bookingId"),
  });

  if (!parsed.success) {
    return { message: "Booking is missing." };
  }

  const existing = getBookingForUser(userId, parsed.data.bookingId);
  if (!existing) {
    return { message: "Booking not found." };
  }

  try {
    const booking = deleteBooking(userId, parsed.data.bookingId);
    if (!booking) {
      return { message: "Booking not found." };
    }
    revalidateBooking(booking.tripId);
  } catch {
    return { message: "Could not delete this booking. Please try again." };
  }

  redirect("/bookings");
}
