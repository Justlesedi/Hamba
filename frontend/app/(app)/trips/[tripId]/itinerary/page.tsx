import { notFound } from "next/navigation";
import { searchNearbyActivities } from "@backend/server/activities";
import { getTripForUser } from "@backend/server/trips";
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

  const initialActivities = searchNearbyActivities(
    initialCenter.lat,
    initialCenter.lng,
  );

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Plan</h1>
        <p className="text-sm text-muted">
          Nearby things to do around {trip.destination}.
        </p>
      </div>
      <ItineraryExplorer
        tripId={trip.id}
        destination={trip.destination}
        initialCenter={initialCenter}
        initialActivities={initialActivities}
      />
    </section>
  );
}
