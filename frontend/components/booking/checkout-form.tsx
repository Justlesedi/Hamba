"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createBookingAction } from "@/app/actions/bookings";
import { placePartyCostCents } from "@backend/lib/activities/costs";
import { bookingCommissionCents, bookingCommissionLabel } from "@backend/lib/booking";
import { formatTravelAway } from "@backend/lib/geo";
import { formatZar } from "@backend/lib/money";
import type { NearbyActivity } from "@backend/types/activity";
import { stayKindLabel, stayLayoutLabel, type QuotedStay } from "@backend/types/stay";
import { OpenBadge } from "@/components/plan/open-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function activityPartyCents(place: NearbyActivity, travellers: number) {
  return placePartyCostCents(place.estimatedCostCents, travellers, {
    priceUnit: place.priceUnit,
    typicalHours: place.typicalHours,
  });
}

export function CheckoutForm({
  tripId,
  travellers,
  stay,
  activities,
}: {
  tripId: string;
  travellers: number;
  stay: QuotedStay | null;
  activities: NearbyActivity[];
}) {
  const [state, action, pending] = useActionState(
    createBookingAction,
    undefined,
  );
  const planHref = `/trips/${tripId}/itinerary`;
  const placesTotalCents = activities.reduce(
    (sum, place) => sum + activityPartyCents(place, travellers),
    0,
  );
  const stayTotalCents = stay?.totalCents ?? 0;
  const commissionCents = bookingCommissionCents(stayTotalCents + placesTotalCents);
  const totalCents = stayTotalCents + placesTotalCents + commissionCents;

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="font-medium">Accommodation</h2>
        {stay ? (
          <div className="mt-4">
            <div className="flex items-start justify-between gap-3">
              <p className="font-medium">{stay.name}</p>
              <OpenBadge status={stay.openStatus} />
            </div>
            <p className="mt-1 text-sm text-muted">
              {stayKindLabel(stay.kind)} · {stay.area} ·{" "}
              {formatTravelAway(stay.distanceKm)} · {stay.units}{" "}
              {stay.kind === "house"
                ? stay.units === 1
                  ? "house"
                  : "houses"
                : stay.units === 1
                  ? "room"
                  : "rooms"}{" "}
              · {stayLayoutLabel(stay)}
            </p>
            <p className="mt-1 text-sm font-medium">
              {formatZar(stay.totalCents)}
            </p>
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
        {activities.length === 0 ? (
          <p className="mt-3 text-sm text-muted">
            No activities from your Plan need a booking. Add places on{" "}
            <Link href={planHref} className="font-medium hover:text-accent">
              Plan
            </Link>
            , or Advance with the stay only.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {activities.map((place) => (
              <li key={place.id} className="flex items-start justify-between gap-3 py-3">
                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-medium">{place.name}</p>
                    <OpenBadge status={place.openStatus} />
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {place.area} · {formatTravelAway(place.distanceKm)}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-medium">
                  {formatZar(activityPartyCents(place, travellers))}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <form action={action} className="space-y-5">
          <input type="hidden" name="tripId" value={tripId} />
          {stay ? <input type="hidden" name="stayId" value={stay.id} /> : null}
          {activities.map((place) => (
            <input key={place.id} type="hidden" name="activityId" value={place.id} />
          ))}

          <div className="rounded-xl bg-background px-4 py-3">
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-muted">Stay</span>
              <span>{formatZar(stayTotalCents)}</span>
            </div>
            <div className="mt-2 flex justify-between gap-4 text-sm">
              <span className="text-muted">Activities</span>
              <span>{formatZar(placesTotalCents)}</span>
            </div>
            <div className="mt-2 flex justify-between gap-4 text-sm">
              <span className="text-muted">{bookingCommissionLabel()}</span>
              <span>{formatZar(commissionCents)}</span>
            </div>
            <div className="mt-3 flex justify-between gap-4 border-t border-border pt-3">
              <span className="font-medium">Booking total</span>
              <span className="text-lg font-semibold">
                {formatZar(totalCents)}
              </span>
            </div>
          </div>

          {state?.message ? (
            <p className="text-sm text-accent">{state.message}</p>
          ) : null}

          <p className="text-sm text-muted">
            Advance finalizes these choices on Hamba. Sending them to the
            property and activity operators comes later.
          </p>
          <Button type="submit" disabled={pending || !stay}>
            {pending ? "Saving…" : stay ? "Advance" : "Confirm a stay on Plan"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
