import Link from "next/link";
import ClickableMatchRow from "@/components/ClickableMatchRow";
import {
  getSeasonTournaments,
  getMatches,
  getLiveMatches,
  type Match,
  type Tournament,
  type LiveMatchData,
} from "@/lib/padel-api";
import { normalizeMatches, buildContext, type NormalizedMatch } from "@/lib/normalize-match";

export const metadata = {
  title: "Live Scores | VAMOS",
  description: "Live padel scores, results, and upcoming matches from the Premier Padel tour.",
};

async function fetchScoresData(date: string) {
  const [s5Res, s6Res] = await Promise.allSettled([
    getSeasonTournaments(5, { per_page: "50" }),
    getSeasonTournaments(6, { per_page: "50" }),
  ]);
  const tournaments = [
    ...(s5Res.status === "fulfilled" ? s5Res.value.data : []),
    ...(s6Res.status === "fulfilled" ? s6Res.value.data : []),
  ];

  // Fetch matches for the specific date + live match data in parallel
  const [matchesRes, liveRes] = await Promise.all([
    getMatches({
      after_date: date,
      before_date: date,
      sort_by: "played_at",
      order_by: "desc",
      per_page: "100",
    }).catch(() => ({ data: [] as Match[] })),
    getLiveMatches().catch(() => ({ data: [] as LiveMatchData[] })),
  ]);

  // Normalize all matches through single pipeline
  const ctx = buildContext(liveRes.data, date);
  const allMatches = normalizeMatches(matchesRes.data, ctx);

  return { allMatches, tournaments };
}

function getTournamentForMatch(match: Match, tournaments: Tournament[]): Tournament | undefined {
  const tournamentPath = match.connections?.tournament;
  if (!tournamentPath) return undefined;
  const id = parseInt(tournamentPath.split("/").pop() || "0");
  return tournaments.find((t) => t.id === id);
}

