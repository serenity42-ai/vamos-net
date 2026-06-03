import Link from "next/link";
import Image from "next/image";

/**
 * SpecialBlock — large promotional slot injected into the hub feed (PH5).
 *
 * Renders full-bleed with a dark overlay (similar to ArticleCardHero) and a
 * "Special" eyebrow badge in brand orange. Designed to span the full row,
 * not a single column slot — so the parent should place it outside the
 * standard grid track.
 *
 * v1: takes optional image/title/CTA; falls back to a tournament-style
 * placeholder when nothing is provided so the slot looks intentional
 * before promotional content is live.
 */
export interface SpecialBlockProps {
  imageUrl?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export default function SpecialBlock({
  imageUrl,
  eyebrow = "Special",
  title = "The 2026 padel calendar, in one feed.",
  description = "Tour-wide schedules, results, and rankings — all surfaced in the Hub.",
  ctaLabel = "Explore the Hub",
  ctaHref = "/hub",
}: SpecialBlockProps) {
  return (
    <Link href={ctaHref} className="group block w-full">
      <article
        className="relative w-full overflow-hidden rounded-32 bg-bg-constant text-text-contrast"
        style={{ aspectRatio: "21 / 9", minHeight: 280 }}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes="(min-width: 1280px) 1200px, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 20% 50%, rgba(254,76,0,0.45) 0%, rgba(24,29,39,1) 70%)",
            }}
          />
        )}

        {/* Dark gradient overlay for legibility */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(0deg, rgba(24,29,39,0.95) 0%, rgba(24,29,39,0.55) 45%, rgba(24,29,39,0.15) 100%)",
          }}
        />

        <div className="relative z-[5] flex h-full flex-col justify-end gap-12 p-24 md:p-32 lg:p-40">
          <span className="inline-flex w-fit items-center gap-8 rounded-full bg-brand px-12 py-4 text-uppercase-eyebrow text-text-contrast">
            ★ {eyebrow}
          </span>
          <h2 className="text-mobile-heading-l md:text-desktop-heading-l text-text-contrast">
            {title}
          </h2>
          {description && (
            <p className="hidden text-body-l text-text-contrast/85 md:block line-clamp-2">
              {description}
            </p>
          )}
          <span className="inline-flex w-fit items-center gap-8 text-body-s-semibold text-text-contrast underline-offset-4 group-hover:underline">
            {ctaLabel} →
          </span>
        </div>
      </article>
    </Link>
  );
}
