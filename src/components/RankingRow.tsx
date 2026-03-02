import Image from "next/image";
import Link from "next/link";
import type { Player } from "@/lib/padel-api";
import { countryFlag } from "@/lib/padel-api";

export default function RankingRow({
  player,
  compact,
}: {
  player: Player;
  compact?: boolean;
}) {
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
          className="flex items-center gap-2.5 group"
        >
          {player.photo_url && !compact ? (
            <Image
              src={player.photo_url}
              alt={player.name}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover bg-gray-100"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400 shrink-0">
              {player.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
          )}
          <div className="min-w-0">
            <span className="text-sm font-semibold text-[#0F1F2E] group-hover:text-[#4ABED9] transition-colors truncate block">
              {player.name}
            </span>
            {!compact && (
              <span className="text-xs text-gray-400">
                {flag} {player.nationality}
              </span>
            )}
          </div>
        </Link>
      </td>
      {!compact && (
        <td className="py-3 px-3 hidden sm:table-cell">
          <span className="text-sm text-gray-500">
            {flag} {player.nationality}
          </span>
        </td>
      )}
      <td className="py-3 px-3 text-right">
        <span className="text-sm font-semibold text-[#0F1F2E] tabular-nums">
          {player.points?.toLocaleString() ?? "-"}
        </span>
      </td>
    </tr>
  );
}
