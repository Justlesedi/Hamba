import { db } from "../lib/db";
import { openStatusFromHours } from "../lib/hours";
import { getActivityById } from "./activities";
import { getTripForUser } from "./trips";

export function listTripPlaceIds(tripId: string) {
  const rows = db
    .prepare(
      `SELECT activityId FROM trip_places WHERE tripId = ? ORDER BY createdAt, activityId`,
    )
    .all(tripId) as { activityId: string }[];

  return rows.map((row) => row.activityId);
}

function uniqueIds(ids: string[]) {
  return [...new Set(ids.filter((id) => id.length > 0))];
}

function touchTrip(userId: string, tripId: string) {
  db.prepare(
    `UPDATE trips SET updatedAt = ? WHERE id = ? AND userId = ?`,
  ).run(new Date().toISOString(), tripId, userId);
}

export function addTripPlaces(
  userId: string,
  tripId: string,
  activityIds: string[],
) {
  const trip = getTripForUser(userId, tripId);
  if (!trip) {
    return null;
  }

  const insert = db.prepare(
    `INSERT OR IGNORE INTO trip_places (tripId, activityId, createdAt) VALUES (?, ?, ?)`,
  );
  const now = new Date().toISOString();

  for (const activityId of uniqueIds(activityIds)) {
    const activity = getActivityById(activityId);
    if (!activity) {
      continue;
    }
    if (openStatusFromHours(activity.operatingHours).state === "closed") {
      continue;
    }
    insert.run(tripId, activityId, now);
  }

  touchTrip(userId, tripId);
  return listTripPlaceIds(tripId);
}

export function removeTripPlaces(
  userId: string,
  tripId: string,
  activityIds: string[],
) {
  const trip = getTripForUser(userId, tripId);
  if (!trip) {
    return null;
  }

  const remove = db.prepare(
    `DELETE FROM trip_places WHERE tripId = ? AND activityId = ?`,
  );

  for (const activityId of uniqueIds(activityIds)) {
    remove.run(tripId, activityId);
  }

  touchTrip(userId, tripId);
  return listTripPlaceIds(tripId);
}

export function toggleTripPlace(
  userId: string,
  tripId: string,
  activityId: string,
) {
  const existing = listTripPlaceIds(tripId);
  if (existing.includes(activityId)) {
    return removeTripPlaces(userId, tripId, [activityId]);
  }
  return addTripPlaces(userId, tripId, [activityId]);
}
