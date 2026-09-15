import Link from "next/link";
import { notFound } from "next/navigation";
import { getTripForUser } from "@backend/server/trips";
import { formatZarFromCents } from "@backend/lib/money";
import { Card } from "@/components/ui/card";
import { verifySession } from "@/lib/dal";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(value);
}

export default async function Page({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { userId } = await verifySession();
  const { tripId } = await params;
  const trip = await getTripForUser(userId, tripId);

  if (!trip) {
    notFound();
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm text-muted">
          <Link href="/trips" className="hover:text-foreground">
            Trips
          </Link>
        </p>
        <h1 className="mt-2 text-2xl font-semibold">{trip.title}</h1>
        <p className="text-muted">{trip.destination}</p>
      </div>
      <Card className="grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-sm text-muted">Dates</p>
          <p className="mt-1 font-medium">
            {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted">Travellers</p>
          <p className="mt-1 font-medium">{trip.travellers}</p>
        </div>
        <div>
          <p className="text-sm text-muted">Budget</p>
          <p className="mt-1 font-medium">
            {formatZarFromCents(trip.budgetCents)}
          </p>
        </div>
      </Card>
      <p className="text-sm text-muted">
        Open Plan to see activities within 30 km on a map.
      </p>
    </section>
  );
}
