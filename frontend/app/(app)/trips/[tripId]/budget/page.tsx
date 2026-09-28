import { notFound } from "next/navigation";
import { getTripForUser } from "@backend/server/trips";
import { forecastTripBudget } from "@backend/server/budget";
import { BudgetSummary } from "@/components/budget/budget-summary";
import { verifySession } from "@/lib/dal";

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

  const initialBudgetZar =
    trip.budgetCents != null ? Math.round(trip.budgetCents / 100) : undefined;
  const initialForecast = forecastTripBudget(
    userId,
    tripId,
    initialBudgetZar ? { budgetZar: initialBudgetZar } : {},
  );

  return (
    <section className="space-y-6">
      <div>
        <p className="kicker">The forecast</p>
        <h1 className="mt-2 font-display text-4xl">Budget</h1>
        <p className="mt-1 text-muted">
          Costs for {trip.destination}. This is a picture of the trip, not a
          bill.
        </p>
      </div>
      <BudgetSummary
        tripId={trip.id}
        initialBudgetZar={initialBudgetZar}
        initialForecast={initialForecast}
      />
    </section>
  );
}
