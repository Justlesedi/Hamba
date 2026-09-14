import { TripCard } from "@/components/trip/trip-card";
import type { Trip } from "@backend/types/trip";

export function TripList({ trips }: { trips: Trip[] }) {
  if (trips.length === 0) {
    return (
      <p className="text-muted">
        No trips yet. Create one to start planning.
      </p>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {trips.map((trip) => (
        <li key={trip.id}>
          <TripCard trip={trip} />
        </li>
      ))}
    </ul>
  );
}
