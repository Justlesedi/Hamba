import { normalizePlace } from "../geo";
import { zarToCents } from "../money";

function matchesAny(destination: string, aliases: string[]) {
  const needle = normalizePlace(destination);
  return aliases.some((alias) => needle.includes(normalizePlace(alias)));
}

export function nightlyStayCents(destination: string) {
  if (
    matchesAny(destination, [
      "kruger",
      "skukuza",
      "hoedspruit",
      "phalaborwa",
    ])
  ) {
    return zarToCents(1800);
  }

  if (matchesAny(destination, ["sun city", "pilanesberg"])) {
    return zarToCents(1600);
  }

  if (
    matchesAny(destination, [
      "cape town",
      "camps bay",
      "stellenbosch",
      "franschhoek",
      "sandton",
    ])
  ) {
    return zarToCents(1400);
  }

  if (
    matchesAny(destination, [
      "johannesburg",
      "joburg",
      "pretoria",
      "durban",
      "umhlanga",
      "ballito",
    ])
  ) {
    return zarToCents(1200);
  }

  if (
    matchesAny(destination, [
      "knysna",
      "plettenberg",
      "hermanus",
      "george",
      "mossel bay",
    ])
  ) {
    return zarToCents(1100);
  }

  if (
    matchesAny(destination, [
      "mbombela",
      "nelspruit",
      "mpumalanga",
      "hazyview",
      "white river",
      "graskop",
    ])
  ) {
    return zarToCents(1000);
  }

  return zarToCents(850);
}

export function stayRooms(travellers: number) {
  return Math.max(1, Math.ceil(travellers / 2));
}

export function tripNights(startDate: Date, endDate: Date) {
  const start = Date.UTC(
    startDate.getUTCFullYear(),
    startDate.getUTCMonth(),
    startDate.getUTCDate(),
  );
  const end = Date.UTC(
    endDate.getUTCFullYear(),
    endDate.getUTCMonth(),
    endDate.getUTCDate(),
  );
  return Math.max(0, Math.round((end - start) / 86_400_000));
}

export function estimateTransportCents(options: {
  nights: number;
  travellers: number;
}) {
  const travelDays = Math.max(1, options.nights + 1);
  const cars = Math.ceil(options.travellers / 3);
  const localKmPerDay = 35;

  const uberCents = travelDays * 4 * zarToCents(180) * cars;
  const busCents = travelDays * 4 * zarToCents(25) * options.travellers;
  const litres = (travelDays * localKmPerDay * 8.5) / 100;
  const fuelCents = Math.round(litres * zarToCents(22.5) + travelDays * zarToCents(40));

  return { uberCents, busCents, fuelCents, travelDays };
}
