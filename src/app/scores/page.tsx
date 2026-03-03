import Link from "next/link";
import {
  getSeasonTournaments,
  getTournamentMatches,
  getMatches,
  formatScore,
  type Match,
  type Tournament,
} from "@/lib/padel-api";

export const metadata = {
  title: "Live Scores | VAMOS",
  description: "Live padel scores, results, and upcoming matches from the Premier Padel tour.",
};

async function fetchScoresData(tournamentId?: number) {
  const tournamentsRes = await getSeasonTournaments(5, { per_page: "30" }).catch(
    () => ({ data: [] as Tournament[] })
  );
  const tournaments = tournamentsRes.data;

  let matchTournaments: Tournament[];
  if (tournamentId) {
    matchTournaments = tournaments.filter((t) => t.id === tournamentId);
  } else {
    matchTournaments = tournaments.filter(
      (t) => t.status === "live" || t.status === "finished"
    );
  }

  // Fetch tournament-specific matches
  const matchResults = await Promise.allSettled(
    matchTournaments.map((t) =>
      getTournamentMatches(t.id, {
        per_page: "100",
        sort_by: "played_at",
        order_by: "desc",
      })
    )
  );

  const tournamentMatches: Match[] = matchResults.flatMap((r) =>
    r.status === "fulfilled" ? r.value.data : []
  );

  // Also fetch today's matches from global endpoint to catch previas/qualifying
  const today = new Date().toISOString().split("T")[0];
  const todayMatches = await getMatches({
    after_date: today,
    before_date: today,
    sort_by: "played_at",
    order_by: "desc",
    per_page: "50",
  }).catch(() => ({ data: [] as Match[] }));

  // Merge and deduplicate by match id
  const seenIds = new Set(tournamentMatches.map((m) => m.id));
  const extraMatches = todayMatches.data.filter((m) => !seenIds.has(m.id));
  const allMatches = [...extraMatches, ...tournamentMatches];

  return { allMatches, tournaments };
}

function getTournamentForMatch(match: Match, tournaments: Tournament[]): Tournament | undefined {
  const tournamentPath = match.connections?.tournament;
  if (!tournamentPath) return undefined;
  const id = parseInt(tournamentPath.split("/").pop() || "0");
  return tournaments.find((t) => t.id === id);
}

function teamName(players: Match["players"]["team_1"]): string {
  if (!players || players.length === 0) return "TBD";
  return players.map((p) => p.name.split(" ").pop()).join(" / ");
}

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
    return <span className="text-xs font-semibold text-gray-400">FT</span>;
  }
  return (
    <span className="text-xs font-semibold text-[#4ABED9]">
      {status === "scheduled" ? "Sched." : status}
    </span>
  );
}

function MatchRow({ match }: { match: Match }) {
  const score = match.score;
  const t1 = teamName(match.players.team_1);
  const t2 = teamName(match.players.team_2);

  return (
    <div
      className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors ${
        match.status === "live" ? "bg-red-50/30" : ""
      }`}
    >
      {/* Status */}
      <div className="w-12 sm:w-14 shrink-0 text-center">
        <StatusBadge status={match.status} />
      </div>

      {/* Teams and Scores */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className={`text-sm font-semibold truncate ${match.winner === "team_1" ? "text-[#0F1F2E]" : match.winner === "team_2" ? "text-gray-400" : "text-[#0F1F2E]"}`}>
            {t1}
          </span>
          {score && score.length > 0 && (
            <div className="flex gap-1.5 sm:gap-2 shrink-0">
              {score.map((s, i) => (
                <span key={i} className={`text-sm font-bold tabular-nums w-4 text-center ${parseInt(s.team_1) > parseInt(s.team_2) ? "text-[#0F1F2E]" : "text-gray-400"}`}>
                  {s.team_1}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className={`text-sm font-semibold truncate ${match.winner === "team_2" ? "text-[#0F1F2E]" : match.winner === "team_1" ? "text-gray-400" : "text-[#0F1F2E]"}`}>
            {t2}
          </span>
          {score && score.length > 0 && (
            <div className="flex gap-1.5 sm:gap-2 shrink-0">
              {score.map((s, i) => (
                <span key={i} className={`text-sm font-bold tabular-nums w-4 text-center ${parseInt(s.team_2) > parseInt(s.team_1) ? "text-[#0F1F2E]" : "text-gray-400"}`}>
                  {s.team_2}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category badge */}
      <div className="shrink-0">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
          match.category === "women" ? "bg-pink-50 text-pink-600" : "bg-blue-50 text-blue-600"
        }`}>
          {match.category === "women" ? "W" : "M"}
        </span>
      </div>
    </div>
  );
}

