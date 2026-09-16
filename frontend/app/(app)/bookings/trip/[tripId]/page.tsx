import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getConfirmedBookingForTrip } from "@backend/server/bookings";
import { searchNearbyActivities } from "@backend/server/activities";
import { listTripPlaceIds } from "@backend/server/plan";
import { searchNearbyStays } from "@backend/server/stays";
import { getTripForUser } from "@backend/server/trips";
import { tripNights } from "@backend/lib/budget/estimates";
import { resolveDestinationCenter } from "@backend/lib/geocode";
import { CheckoutForm } from "@/components/booking/checkout-form";
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
    notFound();
  }

  const existing = getConfirmedBookingForTrip(userId, tripId);
  if (existing) {
    redirect(`/bookings/${existing.id}`);
  }

  const center = await resolveDestinationCenter(trip.destination);
  const nights = tripNights(trip.startDate, trip.endDate);
  const stays = center
    ? searchNearbyStays(center.lat, center.lng, {
        travellers: trip.travellers,
        nights,
      })
    : [];
  const nearby = center
    ? searchNearbyActivities(center.lat, center.lng)
    : [];
  const bookableActivities = nearby.filter(
    (place) =>
      place.requiresBooking && place.openStatus.state !== "closed",
  );
  const plannedIds = new Set(listTripPlaceIds(trip.id));

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm text-muted">
          <Link href="/bookings" className="hover:text-foreground">
            Bookings
          </Link>
        </p>
        <h1 className="mt-2 text-2xl font-semibold">Book {trip.title}</h1>
        <p className="text-sm text-muted">
          Reserve a stay in {trip.destination}, plus any activities that need a
          booking. Plan and Budget stay as a forecast and are not changed here.
        </p>
      </div>
      <CheckoutForm
        tripId={trip.id}
        destination={trip.destination}
        travellers={trip.travellers}
        stays={stays}
        activities={bookableActivities}
        suggestedStayId={trip.stayId}
        suggestedActivityIds={bookableActivities
          .filter((place) => plannedIds.has(place.id))
          .map((place) => place.id)}
        budgetCents={trip.budgetCents}
      />
    </section>
  );
}
