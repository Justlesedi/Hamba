"use client";

import { useActionState } from "react";
import { recoverEmail } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RecoverEmailForm() {
  const [state, action, pending] = useActionState(recoverEmail, undefined);

  return (
    <form action={action} className="space-y-4">
      <Input
        label="Name"
        name="name"
        autoComplete="name"
        hint="The name on the account when you signed up."
        error={state?.errors?.name?.[0]}
      />
      {state?.message ? (
        <p className="text-sm text-accent">{state.message}</p>
      ) : null}
      <Button disabled={pending} className="w-full">
        {pending ? "Sending…" : "Send the sign-in email"}
      </Button>
    </form>
  );
}
