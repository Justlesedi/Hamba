import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { seedActivities } from "./activities/seed";
import { seedStays } from "./stays/seed";

function repoRoot() {
  if (process.cwd().endsWith("frontend") || process.cwd().endsWith("backend")) {
    return path.resolve(process.cwd(), "..");
  }
  return process.cwd();
}

const dataDir = path.join(repoRoot(), "backend/data");
fs.mkdirSync(dataDir, { recursive: true });

export const db = new DatabaseSync(path.join(dataDir, "hamba.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    passwordHash TEXT NOT NULL,
    name TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS trips (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    title TEXT NOT NULL,
    destination TEXT NOT NULL,
    startDate TEXT NOT NULL,
    endDate TEXT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'ZAR',
    budgetCents INTEGER,
    travellers INTEGER NOT NULL DEFAULT 1,
    stayId TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS trips_userId ON trips(userId);

  CREATE TABLE IF NOT EXISTS activities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    company TEXT NOT NULL,
    operatingHours TEXT NOT NULL,
    area TEXT NOT NULL,
    estimatedCostCents INTEGER NOT NULL DEFAULT 0,
    kind TEXT NOT NULL DEFAULT 'activity'
  );

  CREATE TABLE IF NOT EXISTS stays (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    company TEXT NOT NULL,
    area TEXT NOT NULL,
    kind TEXT NOT NULL,
    sleeps INTEGER NOT NULL,
    nightlyCents INTEGER NOT NULL,
    note TEXT NOT NULL,
    operatingHours TEXT NOT NULL DEFAULT 'Open 24 hours'
  );

  CREATE TABLE IF NOT EXISTS trip_places (
    tripId TEXT NOT NULL,
    activityId TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    PRIMARY KEY (tripId, activityId),
    FOREIGN KEY (tripId) REFERENCES trips(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS geocode_cache (
    query TEXT PRIMARY KEY,
    lat REAL NOT NULL,
    lng REAL NOT NULL
  );
`);

{
  const columns = db.prepare(`PRAGMA table_info(activities)`).all() as {
    name: string;
  }[];
  if (!columns.some((column) => column.name === "estimatedCostCents")) {
    db.exec(
      `ALTER TABLE activities ADD COLUMN estimatedCostCents INTEGER NOT NULL DEFAULT 0`,
    );
  }
  if (!columns.some((column) => column.name === "kind")) {
    db.exec(
      `ALTER TABLE activities ADD COLUMN kind TEXT NOT NULL DEFAULT 'activity'`,
    );
  }
}

{
  const columns = db.prepare(`PRAGMA table_info(trips)`).all() as {
    name: string;
  }[];
  if (!columns.some((column) => column.name === "stayId")) {
    db.exec(`ALTER TABLE trips ADD COLUMN stayId TEXT`);
  }
}

{
  const columns = db.prepare(`PRAGMA table_info(stays)`).all() as {
    name: string;
  }[];
  if (!columns.some((column) => column.name === "operatingHours")) {
    db.exec(
      `ALTER TABLE stays ADD COLUMN operatingHours TEXT NOT NULL DEFAULT 'Open 24 hours'`,
    );
  }
}

seedActivities(db);
seedStays(db);
