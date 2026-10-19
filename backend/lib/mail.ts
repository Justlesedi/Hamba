import { randomUUID } from "node:crypto";
import { db } from "./db";
import { RECOVERY } from "./security";

export type RecoveryMail = {
  id: string;
  toEmail: string;
  subject: string;
  body: string;
  purpose: string;
  createdAt: string;
};

function mailboxCutoff(now = Date.now()) {
  return new Date(now - RECOVERY.mailboxHours * 60 * 60 * 1000).toISOString();
}

function pruneRecoveryMail() {
  db.prepare("DELETE FROM recovery_mail WHERE createdAt < ?").run(mailboxCutoff());
}

export function isLocalMailboxOpen() {
  return process.env.NODE_ENV !== "production";
}

export async function sendRecoveryMail(input: {
  to: string;
  subject: string;
  text: string;
  purpose: "password" | "username";
}) {
  pruneRecoveryMail();
  const createdAt = new Date().toISOString();

  db.prepare(
    `INSERT INTO recovery_mail (id, toEmail, subject, body, purpose, createdAt)
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).run(randomUUID(), input.to, input.subject, input.text, input.purpose, createdAt);

  if (isLocalMailboxOpen()) {
    console.info(`[hamba mail] to=${input.to}\n${input.subject}\n${input.text}`);
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from =
    process.env.HAMBA_MAIL_FROM?.trim() || "Hamba <onboarding@resend.dev>";

  if (!apiKey) {
    return;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        subject: input.subject,
        text: input.text,
      }),
    });

    if (!response.ok) {
      console.error(`[hamba mail] resend ${response.status}`);
    }
  } catch (error) {
    console.error("[hamba mail] send failed", error);
  }
}

export function listRecoveryMail(limit = 8): RecoveryMail[] {
  pruneRecoveryMail();
  return db
    .prepare(
      `SELECT id, toEmail, subject, body, purpose, createdAt
       FROM recovery_mail
       ORDER BY createdAt DESC
       LIMIT ?`,
    )
    .all(limit) as RecoveryMail[];
}
