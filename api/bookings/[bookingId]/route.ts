import { NextResponse } from "next/server";
import {
  cancelBooking,
  getBookingForUser,
} from "@backend/server/bookings";
import { readSession } from "@/lib/session";

export async function GET(
  _request: Request,
  context: { params: Promise<{ bookingId: string }> },
) {
  const session = await readSession();
  if (!session?.userId) {
    return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  }

  const { bookingId } = await context.params;
  const booking = getBookingForUser(session.userId, bookingId);
  if (!booking) {
    return NextResponse.json({ message: "Booking not found." }, { status: 404 });
  }

  return NextResponse.json({ booking });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ bookingId: string }> },
) {
  const session = await readSession();
  if (!session?.userId) {
    return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  }

  const { bookingId } = await context.params;
  const booking = cancelBooking(session.userId, bookingId);
  if (!booking) {
    return NextResponse.json({ message: "Booking not found." }, { status: 404 });
  }

  return NextResponse.json({ booking });
}
