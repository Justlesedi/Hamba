import { StoryFrame } from "@/components/experience/story-frame";

export const metadata = {
  title: "Terms",
};

export default function Page() {
  return (
    <StoryFrame
      kicker="Policy"
      title="Terms of use"
      lede="Hamba helps you plan. It is not a travel agent, an airline, or a payment company."
    >
      <section className="space-y-3">
        <h2 className="text-2xl">Using Hamba</h2>
        <p>
          You may create an account, plan trips, and follow our links to book
          elsewhere. Keep your details true, and keep your password to yourself.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl">What Hamba is not</h2>
        <p>
          Prices, hours, crowding colours, and ticket rules are here to help
          you plan. They are not a live booking, and they are not a contract
          with a hotel. We do not take payment or hold a reservation.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl">Bookings</h2>
        <p>
          When you open a stay or activity site, you are with that operator.
          Their rates and rules apply. If a place has no online booking, you
          visit in person.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl">Accounts</h2>
        <p>
          We may suspend an account that abuses the service. You may delete
          trips. We may change or pause the product while we build.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl">Liability</h2>
        <p>
          Hamba is an early planner. Confirm the stay and the ticket with the
          operator before you travel. We are not liable for what happens after
          you leave this site to book.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl">South African law</h2>
        <p>
          These terms are for a product focused on South African travel. If a
          court finds one clause unenforceable, the rest still stands.
        </p>
      </section>
    </StoryFrame>
  );
}
