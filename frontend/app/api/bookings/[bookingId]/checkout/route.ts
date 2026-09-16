import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ bookingId: string }> },
) {
  const { bookingId } = await context.params;
  return NextResponse.redirect(new URL(`/bookings/${bookingId}`, request.url));
}
