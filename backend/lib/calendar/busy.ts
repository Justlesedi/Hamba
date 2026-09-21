export type BusyLevel = "empty" | "moderate" | "full";

export type BusyPlaceKind = "stay" | "activity" | "food" | "destination";

export type BusyDay = {
  date: string;
  level: BusyLevel;
  reasons: string[];
};

export function busyLevelLabel(level: BusyLevel) {
  if (level === "full") {
    return "Full";
  }
  if (level === "moderate") {
    return "Moderate";
  }
  return "Empty";
}

export function busiestLevel(levels: BusyLevel[]) {
  if (levels.includes("full")) {
    return "full";
  }
  if (levels.includes("moderate")) {
    return "moderate";
  }
  return "empty";
}

function hashSeed(value: string) {
  let hash = 0;
  for (const char of value) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return hash;
}

const SCHOOL_HOLIDAYS: Array<[string, string]> = [
  ["2025-12-05", "2026-01-14"],
  ["2026-03-28", "2026-04-13"],
  ["2026-06-27", "2026-07-20"],
  ["2026-09-26", "2026-10-05"],
  ["2026-12-04", "2027-01-13"],
  ["2027-03-20", "2027-04-12"],
  ["2027-06-26", "2027-07-19"],
  ["2027-09-25", "2027-10-04"],
  ["2027-12-03", "2028-01-12"],
];

export function isSchoolHoliday(date: string) {
  return SCHOOL_HOLIDAYS.some(([start, end]) => date >= start && date <= end);
}

function destinationSeason(destination: string, month: number) {
  const place = destination.toLowerCase();
  const cape =
    /cape town|kaapstad|camps bay|stellenbosch|franschhoek|paarl|hermanus|constantia|hout bay/.test(
      place,
    );
  const coast =
    /durban|umhlanga|ballito|margate|port shepstone|jeffreys|gqeberha|port elizabeth|east london/.test(
      place,
    );
  const safari =
    /kruger|hazyview|hoedspruit|skukuza|phalaborwa|mbombela|nelspruit|white river/.test(
      place,
    );
  const garden = /knysna|plettenberg|george|mossel|oudtshoorn/.test(place);

  if (cape && [11, 12, 1, 2].includes(month)) {
    return { score: 2, reason: "Cape high season" };
  }
  if (cape && [3, 4, 10].includes(month)) {
    return { score: 1, reason: "Cape shoulder season" };
  }
  if (coast && [12, 1].includes(month)) {
    return { score: 2, reason: "Coastal high season" };
  }
  if (safari && [6, 7, 8, 9].includes(month)) {
    return { score: 2, reason: "Safari dry season" };
  }
  if (garden && [12, 1, 4, 10].includes(month)) {
    return { score: 1, reason: "Garden Route peak" };
  }
  if ([12, 1].includes(month)) {
    return { score: 1, reason: "Summer holidays" };
  }
  return { score: 0, reason: null };
}

function listingBump(name: string, kind: BusyPlaceKind, stayKind?: string) {
  const text = `${name} ${stayKind ?? ""}`.toLowerCase();
  let bump = 0;
  if (kind === "activity" && /beach|mountain|park|falls|garden|point|heads/.test(text)) {
    bump += 1;
  }
  if (kind === "stay" && stayKind === "house") {
    bump += 0;
  }
  if (kind === "stay" && stayKind === "hotel") {
    bump += 1;
  }
  if (/museum|gallery|library/.test(text)) {
    bump -= 1;
  }
  return bump;
}

export function busyScore(options: {
  date: string;
  weekday: number;
  destination: string;
  holidayName?: string | null;
  longWeekend?: boolean;
  name?: string;
  kind?: BusyPlaceKind;
  stayKind?: string;
}) {
  const month = Number(options.date.slice(5, 7));
  const reasons: string[] = [];
  let score = 0;

  if (options.weekday === 0 || options.weekday === 6) {
    score += 2;
    reasons.push("Weekend");
  } else if (options.weekday === 5) {
    score += 1;
    reasons.push("Friday");
  }

  if (options.holidayName) {
    score += 3;
    reasons.push(options.holidayName);
  } else if (options.longWeekend) {
    score += 2;
    reasons.push("Long weekend");
  }

  if (isSchoolHoliday(options.date)) {
    score += 2;
    reasons.push("School holidays");
  }

  const season = destinationSeason(options.destination, month);
  if (season.reason) {
    score += season.score;
    reasons.push(season.reason);
  }

  score += listingBump(options.name ?? "", options.kind ?? "destination", options.stayKind);

  const variety = hashSeed(`${options.name ?? options.destination}-${options.date}`) % 3;
  score += variety - 1;

  return { score: Math.max(0, score), reasons };
}

export function nudgeBusyLevel(level: BusyLevel, seed: string): BusyLevel {
  const n = hashSeed(seed) % 7;
  if (n === 0 && level === "moderate") {
    return "full";
  }
  if (n === 1 && level === "empty") {
    return "moderate";
  }
  if (n === 6 && level === "full") {
    return "moderate";
  }
  return level;
}

export function levelFromScore(score: number): BusyLevel {
  if (score >= 6) {
    return "full";
  }
  if (score >= 3) {
    return "moderate";
  }
  return "empty";
}
