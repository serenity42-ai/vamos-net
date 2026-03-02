import type { Match } from "@/data/mock";

function StatusBadge({ status }: { status: Match["status"] }) {
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-600">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        Live
      </span>
    );
  }
  if (status === "finished") {
    return (
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        Final
      </span>
    );
  }
  return (
    <span className="text-xs font-semibold uppercase tracking-wider text-[#4ABED9]">
      Upcoming
    </span>
  );
}

export default function MatchCard({ match }: { match: Match }) {
  return (
    <div className={`bg-white rounded-xl border overflow-hidden transition-shadow hover:shadow-md ${
      match.status === "live" ? "border-red-200 shadow-sm" : "border-gray-100"
    }`}>
      {/* Header */}
      <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 flex items-center justify-between border-b border-gray-100 gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <span className="text-xs font-semibold text-[#0F1F2E] truncate">{match.tournament}</span>
          <span className="text-xs text-gray-400 shrink-0">/ {match.round}</span>
        </div>
        <div className="shrink-0">
          <StatusBadge status={match.status} />
        </div>
      </div>

      {/* Teams */}
      <div className="p-3 sm:p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#0F1F2E] truncate">
              {match.team1.player1} / {match.team1.player2}
            </p>
          </div>
          {match.score && (
            <span className="text-sm font-bold text-[#0F1F2E] tabular-nums shrink-0 ml-2">
              {match.status === "finished"
                ? match.score.split(",")[0]?.trim()
                : match.score.split(",").pop()?.trim().split("-")[0]}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#0F1F2E] truncate">
              {match.team2.player1} / {match.team2.player2}
            </p>
          </div>
          {match.score && (
            <span className="text-sm font-bold text-[#0F1F2E] tabular-nums shrink-0 ml-2">
              {match.status === "finished"
                ? match.score.split(",")[0]?.trim()
                : match.score.split(",").pop()?.trim().split("-")[1]}
            </span>
          )}
        </div>

        {/* Full score line */}
        {match.score && (
          <p className="text-xs text-gray-400 pt-1 border-t border-gray-50 truncate">
            {match.score}
          </p>
        )}

        {/* Time / court for upcoming */}
        {match.status === "upcoming" && match.time && (
          <div className="flex items-center gap-2 pt-1 border-t border-gray-50">
            <span className="text-xs text-gray-500">{match.time}</span>
            {match.court && (
              <>
                <span className="text-xs text-gray-300">|</span>
                <span className="text-xs text-gray-500">{match.court}</span>
              </>
            )}
          </div>
        )}

        {/* Court for live */}
        {match.status === "live" && match.court && (
          <p className="text-xs text-gray-400 pt-1 border-t border-gray-50">{match.court}</p>
        )}
      </div>
    </div>
  );
}
