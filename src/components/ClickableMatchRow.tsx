"use client";

import type { Match } from "@/lib/padel-api";
import { useMatchModal } from "@/components/MatchModalProvider";
import { useLiveScore } from "@/hooks/useLiveScore";
import { teamName } from "@/lib/player-utils";

/** Render a set score, splitting tiebreak into superscript: "6(4)" → 6⁽⁴⁾ */
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
    <span className={`text-sm font-bold tabular-nums w-4 text-center ${isWinner ? "text-[#0F1F2E]" : "text-gray-400"}`}>
      {value}
    </span>
  );
}

function StatusBadge({ status, currentPoint }: { status: string; currentPoint?: string | null }) {
  if (status === "live") {
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
  return (
    <span className="text-xs font-semibold text-[#4ABED9]">
      {status === "scheduled" ? "Sched." : status}
    </span>
  );
}

export default function ClickableMatchRow({
  match,
  tournamentName,
}: {
  match: Match;
  tournamentName?: string;
}) {
  const { openMatch } = useMatchModal();
  const isLive = match.status === "live";
  const { score, currentPoint, status } = useLiveScore(
    match.id,
    isLive,
    match.score
  );

  const displayScore = score;
  const displayStatus = status as Match["status"];
  const t1 = teamName(match.players.team_1);
  const t2 = teamName(match.players.team_2);

  return (
    <div
      className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors cursor-pointer ${
        displayStatus === "live" ? "bg-red-50/30" : ""
      }`}
      onClick={() => openMatch(match, tournamentName)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") openMatch(match, tournamentName);
      }}
    >
      {/* Status */}
      <div className="w-12 sm:w-14 shrink-0 text-center">
        <StatusBadge status={displayStatus} currentPoint={isLive ? currentPoint : null} />
      </div>

      {/* Teams and Scores */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span
            className={`text-sm font-semibold truncate ${
              match.winner === "team_1"
                ? "text-[#0F1F2E]"
                : match.winner === "team_2"
                ? "text-gray-400"
                : "text-[#0F1F2E]"
            }`}
          >
            {t1}
          </span>
          {displayScore && displayScore.length > 0 && (
            <div className="flex gap-2 sm:gap-3 shrink-0">
              {displayScore.map((s, i) => (
                <SetScoreCell key={i} value={s.team_1} isWinner={parseInt(s.team_1) > parseInt(s.team_2)} />
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <span
            className={`text-sm font-semibold truncate ${
              match.winner === "team_2"
                ? "text-[#0F1F2E]"
                : match.winner === "team_1"
                ? "text-gray-400"
                : "text-[#0F1F2E]"
            }`}
          >
            {t2}
          </span>
          {displayScore && displayScore.length > 0 && (
            <div className="flex gap-2 sm:gap-3 shrink-0">
              {displayScore.map((s, i) => (
                <SetScoreCell key={i} value={s.team_2} isWinner={parseInt(s.team_2) > parseInt(s.team_1)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category badge */}
      <div className="shrink-0">
        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
            match.category === "women"
              ? "bg-pink-50 text-pink-600"
              : "bg-blue-50 text-blue-600"
          }`}
        >
          {match.category === "women" ? "W" : "M"}
        </span>
      </div>
    </div>
  );
}
