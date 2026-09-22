"use client";

import Link from "next/link";
import { placePartyCostCents } from "@backend/lib/activities/costs";
import {
  activityHandoff,
  stayHandoff,
  type BookingHandoff,
} from "@backend/lib/booking-links";
import { formatZar } from "@backend/lib/money";
import type { NearbyActivity } from "@backend/types/activity";
import { type QuotedStay } from "@backend/types/stay";
import { Card } from "@/components/ui/card";

function activityPartyCents(place: NearbyActivity, travellers: number) {
  return placePartyCostCents(place.estimatedCostCents, travellers, {
    priceUnit: place.priceUnit,
    typicalHours: place.typicalHours,
  });
}

function stayUnitsLabel(stay: QuotedStay) {
  if (stay.kind === "house") {
    return stay.units === 1 ? "1 house" : `${stay.units} houses`;
  }
  return stay.units === 1 ? "1 room" : `${stay.units} rooms`;
}

function HandoffAction({ handoff }: { handoff: BookingHandoff }) {
  if (handoff.mode === "in_person" || !handoff.href) {
    return (
      <p className="mt-3 text-sm text-muted">
        You have to travel there yourself. This place does not take bookings
        online.
      </p>
    );
  }

  return (
    <div className="mt-3 space-y-2">
      <a
        href={handoff.href}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-hover"
      >
        {handoff.label}
      </a>
      <p className="text-sm text-muted">Hamba sends {handoff.carries}</p>
    </div>
  );
}

export function CheckoutForm({
  tripId,
  travellers,
  startDate,
  endDate,
  stay,
  activities,
}: {
  tripId: string;
  travellers: number;
  startDate: string;
  endDate: string;
  stay: QuotedStay | null;
  activities: NearbyActivity[];
}) {
  const planHref = `/trips/${tripId}/itinerary`;
  const bookable = activities.filter(
    (place) => place.ticketChannel === "online",
  );
  const inPerson = activities.filter(
    (place) => place.ticketChannel === "venue",
  );
  const stayBooking = stay
    ? stayHandoff(stay, {
        checkIn: startDate,
        checkOut: endDate,
        travellers,
        units: stay.units,
      })
    : null;

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="font-medium">Accommodation</h2>
        {stay && stayBooking ? (
          <div className="mt-4">
            <p className="font-medium">{stay.name}</p>
            <p className="mt-1 text-sm text-muted">
              {stay.area} · {stayUnitsLabel(stay)} · {stayBooking.platform}
            </p>
            <p className="mt-1 text-sm text-muted">
              About {formatZar(stay.totalCents)}
            </p>
            <HandoffAction handoff={stayBooking} />
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted">
            Confirm a stay on{" "}
            <Link href={planHref} className="font-medium hover:text-accent">
              Plan
            </Link>{" "}
            first.
          </p>
        )}
      </Card>

      <Card>
        <h2 className="font-medium">Activities</h2>
        {bookable.length === 0 && inPerson.length === 0 ? (
          <p className="mt-3 text-sm text-muted">
            No ticketed activities from{" "}
            <Link href={planHref} className="font-medium hover:text-accent">
              Plan
            </Link>
            .
          </p>
        ) : (
          <div className="mt-4 space-y-6">
            {bookable.length > 0 ? (
              <section>
                <h3 className="text-sm font-medium">Buy tickets</h3>
                <ul className="mt-2 divide-y divide-border">
                  {bookable.map((place) => {
                    const handoff = activityHandoff(place, {
                      visitDate: startDate,
                      travellers,
                    });
                    return (
                      <li key={place.id} className="py-3">
                        <p className="font-medium">{place.name}</p>
                        <p className="mt-1 text-sm text-muted">
                          {handoff.platform} · About{" "}
                          {formatZar(activityPartyCents(place, travellers))}
                        </p>
                        <HandoffAction handoff={handoff} />
                      </li>
                    );
                  })}
                </ul>
              </section>
            ) : null}
            {inPerson.length > 0 ? (
              <section>
                <h3 className="text-sm font-medium">Travel there yourself</h3>
                <ul className="mt-2 divide-y divide-border">
                  {inPerson.map((place) => (
                    <li key={place.id} className="py-3">
                      <p className="font-medium">{place.name}</p>
                      <p className="mt-1 text-sm text-muted">{place.company}</p>
                      <p className="mt-3 text-sm text-muted">
                        You have to travel there yourself. This place does not
                        take bookings online.
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        )}
      </Card>
    </div>
  );
}
