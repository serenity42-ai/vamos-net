"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Match, Player, MatchPlayer } from "@/lib/padel-api";
import { displaySurname } from "@/lib/player-utils";
import { useLiveScore } from "@/hooks/useLiveScore";

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
      className="rounded-full overflow-hidden flex items-center justify-center shrink-0"
      style={{
        width: size,
        height: size,
        background: "var(--paper-2)",
        border: "2px solid var(--paper)",
      }}
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
        <span style={{ fontFamily: "var(--mono)", fontSize: 10, fontWeight: 700, color: "var(--mute)" }}>
          {initials}
        </span>
      )}
    </div>
  );
}

function NationalityBadge({ code }: { code: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: "var(--mono)",
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        padding: "2px 6px",
        border: "1px solid var(--ink)",
        color: "var(--ink)",
      }}
    >
      {code.toUpperCase()}
    </span>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div
        className="w-8 h-8 rounded-full animate-spin"
        style={{ border: "2px solid var(--red)", borderTopColor: "transparent" }}
      />
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
  const [loading, setLoading] = useState(true);

  // Use the same live score hook as the ticker for real-time Pusher updates
  const isLive = match.status === "live";
  const { score: liveScore } = useLiveScore(match.id, isLive, match.score, match.status);

  // Fetch player details only
  useEffect(() => {
    const allPlayers = [...match.players.team_1, ...match.players.team_2];
    const ids = allPlayers.map((p) => p.id);

    setLoading(true);
    setPlayerDetails(new Map());

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

    fetchPlayers
      .then((playerResults) => {
        const map = new Map<number, Player>();
        (playerResults as PromiseSettledResult<Player | null>[]).forEach((r, i) => {
          if (r.status === "fulfilled" && r.value && !("error" in r.value)) {
            map.set(validIds[i], r.value as Player);
          }
        });
        setPlayerDetails(map);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [match.id]);

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
  // Filter out empty/0-0 in-progress sets — PadelAPI reports null set_score
  // and empty games for a set that just started; we should not render '0 0'
  // because it looks like a finished 0-0 set.
  const score = liveScore?.filter((s) => {
    const a = (s.team_1 ?? "").toString().trim();
    const b = (s.team_2 ?? "").toString().trim();
    if (!a && !b) return false;
    if (a === "0" && b === "0") return false;
    return true;
  }) ?? null;

  const teams = [
    { players: t1, isWinner: match.winner === "team_1", key: "team_1" as const },
    { players: t2, isWinner: match.winner === "team_2", key: "team_2" as const },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(21,18,16,0.82)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden"
        style={{ background: "var(--paper)", border: "1px solid var(--ink)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between gap-3"
          style={{ background: "var(--ink)", padding: "14px 20px", color: "var(--paper)" }}
        >
          <div className="min-w-0">
            {tournamentName && (
              <p
                className="truncate"
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--red)",
                  marginBottom: 4,
                }}
              >
                ■ {tournamentName}
              </p>
            )}
            <p
              className="flex items-center gap-3"
              style={{
                fontFamily: "var(--sans)",
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: "-0.01em",
                color: "var(--paper)",
              }}
            >
              {match.round_name}
              {match.status === "live" && <span className="badge-live">LIVE</span>}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ color: "rgba(243,238,228,0.6)" }}
            className="hover:text-[var(--paper)] transition-colors shrink-0 mt-0.5 p-1 -mr-1"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
              <path d="M14 4L4 14M4 4l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
                        className="truncate"
                        style={{
                          fontFamily: "var(--sans)",
                          fontSize: 15,
                          fontWeight: isWinner ? 800 : 600,
                          letterSpacing: "-0.01em",
                          color:
                            isWinner
                              ? "var(--ink)"
                              : match.winner
                              ? "var(--mute)"
                              : "var(--ink)",
                        }}
                      >
                        {players.length > 0
                          ? players.map((p) => displaySurname(p.name)).join(" / ")
                          : "TBD"}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        {players.map((p) => {
                          const detail = playerDetails.get(p.id);
                          return detail?.nationality ? (
                            <NationalityBadge key={p.id} code={detail.nationality} />
                          ) : null;
                        })}
                        {isWinner && (
                          <span
                            style={{
                              fontFamily: "var(--mono)",
                              fontSize: 9,
                              fontWeight: 800,
                              letterSpacing: "0.18em",
                              textTransform: "uppercase",
                              color: "var(--red)",
                            }}
                          >
                            ✓ Won
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Set scores */}
                    {score && score.length > 0 && (
                      <div className="flex items-center gap-3 shrink-0">
                        {score.map((s, i) => {
                          const myScore = key === "team_1" ? s.team_1 : s.team_2;
                          const oppScore = key === "team_1" ? s.team_2 : s.team_1;
                          const wonSet = parseInt(myScore) > parseInt(oppScore);
                          const tbMatch = myScore?.match(/^(\d+)\((\d+)\)$/);
                          return (
                            <span
                              key={i}
                              className="score-mono"
                              style={{
                                fontSize: 24,
                                width: 24,
                                textAlign: "center",
                                lineHeight: 1,
                                color: wonSet ? "var(--ink)" : "var(--mute)",
                              }}
                            >
                              {tbMatch ? (
                                <>
                                  {tbMatch[1]}
                                  <sup style={{ fontSize: 10, marginLeft: 1, color: "var(--mute)" }}>
                                    {tbMatch[2]}
                                  </sup>
                                </>
                              ) : (
                                myScore
                              )}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {teamIdx === 0 && (
                    <div className="my-5" style={{ borderTop: "1px solid rgba(0,0,0,0.12)" }} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center gap-3 flex-wrap"
          style={{
            padding: "12px 20px",
            background: "var(--paper-2)",
            borderTop: "1px solid var(--ink)",
            fontFamily: "var(--mono)",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          <span
            style={{
              padding: "3px 7px",
              border: `1px solid ${match.category === "women" ? "#A83362" : "var(--ink)"}`,
              color: match.category === "women" ? "#A83362" : "var(--ink)",
            }}
          >
            {match.category}
          </span>
          <span style={{ color: "var(--mute)" }}>·</span>
          {match.schedule_label ? (
            <span style={{ color: "var(--red)" }}>{match.schedule_label}</span>
          ) : (
            <span style={{ color: "var(--mute)" }}>{formatDate(match.played_at)}</span>
          )}
          {match.duration && (
            <>
              <span style={{ color: "var(--mute)" }}>·</span>
              <span style={{ color: "var(--mute)" }}>{match.duration}</span>
            </>
          )}
          {match.court && (
            <>
              <span style={{ color: "var(--mute)" }}>·</span>
              <span style={{ color: "var(--mute)" }}>{match.court}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
