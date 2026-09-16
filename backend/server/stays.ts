import { db } from "../lib/db";
import {
  haversineKm,
  MAX_STAY_DISTANCE_KM,
} from "../lib/geo";
import { stayUnits } from "../lib/budget/estimates";
import { openStatusFromHours } from "../lib/hours";
import type { QuotedStay, Stay, StayKind } from "../types/stay";
import { getTripForUser } from "./trips";

type StayRow = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  company: string;
  area: string;
  kind: string;
  sleeps: number;
  nightlyCents: number;
  note: string;
  operatingHours: string | null;
};

const STAY_KINDS = new Set<StayKind>([
  "hotel",
  "guesthouse",
  "lodge",
  "camp",
  "apartment",
]);

function mapStay(row: StayRow): Stay {
  return {
    id: row.id,
    name: row.name,
    latitude: row.latitude,
    longitude: row.longitude,
    company: row.company,
    area: row.area,
    kind: STAY_KINDS.has(row.kind as StayKind)
      ? (row.kind as StayKind)
      : "hotel",
    sleeps: Number(row.sleeps),
    nightlyCents: Number(row.nightlyCents),
    note: row.note,
    operatingHours: row.operatingHours || "Open 24 hours",
  };
}

export function quoteStay(
  stay: Stay,
  options: { travellers: number; nights: number; distanceKm?: number },
): QuotedStay {
  const units = stayUnits(options.travellers, stay.sleeps);
  const nights = Math.max(0, options.nights);

  return {
    ...stay,
    distanceKm: options.distanceKm ?? 0,
    units,
    nights,
    totalCents: stay.nightlyCents * units * nights,
    openStatus: openStatusFromHours(stay.operatingHours),
  };
}

export function getStayById(id: string) {
  const row = db
    .prepare(
      `SELECT id, name, latitude, longitude, company, area, kind, sleeps, nightlyCents, note, operatingHours
       FROM stays WHERE id = ?`,
    )
    .get(id) as StayRow | undefined;

  return row ? mapStay(row) : null;
}

export function searchNearbyStays(
  latitude: number,
  longitude: number,
  options: { travellers: number; nights: number; radiusKm?: number },
): QuotedStay[] {
  const cap = Math.min(options.radiusKm ?? MAX_STAY_DISTANCE_KM, MAX_STAY_DISTANCE_KM);
  const rows = db
    .prepare(
      `SELECT id, name, latitude, longitude, company, area, kind, sleeps, nightlyCents, note, operatingHours
       FROM stays`,
    )
    .all() as StayRow[];

  return rows
    .map((row) => {
      const stay = mapStay(row);
      const distanceKm =
        Math.round(haversineKm(latitude, longitude, stay.latitude, stay.longitude) * 10) /
        10;

      return quoteStay(stay, {
        travellers: options.travellers,
        nights: options.nights,
        distanceKm,
      });
    })
    .filter((stay) => stay.distanceKm <= cap)
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

export function chooseStayForTrip(
  userId: string,
  tripId: string,
  stayId: string | null,
) {
  const trip = getTripForUser(userId, tripId);
  if (!trip) {
    return null;
  }

  if (stayId) {
    const stay = getStayById(stayId);
    if (!stay) {
      return null;
    }
  }

  db.prepare(
    `UPDATE trips SET stayId = ?, updatedAt = ? WHERE id = ? AND userId = ?`,
  ).run(stayId, new Date().toISOString(), tripId, userId);

  return getTripForUser(userId, tripId);
}
