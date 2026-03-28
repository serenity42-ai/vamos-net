import Link from "next/link";
import Image from "next/image";
import { getPlayers, countryFlag, type Player } from "@/lib/padel-api";

export const metadata = {
  title: "Rankings | VAMOS",
  description: "Official Premier Padel rankings for men and women. Live rankings, points, and player profiles.",
};

async function fetchRankings() {
  const [menRes, womenRes] = await Promise.allSettled([
    getPlayers({
      category: "men",
      sort_by: "ranking",
      order_by: "asc",
      per_page: "50",
    }),
    getPlayers({
      category: "women",
      sort_by: "ranking",
      order_by: "asc",
      per_page: "50",
    }),
  ]);

  const filterAndSort = (players: Player[]): Player[] => {
    if (players.length < 3) return players;
    // Filter anomalies: remove players with points < 10% of 3rd-highest
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

  return {
    men: filterAndSort(menRes.status === "fulfilled" ? menRes.value.data : []),
    women: filterAndSort(womenRes.status === "fulfilled" ? womenRes.value.data : []),
  };
}

function PlayerRow({ player }: { player: Player }) {
  const flag = countryFlag(player.nationality);
  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
      <td className="py-3 px-3 text-center">
        <span className={`text-sm font-bold ${player.ranking <= 3 ? "text-[#4ABED9]" : "text-[#0F1F2E]"}`}>
          {player.ranking}
        </span>
      </td>
      <td className="py-3 px-3">
        <Link href={`/players/${player.id}`} className="flex items-center gap-3 group">
          {player.photo_url ? (
            <Image
              src={player.photo_url}
              alt={player.name}
              width={36}
              height={36}
              className="w-9 h-9 rounded-full object-cover bg-gray-100 shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400 shrink-0">
              {player.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
          )}
          <div className="min-w-0">
            <span className="text-sm font-semibold text-[#0F1F2E] group-hover:text-[#4ABED9] transition-colors block truncate">
              {player.name}
            </span>
            <span className="text-xs text-gray-400 sm:hidden">
              {flag} {player.nationality}
            </span>
          </div>
        </Link>
      </td>
      <td className="py-3 px-3 hidden sm:table-cell">
        <span className="text-sm text-gray-500">{flag} {player.nationality}</span>
      </td>
      <td className="py-3 px-3 text-right">
        <span className="text-sm font-semibold text-[#0F1F2E] tabular-nums">
          {player.points?.toLocaleString() ?? "-"}
        </span>
      </td>
    </tr>
  );
}

export default async function RankingsPage({
  searchParams,
}: {
  searchParams: { tab?: string; search?: string; show?: string };
}) {
  const { men, women } = await fetchRankings();
  const tab = searchParams.tab === "women" ? "women" : "men";
  const searchQuery = searchParams.search?.toLowerCase() || "";
  const showAll = searchParams.show === "all";

  let rankings = tab === "men" ? men : women;

  // Filter by search
  if (searchQuery) {
    rankings = rankings.filter((p) =>
      p.name.toLowerCase().includes(searchQuery) ||
      p.nationality.toLowerCase().includes(searchQuery)
    );
  }

  // Show top 20 by default or all
  const displayCount = showAll || searchQuery ? rankings.length : Math.min(20, rankings.length);
  const displayRankings = rankings.slice(0, displayCount);
  const hasMore = !showAll && !searchQuery && rankings.length > 20;

  // Schema.org ItemList
  const rankingsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Premier Padel ${tab === "men" ? "Men's" : "Women's"} Rankings`,
    numberOfItems: rankings.length,
    itemListElement: displayRankings.slice(0, 20).map((p, i) => ({
      "@type": "ListItem",
      position: p.ranking,
      item: {
        "@type": "Person",
        name: p.name,
        nationality: p.nationality,
        url: `https://vamos.net/players/${p.id}`,
      },
    })),
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(rankingsSchema) }}
      />

      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0F1F2E] mb-2">Rankings</h1>
        <p className="text-sm sm:text-base text-gray-500">Official Premier Padel rankings</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-gray-100 rounded-lg p-1 w-fit">
        <Link
          href="/rankings?tab=men"
          className={`px-5 sm:px-6 py-2 sm:py-2.5 text-sm font-bold rounded-md transition-colors ${
            tab === "men" ? "bg-white text-[#0F1F2E] shadow-sm" : "text-gray-500 hover:text-[#0F1F2E]"
          }`}
        >
          Men
        </Link>
        <Link
          href="/rankings?tab=women"
          className={`px-5 sm:px-6 py-2 sm:py-2.5 text-sm font-bold rounded-md transition-colors ${
            tab === "women" ? "bg-white text-[#0F1F2E] shadow-sm" : "text-gray-500 hover:text-[#0F1F2E]"
          }`}
        >
          Women
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <form action="/rankings" method="get" className="flex gap-2">
          <input type="hidden" name="tab" value={tab} />
          <input
            name="search"
            type="text"
            placeholder="Search player by name..."
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
              href={`/rankings?tab=${tab}`}
              className="px-4 py-2.5 bg-gray-100 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear
            </Link>
          )}
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[360px]">
            <thead>
              <tr className="text-xs font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100 bg-gray-50">
                <th className="py-3 px-3 text-center w-14">Rank</th>
                <th className="py-3 px-3 text-left">Player</th>
                <th className="py-3 px-3 text-left hidden sm:table-cell">Country</th>
                <th className="py-3 px-3 text-right">Points</th>
              </tr>
            </thead>
            <tbody>
              {displayRankings.map((player) => (
                <PlayerRow key={player.id} player={player} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Show More / Count */}
      <div className="mt-6 text-center">
        {hasMore ? (
          <Link
            href={`/rankings?tab=${tab}&show=all`}
            className="inline-block px-6 py-2.5 bg-gray-100 text-[#0F1F2E] text-sm font-bold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Show All {rankings.length} Players
          </Link>
        ) : (
          <p className="text-sm text-gray-400">
            Showing {displayRankings.length} of {rankings.length} players.
          </p>
        )}
      </div>
    </main>
  );
}
