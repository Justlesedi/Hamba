import { db } from "./db";
import { coordinatesForDestination, normalizePlace, type MapCenter } from "./geo";

async function geocodeWithNominatim(destination: string): Promise<MapCenter | null> {
  const query = normalizePlace(destination);
  const cached = db
    .prepare(`SELECT lat, lng FROM geocode_cache WHERE query = ?`)
    .get(query) as MapCenter | undefined;

  if (cached) {
    return { lat: cached.lat, lng: cached.lng };
  }

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", destination.trim());
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "1");

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "HambaTravel/0.1 (local itinerary planner)",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  }).catch(() => null);

  if (!response?.ok) {
    return null;
  }

  const results = (await response.json()) as {
    lat?: string;
    lon?: string;
  }[];
  const hit = results[0];
  const lat = Number(hit?.lat);
  const lng = Number(hit?.lon);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  const center = { lat, lng };
  db.prepare(
    `INSERT OR REPLACE INTO geocode_cache (query, lat, lng) VALUES (?, ?, ?)`,
  ).run(query, center.lat, center.lng);

  return center;
}

export async function resolveDestinationCenter(destination: string) {
  return (
    coordinatesForDestination(destination) ??
    (await geocodeWithNominatim(destination))
  );
}
