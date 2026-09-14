import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session-token";

const publicRoutes = new Set(["/", "/sign-in", "/sign-up"]);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await decrypt(request.cookies.get("session")?.value);

  if (!publicRoutes.has(pathname) && !session?.userId) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (
    (pathname === "/sign-in" || pathname === "/sign-up") &&
    session?.userId
  ) {
    return NextResponse.redirect(new URL("/trips", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
