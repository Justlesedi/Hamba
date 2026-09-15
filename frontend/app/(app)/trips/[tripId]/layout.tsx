import { TripNav } from "@/components/trip/trip-nav";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;

  return (
    <div className="space-y-6">
      <TripNav tripId={tripId} />
      {children}
    </div>
  );
}
