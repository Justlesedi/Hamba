"use client";

import { useActionState, useState } from "react";
import { createTripAction } from "@/app/actions/trips";
import { TripDatePicker } from "@/components/calendar/trip-date-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TripForm() {
  const [state, action, pending] = useActionState(createTripAction, undefined);
  const [destination, setDestination] = useState("");

  return (
    <form action={action} className="space-y-4">
      <Input
        label="Trip name"
        name="title"
        placeholder="Cape Town long weekend"
        error={state?.errors?.title?.[0]}
      />
      <Input
        label="Destination"
        name="destination"
        placeholder="Cape Town"
        error={state?.errors?.destination?.[0]}
        value={destination}
        onChange={(event) => setDestination(event.target.value)}
      />
      <TripDatePicker
        destination={destination}
        startError={state?.errors?.startDate?.[0]}
        endError={state?.errors?.endDate?.[0]}
      />
      <Input
        label="Travellers"
        name="travellers"
        inputMode="numeric"
        pattern="[0-9]*"
        min={1}
        defaultValue={1}
        onInput={(event) => {
          event.currentTarget.value = event.currentTarget.value.replace(/\D/g, "");
        }}
        error={state?.errors?.travellers?.[0]}
      />
      {state?.message ? (
        <p className="text-sm text-accent">{state.message}</p>
      ) : null}
      <Button disabled={pending}>
        {pending ? "Creating…" : "Create trip"}
      </Button>
    </form>
  );
}
