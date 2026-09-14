import Link from "next/link";
import { getOptionalUser } from "@/lib/dal";

export default async function Page() {
  const user = await getOptionalUser();

  return (
    <main className="mx-auto flex min-h-full max-w-2xl flex-col justify-center gap-6 px-6 py-24">
      <p className="text-sm font-medium tracking-wide text-muted">Hamba</p>
      <h1 className="text-4xl font-semibold tracking-tight">
        Plan your trip in one place.
      </h1>
      <p className="text-lg text-muted">
        Start with a trip, dates, travellers, and a ZAR budget. Flights,
        stays, and activities come next.
      </p>
      <div className="flex flex-wrap gap-3">
        {user ? (
          <Link
            href="/trips"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-hover"
          >
            Open trips
          </Link>
        ) : (
          <>
            <Link
              href="/sign-up"
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-hover"
            >
              Create account
            </Link>
            <Link
              href="/sign-in"
              className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium"
            >
              Sign in
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
