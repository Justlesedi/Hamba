import Link from "next/link";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata = { title: "Create account" };

export default function Page() {
  return (
    <div>
      <p className="font-display text-3xl">Hamba</p>
      <h1 className="mt-6 font-display text-4xl">Take the first step.</h1>
      <p className="mt-2 mb-8 text-muted">
        A name, an email, a password. Then a destination.
      </p>
      <SignUpForm />
      <p className="mt-6 text-sm text-muted">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-foreground">
          Sign in
        </Link>
      </p>
      <p className="mt-8 text-xs text-muted">
        <Link href="/">Home</Link>
        {" · "}
        <Link href="/privacy">Privacy</Link>
        {" · "}
        <Link href="/terms">Terms</Link>
      </p>
    </div>
  );
}
