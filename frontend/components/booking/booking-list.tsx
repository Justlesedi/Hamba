import Link from "next/link";
import { bookingStatusLabel } from "@backend/lib/booking";
import { formatZar } from "@backend/lib/money";
import type { Booking } from "@backend/types/booking";

function formatDates(start: Date, end: Date) {
  const fmt = new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return `${fmt.format(start)} – ${fmt.format(end)}`;
}

export function BookingList({ bookings }: { bookings: Booking[] }) {
  if (bookings.length === 0) {
    return (
      <p className="text-sm text-muted">
        No bookings yet. Open Bookings and reserve a stay, plus any activities
        that take a reservation.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {bookings.map((booking) => (
        <li key={booking.id}>
          <Link
            href={`/bookings/${booking.id}`}
            className="block rounded-2xl border border-border bg-card p-5 transition hover:border-accent"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">{booking.tripTitle}</h2>
                <p className="mt-1 text-sm text-muted">{booking.destination}</p>
                <p className="mt-3 text-sm">
                  {formatDates(booking.startDate, booking.endDate)} ·{" "}
                  {booking.stayName}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted">
                  {bookingStatusLabel(booking.status)}
                </p>
                <p className="mt-2 font-medium">
                  {formatZar(booking.totalCents)}
                </p>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
