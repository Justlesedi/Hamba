import Image from "next/image";
import Link from "next/link";
import { DeleteTripButton } from "@/components/trip/delete-trip-button";
import { sceneFor } from "@/lib/media";
import type { Trip } from "@backend/types/trip";

function formatDates(start: Date, end: Date) {
  const fmt = new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return `${fmt.format(start)} – ${fmt.format(end)}`;
}

export function TripCard({ trip }: { trip: Trip }) {
  const scene = sceneFor(trip.destination);

  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-lift transition hover:-translate-y-0.5 hover:border-accent">
      <Link href={`/trips/${trip.id}`} className="block">
        <div className="relative aspect-[16/9] overflow-hidden bg-dusk">
          <Image
            src={scene.src}
            alt={scene.alt}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dusk/80 via-dusk/10 to-transparent" />
          <p className="absolute bottom-4 left-5 font-display text-2xl text-sand">
            {trip.title}
          </p>
        </div>
        <div className="p-5">
          <p className="text-sm text-muted">{trip.destination}</p>
          <p className="mt-2 text-sm">
            {formatDates(trip.startDate, trip.endDate)} · {trip.travellers}{" "}
            {trip.travellers === 1 ? "traveller" : "travellers"}
          </p>
        </div>
      </Link>
      <div className="px-5 pb-4">
        <DeleteTripButton tripId={trip.id} label="Delete" />
      </div>
    </article>
  );
}
