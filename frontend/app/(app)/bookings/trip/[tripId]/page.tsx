import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { listBookableActivities } from "@backend/server/activities";
import { getConfirmedBookingForTrip } from "@backend/server/bookings";
import { listTripPlaceIds } from "@backend/server/plan";
import { getStayById, quoteStay } from "@backend/server/stays";
import { getTripForUser } from "@backend/server/trips";
import { tripNights } from "@backend/lib/budget/estimates";
import { haversineKm } from "@backend/lib/geo";
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
  const plannedStay = trip.stayId ? getStayById(trip.stayId) : null;
  const from = plannedStay
    ? { lat: plannedStay.latitude, lng: plannedStay.longitude }
    : (center ?? undefined);
  const stay = plannedStay
    ? quoteStay(plannedStay, {
        nights,
        units: trip.stayUnits,
        travellers: trip.travellers,
        distanceKm: center
          ? Math.round(
              haversineKm(
                center.lat,
                center.lng,
                plannedStay.latitude,
                plannedStay.longitude,
              ) * 10,
            ) / 10
          : 0,
      })
    : null;
  const activities = listBookableActivities(listTripPlaceIds(trip.id), from);

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm text-muted">
          <Link href="/bookings" className="hover:text-foreground">
            Bookings
          </Link>
        </p>
        <h1 className="mt-2 text-2xl font-semibold">Book {trip.title}</h1>
        <p className="text-sm text-muted">{trip.destination}</p>
      </div>
      <CheckoutForm
        tripId={trip.id}
        travellers={trip.travellers}
        stay={stay}
        activities={activities}
      />
    </section>
  );
}
