"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Vamos.net v3 Cell — Figma Cell component set (id=217:30100).
 *
 * Two structural variants:
 *  - hasBorder=true  → 239×72 pill, gray fill (#EBEAE9 ≈ bg-gray), gray hairline border,
 *                      rounded-full, optional orange count badge on the right.
 *  - hasBorder=false → 215×64 transparent row, optional chevron-right button on the right,
 *                      hover paints bg-gray.
 *
 * Either variant can show an optional subtitle below the title.
 *
 * Sizes/typography taken from Figma:
 *   Logo: 56×56 rounded-full, hairline border
 *   Title: Archivo 600/16/22
 *   Subtitle: Inter 400/14/20, text-secondary
 *   Badge: 24×24 rounded-full bg-brand, Inter 600/12/18 white
 */

type CellState = "default" | "hover";

export type CellProps = {
  logo?: string | null;
  /** Fallback initials/letter if logo is missing. */
  logoFallback?: ReactNode;
  title: string;
  subtitle?: string;
  /** Right-aligned count badge (rendered when truthy). */
  badge?: string | number;
  /** Render a chevron-right action affordance (only with hasBorder=false). */
  chevron?: boolean;
  href?: string;
  onClick?: () => void;
  hasBorder?: boolean;
  /** Force a visual state — usually omitted (CSS hover handles it). */
  state?: CellState;
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
      className="flex h-56 w-56 shrink-0 items-center justify-center rounded-full border border-border-primary bg-bg-white font-display text-16 font-semibold text-text-secondary"
      aria-hidden={!fallback}
    >
      {fallback ?? alt.charAt(0).toUpperCase()}
    </div>
  );
}

export default function Cell({
  logo,
  logoFallback,
  title,
  subtitle,
  badge,
  chevron,
  href,
  onClick,
  hasBorder = false,
  state = "default",
  className = "",
}: CellProps) {
  const forcedHover = state === "hover";

  const containerBase = [
    "group flex items-center gap-12 transition-colors w-full text-left",
  ];

  const borderedClasses = [
    "rounded-full border border-border-primary py-8 pl-8 pr-24 min-h-[72px]",
    forcedHover ? "bg-[#E2E1E1]" : "bg-bg-gray hover:bg-[#E2E1E1]",
  ];

  const plainClasses = [
    "rounded-full py-4 pl-4 pr-4 min-h-[64px]",
    forcedHover ? "bg-bg-gray" : "hover:bg-bg-gray",
  ];

  const containerClass = [
    ...containerBase,
    ...(hasBorder ? borderedClasses : plainClasses),
    className,
  ].join(" ");

  const content = (
    <>
      <Logo src={logo} alt={title} fallback={logoFallback} />

      <div className="flex min-w-0 flex-1 items-center gap-12">
        <div className="min-w-0 flex-1">
          <div className="truncate font-display text-16 font-semibold leading-[22px] text-text-primary">
            {title}
          </div>
          {subtitle && (
            <div className="truncate font-sans text-14 leading-[20px] text-text-secondary">
              {subtitle}
            </div>
          )}
        </div>

        {badge !== undefined && badge !== null && badge !== "" && (
          <span
            className="flex h-24 min-w-[24px] shrink-0 items-center justify-center rounded-full bg-brand px-[6px] font-sans text-12 font-semibold leading-[18px] text-text-contrast"
            aria-label={`${badge} items`}
          >
            {badge}
          </span>
        )}
      </div>

      {chevron && !hasBorder && (
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
