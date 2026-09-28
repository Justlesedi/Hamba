import { StoryFrame } from "@/components/experience/story-frame";

export const metadata = {
  title: "Terms",
};

export default function Page() {
  return (
    <StoryFrame
      kicker="Policy"
      title="Terms of use"
      lede="Hamba is a planning tool. It is not a travel agent, an airline, or a payment company."
    >
      <section className="space-y-3">
        <h2 className="text-2xl">Using Hamba</h2>
        <p>
          You may create an account, plan trips, and follow our links to book
          elsewhere. You must give accurate details for your own trips and keep
          your password to yourself. Do not use the service to harm the site or
          other people.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl">What Hamba is not</h2>
        <p>
          Listings, prices, hours, crowding colours, and ticket rules are
          estimates for planning. They are not a live inventory feed and they
          are not a contract with a hotel or activity. Hamba does not take
          payment, hold a reservation, or collect a commission in this version.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl">Bookings</h2>
        <p>
          When you open a stay or activity site, you are dealing with that
          operator. Their terms, rates, availability, and cancellation rules
          apply. If a place has no online booking, you travel there yourself.
          Prefill on a link cannot type into another company’s form; it only
          carries what that URL accepts.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl">Accounts</h2>
        <p>
          We may suspend an account that abuses the service. You may delete
          trips from the product. We may change or stop the service as it is
          still being built.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl">Liability</h2>
        <p>
          Hamba is provided as an early planner. We are not liable for missed
          stays, closed gates, price changes, or anything that happens after
          you leave this site to book. Plan with care. Confirm with the
          operator.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl">South African law</h2>
        <p>
          These terms are intended for use with a product focused on Southern
          African travel. If a court finds one clause unenforceable, the rest
          still stands.
        </p>
      </section>
    </StoryFrame>
  );
}
