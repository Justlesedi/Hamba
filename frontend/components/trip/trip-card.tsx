import Link from "next/link";
import { DeleteTripButton } from "@/components/trip/delete-trip-button";
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
  return (
    <div className="rounded-2xl border border-border bg-card p-5 transition hover:border-accent">
      <Link href={`/trips/${trip.id}`} className="block">
        <h2 className="text-lg font-semibold">{trip.title}</h2>
        <p className="mt-1 text-sm text-muted">{trip.destination}</p>
        <p className="mt-3 text-sm">
          {formatDates(trip.startDate, trip.endDate)} · {trip.travellers}{" "}
          {trip.travellers === 1 ? "traveller" : "travellers"}
        </p>
      </Link>
      <div className="mt-4">
        <DeleteTripButton tripId={trip.id} label="Delete" />
      </div>
    </div>
  );
}
