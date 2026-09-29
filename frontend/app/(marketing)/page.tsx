import Link from "next/link";
import { Zigzag } from "@/components/experience/zigzag";
import { SceneFilm } from "@/components/experience/scene-film";
import { SiteHeader } from "@/components/layout/site-header";
import { HERO_FILM, SCENES } from "@/lib/media";
import { getOptionalUser } from "@/lib/dal";

export default async function Page() {
  const user = await getOptionalUser();
  const startHref = user ? "/trips" : "/sign-up";
  const startLabel = user ? "Open your trips" : "Begin a trip";

  return (
    <div>
      <section className="relative isolate min-h-[92vh] overflow-hidden bg-dusk text-sand">
        <SiteHeader user={user} tone="on-film" />
        <div className="absolute inset-0">
          <SceneFilm
            src={HERO_FILM.src}
            poster={HERO_FILM.poster}
            className="motion-safe:animate-drift"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-dusk/75 via-dusk/35 to-dusk/20" />
        </div>
        <div className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-between px-6 pb-16 pt-28">
          <div className="rise max-w-xl">
            <p className="kicker text-gold">South Africa</p>
            <h1 className="mt-4 font-display text-5xl leading-[1.05] text-balance sm:text-7xl">
              Go where the land already knows the way.
            </h1>
          </div>
          <div className="rise mt-10 flex flex-col items-end gap-6 sm:mt-0 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-md self-start text-base leading-relaxed text-sand/80">
              Hamba is the isiXhosa and isiZulu word for go. Plan around a stay,
              watch the rand, then leave us for the door that actually takes
              payment.
            </p>
            <Link
              href={startHref}
              className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white hover:bg-accent-hover"
            >
              {startLabel}
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-28 px-6 py-24">
        <Zigzag
          kicker="01 · Plan"
          title="Choose a stay. The rest of the day gathers around it."
          image={SCENES.cape}
        >
          <p>
            The map is not a catalogue. It is a neighbourhood. Confirm a hotel,
            house, or camp, and activities and food follow that ground.
          </p>
          <p>Closed places stay off the plan. Ticket rules stay honest.</p>
        </Zigzag>

        <Zigzag
          reverse
          kicker="02 · Budget"
          title="See the spend before anyone asks for a card."
          image={SCENES.wine}
        >
          <p>
            The forecast is in rand, from the stay and places you already chose.
            It is a picture of the trip, not a bill.
          </p>
          <p>Quiet days and full days colour the calendar. They do not lock a door.</p>
        </Zigzag>

        <Zigzag
          kicker="03 · Book"
          title="We walk you to the door. They take the key."
          image={SCENES.safari}
        >
          <p>
            Hamba does not take money. Your dates and travellers go to Tintswalo,
            SANParks, Booking.com, or the gate you have to walk through yourself.
          </p>
          <p>The last step is theirs. The first ones are yours, here.</p>
        </Zigzag>
      </div>

      <section className="bg-dusk py-24 text-sand">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-lg">
            <p className="kicker text-gold">The road</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl">
              A trip is a story with dates. Start writing it.
            </h2>
          </div>
          <Link
            href={startHref}
            className="rounded-full bg-sand px-6 py-3 text-sm font-medium text-dusk hover:bg-white"
          >
            {startLabel}
          </Link>
        </div>
      </section>
    </div>
  );
}
