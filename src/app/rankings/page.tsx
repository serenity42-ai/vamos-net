"use client";

import { useState } from "react";
import RankingRow from "@/components/RankingRow";
import { menRankings, womenRankings } from "@/data/mock";

export default function RankingsPage() {
  const [tab, setTab] = useState<"men" | "women">("men");
  const rankings = tab === "men" ? menRankings : womenRankings;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F1F2E] mb-2">Rankings</h1>
        <p className="text-gray-500">Official Premier Padel and WPT rankings</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setTab("men")}
          className={`px-6 py-2.5 text-sm font-bold rounded-md transition-colors ${
            tab === "men"
              ? "bg-white text-[#0F1F2E] shadow-sm"
              : "text-gray-500 hover:text-[#0F1F2E]"
          }`}
        >
          Men
        </button>
        <button
          onClick={() => setTab("women")}
          className={`px-6 py-2.5 text-sm font-bold rounded-md transition-colors ${
            tab === "women"
              ? "bg-white text-[#0F1F2E] shadow-sm"
              : "text-gray-500 hover:text-[#0F1F2E]"
          }`}
        >
          Women
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-xs font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100 bg-gray-50">
              <th className="py-3 px-3 text-center w-14">Rank</th>
              <th className="py-3 px-3 text-left">Player</th>
              <th className="py-3 px-3 text-left hidden sm:table-cell">Country</th>
              <th className="py-3 px-3 text-right">Points</th>
              <th className="py-3 px-3 text-center w-16">Trend</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((player) => (
              <RankingRow key={player.rank} player={player} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-center text-sm text-gray-400">
        Showing top {rankings.length} players. Full rankings coming soon.
      </div>
    </main>
  );
}
