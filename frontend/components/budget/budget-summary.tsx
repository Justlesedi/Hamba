"use client";

import { useActionState } from "react";
import Link from "next/link";
import { forecastBudgetAction } from "@/app/actions/budget";
import { formatZar } from "@backend/lib/money";
import type {
  BudgetForecast,
  ForecastActivity,
  TransportLeg,
} from "@backend/types/budget";
import { OpenBadge } from "@/components/plan/open-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function BudgetSummary({
  tripId,
  initialBudgetZar,
  initialForecast,
}: {
  tripId: string;
  initialBudgetZar?: number;
  initialForecast?: BudgetForecast | null;
}) {
  const [state, action, pending] = useActionState(
    forecastBudgetAction,
    initialForecast ? { forecast: initialForecast } : undefined,
  );
  const forecast = state?.forecast ?? initialForecast ?? null;
  const budgetValue =
    forecast?.budgetCents != null
      ? String(Math.round(forecast.budgetCents / 100))
      : initialBudgetZar
        ? String(initialBudgetZar)
        : "";

  return (
    <div className="space-y-6">
      <Card>
        <form action={action} className="space-y-4" key={budgetValue || "new"}>
          <input type="hidden" name="tripId" value={tripId} />
          <Input
            label="Trip budget in ZAR"
            name="budgetZar"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="15000"
            defaultValue={budgetValue}
            onInput={(event) => {
              event.currentTarget.value = event.currentTarget.value.replace(
                /\D/g,
                "",
              );
            }}
            error={state?.errors?.budgetZar?.[0]}
          />
          {state?.message ? (
            <p className="text-sm text-accent">{state.message}</p>
          ) : null}
          <Button disabled={pending}>
            {pending ? "Updating…" : "Update budget"}
          </Button>
        </form>
      </Card>

      {forecast ? (
        <ForecastResults tripId={tripId} forecast={forecast} />
      ) : null}
    </div>
  );
}

