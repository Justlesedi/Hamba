import Link from "next/link";
import { listTrips } from "@backend/server/trips";
import { TripList } from "@/components/trip/trip-list";
import { verifySession } from "@/lib/dal";

export const metadata = { title: "Trips" };

export default async function Page() {
  const { userId } = await verifySession();
  const trips = await listTrips(userId);

  return (
    <section className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="kicker">Your road</p>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl">Trips</h1>
          <p className="mt-2 max-w-md text-muted">
            Each one is a stay, a few days, and the land you will walk.
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
