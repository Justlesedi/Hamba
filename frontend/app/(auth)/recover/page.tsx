import Link from "next/link";
import { RecoverFooter } from "@/components/auth/recover-footer";
import { BrandMark } from "@/components/layout/brand-mark";

export const metadata = { title: "Recover account" };

export default function Page() {
  return (
    <div>
      <BrandMark href="/" size="auth" />
      <h1 className="mt-6 font-display text-4xl">We will walk you back in.</h1>
      <p className="mt-2 mb-8 text-muted">
        Hamba signs you in with the email on the account. If that email or the
        password has gone missing, we send help to the inbox — never on this
        screen.
      </p>
      <div className="space-y-3">
        <Link
          href="/recover/email"
          className="block rounded-3xl border border-border bg-card px-5 py-4 transition hover:border-accent"
        >
          <p className="font-medium">I forgot the email</p>
          <p className="mt-1 text-sm text-muted">
            The name on the account. We send the sign-in email to that inbox.
          </p>
        </Link>
        <Link
          href="/recover/password"
          className="block rounded-3xl border border-border bg-card px-5 py-4 transition hover:border-accent"
        >
          <p className="font-medium">I forgot the password</p>
          <p className="mt-1 text-sm text-muted">
            The email you sign in with. We send a link to choose a new one.
          </p>
        </Link>
      </div>
      <RecoverFooter />
    </div>
  );
}
