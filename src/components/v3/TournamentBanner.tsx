"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Tournament } from "@/lib/padel-api";
import Button from "@/components/Button";
import IconButton from "@/components/IconButton";
import Link from "next/link";

function ChevronLeft() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronDown({ className = "" }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
      style={{ transition: "transform 300ms ease" }}
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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

export interface ImageCredit {
  caption: string;
  credit: string;
  licence: string;
  source?: string;
}

export interface TournamentBannerProps {
  tournament: Tournament;
  /** Background image — defaults to a tasteful CSS gradient if missing */
  imageUrl?: string | null;
  /** Optional credit metadata rendered as a small attribution line. */
  imageCredit?: ImageCredit | null;
  /** Optional explicit CTA override */
  ctaText?: string;
  ctaHref?: string;
  /** S22 — when true the banner body collapses; default expanded=true. */
  collapsible?: boolean;
  defaultExpanded?: boolean;
  /** Show the back chevron in the top-left (S22). Default true. */
  showBack?: boolean;
}

export default function TournamentBanner({
  tournament,
  imageUrl,
  imageCredit,
  ctaText,
  ctaHref,
  collapsible = false,
  defaultExpanded = true,
  showBack = true,
}: TournamentBannerProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState<boolean>(defaultExpanded);
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
            alt={imageCredit?.caption ?? ""}
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
        style={{ minHeight: expanded ? 440 : 120 }}
      >
        <div className="flex items-center gap-16">
          {showBack && (
            <IconButton
              variant="ghost-dark"
              size="md"
              icon={<ChevronLeft />}
              label="Back"
              onClick={() => router.back()}
            />
          )}
          <StatusBadge status={tournament.status} />
          <span className="text-body-m-semibold text-text-contrast/80">
            {formatDateRange(tournament.start_date, tournament.end_date)}
          </span>
          {collapsible && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              aria-label={expanded ? "Collapse banner" : "Expand banner"}
              className="ml-auto inline-flex h-44 w-44 items-center justify-center rounded-full border border-[var(--color-border-secondary)] text-text-contrast hover:bg-bg-overlay"
            >
              <ChevronDown className={expanded ? "rotate-180" : ""} />
            </button>
          )}
        </div>

        <div
          className="mt-auto flex flex-col gap-16 md:gap-24 overflow-hidden"
          style={{
            maxHeight: !collapsible || expanded ? 1000 : 0,
            opacity: !collapsible || expanded ? 1 : 0,
            transition: "max-height 300ms ease, opacity 200ms ease",
          }}
        >
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

        {/* Image credit — only shown when we have a real background photo.
            Tiny, low-opacity, tucked in the corner; not part of the editorial. */}
        {imageUrl && imageCredit && (
          <p
            className="absolute bottom-6 right-10 z-10 max-w-[60%] truncate text-right font-sans text-text-contrast"
            style={{ fontSize: "10px", lineHeight: "12px", opacity: 0.45 }}
          >
            Photo:{" "}
            {imageCredit.source ? (
              <a
                href={imageCredit.source}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-2 hover:underline"
                style={{ color: "inherit" }}
              >
                {imageCredit.credit}
              </a>
            ) : (
              imageCredit.credit
            )}{" "}
            · {imageCredit.licence}
          </p>
        )}
      </div>
    </section>
  );
}
