import { db } from "../lib/db";
import {
  haversineKm,
  MAX_ACTIVITY_DISTANCE_KM,
} from "../lib/geo";
import {
  activityCostCents,
  activityPricing,
} from "../lib/activities/costs";
import { openStatusFromHours } from "../lib/hours";
import type { Activity, NearbyActivity } from "../types/activity";

type ActivityRow = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  company: string;
  operatingHours: string;
  area: string;
  kind: string | null;
  estimatedCostCents: number | null;
};

function mapActivity(row: ActivityRow): Activity {
  const kind =
    row.kind === "food" || row.id.startsWith("food_") ? "food" : "activity";

  return {
    id: row.id,
    name: row.name,
    latitude: row.latitude,
    longitude: row.longitude,
    company: row.company,
    operatingHours: row.operatingHours,
    area: row.area,
    kind,
    estimatedCostCents: Number(row.estimatedCostCents ?? 0) || activityCostCents(row.id),
  };
}

function withPlanFields(activity: Activity, distanceKm: number): NearbyActivity {
  const pricing = activityPricing(activity.id, activity.kind);
  return {
    ...activity,
    distanceKm,
    priceUnit: pricing.priceUnit,
    typicalHours: pricing.typicalHours,
    openStatus: openStatusFromHours(activity.operatingHours),
  };
}

export function searchNearbyActivities(
  latitude: number,
  longitude: number,
  radiusKm = MAX_ACTIVITY_DISTANCE_KM,
): NearbyActivity[] {
  const cap = Math.min(radiusKm, MAX_ACTIVITY_DISTANCE_KM);
  const rows = db
    .prepare(
      `SELECT id, name, latitude, longitude, company, operatingHours, area, kind, estimatedCostCents
       FROM activities`,
    )
    .all() as ActivityRow[];

  return rows
    .map((row) => {
      const activity = mapActivity(row);
      const distanceKm =
        Math.round(haversineKm(latitude, longitude, activity.latitude, activity.longitude) * 10) /
        10;
      return withPlanFields(activity, distanceKm);
    })
    .filter((activity) => activity.distanceKm <= cap)
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

export function getActivityById(id: string) {
  const row = db
    .prepare(
      `SELECT id, name, latitude, longitude, company, operatingHours, area, kind, estimatedCostCents
       FROM activities WHERE id = ?`,
    )
    .get(id) as ActivityRow | undefined;

  return row ? mapActivity(row) : null;
}

export function getNearbyActivityById(
  id: string,
  from?: { lat: number; lng: number },
) {
  const activity = getActivityById(id);
  if (!activity) {
    return null;
  }
  const distanceKm = from
    ? Math.round(
        haversineKm(from.lat, from.lng, activity.latitude, activity.longitude) * 10,
      ) / 10
    : 0;
  return withPlanFields(activity, distanceKm);
}
