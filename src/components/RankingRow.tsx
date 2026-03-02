import type { RankedPlayer } from "@/data/mock";

function TrendIndicator({ trend, value }: { trend: RankedPlayer["trend"]; value: number }) {
  if (trend === "up") {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-[#3CB371]">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M6 2L10 7H2L6 2Z"/></svg>
        {value}
      </span>
    );
  }
  if (trend === "down") {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-red-500">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M6 10L2 5H10L6 10Z"/></svg>
        {value}
      </span>
    );
  }
  return <span className="text-xs text-gray-400">--</span>;
}

export default function RankingRow({ player, compact }: { player: RankedPlayer; compact?: boolean }) {
  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
      <td className="py-3 px-3 text-center">
        <span className={`text-sm font-bold ${player.rank <= 3 ? "text-[#4ABED9]" : "text-[#0F1F2E]"}`}>
          {player.rank}
        </span>
      </td>
      <td className="py-3 px-3">
        <span className="text-sm font-semibold text-[#0F1F2E]">{player.name}</span>
      </td>
      {!compact && (
        <td className="py-3 px-3 hidden sm:table-cell">
          <span className="text-sm text-gray-500">{player.country}</span>
        </td>
      )}
      <td className="py-3 px-3 text-right">
        <span className="text-sm font-semibold text-[#0F1F2E] tabular-nums">
          {player.points.toLocaleString()}
        </span>
      </td>
      <td className="py-3 px-3 text-center">
        <TrendIndicator trend={player.trend} value={player.trendValue} />
      </td>
    </tr>
  );
}
