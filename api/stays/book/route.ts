import { NextResponse } from "next/server";
import { chooseStayForTrip } from "@backend/server/stays";
import { chooseStaySchema } from "@backend/lib/validation";
import { readSession } from "@/lib/session";

export async function POST(request: Request) {
  const session = await readSession();
  if (!session?.userId) {
    return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = chooseStaySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const stayId = parsed.data.stayId.length > 0 ? parsed.data.stayId : null;
  const trip = chooseStayForTrip(
    session.userId,
    parsed.data.tripId,
    stayId,
    parsed.data.stayUnits,
  );
  if (!trip) {
    return NextResponse.json({ message: "Could not save this stay." }, { status: 400 });
  }

  return NextResponse.json({ stayId: trip.stayId });
}
