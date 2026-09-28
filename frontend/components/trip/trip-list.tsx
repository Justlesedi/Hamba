import { TripCard } from "@/components/trip/trip-card";
import type { Trip } from "@backend/types/trip";

export function TripList({ trips }: { trips: Trip[] }) {
  if (trips.length === 0) {
    return (
      <p className="max-w-md text-muted">
        No trips yet. Name a destination and the map will meet you there.
      </p>
    );
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2">
      {trips.map((trip) => (
        <li key={trip.id}>
          <TripCard trip={trip} />
        </li>
      ))}
    </ul>
  );
}
