"use client";

/**
 * MatchModal (v3) — match detail modal.
 *
 *  - Mobile: full-screen sheet (rounded top only on tablets+)
 *  - Desktop: centered 600×660 card, rounded-32
 *  - Backdrop with blur; ESC + backdrop click both close
 *  - Big player names, set scores grid, current game point pill if live
 *
 *  Prop signature is stable with the existing MatchModal:
 *    <MatchModal match={...} tournamentName="..." onClose={() => ...} />
 */

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Match, MatchPlayer, Player } from "@/lib/padel-api";
import { displaySurname } from "@/lib/player-utils";
import { useLiveScore } from "@/hooks/useLiveScore";
import StatusBadge from "./StatusBadge";
import IconButton from "@/components/IconButton";

interface MatchModalProps {
  match: Match;
  tournamentName?: string;
  onClose: () => void;
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M15 5L5 15M5 5l10 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PlayerAvatar({
  player,
  detail,
  size = 56,
}: {
  player: MatchPlayer;
  detail?: Player;
  size?: number;
}) {
  const initials =
    (player?.name ?? "")
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "—";
  const photo = detail?.photo_url;
  return (
    <div
      className="rounded-full overflow-hidden flex items-center justify-center shrink-0 bg-bg-gray border border-border-primary"
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
        <span className="font-display font-semibold text-text-secondary" style={{ fontSize: 14 }}>
          {initials}
        </span>
      )}
    </div>
  );
}

function isWin(a: string, b: string): boolean {
  const ai = parseInt(a, 10);
  const bi = parseInt(b, 10);
  if (Number.isNaN(ai) || Number.isNaN(bi)) return false;
  return ai > bi;
}

