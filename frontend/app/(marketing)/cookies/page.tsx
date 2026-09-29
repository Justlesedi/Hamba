import { StoryFrame } from "@/components/experience/story-frame";

export const metadata = {
  title: "Cookies",
};

export default function Page() {
  return (
    <StoryFrame
      kicker="Policy"
      title="Cookie policy"
      lede="We keep cookies light: enough to know it is still you, and none for ads."
    >
      <section className="space-y-3">
        <h2 className="text-2xl">Essential cookies</h2>
        <p>
          After you sign in, Hamba sets a session cookie so we can show your
          trips. If you block it, you will stay on the public pages.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl">What we do not set</h2>
        <p>
          We do not set advertising cookies, ad networks, or marketing pixels.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl">Local storage and cache</h2>
        <p>
          Your browser may cache pages, photos, and a short film so home loads
          faster. Calendar crowding may be cached for a few days.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl">Third-party sites</h2>
        <p>
          Booking.com, Airbnb, SANParks, and other operators set their own
          cookies once you leave Hamba. Those are theirs, not ours.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl">How to control cookies</h2>
        <p>
          You can clear cookies in your browser. Signing out ends the Hamba
          session. Blocking all cookies will stop sign-in.
        </p>
      </section>
    </StoryFrame>
  );
}
