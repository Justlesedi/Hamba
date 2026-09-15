import { notFound } from "next/navigation";
import { getTripForUser } from "@backend/server/trips";
import { forecastTripBudget } from "@backend/server/budget";
import { resolveDestinationCenter } from "@backend/lib/geocode";
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

  const center = await resolveDestinationCenter(trip.destination);
  const initialBudgetZar =
    trip.budgetCents != null ? Math.round(trip.budgetCents / 100) : undefined;
  const initialForecast =
    center && initialBudgetZar
      ? forecastTripBudget(
          userId,
          tripId,
          { budgetZar: initialBudgetZar },
          center,
        )
      : null;

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Budget</h1>
        <p className="text-sm text-muted">
          Forecast stay, transport, activities, and food for {trip.destination}.
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
