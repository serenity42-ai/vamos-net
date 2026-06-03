"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Vamos.net v3 CellDesktop — wider/horizontal list row for desktop tables.
 *
 * Visual reference: Figma CellDesktop (id=868:37924) — full-width rows in a
 * white card, hairline border-bottom between rows, vertical padding 12.
 *
 * Layout:
 *   [ logo ] [ title + subtitle ]  ............ [ optional sublabel ] [ badge ] [ chevron ]
 *
 * Use this in /tournaments, /rankings, etc. where desktop has space for more info.
 */

export type CellDesktopProps = {
  logo?: string | null;
  logoFallback?: ReactNode;
  title: string;
  subtitle?: string;
  /** Optional right-aligned secondary label (e.g. date, round, tier). */
  sublabel?: string;
  /** Optional right-aligned count badge. */
  badge?: string | number;
  /** Show a chevron-right affordance on the far right. */
  chevron?: boolean;
  href?: string;
  onClick?: () => void;
  /** Apply the row separator (hairline). Default true. */
  divider?: boolean;
  className?: string;
};

function ChevronRight() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Logo({
  src,
  alt,
  fallback,
}: {
  src?: string | null;
  alt: string;
  fallback?: ReactNode;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={56}
        height={56}
        className="h-56 w-56 shrink-0 rounded-full border border-border-primary bg-bg-white object-cover"
      />
    );
  }
  return (
    <div
      className="flex h-56 w-56 shrink-0 items-center justify-center rounded-full border border-border-primary bg-bg-white font-display text-20 font-semibold text-text-secondary"
      aria-hidden={!fallback}
    >
      {fallback ?? alt.charAt(0).toUpperCase()}
    </div>
  );
}

export default function CellDesktop({
  logo,
  logoFallback,
  title,
  subtitle,
  sublabel,
  badge,
  chevron,
  href,
  onClick,
  divider = true,
  className = "",
}: CellDesktopProps) {
  const containerClass = [
    "group flex w-full items-center gap-16 bg-bg-white px-20 py-12 text-left transition-colors",
    divider ? "border-b border-border-primary" : "",
    "hover:bg-bg-gray",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <Logo src={logo} alt={title} fallback={logoFallback} />

      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-display text-16 font-semibold leading-[22px] text-text-primary group-hover:text-brand">
          {title}
        </span>
        {subtitle && (
          <span className="truncate font-sans text-14 leading-[20px] text-text-secondary">
            {subtitle}
          </span>
        )}
      </div>

      {sublabel && (
        <span className="hidden shrink-0 font-sans text-14 leading-[20px] text-text-secondary md:block">
          {sublabel}
        </span>
      )}

      {badge !== undefined && badge !== null && badge !== "" && (
        <span
          className="flex h-24 min-w-[24px] shrink-0 items-center justify-center rounded-full bg-brand px-[6px] font-sans text-12 font-semibold leading-[18px] text-text-contrast"
          aria-label={`${badge} items`}
        >
          {badge}
        </span>
      )}

      {chevron && (
        <span className="flex h-44 w-44 shrink-0 items-center justify-center rounded-full text-icon-primary">
          <ChevronRight />
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={containerClass}>
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={containerClass}>
        {content}
      </button>
    );
  }

  return <div className={containerClass}>{content}</div>;
}
