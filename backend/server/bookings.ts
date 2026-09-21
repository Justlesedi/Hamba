import { randomUUID } from "node:crypto";
import { bookingCommissionCents, isTransportMode } from "../lib/booking";
import {
  activityCostCents,
  activityPricing,
  placePartyCostCents,
} from "../lib/activities/costs";
import { tripNights } from "../lib/budget/estimates";
import { db } from "../lib/db";
import { getNearbyActivityById } from "./activities";
import { getStayById, quoteStay } from "./stays";
import { getTripForUser } from "./trips";
import type { Booking, BookingPlace } from "../types/booking";

type BookingRow = {
  id: string;
  userId: string;
  tripId: string;
  tripTitle: string;
  destination: string;
  startDate: string;
  endDate: string;
  travellers: number;
  stayId: string | null;
  stayName: string;
  stayArea: string;
  stayTotalCents: number;
  outboundFlightId: string | null;
  outboundLabel: string;
  outboundCents: number;
  returnFlightId: string | null;
  returnLabel: string;
  returnCents: number;
  transportMode: string;
  transportCents: number;
  placesTotalCents: number;
  commissionCents: number;
  totalCents: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type BookingPlaceRow = {
  bookingId: string;
  activityId: string;
  name: string;
  kind: string;
  company: string;
  area: string;
  amountCents: number;
  sortOrder: number;
};

export class BookingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BookingError";
  }
}

function mapPlace(row: BookingPlaceRow): BookingPlace {
  return {
    activityId: row.activityId,
    name: row.name,
    kind: row.kind === "food" ? "food" : "activity",
    company: row.company,
    area: row.area,
    amountCents: Number(row.amountCents),
    sortOrder: Number(row.sortOrder),
  };
}

