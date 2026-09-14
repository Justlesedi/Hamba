import { Card } from "@/components/ui/card";
import { TripForm } from "@/components/trip/trip-form";

export default function Page() {
  return (
    <section className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">New trip</h1>
        <p className="text-sm text-muted">
          Destination, dates, travellers, and an optional ZAR budget.
        </p>
      </div>
      <Card>
        <TripForm />
      </Card>
    </section>
  );
}
