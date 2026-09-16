import { redirect } from "next/navigation";
import { verifySession } from "@/lib/dal";

export default async function Page({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  await verifySession();
  const { bookingId } = await params;
  redirect(`/bookings/${bookingId}`);
}
