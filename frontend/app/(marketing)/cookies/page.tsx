import { StoryFrame } from "@/components/experience/story-frame";

export const metadata = {
  title: "Cookies",
};

export default function Page() {
  return (
    <StoryFrame
      kicker="Policy"
      title="Cookie policy"
      lede="We keep cookies to a minimum: enough to know it is still you, and nothing for ads."
    >
      <section className="space-y-3">
        <h2 className="text-2xl">Essential cookies</h2>
        <p>
          Hamba sets a session cookie after you sign in. It holds a signed
          token so we can show your trips. It is required for the logged-in
          product to work. If you block it, you will stay on the public pages.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl">What we do not set</h2>
        <p>
          We do not set advertising cookies. We do not use third-party ad
          networks. We do not run a marketing pixel on this product.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl">Local storage and cache</h2>
        <p>
          Your browser may cache pages, images, and a short film on the home
          page so the experience loads faster. Crowding data from public
          holidays may be cached for a few days so the calendar is not fetched
          on every click.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl">Third-party sites</h2>
        <p>
          Links to Booking.com, Airbnb, SANParks, and other operators will set
          their own cookies once you leave Hamba. Those cookies are governed
          by their policies, not ours.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl">How to control cookies</h2>
        <p>
          You can clear cookies in your browser settings. Signing out ends the
          Hamba session. Blocking all cookies will stop sign-in from working.
        </p>
      </section>
    </StoryFrame>
  );
}
