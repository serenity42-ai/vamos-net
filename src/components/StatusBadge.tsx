/**
 * StatusBadge — single shared component for match status display.
 * Used by: ClickableMatchRow, MatchCard, ScoresTicker, scores/page.
 * Do NOT duplicate this. Import from here.
 */

import type { DisplayStatus } from "@/lib/normalize-match";

interface StatusBadgeProps {
  status: DisplayStatus | string;
  /** Current point score for live matches (e.g. "40-30") */
  currentPoint?: string | null;
  /** Variant: "compact" for ticker/small contexts, "default" for rows/cards */
  variant?: "default" | "compact";
}

export default function StatusBadge({ status, currentPoint, variant = "default" }: StatusBadgeProps) {
  if (status === "live") {
    if (variant === "compact") {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-red-600">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          Live
        </span>
      );
    }
    return (
      <div className="flex flex-col items-center gap-0.5">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-600">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          Live
        </span>
        {currentPoint && (
          <span className="text-[10px] font-bold text-red-500 tabular-nums">
            {currentPoint}
          </span>
        )}
      </div>
    );
  }

  if (status === "finished") {
    return <span className="text-xs font-semibold text-gray-400">FT</span>;
  }

  if (status === "cancelled") {
    return <span className="text-xs font-semibold text-gray-400">Canc.</span>;
  }

  if (status === "walkover") {
    return <span className="text-xs font-semibold text-gray-400">W/O</span>;
  }

  if (status === "scheduled") {
    return (
      <span className="text-xs font-semibold text-[#4ABED9]">Sched.</span>
    );
  }

  // Unknown / fallback
  return (
    <span className="text-xs font-semibold text-gray-400">
      {status || "—"}
    </span>
  );
}
