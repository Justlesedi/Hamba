import { SceneFilm } from "@/components/experience/scene-film";
import { HERO_FILM } from "@/lib/media";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="grid min-h-full lg:grid-cols-2">
      <div className="relative hidden min-h-[40vh] overflow-hidden bg-dusk lg:block">
        <SceneFilm src={HERO_FILM.src} poster={HERO_FILM.poster} />
        <div className="absolute inset-0 bg-gradient-to-t from-dusk/80 via-dusk/20 to-transparent" />
        <div className="absolute bottom-10 left-10 max-w-xs text-sand">
          <p className="kicker text-gold">isiXhosa · isiZulu</p>
          <p className="mt-3 font-display text-4xl">Hamba means go.</p>
          <p className="mt-3 text-sm leading-relaxed text-sand/75">
            Go first. Book when you are ready.
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-center bg-background px-6 py-16 sm:px-12">
        <div className="mx-auto w-full max-w-md">{children}</div>
      </div>
    </main>
  );
}
