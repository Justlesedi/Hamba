"use client";

import { useActionState } from "react";
import Link from "next/link";
import { cancelBookingAction } from "@/app/actions/bookings";
import { bookingStatusLabel } from "@backend/lib/booking";
import { formatZar } from "@backend/lib/money";
import type { Booking } from "@backend/types/booking";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(value);
}

export function BookingConfirmation({
  booking,
  tripHref,
}: {
  booking: Booking;
  tripHref: string;
}) {
  const [state, action, pending] = useActionState(
    cancelBookingAction,
    undefined,
  );
  const activities = booking.places.filter((place) => place.kind !== "food");
  const cancelled = booking.status === "cancelled";
  const showFlights = Boolean(booking.outbound || booking.inbound);
  const showTransport = booking.transportMode !== "none" || booking.transportCents > 0;

  return (
    <div className="space-y-6">
      <Card>
        <p className="text-sm text-muted">{bookingStatusLabel(booking.status)}</p>
        <h2 className="mt-1 text-xl font-semibold">{booking.tripTitle}</h2>
        <p className="mt-1 text-muted">{booking.destination}</p>
        <p className="mt-3 text-sm">
          {formatDate(booking.startDate)} – {formatDate(booking.endDate)} ·{" "}
          {booking.travellers}{" "}
          {booking.travellers === 1 ? "traveller" : "travellers"}
        </p>
        <p className="mt-4 text-2xl font-semibold">
          {formatZar(booking.totalCents)}
        </p>
        <p className="mt-2 text-sm text-muted">
          Recorded on Hamba. Paying the stay and activity operators comes later.
        </p>
      </Card>

      <Card>
        <h2 className="font-medium">Stay</h2>
        <p className="mt-1 text-lg font-semibold">{booking.stayName}</p>
        <p className="mt-1 text-sm text-muted">{booking.stayArea}</p>
        <p className="mt-3 text-sm font-medium">
          {formatZar(booking.stayTotalCents)}
        </p>
      </Card>

      <Card>
        <h2 className="font-medium">Activities</h2>
        {activities.length === 0 ? (
          <p className="mt-2 text-sm text-muted">
            No reserved activities on this booking.
          </p>
        ) : (
          <ol className="mt-2 list-decimal space-y-2 pl-5">
            {activities.map((place) => (
              <li key={place.activityId} className="pl-1">
                <div className="flex justify-between gap-4">
                  <span>{place.name}</span>
                  <span className="text-sm font-medium">
                    {formatZar(place.amountCents)}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        )}
      </Card>

      {showFlights ? (
        <Card>
          <h2 className="font-medium">Flights</h2>
          <ul className="mt-2 divide-y divide-border">
            {booking.outbound ? (
              <li className="flex justify-between gap-4 py-3">
                <div>
                  <p className="text-sm text-muted">Outbound</p>
                  <p className="mt-1">{booking.outbound.label}</p>
                </div>
                <p className="text-sm font-medium">
                  {formatZar(booking.outbound.amountCents)}
                </p>
              </li>
            ) : null}
            {booking.inbound ? (
              <li className="flex justify-between gap-4 py-3">
                <div>
                  <p className="text-sm text-muted">Return</p>
                  <p className="mt-1">{booking.inbound.label}</p>
                </div>
                <p className="text-sm font-medium">
                  {formatZar(booking.inbound.amountCents)}
                </p>
              </li>
            ) : null}
          </ul>
        </Card>
      ) : null}

      {showTransport ? (
        <Card>
          <h2 className="font-medium">Transport</h2>
          <p className="mt-2 text-sm text-muted">
            Older bookings could include local transport. New bookings do not.
          </p>
          <p className="mt-3 text-sm font-medium">
            {formatZar(booking.transportCents)}
          </p>
        </Card>
      ) : null}

      {cancelled ? (
        <p className="text-sm text-muted">
          This booking was cancelled. You can book a stay and activities again
          from Bookings.
        </p>
      ) : null}

      <p className="text-sm">
        <Link href={tripHref} className="font-medium hover:text-accent">
          Back to trip
        </Link>
        {" · "}
        <Link href="/bookings" className="font-medium hover:text-accent">
          All bookings
        </Link>
      </p>

      {cancelled ? null : (
        <form action={action} className="pt-2">
          <input type="hidden" name="bookingId" value={booking.id} />
          {state?.message ? (
            <p className="text-sm text-accent">{state.message}</p>
          ) : null}
          <Button type="submit" variant="ghost" className="px-0" disabled={pending}>
            {pending ? "Cancelling…" : "Cancel this booking"}
          </Button>
        </form>
      )}
    </div>
  );
}