export default async function ScoresPage({
  searchParams,
}: {
  searchParams: { tournament?: string; category?: string; date?: string };
}) {
  const tournamentFilter = searchParams.tournament;
  const categoryFilter = searchParams.category;

  // Date handling
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const selectedDate = searchParams.date || todayStr;

  const { allMatches, tournaments } = await fetchScoresData(selectedDate);

  // Filter by category
  let filtered: NormalizedMatch[] = allMatches.filter(
    (m) =>
      m.displayStatus !== "cancelled" &&
      // Show if: has at least one team, or is scheduled (TBD vs TBD for future matches), or finished with scores
      (m.players.team_1.length > 0 || m.players.team_2.length > 0 || m.displayStatus === "scheduled" || (m.displayStatus === "finished" && m.score && m.score.length > 0))
  );

  if (categoryFilter === "men" || categoryFilter === "women") {
    filtered = filtered.filter((m) => m.category === categoryFilter);
  }

  // Group matches by tournament, then by round
  type TournamentGroup = {
    tournament: Tournament | undefined;
    tournamentId: number;
    rounds: { roundName: string; round: number; matches: NormalizedMatch[] }[];
  };

  const groupMap = new Map<number, { tournament: Tournament | undefined; matchesByRound: Map<string, { round: number; matches: NormalizedMatch[] }> }>();

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

  // Sort matches within each round: live first, then scheduled, then finished
  const statusOrder: Record<string, number> = { live: 0, scheduled: 1, finished: 2, cancelled: 3, walkover: 3, unknown: 4 };
  groupMap.forEach((g) => {
    g.matchesByRound.forEach((roundData) => {
      roundData.matches.sort((a, b) => {
        const aOrder = statusOrder[a.displayStatus] ?? 4;
        const bOrder = statusOrder[b.displayStatus] ?? 4;
        return aOrder - bOrder;
      });
    });
  });

  const tournamentGroups: TournamentGroup[] = Array.from(groupMap.entries()).map(([id, g]) => ({
    tournament: g.tournament,
    tournamentId: id,
    rounds: Array.from(g.matchesByRound.entries())
      .map(([name, data]) => ({ roundName: name, ...data }))
      .sort((a, b) => a.round - b.round),
  }));

  // Sort: live tournaments first
  tournamentGroups.sort((a, b) => {
    const aLive = a.tournament?.status === "live" ? 0 : 1;
    const bLive = b.tournament?.status === "live" ? 0 : 1;
    return aLive - bLive;
  });

  // Only show tournaments that actually have matches on the selected date
  // Compute BEFORE tournament filter so filter buttons don't shrink when one is selected
  const tournamentIdsWithMatches = new Set<number>();
  for (const match of filtered) {
    const tournamentPath = match.connections?.tournament;
    if (tournamentPath) {
      const id = parseInt(tournamentPath.split("/").pop() || "0");
      if (id) tournamentIdsWithMatches.add(id);
    }
  }
  const activeTournaments = tournaments
    .filter((t) => tournamentIdsWithMatches.has(t.id))
    .slice(0, 10);

  // Filter displayed groups by tournament if specified
  if (tournamentFilter && tournamentFilter !== "all") {
    const tId = parseInt(tournamentFilter);
    const idx = tournamentGroups.findIndex((g) => g.tournamentId === tId);
    if (idx !== -1) {
      tournamentGroups.splice(0, tournamentGroups.length, tournamentGroups[idx]);
    } else {
      tournamentGroups.splice(0);
    }
  }

  // Date navigation
  const formatDateDisplay = (dateStr: string) => {
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  const selectedDateObj = new Date(selectedDate + "T12:00:00");
  const prevDateObj = new Date(selectedDateObj);
  prevDateObj.setDate(prevDateObj.getDate() - 1);
  const nextDateObj = new Date(selectedDateObj);
  nextDateObj.setDate(nextDateObj.getDate() + 1);

  const prevDateStr = prevDateObj.toISOString().split("T")[0];
  const nextDateStr = nextDateObj.toISOString().split("T")[0];
  const isToday = selectedDate === todayStr;

  function buildUrl(params: Record<string, string | undefined>) {
    const p = new URLSearchParams();
    if (params.date && params.date !== todayStr) p.set("date", params.date);
    if (params.category) p.set("category", params.category);
    if (params.tournament) p.set("tournament", params.tournament);
    const qs = p.toString();
    return `/scores${qs ? `?${qs}` : ""}`;
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-5 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0F1F2E] mb-1">Live Scores</h1>
        <p className="text-sm text-gray-500">Results and upcoming matches</p>
      </div>

      {/* Date Navigation */}
      <div className="mb-5">
        <div className="flex items-center justify-between bg-gray-50 rounded-lg py-2.5 px-4">
          <Link
            href={buildUrl({ date: prevDateStr, category: categoryFilter, tournament: tournamentFilter })}
            className="text-sm font-semibold text-gray-400 hover:text-[#4ABED9] transition-colors"
          >
            &larr; {formatDateDisplay(prevDateStr)}
          </Link>
          <span className="text-sm font-bold text-[#0F1F2E] px-3 py-1 bg-white rounded shadow-sm">
            {formatDateDisplay(selectedDate)}
          </span>
          <Link
            href={buildUrl({ date: nextDateStr, category: categoryFilter, tournament: tournamentFilter })}
            className="text-sm font-semibold text-gray-400 hover:text-[#4ABED9] transition-colors"
          >
            {formatDateDisplay(nextDateStr)} &rarr;
          </Link>
        </div>
        {!isToday && (
          <div className="flex justify-center mt-2">
            <Link
              href={buildUrl({ category: categoryFilter, tournament: tournamentFilter })}
              className="text-xs font-semibold text-[#4ABED9] hover:text-[#0F1F2E] transition-colors px-3 py-1 bg-[#4ABED9]/10 rounded-full"
            >
              ← Back to Today
            </Link>
          </div>
        )}
      </div>

      {/* Men/Women Tab Filter */}
      <div className="flex gap-1 mb-5 bg-gray-100 rounded-lg p-1 w-fit">
        <Link
          href={buildUrl({ date: selectedDate, tournament: tournamentFilter })}
          className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${
            !categoryFilter ? "bg-white text-[#0F1F2E] shadow-sm" : "text-gray-500 hover:text-[#0F1F2E]"
          }`}
        >
          All
        </Link>
        <Link
          href={buildUrl({ date: selectedDate, category: "men", tournament: tournamentFilter })}
          className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${
            categoryFilter === "men" ? "bg-white text-[#0F1F2E] shadow-sm" : "text-gray-500 hover:text-[#0F1F2E]"
          }`}
        >
          Men
        </Link>
        <Link
          href={buildUrl({ date: selectedDate, category: "women", tournament: tournamentFilter })}
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
            href={buildUrl({ date: selectedDate, category: categoryFilter })}
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
              href={buildUrl({ date: selectedDate, category: categoryFilter, tournament: String(t.id) })}
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
                      <ClickableMatchRow
                        key={match.id}
                        match={match}
                        tournamentName={group.tournament?.name}
                      />
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
