"use client";

import type { Match } from "@/lib/padel-api";
import { useMatchModal } from "@/components/MatchModalProvider";

function teamName(players: Match["players"]["team_1"]): string {
  if (!players || players.length === 0) return "TBD";
  return players.map((p) => p.name.split(" ").pop()).join(" / ");
}

export default function ScoresTicker({ matches }: { matches: Match[] }) {
  const { openMatch } = useMatchModal();

  return (
    <div className="flex items-center gap-0 min-w-max">
      {matches.map((match) => (
        <button
          key={match.id}
          onClick={() => openMatch(match)}
          className="flex items-center gap-2 px-3 sm:px-4 py-2.5 border-l border-white/10 hover:bg-white/5 transition-colors"
        >
          {match.status === "live" && (
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
          )}
          <span className="text-xs text-gray-300 whitespace-nowrap">
            {teamName(match.players.team_1)}
          </span>
          {match.score && match.score.length > 0 ? (
            <span className="text-xs font-bold text-white whitespace-nowrap">
              {match.score.map((s) => `${s.team_1}-${s.team_2}`).join(" ")}
            </span>
          ) : (
            <span className="text-xs text-gray-500 whitespace-nowrap">vs</span>
          )}
          <span className="text-xs text-gray-300 whitespace-nowrap">
            {teamName(match.players.team_2)}
          </span>
        </button>
      ))}
    </div>
  );
}
