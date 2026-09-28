import Link from "next/link";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata = { title: "Sign in" };

export default function Page() {
  return (
    <div>
      <p className="font-display text-3xl">Hamba</p>
      <h1 className="mt-6 font-display text-4xl">Welcome back.</h1>
      <p className="mt-2 mb-8 text-muted">
        Continue the trip you already started.
      </p>
      <SignInForm />
      <p className="mt-6 text-sm text-muted">
        New here?{" "}
        <Link href="/sign-up" className="font-medium text-foreground">
          Create an account
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
