import Link from "next/link";
import { BrandMark } from "@/components/layout/brand-mark";
import { MEDIA_CREDIT } from "@/lib/media";

const legal = [
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/cookies", label: "Cookies" },
];

export function SiteFooter({ tone = "sand" }: { tone?: "sand" | "dusk" }) {
  const dusk = tone === "dusk";

  return (
    <footer
      className={`mt-auto border-t ${
        dusk
          ? "border-white/10 bg-dusk text-sand/80"
          : "border-border bg-card/60 text-muted"
      }`}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-sm">
          <BrandMark href="/" tone={dusk ? "on-film" : "light"} size="footer" />
          <p className="mt-3 text-sm leading-relaxed">
            Go. Plan a South African trip around a real stay, see the spend in
            rand, then book where the place actually takes the money.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {legal.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={dusk ? "hover:text-sand" : "hover:text-foreground"}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <p
        className={`mx-auto max-w-6xl px-6 pb-8 text-xs ${
          dusk ? "text-sand/50" : "text-muted/80"
        }`}
      >
        {MEDIA_CREDIT}
      </p>
    </footer>
  );
}
