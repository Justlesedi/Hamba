import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { getOptionalUser } from "@/lib/dal";

export async function StoryFrame({
  kicker,
  title,
  lede,
  children,
}: {
  kicker: string;
  title: string;
  lede: string;
  children: ReactNode;
}) {
  const user = await getOptionalUser();

  return (
    <div className="bg-background">
      <SiteHeader user={user} />
      <article className="mx-auto max-w-3xl px-6 py-16">
        <p className="kicker">{kicker}</p>
        <h1 className="mt-3 font-display text-4xl leading-tight text-balance sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">{lede}</p>
        <div className="mt-12 space-y-8 text-base leading-relaxed text-foreground/90">
          {children}
        </div>
      </article>
    </div>
  );
}
