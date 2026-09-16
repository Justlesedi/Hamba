import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import type { PublicUser } from "@backend/types/user";

export function Header({ user }: { user: PublicUser }) {
  return (
    <header className="border-b border-border bg-card/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/" className="font-semibold tracking-tight">
            Hamba
          </Link>
          <Link href="/trips" className="text-muted hover:text-foreground">
            Trips
          </Link>
          <Link href="/bookings" className="text-muted hover:text-foreground">
            Bookings
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <p className="hidden text-sm text-muted sm:block">{user.name}</p>
          <form action={signOut}>
            <Button variant="ghost" className="px-3 py-1.5">
              Sign out
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
