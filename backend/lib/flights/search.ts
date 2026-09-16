import { haversineKm } from "../geo";
import { zarToCents } from "../money";
import type { Flight, FlightDirection } from "../../types/flight";
import { getAirportByCode } from "./airports";

const AIRLINES = [
  { code: "FA", name: "FlySafair", rate: 1.55 },
  { code: "4Z", name: "Airlink", rate: 2.15 },
  { code: "SA", name: "SAA", rate: 1.95 },
  { code: "GE", name: "LIFT", rate: 1.7 },
  { code: "5Z", name: "CemAir", rate: 2.35 },
] as const;

const SLOTS = ["06:00", "08:30", "11:15", "14:40", "17:05", "19:20"];

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function addMinutes(hhmm: string, minutes: number) {
  const [hours, mins] = hhmm.split(":").map(Number);
  const total = (hours * 60 + mins + minutes) % (24 * 60);
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
}

function durationMinutes(distanceKm: number) {
  return Math.max(50, Math.round(30 + (distanceKm / 720) * 60));
}

function perPersonCents(distanceKm: number, rate: number) {
  const base = 450 + distanceKm * rate;
  return zarToCents(Math.round(base / 10) * 10);
}

export function encodeFlightId(options: {
  direction: FlightDirection;
  airlineCode: string;
  fromCode: string;
  toCode: string;
  date: string;
  departLocal: string;
  flightNumber: string;
}) {
  return [
    options.direction,
    options.airlineCode,
    options.fromCode,
    options.toCode,
    options.date,
    options.departLocal.replace(":", ""),
    options.flightNumber,
  ].join(".");
}

export function searchFlights(options: {
  fromCode: string;
  toCode: string;
  date: string;
  travellers: number;
  direction: FlightDirection;
}): Flight[] {
  const from = getAirportByCode(options.fromCode);
  const to = getAirportByCode(options.toCode);
  if (!from || !to || from.code === to.code) {
    return [];
  }

  const distanceKm = haversineKm(from.lat, from.lng, to.lat, to.lng);
  const duration = durationMinutes(distanceKm);
  const travellers = Math.max(1, options.travellers);

  return SLOTS.map((departLocal, index) => {
    const airline = AIRLINES[index % AIRLINES.length];
    const flightNumber = `${airline.code}${120 + index * 7}`;
    const id = encodeFlightId({
      direction: options.direction,
      airlineCode: airline.code,
      fromCode: from.code,
      toCode: to.code,
      date: options.date,
      departLocal,
      flightNumber,
    });
    const unit = perPersonCents(distanceKm, airline.rate);

    return {
      id,
      airline: airline.name,
      airlineCode: airline.code,
      flightNumber,
      fromCode: from.code,
      fromCity: from.city,
      toCode: to.code,
      toCity: to.city,
      date: options.date,
      departLocal,
      arriveLocal: addMinutes(departLocal, duration),
      durationMinutes: duration,
      perPersonCents: unit,
      partyCents: unit * travellers,
      direction: options.direction,
    };
  }).sort((a, b) => a.partyCents - b.partyCents);
}

export function getFlightById(id: string, travellers: number): Flight | null {
  const parts = id.split(".");
  if (parts.length !== 7) {
    return null;
  }

  const [direction, airlineCode, fromCode, toCode, date, departCompact, flightNumber] =
    parts;
  if (direction !== "outbound" && direction !== "return") {
    return null;
  }
  if (!/^\d{8}$/.test(date.replaceAll("-", "")) || departCompact.length !== 4) {
    return null;
  }

  const departLocal = `${departCompact.slice(0, 2)}:${departCompact.slice(2)}`;
  const flights = searchFlights({
    fromCode,
    toCode,
    date,
    travellers,
    direction,
  });

  return (
    flights.find(
      (flight) =>
        flight.airlineCode === airlineCode &&
        flight.flightNumber === flightNumber &&
        flight.departLocal === departLocal,
    ) ?? null
  );
}

export function flightLabel(flight: Flight) {
  return `${flight.airline} ${flight.flightNumber} · ${flight.fromCode} ${flight.departLocal} → ${flight.toCode} ${flight.arriveLocal}`;
}
