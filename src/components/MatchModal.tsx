"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Match, Player, MatchPlayer } from "@/lib/padel-api";

interface MatchModalProps {
  match: Match;
  tournamentName?: string;
  onClose: () => void;
}

function PlayerAvatar({
  player,
  detail,
  size = 40,
}: {
  player: MatchPlayer;
  detail?: Player;
  size?: number;
}) {
  const initials = player.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const photo = detail?.photo_url;

  return (
    <div
      className="rounded-full overflow-hidden bg-[#0F1F2E]/10 flex items-center justify-center shrink-0 border-2 border-white"
      style={{ width: size, height: size }}
    >
      {photo ? (
        <Image
          src={photo}
          alt={player.name}
          width={size}
          height={size}
          className="object-cover w-full h-full"
        />
      ) : (
        <span className="text-xs font-bold text-[#0F1F2E]/60">{initials}</span>
      )}
    </div>
  );
}

function NationalityBadge({ code }: { code: string }) {
  return (
    <span className="inline-block text-[10px] font-bold uppercase bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded tracking-wider">
      {code.toUpperCase()}
    </span>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-8 h-8 border-2 border-[#4ABED9] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function MatchModal({ match, tournamentName, onClose }: MatchModalProps) {
  const [playerDetails, setPlayerDetails] = useState<Map<number, Player>>(new Map());
  const [liveScore, setLiveScore] = useState<{ team_1: string; team_2: string }[] | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch player details + live scores
  useEffect(() => {
    const allPlayers = [...match.players.team_1, ...match.players.team_2];
    const ids = allPlayers.map((p) => p.id);

    setLoading(true);
    setPlayerDetails(new Map());
    setLiveScore(null);

    const validIds = ids.filter((id) => id && !isNaN(id));

    const fetchPlayers = validIds.length > 0
      ? Promise.allSettled(
          validIds.map((id) =>
            fetch(`/api/players/${id}`)
              .then((r) => {
                if (!r.ok) throw new Error("not ok");
                return r.json();
              })
              .catch(() => null)
          )
        )
      : Promise.resolve([]);

    const fetchLive = match.status === "live" && match.id
      ? fetch(`/api/matches/${match.id}/live`)
          .then((r) => {
            if (!r.ok) throw new Error("not ok");
            return r.json();
          })
          .catch(() => null)
      : Promise.resolve(null);

    Promise.all([fetchPlayers, fetchLive])
      .then(([playerResults, liveData]) => {
        const map = new Map<number, Player>();
        (playerResults as PromiseSettledResult<Player | null>[]).forEach((r, i) => {
          if (r.status === "fulfilled" && r.value && !("error" in r.value)) {
            map.set(validIds[i], r.value as Player);
          }
        });
        setPlayerDetails(map);

        if (liveData?.sets?.length > 0) {
          setLiveScore(
            liveData.sets.map((s: { set_score: string }) => {
              const [t1, t2] = s.set_score.split("-");
              return { team_1: t1, team_2: t2 };
            })
          );
        }

        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [match.id, match.status]);

  // Escape key handler
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const t1 = match.players.team_1;
  const t2 = match.players.team_2;
  const score = liveScore || match.score;

  const teams = [
    { players: t1, isWinner: match.winner === "team_1", key: "team_1" as const },
    { players: t2, isWinner: match.winner === "team_2", key: "team_2" as const },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.72)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#0F1F2E] px-5 py-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            {tournamentName && (
              <p className="text-[11px] font-semibold text-[#4ABED9] uppercase tracking-wider truncate mb-0.5">
                {tournamentName}
              </p>
            )}
            <p className="text-white font-bold text-base leading-tight flex items-center gap-2">
              {match.round_name}
              {match.status === "live" && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  Live
                </span>
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors shrink-0 mt-0.5 p-1 -mr-1"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M14 4L4 14M4 4l10 10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Score body */}
        <div className="px-5 py-5">
          {loading ? (
            <Spinner />
          ) : (
            <div>
              {teams.map(({ players, isWinner, key }, teamIdx) => (
                <div key={key}>
                  <div className="flex items-center gap-3">
                    {/* Avatars */}
                    <div className="flex -space-x-3 shrink-0">
                      {players.map((p) => (
                        <PlayerAvatar
                          key={p.id}
                          player={p}
                          detail={playerDetails.get(p.id)}
                          size={38}
                        />
                      ))}
                    </div>

                    {/* Names + nationalities */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-bold truncate ${
                          isWinner
                            ? "text-[#0F1F2E]"
                            : match.winner
                            ? "text-gray-400"
                            : "text-[#0F1F2E]"
                        }`}
                      >
                        {players.length > 0
                          ? players.map((p) => p.name.split(" ").pop()).join(" / ")
                          : "TBD"}
                      </p>
                      <div className="flex items-center gap-1 mt-1 flex-wrap">
                        {players.map((p) => {
                          const detail = playerDetails.get(p.id);
                          return detail?.nationality ? (
                            <NationalityBadge key={p.id} code={detail.nationality} />
                          ) : null;
                        })}
                        {isWinner && (
                          <span className="text-[10px] font-bold text-[#3CB371] uppercase tracking-wider ml-0.5">
                            Won
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Set scores */}
                    {score && score.length > 0 && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        {score.map((s, i) => {
                          const myScore = key === "team_1" ? s.team_1 : s.team_2;
                          const oppScore = key === "team_1" ? s.team_2 : s.team_1;
                          const wonSet = parseInt(myScore) > parseInt(oppScore);
                          return (
                            <span
                              key={i}
                              className={`text-xl font-black tabular-nums w-7 text-center leading-none ${
                                wonSet ? "text-[#0F1F2E]" : "text-gray-300"
                              }`}
                            >
                              {myScore}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {teamIdx === 0 && (
                    <div className="my-4 border-t border-gray-100" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center gap-2 flex-wrap">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
              match.category === "women"
                ? "bg-pink-50 text-pink-600"
                : "bg-blue-50 text-blue-600"
            }`}
          >
            {match.category}
          </span>
          <span className="text-gray-200 text-xs">·</span>
          <span className="text-xs text-gray-500">{formatDate(match.played_at)}</span>
          {match.duration && (
            <>
              <span className="text-gray-200 text-xs">·</span>
              <span className="text-xs text-gray-500">{match.duration}</span>
            </>
          )}
          {match.court && (
            <>
              <span className="text-gray-200 text-xs">·</span>
              <span className="text-xs text-gray-500">{match.court}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
