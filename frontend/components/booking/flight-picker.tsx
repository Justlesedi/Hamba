"use client";

import { useActionState } from "react";
import { chooseFlightsAction } from "@/app/actions/flights";
import { formatZar } from "@backend/lib/money";
import type { Airport, Flight } from "@backend/types/flight";
import { Button } from "@/components/ui/button";

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) {
    return `${rest}m`;
  }
  return rest ? `${hours}h ${rest}m` : `${hours}h`;
}

export function FlightPicker({
  tripId,
  airports,
  originCode,
  arrival,
  outbound,
  inbound,
  selectedOutboundId,
  selectedReturnId,
}: {
  tripId: string;
  airports: Airport[];
  originCode: string;
  arrival: Airport | null;
  outbound: Flight[];
  inbound: Flight[];
  selectedOutboundId: string | null;
  selectedReturnId: string | null;
}) {
  const [state, action, pending] = useActionState(chooseFlightsAction, {
    outboundFlightId: selectedOutboundId,
    returnFlightId: selectedReturnId,
  });
  const chosenOut = state?.outboundFlightId ?? selectedOutboundId;
  const chosenIn = state?.returnFlightId ?? selectedReturnId;

  if (!arrival) {
    return (
      <p className="text-sm text-muted">
        We could not match this destination to a South African airport yet.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      <form method="get" className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Fly from</span>
          <select
            name="from"
            defaultValue={originCode}
            className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-accent"
          >
            {airports.map((airport) => (
              <option key={airport.code} value={airport.code}>
                {airport.city} ({airport.code})
              </option>
            ))}
          </select>
        </label>
        <Button type="submit" variant="secondary">
          Show flights
        </Button>
      </form>

      <p className="text-sm text-muted">
        Arrive {arrival.city} ({arrival.code}) · {arrival.name}
      </p>

      {originCode === arrival.code ? (
        <p className="text-sm text-muted">
          Origin and destination are the same airport, so there is no flight to
          book. Choose another city to fly from.
        </p>
      ) : (
        <>
          <FlightLeg
            title="Outbound"
            flights={outbound}
            selectedId={chosenOut}
            otherId={chosenIn}
            otherName="returnFlightId"
            thisName="outboundFlightId"
            tripId={tripId}
            action={action}
            pending={pending}
          />
          <FlightLeg
            title="Return"
            flights={inbound}
            selectedId={chosenIn}
            otherId={chosenOut}
            otherName="outboundFlightId"
            thisName="returnFlightId"
            tripId={tripId}
            action={action}
            pending={pending}
          />
          {chosenOut || chosenIn ? (
            <form action={action}>
              <input type="hidden" name="tripId" value={tripId} />
              <input type="hidden" name="outboundFlightId" value="" />
              <input type="hidden" name="returnFlightId" value="" />
              <Button type="submit" variant="ghost" className="px-0" disabled={pending}>
                Clear flights
              </Button>
            </form>
          ) : null}
          {state?.message ? (
            <p className="text-sm text-accent">{state.message}</p>
          ) : null}
          {chosenOut && chosenIn ? (
            <p className="text-sm text-muted">
              Outbound and return flights are saved on this trip.
            </p>
          ) : (
            <p className="text-sm text-muted">
              Choose an outbound and a return flight, or skip flights and book
              the stay only.
            </p>
          )}
        </>
      )}
    </div>
  );
}

function FlightLeg({
  title,
  flights,
  selectedId,
  otherId,
  otherName,
  thisName,
  tripId,
  action,
  pending,
}: {
  title: string;
  flights: Flight[];
  selectedId: string | null;
  otherId: string | null;
  otherName: "outboundFlightId" | "returnFlightId";
  thisName: "outboundFlightId" | "returnFlightId";
  tripId: string;
  action: (formData: FormData) => void;
  pending: boolean;
}) {
  return (
    <div>
      <h3 className="text-sm font-medium">{title}</h3>
      {flights.length === 0 ? (
        <p className="mt-2 text-sm text-muted">No flights on this date yet.</p>
      ) : (
        <ul className="mt-2 divide-y divide-border">
          {flights.map((flight) => {
            const chosen = flight.id === selectedId;
            return (
              <li
                key={flight.id}
                className={`flex items-start justify-between gap-3 py-3 ${
                  chosen ? "bg-background" : ""
                }`}
              >
                <div>
                  <p className="font-medium">
                    {flight.airline} {flight.flightNumber}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {flight.fromCode} {flight.departLocal} → {flight.toCode}{" "}
                    {flight.arriveLocal} · {formatDuration(flight.durationMinutes)}
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {formatZar(flight.partyCents)}
                  </p>
                </div>
                <form action={action} className="shrink-0">
                  <input type="hidden" name="tripId" value={tripId} />
                  <input type="hidden" name={thisName} value={flight.id} />
                  <input type="hidden" name={otherName} value={otherId ?? ""} />
                  <Button
                    variant={chosen ? "secondary" : "primary"}
                    disabled={pending}
                  >
                    {pending ? "Saving…" : chosen ? "Chosen" : "Book flight"}
                  </Button>
                </form>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
