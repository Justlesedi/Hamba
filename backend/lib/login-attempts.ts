import { randomUUID } from "node:crypto";
import { db } from "./db";
import { SIGN_IN_LIMIT } from "./security";

function windowStart(now = Date.now()) {
  return new Date(now - SIGN_IN_LIMIT.windowMinutes * 60 * 1000).toISOString();
}

function emailSubject(email: string) {
  return `email:${email.trim().toLowerCase()}`;
}

function ipSubject(ip: string) {
  return `ip:${ip.trim()}`;
}

function pruneOldAttempts() {
  db.prepare("DELETE FROM login_attempts WHERE createdAt < ?").run(windowStart());
}

function recentCount(subject: string) {
  const row = db
    .prepare(
      "SELECT COUNT(*) AS count FROM login_attempts WHERE subject = ? AND createdAt >= ?",
    )
    .get(subject, windowStart()) as { count: number };
  return row.count;
}

function record(subject: string) {
  db.prepare(
    "INSERT INTO login_attempts (id, subject, createdAt) VALUES (?, ?, ?)",
  ).run(randomUUID(), subject, new Date().toISOString());
}

export function isSignInBlocked(email: string, ip?: string) {
  pruneOldAttempts();
  if (recentCount(emailSubject(email)) >= SIGN_IN_LIMIT.maxFailures) {
    return true;
  }
  return Boolean(ip && recentCount(ipSubject(ip)) >= SIGN_IN_LIMIT.ipMaxFailures);
}

export function recordSignInFailure(email: string, ip?: string) {
  pruneOldAttempts();
  record(emailSubject(email));
  if (ip) {
    record(ipSubject(ip));
  }
}

export function clearSignInFailures(email: string) {
  db.prepare("DELETE FROM login_attempts WHERE subject = ?").run(
    emailSubject(email),
  );
}
