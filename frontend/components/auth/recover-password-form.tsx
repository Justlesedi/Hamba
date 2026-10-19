"use client";

import { useActionState } from "react";
import { recoverPassword } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RecoverPasswordForm() {
  const [state, action, pending] = useActionState(recoverPassword, undefined);

  return (
    <form action={action} className="space-y-4">
      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        hint="The address you use to sign in."
        error={state?.errors?.email?.[0]}
      />
      {state?.message ? (
        <p className="text-sm text-accent">{state.message}</p>
      ) : null}
      <Button disabled={pending} className="w-full">
        {pending ? "Sending…" : "Send a reset link"}
      </Button>
    </form>
  );
}
