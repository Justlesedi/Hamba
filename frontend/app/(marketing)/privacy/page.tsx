import { StoryFrame } from "@/components/experience/story-frame";

export const metadata = {
  title: "Privacy",
};

export default function Page() {
  return (
    <StoryFrame
      kicker="Policy"
      title="Privacy policy"
      lede="Hamba is a trip planner. We keep what we need to show you your trips. We do not sell your data, and we do not take payment."
    >
      <section className="space-y-3">
        <h2 className="text-2xl">Who we are</h2>
        <p>
          Hamba is a South African travel planner. This page explains what we
          keep when you create an account and use the site.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl">What we collect</h2>
        <p>
          When you sign up we keep your name, email, and a hashed password.
          When you plan we keep trip names, destinations, dates, how many
          Guests, optional budgets, and the stays and places you confirm. Live
          location is only used to place you on the map for that session.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl">How we use it</h2>
        <p>
          We use this to sign you in, show your trips, forecast a budget, and
          build booking links with your dates and guests. We do not advertise
          with it. We do not sell it.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl">Booking sites</h2>
        <p>
          When you leave Hamba to book, that operator has its own privacy
          policy. We send only what their link can carry, such as dates and
          guest counts. We never see your card.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl">Cookies</h2>
        <p>
          We use a session cookie to keep you signed in. See the cookie policy
          for more.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl">Storage</h2>
        <p>
          This version keeps data in a local database. Protect your password.
          You may ask us to delete your account and trips.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl">Changes</h2>
        <p>
          If this policy changes we will update this page.
        </p>
      </section>
    </StoryFrame>
  );
}
