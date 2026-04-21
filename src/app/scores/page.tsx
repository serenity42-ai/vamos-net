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

  const chipStyle = (active: boolean) => ({
    padding: "8px 14px",
    fontFamily: "var(--mono)",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
    border: `1px solid ${active ? "var(--red)" : "var(--ink)"}`,
    background: active ? "var(--red)" : "transparent",
    color: active ? "#fff" : "var(--ink)",
    whiteSpace: "nowrap" as const,
  });

  return (
    <main style={{ background: "var(--paper)" }}>
      {/* Page header band */}
      <section style={{ borderBottom: "1px solid var(--ink)" }}>
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="eyebrow" style={{ color: "var(--red)", marginBottom: 12 }}>
            ■ Live feed
          </div>
          <h1 className="display" style={{ marginBottom: 12 }}>
            The <span className="italic-serif">scoreboard</span>.
          </h1>
          <p style={{ fontFamily: "var(--sans)", fontSize: 16, color: "var(--ink-soft)" }}>
            Live, results, and upcoming matches across every tour.
          </p>
        </div>
      </section>

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Date navigation */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: "12px 16px",
            border: "1px solid var(--ink)",
            background: "var(--paper-2)",
            marginBottom: 20,
          }}
        >
          <Link
            href={buildUrl({ date: prevDateStr, category: categoryFilter, tournament: tournamentFilter })}
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--mute)",
            }}
            className="hover:text-[var(--red)] transition-colors"
          >
            ← {formatDateDisplay(prevDateStr)}
          </Link>
          <span
            style={{
              fontFamily: "var(--sans)",
              fontWeight: 800,
              fontSize: 16,
              letterSpacing: "-0.02em",
              color: "var(--ink)",
            }}
          >
            {formatDateDisplay(selectedDate)}
            {isToday && (
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  color: "var(--red)",
                  marginLeft: 10,
                  padding: "3px 7px",
                  background: "rgba(193,68,58,0.1)",
                }}
              >
                TODAY
              </span>
            )}
          </span>
          <Link
            href={buildUrl({ date: nextDateStr, category: categoryFilter, tournament: tournamentFilter })}
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--mute)",
            }}
            className="hover:text-[var(--red)] transition-colors"
          >
            {formatDateDisplay(nextDateStr)} →
          </Link>
        </div>

        {/* Men / Women tabs */}
        <div className="flex items-center gap-2 mb-4">
          <span
            className="eyebrow shrink-0"
            style={{ color: "var(--mute)", paddingRight: 14, borderRight: "1px solid var(--ink)" }}
          >
            ■ Division
          </span>
          <Link href={buildUrl({ date: selectedDate, tournament: tournamentFilter })} style={chipStyle(!categoryFilter)}>
            All
          </Link>
          <Link
            href={buildUrl({ date: selectedDate, category: "men", tournament: tournamentFilter })}
            style={chipStyle(categoryFilter === "men")}
          >
            Men
          </Link>
          <Link
            href={buildUrl({ date: selectedDate, category: "women", tournament: tournamentFilter })}
            style={chipStyle(categoryFilter === "women")}
          >
            Women
          </Link>
        </div>

        {/* Tournament filter */}
        <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto mb-8">
          <div className="flex gap-2">
            <span
              className="eyebrow shrink-0"
              style={{
                color: "var(--mute)",
                paddingRight: 14,
                borderRight: "1px solid var(--ink)",
                display: "flex",
                alignItems: "center",
              }}
            >
              ■ Tournament
            </span>
            <Link
              href={buildUrl({ date: selectedDate, category: categoryFilter })}
              style={{ ...chipStyle(!tournamentFilter || tournamentFilter === "all"), flexShrink: 0 }}
            >
              All
            </Link>
            {activeTournaments.map((t) => (
              <Link
                key={t.id}
                href={buildUrl({ date: selectedDate, category: categoryFilter, tournament: String(t.id) })}
                style={{ ...chipStyle(tournamentFilter === String(t.id)), flexShrink: 0 }}
              >
                {t.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Grouped matches */}
        {tournamentGroups.length > 0 ? (
          <div className="space-y-10">
            {tournamentGroups.map((group) => (
              <div key={group.tournamentId} style={{ border: "1px solid var(--ink)", background: "var(--paper)" }}>
                {/* Tournament header */}
                <div
                  className="flex items-center gap-3"
                  style={{
                    padding: "12px 16px",
                    background: "var(--ink)",
                    color: "var(--paper)",
                  }}
                >
                  {group.tournament?.status === "live" && (
                    <span className="badge-live">LIVE</span>
                  )}
                  <h3
                    style={{
                      fontFamily: "var(--sans)",
                      fontSize: 15,
                      fontWeight: 800,
                      letterSpacing: "-0.01em",
                      color: "var(--paper)",
                    }}
                  >
                    {group.tournament?.name || "Unknown Tournament"}
                  </h3>
                  {group.tournament && (
                    <span
                      className="ml-auto"
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 11,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "rgba(243,238,228,0.6)",
                      }}
                    >
                      {group.tournament.location}, {group.tournament.country}
                    </span>
                  )}
                </div>

                {/* Rounds */}
                {group.rounds.map((round) => (
                  <div key={round.roundName}>
                    <div
                      style={{
                        padding: "10px 16px",
                        borderTop: "1px solid var(--ink)",
                        borderBottom: "1px solid rgba(0,0,0,0.1)",
                        background: "var(--paper-2)",
                      }}
                    >
                      <span
                        className="eyebrow"
                        style={{ color: "var(--red)", fontSize: 10 }}
                      >
                        ■ {round.roundName}
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
          <div
            className="text-center"
            style={{
              padding: "80px 24px",
              border: "1px solid var(--ink)",
              background: "var(--paper)",
              fontFamily: "var(--mono)",
              fontSize: 13,
              letterSpacing: "0.08em",
              color: "var(--mute)",
            }}
          >
            No matches found. Try a different filter.
          </div>
        )}
      </div>
    </main>
  );
}
