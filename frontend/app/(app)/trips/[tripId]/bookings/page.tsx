import { redirect } from "next/navigation";
import { getConfirmedBookingForTrip } from "@backend/server/bookings";
import { getTripForUser } from "@backend/server/trips";
import { verifySession } from "@/lib/dal";

export default async function Page({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { userId } = await verifySession();
  const { tripId } = await params;
  const trip = await getTripForUser(userId, tripId);

  if (!trip) {
    redirect("/bookings");
  }

  const booking = getConfirmedBookingForTrip(userId, tripId);
  if (booking) {
    redirect(`/bookings/${booking.id}`);
  }

  redirect(`/bookings/trip/${tripId}`);
}
