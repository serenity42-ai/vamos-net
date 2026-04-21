import Link from "next/link";
import { notFound } from "next/navigation";
import MatchCard from "@/components/MatchCard";
import {
  getTournament,
  getTournamentMatches,
  levelLabel,
  type Tournament,
  type Match,
} from "@/lib/padel-api";

export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const tournament = await getTournament(parseInt(params.id));
    return {
      title: `${tournament.name} | VAMOS`,
      description: `${tournament.name} — ${tournament.location}, ${tournament.country}. ${levelLabel(tournament.level)} tournament results, draws, and schedule.`,
    };
  } catch {
    return { title: "Tournament Not Found | VAMOS" };
  }
}

function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  if (s.getMonth() === e.getMonth()) {
    return `${s.getDate()}–${e.getDate()} ${months[s.getMonth()]} ${s.getFullYear()}`;
  }
  return `${s.getDate()} ${months[s.getMonth()]} – ${e.getDate()} ${months[e.getMonth()]} ${s.getFullYear()}`;
}

export default async function TournamentDetailPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  if (isNaN(id)) notFound();

  let tournament: Tournament;
  let matches: Match[] = [];

  try {
    tournament = await getTournament(id);
    const matchesRes = await getTournamentMatches(id, {
      per_page: "100",
      sort_by: "played_at",
      order_by: "desc",
    });
    matches = matchesRes.data;
  } catch {
    notFound();
  }

  const filtered = matches.filter(
    (m) =>
      m.status !== "bye" &&
      m.status !== "cancelled" &&
      (m.players.team_1.length > 0 || m.players.team_2.length > 0)
  );

  const menMatches = filtered.filter((m) => m.category === "men");
  const womenMatches = filtered.filter((m) => m.category === "women");

  function groupByRound(matchList: Match[]) {
    const groups = new Map<string, Match[]>();
    for (const m of matchList) {
      const key = m.round_name || `Round ${m.round}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(m);
    }
    return Array.from(groups.entries()).sort((a, b) => {
      const aRound = a[1][0]?.round ?? 99;
      const bRound = b[1][0]?.round ?? 99;
      return aRound - bRound;
    });
  }

  const menRounds = groupByRound(menMatches);
  const womenRounds = groupByRound(womenMatches);

  return (
    <main style={{ background: "var(--paper)" }}>
      {/* Header band */}
      <section style={{ borderBottom: "1px solid var(--ink)" }}>
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <Link
            href="/tournaments"
            className="inline-flex items-center gap-2 mb-8 transition-colors"
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--mute)",
            }}
          >
            ← Tournaments
          </Link>

          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                padding: "4px 10px",
                border: "1px solid var(--ink)",
                color: "var(--ink)",
              }}
            >
              {levelLabel(tournament.level)}
            </span>
            {tournament.status === "live" && <span className="badge-live">LIVE</span>}
            {tournament.status === "finished" && (
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--mute)",
                }}
              >
                Finished
              </span>
            )}
            {tournament.status === "pending" && (
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--red)",
                }}
              >
                ■ Upcoming
              </span>
            )}
          </div>
          <h1 className="display" style={{ marginBottom: 12 }}>
            {tournament.name}
          </h1>
          <p
            style={{
              fontFamily: "var(--mono)",
              fontSize: 13,
              letterSpacing: "0.08em",
              color: "var(--mute)",
            }}
          >
            {tournament.location}, {tournament.country} ·{" "}
            {formatDateRange(tournament.start_date, tournament.end_date)}
          </p>
        </div>
      </section>

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Men's Draws */}
        {menRounds.length > 0 && (
          <section className="mb-14">
            <div className="flex items-baseline gap-4 mb-6 pb-3" style={{ borderBottom: "1px solid var(--ink)" }}>
              <h2 className="display" style={{ fontSize: 32 }}>
                Men&rsquo;s <span className="italic-serif">draw</span>.
              </h2>
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--mute)",
                }}
              >
                · {menMatches.length} matches
              </span>
            </div>
            <div className="space-y-8">
              {menRounds.map(([roundName, roundMatches]) => (
                <div key={roundName}>
                  <div className="eyebrow" style={{ color: "var(--red)", marginBottom: 12 }}>
                    ■ {roundName}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {roundMatches.map((match) => (
                      <MatchCard key={match.id} match={match} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Women's Draws */}
        {womenRounds.length > 0 && (
          <section className="mb-14">
            <div className="flex items-baseline gap-4 mb-6 pb-3" style={{ borderBottom: "1px solid var(--ink)" }}>
              <h2 className="display" style={{ fontSize: 32 }}>
                Women&rsquo;s <span className="italic-serif">draw</span>.
              </h2>
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--mute)",
                }}
              >
                · {womenMatches.length} matches
              </span>
            </div>
            <div className="space-y-8">
              {womenRounds.map(([roundName, roundMatches]) => (
                <div key={roundName}>
                  <div className="eyebrow" style={{ color: "var(--red)", marginBottom: 12 }}>
                    ■ {roundName}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {roundMatches.map((match) => (
                      <MatchCard key={match.id} match={match} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {filtered.length === 0 && (
          <div
            style={{
              padding: "60px 24px",
              border: "1px solid var(--ink)",
              textAlign: "center",
              fontFamily: "var(--mono)",
              fontSize: 12,
              letterSpacing: "0.08em",
              color: "var(--mute)",
            }}
          >
            No match data available for this tournament yet.
          </div>
        )}
      </div>
    </main>
  );
}