function ForecastResults({
  tripId,
  forecast,
}: {
  tripId: string;
  forecast: BudgetForecast;
}) {
  const activities = forecast.activities.filter(
    (place) => place.kind !== "food",
  );
  const food = forecast.activities.filter((place) => place.kind === "food");
  const overBudget =
    forecast.remainingCents != null && forecast.remainingCents < 0;
  const planHref = `/trips/${tripId}/itinerary`;

  return (
    <div className="space-y-4">
      <Card className="grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-sm text-muted">Your budget</p>
          <p className="mt-1 text-lg font-semibold">
            {forecast.budgetCents == null
              ? "Not set"
              : formatZar(forecast.budgetCents)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted">Your plan</p>
          <p className="mt-1 text-lg font-semibold">
            {formatZar(forecast.plannedTotalCents)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted">
            {forecast.remainingCents == null
              ? "Left over"
              : overBudget
                ? "Over budget"
                : "Left over"}
          </p>
          <p
            className={`mt-1 text-lg font-semibold ${overBudget ? "text-accent" : ""}`}
          >
            {forecast.remainingCents == null
              ? "—"
              : formatZar(Math.abs(forecast.remainingCents))}
          </p>
        </div>
      </Card>

      <Card>
        <h2 className="font-medium">Accommodation</h2>
        {forecast.stay ? (
          <>
            <p className="mt-1 text-sm text-muted">{forecast.stay.name}</p>
            <p className="mt-2 text-2xl font-semibold">
              {formatZar(forecast.stay.totalCents)}
            </p>
            <p className="mt-2 text-sm text-muted">
              {forecast.stay.area} · {forecast.stay.rooms}{" "}
              {forecast.stay.rooms === 1 ? "unit" : "units"} ·{" "}
              {forecast.stay.nights}{" "}
              {forecast.stay.nights === 1 ? "night" : "nights"} ·{" "}
              {formatZar(forecast.stay.nightlyCents)} per unit per night
            </p>
            <p className="mt-3 text-sm">
              <Link href={planHref} className="font-medium hover:text-accent">
                Change stay on Plan
              </Link>
            </p>
          </>
        ) : (
          <p className="mt-2 text-sm text-muted">
            Choose a stay on{" "}
            <Link href={planHref} className="font-medium hover:text-accent">
              Plan
            </Link>{" "}
            to add accommodation costs.
          </p>
        )}
      </Card>

      <Card>
        <h2 className="font-medium">Chosen places</h2>
        <p className="mt-1 text-sm text-muted">
          Costs for {forecast.travellers}{" "}
          {forecast.travellers === 1 ? "traveller" : "travellers"}, using each
          company’s visit or hourly rate.
        </p>
        {forecast.activities.length === 0 ? (
          <p className="mt-4 text-sm text-muted">
            Add activities or food on{" "}
            <Link href={planHref} className="font-medium hover:text-accent">
              Plan
            </Link>{" "}
            to see their costs here.
          </p>
        ) : (
          <div className="mt-4 space-y-6">
            <PlaceGroup title="Activities" places={activities} />
            <PlaceGroup title="Food spots" places={food} />
          </div>
        )}
      </Card>

      <Card>
        <h2 className="font-medium">Transport from your stay</h2>
        {!forecast.stay ? (
          <p className="mt-2 text-sm text-muted">
            Choose a stay on{" "}
            <Link href={planHref} className="font-medium hover:text-accent">
              Plan
            </Link>{" "}
            to estimate Uber, bus, and fuel from that address to each place.
          </p>
        ) : forecast.legs.length === 0 ? (
          <p className="mt-2 text-sm text-muted">
            Add places on{" "}
            <Link href={planHref} className="font-medium hover:text-accent">
              Plan
            </Link>{" "}
            to see rides from {forecast.stay.name}.
          </p>
        ) : (
          <>
            <p className="mt-1 text-sm text-muted">
              Round-trip estimates from {forecast.stay.name} to each chosen
              place.
            </p>
            <ul className="mt-4 divide-y divide-border">
              {forecast.legs.map((leg) => (
                <TransportLegRow key={leg.toId} stayName={forecast.stay!.name} leg={leg} />
              ))}
            </ul>
            <ul className="mt-2 divide-y divide-border border-t border-border">
              <TransportRow
                label="Uber total"
                detail="Ride-hail for every chosen place"
                amount={forecast.transport.uberCents}
              />
              <TransportRow
                label="Bus / minibus taxi total"
                detail="Cheaper public option"
                amount={forecast.transport.busCents}
              />
              <TransportRow
                label="Fuel total"
                detail="Private car, round trips and parking"
                amount={forecast.transport.fuelCents}
              />
            </ul>
          </>
        )}
      </Card>
    </div>
  );
}

function PlaceGroup({
  title,
  places,
}: {
  title: string;
  places: ForecastActivity[];
}) {
  if (places.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-sm font-medium">{title}</h3>
      <ul className="mt-2 divide-y divide-border">
        {places.map((place) => (
          <li key={place.id} className="flex justify-between gap-4 py-3">
            <div>
              <p className="font-medium">{place.name}</p>
              <div className="mt-1">
                <OpenBadge status={place.openStatus} />
              </div>
              <p className="mt-1 text-sm text-muted">
                {place.company} · {place.area}
              </p>
              <p className="mt-1 text-sm text-muted">
                {place.estimatedCostCents === 0
                  ? "Free visit"
                  : place.priceUnit === "hour"
                    ? `${formatZar(place.estimatedCostCents)} per hour · ${place.typicalHours} h`
                    : `${formatZar(place.estimatedCostCents)} per visit`}
              </p>
            </div>
            <p className="text-sm font-medium">
              {formatZar(place.partyCostCents)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TransportLegRow({
  stayName,
  leg,
}: {
  stayName: string;
  leg: TransportLeg;
}) {
  return (
    <li className="py-3">
      <p className="font-medium">{leg.toName}</p>
      <p className="mt-1 text-sm text-muted">
        From {stayName} · {leg.distanceKm} km round trip
      </p>
      <dl className="mt-2 grid grid-cols-3 gap-2 text-sm">
        <div>
          <dt className="text-muted">Uber</dt>
          <dd>{formatZar(leg.uberCents)}</dd>
        </div>
        <div>
          <dt className="text-muted">Bus</dt>
          <dd>{formatZar(leg.busCents)}</dd>
        </div>
        <div>
          <dt className="text-muted">Fuel</dt>
          <dd>{formatZar(leg.fuelCents)}</dd>
        </div>
      </dl>
    </li>
  );
}

function TransportRow({
  label,
  detail,
  amount,
}: {
  label: string;
  detail: string;
  amount: number;
}) {
  return (
    <li className="flex justify-between gap-4 py-3">
      <div>
        <p>{label}</p>
        <p className="text-sm text-muted">{detail}</p>
      </div>
      <p>{formatZar(amount)}</p>
    </li>
  );
}
