"use client";

import type { Match } from "@/lib/padel-api";
import { formatScore } from "@/lib/padel-api";
import { useMatchModal } from "@/components/MatchModalProvider";
import { useLiveScore } from "@/hooks/useLiveScore";
import { teamName } from "@/lib/player-utils";
import StatusBadge from "@/components/StatusBadge";
import type { NormalizedMatch, DisplayStatus } from "@/lib/normalize-match";

/** Render a set score, splitting tiebreak into superscript: "6(4)" → 6⁴ */
function SetScoreCell({ value, isWinner }: { value: string; isWinner: boolean }) {
  const match = value.match(/^(\d+)\((\d+)\)$/);
  if (match) {
    return (
      <span className={`text-sm font-bold tabular-nums text-center ${isWinner ? "text-[#0F1F2E]" : "text-gray-400"}`}>
        {match[1]}
        <sup className="text-[9px] text-gray-400 ml-px">{match[2]}</sup>
      </span>
    );
  }
  return (
    <span className={`text-sm font-bold tabular-nums text-center ${isWinner ? "text-[#0F1F2E]" : "text-gray-400"}`}>
      {value}
    </span>
  );
}

export default function MatchCard({
  match,
  tournamentName,
}: {
  match: Match & { displayStatus?: DisplayStatus };
  tournamentName?: string;
}) {
  const { openMatch } = useMatchModal();
  const initialStatus = (match as NormalizedMatch).displayStatus || match.status;
  const isLive = initialStatus === "live";
  const { score, currentPoint, status } = useLiveScore(
    match.id,
    isLive,
    match.score,
    initialStatus
  );

  const displayScore = score;
  const displayStatus = status as DisplayStatus;
  const scoreStr = formatScore(displayScore);
  const team1Label = teamName(match.players.team_1);
  const team2Label = teamName(match.players.team_2);

  return (
    <div
      className={`bg-white rounded-xl border overflow-hidden transition-shadow hover:shadow-md cursor-pointer ${
        displayStatus === "live"
          ? "border-red-200 shadow-sm"
          : "border-gray-100"
      }`}
      onClick={() => openMatch(match, tournamentName)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") openMatch(match, tournamentName);
      }}
    >
      {/* Header */}
      <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 flex items-center justify-between border-b border-gray-100 gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          {tournamentName && (
            <span className="text-xs font-semibold text-[#0F1F2E] truncate">
              {tournamentName}
            </span>
          )}
          <span className="text-xs text-gray-400 shrink-0">
            / {match.round_name}
          </span>
        </div>
        <div className="shrink-0">
          <StatusBadge status={displayStatus} currentPoint={isLive ? currentPoint : null} variant="compact" />
        </div>
      </div>

      {/* Teams */}
      <div className="p-3 sm:p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p
              className={`text-sm font-semibold truncate ${
                match.winner === "team_1"
                  ? "text-[#0F1F2E]"
                  : match.winner === "team_2"
                  ? "text-gray-400"
                  : "text-[#0F1F2E]"
              }`}
            >
              {team1Label}
            </p>
          </div>
          {displayScore && displayScore.length > 0 && (
            <div className="flex gap-3 shrink-0 ml-2">
              {displayScore.map((s, i) => (
                <SetScoreCell key={i} value={s.team_1} isWinner={parseInt(s.team_1) > parseInt(s.team_2)} />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p
              className={`text-sm font-semibold truncate ${
                match.winner === "team_2"
                  ? "text-[#0F1F2E]"
                  : match.winner === "team_1"
                  ? "text-gray-400"
                  : "text-[#0F1F2E]"
              }`}
            >
              {team2Label}
            </p>
          </div>
          {displayScore && displayScore.length > 0 && (
            <div className="flex gap-3 shrink-0 ml-2">
              {displayScore.map((s, i) => (
                <SetScoreCell key={i} value={s.team_2} isWinner={parseInt(s.team_2) > parseInt(s.team_1)} />
              ))}
            </div>
          )}
        </div>

        {/* Full score line */}
        {scoreStr && (
          <p className="text-xs text-gray-400 pt-1 border-t border-gray-50 truncate">
            {scoreStr}
            {match.duration && (
              <span className="ml-2 text-gray-300">| {match.duration}</span>
            )}
          </p>
        )}

        {/* Schedule / court for scheduled */}
        {displayStatus === "scheduled" && (
          <div className="flex items-center gap-2 pt-1 border-t border-gray-50">
            {match.schedule_label ? (
              <span className="text-xs font-medium text-[#4ABED9]">{match.schedule_label}</span>
            ) : (
              <span className="text-xs text-gray-500">{match.played_at}</span>
            )}
            {match.court && (
              <>
                <span className="text-xs text-gray-300">|</span>
                <span className="text-xs text-gray-500">{match.court}</span>
              </>
            )}
          </div>
        )}

        {/* Court for live */}
        {displayStatus === "live" && match.court && (
          <p className="text-xs text-gray-400 pt-1 border-t border-gray-50">
            {match.court}
          </p>
        )}

        {/* Category badge */}
        <div className="pt-1">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
              match.category === "women"
                ? "bg-pink-50 text-pink-600"
                : "bg-blue-50 text-blue-600"
            }`}
          >
            {match.category}
          </span>
        </div>
      </div>
    </div>
  );
}
