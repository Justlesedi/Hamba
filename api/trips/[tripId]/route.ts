import { NextResponse } from "next/server";
import { getTripForUser } from "@backend/server/trips";
import { readSession } from "@/lib/session";

export async function GET(
  _request: Request,
  context: { params: Promise<{ tripId: string }> },
) {
  const session = await readSession();
  if (!session?.userId) {
    return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  }

  const { tripId } = await context.params;
  const trip = await getTripForUser(session.userId, tripId);

  if (!trip) {
    return NextResponse.json({ message: "Trip not found." }, { status: 404 });
  }

  return NextResponse.json({ trip });
}
