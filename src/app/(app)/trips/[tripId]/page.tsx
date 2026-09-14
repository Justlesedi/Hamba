export default async function TripDashboardPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  return (
    <section className="space-y-2">
      <h1 className="text-2xl font-semibold">Trip</h1>
      <p className="text-zinc-600">Dashboard for {tripId}.</p>
    </section>
  );
}
