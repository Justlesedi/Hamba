import { StoryFrame } from "@/components/experience/story-frame";

export const metadata = {
  title: "Privacy",
};

export default function Page() {
  return (
    <StoryFrame
      kicker="Policy"
      title="Privacy policy"
      lede="Hamba is a trip planner. We store what we need to show you your trips. We do not sell your data, and we do not take payment."
    >
      <section className="space-y-3">
        <h2 className="text-2xl">Who we are</h2>
        <p>
          Hamba is a Southern African travel planner operated as an early
          product. This policy describes how we handle information when you
          create an account and use the site.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl">What we collect</h2>
        <p>
          When you sign up we store your name, email address, and a hashed
          password. When you plan we store trip titles, destinations, dates,
          traveller counts, optional budgets, and the stays and activities you
          confirm. If you share a live location, it is used only to place you
          on the map for that session and is not kept as a history.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl">How we use it</h2>
        <p>
          We use this information to sign you in, show your trips, forecast a
          budget, and build booking links with your dates and party size. We
          do not use it for advertising. We do not sell it.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl">Booking sites</h2>
        <p>
          When you leave Hamba to book, that operator (for example Booking.com,
          Marriott, or SANParks) has its own privacy policy. We send them only
          what their link can carry, such as dates and guest counts. We do not
          receive your card details.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl">Cookies</h2>
        <p>
          We use a session cookie to keep you signed in. See the cookie policy
          for more. Crowding estimates may be cached from public holiday data
          so the calendar can load.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl">Storage</h2>
        <p>
          This version keeps data in a local database for the running product.
          Protect your password. You may ask us to delete your account and
          trips by writing to the operator of this instance.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl">Changes</h2>
        <p>
          If this policy changes we will update this page. Continued use after
          a change means you accept the new text.
        </p>
      </section>
    </StoryFrame>
  );
}
