"use client";

import type { Match } from "@/lib/padel-api";
import { useMatchModal } from "@/components/MatchModalProvider";
import { useLiveScore } from "@/hooks/useLiveScore";
import { teamName } from "@/lib/player-utils";

function TickerMatch({ match }: { match: Match }) {
  const { openMatch } = useMatchModal();
  const isLive = match.status === "live";
  const { score, currentPoint } = useLiveScore(match.id, isLive, match.score);

  const displayScore = score;

  return (
    <button
      onClick={() => openMatch(match)}
      className="flex items-center gap-2 px-3 sm:px-4 py-2.5 border-l border-white/10 hover:bg-white/5 transition-colors"
    >
      {isLive && (
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
      )}
      <span className="text-xs text-gray-300 whitespace-nowrap">
        {teamName(match.players.team_1)}
      </span>
      {displayScore && displayScore.length > 0 ? (
        <span className="text-xs font-bold text-white whitespace-nowrap">
          {displayScore.map((s) => `${s.team_1 || "0"}-${s.team_2 || "0"}`).join(" ")}
        </span>
      ) : (
        <span className="text-xs text-gray-500 whitespace-nowrap">vs</span>
      )}
      <span className="text-xs text-gray-300 whitespace-nowrap">
        {teamName(match.players.team_2)}
      </span>
      {isLive && currentPoint && (
        <span className="text-[10px] font-bold text-red-400 tabular-nums whitespace-nowrap">
          ({currentPoint})
        </span>
      )}
    </button>
  );
}

export default function ScoresTicker({ matches }: { matches: Match[] }) {
  return (
    <div className="flex items-center gap-0 min-w-max">
      {matches.map((match) => (
        <TickerMatch key={match.id} match={match} />
      ))}
    </div>
  );
}
