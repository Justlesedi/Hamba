import Image from "next/image";
import Link from "next/link";
import { listBookingsForUser } from "@backend/server/bookings";
import { listTrips } from "@backend/server/trips";
import { BookingList } from "@/components/booking/booking-list";
import { verifySession } from "@/lib/dal";
import { sceneFor } from "@/lib/media";

export const metadata = { title: "Bookings" };

export default async function Page() {
  const { userId } = await verifySession();
  const bookings = listBookingsForUser(userId);
  const trips = listTrips(userId);

  return (
    <section className="space-y-12">
      <div>
        <p className="kicker">The door</p>
        <h1 className="mt-2 font-display text-4xl">Bookings</h1>
        <p className="mt-2 max-w-lg text-muted">
          We do not take payment. Open a trip to book on that place’s site, or
          visit if they have none.
        </p>
      </div>

      {trips.length > 0 ? (
        <div className="space-y-5">
          <h2 className="font-display text-2xl">Book a trip</h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {trips.map((trip) => {
              const scene = sceneFor(trip.destination);
              return (
                <li key={trip.id}>
                  <Link
                    href={`/bookings/trip/${trip.id}`}
                    className="group block overflow-hidden rounded-[1.5rem] border border-border bg-card transition hover:border-accent"
                  >
                    <div className="relative h-28 overflow-hidden bg-dusk">
                      <Image
                        src={scene.src}
                        alt=""
                        fill
                        sizes="(min-width: 640px) 50vw, 100vw"
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-xl">{trip.title}</h3>
                      <p className="mt-1 text-sm text-muted">{trip.destination}</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <div className="space-y-5">
        <h2 className="font-display text-2xl">Your bookings</h2>
        <BookingList bookings={bookings} />
      </div>
    </section>
  );
}
