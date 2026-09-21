import { NextResponse } from "next/server";
import { searchNearbyStays } from "@backend/server/stays";
import { nearbyActivitiesSchema } from "@backend/lib/validation";
import { MAX_STAY_DISTANCE_KM } from "@backend/lib/geo";
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

  const travellers = Number(url.searchParams.get("travellers") ?? 2);
  const nights = Number(url.searchParams.get("nights") ?? 1);
  const units = Number(url.searchParams.get("units") ?? 1);
  const stays = searchNearbyStays(parsed.data.lat, parsed.data.lng, {
    travellers: Number.isFinite(travellers) && travellers > 0 ? travellers : 2,
    nights: Number.isFinite(nights) && nights >= 0 ? nights : 1,
    units: Number.isFinite(units) && units > 0 ? units : 1,
  });

  return NextResponse.json({
    maxDistanceKm: MAX_STAY_DISTANCE_KM,
    stays,
  });
}
