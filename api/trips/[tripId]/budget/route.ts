import { NextResponse } from "next/server";
import { forecastTripBudget } from "@backend/server/budget";
import { getTripForUser, updateTripBudget } from "@backend/server/trips";
import { budgetForecastSchema } from "@backend/lib/validation";
import { readSession } from "@/lib/session";

export async function GET(
  _request: Request,
  context: { params: Promise<{ tripId: string }> },
) {
  const session = await readSession();
  if (!session?.userId) {
    return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  }

  const { tripId } = await context.params;
  const trip = await getTripForUser(session.userId, tripId);
  if (!trip) {
    return NextResponse.json({ message: "Trip not found." }, { status: 404 });
  }

  const forecast = forecastTripBudget(
    session.userId,
    tripId,
    trip.budgetCents != null
      ? { budgetZar: Math.round(trip.budgetCents / 100) }
      : {},
  );

  return NextResponse.json({ trip, forecast });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ tripId: string }> },
) {
  const session = await readSession();
  if (!session?.userId) {
    return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  }

  const { tripId } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = budgetForecastSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  if (parsed.data.budgetZar != null) {
    const trip = await updateTripBudget(
      session.userId,
      tripId,
      parsed.data.budgetZar,
    );
    if (!trip) {
      return NextResponse.json({ message: "Trip not found." }, { status: 404 });
    }
  }

  const forecast = forecastTripBudget(session.userId, tripId, parsed.data);
  if (!forecast) {
    return NextResponse.json({ message: "Trip not found." }, { status: 404 });
  }

  return NextResponse.json({ forecast });
}
