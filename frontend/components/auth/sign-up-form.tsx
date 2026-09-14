"use client";

import { useActionState } from "react";
import { signUp } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SignUpForm() {
  const [state, action, pending] = useActionState(signUp, undefined);

  return (
    <form action={action} className="space-y-4">
      <Input
        label="Name"
        name="name"
        autoComplete="name"
        error={state?.errors?.name?.[0]}
      />
      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        error={state?.errors?.email?.[0]}
      />
      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        error={state?.errors?.password?.[0]}
      />
      {state?.message ? (
        <p className="text-sm text-accent">{state.message}</p>
      ) : null}
      <Button disabled={pending} className="w-full">
        {pending ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
