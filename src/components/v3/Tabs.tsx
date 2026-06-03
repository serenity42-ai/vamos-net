"use client";

import Link from "next/link";

/**
 * Vamos.net v3 Tabs — Figma Tabs component (id=145:16317).
 *
 * Horizontal row of text labels. The active tab is brand-orange with a 2px
 * orange underline directly under the label; inactive tabs use text-secondary.
 *
 * Mobile: row scrolls horizontally to handle overflow.
 *
 * Each tab can be a link (href) or a button (onClick). Both supported in one row.
 */

export type TabItem = {
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
};

export type TabsProps = {
  items: TabItem[];
  className?: string;
  /** Aria label for the tablist landmark. */
  ariaLabel?: string;
};

export default function Tabs({
  items,
  className = "",
  ariaLabel = "Section navigation",
}: TabsProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className={[
        "flex items-center gap-24 overflow-x-auto border-b border-border-primary px-12 pt-12",
        // Hide scrollbar on webkit for a cleaner look
        "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
        className,
      ].join(" ")}
      role="tablist"
    >
      {items.map((item, idx) => {
        const key = `${item.label}-${idx}`;
        const labelClasses = [
          "relative inline-flex shrink-0 items-center pb-8 pt-0",
          "font-sans text-16 leading-[24px] transition-colors",
          item.active
            ? "font-semibold text-brand"
            : "font-normal text-text-secondary hover:text-text-primary",
        ].join(" ");

        const underline = item.active ? (
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-[2px] bg-brand"
          />
        ) : null;

        if (item.href) {
          return (
            <Link
              key={key}
              href={item.href}
              role="tab"
              aria-selected={item.active ? "true" : "false"}
              className={labelClasses}
            >
              {item.label}
              {underline}
            </Link>
          );
        }

        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={item.active ? "true" : "false"}
            onClick={item.onClick}
            className={labelClasses}
          >
            {item.label}
            {underline}
          </button>
        );
      })}
    </nav>
  );
}
