import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import MatchCard from "@/components/MatchCard";
import {
  getPlayer,
  getPlayerMatches,
  countryFlag,
  type Player,
  type Match,
} from "@/lib/padel-api";

export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const player = await getPlayer(parseInt(params.id));
    return {
      title: `${player.name} | VAMOS`,
      description: `${player.name} - Ranking #${player.ranking}, ${player.nationality}. Professional padel player profile, stats, and recent matches.`,
    };
  } catch {
    return { title: "Player Not Found | VAMOS" };
  }
}

async function fetchPlayerData(id: number) {
  try {
    const [player, matchesRes] = await Promise.all([
      getPlayer(id),
      getPlayerMatches(id, {
        per_page: "10",
        sort_by: "played_at",
        order_by: "desc",
      }),
    ]);
    return { player, matches: matchesRes.data };
  } catch {
    return null;
  }
}

function StatItem({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
      <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">{label}</div>
      <div className="text-sm sm:text-base font-bold text-[#0F1F2E]">{value}</div>
    </div>
  );
}

export default async function PlayerPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  if (isNaN(id)) notFound();

  const data = await fetchPlayerData(id);
  if (!data) notFound();

  const { player, matches } = data;
  const flag = countryFlag(player.nationality);

  const finishedMatches = matches.filter(
    (m: Match) => m.status === "finished" && m.players.team_1.length > 0 && m.players.team_2.length > 0
  );

  // Schema.org Person
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: player.name,
    url: `https://vamos.net/players/${player.id}`,
    image: player.photo_url || undefined,
    nationality: {
      "@type": "Country",
      name: player.nationality,
    },
    birthDate: player.birthdate || undefined,
    birthPlace: player.birthplace || undefined,
    jobTitle: "Professional Padel Player",
    height: player.height ? `${player.height} cm` : undefined,
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      {/* Back link */}
      <Link
        href="/players"
        className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-[#4ABED9] transition-colors mb-6"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Players
      </Link>

      {/* Player header */}
      <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 mb-8">
        {player.photo_url ? (
          <Image
            src={player.photo_url}
            alt={player.name}
            width={160}
            height={160}
            className="w-28 h-28 sm:w-40 sm:h-40 rounded-xl object-cover bg-gray-100 shrink-0"
          />
        ) : (
          <div className="w-28 h-28 sm:w-40 sm:h-40 rounded-xl bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-300 shrink-0">
            {player.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
              player.category === "women" ? "bg-pink-50 text-pink-600" : "bg-blue-50 text-blue-600"
            }`}>
              {player.category}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F1F2E] mb-2">{player.name}</h1>
          <p className="text-base sm:text-lg text-gray-500 mb-4">
            {flag} {player.nationality}
            {player.birthplace && ` | ${player.birthplace}`}
          </p>
          <div className="flex flex-wrap gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">Ranking</div>
              <div className="text-xl sm:text-2xl font-bold text-[#4ABED9]">#{player.ranking}</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">Points</div>
              <div className="text-xl sm:text-2xl font-bold text-[#0F1F2E]">{player.points?.toLocaleString() ?? "-"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatItem label="Age" value={player.age ? String(player.age) : null} />
        <StatItem label="Height" value={player.height ? `${player.height} cm` : null} />
        <StatItem label="Playing Side" value={player.side ? player.side.charAt(0).toUpperCase() + player.side.slice(1) : null} />
        <StatItem label="Hand" value={player.hand ? player.hand.charAt(0).toUpperCase() + player.hand.slice(1) : null} />
      </div>

      {/* Recent Matches */}
      <section>
        <h2 className="text-lg sm:text-xl font-bold text-[#0F1F2E] mb-4">Recent Matches</h2>
        {finishedMatches.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {finishedMatches.slice(0, 8).map((match: Match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No recent match results available.</p>
        )}
      </section>
    </main>
  );
}
