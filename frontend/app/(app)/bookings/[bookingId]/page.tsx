import { notFound } from "next/navigation";
import { getBookingForUser } from "@backend/server/bookings";
import { BookingConfirmation } from "@/components/booking/booking-confirmation";
import { verifySession } from "@/lib/dal";

export default async function Page({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { userId } = await verifySession();
  const { bookingId } = await params;
  const booking = getBookingForUser(userId, bookingId);

  if (!booking) {
    notFound();
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Booking</h1>
        <p className="text-sm text-muted">
          {booking.stayName} in {booking.destination}
        </p>
      </div>
      <BookingConfirmation
        booking={booking}
        tripHref={`/trips/${booking.tripId}`}
      />
    </section>
  );
}
