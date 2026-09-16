import { redirect } from "next/navigation";
import { verifySession } from "@/lib/dal";

export default async function Page({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  await verifySession();
  const { tripId } = await params;
  redirect(`/trips/${tripId}/itinerary`);
}
