import { db } from "../lib/db";
import {
  airportForDestination,
  defaultOriginFor,
  getAirportByCode,
  listAirports,
} from "../lib/flights/airports";
import { getFlightById, searchFlights } from "../lib/flights/search";
import { getTripForUser } from "./trips";
import type { FlightDirection } from "../types/flight";

function isoDate(value: Date) {
  return value.toISOString().slice(0, 10);
}

export function tripAirports(destination: string) {
  const arrival = airportForDestination(destination);
  const origin = arrival ? defaultOriginFor(arrival) : null;
  return { origin, arrival, airports: listAirports() };
}

export function searchTripFlights(options: {
  fromCode: string;
  toCode: string;
  date: string;
  travellers: number;
  direction: FlightDirection;
}) {
  return searchFlights(options);
}

export function quotedFlight(id: string | null | undefined, travellers: number) {
  if (!id) {
    return null;
  }
  return getFlightById(id, travellers);
}

export function chooseFlightsForTrip(
  userId: string,
  tripId: string,
  input: { outboundFlightId: string | null; returnFlightId: string | null },
) {
  const trip = getTripForUser(userId, tripId);
  if (!trip) {
    return null;
  }

  const outbound = input.outboundFlightId
    ? getFlightById(input.outboundFlightId, trip.travellers)
    : null;
  const inbound = input.returnFlightId
    ? getFlightById(input.returnFlightId, trip.travellers)
    : null;

  if (input.outboundFlightId && !outbound) {
    return null;
  }
  if (input.returnFlightId && !inbound) {
    return null;
  }

  db.prepare(
    `UPDATE trips SET outboundFlightId = ?, returnFlightId = ?, updatedAt = ?
     WHERE id = ? AND userId = ?`,
  ).run(
    outbound?.id ?? null,
    inbound?.id ?? null,
    new Date().toISOString(),
    tripId,
    userId,
  );

  return getTripForUser(userId, tripId);
}

export function flightsForTrip(destination: string, startDate: Date, endDate: Date, travellers: number, fromCode?: string) {
  const { origin, arrival } = tripAirports(destination);
  const from = (fromCode ? getAirportByCode(fromCode) : null) ?? origin;
  if (!from || !arrival || from.code === arrival.code) {
    return { origin: from, arrival, outbound: [], inbound: [] };
  }

  return {
    origin: from,
    arrival,
    outbound: searchFlights({
      fromCode: from.code,
      toCode: arrival.code,
      date: isoDate(startDate),
      travellers,
      direction: "outbound",
    }),
    inbound: searchFlights({
      fromCode: arrival.code,
      toCode: from.code,
      date: isoDate(endDate),
      travellers,
      direction: "return",
    }),
  };
}

export { getAirportByCode, listAirports, airportForDestination };
