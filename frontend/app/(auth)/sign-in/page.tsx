import Link from "next/link";
import { SignInForm } from "@/components/auth/sign-in-form";
import { Card } from "@/components/ui/card";

export default function Page() {
  return (
    <Card>
      <p className="text-sm font-medium text-muted">Hamba</p>
      <h1 className="mt-2 text-2xl font-semibold">Sign in</h1>
      <p className="mt-1 mb-6 text-sm text-muted">
        Welcome back. Continue planning your trip.
      </p>
      <SignInForm />
      <p className="mt-6 text-sm text-muted">
        New here?{" "}
        <Link href="/sign-up" className="font-medium text-foreground">
          Create an account
        </Link>
      </p>
    </Card>
  );
}
