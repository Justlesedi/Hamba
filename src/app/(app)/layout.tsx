import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full">
      <header className="border-b border-zinc-200 px-6 py-4">
        <nav className="mx-auto flex max-w-5xl items-center gap-6 text-sm">
          <Link href="/" className="font-semibold">
            Hamba
          </Link>
          <Link href="/trips" className="text-zinc-600">
            Trips
          </Link>
        </nav>
      </header>
      <div className="mx-auto max-w-5xl px-6 py-8">{children}</div>
    </div>
  );
}
