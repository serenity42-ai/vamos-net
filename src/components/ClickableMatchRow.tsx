"use client";

import type { Match } from "@/lib/padel-api";
import { useMatchModal } from "@/components/MatchModalProvider";
import { useLiveScore } from "@/hooks/useLiveScore";
import { teamName } from "@/lib/player-utils";
import StatusBadge from "@/components/StatusBadge";
import type { NormalizedMatch, DisplayStatus } from "@/lib/normalize-match";

/**
 * Editorial match row (used on /scores and tournament detail pages).
 * Hairline-divided, mono scores, winners in ink, losers in --mute.
 */

/** Render a set score, splitting tiebreak into superscript */
function SetScoreCell({ value, isWinner }: { value: string; isWinner: boolean }) {
  const tb = value.match(/^(\d+)\((\d+)\)$/);
  const color = isWinner ? "var(--ink)" : "var(--mute)";
  if (tb) {
    return (
      <span className="score-mono" style={{ fontSize: 14, color, textAlign: "center", minWidth: 20 }}>
        {tb[1]}
        <sup style={{ fontSize: 9, marginLeft: 1, color: "var(--mute)" }}>{tb[2]}</sup>
      </span>
    );
  }
  return (
    <span className="score-mono" style={{ fontSize: 14, color, textAlign: "center", minWidth: 16 }}>
      {value}
    </span>
  );
}

export default function ClickableMatchRow({
  match,
  tournamentName,
}: {
  match: Match & { displayStatus?: DisplayStatus };
  tournamentName?: string;
}) {
  const { openMatch } = useMatchModal();
  const initialStatus = (match as NormalizedMatch).displayStatus || match.status;
  const isLive = initialStatus === "live" && !match.winner;
  const { score, currentPoint, status } = useLiveScore(match.id, isLive, match.score, initialStatus);

  // Filter empty/0-0 in-progress sets so we never render a phantom 0-0.
  const displayScore = score?.filter((s) => {
    const a = (s.team_1 ?? "").toString().trim();
    const b = (s.team_2 ?? "").toString().trim();
    if (!a && !b) return false;
    if (a === "0" && b === "0") return false;
    return true;
  }) ?? null;
  const displayStatus = status as DisplayStatus;
  const t1 = teamName(match.players.team_1);
  const t2 = teamName(match.players.team_2);

  return (
    <div
      className="flex items-center gap-3 sm:gap-4 transition-colors cursor-pointer"
      style={{
        padding: "12px 16px",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        background: displayStatus === "live" ? "rgba(193,68,58,0.04)" : "transparent",
      }}
      onMouseEnter={(e) => {
        if (displayStatus !== "live") {
          (e.currentTarget as HTMLDivElement).style.background = "var(--paper-2)";
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.background =
          displayStatus === "live" ? "rgba(193,68,58,0.04)" : "transparent";
      }}
      onClick={() => openMatch(match, tournamentName)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") openMatch(match, tournamentName);
      }}
    >
      {/* Status */}
      <div className="w-14 sm:w-16 shrink-0 text-center">
        <StatusBadge status={displayStatus} currentPoint={isLive ? currentPoint : null} />
      </div>

      {/* Teams + scores */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span
            className="truncate"
            style={{
              fontFamily: "var(--sans)",
              fontSize: 14,
              fontWeight: match.winner === "team_1" ? 800 : 600,
              color: match.winner === "team_2" ? "var(--mute)" : "var(--ink)",
              letterSpacing: "-0.01em",
            }}
          >
            {t1}
          </span>
          {displayScore && displayScore.length > 0 && (
            <div className="flex gap-3 shrink-0">
              {displayScore.map((s, i) => (
                <SetScoreCell key={i} value={s.team_1} isWinner={parseInt(s.team_1) > parseInt(s.team_2)} />
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <span
            className="truncate"
            style={{
              fontFamily: "var(--sans)",
              fontSize: 14,
              fontWeight: match.winner === "team_2" ? 800 : 600,
              color: match.winner === "team_1" ? "var(--mute)" : "var(--ink)",
              letterSpacing: "-0.01em",
            }}
          >
            {t2}
          </span>
          {displayScore && displayScore.length > 0 && (
            <div className="flex gap-3 shrink-0">
              {displayScore.map((s, i) => (
                <SetScoreCell key={i} value={s.team_2} isWinner={parseInt(s.team_2) > parseInt(s.team_1)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Schedule + category */}
      <div className="shrink-0 flex flex-col items-end gap-1">
        {displayStatus === "scheduled" && match.schedule_label && (
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: "0.08em",
              color: "var(--mute)",
              whiteSpace: "nowrap",
            }}
          >
            {match.schedule_label}
          </span>
        )}
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            padding: "2px 6px",
            border: `1px solid ${match.category === "women" ? "#A83362" : "var(--ink)"}`,
            color: match.category === "women" ? "#A83362" : "var(--ink)",
          }}
        >
          {match.category === "women" ? "W" : "M"}
        </span>
      </div>
    </div>
  );
}
