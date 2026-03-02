import Link from "next/link";
import MatchCard from "@/components/MatchCard";
import RankingRow from "@/components/RankingRow";
import NewsletterSignup from "@/components/NewsletterSignup";
import {
  getPlayers,
  getMatches,
  getSeasonTournaments,
  type Player,
  type Match,
  type Tournament,
} from "@/lib/padel-api";

async function fetchHomeData() {
  const [menRes, womenRes, matchesRes, tournamentsRes] = await Promise.allSettled([
    getPlayers({
      category: "men",
      sort_by: "ranking",
      order_by: "asc",
      per_page: "10",
    }),
    getPlayers({
      category: "women",
      sort_by: "ranking",
      order_by: "asc",
      per_page: "10",
    }),
    getMatches({
      sort_by: "played_at",
      order_by: "desc",
      per_page: "8",
    }),
    getSeasonTournaments(5, { per_page: "5" }),
  ]);

  const men: Player[] =
    menRes.status === "fulfilled" ? menRes.value.data : [];
  const women: Player[] =
    womenRes.status === "fulfilled" ? womenRes.value.data : [];
  const matches: Match[] =
    matchesRes.status === "fulfilled" ? matchesRes.value.data : [];
  const tournaments: Tournament[] =
    tournamentsRes.status === "fulfilled" ? tournamentsRes.value.data : [];

  return { men, women, matches, tournaments };
}

export default async function Home() {
  const { men, women, matches, tournaments } = await fetchHomeData();

  const recentMatches = matches
    .filter(
      (m) =>
        m.status === "finished" &&
        m.players.team_1.length > 0 &&
        m.players.team_2.length > 0
    )
    .slice(0, 4);

  const topMen = men.slice(0, 5);
  const topWomen = women.slice(0, 5);

  // Find a current/upcoming tournament
  const activeTournament = tournaments.find(
    (t) => t.status === "live" || t.status === "pending"
  );

  return (
    <main>
      {/* Hero / Active Tournament Banner */}
      {activeTournament && (
        <section className="bg-[#0F1F2E]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {activeTournament.status === "live" && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-400">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      Live Now
                    </span>
                  )}
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#4ABED9]">
                    {activeTournament.level.toUpperCase()}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  {activeTournament.name}
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  {activeTournament.location}, {activeTournament.country} |{" "}
                  {activeTournament.start_date} to {activeTournament.end_date}
                </p>
              </div>
              <Link
                href="/scores"
                className="px-5 py-2.5 bg-[#4ABED9] text-white text-sm font-bold rounded-lg hover:bg-[#3ba8c2] transition-colors self-start"
              >
                View Scores
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Recent Matches */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F1F2E]">
                Recent Results
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Latest matches from the tour
              </p>
            </div>
            <Link
              href="/scores"
              className="text-sm font-semibold text-[#4ABED9] hover:text-[#0F1F2E] transition-colors self-start sm:self-auto"
            >
              View All
            </Link>
          </div>
          {recentMatches.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {recentMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">
              No recent results available.
            </p>
          )}
        </div>
      </section>

      {/* Rankings Preview */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F1F2E]">
              Rankings
            </h2>
            <Link
              href="/rankings"
              className="text-sm font-semibold text-[#4ABED9] hover:text-[#0F1F2E] transition-colors"
            >
              Full Rankings
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Men */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F1F2E]">
                  Men&apos;s Top 5
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[320px]">
                  <thead>
                    <tr className="text-xs font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100">
                      <th className="py-2 px-3 text-center w-12">#</th>
                      <th className="py-2 px-3 text-left">Player</th>
                      <th className="py-2 px-3 text-right">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topMen.map((p) => (
                      <RankingRow key={p.id} player={p} compact />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Women */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F1F2E]">
                  Women&apos;s Top 5
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[320px]">
                  <thead>
                    <tr className="text-xs font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100">
                      <th className="py-2 px-3 text-center w-12">#</th>
                      <th className="py-2 px-3 text-left">Player</th>
                      <th className="py-2 px-3 text-right">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topWomen.map((p) => (
                      <RankingRow key={p.id} player={p} compact />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Tournaments */}
      {tournaments.length > 0 && (
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F1F2E]">
                Upcoming Tournaments
              </h2>
              <Link
                href="/calendar"
                className="text-sm font-semibold text-[#4ABED9] hover:text-[#0F1F2E] transition-colors"
              >
                Full Calendar
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tournaments
                .filter((t) => t.status === "pending" || t.status === "live")
                .slice(0, 3)
                .map((t) => (
                  <div
                    key={t.id}
                    className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#4ABED9]/10 text-[#4ABED9]">
                        {t.level.toUpperCase()}
                      </span>
                      {t.status === "live" && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-50 text-red-600">
                          Live
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-[#0F1F2E] mb-1">
                      {t.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {t.location}, {t.country}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {t.start_date} - {t.end_date}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <NewsletterSignup />
      </section>
    </main>
  );
}
