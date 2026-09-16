import { NextResponse } from "next/server";
import { getTripForUser } from "@backend/server/trips";
import { flightsForTrip, listAirports } from "@backend/server/flights";
import { readSession } from "@/lib/session";

export async function GET(request: Request) {
  const session = await readSession();
  if (!session?.userId) {
    return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  }

  const url = new URL(request.url);
  const tripId = url.searchParams.get("tripId") ?? "";
  const fromCode = url.searchParams.get("from") ?? undefined;
  const trip = tripId ? getTripForUser(session.userId, tripId) : null;

  if (!trip) {
    return NextResponse.json({ message: "Trip not found." }, { status: 404 });
  }

  const flights = flightsForTrip(
    trip.destination,
    trip.startDate,
    trip.endDate,
    trip.travellers,
    fromCode,
  );

  return NextResponse.json({
    airports: listAirports(),
    origin: flights.origin,
    arrival: flights.arrival,
    outbound: flights.outbound,
    inbound: flights.inbound,
    selectedOutboundId: trip.outboundFlightId,
    selectedReturnId: trip.returnFlightId,
  });
}
