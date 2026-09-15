import { NextResponse } from "next/server";
import { searchNearbyActivities } from "@backend/server/activities";
import { nearbyActivitiesSchema } from "@backend/lib/validation";
import { MAX_ACTIVITY_DISTANCE_KM } from "@backend/lib/geo";
import { readSession } from "@/lib/session";

export async function GET(request: Request) {
  const session = await readSession();
  if (!session?.userId) {
    return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  }

  const url = new URL(request.url);
  const parsed = nearbyActivitiesSchema.safeParse({
    lat: url.searchParams.get("lat"),
    lng: url.searchParams.get("lng"),
  });

  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const activities = searchNearbyActivities(parsed.data.lat, parsed.data.lng);

  return NextResponse.json({
    center: parsed.data,
    maxDistanceKm: MAX_ACTIVITY_DISTANCE_KM,
    activities,
  });
}
