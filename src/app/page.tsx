import Link from "next/link";
import Image from "next/image";
import MatchCard from "@/components/MatchCard";
import ScoresTicker from "@/components/ScoresTicker";
import RankingRow from "@/components/RankingRow";
import NewsCard from "@/components/NewsCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import { fetchArticles } from "@/lib/ghost";
import {
  getPlayers,
  getSeasonTournaments,
  getTournamentMatches,
  getMatches,
  getLiveMatches,
  countryFlag,
  levelLabel,
  type Player,
  type Match,
  type Tournament,
  type LiveMatchData,
} from "@/lib/padel-api";
import { normalizeMatches, buildContext } from "@/lib/normalize-match";

async function fetchHomeData() {
  const [menRes, womenRes, s5Res, s6Res] = await Promise.allSettled([
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
    getSeasonTournaments(5, { per_page: "50" }),
    getSeasonTournaments(6, { per_page: "50" }),
  ]);

  const men: Player[] = menRes.status === "fulfilled" ? menRes.value.data : [];
  const women: Player[] = womenRes.status === "fulfilled" ? womenRes.value.data : [];
  const tournaments: Tournament[] = [
    ...(s5Res.status === "fulfilled" ? s5Res.value.data : []),
    ...(s6Res.status === "fulfilled" ? s6Res.value.data : []),
  ];

  const relevantTournaments = tournaments.filter(
    (t) => t.status === "live" || t.status === "finished"
  );
  const matchResults = await Promise.allSettled(
    relevantTournaments.map((t) =>
      getTournamentMatches(t.id, {
        per_page: "50",
        sort_by: "played_at",
        order_by: "desc",
      })
    )
  );
  const tournamentMatches: Match[] = matchResults.flatMap((r) =>
    r.status === "fulfilled" ? r.value.data : []
  );

  // Fetch recent matches from global endpoint (tournament endpoint can miss some)
  const today = new Date();
  const threeDaysAgo = new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000);
  const todayStr = today.toISOString().split("T")[0];
  const recentStr = threeDaysAgo.toISOString().split("T")[0];
  const todayRes = await getMatches({
    after_date: recentStr,
    before_date: todayStr,
    sort_by: "played_at",
    order_by: "desc",
    per_page: "50",
  }).catch(() => ({ data: [] as Match[] }));

  const seenIds = new Set(tournamentMatches.map((m) => m.id));
  const extraMatches = todayRes.data.filter((m) => !seenIds.has(m.id));
  let matches = [...extraMatches, ...tournamentMatches].sort(
    (a, b) => new Date(b.played_at).getTime() - new Date(a.played_at).getTime()
  );

  // Normalize all matches through single pipeline (merges live scores, derives status)
  const liveRes = await getLiveMatches().catch(() => ({ data: [] as LiveMatchData[] }));
  const ctx = buildContext(liveRes.data);
  const normalized = normalizeMatches(matches, ctx);

  // Build tournament name map from connections
  const tournamentNameMap = new Map<number, string>();
  for (const t of tournaments) {
    tournamentNameMap.set(t.id, t.name);
  }

  return { men, women, matches: normalized, tournaments, tournamentNameMap };
}

function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  if (s.getMonth() === e.getMonth()) {
    return `${months[s.getMonth()]} ${s.getDate()}-${e.getDate()}, ${s.getFullYear()}`;
  }
  return `${months[s.getMonth()]} ${s.getDate()} - ${months[e.getMonth()]} ${e.getDate()}, ${s.getFullYear()}`;
}

