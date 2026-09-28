import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import type { PublicUser } from "@backend/types/user";

const publicLinks = [
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
];

export function SiteHeader({
  user,
  tone = "light",
}: {
  user: PublicUser | null;
  tone?: "light" | "on-film";
}) {
  const onFilm = tone === "on-film";
  const muted = onFilm
    ? "text-white/75 hover:text-white"
    : "text-muted hover:text-foreground";

  return (
    <header
      className={
        onFilm
          ? "absolute inset-x-0 top-0 z-20"
          : "relative z-20 border-b border-border/80 bg-card/80 backdrop-blur-md"
      }
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
        <Link
          href={user ? "/trips" : "/"}
          className={`font-display text-2xl tracking-tight ${
            onFilm ? "text-white" : "text-foreground"
          }`}
        >
          Hamba
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          {user ? (
            <>
              <Link href="/" className={muted}>
                Home
              </Link>
              <Link href="/trips" className={muted}>
                Trips
              </Link>
              <Link href="/bookings" className={muted}>
                Bookings
              </Link>
              <Link href="/about" className={muted}>
                About
              </Link>
              <p className={`hidden text-sm md:block ${onFilm ? "text-white/70" : "text-muted"}`}>
                {user.name}
              </p>
              <form action={signOut}>
                <Button
                  variant="ghost"
                  className={`px-3 py-1.5 ${onFilm ? "text-white/80 hover:text-white" : ""}`}
                >
                  Sign out
                </Button>
              </form>
            </>
          ) : (
            <>
              {publicLinks.map((link) => (
                <Link key={link.href} href={link.href} className={`hidden sm:inline ${muted}`}>
                  {link.label}
                </Link>
              ))}
              <Link href="/sign-in" className={muted}>
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className={
                  onFilm
                    ? "rounded-full bg-white px-4 py-2 text-sm font-medium text-dusk hover:bg-sand"
                    : "rounded-full bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
                }
              >
                Begin
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
