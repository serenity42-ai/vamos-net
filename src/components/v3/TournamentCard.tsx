import Link from "next/link";
import type { Tournament } from "@/lib/padel-api";

/**
 * TournamentCard (mobile, 366×132)
 *
 * Figma spec (id=868:16458):
 *  - default: 366×132 fill=#F5F4F4 (bg-page) border=#E5E2E2 r=12 p=20 gap=16
 *  - dark variant ("Special=True"): fill=#181D27 (bg-constant) white text, with bg image + gradient
 *  - 56×56 round logo, title in Archivo 700/20/28, dates in Inter 600/14/20
 *  - Optional orange "Live" badge (radius-full, p=t4 r12 b4 l12)
 *
 * Used inside tournament lists.
 */

type Variant = "default" | "dark";

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
    if (sameMonth) {
      return `${s.getUTCDate()}–${e.getUTCDate()} ${monthFmt(e)}`;
    }
    return `${s.getUTCDate()} ${monthFmt(s)} – ${e.getUTCDate()} ${monthFmt(e)}`;
  } catch {
    return `${start} – ${end}`;
  }
}

function LiveDot() {
  return (
    <span
      aria-hidden
      className="inline-block h-8 w-8 rounded-full bg-text-contrast live-dot"
    />
  );
}

function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-4 rounded-full bg-brand px-12 py-4 text-text-contrast">
      <LiveDot />
      <span className="text-body-s-semibold">Live</span>
    </span>
  );
}

export interface TournamentCardProps {
  tournament: Tournament;
  variant?: Variant;
  href?: string;
}

export default function TournamentCard({
  tournament,
  variant = "default",
  href,
}: TournamentCardProps) {
  const isLive = tournament.status === "live";
  const isDark = variant === "dark";
  const target = href ?? `/tournaments/${tournament.id}`;

  // Existing Tournament type uses `location` (city/region) — not `city`.
  const location = tournament.location || tournament.country;

  return (
    <Link
      href={target}
      className={[
        "group relative block overflow-hidden rounded-16 border transition-colors",
        "w-full max-w-[366px]",
        isDark
          ? "bg-bg-constant border-[var(--color-border-secondary)] text-text-contrast hover:bg-[#1F2633]"
          : "bg-bg-white border-border-primary text-text-primary hover:bg-bg-gray",
      ].join(" ")}
      style={{ minHeight: 132 }}
    >
      {/* Dark variant: decorative gradient overlay on right side */}
      {isDark && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-[60%]"
          style={{
            background:
              "linear-gradient(270deg, rgba(254,76,0,0.35) 0%, rgba(24,29,39,0) 100%)",
          }}
        />
      )}

      <div className="relative flex flex-col gap-16 p-20">
        {/* Top row: date + optional live badge */}
        <div className="flex items-center gap-12">
          <span
            className={[
              "text-body-m-semibold",
              isDark ? "text-text-contrast" : "text-text-primary",
            ].join(" ")}
          >
            {formatDateRange(tournament.start_date, tournament.end_date)}
          </span>
          {isLive && <LiveBadge />}
        </div>

        {/* Body row: logo + title + meta */}
        <div className="flex items-start gap-16">
          {/* Logo — falls back to initials circle if no logo_url */}
          <div
            className={[
              "relative flex h-56 w-56 shrink-0 items-center justify-center overflow-hidden rounded-full border",
              isDark
                ? "border-[var(--color-border-secondary)] bg-bg-constant"
                : "border-border-primary bg-bg-white",
            ].join(" ")}
          >
            <span
              className={[
                "text-title-m",
                isDark ? "text-text-contrast" : "text-text-primary",
              ].join(" ")}
            >
              {tournament.name.slice(0, 2).toUpperCase()}
            </span>
          </div>

          <div className="flex min-w-0 flex-col gap-4">
            <h3
              className={[
                "text-title-l line-clamp-2",
                isDark ? "text-text-contrast" : "text-text-primary",
              ].join(" ")}
            >
              {tournament.name}
            </h3>
            <div
              className={[
                "flex items-center gap-8 text-body-s",
                isDark ? "text-text-contrast/80" : "text-text-secondary",
              ].join(" ")}
            >
              <span className="truncate">{location}</span>
              {tournament.country && location !== tournament.country && (
                <>
                  <span aria-hidden>·</span>
                  <span className="truncate">{tournament.country}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
