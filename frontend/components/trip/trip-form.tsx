"use client";

import { useActionState } from "react";
import { createTripAction } from "@/app/actions/trips";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TripForm() {
  const [state, action, pending] = useActionState(createTripAction, undefined);

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
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Start date"
          name="startDate"
          type="date"
          error={state?.errors?.startDate?.[0]}
        />
        <Input
          label="End date"
          name="endDate"
          type="date"
          error={state?.errors?.endDate?.[0]}
        />
      </div>
      <Input
        label="Travellers"
        name="travellers"
        type="number"
        min={1}
        defaultValue={1}
        error={state?.errors?.travellers?.[0]}
      />
      <Input
        label="Budget in ZAR (optional)"
        name="budgetZar"
        type="number"
        min={0}
        step="1"
        placeholder="15000"
        error={state?.errors?.budgetZar?.[0]}
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
