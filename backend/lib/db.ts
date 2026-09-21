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
db.exec("PRAGMA journal_mode = WAL");
db.exec("PRAGMA busy_timeout = 5000");
db.exec("PRAGMA synchronous = NORMAL");

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
    stayUnits INTEGER NOT NULL DEFAULT 1,
    outboundFlightId TEXT,
    returnFlightId TEXT,
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
    beds INTEGER NOT NULL DEFAULT 2,
    rooms INTEGER NOT NULL DEFAULT 1,
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

  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    tripId TEXT NOT NULL,
    tripTitle TEXT NOT NULL,
    destination TEXT NOT NULL,
    startDate TEXT NOT NULL,
    endDate TEXT NOT NULL,
    travellers INTEGER NOT NULL,
    stayId TEXT,
    stayName TEXT NOT NULL,
    stayArea TEXT NOT NULL,
    stayTotalCents INTEGER NOT NULL,
    outboundFlightId TEXT,
    outboundLabel TEXT NOT NULL DEFAULT '',
    outboundCents INTEGER NOT NULL DEFAULT 0,
    returnFlightId TEXT,
    returnLabel TEXT NOT NULL DEFAULT '',
    returnCents INTEGER NOT NULL DEFAULT 0,
    transportMode TEXT NOT NULL,
    transportCents INTEGER NOT NULL,
    placesTotalCents INTEGER NOT NULL,
    commissionCents INTEGER NOT NULL DEFAULT 0,
    totalCents INTEGER NOT NULL,
    status TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tripId) REFERENCES trips(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS bookings_userId ON bookings(userId);
  CREATE INDEX IF NOT EXISTS bookings_tripId ON bookings(tripId);
  CREATE UNIQUE INDEX IF NOT EXISTS bookings_trip_confirmed
    ON bookings(tripId) WHERE status = 'confirmed';

  CREATE TABLE IF NOT EXISTS booking_places (
    bookingId TEXT NOT NULL,
    activityId TEXT NOT NULL,
    name TEXT NOT NULL,
    kind TEXT NOT NULL,
    company TEXT NOT NULL,
    area TEXT NOT NULL,
    amountCents INTEGER NOT NULL,
    sortOrder INTEGER NOT NULL,
    PRIMARY KEY (bookingId, activityId),
    FOREIGN KEY (bookingId) REFERENCES bookings(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS geocode_cache (
    query TEXT PRIMARY KEY,
    lat REAL NOT NULL,
    lng REAL NOT NULL
  );

  CREATE TABLE IF NOT EXISTS json_cache (
    cacheKey TEXT PRIMARY KEY,
    body TEXT NOT NULL,
    fetchedAt TEXT NOT NULL
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
  if (!columns.some((column) => column.name === "outboundFlightId")) {
    db.exec(`ALTER TABLE trips ADD COLUMN outboundFlightId TEXT`);
  }
  if (!columns.some((column) => column.name === "returnFlightId")) {
    db.exec(`ALTER TABLE trips ADD COLUMN returnFlightId TEXT`);
  }
  if (!columns.some((column) => column.name === "stayUnits")) {
    db.exec(
      `ALTER TABLE trips ADD COLUMN stayUnits INTEGER NOT NULL DEFAULT 1`,
    );
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
  if (!columns.some((column) => column.name === "beds")) {
    db.exec(`ALTER TABLE stays ADD COLUMN beds INTEGER NOT NULL DEFAULT 2`);
  }
  if (!columns.some((column) => column.name === "rooms")) {
    db.exec(`ALTER TABLE stays ADD COLUMN rooms INTEGER NOT NULL DEFAULT 1`);
  }
}

seedActivities(db);
seedStays(db);

{
  const columns = db.prepare(`PRAGMA table_info(bookings)`).all() as {
    name: string;
  }[];
  if (columns.length > 0) {
    if (!columns.some((column) => column.name === "outboundFlightId")) {
      db.exec(`ALTER TABLE bookings ADD COLUMN outboundFlightId TEXT`);
    }
    if (!columns.some((column) => column.name === "outboundLabel")) {
      db.exec(
        `ALTER TABLE bookings ADD COLUMN outboundLabel TEXT NOT NULL DEFAULT ''`,
      );
    }
    if (!columns.some((column) => column.name === "outboundCents")) {
      db.exec(
        `ALTER TABLE bookings ADD COLUMN outboundCents INTEGER NOT NULL DEFAULT 0`,
      );
    }
    if (!columns.some((column) => column.name === "returnFlightId")) {
      db.exec(`ALTER TABLE bookings ADD COLUMN returnFlightId TEXT`);
    }
    if (!columns.some((column) => column.name === "returnLabel")) {
      db.exec(
        `ALTER TABLE bookings ADD COLUMN returnLabel TEXT NOT NULL DEFAULT ''`,
      );
    }
    if (!columns.some((column) => column.name === "returnCents")) {
      db.exec(
        `ALTER TABLE bookings ADD COLUMN returnCents INTEGER NOT NULL DEFAULT 0`,
      );
    }
    if (!columns.some((column) => column.name === "commissionCents")) {
      db.exec(
        `ALTER TABLE bookings ADD COLUMN commissionCents INTEGER NOT NULL DEFAULT 0`,
      );
    }
  }
}
