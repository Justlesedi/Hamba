import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

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
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS trips_userId ON trips(userId);
`);
