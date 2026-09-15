import { NextResponse } from "next/server";
import { forecastTripBudget } from "@backend/server/budget";
import { getTripForUser, updateTripBudget } from "@backend/server/trips";
import { budgetForecastSchema } from "@backend/lib/validation";
import { resolveDestinationCenter } from "@backend/lib/geocode";
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

  if (trip.budgetCents == null) {
    return NextResponse.json({ trip, forecast: null });
  }

  const center = await resolveDestinationCenter(trip.destination);
  if (!center) {
    return NextResponse.json({ trip, forecast: null });
  }

  const forecast = forecastTripBudget(
    session.userId,
    tripId,
    { budgetZar: Math.round(trip.budgetCents / 100) },
    center,
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

  const trip = await updateTripBudget(
    session.userId,
    tripId,
    parsed.data.budgetZar,
  );
  if (!trip) {
    return NextResponse.json({ message: "Trip not found." }, { status: 404 });
  }

  const center = await resolveDestinationCenter(trip.destination);
  if (!center) {
    return NextResponse.json(
      { message: "Could not place this destination on the map." },
      { status: 404 },
    );
  }

  const forecast = forecastTripBudget(
    session.userId,
    tripId,
    parsed.data,
    center,
  );

  return NextResponse.json({ trip, forecast });
}
