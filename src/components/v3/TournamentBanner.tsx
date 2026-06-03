import Image from "next/image";
import type { Tournament } from "@/lib/padel-api";
import Button from "@/components/Button";
import Link from "next/link";

/**
 * TournamentBanner — large hero for /tournaments/[id] (1250×440).
 *
 * Figma spec (id=868:35107):
 *  - Big rounded rectangle r=32, padding 20–24
 *  - Full-bleed background image with dark linear gradient overlay
 *  - Tournament logo overlay (round), title (Archivo 800 UPPER),
 *    dates + location meta, status badge ("Live"/"Upcoming"/"Finished")
 *  - Primary CTA Button ("Watch live" when live, "View matches" otherwise)
 */

function formatDateRange(start: string, end: string): string {
  try {
    const s = new Date(start);
    const e = new Date(end);
    if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) {
      return `${start} – ${end}`;
    }
    const sameMonth = s.getUTCMonth() === e.getUTCMonth();
    const monthFmt = (d: Date) =>
      d.toLocaleString("en-GB", { month: "short", timeZone: "UTC" });
    const yearFmt = (d: Date) => d.getUTCFullYear();
    if (sameMonth) {
      return `${s.getUTCDate()}–${e.getUTCDate()} ${monthFmt(e)} ${yearFmt(e)}`;
    }
    return `${s.getUTCDate()} ${monthFmt(s)} – ${e.getUTCDate()} ${monthFmt(e)} ${yearFmt(e)}`;
  } catch {
    return `${start} – ${end}`;
  }
}

function StatusBadge({ status }: { status: Tournament["status"] }) {
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-8 rounded-full bg-brand px-12 py-4 text-text-contrast">
        <span
          aria-hidden
          className="inline-block h-8 w-8 rounded-full bg-text-contrast live-dot"
        />
        <span className="text-body-s-semibold">Live</span>
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className="inline-flex items-center rounded-full border border-[var(--color-border-secondary)] bg-bg-overlay px-12 py-4 text-text-contrast">
        <span className="text-body-s-semibold">Upcoming</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--color-border-secondary)] bg-bg-overlay px-12 py-4 text-text-contrast">
      <span className="text-body-s-semibold">Finished</span>
    </span>
  );
}

export interface TournamentBannerProps {
  tournament: Tournament;
  /** Background image — defaults to a tasteful CSS gradient if missing */
  imageUrl?: string | null;
  /** Optional explicit CTA override */
  ctaText?: string;
  ctaHref?: string;
}

export default function TournamentBanner({
  tournament,
  imageUrl,
  ctaText,
  ctaHref,
}: TournamentBannerProps) {
  const isLive = tournament.status === "live";
  const isFinished = tournament.status === "finished";
  const defaultCtaText = isLive
    ? "Watch live"
    : isFinished
      ? "View results"
      : "View matches";
  const defaultCtaHref = `/tournaments/${tournament.id}/matches`;
  const finalCtaText = ctaText ?? defaultCtaText;
  const finalCtaHref = ctaHref ?? defaultCtaHref;
  const location = tournament.location || tournament.country;

  return (
    <section className="relative w-full overflow-hidden rounded-32 bg-bg-constant text-text-contrast">
      {/* Background image — fill */}
      <div className="absolute inset-0">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            priority
            sizes="(min-width: 1280px) 1250px, 100vw"
            className="object-cover"
          />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 80% 50%, rgba(254,76,0,0.35) 0%, rgba(24,29,39,1) 60%)",
            }}
          />
        )}
        {/* Dark gradient overlays */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(24,29,39,0.85) 0%, rgba(24,29,39,0.55) 50%, rgba(24,29,39,0.15) 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/3"
          style={{
            background:
              "linear-gradient(0deg, rgba(24,29,39,0.9) 0%, rgba(24,29,39,0) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div
        className="relative flex flex-col gap-24 p-24 md:p-32 lg:p-40"
        style={{ minHeight: 440 }}
      >
        <div className="flex items-center gap-16">
          <StatusBadge status={tournament.status} />
          <span className="text-body-m-semibold text-text-contrast/80">
            {formatDateRange(tournament.start_date, tournament.end_date)}
          </span>
        </div>

        <div className="mt-auto flex flex-col gap-16 md:gap-24">
          <div className="flex items-end gap-16 md:gap-24">
            {/* Tournament logo (initials fallback) */}
            <div className="hidden h-72 w-72 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--color-border-secondary)] bg-bg-constant md:flex md:h-96 md:w-96">
              <span className="text-desktop-heading-m text-text-contrast">
                {tournament.name.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex min-w-0 flex-col gap-8">
              <h1 className="text-mobile-heading-l md:text-desktop-display-l text-text-contrast">
                {tournament.name}
              </h1>
              <div className="flex flex-wrap items-center gap-x-16 gap-y-4 text-body-m text-text-contrast/80">
                <span>{location}</span>
                {tournament.country && location !== tournament.country && (
                  <>
                    <span aria-hidden>·</span>
                    <span>{tournament.country}</span>
                  </>
                )}
                <span aria-hidden>·</span>
                <span className="uppercase tracking-wide">
                  {tournament.level}
                </span>
              </div>
            </div>
          </div>

          <div>
            <Button
              as={Link}
              href={finalCtaHref}
              variant={isLive ? "primary" : "outline"}
              trailingIcon="arrow"
            >
              {finalCtaText}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
