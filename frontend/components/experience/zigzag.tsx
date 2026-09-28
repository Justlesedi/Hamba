import Image from "next/image";
import type { ReactNode } from "react";

export function Zigzag({
  kicker,
  title,
  children,
  image,
  reverse = false,
  film,
}: {
  kicker: string;
  title: string;
  children: ReactNode;
  image: { src: string; alt: string };
  reverse?: boolean;
  film?: ReactNode;
}) {
  return (
    <section
      className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
        reverse ? "lg:[&>*:first-child]:order-2" : ""
      }`}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-dusk shadow-lift sm:aspect-[5/4] lg:aspect-[4/5]">
        {film ?? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover motion-safe:animate-drift"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-dusk/35 to-transparent" />
      </div>
      <div className={reverse ? "lg:pr-6" : "lg:pl-6"}>
        <p className="kicker">{kicker}</p>
        <h2 className="font-display mt-3 max-w-lg text-4xl leading-tight text-balance sm:text-5xl">
          {title}
        </h2>
        <div className="mt-5 max-w-md space-y-4 text-base leading-relaxed text-muted">
          {children}
        </div>
      </div>
    </section>
  );
}
