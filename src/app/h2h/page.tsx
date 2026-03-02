"use client";

import { useState, useCallback } from "react";
import MatchCard from "@/components/MatchCard";
import type { Match, Player } from "@/lib/padel-api";

export default function H2HPage() {
  const [team1Search, setTeam1Search] = useState("");
  const [team2Search, setTeam2Search] = useState("");
  const [team1Results, setTeam1Results] = useState<Player[]>([]);
  const [team2Results, setTeam2Results] = useState<Player[]>([]);
  const [team1Selected, setTeam1Selected] = useState<Player[]>([]);
  const [team2Selected, setTeam2Selected] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
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

  const fetchH2H = async () => {
    if (team1Selected.length === 0 || team2Selected.length === 0) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const res = await fetch("/api/h2h", {
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
        setMatches([]);
      } else {
        setMatches(data.data || []);
      }
    } catch {
      setError("Failed to fetch head-to-head data.");
      setMatches([]);
    }
    setLoading(false);
  };

  // Count wins
  const team1Wins = matches.filter((m) => {
    const t1Ids = team1Selected.map((p) => p.id);
    const matchT1Ids = m.players.team_1.map((p) => p.id);
    const isTeam1 = t1Ids.every((id) => matchT1Ids.includes(id));
    return (isTeam1 && m.winner === "team_1") || (!isTeam1 && m.winner === "team_2");
  }).length;
  const team2Wins = matches.filter((m) => m.status === "finished").length - team1Wins;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0F1F2E] mb-2">
          Head to Head
        </h1>
        <p className="text-sm sm:text-base text-gray-500">
          Compare match history between players or teams
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
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#4ABED9]/10 text-[#4ABED9] text-sm font-semibold rounded-lg"
              >
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
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#3CB371]/10 text-[#3CB371] text-sm font-semibold rounded-lg"
              >
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

      {/* Search button */}
      <div className="mb-8">
        <button
          onClick={fetchH2H}
          disabled={
            team1Selected.length === 0 ||
            team2Selected.length === 0 ||
            loading
          }
          className="px-6 py-2.5 bg-[#4ABED9] text-white text-sm font-bold rounded-lg hover:bg-[#3ba8c2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : "Compare"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Results */}
      {searched && !loading && !error && (
        <>
          {/* Score summary */}
          {matches.length > 0 && (
            <div className="mb-8 p-4 sm:p-6 bg-gray-50 rounded-xl border border-gray-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 text-center">
                Head to Head Record
              </h3>
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-[#4ABED9]">
                    {team1Wins}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {team1Selected.map((p) => p.name.split(" ").pop()).join(" / ")}
                  </div>
                </div>
                <div className="text-lg font-bold text-gray-300">-</div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-[#3CB371]">
                    {team2Wins}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {team2Selected.map((p) => p.name.split(" ").pop()).join(" / ")}
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-400 text-center mt-2">
                {matches.filter((m) => m.status === "finished").length} matches played
              </div>
            </div>
          )}

          {/* Match list */}
          {matches.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {matches.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              No head-to-head matches found between these players.
            </div>
          )}
        </>
      )}
    </main>
  );
}
