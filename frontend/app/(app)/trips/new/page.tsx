import { Card } from "@/components/ui/card";
import { TripForm } from "@/components/trip/trip-form";

export const metadata = { title: "New trip" };

export default function Page() {
  return (
    <section className="mx-auto max-w-xl space-y-8">
      <div>
        <p className="kicker">Begin</p>
        <h1 className="mt-2 font-display text-4xl">New trip</h1>
        <p className="mt-2 text-muted">
          A name, a destination, dates on the calendar, and who is coming.
        </p>
      </div>
      <Card>
        <TripForm />
      </Card>
    </section>
  );
}
