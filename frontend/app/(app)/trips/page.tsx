import Link from "next/link";
import { listTrips } from "@backend/server/trips";
import { TripList } from "@/components/trip/trip-list";
import { verifySession } from "@/lib/dal";

export default async function Page() {
  const { userId } = await verifySession();
  const trips = await listTrips(userId);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Trips</h1>
          <p className="text-sm text-muted">
            Your planned trips, with dates and travellers.
          </p>
        </div>
        <Link
          href="/trips/new"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-hover"
        >
          New trip
        </Link>
      </div>
      <TripList trips={trips} />
    </section>
  );
}
