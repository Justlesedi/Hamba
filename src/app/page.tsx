import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-full max-w-2xl flex-col justify-center gap-6 px-6 py-24">
      <p className="text-sm font-medium tracking-wide text-zinc-500">Hamba</p>
      <h1 className="text-4xl font-semibold tracking-tight">
        Plan and book your trip in one place.
      </h1>
      <p className="text-lg text-zinc-600">
        Stays first for Southern Africa — then flights, activities, and a live
        ZAR budget.
      </p>
      <Link
        href="/trips"
        className="w-fit rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white"
      >
        Open trips
      </Link>
    </main>
  );
}
