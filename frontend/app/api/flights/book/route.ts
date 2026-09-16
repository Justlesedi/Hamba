import { NextResponse } from "next/server";
import { chooseFlightsForTrip } from "@backend/server/flights";
import { chooseFlightsSchema } from "@backend/lib/validation";
import { readSession } from "@/lib/session";

export async function POST(request: Request) {
  const session = await readSession();
  if (!session?.userId) {
    return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = chooseFlightsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const trip = chooseFlightsForTrip(session.userId, parsed.data.tripId, {
    outboundFlightId: parsed.data.outboundFlightId || null,
    returnFlightId: parsed.data.returnFlightId || null,
  });
  if (!trip) {
    return NextResponse.json({ message: "Could not save these flights." }, { status: 400 });
  }

  return NextResponse.json({
    outboundFlightId: trip.outboundFlightId,
    returnFlightId: trip.returnFlightId,
  });
}
