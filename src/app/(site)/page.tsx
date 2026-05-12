import Link from "next/link";
import Image from "next/image";
import MatchCard from "@/components/MatchCard";
import ScoresTicker from "@/components/ScoresTicker";
import RankingRow from "@/components/RankingRow";

// Revalidate the homepage every 30s so live scores show up without waiting
// the default ISR window. Individual API fetches still use their own shorter
// revalidate (15s for /live) inside padel-api.ts.
export const revalidate = 30;
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
  // Stage 1 — everything that doesn't depend on tournament IDs runs in one
  // parallel batch. The /live endpoint and the recent global /matches range
  // are pulled in this stage so we never wait for tournament metadata before
  // hitting them.
  const today = new Date();
  const threeDaysAgo = new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000);
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  const recentStr = threeDaysAgo.toISOString().split("T")[0];
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const [menRes, womenRes, s5Res, s6Res, recentMatchesRes, liveRes] =
    await Promise.allSettled([
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
      getMatches({
        after_date: recentStr,
        before_date: tomorrowStr,
        sort_by: "played_at",
        order_by: "desc",
        per_page: "50",
      }),
      getLiveMatches(),
    ]);

  const men: Player[] = menRes.status === "fulfilled" ? menRes.value.data : [];
  const women: Player[] =
    womenRes.status === "fulfilled" ? womenRes.value.data : [];
  const tournaments: Tournament[] = [
    ...(s5Res.status === "fulfilled" ? s5Res.value.data : []),
    ...(s6Res.status === "fulfilled" ? s6Res.value.data : []),
  ];
  const todayMatches: Match[] =
    recentMatchesRes.status === "fulfilled" ? recentMatchesRes.value.data : [];
  const liveData: LiveMatchData[] =
    liveRes.status === "fulfilled" ? liveRes.value.data : [];

  // Stage 2 — fan-out tournament-match fetches, but only for tournaments
  // that are actually relevant to the home page. The previous version hit
  // /tournaments/{id}/matches for every "live OR finished" tournament in
  // the season, which could be 50+ requests serialized against the
  // 60-req/min Pro tier (and was the dominant cost of the page).
  //
  // Relevant set now = live tournaments + finished tournaments whose
  // end_date is within the last 7 days. That keeps the recent-results
  // section accurate without paying for the long tail of completed events.
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const relevantTournaments = tournaments.filter((t) => {
    if (t.status === "live") return true;
    if (t.status === "finished" && t.end_date) {
      return new Date(t.end_date) >= sevenDaysAgo;
    }
    return false;
  });

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

  // Merge tournament-scoped + global recent matches, dedupe, sort.
  const seenIds = new Set(tournamentMatches.map((m) => m.id));
  const extraMatches = todayMatches.filter((m) => !seenIds.has(m.id));
  const matches = [...extraMatches, ...tournamentMatches].sort(
    (a, b) => new Date(b.played_at).getTime() - new Date(a.played_at).getTime()
  );

  // Normalize all matches through single pipeline (merges live scores,
  // derives status). /live data is already loaded from Stage 1.
  const ctx = buildContext(liveData);
  const normalized = normalizeMatches(matches, ctx);

  // Tournament name map for cross-referencing in match cards.
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
  // Kick off Ghost articles in parallel with the PadelAPI waterfall so the
  // CMS fetch doesn't add its latency on top of the data layer's. The two
  // sources are independent; awaiting them as a batch shaves a full
  // round-trip on every render.
  const [homeData, articles] = await Promise.all([
    fetchHomeData(),
    fetchArticles(),
  ]);
  const { men, women, matches, tournaments, tournamentNameMap } = homeData;

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

  // Strip rules — priority order:
  //   1. Live now → show live matches
  //   2. Recently finished (≤24h) → show last few results
  //   3. Scheduled within next 12h → show upcoming
  //   4. Otherwise → hide strip entirely
  const now = Date.now();
  const dayAgo = new Date(now - 24 * 60 * 60 * 1000);
  const twelveHoursAhead = new Date(now + 12 * 60 * 60 * 1000);

  const freshFinished = recentMatches.filter(
    (m) => new Date(m.played_at) >= dayAgo
  );

  const upcomingMatches = matches
    .filter(
      (m) =>
        m.displayStatus === "scheduled" &&
        m.players.team_1.length > 0 &&
        m.players.team_2.length > 0 &&
        new Date(m.played_at) > new Date(now) &&
        new Date(m.played_at) <= twelveHoursAhead
    )
    .sort(
      (a, b) => new Date(a.played_at).getTime() - new Date(b.played_at).getTime()
    );

  let tickerMatches: Match[];
  let tickerMode: "live" | "recent" | "upcoming";
  if (liveMatches.length > 0) {
    tickerMatches = liveMatches;
    tickerMode = "live";
  } else if (freshFinished.length > 0) {
    tickerMatches = freshFinished.slice(0, 4);
    tickerMode = "recent";
  } else if (upcomingMatches.length > 0) {
    tickerMatches = upcomingMatches.slice(0, 4);
    tickerMode = "upcoming";
  } else {
    tickerMatches = [];
    tickerMode = "live";
  }

  // Pick the top-tier tournament currently represented in the strip so the
  // viewer knows *what event* they're watching (e.g. Premier P1 over FIP Gold).
  // Lower number = higher prestige.
  const LEVEL_RANK: Record<string, number> = {
    finals: 0,
    major: 1,
    p1: 2,
    p2: 3,
    fip_platinum: 4,
    fip_gold: 5,
    fip_silver: 6,
    fip_bronze: 7,
    fip_rise: 8,
    fip_star: 9,
  };
  const tickerTournamentIds = new Set<number>();
  for (const m of tickerMatches) {
    const path = m.connections?.tournament;
    if (!path) continue;
    const id = parseInt(path.split("/").pop() || "0", 10);
    if (id) tickerTournamentIds.add(id);
  }
  const tickerTournament = tournaments
    .filter((t) => tickerTournamentIds.has(t.id))
    .sort(
      (a, b) =>
        (LEVEL_RANK[a.level] ?? 99) - (LEVEL_RANK[b.level] ?? 99)
    )[0];
  const tickerTournamentLabel = tickerTournament?.name;

  const activeTournament = tournaments.find((t) => t.status === "live") || tournaments.find((t) => t.status === "pending");

  const featuredArticle = articles[0];
  const latestNews = articles.slice(1, 5);
  const businessArticles = articles.filter((a) => a.category === "Business").slice(0, 3);

  return (
    <main>
      {/* Section 1: Live Scores Ticker */}
      {tickerMatches.length > 0 && (
        <section
          className="overflow-hidden"
          style={{ background: "var(--ink)", borderBottom: "1px solid var(--ink)" }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center">
              <div className="flex-1 overflow-x-auto scrollbar-hide">
                <ScoresTicker matches={tickerMatches} tournamentLabel={tickerTournamentLabel} mode={tickerMode} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Section 2: Hero — Editorial featured story + sidebar */}
      <section style={{ background: "var(--paper)", borderBottom: "1px solid var(--ink)" }}>
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Featured article — spans 8 of 12 */}
            <div className="lg:col-span-8">
              {featuredArticle && (
                <Link href={`/news/${featuredArticle.slug}`} className="group block">
                  <div
                    className="aspect-[16/9] overflow-hidden relative mb-6"
                    style={{ border: "1px solid var(--ink)", background: "var(--paper-2)" }}
                  >
                    {featuredArticle.imageUrl && (
                      <img
                        src={featuredArticle.imageUrl}
                        alt={featuredArticle.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-3 mb-4" style={{ fontFamily: "var(--mono)", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                    <span style={{ color: "var(--red)" }}>■ Cover story</span>
                    <span style={{ color: "var(--mute)" }}>{featuredArticle.category}</span>
                    <span style={{ color: "var(--mute)" }}>· {featuredArticle.date}</span>
                  </div>
                  <h1
                    className="display transition-opacity group-hover:opacity-80"
                    style={{ marginBottom: 20 }}
                  >
                    {featuredArticle.title}
                  </h1>
                  <p
                    className="line-clamp-2"
                    style={{ fontFamily: "var(--sans)", fontSize: 17, lineHeight: 1.55, color: "var(--ink-soft)", maxWidth: 640 }}
                  >
                    {featuredArticle.excerpt}
                  </p>
                  <div className="mt-4" style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--mute)" }}>
                    By {featuredArticle.author}
                  </div>
                </Link>
              )}
            </div>

            {/* Sidebar — spans 4 of 12 */}
            <div className="lg:col-span-4 space-y-8">
              {/* Newsletter signup */}
              <div style={{ background: "var(--ink)", color: "var(--paper)", padding: 24 }}>
                <div className="eyebrow" style={{ color: "var(--red)", marginBottom: 8 }}>■ Newsletter</div>
                <h3 style={{ fontFamily: "var(--sans)", fontWeight: 900, fontStyle: "italic", fontSize: 28, lineHeight: 1, letterSpacing: "-0.02em", marginBottom: 10 }}>
                  The Padel <span className="italic-serif">Brief</span>
                </h3>
                <p style={{ fontSize: 13, lineHeight: 1.5, color: "rgba(255,255,255,0.7)", marginBottom: 16 }}>
                  Weekly. Rankings, recaps, one gear recommendation. No fluff.
                </p>
                <form className="space-y-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      background: "transparent",
                      border: "1px solid rgba(255,255,255,0.3)",
                      color: "var(--paper)",
                      fontFamily: "var(--mono)",
                      fontSize: 13,
                      outline: "none",
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    Subscribe →
                  </button>
                </form>
              </div>

              {/* Top 5 Men scoreboard widget */}
              <div style={{ border: "1px solid var(--ink)", background: "var(--paper)" }}>
                <div
                  className="flex items-center justify-between"
                  style={{ padding: "12px 16px", borderBottom: "1px solid var(--ink)", background: "var(--ink)", color: "var(--paper)" }}
                >
                  <span style={{ fontFamily: "var(--mono)", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                    Men’s Top 5
                  </span>
                  <Link
                    href="/rankings"
                    style={{ fontFamily: "var(--mono)", fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--paper)", opacity: 0.7 }}
                  >
                    Full →
                  </Link>
                </div>
                <table className="w-full">
                  <tbody>
                    {topMen.map((p, i) => (
                      <tr key={p.id} style={{ borderBottom: i < topMen.length - 1 ? "1px solid rgba(0,0,0,0.08)" : "none" }}>
                        <td style={{ padding: "10px 12px", width: 40, textAlign: "center" }}>
                          <span className="score-mono" style={{ fontSize: 14, color: "var(--red)" }}>
                            {p.ranking}
                          </span>
                        </td>
                        <td style={{ padding: "10px 8px" }}>
                          <Link href={`/players/${p.id}`} className="flex items-center gap-2 group">
                            {p.photo_url ? (
                              <Image src={p.photo_url} alt={p.name} width={24} height={24} className="w-6 h-6 rounded-full object-cover" style={{ background: "var(--paper-2)" }} />
                            ) : (
                              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "var(--paper-2)", fontFamily: "var(--mono)", fontSize: 9, fontWeight: 700, color: "var(--mute)" }}>
                                {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                              </div>
                            )}
                            <span style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 700, color: "var(--ink)" }} className="truncate">
                              {countryFlag(p.nationality)} {p.name}
                            </span>
                          </Link>
                        </td>
                        <td style={{ padding: "10px 12px", textAlign: "right" }}>
                          <span className="score-mono" style={{ fontSize: 12, color: "var(--ink-soft)" }}>
                            {p.points?.toLocaleString() ?? "—"}
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

      {/* Section 3: Latest News — editorial grid */}
      <section style={{ background: "var(--paper-2)", borderBottom: "1px solid var(--ink)" }}>
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="flex items-baseline justify-between mb-10">
            <div>
              <div className="eyebrow" style={{ color: "var(--red)", marginBottom: 8 }}>■ Section 02</div>
              <h2 className="display" style={{ fontSize: "clamp(32px, 4.5vw, 56px)" }}>
                The <span className="italic-serif">latest</span>.
              </h2>
            </div>
            <Link
              href="/news"
              style={{ fontFamily: "var(--mono)", fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink)" }}
              className="hover:text-[var(--red)] transition-colors hidden sm:inline"
            >
              All news →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {latestNews.map((article) => (
              <NewsCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Active tournament — ink band */}
      {activeTournament && (
        <section style={{ background: "var(--ink)", color: "var(--paper)" }}>
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
              <div>
                <div
                  className="flex items-center gap-3 mb-4 flex-wrap"
                  style={{ fontFamily: "var(--mono)", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}
                >
                  {activeTournament.status === "live" && (
                    <span className="badge-live">Live Now</span>
                  )}
                  {activeTournament.status === "pending" && (
                    <span style={{ color: "var(--lime)" }}>■ Upcoming</span>
                  )}
                  <span style={{ color: "var(--red)" }}>{levelLabel(activeTournament.level)}</span>
                </div>
                <h2
                  className="display"
                  style={{ fontSize: "clamp(28px, 4.5vw, 56px)", color: "var(--paper)", marginBottom: 10 }}
                >
                  {activeTournament.name}
                </h2>
                <p style={{ fontFamily: "var(--mono)", fontSize: 13, letterSpacing: "0.08em", color: "rgba(243,238,228,0.65)" }}>
                  {activeTournament.location}, {activeTournament.country} · {formatDateRange(activeTournament.start_date, activeTournament.end_date)}
                </p>
              </div>
              <div className="flex gap-3 self-start sm:self-end">
                <Link href={`/tournaments/${activeTournament.id}`} className="btn btn-primary">
                  View draws →
                </Link>
                <Link
                  href="/scores"
                  className="btn"
                  style={{ borderColor: "var(--paper)", color: "var(--paper)" }}
                >
                  Schedule
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Section 5: Recent results */}
      <section style={{ background: "var(--paper)", borderBottom: "1px solid var(--ink)" }}>
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="flex items-baseline justify-between mb-10">
            <div>
              <div className="eyebrow" style={{ color: "var(--red)", marginBottom: 8 }}>■ Section 03 · Scoreboard</div>
              <h2 className="display" style={{ fontSize: "clamp(32px, 4.5vw, 56px)" }}>
                Recent <span className="italic-serif">results</span>.
              </h2>
            </div>
            <Link
              href="/scores"
              style={{ fontFamily: "var(--mono)", fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink)" }}
              className="hover:text-[var(--red)] transition-colors hidden sm:inline"
            >
              All results →
            </Link>
          </div>
          {recentMatches.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {recentMatches.map((match) => (
                <MatchCard key={match.id} match={match} tournamentName={getTournamentName(match)} />
              ))}
            </div>
          ) : (
            <p style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--mute)" }}>
              No recent results available.
            </p>
          )}
        </div>
      </section>

      {/* Section 6: Business of Padel */}
      {businessArticles.length > 0 && (
        <section style={{ background: "var(--paper-2)", borderBottom: "1px solid var(--ink)" }}>
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
            <div className="flex items-baseline justify-between mb-10">
              <div>
                <div className="eyebrow" style={{ color: "var(--clay)", marginBottom: 8 }}>■ Section 04</div>
                <h2 className="display" style={{ fontSize: "clamp(32px, 4.5vw, 56px)" }}>
                  The <span className="italic-serif">business</span> of padel.
                </h2>
              </div>
              <Link
                href="/hub/business"
                style={{ fontFamily: "var(--mono)", fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink)" }}
                className="hover:text-[var(--red)] transition-colors hidden sm:inline"
              >
                Explore →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {businessArticles.map((article) => (
                <NewsCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section 7: Newsletter CTA (bottom, editorial) */}
      <section style={{ background: "var(--ink)", color: "var(--paper)" }}>
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end">
            <div className="lg:col-span-7">
              <div className="eyebrow" style={{ color: "var(--red)", marginBottom: 12 }}>
                ■ The padel brief
              </div>
              <h2 className="display" style={{ color: "var(--paper)" }}>
                Never miss a <span className="italic-serif">match</span>.
              </h2>
              <p
                className="mt-6"
                style={{ fontFamily: "var(--sans)", fontSize: 17, lineHeight: 1.5, color: "rgba(243,238,228,0.7)", maxWidth: 560 }}
              >
                Weekly. Recaps, rankings, one gear recommendation. Delivered to your inbox. Free.
              </p>
            </div>
            <div className="lg:col-span-5">
              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="your@email.com"
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    background: "transparent",
                    border: "1px solid rgba(243,238,228,0.3)",
                    color: "var(--paper)",
                    fontFamily: "var(--mono)",
                    fontSize: 14,
                    outline: "none",
                  }}
                />
                <button type="button" className="btn btn-primary">
                  Subscribe →
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
