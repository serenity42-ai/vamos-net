import MatchCard from "@/components/MatchCard";
import Link from "next/link";
import {
  getSeasonTournaments,
  getTournamentMatches,
  type Match,
  type Tournament,
} from "@/lib/padel-api";

export const metadata = {
  title: "Scores | VAMOS",
  description: "Latest padel match results and upcoming fixtures.",
};

async function fetchScoresData(tournamentId?: number) {
  // Fetch season tournaments first
  const tournamentsRes = await getSeasonTournaments(5, { per_page: "30" }).catch(
    () => ({ data: [] as Tournament[] })
  );
  const tournaments = tournamentsRes.data;

  // Determine which tournaments to fetch matches for
  let matchTournaments: Tournament[];
  if (tournamentId) {
    // Specific tournament selected
    matchTournaments = tournaments.filter((t) => t.id === tournamentId);
    if (matchTournaments.length === 0) matchTournaments = tournaments.filter((t) => t.id === tournamentId);
  } else {
    // "All" — fetch live + most recently finished tournaments
    matchTournaments = tournaments.filter(
      (t) => t.status === "live" || t.status === "finished"
    );
  }

  // Fetch matches from each tournament in parallel
  const matchResults = await Promise.allSettled(
    matchTournaments.map((t) =>
      getTournamentMatches(t.id, {
        per_page: "100",
        sort_by: "played_at",
        order_by: "desc",
      })
    )
  );

  const allMatches: Match[] = matchResults.flatMap((r) =>
    r.status === "fulfilled" ? r.value.data : []
  );

  return { allMatches, tournaments };
}

function getTournamentName(
  match: Match,
  tournaments: Tournament[]
): string {
  const tournamentPath = match.connections?.tournament;
  if (!tournamentPath) return "";
  const id = parseInt(tournamentPath.split("/").pop() || "0");
  const tournament = tournaments.find((t) => t.id === id);
  return tournament?.name || "";
}

export default async function ScoresPage({
  searchParams,
}: {
  searchParams: { tournament?: string };
}) {
  const tournamentFilter = searchParams.tournament;
  const tournamentId =
    tournamentFilter && tournamentFilter !== "all"
      ? parseInt(tournamentFilter)
      : undefined;

  const { allMatches, tournaments } = await fetchScoresData(tournamentId);

  // Filter out bye matches and matches with no data at all
  const filtered = allMatches.filter(
    (m) =>
      m.status !== "bye" &&
      m.status !== "cancelled" &&
      (m.players.team_1.length > 0 ||
        m.players.team_2.length > 0 ||
        (m.status === "finished" && m.score && m.score.length > 0))
  );

  const live = filtered.filter((m) => m.status === "live");
  const scheduled = filtered.filter((m) => m.status === "scheduled");
  const finished = filtered.filter((m) => m.status === "finished");

  // Get active tournaments for filter — show live + finished
  const activeTournaments = tournaments
    .filter((t) => t.status === "live" || t.status === "finished")
    .slice(0, 10);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0F1F2E] mb-2">
          Scores
        </h1>
        <p className="text-sm sm:text-base text-gray-500">
          Recent results and upcoming matches
        </p>
      </div>

      {/* Tournament filter */}
      <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto mb-6 sm:mb-8">
        <div className="flex gap-2 pb-2 sm:pb-0 sm:flex-wrap">
          <Link
            href="/scores"
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
              href={`/scores?tournament=${t.id}`}
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

      {/* Live matches */}
      {live.length > 0 && (
        <section className="mb-8 sm:mb-10">
          <h2 className="text-base sm:text-lg font-bold text-[#0F1F2E] mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Live Now
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {live.map((m) => (
              <MatchCard
                key={m.id}
                match={m}
                tournamentName={getTournamentName(m, tournaments)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Scheduled */}
      {scheduled.length > 0 && (
        <section className="mb-8 sm:mb-10">
          <h2 className="text-base sm:text-lg font-bold text-[#0F1F2E] mb-4">
            Upcoming
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {scheduled.map((m) => (
              <MatchCard
                key={m.id}
                match={m}
                tournamentName={getTournamentName(m, tournaments)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Finished */}
      {finished.length > 0 && (
        <section className="mb-8 sm:mb-10">
          <h2 className="text-base sm:text-lg font-bold text-gray-400 mb-4">
            Finished
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {finished.map((m) => (
              <MatchCard
                key={m.id}
                match={m}
                tournamentName={getTournamentName(m, tournaments)}
              />
            ))}
          </div>
        </section>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-12 sm:py-16 text-gray-400">
          <p className="text-base sm:text-lg">
            No matches found. Try a different tournament filter.
          </p>
        </div>
      )}
    </main>
  );
}
