import { Zigzag } from "@/components/experience/zigzag";
import { SceneFilm } from "@/components/experience/scene-film";
import { SiteHeader } from "@/components/layout/site-header";
import { getOptionalUser } from "@/lib/dal";
import { SCENES } from "@/lib/media";

export const metadata = {
  title: "About",
};

export default async function Page() {
  const user = await getOptionalUser();

  return (
    <div className="bg-background">
      <section className="relative isolate min-h-[70vh] overflow-hidden bg-dusk text-sand">
        <div className="absolute inset-0">
          <SceneFilm src="/media/city-bowl.webm" poster={SCENES.cape.src} />
          <div className="absolute inset-0 bg-gradient-to-r from-dusk/80 to-dusk/25" />
        </div>
        <SiteHeader user={user} tone="on-film" />
        <div className="relative mx-auto flex min-h-[70vh] max-w-6xl items-end px-6 pb-16 pt-28">
          <div className="max-w-2xl">
            <p className="kicker text-gold">About Hamba</p>
            <h1 className="mt-4 font-display text-5xl leading-tight sm:text-6xl">
              A planner for people who still want to arrive.
            </h1>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-28 px-6 py-24">
        <Zigzag
          kicker="The name"
          title="Hamba means go."
          image={SCENES.cape}
        >
          <p>
            In isiXhosa and isiZulu it is a verb and a blessing. Leave the yard.
            Take the road. We built a place that holds the first half of a
            South African trip: where you sleep, what you do, what it might
            cost in rand.
          </p>
          <p>
            The second half still belongs to the lodge, the park, the cableway,
            the gate. That is not a gap. That is the point.
          </p>
        </Zigzag>

        <Zigzag
          reverse
          kicker="The promise"
          title="We do not pretend to be the hotel."
          image={SCENES.lion}
        >
          <p>
            Hamba does not take payment. We send your dates, travellers, and
            rooms to the site that already sells the stay or the ticket. If a
            place has no site, we say so, plainly: you travel there yourself.
          </p>
          <p>
            Plan and Budget stay a forecast. Book is a handoff. Hosting is still
            ahead of us.
          </p>
        </Zigzag>

        <Zigzag
          kicker="The land"
          title="South Africa, at the scale of a weekend or a season."
          image={SCENES.wine}
        >
          <p>
            Cape Town first, then the rest of the map we can walk in an hour
            from a stay. Stays, activities, and food are seeded so the loop is
            real enough to use, honest enough not to fake occupancy.
          </p>
          <p>
            We are a small product. The country is not. Hamba tries to keep
            that proportion.
          </p>
        </Zigzag>
      </div>
    </div>
  );
}
