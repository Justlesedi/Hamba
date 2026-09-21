"use client";

import { useActionState } from "react";
import { deleteTripAction } from "@/app/actions/trips";
import { Button } from "@/components/ui/button";

export function DeleteTripButton({
  tripId,
  label = "Delete trip",
}: {
  tripId: string;
  label?: string;
}) {
  const [state, action, pending] = useActionState(deleteTripAction, undefined);

  return (
    <form action={action}>
      <input type="hidden" name="tripId" value={tripId} />
      {state?.message ? (
        <p className="mb-2 text-sm text-accent">{state.message}</p>
      ) : null}
      <Button type="submit" variant="ghost" className="px-0" disabled={pending}>
        {pending ? "Deleting…" : label}
      </Button>
    </form>
  );
}
