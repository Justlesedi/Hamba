import { NextResponse } from "next/server";
import { listBookingsForUser } from "@backend/server/bookings";
import { readSession } from "@/lib/session";

export async function GET() {
  const session = await readSession();
  if (!session?.userId) {
    return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  }

  return NextResponse.json({
    bookings: listBookingsForUser(session.userId),
  });
}
