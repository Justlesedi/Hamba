import { NextResponse } from "next/server";
import { searchNearbyStays } from "@backend/server/stays";
import { nearbyActivitiesSchema } from "@backend/lib/validation";
import { MAX_STAY_DISTANCE_KM } from "@backend/lib/geo";
import { tripNights } from "@backend/lib/budget/estimates";
import { resolveDestinationCenter } from "@backend/lib/geocode";
import { getTripForUser } from "@backend/server/trips";
import { readSession } from "@/lib/session";

export async function GET(
  request: Request,
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

  const url = new URL(request.url);
  const lat = url.searchParams.get("lat");
  const lng = url.searchParams.get("lng");

  let center = await resolveDestinationCenter(trip.destination);

  if (lat && lng) {
    const parsed = nearbyActivitiesSchema.safeParse({ lat, lng });
    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }
    center = parsed.data;
  }

  if (!center) {
    return NextResponse.json(
      { message: "Could not place this destination on the map." },
      { status: 404 },
    );
  }

  const stays = searchNearbyStays(center.lat, center.lng, {
    travellers: trip.travellers,
    nights: tripNights(trip.startDate, trip.endDate),
  });

  return NextResponse.json({
    center,
    maxDistanceKm: MAX_STAY_DISTANCE_KM,
    selectedStayId: trip.stayId,
    stays,
  });
}
