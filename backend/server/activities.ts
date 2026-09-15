import { db } from "../lib/db";
import {
  haversineKm,
  MAX_ACTIVITY_DISTANCE_KM,
} from "../lib/geo";
import type { Activity, NearbyActivity } from "../types/activity";

type ActivityRow = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  company: string;
  operatingHours: string;
  area: string;
};

function mapActivity(row: ActivityRow): Activity {
  return {
    id: row.id,
    name: row.name,
    latitude: row.latitude,
    longitude: row.longitude,
    company: row.company,
    operatingHours: row.operatingHours,
    area: row.area,
  };
}

export function searchNearbyActivities(
  latitude: number,
  longitude: number,
  radiusKm = MAX_ACTIVITY_DISTANCE_KM,
): NearbyActivity[] {
  const cap = Math.min(radiusKm, MAX_ACTIVITY_DISTANCE_KM);
  const rows = db.prepare(`SELECT * FROM activities`).all() as ActivityRow[];

  return rows
    .map((row) => {
      const distanceKm =
        Math.round(haversineKm(latitude, longitude, row.latitude, row.longitude) * 10) /
        10;

      return {
        ...mapActivity(row),
        distanceKm,
      };
    })
    .filter((activity) => activity.distanceKm <= cap)
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

export function getActivityById(id: string) {
  const row = db
    .prepare(`SELECT * FROM activities WHERE id = ?`)
    .get(id) as ActivityRow | undefined;

  return row ? mapActivity(row) : null;
}
