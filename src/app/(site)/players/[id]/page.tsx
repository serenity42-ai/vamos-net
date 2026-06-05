import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import MatchCard from "@/components/v3/MatchCard";
import MatchCardDesktop from "@/components/v3/MatchCardDesktop";
import Cell from "@/components/v3/Cell";
import {
  getPlayer,
  getPlayerMatches,
  getSeasonTournaments,
  countryFlag,
  type Match,
  type MatchPlayer,
  type Tournament,
} from "@/lib/padel-api";
import { getActiveSeasonIds } from "@/lib/seasons";

// Player profile: form table can update mid-day; 10 min
export const revalidate = 600;

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}) {
  try {
    const player = await getPlayer(parseInt(params.id));
    return {
      title: `${player.name} | VAMOS`,
      description: `${player.name} — Ranking #${player.ranking}, ${player.nationality}. Professional padel player profile, stats, and recent matches.`,
    };
  } catch {
    return { title: "Player Not Found | VAMOS" };
  }
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

async function fetchPlayerData(id: number) {
  try {
    const seasonIds = await getActiveSeasonIds();
    const [player, matchesRes, ...seasonResults] = await Promise.all([
      getPlayer(id),
      getPlayerMatches(id, {
        per_page: "20",
        sort_by: "played_at",
        order_by: "desc",
      }),
      ...seasonIds.map((sid) =>
        getSeasonTournaments(sid, { per_page: "50" }).catch(() => ({
          data: [] as Tournament[],
        })),
      ),
    ]);

    const tournamentNameMap = new Map<number, string>();
    for (const res of seasonResults) {
      for (const t of res.data) tournamentNameMap.set(t.id, t.name);
    }

    return { player, matches: matchesRes.data, tournamentNameMap };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getTournamentName(
  match: Match,
  tournamentNameMap: Map<number, string>,
): string | undefined {
  const path = match.connections?.tournament;
  if (!path) return undefined;
  const id = parseInt(path.split("/").pop() || "0");
  return tournamentNameMap.get(id);
}

function StatBlock({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-16 border border-border-primary bg-bg-white p-16">
      <div className="font-sans text-10 font-semibold uppercase tracking-[0.08em] text-text-tertiary">
        {label}
      </div>
      <div
        className={[
          "mt-4 font-display text-24 font-bold tabular-nums",
          accent ? "text-brand" : "text-text-primary",
        ].join(" ")}
      >
        {value}
      </div>
    </div>
  );
}

/**
 * Look at recent finished matches and tally W/L plus aggregate "partners"
 * (anyone who lined up on the same team as this player).
 */
function summariseForm(matches: Match[], playerId: number) {
  let wins = 0;
  let losses = 0;
  const partnerCounts = new Map<number, { player: MatchPlayer; count: number }>();

  for (const m of matches) {
    // H4: trust winner > raw status. PadelAPI sometimes leaves status='live'
    // or 'scheduled' on already-decided matches (see MATCH-STATUS-ARCHITECTURE.md).
    // The presence of a winner is the most reliable 'finished' signal.
    if (!m.winner) continue;
    const inTeam1 = m.players.team_1.some((p) => p.id === playerId);
    const inTeam2 = m.players.team_2.some((p) => p.id === playerId);
    if (!inTeam1 && !inTeam2) continue;

    const won =
      (inTeam1 && m.winner === "team_1") ||
      (inTeam2 && m.winner === "team_2");
    if (won) wins += 1;
    else losses += 1;

    const myTeam = inTeam1 ? m.players.team_1 : m.players.team_2;
    for (const teammate of myTeam) {
      if (teammate.id === playerId) continue;
      const existing = partnerCounts.get(teammate.id);
      if (existing) existing.count += 1;
      else partnerCounts.set(teammate.id, { player: teammate, count: 1 });
    }
  }

  const partners = Array.from(partnerCounts.values()).sort(
    (a, b) => b.count - a.count,
  );
  const total = wins + losses;
  const winRate = total > 0 ? Math.round((wins / total) * 100) : null;
  return { wins, losses, winRate, partners };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function PlayerPage({
  params,
}: {
  params: { id: string };
}) {
  const id = parseInt(params.id);
  if (Number.isNaN(id)) notFound();

  const data = await fetchPlayerData(id);
  if (!data) notFound();

  const { player, matches, tournamentNameMap } = data;
  const flag = countryFlag(player.nationality);

  const finishedMatches = matches.filter(
    (m: Match) =>
      m.status === "finished" &&
      m.players.team_1.length > 0 &&
      m.players.team_2.length > 0,
  );
  const recentMatches = matches
    .filter(
      (m: Match) =>
        m.players.team_1.length > 0 && m.players.team_2.length > 0,
    )
    .slice(0, 8);

  const form = summariseForm(matches, player.id);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: player.name,
    url: `https://vamos.net/players/${player.id}`,
    image: player.photo_url || undefined,
    nationality: { "@type": "Country", name: player.nationality },
    birthDate: player.birthdate || undefined,
    birthPlace: player.birthplace || undefined,
    jobTitle: "Professional Padel Player",
    height: player.height ? `${player.height} cm` : undefined,
  };

  const hand =
    player.hand && player.hand.length > 0
      ? player.hand.charAt(0).toUpperCase() + player.hand.slice(1)
      : null;
  const side =
    player.side && player.side.length > 0
      ? player.side.charAt(0).toUpperCase() + player.side.slice(1)
      : null;

  return (
    <div className="bg-bg-page min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <div className="mx-auto max-w-[1320px] px-16 py-24 sm:px-24 sm:py-32 lg:px-32">
        {/* Back link */}
        <Link
          href="/players"
          className="mb-16 inline-flex items-center gap-4 font-sans text-12 font-semibold tracking-[0.04em] text-text-secondary transition-colors hover:text-text-primary"
        >
          ← All players
        </Link>

        {/* Hero */}
        <section className="rounded-24 border border-border-primary bg-bg-white p-20 sm:p-24 lg:p-32">
          <div className="flex flex-col items-start gap-20 sm:flex-row sm:items-center sm:gap-32">
            {player.photo_url ? (
              <Image
                src={player.photo_url}
                alt={player.name}
                width={180}
                height={180}
                className="h-[140px] w-[140px] shrink-0 rounded-24 border border-border-primary bg-bg-gray object-cover sm:h-[180px] sm:w-[180px]"
              />
            ) : (
              <div className="flex h-[140px] w-[140px] shrink-0 items-center justify-center rounded-24 border border-border-primary bg-bg-gray font-display text-40 font-bold text-text-secondary sm:h-[180px] sm:w-[180px]">
                {player.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="mb-8 font-sans text-12 font-semibold uppercase tracking-[0.06em] text-text-secondary">
                {player.category === "women" ? "Women" : "Men"} · Professional
              </div>
              <h1 className="text-text-primary text-mobile-display-l md:text-desktop-display-l">
                {player.name}
              </h1>
              <p className="mt-8 font-sans text-14 text-text-secondary">
                <span aria-hidden="true" className="mr-4 text-16">
                  {flag}
                </span>
                {player.nationality}
                {player.birthplace && ` · ${player.birthplace}`}
              </p>

              <div className="mt-16 flex flex-wrap gap-24">
                <div>
                  <div className="font-sans text-10 font-semibold uppercase tracking-[0.08em] text-text-tertiary">
                    Ranking
                  </div>
                  <div className="font-display text-40 font-bold leading-none text-brand">
                    #{player.ranking}
                  </div>
                </div>
                <div>
                  <div className="font-sans text-10 font-semibold uppercase tracking-[0.08em] text-text-tertiary">
                    Points
                  </div>
                  <div className="font-display text-40 font-bold leading-none text-text-primary">
                    {player.points?.toLocaleString() ?? "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Career stats */}
        <section className="mt-24">
          <h2 className="mb-12 font-display text-20 font-bold uppercase tracking-[0.02em] text-text-primary">
            Stats
          </h2>
          <div className="grid grid-cols-2 gap-12 sm:grid-cols-3 lg:grid-cols-6">
            {player.age != null && (
              <StatBlock label="Age" value={String(player.age)} />
            )}
            {player.height != null && (
              <StatBlock label="Height" value={`${player.height} cm`} />
            )}
            {side && <StatBlock label="Side" value={side} />}
            {hand && <StatBlock label="Hand" value={hand} />}
            <StatBlock label="Wins" value={String(form.wins)} />
            <StatBlock label="Losses" value={String(form.losses)} />
            {form.winRate != null && (
              <StatBlock
                label="Win rate"
                value={`${form.winRate}%`}
                accent={form.winRate >= 50}
              />
            )}
          </div>
        </section>

        {/* Recent matches */}
        <section className="mt-32">
          <h2 className="mb-12 font-display text-20 font-bold uppercase tracking-[0.02em] text-text-primary">
            Recent matches
          </h2>
          {recentMatches.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-8 md:hidden">
                {recentMatches.map((m: Match) => (
                  <MatchCard
                    key={m.id}
                    match={m}
                    tournamentName={getTournamentName(m, tournamentNameMap)}
                  />
                ))}
              </div>
              <div className="hidden flex-col gap-8 md:flex">
                {recentMatches.map((m: Match) => (
                  <MatchCardDesktop
                    key={m.id}
                    match={m}
                    tournamentName={getTournamentName(m, tournamentNameMap)}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-16 border border-border-primary bg-bg-white p-32 text-center">
              <p className="font-sans text-14 text-text-secondary">
                No recent match results available.
              </p>
            </div>
          )}
        </section>

        {/* Partnerships */}
        {form.partners.length > 0 && (
          <section className="mt-32">
            <h2 className="mb-12 font-display text-20 font-bold uppercase tracking-[0.02em] text-text-primary">
              Usual partners
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {form.partners.slice(0, 9).map(({ player: partner, count }) => (
                <Cell
                  key={partner.id}
                  title={partner.name}
                  subtitle={`${count} match${count === 1 ? "" : "es"} together`}
                  href={`/players/${partner.id}`}
                  chevron
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
