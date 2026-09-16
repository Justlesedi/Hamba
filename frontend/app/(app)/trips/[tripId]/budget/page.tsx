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
        <h1 className="text-2xl font-semibold">Budget</h1>
        <p className="text-sm text-muted">
          Costs follow what you chose on Plan for {trip.destination}: stay,
          each activity, and transport from the stay to those places. This is a
          forecast only. Book stays and bookable activities under Bookings.
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