export default async function ScoresPage({
  searchParams,
}: {
  searchParams: { tournament?: string; category?: string };
}) {
  const tournamentFilter = searchParams.tournament;
  const categoryFilter = searchParams.category;
  const tournamentId =
    tournamentFilter && tournamentFilter !== "all"
      ? parseInt(tournamentFilter)
      : undefined;

  const { allMatches, tournaments } = await fetchScoresData(tournamentId);

  // Filter out byes/cancelled, and optionally by category
  let filtered = allMatches.filter(
    (m) =>
      m.status !== "bye" &&
      m.status !== "cancelled" &&
      (m.players.team_1.length > 0 || m.players.team_2.length > 0 || (m.status === "finished" && m.score && m.score.length > 0))
  );

  if (categoryFilter === "men" || categoryFilter === "women") {
    filtered = filtered.filter((m) => m.category === categoryFilter);
  }

  // Group matches by tournament, then by round
  type TournamentGroup = {
    tournament: Tournament | undefined;
    tournamentId: number;
    rounds: { roundName: string; round: number; matches: Match[] }[];
  };

  const groupMap = new Map<number, { tournament: Tournament | undefined; matchesByRound: Map<string, { round: number; matches: Match[] }> }>();

  for (const match of filtered) {
    const tournament = getTournamentForMatch(match, tournaments);
    const tId = tournament?.id ?? 0;

    if (!groupMap.has(tId)) {
      groupMap.set(tId, { tournament, matchesByRound: new Map() });
    }
    const group = groupMap.get(tId)!;
    const roundKey = match.round_name || `Round ${match.round}`;
    if (!group.matchesByRound.has(roundKey)) {
      group.matchesByRound.set(roundKey, { round: match.round, matches: [] });
    }
    group.matchesByRound.get(roundKey)!.matches.push(match);
  }

  const tournamentGroups: TournamentGroup[] = Array.from(groupMap.entries()).map(([id, g]) => ({
    tournament: g.tournament,
    tournamentId: id,
    rounds: Array.from(g.matchesByRound.entries())
      .map(([name, data]) => ({ roundName: name, ...data }))
      .sort((a, b) => a.round - b.round),
  }));

  // Sort: live tournaments first, then by status
  tournamentGroups.sort((a, b) => {
    const aLive = a.tournament?.status === "live" ? 0 : 1;
    const bLive = b.tournament?.status === "live" ? 0 : 1;
    return aLive - bLive;
  });

  const activeTournaments = tournaments
    .filter((t) => t.status === "live" || t.status === "finished")
    .slice(0, 10);

  // Date navigation
  const today = new Date();
  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  const prevDate = new Date(today);
  prevDate.setDate(prevDate.getDate() - 1);
  const nextDate = new Date(today);
  nextDate.setDate(nextDate.getDate() + 1);

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-5 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0F1F2E] mb-1">Live Scores</h1>
        <p className="text-sm text-gray-500">Results and upcoming matches</p>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-center gap-4 mb-5 bg-gray-50 rounded-lg py-2.5 px-4">
        <button className="text-sm font-semibold text-gray-400 hover:text-[#4ABED9] transition-colors">
          &lt; {formatDate(prevDate)}
        </button>
        <span className="text-sm font-bold text-[#0F1F2E] px-3 py-1 bg-white rounded shadow-sm">
          {formatDate(today)}
        </span>
        <button className="text-sm font-semibold text-gray-400 hover:text-[#4ABED9] transition-colors">
          {formatDate(nextDate)} &gt;
        </button>
      </div>

      {/* Men/Women Tab Filter */}
      <div className="flex gap-1 mb-5 bg-gray-100 rounded-lg p-1 w-fit">
        <Link
          href={`/scores${tournamentFilter ? `?tournament=${tournamentFilter}` : ""}`}
          className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${
            !categoryFilter ? "bg-white text-[#0F1F2E] shadow-sm" : "text-gray-500 hover:text-[#0F1F2E]"
          }`}
        >
          All
        </Link>
        <Link
          href={`/scores?category=men${tournamentFilter ? `&tournament=${tournamentFilter}` : ""}`}
          className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${
            categoryFilter === "men" ? "bg-white text-[#0F1F2E] shadow-sm" : "text-gray-500 hover:text-[#0F1F2E]"
          }`}
        >
          Men
        </Link>
        <Link
          href={`/scores?category=women${tournamentFilter ? `&tournament=${tournamentFilter}` : ""}`}
          className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${
            categoryFilter === "women" ? "bg-white text-[#0F1F2E] shadow-sm" : "text-gray-500 hover:text-[#0F1F2E]"
          }`}
        >
          Women
        </Link>
      </div>

      {/* Tournament filter */}
      <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto mb-6">
        <div className="flex gap-2 pb-2 sm:pb-0 sm:flex-wrap">
          <Link
            href={`/scores${categoryFilter ? `?category=${categoryFilter}` : ""}`}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              !tournamentFilter || tournamentFilter === "all"
                ? "bg-[#4ABED9] text-white"
                : "bg-gray-100 text-[#0F1F2E] hover:bg-gray-200"
            }`}
          >
            All Tournaments
          </Link>
          {activeTournaments.map((t) => (
            <Link
              key={t.id}
              href={`/scores?tournament=${t.id}${categoryFilter ? `&category=${categoryFilter}` : ""}`}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                tournamentFilter === String(t.id)
                  ? "bg-[#4ABED9] text-white"
                  : "bg-gray-100 text-[#0F1F2E] hover:bg-gray-200"
              }`}
            >
              {t.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Grouped Matches */}
      {tournamentGroups.length > 0 ? (
        <div className="space-y-6">
          {tournamentGroups.map((group) => (
            <div key={group.tournamentId} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              {/* Tournament header */}
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                {group.tournament?.status === "live" && (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                )}
                <h3 className="text-sm font-bold text-[#0F1F2E]">
                  {group.tournament?.name || "Unknown Tournament"}
                </h3>
                {group.tournament && (
                  <span className="text-xs text-gray-400 ml-auto">
                    {group.tournament.location}, {group.tournament.country}
                  </span>
                )}
              </div>

              {/* Rounds */}
              {group.rounds.map((round) => (
                <div key={round.roundName}>
                  <div className="px-4 py-2 bg-gray-50/50 border-b border-gray-100">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      {round.roundName}
                    </span>
                  </div>
                  <div>
                    {round.matches.map((match) => (
                      <MatchRow key={match.id} match={match} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 sm:py-16 text-gray-400">
          <p className="text-base sm:text-lg">No matches found. Try a different filter.</p>
        </div>
      )}
    </main>
  );
}
