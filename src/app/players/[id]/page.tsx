import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import MatchCard from "@/components/MatchCard";
import {
  getPlayer,
  getPlayerMatches,
  getSeasonTournaments,
  countryFlag,
  type Match,
  type Tournament,
} from "@/lib/padel-api";

export async function generateMetadata({ params }: { params: { id: string } }) {
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

async function fetchPlayerData(id: number) {
  try {
    const [player, matchesRes, s5Res, s6Res] = await Promise.all([
      getPlayer(id),
      getPlayerMatches(id, {
        per_page: "10",
        sort_by: "played_at",
        order_by: "desc",
      }),
      getSeasonTournaments(5, { per_page: "50" }).catch(() => ({ data: [] as Tournament[] })),
      getSeasonTournaments(6, { per_page: "50" }).catch(() => ({ data: [] as Tournament[] })),
    ]);

    const tournamentNameMap = new Map<number, string>();
    for (const t of [...s5Res.data, ...s6Res.data]) {
      tournamentNameMap.set(t.id, t.name);
    }

    return { player, matches: matchesRes.data, tournamentNameMap };
  } catch {
    return null;
  }
}

function StatItem({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div
      style={{
        padding: "16px 20px",
        border: "1px solid var(--ink)",
        background: "var(--paper)",
      }}
    >
      <div
        style={{
          fontFamily: "var(--mono)",
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--mute)",
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div
        className="score-mono"
        style={{ fontSize: 22, color: "var(--ink)" }}
      >
        {value}
      </div>
    </div>
  );
}

export default async function PlayerPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  if (isNaN(id)) notFound();

  const data = await fetchPlayerData(id);
  if (!data) notFound();

  const { player, matches, tournamentNameMap } = data;
  const flag = countryFlag(player.nationality);

  function getTournamentName(match: Match): string | undefined {
    const path = match.connections?.tournament;
    if (!path) return undefined;
    const id = parseInt(path.split("/").pop() || "0");
    return tournamentNameMap.get(id);
  }

  const finishedMatches = matches.filter(
    (m: Match) =>
      m.status === "finished" &&
      m.players.team_1.length > 0 &&
      m.players.team_2.length > 0
  );

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

  return (
    <main style={{ background: "var(--paper)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      {/* Header band */}
      <section style={{ borderBottom: "1px solid var(--ink)" }}>
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <Link
            href="/players"
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
            ← Players
          </Link>

          <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-start">
            {player.photo_url ? (
              <Image
                src={player.photo_url}
                alt={player.name}
                width={180}
                height={180}
                className="w-32 h-32 sm:w-44 sm:h-44 object-cover shrink-0"
                style={{
                  border: "1px solid var(--ink)",
                  background: "var(--paper-2)",
                }}
              />
            ) : (
              <div
                className="w-32 h-32 sm:w-44 sm:h-44 flex items-center justify-center shrink-0"
                style={{
                  border: "1px solid var(--ink)",
                  background: "var(--paper-2)",
                  fontFamily: "var(--mono)",
                  fontSize: 32,
                  fontWeight: 700,
                  color: "var(--mute)",
                }}
              >
                {player.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div
                className="eyebrow"
                style={{
                  color: "var(--red)",
                  marginBottom: 12,
                }}
              >
                ■ {player.category === "women" ? "Women" : "Men"} · Professional
              </div>
              <h1
                className="display"
                style={{ fontSize: "clamp(36px, 5.5vw, 72px)", marginBottom: 12 }}
              >
                {player.name}
              </h1>
              <p
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 13,
                  letterSpacing: "0.08em",
                  color: "var(--mute)",
                  marginBottom: 24,
                }}
              >
                {flag} {player.nationality}
                {player.birthplace && ` · ${player.birthplace}`}
              </p>
              <div className="flex flex-wrap gap-8">
                <div>
                  <div
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "var(--mute)",
                      marginBottom: 4,
                    }}
                  >
                    Ranking
                  </div>
                  <div
                    className="score-mono"
                    style={{
                      fontSize: 42,
                      color: "var(--red)",
                      lineHeight: 1,
                    }}
                  >
                    #{player.ranking}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "var(--mute)",
                      marginBottom: 4,
                    }}
                  >
                    Points
                  </div>
                  <div
                    className="score-mono"
                    style={{
                      fontSize: 42,
                      color: "var(--ink)",
                      lineHeight: 1,
                    }}
                  >
                    {player.points?.toLocaleString() ?? "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          <StatItem label="Age" value={player.age ? String(player.age) : null} />
          <StatItem label="Height" value={player.height ? `${player.height} cm` : null} />
          <StatItem
            label="Playing Side"
            value={
              player.side
                ? player.side.charAt(0).toUpperCase() + player.side.slice(1)
                : null
            }
          />
          <StatItem
            label="Hand"
            value={
              player.hand
                ? player.hand.charAt(0).toUpperCase() + player.hand.slice(1)
                : null
            }
          />
        </div>

        {/* Recent matches */}
        <section>
          <div className="eyebrow" style={{ color: "var(--red)", marginBottom: 12 }}>
            ■ Form
          </div>
          <h2
            className="display"
            style={{ fontSize: "clamp(28px, 3.5vw, 44px)", marginBottom: 28 }}
          >
            Recent <span className="italic-serif">matches</span>.
          </h2>
          {finishedMatches.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {finishedMatches.slice(0, 8).map((match: Match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  tournamentName={getTournamentName(match)}
                />
              ))}
            </div>
          ) : (
            <div
              style={{
                padding: "40px 24px",
                border: "1px solid var(--ink)",
                textAlign: "center",
                fontFamily: "var(--mono)",
                fontSize: 12,
                letterSpacing: "0.08em",
                color: "var(--mute)",
              }}
            >
              No recent match results available.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
