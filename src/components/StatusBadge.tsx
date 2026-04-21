/**
 * StatusBadge — single shared component for match status display.
 * Used by: ClickableMatchRow, MatchCard, ScoresTicker, scores/page.
 * Do NOT duplicate this. Import from here.
 *
 * Editorial brand: lime for LIVE (per guidelines), mono eyebrows for everything else.
 */

import type { DisplayStatus } from "@/lib/normalize-match";

interface StatusBadgeProps {
  status: DisplayStatus | string;
  /** Current point score for live matches (e.g. "40-30") */
  currentPoint?: string | null;
  /** Variant: "compact" for ticker/small contexts, "default" for rows/cards */
  variant?: "default" | "compact";
}

const EYEBROW_BASE = {
  fontFamily: "var(--mono)",
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase" as const,
};

export default function StatusBadge({
  status,
  currentPoint,
  variant = "default",
}: StatusBadgeProps) {
  if (status === "live") {
    // Lime LIVE badge per brand guidelines
    if (variant === "compact") {
      return (
        <span
          style={{
            ...EYEBROW_BASE,
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "2px 6px",
            fontSize: 9,
            fontWeight: 800,
            background: "var(--lime)",
            color: "var(--ink)",
          }}
        >
          ● LIVE
        </span>
      );
    }
    return (
      <div className="flex flex-col items-end gap-1">
        <span
          style={{
            ...EYEBROW_BASE,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "3px 8px",
            fontSize: 10,
            fontWeight: 800,
            background: "var(--lime)",
            color: "var(--ink)",
          }}
        >
          ● LIVE
        </span>
        {currentPoint && (
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              fontWeight: 800,
              color: "var(--red)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {currentPoint}
          </span>
        )}
      </div>
    );
  }

  if (status === "finished") {
    return (
      <span style={{ ...EYEBROW_BASE, fontSize: 10, color: "var(--mute)" }}>
        FT
      </span>
    );
  }

  if (status === "cancelled") {
    return (
      <span style={{ ...EYEBROW_BASE, fontSize: 10, color: "var(--mute)" }}>
        Canc.
      </span>
    );
  }

  if (status === "walkover") {
    return (
      <span style={{ ...EYEBROW_BASE, fontSize: 10, color: "var(--mute)" }}>
        W/O
      </span>
    );
  }

  if (status === "scheduled") {
    return (
      <span style={{ ...EYEBROW_BASE, fontSize: 10, color: "var(--red)" }}>
        Sched.
      </span>
    );
  }

  // Unknown / fallback
  return (
    <span style={{ ...EYEBROW_BASE, fontSize: 10, color: "var(--mute)" }}>
      {status || "—"}
    </span>
  );
}
