export type FlightDirection = "outbound" | "return";

export type Airport = {
  code: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  aliases: string[];
};

export type Flight = {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  fromCode: string;
  fromCity: string;
  toCode: string;
  toCity: string;
  date: string;
  departLocal: string;
  arriveLocal: string;
  durationMinutes: number;
  perPersonCents: number;
  partyCents: number;
  direction: FlightDirection;
};
