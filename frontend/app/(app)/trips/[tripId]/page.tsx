import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTripForUser } from "@backend/server/trips";
import { formatZarFromCents } from "@backend/lib/money";
import { Card } from "@/components/ui/card";
import { DeleteTripButton } from "@/components/trip/delete-trip-button";
import { verifySession } from "@/lib/dal";
import { sceneFor } from "@/lib/media";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(value);
}

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

  const scene = sceneFor(trip.destination);

  return (
    <section className="space-y-8">
      <div className="relative overflow-hidden rounded-[2rem] bg-dusk text-sand shadow-lift">
        <div className="relative aspect-[21/9] min-h-56">
          <Image
            src={scene.src}
            alt={scene.alt}
            fill
            priority
            sizes="(min-width: 1024px) 72rem, 100vw"
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dusk/85 via-dusk/40 to-transparent" />
          <div className="absolute bottom-0 left-0 max-w-xl p-8">
            <p className="text-sm text-sand/70">
              <Link href="/trips" className="hover:text-sand">
                Trips
              </Link>
            </p>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl">{trip.title}</h1>
            <p className="mt-2 text-sand/80">{trip.destination}</p>
          </div>
        </div>
      </div>
      <Card className="grid gap-6 sm:grid-cols-3">
        <div>
          <p className="kicker">Dates</p>
          <p className="mt-2 font-medium">
            {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
          </p>
        </div>
        <div>
          <p className="kicker">Travellers</p>
          <p className="mt-2 font-medium">{trip.travellers}</p>
        </div>
        <div>
          <p className="kicker">Budget</p>
          <p className="mt-2 font-medium">
            {trip.budgetCents == null ? (
              <Link href={`/trips/${trip.id}/budget`} className="hover:text-accent">
                Set on Budget
              </Link>
            ) : (
              formatZarFromCents(trip.budgetCents)
            )}
          </p>
        </div>
      </Card>
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <p className="kicker">Next</p>
          <p className="mt-3 max-w-md text-muted">
            Plan the neighbourhood, read the forecast, then book on the
            operator’s own site.
          </p>
        </div>
        <p className="text-sm sm:text-right">
          <Link
            href={`/trips/${trip.id}/itinerary`}
            className="font-medium hover:text-accent"
          >
            Plan
          </Link>
          {" · "}
          <Link
            href={`/trips/${trip.id}/budget`}
            className="font-medium hover:text-accent"
          >
            Budget
          </Link>
          {" · "}
          <Link
            href={`/bookings/trip/${trip.id}`}
            className="font-medium hover:text-accent"
          >
            Book
          </Link>
        </p>
      </div>
      <DeleteTripButton tripId={trip.id} />
    </section>
  );
}
