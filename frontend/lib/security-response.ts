import { NextResponse } from "next/server";
import {
  ACCOUNT_EXISTS_LOGIN_PATH,
  SECURITY_HEADERS,
} from "@backend/lib/security";

export function withSecurityHeaders(headers?: HeadersInit) {
  const next = new Headers(headers);

  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    next.set(key, value);
  }

  return next;
}

export function jsonWithSecurity(body: unknown, init?: ResponseInit) {
  return NextResponse.json(body, {
    ...init,
    headers: withSecurityHeaders(init?.headers),
  });
}

export function accountExistsConflict() {
  return jsonWithSecurity(
    {
      message: "An account with this email already exists.",
      redirect: ACCOUNT_EXISTS_LOGIN_PATH,
    },
    {
      status: 409,
      headers: { Location: ACCOUNT_EXISTS_LOGIN_PATH },
    },
  );
}
