"use client";

import Link from "next/link";

/**
 * Vamos.net v3 DatesPicker — vertical date list for /schedule and similar.
 *
 * Each row: date label + optional match-count meta. Active row gets a 4px
 * brand-orange left border and brand-orange label color. Hover paints
 * bg-gray. Container is a white card (radius-16, padding-16) so the picker
 * can sit anywhere on a gray page background.
 *
 * If `onSelect` is provided each row is a button; otherwise rows can be
 * links via the per-item `href`.
 */

export type DateItem = {
  /** Display label, e.g. "Sun 21 Jun" or "Today". */
  label: string;
  /** ISO date string for comparisons / callbacks. */
  iso: string;
  /** Optional small meta line — e.g. "12 matches". */
  meta?: string;
  /** Optional per-item link target. */
  href?: string;
};

export type DatesPickerProps = {
  dates: DateItem[];
  activeIso?: string;
  onSelect?: (iso: string) => void;
  className?: string;
  /** Section heading rendered above the list. */
  title?: string;
};

export default function DatesPicker({
  dates,
  activeIso,
  onSelect,
  className = "",
  title,
}: DatesPickerProps) {
  return (
    <div
      className={[
        "rounded-16 border border-border-primary bg-bg-white p-16",
        className,
      ].join(" ")}
    >
      {title && (
        <h3 className="mb-12 px-4 font-display text-16 font-semibold leading-[22px] text-text-primary">
          {title}
        </h3>
      )}

      <ul className="flex flex-col" role="list">
        {dates.map((d) => {
          const isActive = d.iso === activeIso;

          const rowClasses = [
            "group flex w-full items-center justify-between rounded-12 px-12 py-12 text-left transition-colors",
            // 4px left border lives inside the row so it doesn't shift width
            "border-l-[4px]",
            isActive
              ? "border-brand bg-bg-gray"
              : "border-transparent hover:bg-bg-gray",
          ].join(" ");

          const labelClasses = [
            "font-display text-16 font-semibold leading-[22px]",
            isActive ? "text-brand" : "text-text-primary",
          ].join(" ");

          const metaClasses = [
            "font-sans text-12 leading-[16px]",
            isActive ? "text-brand" : "text-text-secondary",
          ].join(" ");

          const inner = (
            <>
              <span className={labelClasses}>{d.label}</span>
              {d.meta && <span className={metaClasses}>{d.meta}</span>}
            </>
          );

          if (d.href && !onSelect) {
            return (
              <li key={d.iso}>
                <Link
                  href={d.href}
                  aria-current={isActive ? "date" : undefined}
                  className={rowClasses}
                >
                  {inner}
                </Link>
              </li>
            );
          }

          return (
            <li key={d.iso}>
              <button
                type="button"
                onClick={() => onSelect?.(d.iso)}
                aria-current={isActive ? "date" : undefined}
                aria-pressed={isActive}
                className={rowClasses}
              >
                {inner}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
