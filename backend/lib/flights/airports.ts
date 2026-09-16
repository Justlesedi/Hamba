import { normalizePlace } from "../geo";
import type { Airport } from "../../types/flight";

export const SOUTH_AFRICA_AIRPORTS: Airport[] = [
  {
    code: "JNB",
    name: "O.R. Tambo International",
    city: "Johannesburg",
    lat: -26.1392,
    lng: 28.246,
    aliases: [
      "johannesburg",
      "joburg",
      "jozi",
      "sandton",
      "pretoria",
      "tshwane",
      "soweto",
      "centurion",
      "midrand",
    ],
  },
  {
    code: "CPT",
    name: "Cape Town International",
    city: "Cape Town",
    lat: -33.9715,
    lng: 18.6021,
    aliases: [
      "cape town",
      "kaapstad",
      "camps bay",
      "stellenbosch",
      "franschhoek",
      "paarl",
      "hermanus",
    ],
  },
  {
    code: "DUR",
    name: "King Shaka International",
    city: "Durban",
    lat: -29.6144,
    lng: 31.1197,
    aliases: ["durban", "umhlanga", "ballito", "pietermaritzburg", "pmb"],
  },
  {
    code: "PLZ",
    name: "Chief Dawid Stuurman International",
    city: "Gqeberha",
    lat: -33.9849,
    lng: 25.6173,
    aliases: ["gqeberha", "port elizabeth", "jeffreys bay", "j bay"],
  },
  {
    code: "ELS",
    name: "King Phalo Airport",
    city: "East London",
    lat: -33.0356,
    lng: 27.8253,
    aliases: ["east london"],
  },
  {
    code: "BFN",
    name: "Bram Fischer International",
    city: "Bloemfontein",
    lat: -29.0927,
    lng: 26.3024,
    aliases: ["bloemfontein", "mangaung"],
  },
  {
    code: "GRJ",
    name: "George Airport",
    city: "George",
    lat: -34.0056,
    lng: 22.3789,
    aliases: ["george", "knysna", "plettenberg", "mossel bay", "oudtshoorn"],
  },
  {
    code: "MQP",
    name: "Kruger Mpumalanga International",
    city: "Mbombela",
    lat: -25.3832,
    lng: 31.1056,
    aliases: [
      "mbombela",
      "nelspruit",
      "kruger",
      "hazyview",
      "white river",
      "skukuza",
    ],
  },
  {
    code: "HDS",
    name: "Air Force Base Hoedspruit",
    city: "Hoedspruit",
    lat: -24.3686,
    lng: 31.0487,
    aliases: ["hoedspruit", "phalaborwa"],
  },
  {
    code: "PTG",
    name: "Polokwane International",
    city: "Polokwane",
    lat: -23.8453,
    lng: 29.4586,
    aliases: ["polokwane"],
  },
  {
    code: "KIM",
    name: "Kimberley Airport",
    city: "Kimberley",
    lat: -28.8028,
    lng: 24.7652,
    aliases: ["kimberley"],
  },
  {
    code: "UTN",
    name: "Upington International",
    city: "Upington",
    lat: -28.3991,
    lng: 21.2602,
    aliases: ["upington"],
  },
];

export function listAirports() {
  return SOUTH_AFRICA_AIRPORTS;
}

export function getAirportByCode(code: string) {
  const needle = code.trim().toUpperCase();
  return SOUTH_AFRICA_AIRPORTS.find((airport) => airport.code === needle) ?? null;
}

export function airportForDestination(destination: string) {
  const needle = normalizePlace(destination);
  if (!needle) {
    return null;
  }

  const ranked = SOUTH_AFRICA_AIRPORTS.flatMap((airport) =>
    airport.aliases.map((alias) => ({
      alias: normalizePlace(alias),
      airport,
    })),
  ).sort((a, b) => b.alias.length - a.alias.length);

  return ranked.find((entry) => needle.includes(entry.alias))?.airport ?? null;
}

export function defaultOriginFor(destination: Airport) {
  if (destination.code === "JNB") {
    return getAirportByCode("CPT");
  }
  return getAirportByCode("JNB");
}