export default function MatchModal({ match, tournamentName, onClose }: MatchModalProps) {
  const [playerDetails, setPlayerDetails] = useState<Map<number, Player>>(new Map());
  const isLive = match.status === "live" && !match.winner;
  const { score: liveScore, currentPoint } = useLiveScore(
    match.id,
    isLive,
    match.score,
    match.status,
  );

  // ESC handler
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Fetch player details lazily
  useEffect(() => {
    const ids = [...match.players.team_1, ...match.players.team_2]
      .map((p) => p.id)
      .filter((id) => id && !Number.isNaN(id));
    if (ids.length === 0) return;
    let cancelled = false;
    Promise.allSettled(
      ids.map((id) =>
        fetch(`/api/players/${id}`).then((r) => (r.ok ? r.json() : null)).catch(() => null),
      ),
    ).then((results) => {
      if (cancelled) return;
      const map = new Map<number, Player>();
      results.forEach((r, i) => {
        if (r.status === "fulfilled" && r.value && !("error" in r.value)) {
          map.set(ids[i], r.value as Player);
        }
      });
      setPlayerDetails(map);
    });
    return () => {
      cancelled = true;
    };
  }, [match.id, match.players.team_1, match.players.team_2]);

  const score =
    liveScore?.filter((s) => {
      const a = (s.team_1 ?? "").toString().trim();
      const b = (s.team_2 ?? "").toString().trim();
      if (!a && !b) return false;
      if (a === "0" && b === "0") return false;
      return true;
    }) ?? null;

  const teams: Array<{
    players: MatchPlayer[];
    key: "team_1" | "team_2";
    isWinner: boolean;
  }> = [
    {
      players: match.players.team_1,
      key: "team_1",
      isWinner: match.winner === "team_1",
    },
    {
      players: match.players.team_2,
      key: "team_2",
      isWinner: match.winner === "team_2",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ backgroundColor: "rgba(24,29,39,0.55)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={[
          "bg-bg-white w-full max-h-[100dvh] sm:max-h-[90vh] overflow-y-auto",
          "sm:rounded-32 rounded-t-32",
          "sm:w-[600px] sm:h-[660px]",
          "flex flex-col",
          "border border-border-primary",
        ].join(" ")}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-12 px-24 pt-20 pb-12 border-b border-border-primary">
          <div className="min-w-0 flex-1">
            {tournamentName && (
              <p className="truncate font-sans text-12 font-semibold text-brand uppercase tracking-[0.06em]">
                {tournamentName}
              </p>
            )}
            <div className="flex items-center gap-12 mt-4 flex-wrap">
              <h2 className="font-display font-semibold text-text-primary uppercase text-24">
                {match.round_name}
              </h2>
              <StatusBadge
                status={match.status}
                currentPoint={isLive ? currentPoint : null}
                variant="default"
              />
            </div>
          </div>
          <IconButton
            variant="light"
            size="sm"
            icon={<CloseIcon />}
            label="Close"
            onClick={onClose}
          />
        </div>

        {/* Body */}
        <div className="flex-1 px-24 py-24 flex flex-col gap-24">
          {teams.map(({ players, key, isWinner }, idx) => {
            const isLoser = !!match.winner && !isWinner;
            return (
              <div key={key}>
                <div className="flex items-center gap-12">
                  <div className="flex -space-x-8 shrink-0">
                    {players.map((p) => (
                      <PlayerAvatar
                        key={p.id}
                        player={p}
                        detail={playerDetails.get(p.id)}
                        size={48}
                      />
                    ))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={[
                        "truncate font-sans text-16 leading-24",
                        isLoser ? "text-text-tertiary" : "text-text-primary",
                        isWinner ? "font-semibold" : "font-medium",
                      ].join(" ")}
                    >
                      {players.length > 0
                        ? players.map((p) => displaySurname(p.name)).join(" / ")
                        : "TBD"}
                    </p>
                    <div className="flex items-center gap-8 mt-4">
                      {players.map((p) => {
                        const detail = playerDetails.get(p.id);
                        if (!detail?.nationality) return null;
                        return (
                          <span
                            key={p.id}
                            className="inline-flex items-center font-sans text-12 font-semibold uppercase tracking-[0.06em] text-text-secondary rounded-4 bg-bg-gray px-8 py-4"
                          >
                            {detail.nationality.toUpperCase()}
                          </span>
                        );
                      })}
                      {isWinner && (
                        <span className="inline-flex items-center gap-4 font-sans text-12 font-semibold uppercase tracking-[0.06em] text-brand">
                          ✓ WON
                        </span>
                      )}
                    </div>
                  </div>
                  {score && score.length > 0 && (
                    <div className="flex items-center gap-12 shrink-0">
                      {score.map((s, i) => {
                        const myVal = key === "team_1" ? s.team_1 : s.team_2;
                        const oppVal = key === "team_1" ? s.team_2 : s.team_1;
                        const tb = myVal?.match?.(/^(\d+)\((\d+)\)$/);
                        return (
                          <span
                            key={i}
                            className={[
                              "font-display font-semibold tabular-nums text-center",
                              isWin(myVal, oppVal) ? "text-text-primary" : "text-text-tertiary",
                            ].join(" ")}
                            style={{ fontSize: 32, lineHeight: "32px", minWidth: 24 }}
                          >
                            {tb ? (
                              <>
                                {tb[1]}
                                <sup className="text-text-tertiary" style={{ fontSize: 14 }}>
                                  {tb[2]}
                                </sup>
                              </>
                            ) : (
                              myVal
                            )}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
                {idx === 0 && (
                  <div className="mt-24 border-t border-border-primary" aria-hidden />
                )}
              </div>
            );
          })}

          {isLive && currentPoint && (
            <div className="mt-12 flex items-center justify-center">
              <span className="inline-flex items-center gap-8 font-display font-semibold text-text-contrast bg-brand rounded-full px-16 py-8 text-16 tabular-nums">
                <span className="live-dot inline-block rounded-full bg-text-contrast" style={{ width: 8, height: 8 }} />
                {currentPoint}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border-primary px-24 py-16 flex items-center gap-12 flex-wrap font-sans text-12 font-semibold uppercase tracking-[0.06em] text-text-secondary">
          <span className="inline-flex items-center rounded-4 bg-bg-gray text-text-primary px-8 py-4">
            {match.category}
          </span>
          {match.schedule_label ? (
            <span className="text-brand">{match.schedule_label}</span>
          ) : (
            match.played_at && (
              <span>
                {new Date(match.played_at).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )
          )}
          {match.duration && <span>· {match.duration}</span>}
          {match.court && <span>· {match.court}</span>}
        </div>
      </div>
    </div>
  );
}
