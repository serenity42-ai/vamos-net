"use client";

import { useState } from "react";
import MatchCard from "@/components/MatchCard";
import { matches, tournaments } from "@/data/mock";

export default function ScoresPage() {
  const [filter, setFilter] = useState("All Tournaments");

  const filtered = filter === "All Tournaments"
    ? matches
    : matches.filter((m) => m.tournament === filter);

  const live = filtered.filter((m) => m.status === "live");
  const upcoming = filtered.filter((m) => m.status === "upcoming");
  const finished = filtered.filter((m) => m.status === "finished");

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0F1F2E] mb-2">Scores</h1>
        <p className="text-sm sm:text-base text-gray-500">Today&apos;s matches from the padel world</p>
      </div>

      {/* Tournament filter — horizontally scrollable on mobile */}
      <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto mb-6 sm:mb-8">
        <div className="flex gap-2 pb-2 sm:pb-0 sm:flex-wrap">
          {tournaments.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                filter === t
                  ? "bg-[#4ABED9] text-white"
                  : "bg-gray-100 text-[#0F1F2E] hover:bg-gray-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Live matches */}
      {live.length > 0 && (
        <section className="mb-8 sm:mb-10">
          <h2 className="text-base sm:text-lg font-bold text-[#0F1F2E] mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Live Now
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {live.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <section className="mb-8 sm:mb-10">
          <h2 className="text-base sm:text-lg font-bold text-[#0F1F2E] mb-4">Upcoming</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        </section>
      )}

      {/* Finished */}
      {finished.length > 0 && (
        <section className="mb-8 sm:mb-10">
          <h2 className="text-base sm:text-lg font-bold text-gray-400 mb-4">Finished</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {finished.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        </section>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-12 sm:py-16 text-gray-400">
          <p className="text-base sm:text-lg">No matches found for this tournament.</p>
        </div>
      )}
    </main>
  );
}
