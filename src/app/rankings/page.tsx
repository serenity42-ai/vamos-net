import Link from "next/link";
import Image from "next/image";
import { getPlayers, countryFlag, type Player } from "@/lib/padel-api";

export const metadata = {
  title: "Rankings | VAMOS",
  description: "Official Premier Padel rankings for men and women.",
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

  return {
    men: menRes.status === "fulfilled" ? menRes.value.data : [],
    women: womenRes.status === "fulfilled" ? womenRes.value.data : [],
  };
}

function PlayerRow({ player }: { player: Player }) {
  const flag = countryFlag(player.nationality);
  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
      <td className="py-3 px-3 text-center">
        <span
          className={`text-sm font-bold ${
            player.ranking <= 3 ? "text-[#4ABED9]" : "text-[#0F1F2E]"
          }`}
        >
          {player.ranking}
        </span>
      </td>
      <td className="py-3 px-3">
        <Link
          href={`/players/${player.id}`}
          className="flex items-center gap-3 group"
        >
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
              {player.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
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
        <span className="text-sm text-gray-500">
          {flag} {player.nationality}
        </span>
      </td>
      <td className="py-3 px-3 text-right">
        <span className="text-sm font-semibold text-[#0F1F2E] tabular-nums">
          {player.points?.toLocaleString() ?? "-"}
        </span>
      </td>
      <td className="py-3 px-3 hidden md:table-cell text-center">
        <span className="text-xs text-gray-400 capitalize">
          {player.side ?? "-"}
        </span>
      </td>
    </tr>
  );
}

export default async function RankingsPage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const { men, women } = await fetchRankings();
  const tab = searchParams.tab === "women" ? "women" : "men";
  const rankings = tab === "men" ? men : women;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0F1F2E] mb-2">
          Rankings
        </h1>
        <p className="text-sm sm:text-base text-gray-500">
          Official Premier Padel rankings
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 sm:mb-8 bg-gray-100 rounded-lg p-1 w-fit">
        <Link
          href="/rankings?tab=men"
          className={`px-5 sm:px-6 py-2 sm:py-2.5 text-sm font-bold rounded-md transition-colors ${
            tab === "men"
              ? "bg-white text-[#0F1F2E] shadow-sm"
              : "text-gray-500 hover:text-[#0F1F2E]"
          }`}
        >
          Men
        </Link>
        <Link
          href="/rankings?tab=women"
          className={`px-5 sm:px-6 py-2 sm:py-2.5 text-sm font-bold rounded-md transition-colors ${
            tab === "women"
              ? "bg-white text-[#0F1F2E] shadow-sm"
              : "text-gray-500 hover:text-[#0F1F2E]"
          }`}
        >
          Women
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[360px]">
            <thead>
              <tr className="text-xs font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100 bg-gray-50">
                <th className="py-3 px-3 text-center w-14">Rank</th>
                <th className="py-3 px-3 text-left">Player</th>
                <th className="py-3 px-3 text-left hidden sm:table-cell">
                  Country
                </th>
                <th className="py-3 px-3 text-right">Points</th>
                <th className="py-3 px-3 text-center hidden md:table-cell w-20">
                  Side
                </th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((player) => (
                <PlayerRow key={player.id} player={player} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-gray-400">
        Showing top {rankings.length} players.
      </div>
    </main>
  );
}
