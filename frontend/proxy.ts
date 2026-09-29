import { NextRequest, NextResponse } from "next/server";
import { SECURITY_HEADERS } from "@backend/lib/security";
import { decrypt } from "@/lib/session-token";

const publicRoutes = new Set([
  "/",
  "/sign-in",
  "/sign-up",
  "/about",
  "/privacy",
  "/terms",
  "/cookies",
]);

function withSecurityHeaders(response: NextResponse) {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await decrypt(request.cookies.get("session")?.value);

  if (!publicRoutes.has(pathname) && !session?.userId) {
    return withSecurityHeaders(
      NextResponse.redirect(new URL("/sign-in", request.url)),
    );
  }

  if (
    (pathname === "/sign-in" || pathname === "/sign-up") &&
    session?.userId
  ) {
    return withSecurityHeaders(
      NextResponse.redirect(new URL("/trips", request.url)),
    );
  }

  return withSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|webm|mp4)$).*)",
  ],
};
