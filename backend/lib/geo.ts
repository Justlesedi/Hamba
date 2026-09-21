import { SOUTH_AFRICA_PLACES } from "./places/south-africa";

export type MapCenter = { lat: number; lng: number };

export const MAX_TRAVEL_MINUTES = 60;
export const AVERAGE_DRIVE_KMH = 60;
export const MAX_ACTIVITY_DISTANCE_KM = AVERAGE_DRIVE_KMH;
export const MAX_STAY_DISTANCE_KM = MAX_ACTIVITY_DISTANCE_KM;

export function travelMinutesFromKm(distanceKm: number) {
  if (distanceKm <= 0) {
    return 0;
  }

  return Math.max(1, Math.round((distanceKm / AVERAGE_DRIVE_KMH) * 60));
}

export function isWithinAnHour(distanceKm: number) {
  return travelMinutesFromKm(distanceKm) <= MAX_TRAVEL_MINUTES;
}

export function formatTravelAway(distanceKm: number) {
  const minutes = travelMinutesFromKm(distanceKm);
  const distance =
    distanceKm < 1
      ? `${Math.round(distanceKm * 1000)} m`
      : `${distanceKm.toFixed(1)} km`;

  if (minutes <= 0) {
    return distance;
  }

  if (minutes < 60) {
    return `${distance} · ${minutes} min`;
  }

  return `${distance} · 1 h`;
}

export function normalizePlace(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function includesAlias(haystack: string, alias: string) {
  if (haystack === alias) {
    return true;
  }

  if (` ${haystack} `.includes(` ${alias} `)) {
    return true;
  }

  const compactHaystack = haystack.replace(/\s+/g, "");
  const compactAlias = alias.replace(/\s+/g, "");
  return compactAlias.length >= 5 && compactHaystack.includes(compactAlias);
}

export function coordinatesForDestination(destination: string): MapCenter | null {
  const needle = normalizePlace(destination);
  if (!needle) {
    return null;
  }

  const ranked = SOUTH_AFRICA_PLACES.flatMap((place) =>
    place.aliases.map((alias) => ({
      alias: normalizePlace(alias),
      lat: place.lat,
      lng: place.lng,
    })),
  ).sort((a, b) => b.alias.length - a.alias.length);

  const match = ranked.find((place) => includesAlias(needle, place.alias));
  return match ? { lat: match.lat, lng: match.lng } : null;
}

export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  return 2 * 6371 * Math.asin(Math.sqrt(a));
}
