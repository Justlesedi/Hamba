import { NextResponse } from "next/server";
import { listTripPlaceIds } from "@backend/server/plan";
import { listingsAround } from "@backend/server/nearby";
import { getStayById } from "@backend/server/stays";
import { nearbyActivitiesSchema } from "@backend/lib/validation";
import { MAX_ACTIVITY_DISTANCE_KM, type MapCenter } from "@backend/lib/geo";
import { tripNights } from "@backend/lib/budget/estimates";
import { resolveDestinationCenter } from "@backend/lib/geocode";
import { getTripForUser } from "@backend/server/trips";
import { readSession } from "@/lib/session";

function parsePoint(lat: string | null, lng: string | null) {
  if (!lat && !lng) {
    return null;
  }
  const parsed = nearbyActivitiesSchema.safeParse({ lat, lng });
  if (!parsed.success) {
    return "invalid" as const;
  }
  return parsed.data;
}

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
  const stayOrigin = parsePoint(
    url.searchParams.get("lat"),
    url.searchParams.get("lng"),
  );
  const activityOrigin = parsePoint(
    url.searchParams.get("activityLat"),
    url.searchParams.get("activityLng"),
  );

  if (stayOrigin === "invalid" || activityOrigin === "invalid") {
    return NextResponse.json(
      { message: "That location is invalid." },
      { status: 400 },
    );
  }

  const destination = await resolveDestinationCenter(trip.destination);
  const stayCenter = stayOrigin ?? destination;
  const confirmedStay = trip.stayId ? getStayById(trip.stayId) : null;
  const stayHub: MapCenter | null = confirmedStay
    ? { lat: confirmedStay.latitude, lng: confirmedStay.longitude }
    : null;
  const activityCenter = activityOrigin ?? stayHub ?? stayCenter;

  if (!stayCenter || !activityCenter) {
    return NextResponse.json(
      { message: "Could not place this destination on the map." },
      { status: 404 },
    );
  }

  const nights = tripNights(trip.startDate, trip.endDate);
  const listings = listingsAround({
    stayOrigin: stayCenter,
    activityOrigin: activityCenter,
    nights,
    units: trip.stayUnits,
    travellers: trip.travellers,
    keepStayId: trip.stayId,
    keepActivityIds: listTripPlaceIds(tripId),
  });

  return NextResponse.json({
    center: stayCenter,
    activityCenter,
    maxDistanceKm: MAX_ACTIVITY_DISTANCE_KM,
    selectedStayId: trip.stayId,
    selectedActivityIds: listTripPlaceIds(tripId),
    stays: listings.stays,
    activities: listings.activities,
  });
}
