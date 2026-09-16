import { NextResponse } from "next/server";
import {
  BookingError,
  createBooking,
  getConfirmedBookingForTrip,
} from "@backend/server/bookings";
import { getTripForUser } from "@backend/server/trips";
import { createBookingSchema } from "@backend/lib/validation";
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

  const booking = getConfirmedBookingForTrip(session.userId, tripId);
  return NextResponse.json({ booking });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ tripId: string }> },
) {
  const session = await readSession();
  if (!session?.userId) {
    return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  }

  const { tripId } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = createBookingSchema.safeParse({
    tripId,
    stayId: body?.stayId,
    activityIds: Array.isArray(body?.activityIds) ? body.activityIds : [],
  });

  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const booking = createBooking(session.userId, parsed.data.tripId, {
      stayId: parsed.data.stayId,
      activityIds: parsed.data.activityIds,
    });
    if (!booking) {
      return NextResponse.json({ message: "Trip not found." }, { status: 404 });
    }
    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    if (error instanceof BookingError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Could not book this trip." },
      { status: 500 },
    );
  }
}
