import { notFound } from "next/navigation";
import { searchNearbyActivities } from "@backend/server/activities";
import { searchNearbyStays } from "@backend/server/stays";
import { listTripPlaceIds } from "@backend/server/plan";
import { getTripForUser } from "@backend/server/trips";
import { tripNights } from "@backend/lib/budget/estimates";
import { resolveDestinationCenter } from "@backend/lib/geocode";
import { ItineraryExplorer } from "@/components/itinerary/itinerary-explorer";
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

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Plan</h1>
        <p className="text-sm text-muted">
          Choose a stay and the places you want around {trip.destination}.
          Budget will only cost those choices.
        </p>
      </div>
      <ItineraryExplorer
        tripId={trip.id}
        destination={trip.destination}
        travellers={trip.travellers}
        nights={nights}
        initialCenter={initialCenter}
        initialStays={searchNearbyStays(initialCenter.lat, initialCenter.lng, {
          travellers: trip.travellers,
          nights,
        })}
        initialActivities={searchNearbyActivities(
          initialCenter.lat,
          initialCenter.lng,
        )}
        initialSelectedStayId={trip.stayId}
        initialSelectedActivityIds={listTripPlaceIds(trip.id)}
      />
    </section>
  );
}
