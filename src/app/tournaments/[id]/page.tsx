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
      description: `${tournament.name} - ${tournament.location}, ${tournament.country}. ${levelLabel(tournament.level)} tournament results, draws, and schedule.`,
    };
  } catch {
    return { title: "Tournament Not Found | VAMOS" };
  }
}

function levelColor(level: string): string {
  const colors: Record<string, string> = {
    finals: "bg-yellow-50 text-yellow-700",
    major: "bg-purple-50 text-purple-700",
    p1: "bg-blue-50 text-blue-700",
    p2: "bg-cyan-50 text-cyan-700",
  };
  return colors[level] || "bg-gray-50 text-gray-700";
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
    (m) => m.status !== "bye" && m.status !== "cancelled" &&
    (m.players.team_1.length > 0 || m.players.team_2.length > 0)
  );

  const menMatches = filtered.filter((m) => m.category === "men");
  const womenMatches = filtered.filter((m) => m.category === "women");

  // Group by round
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
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <Link
        href="/tournaments"
        className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-[#4ABED9] transition-colors mb-6"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Tournaments
      </Link>

      {/* Tournament Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${levelColor(tournament.level)}`}>
            {levelLabel(tournament.level)}
          </span>
          {tournament.status === "live" && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-600">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Live
            </span>
          )}
          {tournament.status === "finished" && (
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Finished</span>
          )}
          {tournament.status === "pending" && (
            <span className="text-xs font-semibold uppercase tracking-wider text-[#3CB371]">Upcoming</span>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0F1F2E] mb-2">{tournament.name}</h1>
        <p className="text-sm sm:text-base text-gray-500">
          {tournament.location}, {tournament.country} | {formatDateRange(tournament.start_date, tournament.end_date)}
        </p>
      </div>

      {/* Men's Draws */}
      {menRounds.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-[#0F1F2E] mb-4">Men&apos;s Draw</h2>
          <div className="space-y-4">
            {menRounds.map(([roundName, roundMatches]) => (
              <div key={roundName}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{roundName}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
        <section className="mb-8">
          <h2 className="text-lg font-bold text-[#0F1F2E] mb-4">Women&apos;s Draw</h2>
          <div className="space-y-4">
            {womenRounds.map(([roundName, roundMatches]) => (
              <div key={roundName}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{roundName}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
        <div className="text-center py-12 text-gray-400">
          <p>No match data available for this tournament yet.</p>
        </div>
      )}
    </main>
  );
}
