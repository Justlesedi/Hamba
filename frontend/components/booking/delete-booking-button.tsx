"use client";

import { useActionState } from "react";
import { deleteBookingAction } from "@/app/actions/bookings";
import { Button } from "@/components/ui/button";

export function DeleteBookingButton({ bookingId }: { bookingId: string }) {
  const [state, action, pending] = useActionState(
    deleteBookingAction,
    undefined,
  );

  return (
    <form action={action}>
      <input type="hidden" name="bookingId" value={bookingId} />
      {state?.message ? (
        <p className="mb-2 text-sm text-accent">{state.message}</p>
      ) : null}
      <Button type="submit" variant="ghost" className="px-0" disabled={pending}>
        {pending ? "Deleting…" : "Delete this booking"}
      </Button>
    </form>
  );
}