export default async function Home() {
  const { men, women, matches, tournaments, tournamentNameMap } = await fetchHomeData();

  // Helper to get tournament name from a match's connections
  function getTournamentName(match: Match): string | undefined {
    const path = match.connections?.tournament;
    if (!path) return undefined;
    const id = parseInt(path.split("/").pop() || "0");
    return tournamentNameMap.get(id);
  }

  const filterAndSort = (players: Player[]) => {
    const topPoints = players.slice(0, 10).map((p) => p.points || 0).filter((p) => p > 0).sort((a, b) => b - a);
    const threshold = topPoints.length > 2 ? topPoints[2] * 0.1 : 0;
    // Filter out juniors leaked into senior rankings (PadelAPI data bug)
    const cutoffDate = new Date();
    cutoffDate.setFullYear(cutoffDate.getFullYear() - 19);
    const filtered = players.filter((p) => {
      if (!p.points || p.points < threshold) return false;
      // Exclude players under 19 — likely junior/Promises ranking leak
      if (p.birthdate) {
        const bd = new Date(p.birthdate);
        if (bd > cutoffDate) return false;
      }
      return true;
    });
    // Re-sort by points descending and re-assign rankings (API ranking field is unreliable)
    filtered.sort((a, b) => (b.points || 0) - (a.points || 0));
    let currentRank = 1;
    for (let i = 0; i < filtered.length; i++) {
      if (i > 0 && (filtered[i].points || 0) < (filtered[i - 1].points || 0)) {
        currentRank = i + 1;
      }
      filtered[i].ranking = currentRank;
    }
    return filtered;
  };
  const topMen = filterAndSort(men).slice(0, 5);

  const recentMatches = matches
    .filter((m) => m.displayStatus === "finished" && m.players.team_1.length > 0 && m.players.team_2.length > 0)
    .slice(0, 6);

  const liveMatches = matches.filter((m) => m.displayStatus === "live");

  // Only show recent finished matches if they're from the last 3 days
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  const freshFinished = recentMatches.filter(
    (m) => new Date(m.played_at) >= threeDaysAgo
  );

  const tickerMatches = liveMatches.length > 0
    ? liveMatches
    : freshFinished.slice(0, 4);

  const activeTournament = tournaments.find((t) => t.status === "live") || tournaments.find((t) => t.status === "pending");

  const articles = await fetchArticles();
  const featuredArticle = articles[0];
  const latestNews = articles.slice(1, 5);
  const businessArticles = articles.filter((a) => a.category === "Business").slice(0, 3);

  return (
    <main>
      {/* Section 1: Live Scores Ticker */}
      {tickerMatches.length > 0 && (
        <section className="bg-[#0F1F2E] overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center">
              <div className="flex-1 overflow-x-auto scrollbar-hide">
                <ScoresTicker matches={tickerMatches} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Section 2: Hero — Featured Story + Sidebar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Featured Article (2/3) */}
            <div className="lg:col-span-2">
              {featuredArticle && (
                <Link href={`/news/${featuredArticle.slug}`} className="group block">
                  <div className="aspect-[16/9] bg-gradient-to-br from-[#0F1F2E] to-[#1a3a52] rounded-xl overflow-hidden relative mb-4">
                    {featuredArticle.imageUrl && (
                      <img
                        src={featuredArticle.imageUrl}
                        alt={featuredArticle.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#4ABED9]">
                      {featuredArticle.category}
                    </span>
                    <span className="text-xs text-gray-400">{featuredArticle.date}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#0F1F2E] group-hover:text-[#4ABED9] transition-colors mb-2 leading-tight">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-500 leading-relaxed line-clamp-2">
                    {featuredArticle.excerpt}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">{featuredArticle.author}</p>
                </Link>
              )}
            </div>

            {/* Sidebar (1/3) */}
            <div className="space-y-6">
              {/* Newsletter Signup */}
              <div className="bg-[#0F1F2E] rounded-xl p-5">
                <h3 className="text-base font-bold text-white mb-1">The Padel Brief</h3>
                <p className="text-xs text-gray-400 mb-4">
                  Get the latest padel scores, rankings, and news. Join thousands of fans.
                </p>
                <form className="space-y-2">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 outline-none focus:border-[#4ABED9] text-sm"
                  />
                  <button
                    type="button"
                    className="w-full px-4 py-2.5 bg-[#4ABED9] hover:bg-[#3ba8c2] text-white font-bold rounded-lg transition-colors text-sm"
                  >
                    Subscribe
                  </button>
                </form>
              </div>

              {/* Top 5 Rankings Widget */}
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F1F2E]">
                    Men&apos;s Top 5
                  </h3>
                  <Link href="/rankings" className="text-xs font-semibold text-[#4ABED9] hover:text-[#0F1F2E] transition-colors">
                    Full Rankings
                  </Link>
                </div>
                <table className="w-full">
                  <tbody>
                    {topMen.map((p) => (
                      <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                        <td className="py-2 px-3 text-center w-10">
                          <span className={`text-xs font-bold ${p.ranking <= 3 ? "text-[#4ABED9]" : "text-[#0F1F2E]"}`}>
                            {p.ranking}
                          </span>
                        </td>
                        <td className="py-2 px-2">
                          <Link href={`/players/${p.id}`} className="flex items-center gap-2 group">
                            {p.photo_url ? (
                              <Image src={p.photo_url} alt={p.name} width={24} height={24} className="w-6 h-6 rounded-full object-cover bg-gray-100" />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400">
                                {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                              </div>
                            )}
                            <span className="text-xs font-semibold text-[#0F1F2E] group-hover:text-[#4ABED9] transition-colors truncate">
                              {countryFlag(p.nationality)} {p.name}
                            </span>
                          </Link>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <span className="text-xs font-semibold text-[#0F1F2E] tabular-nums">
                            {p.points?.toLocaleString() ?? "-"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Latest News */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F1F2E]">Latest News</h2>
            <Link href="/news" className="text-sm font-semibold text-[#4ABED9] hover:text-[#0F1F2E] transition-colors">
              View All News
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {latestNews.map((article) => (
              <NewsCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Current/Upcoming Tournament Banner */}
      {activeTournament && (
        <section className="bg-[#0F1F2E]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {activeTournament.status === "live" && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-400">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      Live Now
                    </span>
                  )}
                  {activeTournament.status === "pending" && (
                    <span className="text-xs font-bold uppercase tracking-wider text-[#3CB371]">
                      Upcoming
                    </span>
                  )}
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#4ABED9]/20 text-[#4ABED9]">
                    {levelLabel(activeTournament.level)}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                  {activeTournament.name}
                </h2>
                <p className="text-gray-400 text-sm">
                  {activeTournament.location}, {activeTournament.country} | {formatDateRange(activeTournament.start_date, activeTournament.end_date)}
                </p>
              </div>
              <div className="flex gap-3 self-start">
                <Link
                  href={`/tournaments/${activeTournament.id}`}
                  className="px-5 py-2.5 bg-[#4ABED9] text-white text-sm font-bold rounded-lg hover:bg-[#3ba8c2] transition-colors"
                >
                  View Draws
                </Link>
                <Link
                  href="/scores"
                  className="px-5 py-2.5 bg-white/10 text-white text-sm font-bold rounded-lg hover:bg-white/20 transition-colors"
                >
                  View Schedule
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Section 5: Recent Results */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F1F2E]">Recent Results</h2>
            <Link href="/scores" className="text-sm font-semibold text-[#4ABED9] hover:text-[#0F1F2E] transition-colors">
              View All Results
            </Link>
          </div>
          {recentMatches.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {recentMatches.map((match) => (
                <MatchCard key={match.id} match={match} tournamentName={getTournamentName(match)} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No recent results available.</p>
          )}
        </div>
      </section>

      {/* Section 6: Business/Featured Articles */}
      {businessArticles.length > 0 && (
        <section className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F1F2E]">Business of Padel</h2>
              <Link href="/business" className="text-sm font-semibold text-[#4ABED9] hover:text-[#0F1F2E] transition-colors">
                Explore Business of Padel
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {businessArticles.map((article) => (
                <NewsCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section 7: Newsletter CTA (bottom) */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="bg-gradient-to-r from-[#4ABED9] to-[#3CB371] rounded-2xl px-6 py-10 sm:px-10 sm:py-12 text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3">
              Never Miss a Match
            </h2>
            <p className="text-white/80 text-sm sm:text-base mb-6 max-w-md mx-auto">
              The Padel Brief -- scores, rankings, and news delivered to your inbox. Free.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 outline-none focus:border-white focus:ring-2 focus:ring-white/20 transition-all text-sm"
              />
              <button
                type="button"
                className="px-6 py-3 bg-[#0F1F2E] hover:bg-[#1a2f42] text-white font-bold rounded-xl transition-colors text-sm whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
