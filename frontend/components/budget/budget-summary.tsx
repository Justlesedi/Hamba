"use client";

import { useActionState } from "react";
import { forecastBudgetAction } from "@/app/actions/budget";
import { formatZar } from "@backend/lib/money";
import type { BudgetForecast, ForecastActivity } from "@backend/types/budget";
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

  return (
    <div className="space-y-6">
      <Card>
        <form
          action={action}
          className="space-y-4"
          key={forecast?.budgetCents ?? "new"}
        >
          <input type="hidden" name="tripId" value={tripId} />
          <Input
            label="Trip budget in ZAR"
            name="budgetZar"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="15000"
            defaultValue={
              forecast
                ? String(Math.round(forecast.budgetCents / 100))
                : initialBudgetZar
                  ? String(initialBudgetZar)
                  : ""
            }
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
            {pending ? "Forecasting…" : "Forecast budget"}
          </Button>
        </form>
      </Card>

      {forecast ? <ForecastResults forecast={forecast} /> : null}
    </div>
  );
}

function ForecastResults({ forecast }: { forecast: BudgetForecast }) {
  const recommended = forecast.activities.filter((place) => place.recommended);
  const stretch = forecast.activities.filter((place) => !place.recommended);
  const recommendedFood = recommended.filter((place) => place.kind === "food");
  const recommendedActivities = recommended.filter(
    (place) => place.kind !== "food",
  );
  const overBudget = forecast.remainingCents < 0;

  return (
    <div className="space-y-4">
      <Card className="grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-sm text-muted">Your budget</p>
          <p className="mt-1 text-lg font-semibold">
            {formatZar(forecast.budgetCents)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted">Planned stay and places</p>
          <p className="mt-1 text-lg font-semibold">
            {formatZar(forecast.plannedTotalCents)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted">
            {overBudget ? "Over budget" : "Left over"}
          </p>
          <p
            className={`mt-1 text-lg font-semibold ${overBudget ? "text-accent" : ""}`}
          >
            {formatZar(Math.abs(forecast.remainingCents))}
          </p>
        </div>
      </Card>

      <Card>
        <h2 className="font-medium">Stay and accommodation</h2>
        <p className="mt-2 text-2xl font-semibold">
          {formatZar(forecast.stay.totalCents)}
        </p>
        <p className="mt-2 text-sm text-muted">
          {forecast.stay.rooms}{" "}
          {forecast.stay.rooms === 1 ? "room" : "rooms"} ·{" "}
          {forecast.stay.nights}{" "}
          {forecast.stay.nights === 1 ? "night" : "nights"} ·{" "}
          {formatZar(forecast.stay.nightlyCents)} per room per night
        </p>
        <p className="mt-2 text-sm text-muted">{forecast.stay.note}</p>
      </Card>

      <Card>
        <h2 className="font-medium">Transport estimates</h2>
        <p className="mt-1 text-sm text-muted">
          Local getting-around for {forecast.travelDays}{" "}
          {forecast.travelDays === 1 ? "day" : "days"}. These sit outside the
          planned total so you can compare Uber, bus, and fuel.
        </p>
        <ul className="mt-4 divide-y divide-border">
          <TransportRow
            label="Uber"
            detail="Ride-hail around the destination"
            amount={forecast.transport.uberCents}
          />
          <TransportRow
            label="Bus / minibus taxi"
            detail="Cheaper public option"
            amount={forecast.transport.busCents}
          />
          <TransportRow
            label="Fuel"
            detail="Private car, local driving and parking"
            amount={forecast.transport.fuelCents}
          />
        </ul>
      </Card>

      <Card>
        <h2 className="font-medium">Recommended on this budget</h2>
        <p className="mt-1 text-sm text-muted">
          Nearby food spots and activities that still fit after stay, for{" "}
          {forecast.travellers}{" "}
          {forecast.travellers === 1 ? "traveller" : "travellers"}.
        </p>
        {recommended.length === 0 ? (
          <p className="mt-4 text-sm text-muted">
            This budget is tight for stay. Increase it to leave room for food
            and activities.
          </p>
        ) : (
          <div className="mt-4 space-y-6">
            <PlaceGroup title="Food spots" places={recommendedFood} />
            <PlaceGroup title="Activities" places={recommendedActivities} />
          </div>
        )}
        <p className="mt-4 text-sm text-muted">
          Food and activities in this plan:{" "}
          {formatZar(forecast.recommendedTotalCents)}
        </p>
      </Card>

      {stretch.length > 0 ? (
        <Card>
          <h2 className="font-medium">Other nearby places</h2>
          <p className="mt-1 text-sm text-muted">
            These were not added to the plan, either because the budget is used
            up or because cheaper options were picked first.
          </p>
          <ul className="mt-4 divide-y divide-border">
            {stretch.slice(0, 8).map((place) => (
              <li key={place.id} className="flex justify-between gap-4 py-3">
                <div>
                  <p className="font-medium">{place.name}</p>
                  <p className="text-sm text-muted">
                    {place.kind === "food" ? "Food · " : ""}
                    {place.area}
                  </p>
                </div>
                <p className="text-sm font-medium">
                  {formatZar(place.partyCostCents)}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
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
              <p className="text-sm text-muted">
                {place.area}
                {place.estimatedCostCents === 0
                  ? " · Free"
                  : ` · ${formatZar(place.estimatedCostCents)} each`}
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
