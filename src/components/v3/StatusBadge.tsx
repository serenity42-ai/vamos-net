/**
 * StatusBadge (v3) — match status pill for the redesign.
 *
 * Figma: Status component set (id=916:34846). Orange pill for LIVE, neutral chip
 * for FT, time-only for upcoming, plus a compact variant for ticker contexts.
 *
 * Tokens only — no hard-coded hexes. Animation classes (`live-dot`, `live-flash`)
 * are defined in globals.css.
 */

import type { DisplayStatus } from "@/lib/normalize-match";

interface StatusBadgeProps {
  status: DisplayStatus | string;
  /** Live current game point e.g. "40-30" / "AD-40". Rendered inside the pill if provided. */
  currentPoint?: string | null;
  /** Pre-formatted time string for upcoming matches (e.g. "18:00"). */
  timeLabel?: string | null;
  /** Visual size. `default` for cards / hero, `compact` for tickers. */
  variant?: "default" | "compact";
  className?: string;
}

const EYEBROW =
  "font-sans font-semibold uppercase tracking-[0.04em] tabular-nums";

export default function StatusBadge({
  status,
  currentPoint,
  timeLabel,
  variant = "default",
  className = "",
}: StatusBadgeProps) {
  const compact = variant === "compact";

  if (status === "live") {
    // S13 — split current point (e.g. "40-30" or "AD-40") and highlight the higher
    // game score with the lime accent. Equal scores stay white.
    const cp = currentPoint?.trim();
    let leftCls = "text-text-contrast";
    let rightCls = "text-text-contrast";
    let left = "";
    let right = "";
    if (cp) {
      const parts = cp.split(/[-–—:]/).map((s) => s.trim());
      if (parts.length === 2) {
        left = parts[0];
        right = parts[1];
        const order = (v: string): number => {
          const u = v.toUpperCase();
          if (u === "AD") return 50;
          const n = parseInt(u, 10);
          return Number.isNaN(n) ? -1 : n;
        };
        const la = order(left);
        const ra = order(right);
        if (la >= 0 && ra >= 0 && la !== ra) {
          if (la > ra) leftCls = "text-[var(--color-accent-lime)]";
          else rightCls = "text-[var(--color-accent-lime)]";
        }
      }
    }
    return (
      <span
        className={[
          EYEBROW,
          "inline-flex items-center rounded-full bg-brand text-text-contrast",
          compact ? "gap-4 px-8 py-4 text-12" : "gap-8 px-12 py-4 text-12",
          className,
        ].join(" ")}
      >
        <span
          className="live-dot inline-block rounded-full bg-text-contrast"
          style={{ width: 6, height: 6 }}
          aria-hidden
        />
        <span>LIVE</span>
        {cp && left && right ? (
          <span className="ml-4 font-display">
            <span className={leftCls}>{left}</span>
            <span className="text-text-contrast">-</span>
            <span className={rightCls}>{right}</span>
          </span>
        ) : cp ? (
          <span className="ml-4 font-display text-text-contrast">{cp}</span>
        ) : null}
      </span>
    );
  }

  if (status === "finished") {
    return (
      <span
        className={[
          EYEBROW,
          "inline-flex items-center rounded-full bg-bg-gray text-text-secondary",
          compact ? "px-8 py-4 text-12" : "px-12 py-4 text-12",
          className,
        ].join(" ")}
      >
        FT
      </span>
    );
  }

  if (status === "cancelled") {
    return (
      <span
        className={[
          EYEBROW,
          "inline-flex items-center rounded-full bg-bg-gray text-text-secondary px-8 py-4 text-12",
          className,
        ].join(" ")}
      >
        Canc.
      </span>
    );
  }

  if (status === "walkover") {
    return (
      <span
        className={[
          EYEBROW,
          "inline-flex items-center rounded-full bg-bg-gray text-text-secondary px-8 py-4 text-12",
          className,
        ].join(" ")}
      >
        W/O
      </span>
    );
  }

  // scheduled / upcoming / unknown — time label only, no background
  if (status === "scheduled" || status === "live-soon" || status === "live-imminent") {
    return (
      <span
        className={[
          EYEBROW,
          "inline-flex items-center text-text-secondary",
          compact ? "text-12" : "text-12",
          className,
        ].join(" ")}
      >
        {timeLabel || "Sched."}
      </span>
    );
  }

  return (
    <span
      className={[EYEBROW, "inline-flex items-center text-text-tertiary text-12", className].join(" ")}
    >
      {timeLabel || status || "—"}
    </span>
  );
}
