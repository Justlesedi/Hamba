"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { createBookingAction } from "@/app/actions/bookings";
import { placePartyCostCents } from "@backend/lib/activities/costs";
import { formatZar } from "@backend/lib/money";
import type { NearbyActivity } from "@backend/types/activity";
import type { QuotedStay } from "@backend/types/stay";
import { StayPicker } from "@/components/booking/stay-picker";
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
  destination,
  travellers,
  stays,
  activities,
  suggestedStayId,
  suggestedActivityIds,
  budgetCents,
}: {
  tripId: string;
  destination: string;
  travellers: number;
  stays: QuotedStay[];
  activities: NearbyActivity[];
  suggestedStayId: string | null;
  suggestedActivityIds: string[];
  budgetCents: number | null;
}) {
  const [state, action, pending] = useActionState(
    createBookingAction,
    undefined,
  );
  const [stayId, setStayId] = useState<string | null>(
    suggestedStayId && stays.some((stay) => stay.id === suggestedStayId)
      ? suggestedStayId
      : null,
  );
  const [activityIds, setActivityIds] = useState<string[]>(() =>
    suggestedActivityIds.filter((id) =>
      activities.some((place) => place.id === id),
    ),
  );

  const stay = stays.find((listing) => listing.id === stayId) ?? null;
  const selectedActivities = useMemo(
    () => activities.filter((place) => activityIds.includes(place.id)),
    [activities, activityIds],
  );
  const placesTotalCents = selectedActivities.reduce(
    (sum, place) => sum + activityPartyCents(place, travellers),
    0,
  );
  const stayTotalCents = stay?.totalCents ?? 0;
  const totalCents = stayTotalCents + placesTotalCents;
  const overBudget =
    budgetCents != null && budgetCents - totalCents < 0;
  const planHref = `/trips/${tripId}/itinerary`;
  const budgetHref = `/trips/${tripId}/budget`;

  function toggleActivity(id: string) {
    setActivityIds((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="font-medium">Stay</h2>
        <p className="mt-1 text-sm text-muted">
          Book a hotel, guesthouse, or lodge for these dates. This does not
          change what you chose on Plan.
        </p>
        <div className="mt-4">
          <StayPicker stays={stays} selectedStayId={stayId} onSelect={setStayId} />
        </div>
      </Card>

      <Card>
        <h2 className="font-medium">Activities that need a booking</h2>
        <p className="mt-1 text-sm text-muted">
          Only paid activities that take a reservation. Food, free sights, and
          pay-on-arrival parks stay off this list. Transport is not booked here.
        </p>
        {activities.length === 0 ? (
          <p className="mt-3 text-sm text-muted">
            Nothing around {destination} needs a booking right now. You can still
            book a stay, or{" "}
            <Link href={planHref} className="font-medium hover:text-accent">
              forecast other places on Plan
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {activities.map((place) => {
              const selected = activityIds.includes(place.id);
              return (
                <li key={place.id} className="flex items-start gap-3 py-3">
                  <input
                    type="checkbox"
                    className="mt-1 size-4 shrink-0"
                    checked={selected}
                    onChange={() => toggleActivity(place.id)}
                    aria-label={`Book ${place.name}`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-medium">{place.name}</p>
                      <OpenBadge status={place.openStatus} />
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      {place.area} · {place.company}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-medium">
                    {formatZar(activityPartyCents(place, travellers))}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <Card>
        <form action={action} className="space-y-5">
          <input type="hidden" name="tripId" value={tripId} />
          {stayId ? <input type="hidden" name="stayId" value={stayId} /> : null}
          {activityIds.map((id) => (
            <input key={id} type="hidden" name="activityId" value={id} />
          ))}

          <div className="rounded-xl bg-background px-4 py-3">
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-muted">Stay</span>
              <span>{formatZar(stayTotalCents)}</span>
            </div>
            <div className="mt-2 flex justify-between gap-4 text-sm">
              <span className="text-muted">Bookable activities</span>
              <span>{formatZar(placesTotalCents)}</span>
            </div>
            <div className="mt-3 flex justify-between gap-4 border-t border-border pt-3">
              <span className="font-medium">Booking total</span>
              <span className="text-lg font-semibold">
                {formatZar(totalCents)}
              </span>
            </div>
            {budgetCents != null ? (
              <p
                className={`mt-2 text-sm ${overBudget ? "text-accent" : "text-muted"}`}
              >
                {overBudget
                  ? `This is ${formatZar(totalCents - budgetCents)} over your ${formatZar(budgetCents)} budget forecast.`
                  : `Your budget forecast on this trip is ${formatZar(budgetCents)}.`}
              </p>
            ) : (
              <p className="mt-2 text-sm text-muted">
                Set a number on{" "}
                <Link href={budgetHref} className="font-medium hover:text-accent">
                  Budget
                </Link>{" "}
                if you want to compare this total. Budget is a forecast only.
              </p>
            )}
          </div>

          {state?.message ? (
            <p className="text-sm text-accent">{state.message}</p>
          ) : null}

          <p className="text-sm text-muted">
            Hamba records the stay and any reserved activities. Paying the
            property and operator comes later. Uber, buses, and fuel are not
            booked here.
          </p>
          <Button type="submit" disabled={pending || !stayId}>
            {pending
              ? "Booking…"
              : stayId
                ? "Confirm stay and activities"
                : "Choose a stay to book"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
