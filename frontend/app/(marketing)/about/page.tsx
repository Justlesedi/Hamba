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
          <div className="w-full max-w-5xl">
            <p className="kicker text-gold">About Hamba</p>
            <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-10 lg:gap-16">
              <h1 className="max-w-xl font-display text-5xl leading-tight sm:text-6xl">
                A planner for people who still want to arrive.
              </h1>
              <p className="max-w-xs text-base leading-relaxed text-sand/80 lg:pb-2">
                Hamba is isiXhosa and isiZulu for go. The rest of the trip
                stays on this soil.
              </p>
            </div>
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
            In isiXhosa and isiZulu it is a welcome as much as a verb. We help
            you plan a South African trip: a stay, things to do, and a forecast
            in rand. When it is time to pay, you book with the place itself.
          </p>
        </Zigzag>

        <Zigzag
          reverse
          kicker="The promise"
          title="We do not pretend to be the hotel."
          image={SCENES.lion}
        >
          <p>
            We send your dates, guests, and the stay you chose to the site that
            already sells the room or house. If a place has no site, we say so.
            Plan and Budget are a forecast. Book is the handoff.
          </p>
        </Zigzag>

        <Zigzag
          kicker="The land"
          title="South Africa, at the scale of a weekend or a season."
          image={SCENES.wine}
        >
          <p>
            Start in Cape Town, then wander as far as a stay can walk. We are a
            small planner for a large country, and we keep that honest.
          </p>
        </Zigzag>
      </div>
    </div>
  );
}
