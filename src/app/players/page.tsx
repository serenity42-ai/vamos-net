import Link from "next/link";
import Image from "next/image";
import { getPlayers, countryFlag, type Player } from "@/lib/padel-api";

export const metadata = {
  title: "Players | VAMOS",
  description: "Browse professional padel players. Rankings, profiles, stats, and more.",
};

async function fetchPlayers(category: "men" | "women", search?: string) {
  const params: Record<string, string> = {
    sort_by: "ranking",
    order_by: "asc",
    per_page: "50",
    category,
  };
  if (search) {
    params.name = search;
  }

  const res = await getPlayers(params as Parameters<typeof getPlayers>[0]).catch(() => ({
    data: [] as Player[],
  }));

  // Filter anomalies
  const players = res.data;
  if (players.length < 3) return players;
  const topPoints = players.slice(0, 10).map((p) => p.points || 0).filter((p) => p > 0).sort((a, b) => b - a);
  const threshold = topPoints.length > 2 ? topPoints[2] * 0.1 : 0;
  return players.filter((p) => !p.points || p.points >= threshold);
}

function PlayerCard({ player }: { player: Player }) {
  const flag = countryFlag(player.nationality);
  return (
    <Link
      href={`/players/${player.id}`}
      className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow group"
    >
      <div className="flex items-center gap-3 mb-3">
        {player.photo_url ? (
          <Image
            src={player.photo_url}
            alt={player.name}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover bg-gray-100 shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-400 shrink-0">
            {player.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-[#0F1F2E] group-hover:text-[#4ABED9] transition-colors truncate">
            {player.name}
          </h3>
          <p className="text-xs text-gray-500">{flag} {player.nationality}</p>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs">
        <div>
          <span className="text-gray-400 uppercase tracking-wider font-semibold">Rank</span>
          <span className={`ml-1.5 font-bold ${player.ranking <= 10 ? "text-[#4ABED9]" : "text-[#0F1F2E]"}`}>
            #{player.ranking}
          </span>
        </div>
        <div>
          <span className="text-gray-400 uppercase tracking-wider font-semibold">Points</span>
          <span className="ml-1.5 font-bold text-[#0F1F2E]">{player.points?.toLocaleString() ?? "-"}</span>
        </div>
      </div>
    </Link>
  );
}

export default async function PlayersPage({
  searchParams,
}: {
  searchParams: { tab?: string; search?: string };
}) {
  const tab = searchParams.tab === "women" ? "women" : "men";
  const searchQuery = searchParams.search || "";

  const players = await fetchPlayers(tab as "men" | "women", searchQuery || undefined);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0F1F2E] mb-2">Players</h1>
        <p className="text-sm sm:text-base text-gray-500">Browse professional padel players</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-gray-100 rounded-lg p-1 w-fit">
        <Link
          href={`/players?tab=men${searchQuery ? `&search=${searchQuery}` : ""}`}
          className={`px-5 sm:px-6 py-2 sm:py-2.5 text-sm font-bold rounded-md transition-colors ${
            tab === "men" ? "bg-white text-[#0F1F2E] shadow-sm" : "text-gray-500 hover:text-[#0F1F2E]"
          }`}
        >
          Men
        </Link>
        <Link
          href={`/players?tab=women${searchQuery ? `&search=${searchQuery}` : ""}`}
          className={`px-5 sm:px-6 py-2 sm:py-2.5 text-sm font-bold rounded-md transition-colors ${
            tab === "women" ? "bg-white text-[#0F1F2E] shadow-sm" : "text-gray-500 hover:text-[#0F1F2E]"
          }`}
        >
          Women
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <form action="/players" method="get" className="flex gap-2">
          <input type="hidden" name="tab" value={tab} />
          <input
            name="search"
            type="text"
            placeholder="Search players..."
            defaultValue={searchQuery}
            className="flex-1 max-w-sm px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-[#0F1F2E] placeholder-gray-400 outline-none focus:border-[#4ABED9] focus:ring-2 focus:ring-[#4ABED9]/20 transition-all"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#4ABED9] text-white text-sm font-bold rounded-lg hover:bg-[#3ba8c2] transition-colors"
          >
            Search
          </button>
          {searchQuery && (
            <Link
              href={`/players?tab=${tab}`}
              className="px-4 py-2.5 bg-gray-100 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear
            </Link>
          )}
        </form>
      </div>

      {/* Players Grid */}
      {players.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {players.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 sm:py-16 text-gray-400">
          <p className="text-base sm:text-lg">
            {searchQuery ? `No players found for "${searchQuery}".` : "No players found."}
          </p>
        </div>
      )}

      <div className="mt-6 text-center text-sm text-gray-400">
        Showing {players.length} players.
      </div>
    </main>
  );
}
