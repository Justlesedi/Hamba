"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function TripNav({ tripId }: { tripId: string }) {
  const pathname = usePathname();
  const overview = `/trips/${tripId}`;
  const plan = `/trips/${tripId}/itinerary`;

  const links = [
    { href: overview, label: "Overview", current: pathname === overview },
    { href: plan, label: "Plan", current: pathname === plan },
    {
      href: `/trips/${tripId}/budget`,
      label: "Budget",
      current: pathname === `/trips/${tripId}/budget`,
    },
  ];

  return (
    <nav className="flex gap-1 border-b border-border">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`-mb-px border-b-2 px-3 py-2 text-sm ${
            link.current
              ? "border-accent font-medium text-foreground"
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
