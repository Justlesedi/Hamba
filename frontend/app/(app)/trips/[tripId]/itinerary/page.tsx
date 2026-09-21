import { notFound } from "next/navigation";
import { listTripPlaceIds } from "@backend/server/plan";
import { listingsAround } from "@backend/server/nearby";
import { getStayById } from "@backend/server/stays";
import { getTripForUser } from "@backend/server/trips";
import { tripNights } from "@backend/lib/budget/estimates";
import { resolveDestinationCenter } from "@backend/lib/geocode";
import { ItineraryExplorer } from "@/components/itinerary/itinerary-explorer";
import { verifySession } from "@/lib/dal";
import { dateKey } from "@backend/lib/calendar/dates";

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

  const initialCenter = await resolveDestinationCenter(trip.destination);

  if (!initialCenter) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold">Plan</h1>
        <p className="text-sm text-muted">
          We could not place {trip.destination} on the map yet. Try a city name,
          such as Mbombela or Bloemfontein.
        </p>
      </section>
    );
  }

  const nights = tripNights(trip.startDate, trip.endDate);
  const confirmedStay = trip.stayId ? getStayById(trip.stayId) : null;
  const activityOrigin = confirmedStay
    ? { lat: confirmedStay.latitude, lng: confirmedStay.longitude }
    : initialCenter;
  const listings = listingsAround({
    stayOrigin: initialCenter,
    activityOrigin,
    nights,
    units: trip.stayUnits,
    travellers: trip.travellers,
    keepStayId: trip.stayId,
    keepActivityIds: listTripPlaceIds(trip.id),
  });

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Plan</h1>
        <p className="text-sm text-muted">{trip.destination}</p>
      </div>
      <ItineraryExplorer
        tripId={trip.id}
        destination={trip.destination}
        travellers={trip.travellers}
        nights={nights}
        startDate={dateKey(trip.startDate)}
        endDate={dateKey(trip.endDate)}
        initialCenter={initialCenter}
        initialStays={listings.stays}
        initialActivities={listings.activities}
        initialSelectedStayId={trip.stayId}
        initialStayUnits={trip.stayUnits}
        initialSelectedActivityIds={listTripPlaceIds(trip.id)}
      />
    </section>
  );
}
