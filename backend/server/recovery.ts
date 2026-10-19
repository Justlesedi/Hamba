import { createHash, randomBytes, randomUUID } from "node:crypto";
import { db } from "../lib/db";
import {
  findUserByEmail,
  findUsersByName,
  replacePassword,
} from "../lib/auth";
import {
  clearSignInFailures,
  pruneOldAttempts,
  recentCount,
  recordAttempt,
} from "../lib/login-attempts";
import { sendRecoveryMail } from "../lib/mail";
import { RECOVERY } from "../lib/security";
import { AuthError } from "./users";

type RecoveryPurpose = "password" | "username";

type RecoveryTokenRow = {
  id: string;
  userId: string;
  purpose: string;
  tokenHash: string;
  expiresAt: string;
  usedAt: string | null;
};

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function newToken() {
  return randomBytes(32).toString("base64url");
}

function recoverEmailSubject(email: string) {
  return `recover:email:${email.trim().toLowerCase()}`;
}

function recoverNameSubject(name: string) {
  return `recover:name:${name.trim().toLowerCase()}`;
}

function recoverIpSubject(ip: string) {
  return `recover:ip:${ip.trim()}`;
}

function pruneExpiredTokens() {
  db.prepare(
    "DELETE FROM recovery_tokens WHERE usedAt IS NOT NULL OR expiresAt < ?",
  ).run(new Date().toISOString());
}

function isRecoveryBlocked(kind: "email" | "name", value: string, ip?: string) {
  pruneOldAttempts();
  const subject =
    kind === "email" ? recoverEmailSubject(value) : recoverNameSubject(value);
  if (recentCount(subject) >= RECOVERY.maxRequests) {
    return true;
  }
  return Boolean(
    ip && recentCount(recoverIpSubject(ip)) >= RECOVERY.ipMaxRequests,
  );
}

function recordRecovery(kind: "email" | "name", value: string, ip?: string) {
  pruneOldAttempts();
  recordAttempt(
    kind === "email" ? recoverEmailSubject(value) : recoverNameSubject(value),
  );
  if (ip) {
    recordAttempt(recoverIpSubject(ip));
  }
}

function expireOpenTokens(userId: string, purpose: RecoveryPurpose) {
  db.prepare(
    `UPDATE recovery_tokens
     SET usedAt = ?
     WHERE userId = ? AND purpose = ? AND usedAt IS NULL`,
  ).run(new Date().toISOString(), userId, purpose);
}

function insertToken(userId: string, purpose: RecoveryPurpose, token: string) {
  const now = Date.now();
  db.prepare(
    `INSERT INTO recovery_tokens
     (id, userId, purpose, tokenHash, expiresAt, usedAt, createdAt)
     VALUES (?, ?, ?, ?, ?, NULL, ?)`,
  ).run(
    randomUUID(),
    userId,
    purpose,
    hashToken(token),
    new Date(now + RECOVERY.tokenMinutes * 60 * 1000).toISOString(),
    new Date(now).toISOString(),
  );
}

function findOpenPasswordToken(token: string) {
  pruneExpiredTokens();
  return db
    .prepare(
      `SELECT id, userId, purpose, tokenHash, expiresAt, usedAt
       FROM recovery_tokens
       WHERE tokenHash = ? AND purpose = 'password' AND usedAt IS NULL`,
    )
    .get(hashToken(token)) as RecoveryTokenRow | undefined;
}

export async function requestPasswordReset(input: {
  email: string;
  origin: string;
  ip?: string;
}) {
  const email = input.email.trim().toLowerCase();

  if (isRecoveryBlocked("email", email, input.ip)) {
    throw new AuthError(RECOVERY.limitMessage, "RATE_LIMITED");
  }

  recordRecovery("email", email, input.ip);
  pruneExpiredTokens();

  const user = findUserByEmail(email);
  if (!user) {
    return;
  }

  expireOpenTokens(user.id, "password");
  const token = newToken();
  insertToken(user.id, "password", token);

  const url = `${input.origin.replace(/\/$/, "")}/recover/reset?token=${encodeURIComponent(token)}`;

  await sendRecoveryMail({
    to: user.email,
    purpose: "password",
    subject: "Reset your Hamba password",
    text: [
      "Hamba",
      "",
      "Someone asked to reset the password for this email on Hamba.",
      `If it was you, open this link in the next ${RECOVERY.tokenMinutes} minutes:`,
      url,
      "",
      "If it was not you, ignore this. Your password stays the same.",
    ].join("\n"),
  });
}

export async function requestUsernameReminder(input: {
  name: string;
  ip?: string;
}) {
  const name = input.name.trim();

  if (isRecoveryBlocked("name", name, input.ip)) {
    throw new AuthError(RECOVERY.limitMessage, "RATE_LIMITED");
  }

  recordRecovery("name", name, input.ip);

  const users = findUsersByName(name);
  for (const user of users) {
    await sendRecoveryMail({
      to: user.email,
      purpose: "username",
      subject: "Your Hamba sign-in email",
      text: [
        "Hamba",
        "",
        `Someone asked for the sign-in email on an account named ${user.name}.`,
        "The email you sign in with is:",
        user.email,
        "",
        "If it was not you, you can ignore this.",
      ].join("\n"),
    });
  }
}

export function isResetTokenOpen(token: string) {
  if (!token.trim()) {
    return false;
  }

  const row = findOpenPasswordToken(token);
  if (!row) {
    return false;
  }

  return new Date(row.expiresAt).getTime() > Date.now();
}

export async function resetPasswordWithToken(input: {
  token: string;
  password: string;
}) {
  const row = findOpenPasswordToken(input.token);
  if (!row || new Date(row.expiresAt).getTime() <= Date.now()) {
    throw new AuthError(RECOVERY.expiredMessage, "INVALID_TOKEN");
  }

  await replacePassword(row.userId, input.password);
  db.prepare("UPDATE recovery_tokens SET usedAt = ? WHERE id = ?").run(
    new Date().toISOString(),
    row.id,
  );
  expireOpenTokens(row.userId, "password");

  const user = db
    .prepare("SELECT email FROM users WHERE id = ?")
    .get(row.userId) as { email: string } | undefined;
  if (user) {
    clearSignInFailures(user.email);
  }
}
