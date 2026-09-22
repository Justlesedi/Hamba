import Link from "next/link";
import { listBookingsForUser } from "@backend/server/bookings";
import { listTrips } from "@backend/server/trips";
import { BookingList } from "@/components/booking/booking-list";
import { verifySession } from "@/lib/dal";

export default async function Page() {
  const { userId } = await verifySession();
  const bookings = listBookingsForUser(userId);
  const trips = listTrips(userId);

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Bookings</h1>
        <p className="text-sm text-muted">
          Hamba does not take payment. Open a trip to book on that place’s
          site, or travel there if it has none.
        </p>
      </div>

      {trips.length > 0 ? (
        <div className="space-y-3">
          <h2 className="font-medium">Book a trip</h2>
          <ul className="space-y-3">
            {trips.map((trip) => (
              <li key={trip.id}>
                <Link
                  href={`/bookings/trip/${trip.id}`}
                  className="block rounded-2xl border border-border bg-card p-5 transition hover:border-accent"
                >
                  <h3 className="text-lg font-semibold">{trip.title}</h3>
                  <p className="mt-1 text-sm text-muted">{trip.destination}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="space-y-3">
        <h2 className="font-medium">Your bookings</h2>
        <BookingList bookings={bookings} />
      </div>
    </section>
  );
}
