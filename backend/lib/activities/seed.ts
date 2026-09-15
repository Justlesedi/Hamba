import type { DatabaseSync } from "node:sqlite";
import { activityCostCents } from "./costs";
import type { Activity } from "../../types/activity";
import { CITY_ACTIVITIES } from "./seed-cities";
import { FOOD_SPOTS } from "./seed-food";

type SeedPlace = Omit<Activity, "kind" | "estimatedCostCents"> &
  Partial<Pick<Activity, "kind" | "estimatedCostCents">>;

function listedPlace(place: SeedPlace): Activity {
  return {
    ...place,
    kind: place.kind ?? "activity",
    estimatedCostCents: place.estimatedCostCents ?? 0,
  };
}

const ACTIVITIES: SeedPlace[] = [
  {
    id: "act_table_mountain",
    name: "Table Mountain Aerial Cableway",
    latitude: -33.9476,
    longitude: 18.4031,
    company: "Table Mountain Aerial Cableway Company",
    operatingHours: "08:00–20:00 daily, weather permitting",
    area: "Table Mountain, Cape Town",
  },
  {
    id: "act_va_waterfront",
    name: "V&A Waterfront",
    latitude: -33.9036,
    longitude: 18.4208,
    company: "V&A Waterfront Holdings",
    operatingHours: "Shops 09:00–21:00 daily",
    area: "V&A Waterfront, Cape Town",
  },
  {
    id: "act_two_oceans",
    name: "Two Oceans Aquarium",
    latitude: -33.9076,
    longitude: 18.4177,
    company: "Two Oceans Aquarium Foundation",
    operatingHours: "09:30–18:00 daily",
    area: "V&A Waterfront, Cape Town",
  },
  {
    id: "act_robben_island",
    name: "Robben Island Museum",
    latitude: -33.9079,
    longitude: 18.4274,
    company: "Robben Island Museum",
    operatingHours: "Ferry check-in 07:00–14:00, last return around 15:00",
    area: "Nelson Mandela Gateway, V&A Waterfront",
  },
  {
    id: "act_kirstenbosch",
    name: "Kirstenbosch National Botanical Garden",
    latitude: -33.9875,
    longitude: 18.4326,
    company: "South African National Biodiversity Institute",
    operatingHours: "08:00–19:00 daily",
    area: "Newlands, Cape Town",
  },
  {
    id: "act_bokaap",
    name: "Bo-Kaap Museum",
    latitude: -33.9217,
    longitude: 18.4152,
    company: "Iziko Museums of South Africa",
    operatingHours: "09:00–16:00, closed Sunday",
    area: "Bo-Kaap, Cape Town",
  },
  {
    id: "act_castle",
    name: "Castle of Good Hope",
    latitude: -33.9258,
    longitude: 18.4276,
    company: "Castle Control Board",
    operatingHours: "09:00–16:00 daily",
    area: "Cape Town City Centre",
  },
  {
    id: "act_district_six",
    name: "District Six Museum",
    latitude: -33.9276,
    longitude: 18.4234,
    company: "District Six Museum Foundation",
    operatingHours: "09:00–16:00, closed Sunday",
    area: "District Six, Cape Town",
  },
  {
    id: "act_signal_hill",
    name: "Signal Hill",
    latitude: -33.9173,
    longitude: 18.4027,
    company: "City of Cape Town",
    operatingHours: "Open 24 hours",
    area: "Signal Hill, Cape Town",
  },
  {
    id: "act_lions_head",
    name: "Lion's Head",
    latitude: -33.9346,
    longitude: 18.389,
    company: "Table Mountain National Park (SANParks)",
    operatingHours: "Sunrise to sunset",
    area: "Signal Hill / Lion's Head, Cape Town",
  },
  {
    id: "act_camps_bay",
    name: "Camps Bay Beach",
    latitude: -33.951,
    longitude: 18.3777,
    company: "City of Cape Town",
    operatingHours: "Open 24 hours",
    area: "Camps Bay, Cape Town",
  },
  {
    id: "act_groot_constantia",
    name: "Groot Constantia",
    latitude: -34.0261,
    longitude: 18.4183,
    company: "Groot Constantia Wine Estate",
    operatingHours: "Tastings 10:00–18:00 daily",
    area: "Constantia, Cape Town",
  },
  {
    id: "act_chapmans_peak",
    name: "Chapman's Peak Drive lookout",
    latitude: -34.0894,
    longitude: 18.3581,
    company: "Entilini Concession",
    operatingHours: "06:00–20:00 daily (toll road)",
    area: "Hout Bay, Cape Town",
  },
  {
    id: "act_boulders",
    name: "Boulders Penguin Colony",
    latitude: -34.1974,
    longitude: 18.4512,
    company: "South African National Parks",
    operatingHours: "08:00–17:00 daily",
    area: "Simon's Town, Cape Town",
  },
  {
    id: "act_cape_point",
    name: "Cape Point Lighthouse",
    latitude: -34.3569,
    longitude: 18.4968,
    company: "South African National Parks",
    operatingHours: "06:00–18:00 daily",
    area: "Cape of Good Hope, Cape Point",
  },
  {
    id: "act_stellenbosch_museum",
    name: "Stellenbosch Village Museum",
    latitude: -33.9379,
    longitude: 18.8602,
    company: "Stellenbosch Museum",
    operatingHours: "09:00–16:30 Monday–Saturday",
    area: "Stellenbosch",
  },
  {
    id: "act_apartheid_museum",
    name: "Apartheid Museum",
    latitude: -26.2414,
    longitude: 28.0086,
    company: "Apartheid Museum",
    operatingHours: "09:00–17:00, closed Monday",
    area: "Ormonde, Johannesburg",
  },
  {
    id: "act_constitution_hill",
    name: "Constitution Hill",
    latitude: -26.1884,
    longitude: 28.0426,
    company: "Constitution Hill Trust",
    operatingHours: "09:00–17:00 daily",
    area: "Braamfontein, Johannesburg",
  },
  {
    id: "act_mandela_house",
    name: "Mandela House",
    latitude: -26.2384,
    longitude: 27.9089,
    company: "Mandela House Museum",
    operatingHours: "09:00–17:00 daily",
    area: "Orlando West, Soweto",
  },
  {
    id: "act_gold_reef_city",
    name: "Gold Reef City Theme Park",
    latitude: -26.2364,
    longitude: 28.0131,
    company: "Gold Reef City",
    operatingHours: "09:30–17:00, closed Monday",
    area: "Ormonde, Johannesburg",
  },
  {
    id: "act_maropeng",
    name: "Maropeng Visitor Centre",
    latitude: -25.9708,
    longitude: 27.6617,
    company: "Maropeng a'Afrika",
    operatingHours: "09:00–17:00 daily",
    area: "Cradle of Humankind, Gauteng",
  },
  {
    id: "act_ushaka",
    name: "uShaka Marine World",
    latitude: -29.8675,
    longitude: 31.0456,
    company: "uShaka Marine World",
    operatingHours: "09:00–17:00 daily",
    area: "Point, Durban",
  },
  {
    id: "act_moses_mabhida",
    name: "Moses Mabhida Stadium SkyCar",
    latitude: -29.8289,
    longitude: 31.0304,
    company: "Moses Mabhida Stadium",
    operatingHours: "09:00–17:00 daily",
    area: "Durban",
  },
  {
    id: "act_durban_botanic",
    name: "Durban Botanic Gardens",
    latitude: -29.8465,
    longitude: 31.0077,
    company: "eThekwini Municipality",
    operatingHours: "07:30–17:15 daily",
    area: "Berea, Durban",
    kind: "activity",
  },
  ...CITY_ACTIVITIES,
  ...FOOD_SPOTS,
];

export function seedActivities(database: DatabaseSync) {
  const insert = database.prepare(
    `INSERT OR IGNORE INTO activities (
      id, name, latitude, longitude, company, operatingHours, area, kind, estimatedCostCents
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const update = database.prepare(
    `UPDATE activities SET
      name = ?,
      latitude = ?,
      longitude = ?,
      company = ?,
      operatingHours = ?,
      area = ?,
      kind = ?,
      estimatedCostCents = ?
    WHERE id = ?`,
  );

  for (const listed of ACTIVITIES.map(listedPlace)) {
    const cost = listed.estimatedCostCents || activityCostCents(listed.id);
    insert.run(
      listed.id,
      listed.name,
      listed.latitude,
      listed.longitude,
      listed.company,
      listed.operatingHours,
      listed.area,
      listed.kind,
      cost,
    );
    update.run(
      listed.name,
      listed.latitude,
      listed.longitude,
      listed.company,
      listed.operatingHours,
      listed.area,
      listed.kind,
      cost,
      listed.id,
    );
  }
}
