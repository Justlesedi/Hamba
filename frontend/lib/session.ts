import { cookies } from "next/headers";
import { getSessionVersion } from "@backend/lib/auth";
import { decrypt, encrypt } from "./session-token";

const SESSION_COOKIE = "session";
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + WEEK_MS);
  const session = encrypt({
    userId,
    expiresAt: expiresAt.toISOString(),
    sessionVersion: getSessionVersion(userId) ?? 0,
  });
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function readSession() {
  const cookieStore = await cookies();
  const payload = await decrypt(cookieStore.get(SESSION_COOKIE)?.value);
  if (!payload?.userId) {
    return null;
  }

  const sessionVersion = getSessionVersion(payload.userId);
  if (sessionVersion == null) {
    return null;
  }

  if ((payload.sessionVersion ?? 0) !== sessionVersion) {
    return null;
  }

  return payload;
}
