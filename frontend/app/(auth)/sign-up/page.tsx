import Link from "next/link";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { Card } from "@/components/ui/card";

export default function Page() {
  return (
    <Card>
      <p className="text-sm font-medium text-muted">Hamba</p>
      <h1 className="mt-2 text-2xl font-semibold">Create your account</h1>
      <p className="mt-1 mb-6 text-sm text-muted">
        Email and password is enough for this first version.
      </p>
      <SignUpForm />
      <p className="mt-6 text-sm text-muted">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-foreground">
          Sign in
        </Link>
      </p>
    </Card>
  );
}
