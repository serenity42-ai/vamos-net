import Link from "next/link";
import type { Tournament } from "@/lib/padel-api";

/**
 * TournamentCardDesktop (~938×104)
 *
 * Figma spec (id=868:17765):
 *  - 938×104, fill=#F5F4F4 (light) or #181D27 (dark/Special), r=12, p=24/32, gap=64
 *  - Layout: [date+badge] [logo + title + meta] horizontally
 *  - Dark variant has 336×104 photo with linear-gradient fade
 *  - Title Archivo 700/20/28, date Inter 600/14/20
 */

type Variant = "default" | "dark";

function formatDateRangeUpper(start: string, end: string): string {
  try {
    const s = new Date(start);
    const e = new Date(end);
    if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) {
      return `${start} – ${end}`;
    }
    const sameMonth = s.getUTCMonth() === e.getUTCMonth();
    const monthFmt = (d: Date) =>
      d
        .toLocaleString("en-GB", { month: "short", timeZone: "UTC" })
        .toUpperCase();
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

export interface TournamentCardDesktopProps {
  tournament: Tournament;
  variant?: Variant;
  href?: string;
}

export default function TournamentCardDesktop({
  tournament,
  variant = "default",
  href,
}: TournamentCardDesktopProps) {
  const isLive = tournament.status === "live";
  const isDark = variant === "dark";
  const target = href ?? `/tournaments/${tournament.id}`;
  const location = tournament.location || tournament.country;

  return (
    <Link
      href={target}
      className={[
        "group relative block w-full overflow-hidden rounded-12 transition-colors",
        isDark
          ? "bg-bg-constant text-text-contrast hover:bg-[#1F2633]"
          : "bg-bg-white text-text-primary hover:bg-bg-gray border border-border-primary",
      ].join(" ")}
      style={{ minHeight: 104 }}
    >
      {/* Dark variant gradient flourish on right */}
      {isDark && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-[40%]"
          style={{
            background:
              "linear-gradient(270deg, rgba(254,76,0,0.3) 0%, rgba(24,29,39,0) 100%)",
          }}
        />
      )}

      <div className="relative flex items-center gap-32 px-32 py-24 lg:gap-64">
        {/* Date stack + live badge */}
        <div className="flex shrink-0 flex-col gap-8">
          <span
            className={[
              "text-body-m-semibold uppercase tracking-wide",
              isDark ? "text-text-contrast" : "text-text-primary",
            ].join(" ")}
          >
            {formatDateRangeUpper(tournament.start_date, tournament.end_date)}
          </span>
          {isLive && <LiveBadge />}
        </div>

        {/* Logo + title + meta — flex-1 so it fills the rest */}
        <div className="flex min-w-0 flex-1 items-center gap-43 lg:gap-12">
          <div className="flex min-w-0 flex-1 items-center gap-12">
            <div
              className={[
                "flex h-56 w-56 shrink-0 items-center justify-center overflow-hidden rounded-full border",
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
            <h3
              className={[
                "text-title-l truncate",
                isDark ? "text-text-contrast" : "text-text-primary",
              ].join(" ")}
            >
              {tournament.name}
            </h3>
          </div>

          {/* Meta (country) */}
          <div
            className={[
              "hidden shrink-0 items-center gap-8 text-body-m lg:flex",
              isDark ? "text-text-contrast/80" : "text-text-secondary",
            ].join(" ")}
          >
            <span className="truncate">{location}</span>
          </div>
        </div>

        {/* Trailing chevron — subtle */}
        <span
          aria-hidden
          className={[
            "shrink-0 text-title-m transition-transform group-hover:translate-x-1",
            isDark ? "text-text-contrast" : "text-text-primary",
          ].join(" ")}
        >
          →
        </span>
      </div>
    </Link>
  );
}
