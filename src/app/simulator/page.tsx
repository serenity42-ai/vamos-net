"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import type { Player, SimulationResult } from "@/lib/padel-api";

export default function SimulatorPage() {
  const [team1Search, setTeam1Search] = useState("");
  const [team2Search, setTeam2Search] = useState("");
  const [team1Results, setTeam1Results] = useState<Player[]>([]);
  const [team2Results, setTeam2Results] = useState<Player[]>([]);
  const [team1Selected, setTeam1Selected] = useState<Player[]>([]);
  const [team2Selected, setTeam2Selected] = useState<Player[]>([]);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchPlayers = useCallback(
    async (query: string, setter: (p: Player[]) => void) => {
      if (query.length < 2) {
        setter([]);
        return;
      }
      try {
        const res = await fetch(
          `/api/players/search?name=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        setter(data.data || []);
      } catch {
        setter([]);
      }
    },
    []
  );

  const addPlayer = (
    player: Player,
    selected: Player[],
    setSelected: (p: Player[]) => void,
    setSearch: (s: string) => void,
    setResults: (p: Player[]) => void
  ) => {
    if (selected.length >= 2) return;
    if (selected.find((p) => p.id === player.id)) return;
    setSelected([...selected, player]);
    setSearch("");
    setResults([]);
  };

  const removePlayer = (
    playerId: number,
    selected: Player[],
    setSelected: (p: Player[]) => void
  ) => {
    setSelected(selected.filter((p) => p.id !== playerId));
  };

  const simulate = async () => {
    if (team1Selected.length === 0 || team2Selected.length === 0) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          team_1: team1Selected.map((p) => p.id),
          team_2: team2Selected.map((p) => p.id),
        }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch {
      setError("Simulation failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0F1F2E] mb-2">
          Match Simulator
        </h1>
        <p className="text-sm sm:text-base text-gray-500">
          Simulate a match between two teams based on Elo ratings
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {/* Team 1 */}
        <div>
          <label className="text-sm font-bold text-[#0F1F2E] block mb-2">
            Team 1
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {team1Selected.map((p) => (
              <span
                key={p.id}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#4ABED9]/10 text-[#4ABED9] text-sm font-semibold rounded-lg"
              >
                {p.photo_url && (
                  <Image
                    src={p.photo_url}
                    alt={p.name}
                    width={20}
                    height={20}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                )}
                {p.name}
                <button
                  onClick={() =>
                    removePlayer(p.id, team1Selected, setTeam1Selected)
                  }
                  className="ml-1 hover:text-red-500"
                >
                  x
                </button>
              </span>
            ))}
          </div>
          {team1Selected.length < 2 && (
            <div className="relative">
              <input
                type="text"
                value={team1Search}
                onChange={(e) => {
                  setTeam1Search(e.target.value);
                  searchPlayers(e.target.value, setTeam1Results);
                }}
                placeholder="Search player..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4ABED9]/30 focus:border-[#4ABED9]"
              />
              {team1Results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                  {team1Results.map((p) => (
                    <button
                      key={p.id}
                      onClick={() =>
                        addPlayer(
                          p,
                          team1Selected,
                          setTeam1Selected,
                          setTeam1Search,
                          setTeam1Results
                        )
                      }
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-semibold">{p.name}</span>
                      <span className="text-gray-400 ml-2">
                        #{p.ranking} | {p.nationality}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Team 2 */}
        <div>
          <label className="text-sm font-bold text-[#0F1F2E] block mb-2">
            Team 2
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {team2Selected.map((p) => (
              <span
                key={p.id}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#3CB371]/10 text-[#3CB371] text-sm font-semibold rounded-lg"
              >
                {p.photo_url && (
                  <Image
                    src={p.photo_url}
                    alt={p.name}
                    width={20}
                    height={20}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                )}
                {p.name}
                <button
                  onClick={() =>
                    removePlayer(p.id, team2Selected, setTeam2Selected)
                  }
                  className="ml-1 hover:text-red-500"
                >
                  x
                </button>
              </span>
            ))}
          </div>
          {team2Selected.length < 2 && (
            <div className="relative">
              <input
                type="text"
                value={team2Search}
                onChange={(e) => {
                  setTeam2Search(e.target.value);
                  searchPlayers(e.target.value, setTeam2Results);
                }}
                placeholder="Search player..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4ABED9]/30 focus:border-[#4ABED9]"
              />
              {team2Results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                  {team2Results.map((p) => (
                    <button
                      key={p.id}
                      onClick={() =>
                        addPlayer(
                          p,
                          team2Selected,
                          setTeam2Selected,
                          setTeam2Search,
                          setTeam2Results
                        )
                      }
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-semibold">{p.name}</span>
                      <span className="text-gray-400 ml-2">
                        #{p.ranking} | {p.nationality}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Simulate button */}
      <div className="mb-8">
        <button
          onClick={simulate}
          disabled={
            team1Selected.length === 0 ||
            team2Selected.length === 0 ||
            loading
          }
          className="px-6 py-2.5 bg-[#3CB371] text-white text-sm font-bold rounded-lg hover:bg-[#2d9e5e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Simulating..." : "Simulate Match"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-100">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">
              Simulation Result
            </h2>
            <p className="text-base sm:text-lg font-bold text-[#0F1F2E] mt-1">
              {result.name}
            </p>
          </div>

          <div className="p-4 sm:p-6">
            {/* Probability bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-[#4ABED9]">
                  {(result.probability.team_1 * 100).toFixed(1)}%
                </span>
                <span className="text-xs text-gray-400">Win Probability</span>
                <span className="text-sm font-bold text-[#3CB371]">
                  {(result.probability.team_2 * 100).toFixed(1)}%
                </span>
              </div>
              <div className="h-4 rounded-full overflow-hidden bg-gray-100 flex">
                <div
                  className="bg-[#4ABED9] transition-all duration-700 ease-out rounded-l-full"
                  style={{
                    width: `${result.probability.team_1 * 100}%`,
                  }}
                />
                <div
                  className="bg-[#3CB371] transition-all duration-700 ease-out rounded-r-full"
                  style={{
                    width: `${result.probability.team_2 * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Teams */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Team 1 */}
              <div className="p-4 rounded-lg bg-[#4ABED9]/5 border border-[#4ABED9]/20">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#4ABED9] mb-3">
                  Team 1
                </h3>
                {result.players.team_1.map((p) => (
                  <div key={p.id} className="flex items-center gap-2 mb-2">
                    {p.photo_url && (
                      <Image
                        src={p.photo_url}
                        alt={p.name}
                        width={28}
                        height={28}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <span className="text-sm font-semibold text-[#0F1F2E]">
                        {p.name}
                      </span>
                      <span className="text-xs text-gray-400 ml-2">
                        #{p.ranking}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Team 2 */}
              <div className="p-4 rounded-lg bg-[#3CB371]/5 border border-[#3CB371]/20">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#3CB371] mb-3">
                  Team 2
                </h3>
                {result.players.team_2.map((p) => (
                  <div key={p.id} className="flex items-center gap-2 mb-2">
                    {p.photo_url && (
                      <Image
                        src={p.photo_url}
                        alt={p.name}
                        width={28}
                        height={28}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <span className="text-sm font-semibold text-[#0F1F2E]">
                        {p.name}
                      </span>
                      <span className="text-xs text-gray-400 ml-2">
                        #{p.ranking}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
