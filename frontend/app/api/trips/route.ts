import { NextResponse } from "next/server";
import { createTrip, listTrips } from "@backend/server/trips";
import { createTripSchema } from "@backend/lib/validation";
import { readSession } from "@/lib/session";

async function requireUserId() {
  const session = await readSession();
  if (!session?.userId) {
    return null;
  }
  return session.userId;
}

export async function GET() {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  }

  const trips = await listTrips(userId);
  return NextResponse.json({ trips });
}

export async function POST(request: Request) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createTripSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const trip = await createTrip(userId, parsed.data);
  return NextResponse.json({ trip }, { status: 201 });
}
