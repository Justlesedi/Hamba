import { randomUUID } from "node:crypto";
import { db } from "../lib/db";
import { zarToCents } from "../lib/money";
import type { CreateTripInput, Trip } from "../types/trip";

type TripRow = {
  id: string;
  userId: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  currency: string;
  budgetCents: number | null;
  travellers: number;
  stayId: string | null;
  outboundFlightId: string | null;
  returnFlightId: string | null;
  createdAt: string;
  updatedAt: string;
};

function mapTrip(row: TripRow): Trip {
  return {
    id: row.id,
    userId: row.userId,
    title: row.title,
    destination: row.destination,
    startDate: new Date(row.startDate),
    endDate: new Date(row.endDate),
    currency: row.currency,
    budgetCents: row.budgetCents,
    travellers: row.travellers,
    stayId: row.stayId ?? null,
    outboundFlightId: row.outboundFlightId ?? null,
    returnFlightId: row.returnFlightId ?? null,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}

export function listTrips(userId: string) {
  const rows = db
    .prepare(
      `SELECT * FROM trips WHERE userId = ? ORDER BY startDate ASC`,
    )
    .all(userId) as TripRow[];

  return rows.map(mapTrip);
}

export function getTripForUser(userId: string, tripId: string) {
  const row = db
    .prepare(`SELECT * FROM trips WHERE id = ? AND userId = ?`)
    .get(tripId, userId) as TripRow | undefined;

  return row ? mapTrip(row) : null;
}

export function createTrip(userId: string, input: CreateTripInput) {
  const now = new Date().toISOString();
  const id = randomUUID();

  db.prepare(
    `INSERT INTO trips (
      id, userId, title, destination, startDate, endDate,
      currency, budgetCents, travellers, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, 'ZAR', NULL, ?, ?, ?)`,
  ).run(
    id,
    userId,
    input.title.trim(),
    input.destination.trim(),
    `${input.startDate}T00:00:00.000Z`,
    `${input.endDate}T00:00:00.000Z`,
    input.travellers,
    now,
    now,
  );

  return getTripForUser(userId, id)!;
}

export function updateTripBudget(userId: string, tripId: string, budgetZar: number) {
  const trip = getTripForUser(userId, tripId);
  if (!trip) {
    return null;
  }

  db.prepare(
    `UPDATE trips SET budgetCents = ?, updatedAt = ? WHERE id = ? AND userId = ?`,
  ).run(zarToCents(budgetZar), new Date().toISOString(), tripId, userId);

  return getTripForUser(userId, tripId);
}
