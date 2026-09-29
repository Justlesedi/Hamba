import Image from "next/image";
import Link from "next/link";

const SIZES = {
  header: { className: "h-14 w-[3.25rem]" },
  footer: { className: "h-[72px] w-[68px]" },
  auth: { className: "h-28 w-[6.5rem]" },
} as const;

export function BrandMark({
  href,
  tone = "light",
  size = "header",
}: {
  href: string;
  tone?: "light" | "on-film";
  size?: keyof typeof SIZES;
}) {
  const mark = SIZES[size];

  return (
    <Link href={href} className="inline-flex shrink-0">
      <Image
        src="/hamba-mark.png"
        alt="Hamba"
        width={450}
        height={466}
        unoptimized
        className={`${mark.className} bg-transparent object-contain ${
          tone === "on-film" ? "drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]" : ""
        }`}
        priority={size === "header"}
      />
    </Link>
  );
}
