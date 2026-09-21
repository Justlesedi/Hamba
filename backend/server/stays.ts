import { db } from "../lib/db";
import {
  haversineKm,
  isWithinAnHour,
  MAX_STAY_DISTANCE_KM,
} from "../lib/geo";
import {
  clampStayUnits,
  stayTotalCents,
} from "../lib/budget/estimates";
import { openStatusFromHours } from "../lib/hours";
import { stayCapacity, type QuotedStay, type Stay, type StayKind } from "../types/stay";
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
  beds: number | null;
  rooms: number | null;
  nightlyCents: number;
  note: string;
  operatingHours: string | null;
};

const STAY_KINDS = new Set<StayKind>([
  "hotel",
  "house",
  "guesthouse",
  "lodge",
  "camp",
  "apartment",
]);

function mapStay(row: StayRow): Stay {
  const kind = STAY_KINDS.has(row.kind as StayKind)
    ? (row.kind as StayKind)
    : "hotel";
  const sleeps = Number(row.sleeps);
  const fallback = stayCapacity(kind, sleeps);

  return {
    id: row.id,
    name: row.name,
    latitude: row.latitude,
    longitude: row.longitude,
    company: row.company,
    area: row.area,
    kind,
    sleeps,
    beds: Number(row.beds ?? fallback.beds),
    rooms: Number(row.rooms ?? fallback.rooms),
    nightlyCents: Number(row.nightlyCents),
    note: row.note,
    operatingHours: row.operatingHours || "Open 24 hours",
  };
}

export function quoteStay(
  stay: Stay,
  options: {
    nights: number;
    units?: number;
    travellers?: number;
    distanceKm?: number;
  },
): QuotedStay {
  const units = clampStayUnits(
    options.units ?? 1,
    options.travellers ?? options.units ?? 1,
  );
  const nights = Math.max(0, options.nights);

  return {
    ...stay,
    distanceKm: options.distanceKm ?? 0,
    units,
    nights,
    totalCents: stayTotalCents(stay.nightlyCents, units, nights),
    openStatus: openStatusFromHours(stay.operatingHours),
  };
}

export function getStayById(id: string) {
  const row = db
    .prepare(
      `SELECT id, name, latitude, longitude, company, area, kind, sleeps, beds, rooms, nightlyCents, note, operatingHours
       FROM stays WHERE id = ?`,
    )
    .get(id) as StayRow | undefined;

  return row ? mapStay(row) : null;
}

export function searchNearbyStays(
  latitude: number,
  longitude: number,
  options: {
    nights: number;
    units?: number;
    travellers?: number;
    radiusKm?: number;
  },
): QuotedStay[] {
  const cap = Math.min(options.radiusKm ?? MAX_STAY_DISTANCE_KM, MAX_STAY_DISTANCE_KM);
  const rows = db
    .prepare(
      `SELECT id, name, latitude, longitude, company, area, kind, sleeps, beds, rooms, nightlyCents, note, operatingHours
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
        nights: options.nights,
        units: options.units,
        travellers: options.travellers,
        distanceKm,
      });
    })
    .filter(
      (stay) => stay.distanceKm <= cap && isWithinAnHour(stay.distanceKm),
    )
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

export function chooseStayForTrip(
  userId: string,
  tripId: string,
  stayId: string | null,
  stayUnits?: number,
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

  const units = clampStayUnits(stayUnits ?? trip.stayUnits, trip.travellers);

  db.prepare(
    `UPDATE trips SET stayId = ?, stayUnits = ?, updatedAt = ? WHERE id = ? AND userId = ?`,
  ).run(stayId, units, new Date().toISOString(), tripId, userId);

  return getTripForUser(userId, tripId);
}
