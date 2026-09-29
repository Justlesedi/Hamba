import Link from "next/link";
import { SignInForm } from "@/components/auth/sign-in-form";
import { BrandMark } from "@/components/layout/brand-mark";

export const metadata = { title: "Sign in" };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ account?: string }>;
}) {
  const { account } = await searchParams;
  const existingAccount = account === "exists";

  return (
    <div>
      <BrandMark href="/" size="auth" />
      <h1 className="mt-6 font-display text-4xl">Welcome back.</h1>
      {existingAccount ? (
        <p className="mt-2 mb-8 text-accent">
          An account with this email already exists. Sign in to continue.
        </p>
      ) : (
        <p className="mt-2 mb-8 text-muted">
          Continue a trip you already started.
        </p>
      )}
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