function mapBooking(row: BookingRow, places: BookingPlace[]): Booking {
  return {
    id: row.id,
    userId: row.userId,
    tripId: row.tripId,
    tripTitle: row.tripTitle,
    destination: row.destination,
    startDate: new Date(row.startDate),
    endDate: new Date(row.endDate),
    travellers: Number(row.travellers),
    stayId: row.stayId,
    stayName: row.stayName,
    stayArea: row.stayArea,
    stayTotalCents: Number(row.stayTotalCents),
    outbound:
      row.outboundFlightId && row.outboundLabel
        ? {
            id: row.outboundFlightId,
            label: row.outboundLabel,
            amountCents: Number(row.outboundCents),
          }
        : null,
    inbound:
      row.returnFlightId && row.returnLabel
        ? {
            id: row.returnFlightId,
            label: row.returnLabel,
            amountCents: Number(row.returnCents),
          }
        : null,
    flightTotalCents: Number(row.outboundCents) + Number(row.returnCents),
    transportMode: isTransportMode(row.transportMode)
      ? row.transportMode
      : "none",
    transportCents: Number(row.transportCents),
    placesTotalCents: Number(row.placesTotalCents),
    commissionCents: Number(row.commissionCents ?? 0),
    totalCents: Number(row.totalCents),
    status: row.status === "cancelled" ? "cancelled" : "confirmed",
    places,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}

function listBookingPlaces(bookingId: string) {
  const rows = db
    .prepare(
      `SELECT bookingId, activityId, name, kind, company, area, amountCents, sortOrder
       FROM booking_places WHERE bookingId = ? ORDER BY sortOrder, activityId`,
    )
    .all(bookingId) as BookingPlaceRow[];

  return rows.map(mapPlace);
}

function hydrate(row: BookingRow | undefined) {
  if (!row) {
    return null;
  }
  return mapBooking(row, listBookingPlaces(row.id));
}

export function listBookingsForUser(userId: string) {
  const rows = db
    .prepare(
      `SELECT * FROM bookings WHERE userId = ? ORDER BY createdAt DESC`,
    )
    .all(userId) as BookingRow[];

  return rows.map((row) => mapBooking(row, listBookingPlaces(row.id)));
}

export function getBookingForUser(userId: string, bookingId: string) {
  const row = db
    .prepare(`SELECT * FROM bookings WHERE id = ? AND userId = ?`)
    .get(bookingId, userId) as BookingRow | undefined;

  return hydrate(row);
}

export function getConfirmedBookingForTrip(userId: string, tripId: string) {
  const row = db
    .prepare(
      `SELECT * FROM bookings
       WHERE userId = ? AND tripId = ? AND status = 'confirmed'`,
    )
    .get(userId, tripId) as BookingRow | undefined;

  return hydrate(row);
}

export function createBooking(
  userId: string,
  tripId: string,
  input: { stayId: string; activityIds: string[] },
) {
  const trip = getTripForUser(userId, tripId);
  if (!trip) {
    return null;
  }

  if (getConfirmedBookingForTrip(userId, tripId)) {
    throw new BookingError("This trip is already booked.");
  }

  const stay = getStayById(input.stayId);
  if (!stay) {
    throw new BookingError("Choose a stay to book.");
  }

  const quotedStay = quoteStay(stay, {
    nights: tripNights(trip.startDate, trip.endDate),
    units: trip.stayUnits,
    travellers: trip.travellers,
  });

  const origin = { lat: stay.latitude, lng: stay.longitude };
  const places: Array<{
    activityId: string;
    name: string;
    kind: "activity";
    company: string;
    area: string;
    amountCents: number;
  }> = [];

  for (const activityId of [...new Set(input.activityIds.filter(Boolean))]) {
    const place = getNearbyActivityById(activityId, origin);
    if (!place) {
      throw new BookingError("One of the activities could not be found.");
    }
    if (!place.requiresBooking) {
      throw new BookingError(
        `${place.name} does not need a booking. Pay on arrival or skip it.`,
      );
    }
    if (place.openStatus.state === "closed") {
      throw new BookingError(
        `${place.name} is closed and cannot be booked right now.`,
      );
    }

    const unitCents =
      place.estimatedCostCents > 0
        ? place.estimatedCostCents
        : activityCostCents(place.id);
    const pricing = activityPricing(place.id, place.kind);

    places.push({
      activityId: place.id,
      name: place.name,
      kind: "activity",
      company: place.company,
      area: place.area,
      amountCents: placePartyCostCents(unitCents, trip.travellers, pricing),
    });
  }

  const placesTotalCents = places.reduce(
    (sum, place) => sum + place.amountCents,
    0,
  );
  const commissionCents = bookingCommissionCents(
    quotedStay.totalCents + placesTotalCents,
  );
  const totalCents = quotedStay.totalCents + placesTotalCents + commissionCents;
  const now = new Date().toISOString();
  const id = randomUUID();

  db.exec("BEGIN");
  try {
    db.prepare(
      `INSERT INTO bookings (
        id, userId, tripId, tripTitle, destination, startDate, endDate,
        travellers, stayId, stayName, stayArea, stayTotalCents,
        outboundFlightId, outboundLabel, outboundCents,
        returnFlightId, returnLabel, returnCents,
        transportMode, transportCents, placesTotalCents, commissionCents, totalCents,
        status, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', ?, ?)`,
    ).run(
      id,
      userId,
      trip.id,
      trip.title,
      trip.destination,
      trip.startDate.toISOString(),
      trip.endDate.toISOString(),
      trip.travellers,
      quotedStay.id,
      quotedStay.name,
      quotedStay.area,
      quotedStay.totalCents,
      null,
      "",
      0,
      null,
      "",
      0,
      "none",
      0,
      placesTotalCents,
      commissionCents,
      totalCents,
      now,
      now,
    );

    const insertPlace = db.prepare(
      `INSERT INTO booking_places (
        bookingId, activityId, name, kind, company, area, amountCents, sortOrder
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    );

    places.forEach((place, index) => {
      insertPlace.run(
        id,
        place.activityId,
        place.name,
        place.kind,
        place.company,
        place.area,
        place.amountCents,
        index,
      );
    });

    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }

  return getBookingForUser(userId, id);
}

export function cancelBooking(userId: string, bookingId: string) {
  const booking = getBookingForUser(userId, bookingId);
  if (!booking) {
    return null;
  }

  if (booking.status !== "confirmed") {
    return booking;
  }

  db.prepare(
    `UPDATE bookings SET status = 'cancelled', updatedAt = ? WHERE id = ? AND userId = ?`,
  ).run(new Date().toISOString(), bookingId, userId);

  return getBookingForUser(userId, bookingId);
}

export function deleteBooking(userId: string, bookingId: string) {
  const booking = getBookingForUser(userId, bookingId);
  if (!booking) {
    return null;
  }

  db.exec("BEGIN");
  try {
    db.prepare(`DELETE FROM booking_places WHERE bookingId = ?`).run(bookingId);
    db.prepare(`DELETE FROM bookings WHERE id = ? AND userId = ?`).run(
      bookingId,
      userId,
    );
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }

  return booking;
}
